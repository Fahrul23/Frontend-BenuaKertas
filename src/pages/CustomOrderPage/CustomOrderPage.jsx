import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Navbar, Footer, Stepper, ErrorModal } from '@/components';
import { getVisibleSteps, NEXT_BUTTON_TEXT } from './constants';
import { calculatorAPI, masterDataAPI, orderAPI } from '@/services/api';
import ModelStep from './components/ModelStep';
import SizeStep from './components/SizeStep';
import MaterialStep from './components/MaterialStep';
import ColorStep from './components/ColorStep';
import FinishingStep from './components/FinishingStep';
import UploadStep from './components/UploadStep';
import QuantityStep from './components/QuantityStep';
import ReviewStep from './components/ReviewStep';

const CustomOrderPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { token } = useSelector((state) => state.auth);
  const [currentStep, setCurrentStep] = useState(1);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedModel, setSelectedModel] = useState(null);
  const [sizes, setSizes] = useState({
    panjang: '',
    lebar: '',
    tinggi: '',
    tinggiTutup: '',
    lidah: '',
  });
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [selectedThickness, setSelectedThickness] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [laminationSide, setLaminationSide] = useState(null);
  const [laminationType, setLaminationType] = useState('');
  const [selectedFinishing, setSelectedFinishing] = useState('');
  const [quantity, setQuantity] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [note, setNote] = useState('');

  // Error Modal State
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // ============ PRICING ENGINE STATE ============
  const [pricingData, setPricingData] = useState({
    paperWidth: null,
    paperHeight: null,
    planoType: null,
    planoWidth: null,
    planoHeight: null,
    jumlahMata: null,
    planoOrientation: null,
    hargaMaterial: null,
    hargaWarna: null,
    hargaLaminasi: null,
    subtotalPerUnit: null,
    markup: 85,
    totalPrice: null,
  });
  const [pricingError, setPricingError] = useState(null);

  const [boxData, setBoxData] = useState({
    title: 'CUSTOM BOX',
    description: 'Atur spesifikasi custom box sesuai kebutuhan, perhatikan setiap langkah di setiap bagiannya terisi sesuai dengan instruksi',
    models: [] // Will be populated from API
  });

  // Materials from API
  const [materialsData, setMaterialsData] = useState([]);
  // Thickness options per selected material (from API)
  const [thicknessOptions, setThicknessOptions] = useState([]);

  // Finishing options from API
  const [laminationSideOptions, setLaminationSideOptions] = useState([]);
  const [laminationTypeOptions, setLaminationTypeOptions] = useState([]);

  // Restore order data from location.state if redirected back from login/register
  useEffect(() => {
    if (location.state?.orderData) {
      const {
        selectedModel: m,
        sizes: s,
        selectedMaterial: mat,
        selectedThickness: thick,
        selectedColor: col,
        laminationSide: lSide,
        laminationType: lType,
        quantity: q,
        pricingData: p,
        note: n,
        designFile: d
      } = location.state.orderData;

      if (m) setSelectedModel(m);
      if (s) setSizes(s);
      if (mat) setSelectedMaterial(mat);
      if (thick) setSelectedThickness(thick);
      if (col) setSelectedColor(col);
      if (lSide) setLaminationSide(lSide);
      if (lType) setLaminationType(lType);
      if (q) setQuantity(q);
      if (p) setPricingData(p);
      if (n) setNote(n);
      if (d) setUploadedFile(d);
      
      setCurrentStep(8);
      
      // Clear location state after restoring to avoid infinite loop on reload
      navigate(location.pathname, { replace: true, state: {} });
    } else if (location.state?.preSelectedModel) {
      setSelectedModel(location.state.preSelectedModel);
      setCurrentStep(2);
      // Clear location state
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.state, navigate, location.pathname]);

  // Fetch Box Models from API
  useEffect(() => {
    const fetchModels = async () => {
      try {
        const res = await masterDataAPI.getBoxModels();
        if (res.success && res.data.length > 0) {
          const apiModels = res.data.map(m => {
            return {
              id: m.code,
              name: m.name,
              image: m.imageUrl
            };
          });
          setBoxData(prev => ({ ...prev, models: apiModels }));
        } else {
          // If API is empty, set models to empty array
          setBoxData(prev => ({ ...prev, models: [] }));
        }
      } catch (err) {
        console.error('Failed to fetch models from API', err);
        // On error, set models to empty array
        setBoxData(prev => ({ ...prev, models: [] }));
      }
    };
    fetchModels();
  }, []);

  // Fetch Materials from API
  useEffect(() => {
    const fetchMaterials = async () => {
      try {
        const res = await masterDataAPI.getMaterials();
        if (res.success && res.data.length > 0) {
          const apiMaterials = res.data.map(m => ({
            id: m.code,
            name: m.name,
            image: m.imageUrl
          }));
          setMaterialsData(apiMaterials);
        }
      } catch (err) {
        console.error('Failed to fetch materials from API', err);
      }
    };
    fetchMaterials();
  }, []);

  // Fetch Finishing Options from API
  useEffect(() => {
    const fetchFinishingOptions = async () => {
      try {
        const res = await masterDataAPI.getFinishingOptions();
        if (res.success && res.data.length > 0) {
          const sideOpts = res.data
            .filter(opt => opt.category === 'side')
            .map(opt => ({ id: opt.code, name: opt.name, image: opt.imageUrl }));
          const typeOpts = res.data
            .filter(opt => opt.category === 'type')
            .map(opt => ({ id: opt.code, name: opt.name, image: opt.imageUrl }));
          
          setLaminationSideOptions(sideOpts);
          setLaminationTypeOptions(typeOpts);
        }
      } catch (err) {
        console.error('Failed to fetch finishing options from API', err);
      }
    };
    fetchFinishingOptions();
  }, []);

  // ============ AUTO PRICE CALCULATION ============
  const calculatePricing = useCallback(async () => {
    // Need at minimum: boxModel + sizes to start calculating
    if (!selectedModel || !sizes.panjang || !sizes.lebar || !sizes.tinggi) {
      return;
    }
    if (selectedModel === 'top-bottom-box' && !sizes.tinggiTutup) return;
    if (selectedModel === 'earlock-box-samping' && !sizes.lidah) return;

    try {
      setPricingError(null);
      const requestData = {
        boxModel: selectedModel,
        panjang: parseFloat(sizes.panjang),
        lebar: parseFloat(sizes.lebar),
        tinggi: parseFloat(sizes.tinggi),
      };

      // Optional extras
      if (sizes.tinggiTutup) requestData.tinggiTutup = parseFloat(sizes.tinggiTutup);
      if (sizes.lidah) requestData.lidah = parseFloat(sizes.lidah);
      if (selectedMaterial) requestData.material = selectedMaterial;
      if (selectedThickness) requestData.materialThickness = parseInt(selectedThickness);
      if (selectedColor) requestData.colorOption = selectedColor;
      if (laminationSide) requestData.laminationSide = laminationSide;
      if (laminationType) requestData.laminationType = laminationType;
      if (selectedFinishing) requestData.finishing = selectedFinishing;
      if (quantity) requestData.quantity = parseInt(quantity);

      const result = await calculatorAPI.calculatePrice(requestData);

      if (result.success) {
        setPricingData(prev => ({
          ...prev,
          ...result.data,
        }));
      } else {
        setPricingError(result.message);
      }
    } catch (err) {
      setPricingError(err.message);
    }
  }, [selectedModel, sizes, selectedMaterial, selectedThickness, selectedColor, laminationSide, laminationType, selectedFinishing, quantity]);

  // Recalculate pricing when relevant data changes
  useEffect(() => {
    // Only calculate after step 2 (sizes) at minimum
    if (selectedModel && sizes.panjang && sizes.lebar && sizes.tinggi) {
      const timer = setTimeout(() => {
        calculatePricing();
      }, 300); // debounce
      return () => clearTimeout(timer);
    }
  }, [calculatePricing]);

  // Reset thickness when material changes (because GSM options differ)
  const handleMaterialSelect = async (materialId) => {
    setSelectedMaterial(materialId);
    setSelectedThickness(null); // reset thickness
    // Fetch thickness options for this material from API
    try {
      const res = await masterDataAPI.getThicknessByMaterialCode(materialId);
      if (res.success && res.data.length > 0) {
        setThicknessOptions(res.data.map(t => ({ label: `${t} gsm`, value: String(t) })));
      } else {
        setThicknessOptions([]);
      }
    } catch (err) {
      console.error('Failed to fetch thickness options', err);
      setThicknessOptions([]);
    }
  };

  const handleNext = async () => {
    if (isEditMode) {
      setCurrentStep(8);
      setIsEditMode(false);
    } else {
      if (currentStep < 8) {
        setCurrentStep(currentStep + 1);
      } else if (currentStep === 8) {
        const orderData = {
          boxModel: selectedModel,
          sizes,
          material: selectedMaterial,
          materialThickness: parseInt(selectedThickness),
          colorSides: selectedColor,
          laminationSide: laminationSide,
          laminationType: laminationType,
          finishing: selectedFinishing,
          quantity: parseInt(quantity),
          designFile: uploadedFile,
          note: note
        };
        
        if (!token) {
          navigate('/login', { 
            state: { 
              from: '/custom-order', 
              orderData,
              requireLoginForPayment: true
            } 
          });
        } else {
          try {
            // Create order first
            const result = await orderAPI.createOrder(orderData);
            if (result.success) {
              // Merge totalBayar dari backend ke pricingData agar PaymentPage bisa menampilkan harga yang benar
              const updatedOrderData = {
                ...orderData,
                pricingData: {
                  ...orderData.pricingData,
                  totalBayar: result.data.totalBayar || orderData.pricingData?.totalBayar || 0,
                  hargaPerPcs: result.data.hargaPerPcs || orderData.pricingData?.hargaPerPcs || 0,
                  totalAmount: result.data.totalAmount || result.data.totalBayar || 0,
                }
              };
              navigate('/payment', { state: { orderData: updatedOrderData, orderId: result.data.id } });
            } else {
              setErrorMessage(result.message || 'Gagal membuat pesanan');
              setIsErrorModalOpen(true);
            }
          } catch (error) {
            console.error('Create order error:', error);
            setErrorMessage(error.response?.data?.message || error.message || 'Terjadi kesalahan saat membuat pesanan');
            setIsErrorModalOpen(true);
          }
        }
      }
    }
  };

  const handlePrev = () => {
    if (isEditMode) {
      setCurrentStep(8);
      setIsEditMode(false);
    } else {
      if (currentStep > 1) {
        setCurrentStep(currentStep - 1);
      }
    }
  };

  const handleEditStep = (step) => {
    setIsEditMode(true);
    setCurrentStep(step);
  };

  const handleEditAll = () => {
    setIsEditMode(false);
    setCurrentStep(1);
  };

  const handleSizeChange = (field, value) => {
    setSizes(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Check if current step is valid to proceed
  const isStepValid = () => {
    if (currentStep === 1) {
      return selectedModel !== null;
    }
    if (currentStep === 2) {
      const p = parseFloat(sizes.panjang) || 0;
      const l = parseFloat(sizes.lebar) || 0;
      const t = parseFloat(sizes.tinggi) || 0;
      let basicSizesValid = p > 0 && l > 0 && t > 0;
      
      if (selectedModel === 'top-bottom-box') {
        const tt = parseFloat(sizes.tinggiTutup) || 0;
        basicSizesValid = basicSizesValid && tt > 0;
      }
      
      if (selectedModel === 'earlock-box-samping') {
        const lidah = parseFloat(sizes.lidah) || 0;
        basicSizesValid = basicSizesValid && lidah > 0;
      }
      
      return basicSizesValid && !pricingError;
    }
    if (currentStep === 3) {
      return selectedMaterial !== null && selectedThickness !== null;
    }
    if (currentStep === 4) {
      return selectedColor !== null;
    }
    if (currentStep === 5) {
      if (!laminationSide) return false;
      if (laminationSide !== 'tanpa-laminasi' && !laminationType) return false;
      return true;
    }
    if (currentStep === 6) {
      return uploadedFile !== null;
    }
    if (currentStep === 7) {
      return quantity !== '' && parseInt(quantity) >= 1;
    }
    return true;
  };

  return (
    <div className="min-h-screen flex flex-col bg-color-white">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-12">
        {/* Stepper */}
        <div className="w-full max-w-7xl mx-auto mb-8">
          <Stepper steps={getVisibleSteps(currentStep)} currentStep={currentStep} />
        </div>

        {/* Navigation Buttons - Below Stepper, Floating Right */}
        <div className="w-full max-w-7xl mx-auto mb-12">
          <div className="flex items-center justify-end gap-4">
            {/* Back Button - Circle */}
            <button
              onClick={handlePrev}
              disabled={currentStep === 1}
              className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full border-2 border-color-secondary flex items-center justify-center text-color-secondary hover:bg-color-secondary hover:text-white hover:scale-110 transition-all duration-300 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-color-secondary disabled:hover:scale-100 flex-shrink-0"
            >
              <ChevronLeft size={16} className="md:w-5 md:h-5" />
            </button>

            {/* Next Button - Rounded Rectangle */}
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="flex items-center gap-2 md:gap-3 pl-6 md:pl-8 pr-0 h-[28px] md:h-[34px] rounded-full bg-color-secondary text-white font-semibold text-xs md:text-sm hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-sm hover:shadow-md"
            >
              <span>{isEditMode ? 'Update' : NEXT_BUTTON_TEXT[currentStep]}</span>
              <div className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full bg-white border-2 border-color-secondary flex items-center justify-center flex-shrink-0">
                <ChevronRight size={14} className="md:w-4 md:h-4 text-color-secondary" />
              </div>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="max-w-6xl mx-auto">
          {currentStep === 8 ? (
            /* ── Step 8: Review — full-width layout ── */
            <ReviewStep
              selectedModel={selectedModel}
              sizes={sizes}
              selectedMaterial={selectedMaterial}
              selectedThickness={selectedThickness}
              selectedColor={selectedColor}
              laminationSide={laminationSide}
              laminationType={laminationType}
              selectedFinishing={selectedFinishing}
              uploadedFile={uploadedFile}
              quantity={quantity}
              boxData={boxData}
              pricingData={pricingData}
              onEditStep={handleEditStep}
              onEditAll={handleEditAll}
              onNext={handleNext}
            />
          ) : (
            /* ── Steps 1-7: standard two-panel layout ── */
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
              {/* Left Side - Info (2 columns = 40%) */}
              <div className="lg:col-span-2">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  <span className="text-color-secondary">
                    {currentStep > 1 && selectedModel 
                      ? boxData.models.find(m => m.id === selectedModel)?.name.toUpperCase() 
                      : boxData.title}
                  </span>
                </h1>
                <div className="border-l-4 border-color-secondary pl-4 py-2 my-6">
                  <p className="text-color-gray text-sm leading-relaxed">
                    {boxData.description}
                  </p>
                </div>

                {/* WhatsApp Consultation Box */}
                <div className="bg-color-secondary rounded-xl p-6 mt-6">
                  <p className="text-white text-sm mb-4">
                    Jika masih ada yang ingin ditanyakan seputar custom packaging Box ini bisa langsung hubungi kami via whatsapp
                  </p>
                  <a 
                    href="https://wa.me/6281212949135" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block bg-white hover:bg-gray-50 text-color-primary font-semibold px-6 py-3 rounded-lg transition-colors duration-300"
                  >
                    Konsultasikan sekarang
                  </a>
                </div>
              </div>

              {/* Right Side - Step Content (3 columns = 60%) */}
              <div className="lg:col-span-3">
                {/* Step 1: Model Selection */}
                {currentStep === 1 && (
                  <ModelStep
                    models={boxData.models}
                    selectedModel={selectedModel}
                    onModelSelect={setSelectedModel}
                  />
                )}

                {/* Step 2: Size Input */}
                {currentStep === 2 && (
                  <SizeStep
                    sizes={sizes}
                    onSizeChange={handleSizeChange}
                    selectedModel={selectedModel}
                    planoInfo={pricingData}
                    pricingError={pricingError}
                  />
                )}

                {/* Step 3: Material Selection */}
                {currentStep === 3 && (
                  <MaterialStep
                    materials={materialsData}
                    selectedMaterial={selectedMaterial}
                    selectedThickness={selectedThickness}
                    thicknessOptions={thicknessOptions}
                    onMaterialSelect={handleMaterialSelect}
                    onThicknessSelect={setSelectedThickness}
                  />
                )}

                {/* Step 4: Color Selection */}
                {currentStep === 4 && (
                  <ColorStep
                    selectedColor={selectedColor}
                    onColorSelect={setSelectedColor}
                  />
                )}

                {/* Step 5: Finishing Selection */}
                {currentStep === 5 && (
                  <FinishingStep
                    laminationSide={laminationSide}
                    laminationType={laminationType}
                    sideOptions={laminationSideOptions}
                    typeOptions={laminationTypeOptions}
                    onSideSelect={setLaminationSide}
                    onTypeSelect={setLaminationType}
                    selectedFinishing={selectedFinishing}
                    onFinishingChange={setSelectedFinishing}
                  />
                )}

                {/* Step 6: Upload File */}
                {currentStep === 6 && (
                  <UploadStep
                    uploadedFile={uploadedFile}
                    note={note}
                    onFileUpload={setUploadedFile}
                    onNoteChange={setNote}
                  />
                )}

                {/* Step 7: Quantity Selection */}
                {currentStep === 7 && (
                  <QuantityStep
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        title="Gagal Membuat Pesanan!"
        message={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default CustomOrderPage;
