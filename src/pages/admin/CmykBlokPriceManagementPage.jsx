import { useState, useEffect } from 'react';
import { Layers, Info, Plus, Edit2, Trash2, Power, Search } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';
import DeleteConfirmModal from './BankAccountManagementPage/components/DeleteConfirmModal'; // Reuse delete modal

const CmykBlokPriceManagementPage = () => {
  const [prices, setPrices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedPrice, setSelectedPrice] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  const [formData, setFormData] = useState({
    thicknessMin: '',
    thicknessMax: '',
    cetakPrice: '',
    dragPrice: '',
    platPrice: '',
    isActive: true
  });
  const [saving, setSaving] = useState(false);

  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchPrices = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllCmykBlokPrices();
      if (response.success) {
        setPrices(response.data);
      }
    } catch (error) {
      console.error('Error fetching CMYK Blok prices:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data harga CMYK & Blok.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPrices();
  }, []);

  const handleCreate = () => {
    setFormData({
      thicknessMin: '',
      thicknessMax: '',
      cetakPrice: '',
      dragPrice: '',
      platPrice: '',
      isActive: true
    });
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (price) => {
    setFormData({
      thicknessMin: price.thicknessMin,
      thicknessMax: price.thicknessMax,
      cetakPrice: price.cetakPrice,
      dragPrice: price.dragPrice,
      platPrice: price.platPrice,
      isActive: price.isActive
    });
    setSelectedPrice(price);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (price) => {
    setSelectedPrice(price);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deleteCmykBlokPrice(selectedPrice.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Data harga berhasil dihapus.'
        });
        fetchPrices();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({ isOpen: true, title: 'Gagal Hapus', message: response.message });
      }
    } catch {
      setErrorModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menghapus data.' });
    }
  };

  const handleToggleStatus = async (price) => {
    try {
      const response = await masterDataAPI.toggleCmykBlokPriceStatus(price.id);
      if (response.success) {
        fetchPrices();
      }
    } catch {
      setErrorModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat mengubah status.' });
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createCmykBlokPrice(formData);
      } else {
        response = await masterDataAPI.updateCmykBlokPrice(selectedPrice.id, formData);
      }
      
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil',
          message: response.message || 'Data berhasil disimpan.'
        });
        fetchPrices();
        setIsModalOpen(false);
      } else {
        setErrorModal({ isOpen: true, title: 'Gagal', message: response.message });
      }
    } catch (error) {
      setErrorModal({ isOpen: true, title: 'Error', message: 'Terjadi kesalahan saat menyimpan data.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Harga CMYK & Blok</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Kelola tarif pencetakan berdasarkan ketebalan kertas
        </p>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p>Tentukan harga cetak flat, drag per lembar tambahan, dan harga plat berdasarkan rentang Gramatur kertas (contoh: 210-330 gsm).</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex justify-end">
        <button
          onClick={handleCreate}
          className="flex items-center justify-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 font-semibold"
        >
          <Plus size={18} />
          <span>Tambah Harga</span>
        </button>
      </div>

      {loading ? (
        <div className="p-12 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary" />
        </div>
      ) : prices.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100">
          <Layers className="mx-auto text-gray-300 mb-3" size={48} />
          <p className="text-gray-500 font-medium">Belum ada data harga CMYK & Blok.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200 text-gray-600 text-sm">
                  <th className="p-4 font-semibold">Rentang GSM</th>
                  <th className="p-4 font-semibold">Harga Cetak</th>
                  <th className="p-4 font-semibold">Harga Drag</th>
                  <th className="p-4 font-semibold">Harga Plat</th>
                  <th className="p-4 font-semibold">Status</th>
                  <th className="p-4 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {prices.map(price => (
                  <tr key={price.id} className="hover:bg-gray-50/50">
                    <td className="p-4 font-semibold text-gray-900">
                      {price.thicknessMin} - {price.thicknessMax} gsm
                    </td>
                    <td className="p-4 text-gray-700">Rp {price.cetakPrice.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-gray-700">Rp {price.dragPrice.toLocaleString('id-ID')}</td>
                    <td className="p-4 text-gray-700">Rp {price.platPrice.toLocaleString('id-ID')}</td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${price.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {price.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => handleEdit(price)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg">
                          <Edit2 size={16} />
                        </button>
                        <button onClick={() => handleToggleStatus(price)} className={`p-1.5 rounded-lg ${price.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`}>
                          <Power size={16} />
                        </button>
                        <button onClick={() => handleDelete(price)} className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-lg font-bold text-gray-900">
                {modalMode === 'create' ? 'Tambah Harga' : 'Edit Harga'}
              </h3>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Min GSM</label>
                  <input type="number" required value={formData.thicknessMin} onChange={e => setFormData({...formData, thicknessMin: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary" />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700">Max GSM</label>
                  <input type="number" required value={formData.thicknessMax} onChange={e => setFormData({...formData, thicknessMax: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary" />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Harga Cetak (Rp)</label>
                <input type="number" required value={formData.cetakPrice} onChange={e => setFormData({...formData, cetakPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Harga Drag (Rp)</label>
                <input type="number" required value={formData.dragPrice} onChange={e => setFormData({...formData, dragPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary" />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700">Harga Plat (Rp)</label>
                <input type="number" required value={formData.platPrice} onChange={e => setFormData({...formData, platPrice: e.target.value})} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary" />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg">Batal</button>
                <button type="submit" disabled={saving} className="px-4 py-2 bg-color-secondary text-white font-medium rounded-lg hover:bg-opacity-90 disabled:opacity-50">
                  {saving ? 'Menyimpan...' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={{ name: `Rentang GSM ${selectedPrice?.thicknessMin} - ${selectedPrice?.thicknessMax}` }}
          itemType="Harga CMYK"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      <SuccessModal isOpen={successModal.isOpen} title={successModal.title} message={successModal.message} onClose={() => setSuccessModal({ ...successModal, isOpen: false })} />
      <ErrorModal isOpen={errorModal.isOpen} title={errorModal.title} message={errorModal.message} onClose={() => setErrorModal({ ...errorModal, isOpen: false })} />
    </div>
  );
};

export default CmykBlokPriceManagementPage;
