import { useState, useEffect } from 'react';
import { CreditCard, Info, Plus, Edit2, Trash2, Power, Search } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import BankAccountModal from './components/BankAccountModal';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import { SuccessModal, ErrorModal } from '@/components';

const BankAccountManagementPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [modalMode, setModalMode] = useState('create'); // 'create' | 'edit'
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      // Panggil endpoint /all untuk memuat semua rekening aktif & tidak aktif bagi admin
      const response = await masterDataAPI.getAllBankAccounts();
      if (response.success) {
        setAccounts(response.data);
      }
    } catch (error) {
      console.error('Error fetching bank accounts:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data rekening bank dari server.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleCreate = () => {
    setSelectedAccount(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (account) => {
    setSelectedAccount(account);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleDelete = (account) => {
    setSelectedAccount(account);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      const response = await masterDataAPI.deleteBankAccount(selectedAccount.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Dihapus',
          message: 'Rekening bank telah berhasil dihapus dari sistem.'
        });
        fetchAccounts();
        setIsDeleteModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Hapus',
          message: response.message || 'Gagal menghapus rekening bank.'
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menghapus rekening bank.'
      });
    }
  };

  const handleToggleStatus = async (account) => {
    try {
      const response = await masterDataAPI.toggleBankAccountStatus(account.id);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Status Diperbarui',
          message: `Status rekening bank berhasil diubah menjadi ${!account.isActive ? 'aktif' : 'nonaktif'}.`
        });
        fetchAccounts();
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Ubah Status',
          message: response.message || 'Gagal mengubah status aktif rekening.'
        });
      }
    } catch {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat mengubah status aktif.'
      });
    }
  };
  const handleSave = async (data) => {
    try {
      let response;
      if (modalMode === 'create') {
        response = await masterDataAPI.createBankAccount(data);
      } else {
        response = await masterDataAPI.updateBankAccount(selectedAccount.id, data);
      }
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: modalMode === 'create' ? 'Berhasil Ditambahkan' : 'Berhasil Diperbarui',
          message: response.message || 'Data rekening bank berhasil disimpan.'
        });
        fetchAccounts();
        setIsModalOpen(false);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal menyimpan data rekening bank.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan data rekening bank.'
      });
    }
  };
  const filtered = accounts.filter((acc) => {
    const matchSearch =
      acc.bankName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      acc.accountHolderName.toLowerCase().includes(searchTerm.toLowerCase());
    return matchSearch;
  });

  return (
    <div className="max-w-7xl mx-auto">
      <main>
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1">Bank Accounts Management</h1>
          <p className="text-gray-500 text-sm md:text-base">
            Kelola daftar rekening bank yang digunakan untuk menerima pembayaran dari pelanggan
          </p>
        </div>

        {/* Info Banner */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
          <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Pengelolaan Rekening Bank</p>
            <p>
              Halaman ini mendukung CRUD penuh. Rekening yang diset ke status <strong>Aktif</strong> akan otomatis muncul sebagai opsi pembayaran saat pelanggan melakukan checkout pesanan.
            </p>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            {/* Search */}
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Cari bank, nomor rekening, pemilik..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary focus:border-transparent text-sm"
              />
            </div>
            {/* Add Button */}
            <button
              onClick={handleCreate}
              className="flex items-center justify-center gap-2 bg-color-secondary text-white px-6 py-2 rounded-lg hover:bg-opacity-90 transition-colors text-sm font-semibold"
            >
              <Plus size={18} />
              <span>Tambah Rekening</span>
            </button>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary" />
            <p className="mt-2 text-gray-600 text-sm">Loading bank accounts...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-16 text-center border border-gray-100">
            <CreditCard className="mx-auto text-gray-300 mb-3" size={48} />
            <p className="text-gray-500 font-medium">
              {accounts.length === 0 ? 'Belum ada rekening bank. Klik "Tambah Rekening" untuk membuat.' : 'Tidak ada data rekening yang sesuai pencarian.'}
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((acc) => (
                <div
                  key={acc.id}
                  className={`bg-white rounded-2xl shadow-sm border p-6 hover:shadow-md transition-shadow relative overflow-hidden ${
                    !acc.isActive ? 'border-gray-200 bg-gray-50/50' : 'border-gray-100'
                  }`}
                >
                  {/* Decorative Gradient Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
                      acc.isActive
                        ? 'from-color-secondary to-color-primary'
                        : 'from-gray-300 to-gray-400'
                    }`}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${
                          acc.isActive
                            ? 'bg-gradient-to-br from-color-secondary to-color-primary text-white'
                            : 'bg-gray-100 text-gray-400'
                        }`}
                      >
                        <CreditCard size={22} />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                          {acc.bankName}
                          {acc.branch && (
                            <span className="text-xs font-normal text-gray-400">({acc.branch})</span>
                          )}
                        </h3>
                        <p className="text-xl font-mono font-semibold text-gray-800 mt-1 tracking-wider">
                          {acc.accountNumber}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          a/n <span className="font-medium text-gray-900">{acc.accountHolderName}</span>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 text-xs font-semibold rounded-full ${
                          acc.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {acc.isActive ? 'Aktif' : 'Nonaktif'}
                      </span>
                      <span className="text-xs text-gray-400">Order: {acc.displayOrder}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleEdit(acc)}
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit Rekening"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(acc)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          acc.isActive ? 'text-orange-600 hover:bg-orange-50' : 'text-green-600 hover:bg-green-50'
                        }`}
                        title={acc.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                      >
                        <Power size={14} />
                      </button>
                      <button
                        onClick={() => handleDelete(acc)}
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus Rekening"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>


          </div>
        )}
      </main>

      {/* Modals */}
      {isModalOpen && (
        <BankAccountModal
          mode={modalMode}
          account={selectedAccount}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {isDeleteModalOpen && (
        <DeleteConfirmModal
          item={selectedAccount ? { name: `${selectedAccount.bankName} - ${selectedAccount.accountNumber} (${selectedAccount.accountHolderName})` } : null}
          itemType="Rekening Bank"
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

export default BankAccountManagementPage;
