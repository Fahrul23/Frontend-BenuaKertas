import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, Tag } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { CATEGORY_LABELS, CATEGORY_COLORS } from '@/constants/masterData';
import { SuccessModal, ErrorModal } from '@/components';
import FinishingOptionModal from './components/FinishingOptionModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const FinishingOptionManagementPage = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllFinishingOptions();
      if (response.success) {
        setOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching finishing options:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data finishing options dari server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOptions(); }, []);

  const handleCreate = () => {
    setSelectedOption(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (option) => {
    setSelectedOption(option);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (option) => {
    setSelectedOption(option);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deleteFinishingOption(selectedOption.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Finishing option telah berhasil dihapus dari sistem.'
        });
        fetchOptions();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus finishing option.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus finishing option.'
      });
    }
  };

  const handleToggleStatus = async (option) => {
    try {
      const response = await masterDataAPI.toggleFinishingOptionStatus(option.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status finishing option berhasil diubah menjadi ${!option.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchOptions();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Ubah Status',
          message: response.message || 'Gagal mengubah status finishing option.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status finishing option.'
      });
    }
  };

  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createFinishingOption(data);
      } else {
        response = await masterDataAPI.updateFinishingOption(selectedOption.id, data);
      }
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Finishing option berhasil disimpan.'
        });
        fetchOptions();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan finishing option.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data finishing option.'
      });
    }
  };

  const filtered = options.filter((o) => {
    const matchSearch =
      o.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCat = categoryFilter === 'all' || o.category === categoryFilter;
    return matchSearch && matchCat;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Finishing Options Management</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola opsi laminasi dan finishing untuk custom order</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari berdasarkan nama atau kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
                />
              </div>
              {/* Category filter */}
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
              >
                <option value="all">Semua Kategori</option>
                <option value="side">Sisi Laminasi</option>
                <option value="type">Tipe Laminasi</option>
              </select>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus size={20} />
              <span>Tambah Finishing Option</span>
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary" />
              <p className="mt-2 text-gray-600">Loading...</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm || categoryFilter !== 'all' ? 'Tidak ada data yang sesuai filter' : 'Belum ada finishing option'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['ID', 'Gambar', 'Kode', 'Nama', 'Kategori', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((opt) => (
                    <tr key={opt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-500">{opt.id}</td>
                      <td className="px-6 py-4">
                        {opt.imageUrl ? (
                          <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center">
                            <img
                              src={opt.imageUrl}
                              alt={opt.name}
                              className="w-full h-full object-contain p-1"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          </div>
                        ) : (
                          <div className="w-12 h-12 rounded-lg border border-gray-200 bg-gray-100 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400">No img</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{opt.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opt.name}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex items-center gap-1 text-xs font-semibold rounded-full ${CATEGORY_COLORS[opt.category] || 'bg-gray-100 text-gray-700'}`}>
                          <Tag size={10} />
                          {CATEGORY_LABELS[opt.category] || opt.category}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 inline-flex text-xs font-semibold rounded-full ${opt.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {opt.isActive ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(opt)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><Edit2 size={16} /></button>
                          <button onClick={() => handleToggleStatus(opt)} className={`p-1.5 rounded-lg transition-colors ${opt.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'}`} title={opt.isActive ? 'Nonaktifkan' : 'Aktifkan'}><Power size={16} /></button>
                          <button onClick={() => handleDelete(opt)} className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Menampilkan {filtered.length} dari {options.length} finishing option
        </div>
      </main>

      {isModalOpen && (
        <FinishingOptionModal
          mode={modalMode}
          option={selectedOption}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={selectedOption}
          itemType="Finishing Option"
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      <SuccessModal
        isOpen={successModal.isOpen}
        title={successModal.title}
        message={successModal.message}
        onClose={() => setSuccessModal({ ...successModal, isOpen: false })}
      />

      <ErrorModal
        isOpen={errorModal.isOpen}
        title={errorModal.title}
        message={errorModal.message}
        onClose={() => setErrorModal({ ...errorModal, isOpen: false })}
      />
    </div>
  );
};

export default FinishingOptionManagementPage;
