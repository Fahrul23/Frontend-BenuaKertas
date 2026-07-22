import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Filter } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';
import MaterialPriceModal from './components/MaterialPriceModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';

const MaterialPriceManagementPage = () => {
  const [options, setOptions] = useState([]);
  const [planoTypes, setPlanoTypes] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [planoFilter, setPlanoFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [modalMode, setModalMode] = useState('create');
  
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pricesRes, planoRes, materialRes] = await Promise.all([
        masterDataAPI.getAllMaterialPrices(),
        masterDataAPI.getAllPlanoTypes(),
        masterDataAPI.getMaterials()
      ]);

      if (pricesRes.success) setOptions(pricesRes.data);
      if (planoRes.success) setPlanoTypes(planoRes.data);
      if (materialRes.success) setMaterials(materialRes.data);
    } catch (error) {
      console.error('Error fetching material prices:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data harga kertas dari server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

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
      const response = await masterDataAPI.deleteMaterialPrice(selectedOption.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Harga kertas telah berhasil dihapus dari sistem.'
        });
        fetchData();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus harga kertas.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus harga kertas.'
      });
    }
  };

  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createMaterialPrice(data);
      } else {
        response = await masterDataAPI.updateMaterialPrice(selectedOption.id, data);
      }
      
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Harga kertas berhasil disimpan.'
        });
        fetchData();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan harga kertas.'
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
    const matchSearch =
      o.materialCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.planoCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchPlano = planoFilter === 'all' || o.planoCode === planoFilter;
    const matchMaterial = materialFilter === 'all' || o.materialCode === materialFilter;
    return matchSearch && matchPlano && matchMaterial;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Harga Kertas Plano Management</h1>
          <p className="text-gray-500 text-sm md:text-base">Kelola daftar harga kertas plano per kombinasi jenis kertas dan gramatur</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Cari jenis bahan atau plano..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent"
                />
              </div>
              
              {/* Filters */}
              <div className="flex gap-2">
                <div className="relative flex-1 sm:w-40">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={planoFilter}
                    onChange={(e) => setPlanoFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent appearance-none"
                  >
                    <option value="all">Semua Plano</option>
                    {planoTypes.map(p => (
                      <option key={p.id} value={p.code}>{p.code}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1 sm:w-40">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                  <select
                    value={materialFilter}
                    onChange={(e) => setMaterialFilter(e.target.value)}
                    className="w-full pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent appearance-none"
                  >
                    <option value="all">Semua Bahan</option>
                    {materials.map(m => (
                      <option key={m.id} value={m.code}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors shrink-0"
            >
              <Plus size={20} />
              <span>Tambah Harga Kertas</span>
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
              {searchTerm || planoFilter !== 'all' || materialFilter !== 'all' 
                ? 'Tidak ada data harga yang sesuai filter' 
                : 'Belum ada data harga kertas plano'}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    {['Kode Plano', 'Jenis Bahan', 'Gramatur (GSM)', 'Harga Per Plano', 'Aksi'].map((h) => (
                      <th key={h} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filtered.map((opt) => (
                    <tr key={opt.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-mono font-medium text-gray-900">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md">{opt.planoCode}</span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{opt.materialCode}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{opt.thickness} gsm</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                        Rp {parseFloat(opt.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1">
                          <button onClick={() => handleEdit(opt)} className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors" title="Edit"><Edit2 size={16} /></button>
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
        <MaterialPriceModal
          mode={modalMode}
          option={selectedOption}
          planoTypes={planoTypes}
          materials={materials}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={{...selectedOption, name: `Harga ${selectedOption?.materialCode} ${selectedOption?.thickness}gsm - ${selectedOption?.planoCode}`}}
          itemType="Harga Kertas"
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

export default MaterialPriceManagementPage;
