import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Power, Search, Eye } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';
import BoxModelModal from './components/BoxModelModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import BoxModelDetailModal from './components/DetailModal';

const BoxModelManagementPage = () => {
  const [boxModels, setBoxModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedBoxModel, setSelectedBoxModel] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  // Fetch all box models
  const fetchBoxModels = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getAllBoxModels();
      if (response.success) {
        setBoxModels(response.data);
      }
    } catch (error) {
      console.error('Error fetching box models:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal memuat data box models.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxModels();
  }, []);

  // Handle detail
  const handleDetail = (boxModel) => {
    setSelectedBoxModel(boxModel);
    setIsDetailOpen(true);
  };

  // Handle create
  const handleCreate = () => {
    setSelectedBoxModel(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  // Handle edit
  const handleEdit = (boxModel) => {
    setSelectedBoxModel(boxModel);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  // Handle delete
  const handleDelete = (boxModel) => {
    setSelectedBoxModel(boxModel);
    setIsDeleteModalOpen(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deleteBoxModel(selectedBoxModel.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Box model telah berhasil dihapus dari sistem.'
        });
        fetchBoxModels();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menghapus',
          message: response.message || 'Gagal menghapus box model.'
        });
      }
    } catch (error) {
      console.error('Error deleting box model:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Menghapus',
        message: 'Terjadi kesalahan sistem saat menghapus box model.'
      });
    }
  };

  // Handle toggle status
  const handleToggleStatus = async (boxModel) => {
    try {
      const response = await masterDataAPI.toggleBoxModelStatus(boxModel.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status box model berhasil diubah menjadi ${!boxModel.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchBoxModels();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Memperbarui Status',
          message: response.message || 'Gagal memperbarui status box model.'
        });
      }
    } catch (error) {
      console.error('Error toggling status:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memperbarui Status',
        message: 'Terjadi kesalahan sistem saat memperbarui status box model.'
      });
    }
  };

  // Handle save (create or update)
  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createBoxModel(data);
      } else {
        response = await masterDataAPI.updateBoxModel(selectedBoxModel.id, data);
      }

      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Box model berhasil disimpan.'
        });
        fetchBoxModels();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan box model.'
        });
      }
    } catch (error) {
      console.error('Error saving box model:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Menyimpan',
        message: 'Terjadi kesalahan sistem saat menyimpan box model.'
      });
    }
  };

  // Filter box models by search term
  const filteredBoxModels = boxModels.filter((model) =>
    model.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    model.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        <div>
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Box Model Management</h1>
            <p className="text-gray-500 text-sm md:text-base">Kelola model kotak yang tersedia untuk pemesanan custom</p>
          </div>

          {/* Actions Bar */}
          <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by name or code..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
                />
              </div>

              {/* Create Button */}
              <button
                onClick={handleCreate}
                className="flex items-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                <Plus size={20} />
                <span>Add New Box Model</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary"></div>
                <p className="mt-2 text-gray-600">Loading...</p>
              </div>
            ) : filteredBoxModels.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                {searchTerm ? 'No box models found matching your search' : 'No box models yet'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Image
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Code
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Description
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredBoxModels.map((model) => (
                      <tr key={model.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {model.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {model.imageUrl ? (
                            <img
                              src={model.imageUrl}
                              alt={model.name}
                              className="w-12 h-12 object-contain border border-gray-200 rounded-lg bg-gray-50"
                              onError={(e) => { e.target.style.display = 'none'; }}
                            />
                          ) : (
                            <span className="text-gray-400 text-xs">No Image</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {model.code}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {model.name}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {model.description || '-'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              model.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {model.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center gap-1">
                            {/* Detail Button */}
                            <button
                              onClick={() => handleDetail(model)}
                              className="p-1.5 rounded-lg text-purple-600 hover:text-purple-900 hover:bg-purple-50 transition-colors"
                              title="Lihat Detail"
                            >
                              <Eye size={16} />
                            </button>

                            {/* Edit Button */}
                            <button
                              onClick={() => handleEdit(model)}
                              className="p-1.5 rounded-lg text-blue-600 hover:text-blue-900 hover:bg-blue-50 transition-colors"
                              title="Edit"
                            >
                              <Edit2 size={16} />
                            </button>

                            {/* Toggle Status Button */}
                            <button
                              onClick={() => handleToggleStatus(model)}
                              className={`p-1.5 rounded-lg transition-colors ${
                                model.isActive
                                  ? 'text-orange-600 hover:text-orange-900 hover:bg-orange-50'
                                  : 'text-green-600 hover:text-green-900 hover:bg-green-50'
                              }`}
                              title={model.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                            >
                              <Power size={16} />
                            </button>

                            {/* Delete Button */}
                            <button
                              onClick={() => handleDelete(model)}
                              className="p-1.5 rounded-lg text-red-600 hover:text-red-900 hover:bg-red-50 transition-colors"
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
          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredBoxModels.length} of {boxModels.length} box models
          </div>
        </div>
      </main>

      {/* Modals */}
      {isModalOpen && (
        <BoxModelModal
          mode={modalMode}
          boxModel={selectedBoxModel}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
          onError={(message) => setErrorModal({ isOpen: true, title: 'Error', message })}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          boxModel={selectedBoxModel}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={confirmDelete}
        />
      )}

      {isDetailOpen && (
        <BoxModelDetailModal
          boxModel={selectedBoxModel}
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

export default BoxModelManagementPage;
