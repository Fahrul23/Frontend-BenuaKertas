import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, Eye } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';
import MaterialModal from './components/MaterialModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import MaterialDetailModal from './components/DetailModal';



const MaterialManagementPage = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllMaterials();
      if (response.success) {
        setMaterials(response.data);
      }
    } catch (error) {
      console.error('Error fetching materials:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal memuat data material dari server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchMaterials(); }, []);

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCreate = () => { setSelectedMaterial(null); setModalMode('create'); setIsModalOpen(true); };
  const handleEdit = (m) => { setSelectedMaterial(m); setModalMode('edit'); setIsModalOpen(true); };
  const handleDelete = (m) => { setSelectedMaterial(m); setIsDeleteModalOpen(true); };
  const handleDetail = (m) => { setSelectedMaterial(m); setIsDetailOpen(true); };

  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deleteMaterial(selectedMaterial.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Material telah berhasil dihapus dari sistem.'
        });
        fetchMaterials();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus material.'
        });
      }
    } catch (error) {
      console.error('Error deleting material:', error);
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus material.'
      });
    }
  };

  const handleToggleStatus = async (m) => {
    try {
      const response = await masterDataAPI.toggleMaterialStatus(m.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status material berhasil diubah menjadi ${!m.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchMaterials();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Ubah Status',
          message: response.message || 'Gagal mengubah status material.'
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status material.'
      });
    }
  };

  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createMaterial(data);
      } else {
        response = await masterDataAPI.updateMaterial(selectedMaterial.id, data);
      }
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Material berhasil disimpan.'
        });
        fetchMaterials();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan material.'
        });
      }
    } catch (error) {
      console.error('Error saving material:', error);
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data material.'
      });
    }
  };

  // ── Filter ─────────────────────────────────────────────────────────────────
  const filtered = materials.filter((m) =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Material Management</h1>
        <p className="text-gray-500 text-sm md:text-base">
          Kelola data bahan-bahan material untuk pemesanan custom (harga per gsm)
        </p>
      </div>

      {/* Actions Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              id="material-search"
              placeholder="Cari nama atau kode material..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
            />
          </div>
          {/* Add Button */}
          <button
            id="material-add-btn"
            onClick={handleCreate}
            className="flex items-center gap-2 bg-color-darker text-white px-5 py-2 rounded-lg hover:bg-color-dark transition-colors text-sm font-medium shadow-sm"
          >
            <Plus size={18} />
            <span>Tambah Material</span>
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-primary mb-3" />
            <p className="text-gray-500 text-sm">Memuat data...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-gray-400">
            {searchTerm ? 'Tidak ada material yang cocok dengan pencarian' : 'Belum ada data material'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {['ID', 'Gambar', 'Kode', 'Nama', 'Status', 'Aksi'].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-500">{m.id}</td>
                    <td className="px-4 py-3">
                      {m.imageUrl ? (
                        <img
                          src={m.imageUrl}
                          alt={m.name}
                          className="w-10 h-10 object-contain border border-gray-200 rounded-lg bg-gray-50"
                          onError={(e) => { e.target.style.display = 'none'; }}
                        />
                      ) : (
                        <div className="w-10 h-10 border-2 border-dashed border-gray-200 rounded-lg bg-gray-50 flex items-center justify-center">
                          <span className="text-[9px] text-gray-300">No img</span>
                        </div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-sm font-mono font-semibold text-gray-900 whitespace-nowrap">{m.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-900 whitespace-nowrap">{m.name}</td>

                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          m.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {m.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        {/* Detail */}
                        <button
                          onClick={() => handleDetail(m)}
                          className="p-1.5 rounded-lg text-purple-600 hover:text-purple-800 hover:bg-purple-50 transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye size={16} />
                        </button>
                        {/* Edit */}
                        <button
                          onClick={() => handleEdit(m)}
                          className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                          title="Edit"
                        >
                          <Edit2 size={16} />
                        </button>
                        {/* Toggle Status */}
                        <button
                          onClick={() => handleToggleStatus(m)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            m.isActive
                              ? 'text-orange-600 hover:text-orange-800 hover:bg-orange-50'
                              : 'text-green-600 hover:text-green-800 hover:bg-green-50'
                          }`}
                          title={m.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                        >
                          <Power size={16} />
                        </button>
                        {/* Delete */}
                        <button
                          onClick={() => handleDelete(m)}
                          className="p-1.5 rounded-lg text-red-600 hover:text-red-800 hover:bg-red-50 transition-colors"
                          title="Hapus"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Summary */}
      {!loading && (
        <div className="mt-3 text-xs text-gray-500">
          Menampilkan {filtered.length} dari {materials.length} material
        </div>
      )}

      {/* Modals */}
      {isModalOpen && (
        <MaterialModal
          mode={modalMode}
          material={selectedMaterial}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onError={(message) => setErrorModal({ isOpen: true, title: 'Error Upload', message })}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteConfirmModal
          material={selectedMaterial}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}
      {isDetailOpen && (
        <MaterialDetailModal
          material={selectedMaterial}
          onClose={() => setIsDetailOpen(false)}
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

export default MaterialManagementPage;
