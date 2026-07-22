import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';
import PlanoTypeModal from './components/PlanoTypeModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const PlanoTypeManagementPage = () => {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchOptions = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllPlanoTypes();
      if (response.success) {
        setOptions(response.data);
      }
    } catch (error) {
      console.error('Error fetching plano types:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data plano types dari server.'
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
      const response = await masterDataAPI.deletePlanoType(selectedOption.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Ukuran Plano telah berhasil dihapus dari sistem.'
        });
        fetchOptions();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus ukuran plano.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus ukuran plano.'
      });
    }
  };

  const handleToggleStatus = async (option) => {
    try {
      const response = await masterDataAPI.togglePlanoTypeStatus(option.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status ukuran plano berhasil diubah menjadi ${!option.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchOptions();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Ubah Status',
          message: response.message || 'Gagal mengubah status ukuran plano.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status.'
      });
    }
  };

  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createPlanoType(data);
      } else {
        response = await masterDataAPI.updatePlanoType(selectedOption.id, data);
      }
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Ukuran plano berhasil disimpan.'
        });
        fetchOptions();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan ukuran plano.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data.'
      });
    }
  };

  const filtered = options.filter((o) => {
    return o.code.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Ukuran Plano Management</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola referensi ukuran kertas plano dan area efektif potong</p>
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
                  placeholder="Cari berdasarkan kode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
                />
              </div>
            </div>
            <button
              onClick={handleCreate}
              className="flex items-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <Plus size={20} />
              <span>Tambah Ukuran Plano</span>
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
              {searchTerm ? 'Tidak ada data yang sesuai filter' : 'Belum ada ukuran plano'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Kode', 'Ukuran Asli', 'Area Efektif', 'Urutan', 'Status', 'Aksi'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((opt) => (
                    <tr key={opt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">{opt.code}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opt.width} x {opt.height} cm</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opt.effectiveWidth} x {opt.effectiveHeight} cm</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opt.sortOrder}</td>
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
          Menampilkan {filtered.length} dari {options.length} data
        </div>
      </main>

      {isModalOpen && (
        <PlanoTypeModal
          mode={modalMode}
          option={selectedOption}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={selectedOption}
          itemType="Ukuran Plano"
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

export default PlanoTypeManagementPage;
