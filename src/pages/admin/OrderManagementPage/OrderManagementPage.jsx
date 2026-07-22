import React, { useState, useEffect } from 'react';
import { Package, Search, Filter, CheckCircle, Clock, AlertCircle, Eye, RefreshCw, X, FileText, Layers, Palette, Loader2, MapPin, Phone } from 'lucide-react';
import { orderAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';

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
  if (!dateString) return '-';
  const options = { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' };
  return new Date(dateString).toLocaleDateString('id-ID', options);
};

const statusConfig = {
  'WAITING_PAYMENT': { label: 'Menunggu Pembayaran / DP', color: 'bg-amber-100 text-amber-700', icon: Clock },
  'PAYMENT_CONFIRMED': { label: 'Pembayaran Dikonfirmasi', color: 'bg-blue-100 text-blue-700', icon: CheckCircle },
  'IN_PRODUCTION': { label: 'Sedang Diproses (Produksi)', color: 'bg-purple-100 text-purple-700', icon: Package },
  'READY_TO_SHIP': { label: 'Siap Dikirim / Pelunasan', color: 'bg-orange-100 text-orange-700', icon: AlertCircle },
  'SHIPPED': { label: 'Dalam Pengiriman', color: 'bg-blue-100 text-blue-700', icon: Package },
  'COMPLETED': { label: 'Selesai', color: 'bg-green-100 text-green-700', icon: CheckCircle },
  'CANCELLED': { label: 'Dibatalkan', color: 'bg-red-100 text-red-700', icon: X },
  'PENDING': { label: 'Menunggu Konfirmasi', color: 'bg-gray-100 text-gray-700', icon: Clock }
};

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  // Rejection modal states
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [orderToReject, setOrderToReject] = useState(null);

  // Success and Error Modal states
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderAPI.getAdminOrders();
      if (response.success) {
        setOrders(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch orders:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    try {
      const response = await orderAPI.updateOrderStatus(orderId, { orderStatus: newStatus });
      if (response.success) {
        // Update local state
        setOrders(prev => prev.map(order => {
          if (order.id === orderId) {
            return { ...order, orderStatus: newStatus };
          }
          return order;
        }));
        setSuccessMessage('Status pesanan berhasil diperbarui.');
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage(response.message || 'Gagal mengupdate status pesanan.');
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Terjadi kesalahan saat mengupdate status pesanan.');
      setIsErrorModalOpen(true);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRejectPayment = async () => {
    if (!rejectReason.trim()) {
      setErrorMessage("Alasan penolakan harus diisi.");
      setIsErrorModalOpen(true);
      return;
    }

    setUpdatingId(orderToReject.id);
    setIsRejectModalOpen(false);

    try {
      const response = await orderAPI.updateOrderStatus(orderToReject.id, {
        paymentStatus: 'FAILED',
        notes: rejectReason,
        orderStatus: orderToReject.orderStatus === 'WAITING_PAYMENT' ? 'WAITING_PAYMENT' : 'READY_TO_SHIP'
      });

      if (response.success) {
        setOrders(prev => prev.map(order => {
          if (order.id === orderToReject.id) {
            return { ...order, paymentStatus: 'FAILED' };
          }
          return order;
        }));
        // Refresh orders to get updated payments data
        fetchOrders();
        setSuccessMessage('Penolakan pembayaran berhasil dikonfirmasi.');
        setIsSuccessModalOpen(true);
      } else {
        setErrorMessage(response.message || 'Gagal menolak pembayaran.');
        setIsErrorModalOpen(true);
      }
    } catch (error) {
      console.error('Failed to reject payment:', error);
      setErrorMessage(error.response?.data?.message || error.message || 'Terjadi kesalahan saat menolak pembayaran.');
      setIsErrorModalOpen(true);
    } finally {
      setUpdatingId(null);
      setRejectReason('');
      setOrderToReject(null);
    }
  };

  const filteredOrders = orders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (order.user?.name && order.user.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Kelola status pesanan pelanggan dan verifikasi pembayaran.</p>
        </div>
        <button onClick={fetchOrders} className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari Order ID atau Nama Pelanggan..."
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Filter size={18} />
          <span>Filter Status</span>
        </button>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-600 text-sm border-b border-gray-100">
                <th className="p-4 font-semibold">Order ID / Tanggal</th>
                <th className="p-4 font-semibold">Pelanggan</th>
                <th className="p-4 font-semibold">Produk & Qty</th>
                <th className="p-4 font-semibold">Total</th>
                <th className="p-4 font-semibold">Status Saat Ini</th>
                <th className="p-4 font-semibold text-center">Aksi / Ubah Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <Loader2 className="mx-auto text-color-secondary animate-spin mb-2" size={32} />
                    Memuat pesanan...
                  </td>
                </tr>
              ) : filteredOrders.length > 0 ? filteredOrders.map((order) => {
                const statusInfo = statusConfig[order.orderStatus] || statusConfig['PENDING'];
                const StatusIcon = statusInfo.icon;
                const isUpdating = updatingId === order.id;

                return (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors group">
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{order.orderNumber}</div>
                      <div className="text-gray-500 text-xs mt-1">{formatDate(order.createdAt)}</div>
                    </td>
                    <td className="p-4 font-medium text-gray-800">{order.user?.name || '-'}</td>
                    <td className="p-4">
                      <div className="text-gray-900 capitalize">{order.boxModel?.replace(/-/g, ' ')}</div>
                      <div className="text-gray-500 text-xs mt-1">{order.quantity?.toLocaleString('id-ID')} pcs</div>
                    </td>
                    <td className="p-4">
                      <div className="font-bold text-gray-900">{formatRupiah(order.totalAmount)}</div>
                    </td>
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold ${statusInfo.color}`}>
                        <StatusIcon size={12} />
                        <span>{statusInfo.label}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => {
                            setSelectedOrderDetail(order);
                            setIsDetailModalOpen(true);
                          }}
                          className="w-full px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
                        >
                          <Eye size={14} /> Lihat Detail
                        </button>

                        {/* Dynamic Action Buttons based on status */}
                        {order.orderStatus === 'WAITING_PAYMENT' && (
                          <div className="flex gap-2">
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(order.id, 'IN_PRODUCTION')}
                              className="w-full px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle size={14} />}
                              Verifikasi
                            </button>
                            <button
                              disabled={isUpdating}
                              onClick={() => {
                                setOrderToReject(order);
                                setIsRejectModalOpen(true);
                              }}
                              className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                            >
                              <X size={14} /> Tolak
                            </button>
                          </div>
                        )}

                        {order.orderStatus === 'IN_PRODUCTION' && (
                          <button
                            disabled={isUpdating}
                            onClick={() => handleStatusChange(order.id, 'READY_TO_SHIP')}
                            className="w-full px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                          >
                            {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                            Produksi Selesai (Tagih)
                          </button>
                        )}

                        {order.orderStatus === 'READY_TO_SHIP' && (
                          <div className="flex gap-2">
                            <button
                              disabled={isUpdating}
                              onClick={() => handleStatusChange(order.id, 'SHIPPED')}
                              className="w-full px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                            >
                              {isUpdating ? <Loader2 size={14} className="animate-spin" /> : <Package size={14} />}
                              Kirim Pesanan
                            </button>
                            {order.paymentStatus === 'PENDING' && (
                              <button
                                disabled={isUpdating}
                                onClick={() => {
                                  setOrderToReject(order);
                                  setIsRejectModalOpen(true);
                                }}
                                className="w-full px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors disabled:opacity-50"
                              >
                                <X size={14} /> Tolak
                              </button>
                            )}
                          </div>
                        )}

                        {order.orderStatus === 'SHIPPED' && (
                          <div className="w-full px-3 py-1.5 bg-blue-50 text-blue-700 rounded text-xs font-semibold text-center border border-blue-200">
                            Sedang Dikirim
                          </div>
                        )}

                        {order.orderStatus === 'COMPLETED' && (
                          <div className="w-full px-3 py-1.5 bg-green-50 text-green-700 rounded text-xs font-semibold text-center border border-green-200">
                            Pesanan Selesai
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">
                    <Package className="mx-auto text-gray-300 mb-2" size={32} />
                    Tidak ada pesanan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {isDetailModalOpen && selectedOrderDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-color-secondary/10 text-color-secondary rounded-lg flex items-center justify-center">
                  <FileText size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Detail Pesanan</h3>
                  <p className="text-sm text-gray-500">{selectedOrderDetail.orderNumber}</p>
                </div>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-gray-400 hover:text-gray-700 transition-colors">
                <X size={24} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Informasi Pelanggan & Pengiriman */}
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Informasi Pelanggan</h4>
                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-3">
                      <div>
                        <p className="font-semibold text-gray-900">{selectedOrderDetail.user?.name}</p>
                        <p className="text-sm text-gray-600 mt-0.5">{selectedOrderDetail.user?.email}</p>
                      </div>

                      {/* Tampilkan Phone jika ada */}
                      {selectedOrderDetail.customerPhone && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                          <Phone size={14} className="mt-0.5 shrink-0" />
                          <p>{selectedOrderDetail.customerPhone}</p>
                        </div>
                      )}

                      {/* Tampilkan Detail Pengiriman jika ada */}
                      {(selectedOrderDetail.shippingProvince || selectedOrderDetail.shippingDetailAddress) && (
                        <div className="flex items-start gap-2 text-sm text-gray-600 pt-2 border-t border-gray-200">
                          <MapPin size={14} className="mt-0.5 shrink-0" />
                          <div>
                            <p className="font-medium text-gray-800">Alamat Pengiriman:</p>
                            <p>{selectedOrderDetail.shippingDetailAddress}</p>
                            <p>
                              {selectedOrderDetail.shippingDistrict}, {selectedOrderDetail.shippingCity},{' '}
                              {selectedOrderDetail.shippingProvince} {selectedOrderDetail.shippingPostalCode}
                            </p>
                          </div>
                        </div>
                      )}

                      <div className="pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Tanggal Pesan: {formatDate(selectedOrderDetail.createdAt)}</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Rincian Keuangan</h4>
                    <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 space-y-3">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Total Harga</span>
                        <span className="font-bold text-gray-900">{formatRupiah(selectedOrderDetail.totalAmount)}</span>
                      </div>
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Harga Satuan</span>
                        <span className="font-semibold text-gray-700">{formatRupiah(selectedOrderDetail.hargaPerPcs)}/pcs</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Spesifikasi Produk */}
                <div>
                  <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Spesifikasi Produk</h4>
                  <div className="bg-white border-2 border-gray-100 p-5 rounded-xl space-y-4">

                    <div className="flex gap-3 items-start">
                      <Package size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Model & Ukuran</p>
                        <p className="text-sm font-bold text-gray-900 capitalize">{selectedOrderDetail.boxModel?.replace(/-/g, ' ')}</p>
                        <p className="text-sm text-gray-700">
                          {selectedOrderDetail.sizePanjang} x {selectedOrderDetail.sizeLebar} x {selectedOrderDetail.sizeTinggi} cm
                          {selectedOrderDetail.sizeTinggiTutup ? ` (Tutup: ${selectedOrderDetail.sizeTinggiTutup} cm)` : ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Layers size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Bahan & Laminasi</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{selectedOrderDetail.material} ({selectedOrderDetail.materialThickness} gsm)</p>
                        <p className="text-sm text-gray-700 capitalize">{selectedOrderDetail.laminationSide?.replace(/-/g, ' ')} {selectedOrderDetail.laminationType ? `(${selectedOrderDetail.laminationType})` : ''}</p>
                      </div>
                    </div>

                    <div className="flex gap-3 items-start">
                      <Palette size={18} className="text-color-secondary mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 font-medium">Warna & Kuantitas</p>
                        <p className="text-sm font-semibold text-gray-900 capitalize">{selectedOrderDetail.colorOption?.replace(/-/g, ' ')}</p>
                        <p className="text-sm text-gray-700">{selectedOrderDetail.quantity?.toLocaleString('id-ID')} pcs</p>
                      </div>
                    </div>

                  </div>

                  {selectedOrderDetail.customerNote && (
                    <div className="mt-4 p-4 bg-amber-50 border border-amber-100 rounded-xl">
                      <p className="text-xs font-bold text-amber-800 mb-1">Catatan Pelanggan:</p>
                      <p className="text-sm text-amber-900 italic">"{selectedOrderDetail.customerNote}"</p>
                    </div>
                  )}

                  {selectedOrderDetail.designFileUrl && (
                    <div className="mt-4">
                      <a
                        href={selectedOrderDetail.designFileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-semibold rounded-lg transition-colors"
                      >
                        <FileText size={16} /> Lihat File Desain
                      </a>
                    </div>
                  )}

                </div>
              </div>

              {/* Bukti Pembayaran Section */}
              <div className="mt-8 pt-6 border-t border-gray-100">
                <h4 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Riwayat Pembayaran</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {selectedOrderDetail.payments && selectedOrderDetail.payments.length > 0 ? (
                    selectedOrderDetail.payments.map((payment, index) => (
                      <div key={payment.id} className="border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                        <div className="bg-gray-50 px-4 py-2 border-b border-gray-200">
                          <span className="text-sm font-bold text-gray-700">Pembayaran #{index + 1} ({payment.paymentStatus})</span>
                        </div>
                        {payment.paymentProofUrl ? (
                          <div className="relative group">
                            <img src={payment.paymentProofUrl} alt={`Bukti Pembayaran ${index + 1}`} className="w-full h-48 object-cover" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <a href={payment.paymentProofUrl} target="_blank" rel="noreferrer" className="px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold text-sm">Lihat Full</a>
                            </div>
                          </div>
                        ) : (
                          <div className="p-6 flex items-center justify-center bg-gray-50 text-gray-400 text-sm h-48 border-t border-gray-200">
                            Tanpa Lampiran
                          </div>
                        )}
                        <div className="p-3 bg-white text-xs text-gray-600 border-t border-gray-200">
                          <p>Tipe: {payment.paymentMethod}</p>
                          <p>Jumlah: {formatRupiah(payment.amount)}</p>
                          <p>Tanggal: {formatDate(payment.createdAt)}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full border border-dashed border-gray-300 rounded-xl p-6 flex items-center justify-center bg-gray-50 text-gray-400 text-sm">
                      Belum ada riwayat pembayaran
                    </div>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-gray-100 bg-white flex justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-6 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-xl transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Payment Modal */}
      {isRejectModalOpen && orderToReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-red-100 text-red-600 rounded-lg flex items-center justify-center">
                  <X size={20} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Tolak Pembayaran</h3>
                  <p className="text-sm text-gray-500">{orderToReject.orderNumber}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                  setOrderToReject(null);
                }}
                className="text-gray-400 hover:text-gray-700 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan <span className="text-red-500">*</span>
              </label>
              <textarea
                rows="4"
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent resize-none text-sm"
                placeholder="Contoh: Nominal transfer tidak sesuai dengan total tagihan, gambar bukti transfer buram/tidak terbaca..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
              ></textarea>
              <p className="text-xs text-gray-500 mt-2">
                Alasan ini akan ditampilkan kepada pelanggan agar mereka bisa mengunggah ulang bukti pembayaran yang benar.
              </p>
            </div>

            <div className="p-6 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                  setOrderToReject(null);
                }}
                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-bold rounded-xl transition-colors text-sm"
              >
                Batal
              </button>
              <button
                onClick={handleRejectPayment}
                disabled={!rejectReason.trim()}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-colors text-sm disabled:opacity-50"
              >
                Konfirmasi Penolakan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        title="Berhasil!"
        message={successMessage}
        onClose={() => setIsSuccessModalOpen(false)}
      />

      {/* Error Modal */}
      <ErrorModal
        isOpen={isErrorModalOpen}
        title="Gagal!"
        message={errorMessage}
        onClose={() => setIsErrorModalOpen(false)}
      />
    </div>
  );
};

export default OrderManagementPage;
