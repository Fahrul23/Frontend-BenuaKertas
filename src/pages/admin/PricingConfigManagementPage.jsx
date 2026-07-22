import { useState, useEffect } from 'react';
import { Settings, Save, Info } from 'lucide-react';
import { masterDataAPI } from '@/services/api';
import { SuccessModal, ErrorModal } from '@/components';

const PricingConfigManagementPage = () => {
  const [config, setConfig] = useState({
    pondMultiplier: '',
    packingDivisor: '',
    packingMultiplier: '',
    laminasiMultiplier: '',
    pisauPrice: '',
    dragThreshold: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successModal, setSuccessModal] = useState({ isOpen: false, title: '', message: '' });
  const [errorModal, setErrorModal] = useState({ isOpen: false, title: '', message: '' });

  const fetchConfig = async () => {
    try {
      setLoading(true);
      const response = await masterDataAPI.getPricingConfig();
      if (response.success && response.data) {
        setConfig(response.data);
      }
    } catch (error) {
      console.error('Error fetching pricing config:', error);
      setErrorModal({
        isOpen: true,
        title: 'Gagal Memuat',
        message: 'Gagal mengambil data konfigurasi harga.'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const handleChange = (field, value) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const dataToSave = {
        pondMultiplier: parseFloat(config.pondMultiplier),
        packingDivisor: parseInt(config.packingDivisor),
        packingMultiplier: parseFloat(config.packingMultiplier),
        laminasiMultiplier: parseFloat(config.laminasiMultiplier),
        pisauPrice: parseFloat(config.pisauPrice),
        dragThreshold: parseInt(config.dragThreshold)
      };

      const response = await masterDataAPI.updatePricingConfig(dataToSave);
      if (response.success) {
        setSuccessModal({
          isOpen: true,
          title: 'Berhasil Disimpan',
          message: 'Konfigurasi harga global berhasil diperbarui.'
        });
        setConfig(response.data);
      } else {
        setErrorModal({
          isOpen: true,
          title: 'Gagal Menyimpan',
          message: response.message || 'Gagal memperbarui konfigurasi.'
        });
      }
    } catch (error) {
      setErrorModal({
        isOpen: true,
        title: 'Error',
        message: 'Terjadi kesalahan saat menyimpan konfigurasi.'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-1 flex items-center gap-2">
          <Settings className="text-color-secondary" size={28} />
          Konfigurasi Harga Global
        </h1>
        <p className="text-gray-500 text-sm md:text-base">
          Atur parameter umum untuk perhitungan harga produksi (pisau, pond, packing, laminasi)
        </p>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex gap-3">
        <Info className="text-blue-600 flex-shrink-0 mt-0.5" size={18} />
        <div className="text-sm text-blue-800">
          <p className="font-semibold mb-1">Penting!</p>
          <p>
            Perubahan pada angka-angka di bawah ini akan langsung memengaruhi perhitungan harga untuk pesanan baru di seluruh sistem.
          </p>
        </div>
      </div>

      {/* Form Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-color-secondary" />
            <p className="mt-2 text-gray-600 text-sm">Loading konfigurasi...</p>
          </div>
        ) : (
          <div className="p-6 md:p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Multiplier Pond (Rp)</label>
                <input
                  type="number"
                  value={config.pondMultiplier}
                  onChange={(e) => handleChange('pondMultiplier', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 85"
                />
                <p className="text-xs text-gray-500">Rumus: Qty × Multiplier Pond</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Harga Pisau Flat (Rp)</label>
                <input
                  type="number"
                  value={config.pisauPrice}
                  onChange={(e) => handleChange('pisauPrice', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 700000"
                />
                <p className="text-xs text-gray-500">Biaya tetap per pesanan (jika dihitung)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Divisor Packing (pcs)</label>
                <input
                  type="number"
                  value={config.packingDivisor}
                  onChange={(e) => handleChange('packingDivisor', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 500"
                />
                <p className="text-xs text-gray-500">Jumlah per pack (rim)</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Multiplier Packing (Rp)</label>
                <input
                  type="number"
                  value={config.packingMultiplier}
                  onChange={(e) => handleChange('packingMultiplier', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 15000"
                />
                <p className="text-xs text-gray-500">Rumus: (Qty ÷ Divisor) × Multiplier</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Multiplier Laminasi</label>
                <input
                  type="number"
                  step="0.01"
                  value={config.laminasiMultiplier}
                  onChange={(e) => handleChange('laminasiMultiplier', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 0.3"
                />
                <p className="text-xs text-gray-500">Rumus: Panjang × Lebar × Multiplier × Qty</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700">Drag Threshold (pcs)</label>
                <input
                  type="number"
                  value={config.dragThreshold}
                  onChange={(e) => handleChange('dragThreshold', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-color-secondary outline-none"
                  placeholder="Contoh: 1000"
                />
                <p className="text-xs text-gray-500">Ambang batas sebelum hitung drag</p>
              </div>

            </div>

            <div className="pt-6 border-t border-gray-100 flex justify-end">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 bg-color-secondary text-white px-6 py-2.5 rounded-lg hover:bg-opacity-90 transition-colors font-semibold disabled:opacity-50"
              >
                <Save size={18} />
                {saving ? 'Menyimpan...' : 'Simpan Konfigurasi'}
              </button>
            </div>
          </div>
        )}
      </div>

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

export default PricingConfigManagementPage;
