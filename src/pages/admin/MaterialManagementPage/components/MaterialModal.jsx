import { useState, useEffect } from 'react';
import { X, Package, Upload, Loader2 } from 'lucide-react';
import { uploadAPI } from '@/services/api';

const MaterialModal = ({ mode, material, onClose, onSave, onError }) => {
  const isEdit = mode === 'edit';

  const [form, setForm] = useState({
    code: '',
    name: '',
    description: '',
    imageUrl: '',
    isActive: true,
  });
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (isEdit && material) {
      setForm({
        code: material.code || '',
        name: material.name || '',
        description: material.description || '',
        imageUrl: material.imageUrl || '',
        isActive: material.isActive !== undefined ? material.isActive : true,
      });
    }
  }, [isEdit, material]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // ── Image upload handlers ─────────────────────────────────────────────────
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
      if (onError) onError('Ukuran file melebihi batas 2MB');
      return;
    }
    const allowed = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!allowed.includes(file.type)) {
      if (onError) onError('Format gambar tidak didukung. Gunakan jpg atau png');
      return;
    }
    setIsUploading(true);
    try {
      // Reuse the box-model upload endpoint (same folder & restrictions)
      const res = await uploadAPI.uploadBoxModel(file);
      if (res.success) {
        setForm(prev => ({ ...prev, imageUrl: res.data.url }));
      } else {
        if (onError) onError(res.message || 'Gagal mengunggah gambar.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      if (onError) onError('Terjadi kesalahan saat mengunggah gambar.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.code.trim() || !form.name.trim()) return;
    setSaving(true);
    try {
      await onSave({ ...form });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header strip */}
        <div className="h-1 bg-gradient-to-r from-color-darker to-color-primary" />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-color-darker to-color-primary flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {isEdit ? 'Edit Material' : 'Tambah Material Baru'}
            </h2>
            <p className="text-xs text-gray-500">
              {isEdit ? `Mengedit: ${material?.name}` : 'Isi form di bawah untuk menambah material baru'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Code & Name */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Kode Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="code"
                value={form.code}
                onChange={handleChange}
                required
                placeholder="Contoh: ART-PAPER"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                Nama Material <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                placeholder="Contoh: Art Paper"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">Deskripsi</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              placeholder="Deskripsi singkat material..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-color-primary/30 focus:border-color-primary outline-none transition-all resize-none"
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

          {/* Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
            <input
              type="checkbox"
              id="material-isActive"
              name="isActive"
              checked={form.isActive}
              onChange={handleChange}
              className="w-4 h-4 accent-color-primary rounded"
            />
            <label htmlFor="material-isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
              Material Aktif
              <span className="block text-xs font-normal text-gray-400">
                Material aktif akan ditampilkan di halaman pemesanan
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors text-sm"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={saving || isUploading}
              className="flex-1 px-4 py-2.5 bg-color-darker text-white rounded-xl font-medium hover:bg-color-dark transition-colors text-sm disabled:opacity-60"
            >
              {saving ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaterialModal;
