import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Navbar, Footer } from '@/components';
import { Upload, CheckCircle, ChevronLeft, Info, Clock, CheckCircle2, Headphones, AlertCircle, Send, X, FileText, Loader2 } from 'lucide-react';
import { masterDataAPI, uploadAPI, orderAPI } from '@/services/api';
import bcaLogo from '@/assets/bca.png';
import protectedIcon from '@/assets/protected.svg';

const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // State for file upload
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  
  // State for submitting
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Master data to display details correctly
  const [boxModels, setBoxModels] = useState([]);
  const [materialsData, setMaterialsData] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);

  const orderData = location.state?.orderData;
  const orderId = location.state?.orderId; // Received from CustomOrderPage
  const totalAmount = orderData?.pricingData?.totalBayar || 0;
  const dpAmount = totalAmount * 0.6; // 60% DP

  useEffect(() => {
    if (!orderData) {
      navigate('/custom-order');
      return;
    }

    const fetchMasterData = async () => {
      try {
        const [modelsRes, materialsRes, banksRes] = await Promise.all([
          masterDataAPI.getBoxModels(),
          masterDataAPI.getMaterials(),
          masterDataAPI.getBankAccounts()
        ]);

        if (modelsRes.success) {
          setBoxModels(modelsRes.data.map(m => ({ id: m.code, name: m.name, image: m.imageUrl })));
        }
        if (materialsRes.success) {
          setMaterialsData(materialsRes.data.map(m => ({ id: m.code, name: m.name })));
        }
        if (banksRes.success) {
          setBankAccounts(banksRes.data);
        }
      } catch (err) {
        console.error('Failed to fetch master data', err);
      }
    };
    fetchMasterData();
  }, [orderData, navigate]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleFileChange = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Ukuran file melebihi batas 5MB');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      setUploadError('Format file tidak didukung. Gunakan JPG, PNG, atau PDF');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    try {
      // Assuming uploadAPI.uploadDesign works for payment receipts too, or a specific endpoint
      const response = await uploadAPI.uploadDesign(file);
      if (response.success) {
        setUploadedFile({
          name: response.data.originalName || file.name,
          size: response.data.size || file.size,
          url: response.data.url,
          publicId: response.data.publicId,
          format: response.data.format
        });
      } else {
        setUploadError(response.message || 'Gagal mengunggah file. Silakan coba lagi.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setUploadError('Terjadi kesalahan koneksi saat mengunggah file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleFileChange(file);
    }
  };

  const handleRemoveFile = async () => {
    if (!uploadedFile) return;

    setIsUploading(true);
    setUploadError(null);

    try {
      if (uploadedFile.publicId) {
        await uploadAPI.deleteFile(uploadedFile.publicId);
      }
      setUploadedFile(null);
    } catch (err) {
      console.error('Delete error:', err);
      setUploadedFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!uploadedFile) return;

    setIsSubmitting(true);
    setUploadError(null);
    
    try {
      const paymentData = {
        paymentMethod: 'BANK_TRANSFER',
        paymentProofUrl: uploadedFile.url,
        paymentProofPublicId: uploadedFile.publicId,
        paymentProofName: uploadedFile.name,
      };

      let response;
      if (orderId) {
        // Order is already created, just submit payment proof
        response = await orderAPI.submitPaymentProof(orderId, paymentData);
      } else {
        // Fallback if somehow orderId is missing
        const payload = {
          orderData,
          paymentData
        };
        response = await orderAPI.submitOrderWithPayment(payload);
      }
      
      if (response.success) {
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/profile', { state: { newOrder: true, orderData: response.data } });
        }, 3000);
      } else {
        setUploadError(response.message || 'Gagal mengirim pesanan');
      }
    } catch (err) {
      console.error('Submit order error:', err);
      setUploadError(err.response?.data?.message || 'Terjadi kesalahan saat memproses pesanan. Pastikan Anda sudah login.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!orderData) return null;

  // Retrieve details
  const selectedModelData = boxModels.find(m => m.id === orderData.selectedModel);
  const modelName = selectedModelData?.name || '-';
  const modelImage = selectedModelData?.image || '';

  const selectedMaterialData = materialsData.find(m => m.id === orderData.selectedMaterial);
  const materialName = selectedMaterialData?.name || '-';

  const sizes = orderData.sizes || {};
  const sizeString = orderData.selectedModel === 'top-bottom-box'
    ? `${sizes.panjang || 0} x ${sizes.lebar || 0} x ${sizes.tinggi || 0} cm – Tutup : ${sizes.tinggiTutup || 0} cm`
    : orderData.selectedModel === 'earlock-box-samping'
      ? `${sizes.panjang || 0} x ${sizes.lebar || 0} x ${sizes.tinggi || 0} cm – Lidah : ${sizes.lidah || 0} cm`
      : `${sizes.panjang || 0} x ${sizes.lebar || 0} x ${sizes.tinggi || 0} cm`;

  const qtyFormatted = orderData.quantity ? `${Number(orderData.quantity).toLocaleString('id-ID')} pcs` : '-';

  const isImage = uploadedFile && (
    ['jpg', 'jpeg', 'png'].includes(uploadedFile.format?.toLowerCase()) ||
    /\.(jpg|jpeg|png)$/i.test(uploadedFile.name)
  );

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar />

      <main className="flex-1 px-6 md:px-10 lg:px-16 py-8 md:py-12">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-1">Pembayaran</h1>
              <p className="text-[#8fc74a] font-medium">Selesaikan pembayaran untuk menyelesaikan pesanan Anda.</p>
            </div>
            <Link to="/custom-order" className="flex items-center gap-2 md:gap-3 pl-6 md:pl-8 pr-0 h-[28px] md:h-[34px] rounded-full bg-color-secondary text-white font-semibold text-xs md:text-sm hover:scale-105 transition-all duration-300 shadow-sm hover:shadow-md self-start md:self-auto w-fit">
              <span>Kembali Review Orderan</span>
              <div className="w-[28px] h-[28px] md:w-[34px] md:h-[34px] rounded-full bg-white border-2 border-color-secondary flex items-center justify-center flex-shrink-0">
                <ChevronLeft size={14} className="md:w-4 md:h-4 text-color-secondary" />
              </div>
            </Link>
          </div>

          {isSuccess ? (
            <div className="bg-white rounded-2xl p-10 text-center shadow-lg border border-gray-100 flex flex-col items-center animate-in fade-in zoom-in duration-500">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                <CheckCircle size={40} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Pembayaran DP Berhasil Disubmit!</h2>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                Terima kasih, bukti pembayaran DP Anda sedang kami verifikasi. Anda akan dialihkan ke halaman Profile untuk melacak pesanan.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Side: Payment Steps (7 columns) */}
              <div className="lg:col-span-7 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
                <div className="space-y-10">
                  {/* Step 1: Transfer */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">1. Lakukan Transfer ke Rekening Perusahaan</h3>
                    <p className="text-gray-400 text-sm mb-4">Silahkan transfer sesuai nominal DP 60% ke rekening dibawah ini!</p>
                    
                    <div className="space-y-4 mb-4">
                      {bankAccounts.length > 0 ? (
                        bankAccounts.map((bank) => (
                          <div key={bank.id} className="border border-gray-200 rounded-xl p-6 flex flex-col sm:flex-row items-center gap-6">
                            <div className="w-32 flex-shrink-0 flex items-center justify-center border-r border-gray-100 pr-4">
                              {bank.imageUrl ? (
                                <img src={bank.imageUrl} alt={bank.bankName} className="max-w-full h-auto max-h-16 object-contain" />
                              ) : bank.bankName.toLowerCase().includes('bca') ? (
                                <img src={bcaLogo} alt="BCA" className="max-w-full h-auto max-h-16 object-contain" />
                              ) : (
                                <span className="font-bold text-gray-500 text-center">{bank.bankName}</span>
                              )}
                            </div>
                            <div className="flex-1 text-center sm:text-left">
                              <p className="font-bold text-gray-800 text-lg mb-1">{bank.bankName}</p>
                              <p className="text-gray-500 text-xs mb-0.5">Nomor Rekening</p>
                              <p className="text-2xl font-bold text-gray-900 mb-1">{bank.accountNumber}</p>
                              <p className="text-gray-500 text-sm">a.n. {bank.accountHolderName}</p>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="border border-gray-200 rounded-xl p-6 flex items-center justify-center text-gray-500">
                          <Loader2 size={24} className="animate-spin mr-2" />
                          Memuat data rekening...
                        </div>
                      )}
                    </div>

                    <div className="bg-[#f6faf0] rounded-xl p-4 flex gap-3 text-[#7fb03f] items-start border border-[#e5f2d6]">
                      <Info size={20} className="flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium">Pastikan nominal transfer sesuai dengan total pembayaran.<br/>Pesanan akan diproses setelah pembayaran kami terima.</p>
                    </div>
                  </div>

                  {/* Step 2: Upload */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">2. Upload Bukti Transfer Pembayaran</h3>
                    <p className="text-gray-400 text-sm mb-4">Upload bukti transfer yang sudah anda lakukan</p>

                    <div className="mb-4">
                      <div
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                          isDragging
                            ? 'border-[#8fc74a] bg-[#f6faf0]'
                            : 'border-[#c6e3a3] bg-white'
                        } ${uploadedFile || isUploading ? 'p-6' : 'p-10'}`}
                      >
                        {isUploading ? (
                          <div className="flex flex-col items-center justify-center text-center py-4">
                            <Loader2 size={36} className="text-[#8fc74a] animate-spin mb-3" />
                            <p className="text-gray-900 font-semibold">Sedang mengunggah...</p>
                          </div>
                        ) : !uploadedFile ? (
                          <div className="flex flex-col items-center justify-center text-center">
                            <div className="mb-4 text-[#8fc74a]">
                              <Upload size={48} />
                            </div>
                            <p className="text-gray-800 text-sm font-bold mb-3">
                              Klik untuk upload atau drag & drop file di sini<br/>
                              <span className="font-normal text-xs text-gray-500">Format: JPG, PNG, PDF (Max. 5 MB)</span>
                            </p>
                            <label className="cursor-pointer">
                              <span className="bg-[#5c9833] hover:bg-[#4d822a] text-white px-8 py-2.5 rounded-lg font-semibold transition-colors">
                                Kirim File
                              </span>
                              <input
                                type="file"
                                className="hidden"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={handleFileInputChange}
                                disabled={isUploading}
                              />
                            </label>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                                {isImage && uploadedFile.url ? (
                                  <img src={uploadedFile.url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <FileText size={28} className="text-[#8fc74a]" />
                                )}
                              </div>
                              <div>
                                <p className="font-semibold text-gray-900 truncate max-w-[200px] md:max-w-xs">{uploadedFile.name}</p>
                                <p className="text-sm text-gray-500">
                                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={handleRemoveFile}
                              disabled={isUploading}
                              className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors duration-300"
                            >
                              <X size={18} className="text-red-500" />
                            </button>
                          </div>
                        )}
                      </div>

                      {uploadError && (
                        <div className="mt-3 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center gap-2 text-sm">
                          <AlertCircle size={18} className="flex-shrink-0" />
                          <div className="flex-1">{uploadError}</div>
                          <button onClick={() => setUploadError(null)} className="text-red-500 font-semibold text-xs">
                            Tutup
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Step 3: Submit */}
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-1">3. Kirim Bukti Transfer</h3>
                    <p className="text-gray-400 text-sm mb-4">Setelah upload, klik tombol kirim untuk konfirmasi pembayaran.</p>
                    
                    <button
                      onClick={handleSubmit}
                      disabled={!uploadedFile || isSubmitting}
                      className="w-full py-4 bg-[#5c9833] hover:bg-[#4d822a] text-white rounded-xl font-bold text-lg transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 size={24} className="animate-spin" />
                          <span>Memproses...</span>
                        </>
                      ) : (
                        <>
                          <Send size={20} className="-rotate-45 mb-1" />
                          <span>Kirim Bukti Transfer</span>
                        </>
                      )}
                    </button>
                    <div className="mt-4 flex items-center justify-center gap-2 text-gray-400 text-xs">
                      <img src={protectedIcon} alt="Secure" className="w-4 h-4 opacity-50" />
                      <span>Data anda aman dan tidak akan dibagikan ke pihak lain.</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Side: Order Summary & Info (5 columns) */}
              <div className="lg:col-span-5 space-y-6">
                {/* Ringkasan Pesanan Card */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
                  <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                    <h3 className="text-xl font-bold text-gray-900">Ringkasan Pesanan</h3>
                    <span className="text-[#8fc74a] font-bold text-sm tracking-wide">#{orderId || 'BARU'}</span>
                  </div>

                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-24 h-24 bg-gray-50 rounded-lg flex items-center justify-center flex-shrink-0 p-2">
                      {modelImage ? (
                         <img src={modelImage} alt={modelName} className="w-full h-full object-contain mix-blend-multiply" />
                      ) : (
                         <div className="text-gray-300"><FileText size={40}/></div>
                      )}
                    </div>
                    <div className="flex-1 text-right">
                      <h4 className="font-bold text-gray-800 mb-1">{modelName}</h4>
                      <p className="text-sm text-gray-600 mb-1">{sizeString}</p>
                      <p className="text-sm text-gray-600 mb-1">{materialName} {orderData.selectedThickness ? `${orderData.selectedThickness} gsm` : ''}</p>
                      <p className="text-sm font-semibold text-gray-800">{qtyFormatted}</p>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <span>Harga per pcs</span>
                      <span className="font-bold text-gray-800">{formatRupiah(orderData.pricingData?.hargaPerPcs)}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-500 text-sm">
                      <span>Total Bayar</span>
                      <span className="font-bold text-gray-800">{formatRupiah(totalAmount)}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="font-bold text-gray-900">Bayar DP 60%</span>
                    <span className="text-2xl font-bold text-[#8fc74a]">{formatRupiah(dpAmount)}</span>
                  </div>
                </div>

                {/* Info Card */}
                <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.06)] border border-gray-100 p-6 md:p-8">
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="text-[#8fc74a] mt-1">
                        <Clock size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Batas Waktu Pembayaran</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Silahkan lakukan pembayaran maksimal <strong>1 x 24 jam</strong><br/>sejak pemesanan.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-[#8fc74a] mt-1">
                        <CheckCircle2 size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Konfirmasi Pembayaran</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Pesanan akan diproses setelah bukti transfer<br/>kami terima dan konfirmasi.</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="text-[#8fc74a] mt-1">
                        <Headphones size={24} />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900 mb-1">Butuh Bantuan ?</h4>
                        <p className="text-xs text-gray-500 leading-relaxed">Hubungi kami jika ada kendala saat pembayaran.</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <a href="https://wa.me/6281212949135" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 bg-[#f6faf0] hover:bg-[#eaf5dd] transition-colors rounded-xl p-4 border border-[#e5f2d6] w-full">
                      <div className="w-10 h-10 bg-[#25d366] rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-[#5c9833] font-bold">Chat via Whatsapp</p>
                        <p className="text-lg font-bold text-gray-800">0812-1294-9135</p>
                      </div>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PaymentPage;
