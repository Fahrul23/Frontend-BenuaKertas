import { useState, useEffect } from 'react';
import { CATEGORY_OPTIONS } from '@/constants/masterData';
import { X, Upload, Loader2 } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const FinishingOptionModal = ({ mode, option, onClose, onSave }) => {
  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    category: 'side',
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && option) {
      setForm({
        code: option.code || '',
        name: option.name || '',
        description: option.description || '',
        imageUrl: option.imageUrl || '',
        category: option.category || 'side',
        isActive: option.isActive !== undefined ? option.isActive : true,
      });
    }
  }, [mode, option]);

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Kode wajib diisi';
    if (!form.name.trim()) e.name = 'Nama wajib diisi';
    if (!form.category) e.category = 'Kategori wajib dipilih';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processUpload(file);
  };

  const processUpload = async (file) => {
    if (file.size > 2 * 1024 * 1024) {
      alert('Ukuran file melebihi batas 2MB');
      return;
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      alert('Format gambar tidak didukung. Gunakan jpg atau png');
      return;
    }
    setIsUploading(true);
    try {
      const res = await uploadAPI.uploadBoxModel(file);
      if (res.success) {
        setForm(prev => ({ ...prev, imageUrl: res.data.url }));
      } else {
        alert(res.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      alert('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        ...form,
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'Tambah Finishing Option' : 'Edit Finishing Option'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="contoh: tanpa-laminasi"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nama <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="contoh: Tanpa Laminasi"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kategori <span className="text-red-500">*</span></label>
            <select
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.category ? 'border-red-500' : 'border-gray-300'}`}
            >
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
            {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
          </div>


          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent resize-none"
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Gambar Material
            </label>

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all duration-300 ${
                isDragging
                  ? 'border-color-secondary bg-color-light/30'
                  : 'border-gray-300 bg-white'
              } ${form.imageUrl || isUploading ? 'p-6' : 'p-8'} mb-2`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center text-center py-4">
                  <Loader2 size={32} className="text-color-secondary animate-spin mb-3" />
                  <p className="text-gray-900 font-medium">Sedang mengunggah gambar...</p>
                </div>
              ) : !form.imageUrl ? (
                <div className="flex flex-col items-center justify-center text-center">
                  <div className="w-14 h-14 mb-3 rounded-full bg-gray-50 flex items-center justify-center">
                    <Upload size={24} className="text-color-secondary" />
                  </div>
                  <p className="text-gray-900 font-medium mb-1">
                    Drag & drop gambar di sini atau
                  </p>
                  <label className="cursor-pointer">
                    <span className="text-color-secondary font-semibold hover:underline">
                      Pilih File
                    </span>
                    <input
                      type="file"
                      className="hidden"
                      accept=".jpg,.jpeg,.png"
                      onChange={(e) => { if (e.target.files[0]) processUpload(e.target.files[0]); }}
                      disabled={isUploading}
                    />
                  </label>
                  <p className="text-gray-500 text-xs mt-2">
                    Format: JPG, PNG (Max 2MB)
                  </p>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-lg border border-gray-200 overflow-hidden bg-gray-50 flex items-center justify-center flex-shrink-0">
                      <img
                        src={form.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-contain"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 truncate text-sm max-w-[150px] sm:max-w-xs">
                        {form.imageUrl.split('/').pop()}
                      </p>
                      <p className="text-xs text-green-600 font-medium mt-0.5">Gambar berhasil diunggah</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setForm(prev => ({ ...prev, imageUrl: '' }))}
                    className="w-8 h-8 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors flex-shrink-0"
                  >
                    <X size={16} className="text-red-500" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* isActive */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={form.isActive}
              onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
              className="w-4 h-4 text-color-secondary border-gray-300 rounded focus:ring-color-secondary"
            />
            <label htmlFor="isActive" className="text-sm text-gray-700">Aktif</label>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              Batal
            </button>
            <button type="submit" disabled={saving || isUploading} className="flex-1 px-4 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FinishingOptionModal;
