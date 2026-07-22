import { useState, useEffect } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const BankAccountModal = ({ mode, account, onClose, onSave, onError }) => {
  const [form, setForm] = useState({
    bankName: '',
    accountNumber: '',
    accountHolderName: '',
    branch: '',
    imageUrl: '',
    displayOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && account) {
      setForm({
        bankName: account.bankName || '',
        accountNumber: account.accountNumber || '',
        accountHolderName: account.accountHolderName || '',
        branch: account.branch || '',
        imageUrl: account.imageUrl || '',
        displayOrder: account.displayOrder != null ? account.displayOrder : 0,
        isActive: account.isActive !== undefined ? account.isActive : true,
      });
    }
  }, [mode, account]);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload({ target: { files: [file] } });
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      if (onError) onError('Ukuran file melebihi batas 2MB');
      return;
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
      if (onError) onError('Format gambar tidak didukung. Gunakan jpg atau png');
      return;
    }

    setIsUploading(true);

    try {
      // Re-use uploadBoxModel API which uploads image to cloudinary and returns URL
      const response = await uploadAPI.uploadBoxModel(file);
      if (response.success) {
        setForm((prev) => ({
          ...prev,
          imageUrl: response.data.url,
        }));
        if (errors.imageUrl) {
          setErrors((prev) => ({ ...prev, imageUrl: '' }));
        }
      } else {
        if (onError) onError(response.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (onError) onError('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const validate = () => {
    const e = {};
    if (!form.bankName.trim()) e.bankName = 'Nama bank wajib diisi';
    if (!form.accountNumber.trim()) e.accountNumber = 'Nomor rekening wajib diisi';
    if (!form.accountHolderName.trim()) e.accountHolderName = 'Nama pemilik rekening wajib diisi';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
        displayOrder: form.displayOrder !== '' ? parseInt(form.displayOrder) : 0,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold text-gray-900">
              {mode === 'create' ? 'Tambah Rekening Bank' : 'Edit Rekening Bank'}
            </h2>
            <p className="text-xs text-gray-500 mt-1">Masukkan rincian informasi rekening bank</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Bank Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Bank <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.bankName}
              onChange={(e) => setForm({ ...form, bankName: e.target.value })}
              placeholder="contoh: BCA, Mandiri, BRI"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.bankName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.bankName && <p className="text-red-500 text-xs mt-1">{errors.bankName}</p>}
          </div>

          {/* Account Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nomor Rekening <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.accountNumber}
              onChange={(e) => setForm({ ...form, accountNumber: e.target.value })}
              placeholder="contoh: 8012345678"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.accountNumber ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.accountNumber && <p className="text-red-500 text-xs mt-1">{errors.accountNumber}</p>}
          </div>

          {/* Account Holder Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama Pemilik Rekening <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.accountHolderName}
              onChange={(e) => setForm({ ...form, accountHolderName: e.target.value })}
              placeholder="contoh: PT Benua Kertas Indonesia"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.accountHolderName ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.accountHolderName && <p className="text-red-500 text-xs mt-1">{errors.accountHolderName}</p>}
          </div>

          {/* Branch */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Cabang (Opsional)</label>
            <input
              type="text"
              value={form.branch}
              onChange={(e) => setForm({ ...form, branch: e.target.value })}
              placeholder="contoh: KCP Sudirman"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo Bank
            </label>
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                isDragging
                  ? 'border-color-secondary bg-color-light/30'
                  : 'border-gray-300 bg-white'
              } ${form.imageUrl || isUploading ? 'p-4' : 'p-6'} mb-2`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center text-center py-2">
                  <Loader2 size={24} className="text-color-secondary animate-spin mb-2" />
                  <p className="text-gray-900 font-medium text-sm">Sedang mengunggah logo...</p>
                </div>
              ) : !form.imageUrl ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 mb-2 rounded-full bg-gray-50 flex items-center justify-center">
                    <Upload size={20} className="text-color-secondary" />
                  </div>
                  <p className="text-gray-900 font-medium text-sm mb-1">
                    Drag & drop logo di sini atau
                  </p>
                  <label className="cursor-pointer text-sm">
                    <span className="text-color-secondary font-semibold hover:underline">
                      Pilih File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-gray-500 text-xs mt-1">
                    Format: JPG, PNG (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white p-1 flex items-center justify-center flex-shrink-0">
                      <img src={form.imageUrl} alt="Logo" className="w-full h-full object-contain" onError={(e) => { e.target.style.display = 'none'; }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-xs max-w-[120px] sm:max-w-[150px]">
                        {form.imageUrl.split('/').pop()}
                      </p>
                      <p className="text-[10px] text-green-600 font-medium mt-0.5">Logo diunggah</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({ ...prev, imageUrl: '' }));
                      if (errors.imageUrl) setErrors(prev => ({ ...prev, imageUrl: '' }));
                    }}
                    className="w-7 h-7 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={14} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
            {errors.imageUrl && <p className="mt-1 text-sm text-red-500">{errors.imageUrl}</p>}
          </div>

          {/* Display Order */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan Tampilan</label>
            <input
              type="number"
              value={form.displayOrder}
              onChange={(e) => setForm({ ...form, displayOrder: e.target.value })}
              placeholder="0"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
            <p className="text-gray-400 text-xs mt-1">Urutan kemunculan rekening (angka lebih kecil muncul lebih dahulu)</p>
          </div>

          {/* isActive */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded focus:ring-color-secondary"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700 font-medium">Aktifkan Rekening</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving || isUploading} className="flex-1 px-4 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BankAccountModal;
