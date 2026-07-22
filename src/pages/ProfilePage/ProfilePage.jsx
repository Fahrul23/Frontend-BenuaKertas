import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { Navbar, Footer } from '@/components';
import { 
  Package, CheckCircle, CreditCard, Upload, 
  User, ShoppingBag, LogOut, Calendar, Box, 
  Droplets, Layers, FileText, ChevronDown, X, Truck
} from 'lucide-react';
import { orderAPI, uploadAPI } from '@/services/api';

const formatRupiah = (amount) => {
  if (!amount && amount !== 0) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
};

const OrderProgress = ({ currentStatus }) => {
  const steps = [
    { id: 'PENDING', label: 'Pesanan Masuk' },
    { id: 'IN_PRODUCTION', label: 'Proses Produksi' },
    { id: 'READY_TO_SHIP', label: 'Pelunasan 40%' },
    { id: 'SHIPPED', label: 'Dalam Pengiriman' },
    { id: 'COMPLETED', label: 'Selesai' }
  ];

  let currentIndex = 0;
  if (currentStatus === 'IN_PRODUCTION') currentIndex = 1;
  else if (currentStatus === 'READY_TO_SHIP') currentIndex = 2;
  else if (currentStatus === 'SHIPPED') currentIndex = 3;
  else if (currentStatus === 'COMPLETED') currentIndex = 5;

  return (
    <div className="flex flex-col relative py-2 w-full">
      {steps.map((step, index) => {
        const isCompleted = index < currentIndex;
        const isCurrent = index === currentIndex;
        const isLast = index === steps.length - 1;

        return (
          <div key={step.id} className="flex relative items-start group min-h-[48px]">
            {/* Connecting Line */}
            {!isLast && (
              <div 
                className={`absolute left-[11px] top-6 bottom-0 w-[2px] ${
                  isCompleted ? 'bg-green-700' : 'bg-gray-200'
                }`}
                style={{ height: 'calc(100% - 12px)' }}
              />
            )}
            
            {/* Step Circle */}
            <div className="relative flex flex-col items-center justify-center">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center border-2 z-10 ${
                isCompleted 
                  ? 'border-green-700 bg-green-700 text-white' 
                  : isCurrent
                    ? 'border-green-700 bg-white text-green-700'
                    : 'border-gray-200 bg-white text-gray-300'
              }`}>
                {isCompleted ? (
                  <span className="text-[10px] font-bold">✓</span>
                ) : (
                  <span className="text-[10px] font-semibold">{index + 1}</span>
                )}
              </div>
            </div>
            
            {/* Step Label */}
            <div className={`ml-3 mt-0.5 text-xs whitespace-nowrap ${isCompleted || isCurrent ? 'text-gray-800 font-medium' : 'text-gray-400'}`}>
              {step.label}
            </div>
          </div>
        );
      })}
    </div>
  );
};

const ProfilePage = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [boxModels, setBoxModels] = useState([]);
  const [bankAccounts, setBankAccounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderToComplete, setOrderToComplete] = useState(null);
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchOrdersAndModels();
  }, []);

  const fetchOrdersAndModels = async () => {
    try {
      setIsLoading(true);
      const [orderRes, modelRes, bankRes] = await Promise.all([
        orderAPI.getUserOrders({ limit: 50 }),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/master-data/box-models`).then(res => res.json()),
        fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1'}/master-data/bank-accounts`).then(res => res.json())
      ]);

      if (orderRes.success) {
        setOrders(orderRes.data);
      }
      if (modelRes.success) {
        setBoxModels(modelRes.data);
      }
      if (bankRes.success) {
        setBankAccounts(bankRes.data);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const response = await orderAPI.getUserOrders({ limit: 50 });
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const handleOpenPaymentModal = (order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
    setUploadedFile(null);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran file melebihi batas maksimal 5MB. Silakan pilih file yang lebih kecil.');
      e.target.value = ''; // reset input
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Format file tidak didukung. Gunakan JPG, PNG, atau PDF.');
      e.target.value = ''; // reset input
      return;
    }

    setUploadedFile(file);
  };

  const submitFinalPayment = async (e) => {
    e.preventDefault();
    if (!uploadedFile || !selectedOrder) return;

    setIsSubmitting(true);
    try {
      const uploadRes = await uploadAPI.uploadPayment(uploadedFile);
      if (!uploadRes.success) throw new Error(uploadRes.message || 'Gagal mengunggah bukti pembayaran');

      const bank = bankAccounts.length > 0 ? bankAccounts.filter(b => b.isActive !== false)[0] : { bankName: 'Bank BCA', accountNumber: '1234 5678 90', accountHolderName: 'PT Benua Kertas Indonesia' };
      
      const paymentData = {
        amount: selectedOrder.paymentAmount,
        bankName: bank.bankName,
        accountNumber: bank.accountNumber,
        accountHolderName: bank.accountHolderName,
        paymentProofUrl: uploadRes.data.url,
        paymentProofPublicId: uploadRes.data.public_id,
        paymentProofName: uploadRes.data.original_filename
      };

      const res = await orderAPI.submitPaymentProof(selectedOrder.id, paymentData);
      
      if (res.success) {
        setIsModalOpen(false);
        setSuccessMessage(selectedOrder.isDpPayment ? 'Bukti Pembayaran DP Berhasil Diunggah! Menunggu konfirmasi admin.' : 'Bukti Pelunasan Berhasil Diunggah! Menunggu konfirmasi admin.');
        fetchOrdersAndModels();
      } else {
        throw new Error(res.message);
      }
    } catch (error) {
      console.error(error);
      let msg = error?.response?.data?.message || error.message || 'Terjadi kesalahan saat mengunggah';
      if (msg.includes('500')) msg = 'Internal server error';
      setErrorMessage(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCompleteOrder = async (orderId) => {
    setIsLoading(true);
    try {
      const response = await orderAPI.completeOrder(orderId);
      if (response.success) {
        setSuccessMessage('Pesanan berhasil diselesaikan. Terima kasih!');
        fetchOrdersAndModels();
      } else {
        throw new Error(response.message || 'Gagal menyelesaikan pesanan');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage(error.response?.data?.message || error.message || 'Terjadi kesalahan');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 font-sans">
      <Navbar />

      <main className="flex-1 px-4 md:px-8 lg:px-12 py-8 max-w-[1400px] w-full mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex flex-col items-center text-center p-4 border-b border-gray-100 mb-4">
                <div className="w-16 h-16 rounded-full border-2 border-green-700 text-green-700 flex items-center justify-center mb-3">
                  <User size={32} />
                </div>
                <h2 className="font-bold text-lg text-gray-900">{user?.name || 'Nama User'}</h2>
                <p className="text-sm text-gray-500">{user?.email || 'user@gmail.com'}</p>
              </div>
              
              <nav className="flex flex-col gap-2">
                <Link to="/profile" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/profile' ? 'bg-green-50/50 text-green-800 border border-green-100' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <User size={20} />
                  <span>Profil Saya</span>
                </Link>
                <Link to="/orders" className={`flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors ${location.pathname === '/orders' ? 'bg-green-50/50 text-green-800 border border-green-100' : 'text-gray-600 hover:bg-gray-50'}`}>
                  <ShoppingBag size={20} />
                  <span>Pesanan saya</span>
                </Link>
                <button onClick={() => { dispatch(logout()); navigate('/login'); }} className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-600 hover:bg-red-50 hover:text-red-600 font-medium transition-colors w-full text-left mt-2 border-t border-gray-100 pt-5">
                  <LogOut size={20} />
                  <span>Keluar</span>
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 overflow-hidden">
            {location.pathname === '/profile' ? (
              <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">Profil Saya</h1>
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="w-24 h-24 rounded-full border-4 border-green-50 flex items-center justify-center bg-gray-50 text-gray-400 shrink-0">
                    <User size={48} />
                  </div>
                  <div className="flex-1 w-full space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Nama Lengkap</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">{user?.name || '-'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">{user?.email || '-'}</div>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">No. Telepon</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium">{user?.phone || '-'}</div>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">Alamat</label>
                        <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-800 font-medium min-h-[80px]">
                          {user?.address || '-'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-6 gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Pesanan Saya</h1>
                <p className="text-sm text-gray-500">Lihat status dan riwayat pesanan Anda.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2.5 pr-10 text-sm font-medium text-gray-700 outline-none focus:ring-2 focus:ring-green-500 w-full sm:w-auto cursor-pointer">
                    <option>Semua Status</option>
                    <option>Menunggu DP</option>
                    <option>Produksi</option>
                    <option>Selesai</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                </div>
                <div className="relative w-full sm:w-64">
                  <input 
                    type="text" 
                    placeholder="Cari nomor pesanan..." 
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>

            {/* Orders List Container */}
            {isLoading ? (
              <div className="flex justify-center p-12 text-gray-500">Memuat pesanan...</div>
            ) : orders.length === 0 ? (
              <div className="bg-white border border-gray-200 rounded-xl p-12 text-center text-gray-500 shadow-sm">
                Belum ada pesanan.
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                {orders.map((order, index) => {
                  const total = parseFloat(order.totalAmount || 0);
                  const dpAmount = total * 0.6; // Assuming 60% DP as per design
                  const remaining = total - dpAmount;
                  
                  // Extract Box Size
                  const boxSize = `${order.sizePanjang || 0} x ${order.sizeLebar || 0} x ${order.sizeTinggi || 0} cm`;
                  
                  // Format Lamination
                  let laminationLabel = order.laminationSide || '';
                  if (order.laminationType) {
                    laminationLabel += ` (${order.laminationType})`;
                  }

                  // Due Date (Just mocking a +1 day from created for DP for now)
                  const createdDate = new Date(order.createdAt);
                  const dueDate = new Date(createdDate.getTime() + (24 * 60 * 60 * 1000));
                  const dueDateStr = `${dueDate.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })}, 23:59 WIB`;

                  const matchedModel = boxModels.find(m => m.code === order.boxModel);

                  return (
                    <div key={order.id} className="p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-white border-b border-gray-200 last:border-0">
                      
                      {/* Column 1: Image & Basic Info */}
                      <div className="col-span-1 md:col-span-2 flex flex-col items-center">
                        <div className="w-full border border-gray-200 rounded-xl p-4 mb-3 flex items-center justify-center bg-white aspect-square">
                          {matchedModel?.imageUrl ? (
                            <img src={matchedModel.imageUrl} alt={matchedModel.name} className="w-full h-full object-contain" />
                          ) : (
                            <Package size={64} className="text-[#8B9D8B] opacity-50" />
                          )}
                        </div>
                        <h3 className="font-bold text-gray-900 text-center text-sm w-full capitalize">
                          {matchedModel?.name || order.boxModel?.replace(/-/g, ' ')}
                        </h3>
                        <p className="text-xs text-gray-500 text-center">{boxSize}</p>
                      </div>

                      {/* Column 2: Order Details */}
                      <div className="col-span-1 md:col-span-3 flex flex-col gap-2.5 pt-2">
                        <div className="font-bold text-green-700 text-base mb-1">{order.orderNumber}</div>
                        
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Calendar size={16} className="text-green-700 opacity-80" />
                          <span>{formatDate(order.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Layers size={16} className="text-green-700 opacity-80" />
                          <span className="capitalize">{order.material} {order.materialThickness} gsm</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Droplets size={16} className="text-green-700 opacity-80" />
                          <span className="capitalize">{order.colorOption?.replace(/-/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Box size={16} className="text-green-700 opacity-80" />
                          <span className="capitalize">{laminationLabel.replace(/-/g, ' ')}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <FileText size={16} className="text-green-700 opacity-80" />
                          <span className="truncate max-w-[150px]">{order.designFileName || 'File.pdf'}</span>
                        </div>
                        <div className="flex items-center gap-3 text-sm text-gray-600">
                          <Package size={16} className="text-green-700 opacity-80" />
                          <span>{Number(order.quantity).toLocaleString('id-ID')} pcs</span>
                        </div>
                      </div>

                      {/* Column 3: Status & Action */}
                      <div className="col-span-1 md:col-span-4 flex flex-col pt-2">
                        <div className="font-bold text-base text-gray-900 mb-3">Status Pesanan</div>
                        
                        {order.orderStatus === 'WAITING_PAYMENT' || order.orderStatus === 'PENDING' ? (
                          order.paymentStatus === 'PENDING' ? (
                            <>
                              <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-orange-200">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                DP 60% - Sedang Diverifikasi Admin
                              </div>
                              <p className="text-xs text-gray-900 font-bold mb-1">Bukti pembayaran DP telah diunggah</p>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Pembayaran DP Anda sedang kami periksa. Mohon tunggu beberapa saat hingga admin memverifikasi pesanan Anda.
                              </p>
                            </>
                          ) : order.paymentStatus === 'FAILED' ? (
                            <>
                              <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-red-200">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Pembayaran DP Ditolak
                              </div>
                              <p className="text-xs text-gray-900 font-bold mb-1">Alasan Penolakan:</p>
                              <p className="text-xs text-red-600 mb-4 leading-relaxed pr-4">
                                {order.payments?.[0]?.rejectionReason || 'Bukti transfer tidak valid atau tidak sesuai.'}
                              </p>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Silakan unggah ulang bukti pembayaran DP 60% Anda.
                              </p>
                              <button 
                                onClick={() => handleOpenPaymentModal({ ...order, isDpPayment: true, paymentAmount: dpAmount })}
                                className="bg-[#FF7A00] hover:bg-[#E66E00] text-white rounded-lg px-4 py-2.5 text-sm font-bold w-full md:w-max transition-colors shadow-sm"
                              >
                                Upload Ulang DP 60%
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="bg-orange-50 text-[#FF7A00] px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-orange-100/50">
                                <span className="w-2 h-2 rounded-full bg-[#FF7A00]"></span>
                                DP 60% - Menunggu Pembayaran
                              </div>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Silakan selesaikan pembayaran DP 60% untuk memulai proses produksi
                              </p>
                              <div className="grid grid-cols-3 gap-2 border border-gray-200 rounded-xl p-3 mb-4 bg-white text-[11px] md:text-xs">
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-500 font-medium">Total Harga</span>
                                  <span className="font-bold text-gray-900">{formatRupiah(total)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-500 font-medium">DP 60%</span>
                                  <span className="font-bold text-gray-900">{formatRupiah(dpAmount)}</span>
                                </div>
                                <div className="flex flex-col gap-1">
                                  <span className="text-gray-500 font-medium">Batas Pembayaran</span>
                                  <span className="font-bold text-red-600">{dueDateStr}</span>
                                </div>
                              </div>
                              <button 
                                onClick={() => handleOpenPaymentModal({ ...order, isDpPayment: true, paymentAmount: dpAmount })}
                                className="bg-[#FF7A00] hover:bg-[#E66E00] text-white rounded-lg px-4 py-2.5 text-sm font-bold w-full md:w-max transition-colors shadow-sm"
                              >
                                Bayar DP 60% Sekarang
                              </button>
                            </>
                          )
                        ) : order.orderStatus === 'IN_PRODUCTION' ? (
                          <>
                            <p className="text-xs font-bold text-gray-900 mb-2">Status Pesanan</p>
                            <div className="bg-[#EEF2FF] text-[#4338CA] px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-4">
                              <span className="w-2 h-2 rounded-full bg-[#4338CA]"></span>
                              Produksi Sedang Berjalan
                            </div>
                            <p className="text-[13px] text-gray-500 mb-4 leading-relaxed">
                              Kami akan memberitahumu ketika produksi telah selesai atau hubungi nomor dibawah ini untuk info lebih lanjut.
                            </p>
                            <a href="https://wa.me/6281212949135" target="_blank" rel="noopener noreferrer" className="bg-[#F3F6E8] hover:bg-[#E8EED9] text-[#4D7B24] rounded-xl px-4 py-3 text-sm font-bold w-max inline-flex items-center gap-3 transition-colors">
                              <div className="bg-[#25D366] rounded-full w-9 h-9 flex items-center justify-center shrink-0">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12.0001 2.00098C6.47715 2.00098 2.00012 6.47801 2.00012 12.001C2.00012 13.9566 2.56214 15.7801 3.53517 17.314L2.00012 22.001L6.82216 20.443C8.32418 21.442 10.0981 22.001 12.0001 22.001C17.5231 22.001 22.0001 17.524 22.0001 12.001C22.0001 6.47801 17.5231 2.00098 12.0001 2.00098ZM16.6661 16.326C16.4721 16.877 15.6981 17.352 15.0971 17.476C14.6191 17.575 13.9561 17.653 11.2331 16.525C7.75315 15.084 5.51315 11.534 5.35215 11.321C5.19115 11.108 4.00015 9.52598 4.00015 7.88698C4.00015 6.24798 4.84615 5.44198 5.18715 5.09398C5.46215 4.81298 5.92215 4.67198 6.36815 4.67198C6.51215 4.67198 6.64315 4.67798 6.75815 4.68398C7.11215 4.70398 7.28915 4.72698 7.52415 5.29398C7.81815 6.00298 8.53615 7.75698 8.62115 7.93598C8.70615 8.11498 8.81815 8.35498 8.68315 8.62598C8.55515 8.88798 8.44115 8.99598 8.24115 9.22898C8.04115 9.46198 7.85215 9.61998 7.64315 9.87198C7.45415 10.093 7.24115 10.334 7.47215 10.73C7.70315 11.126 8.50815 12.438 9.69115 13.492C11.2211 14.856 12.4641 15.289 12.9031 15.474C13.2301 15.612 13.6231 15.58 13.8741 15.312C14.1951 14.969 14.5881 14.402 14.9921 13.847C15.2791 13.452 15.6021 13.402 15.9561 13.535C16.3111 13.668 18.1961 14.598 18.5731 14.786C18.9501 14.974 19.2011 15.068 19.2931 15.226C19.3851 15.384 19.3851 16.143 19.0111 16.712L16.6661 16.326Z"/>
                                </svg>
                              </div>
                              <div className="flex flex-col text-left">
                                <span className="text-[11px] leading-tight font-semibold">Chat via Whatsapp</span>
                                <span className="text-base font-extrabold tracking-tight leading-none text-[#3A5F19]">0812-1294-9135</span>
                              </div>
                            </a>
                          </>
                        ) : order.orderStatus === 'READY_TO_SHIP' ? (
                          order.paymentStatus === 'PENDING' ? (
                            <>
                              <div className="bg-orange-50 text-orange-600 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-orange-200">
                                <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                                Sedang Diverifikasi Admin
                              </div>
                              <p className="text-xs text-gray-900 font-bold mb-1">Bukti pelunasan telah diunggah</p>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Pembayaran Anda sedang kami periksa. Mohon tunggu beberapa saat hingga admin mengonfirmasi pengiriman.
                              </p>
                            </>
                          ) : order.paymentStatus === 'FAILED' ? (
                            <>
                              <div className="bg-red-50 text-red-600 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-red-200">
                                <span className="w-2 h-2 rounded-full bg-red-500"></span>
                                Pembayaran Pelunasan Ditolak
                              </div>
                              <p className="text-xs text-gray-900 font-bold mb-1">Alasan Penolakan:</p>
                              <p className="text-xs text-red-600 mb-4 leading-relaxed pr-4">
                                {order.payments?.[0]?.rejectionReason || 'Bukti transfer tidak valid atau tidak sesuai.'}
                              </p>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Silakan unggah ulang bukti pelunasan untuk proses pengiriman.
                              </p>
                              <button 
                                onClick={() => handleOpenPaymentModal({ ...order, isDpPayment: false, paymentAmount: remaining })}
                                className="bg-[#3D7236] hover:bg-[#2D5A27] text-white rounded-lg px-4 py-2.5 text-sm font-bold w-full md:w-max transition-colors shadow-sm"
                              >
                                Upload Ulang Pelunasan
                              </button>
                            </>
                          ) : (
                            <>
                              <div className="bg-[#E8F5E9] text-green-700 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3 border border-green-200">
                                <span className="w-2 h-2 rounded-full bg-green-700"></span>
                                Segera lakukan pelunasan
                              </div>
                              <p className="text-xs text-gray-900 font-bold mb-1">Produksi telah selesai</p>
                              <p className="text-xs text-gray-500 mb-4 leading-relaxed pr-4">
                                Silakan lakukan pelunasan untuk proses pengiriman
                              </p>
                              <div className="flex justify-between items-center border border-gray-200 rounded-xl p-3.5 mb-5 bg-white text-xs w-full max-w-[280px]">
                                <span className="text-gray-500 font-medium">Sisa Pelunasan 40%</span>
                                <span className="font-bold text-gray-900">{formatRupiah(remaining)}</span>
                              </div>
                              <button 
                                onClick={() => handleOpenPaymentModal({ ...order, isDpPayment: false, paymentAmount: remaining })}
                                className="bg-[#3D7236] hover:bg-[#2D5A27] text-white rounded-lg px-4 py-2.5 text-sm font-bold w-full md:w-max transition-colors shadow-sm"
                              >
                                Bayar Pelunasan
                              </button>
                            </>
                          )
                        ) : order.orderStatus === 'SHIPPED' ? (
                          <>
                            <p className="text-xs font-bold text-gray-900 mb-2">Status Pesanan</p>
                            <div className="bg-[#D1E7B9] text-[#417614] px-4 py-2.5 rounded-lg text-sm font-bold inline-flex items-center gap-2 w-max mb-4">
                              <Truck size={18} />
                              Dalam Pengiriman
                            </div>
                            <p className="text-[13px] text-gray-600 mb-6 leading-relaxed pr-4">
                              Pembayaran Lunas, pesanan anda sedang dalam proses pengiriman.
                            </p>
                            
                            <div className="bg-[#F8FAF7] border border-[#E2E8F0] rounded-xl p-4 flex gap-3 items-start mb-4">
                              <CheckCircle size={20} className="text-[#3D7236] shrink-0 mt-0.5 fill-[#3D7236]" color="white" />
                              <div className="flex flex-col">
                                <span className="text-sm font-bold text-[#3D7236] mb-1">Pembayaran Lunas</span>
                                <span className="text-xs text-gray-500">Terima kasih, pembayaran anda telah kami terima.</span>
                              </div>
                            </div>

                            <button 
                              onClick={() => setOrderToComplete(order.id)}
                              className="bg-[#3D7236] hover:bg-[#2D5A27] text-white rounded-lg px-4 py-2.5 text-sm font-bold w-full md:w-max transition-colors shadow-sm"
                            >
                              Pesanan Diterima
                            </button>
                          </>
                        ) : (
                          <>
                            <div className="bg-gray-100 text-gray-700 px-3 py-1.5 rounded-md text-xs font-bold inline-flex items-center gap-2 w-max mb-3">
                              <span className="w-2 h-2 rounded-full bg-gray-500"></span>
                              {order.orderStatus}
                            </div>
                            <p className="text-xs text-gray-500 mb-3">Pesanan Anda dalam status {order.orderStatus}</p>
                          </>
                        )}
                      </div>

                      {/* Column 4: Progress */}
                      <div className="col-span-1 md:col-span-3 flex flex-col md:border-l md:border-gray-100 md:pl-6 pt-4 md:pt-2 border-t border-gray-100 md:border-t-0">
                        <div className="font-bold text-base text-gray-900 mb-4">Progres Pesanan</div>
                        <OrderProgress currentStatus={order.orderStatus} />
                      </div>

                    </div>
                  );
                })}
              </div>
            )}
            </>
            )}
          </div>
        </div>
      </main>

      {/* Modal Upload Pelunasan */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <h3 className="text-xl font-bold text-gray-900">
                {selectedOrder.isDpPayment ? 'Upload Bukti Pembayaran DP' : 'Upload Bukti Pelunasan'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 md:p-8">
              <div className="mb-6 bg-green-50 border border-green-100 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-green-700 text-sm font-medium mb-1">
                    {selectedOrder.isDpPayment ? 'Total DP yang harus dibayar' : 'Total yang harus dilunasi'}
                  </p>
                  <p className="text-2xl font-bold text-green-800">{formatRupiah(selectedOrder.paymentAmount)}</p>
                </div>
                <CreditCard size={32} className="text-green-300" />
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-gray-700 mb-2">Transfer ke rekening:</p>
                <div className="flex flex-col gap-3">
                  {bankAccounts.length > 0 ? (
                    bankAccounts.filter(b => b.isActive !== false).map((bank) => (
                      <div key={bank.id} className="p-5 border border-gray-200 rounded-xl bg-white flex items-center gap-6">
                        {bank.imageUrl && (
                          <div className="w-28 shrink-0 flex items-center justify-center">
                            <img src={bank.imageUrl} alt={bank.bankName} className="w-full object-contain max-h-12" />
                          </div>
                        )}
                        <div className="flex flex-col">
                          <span className="font-bold text-gray-800 text-base mb-1">{bank.bankName}</span>
                          <span className="text-xs text-gray-400 font-medium">Nomor Rekening</span>
                          <p className="text-lg font-bold text-gray-900 tracking-wide leading-none my-1">{bank.accountNumber}</p>
                          <p className="text-sm text-gray-500">
                            a.n. <span className="font-bold text-gray-800">{bank.accountHolderName}</span>
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 border-2 border-gray-100 rounded-xl bg-gray-50">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-gray-900">Bank BCA</span>
                      </div>
                      <p className="text-xl font-mono text-gray-800 tracking-wider">1234 5678 90</p>
                      <p className="text-sm text-gray-500">a.n. PT Benua Kertas Indonesia</p>
                    </div>
                  )}
                </div>
              </div>

              <form onSubmit={submitFinalPayment}>
                <div className="mb-8">
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Upload Bukti Transfer <span className="text-red-500">*</span>
                  </label>
                  <div className="relative border-2 border-dashed border-gray-300 rounded-xl p-8 hover:border-green-500 hover:bg-green-50 transition-all text-center group cursor-pointer">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileUpload}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      required
                    />
                    <div className="flex flex-col items-center pointer-events-none">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 transition-colors ${uploadedFile ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500 group-hover:bg-green-100 group-hover:text-green-600'}`}>
                        {uploadedFile ? <CheckCircle size={24} /> : <Upload size={24} />}
                      </div>
                      <p className="font-semibold text-gray-900 mb-1">
                        {uploadedFile ? uploadedFile.name : 'Pilih file bukti transfer'}
                      </p>
                      <p className="text-xs text-gray-500">Format JPG, PNG, atau PDF (Maks. 5MB)</p>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={!uploadedFile || isSubmitting}
                  className="w-full py-4 bg-green-700 hover:bg-green-800 text-white rounded-xl font-bold text-lg transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Memproses...</span>
                    </>
                  ) : (
                    selectedOrder.isDpPayment ? 'Konfirmasi Pembayaran DP' : 'Konfirmasi Pelunasan'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />

      {/* Confirmation Modal */}
      {orderToComplete && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-[#F8FAF7] border border-[#E2E8F0] rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-[#3D7236]" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Konfirmasi Pesanan</h3>
            <p className="text-sm text-gray-500 mb-6">Apakah Anda yakin pesanan telah diterima dengan baik? Aksi ini tidak dapat dibatalkan.</p>
            <div className="flex gap-3">
              <button 
                onClick={() => setOrderToComplete(null)} 
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 px-4 rounded-xl transition-colors"
                disabled={isLoading}
              >
                Batal
              </button>
              <button 
                onClick={() => {
                  const id = orderToComplete;
                  setOrderToComplete(null);
                  handleCompleteOrder(id);
                }} 
                className="flex-1 bg-[#3D7236] hover:bg-[#2D5A27] text-white font-bold py-3 px-4 rounded-xl transition-colors"
                disabled={isLoading}
              >
                Ya, Terima
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Global Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-sm text-gray-500 mb-6">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl w-full transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Global Error Modal */}
      {errorMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <X size={32} className="text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Terjadi Kesalahan</h3>
            <p className="text-sm text-gray-500 mb-6">{errorMessage}</p>
            <button 
              onClick={() => setErrorMessage('')} 
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl w-full transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* Global Success Modal */}
      {successMessage && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200 text-center p-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle size={32} className="text-green-600" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Berhasil!</h3>
            <p className="text-sm text-gray-500 mb-6">{successMessage}</p>
            <button 
              onClick={() => setSuccessMessage('')} 
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-xl w-full transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
