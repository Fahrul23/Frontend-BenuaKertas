import { useState, useEffect } from 'react';

const PlanoTypeModal = ({ mode, option, onClose, onSave }) => {
  const [form, setForm] = useState({
    code: '',
    width: '',
    height: '',
    effectiveWidth: '',
    effectiveHeight: '',
    sortOrder: 0,
    isActive: true,
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && option) {
      setForm({
        code: option.code || '',
        width: option.width != null ? String(option.width) : '',
        height: option.height != null ? String(option.height) : '',
        effectiveWidth: option.effectiveWidth != null ? String(option.effectiveWidth) : '',
        effectiveHeight: option.effectiveHeight != null ? String(option.effectiveHeight) : '',
        sortOrder: option.sortOrder || 0,
        isActive: option.isActive !== undefined ? option.isActive : true,
      });
    }
  }, [mode, option]);

  const validate = () => {
    const e = {};
    if (!form.code.trim()) e.code = 'Kode wajib diisi';
    if (!form.width || parseFloat(form.width) <= 0) e.width = 'Lebar wajib diisi dan > 0';
    if (!form.height || parseFloat(form.height) <= 0) e.height = 'Tinggi wajib diisi dan > 0';
    if (!form.effectiveWidth || parseFloat(form.effectiveWidth) <= 0) e.effectiveWidth = 'Area efektif lebar wajib diisi dan > 0';
    if (!form.effectiveHeight || parseFloat(form.effectiveHeight) <= 0) e.effectiveHeight = 'Area efektif tinggi wajib diisi dan > 0';
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
        width: parseFloat(form.width),
        height: parseFloat(form.height),
        effectiveWidth: parseFloat(form.effectiveWidth),
        effectiveHeight: parseFloat(form.effectiveHeight),
        sortOrder: parseInt(form.sortOrder, 10),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {mode === 'create' ? 'Tambah Ukuran Plano' : 'Edit Ukuran Plano'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Kode Plano <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value })}
              placeholder="contoh: 79x109"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.code ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.code && <p className="text-red-500 text-xs mt-1">{errors.code}</p>}
          </div>

          {/* Dimensi Asli */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Lebar Asli (cm) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.1"
                value={form.width}
                onChange={(e) => setForm({ ...form, width: e.target.value })}
                placeholder="79"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.width ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.width && <p className="text-red-500 text-xs mt-1">{errors.width}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tinggi Asli (cm) <span className="text-red-500">*</span></label>
              <input
                type="number"
                step="0.1"
                value={form.height}
                onChange={(e) => setForm({ ...form, height: e.target.value })}
                placeholder="109"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.height ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.height && <p className="text-red-500 text-xs mt-1">{errors.height}</p>}
            </div>
          </div>

          {/* Dimensi Efektif */}
          <div className="bg-orange-50 p-4 rounded-lg border border-orange-100 mb-4">
            <h3 className="text-sm font-semibold text-orange-800 mb-3">Area Efektif Potong (Setelah Grip)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1">Lebar Efektif (cm) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  value={form.effectiveWidth}
                  onChange={(e) => setForm({ ...form, effectiveWidth: e.target.value })}
                  placeholder="77"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.effectiveWidth ? 'border-red-500' : 'border-orange-200'}`}
                />
                {errors.effectiveWidth && <p className="text-red-500 text-xs mt-1">{errors.effectiveWidth}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-orange-800 mb-1">Tinggi Efektif (cm) <span className="text-red-500">*</span></label>
                <input
                  type="number"
                  step="0.1"
                  value={form.effectiveHeight}
                  onChange={(e) => setForm({ ...form, effectiveHeight: e.target.value })}
                  placeholder="106.5"
                  className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-orange-500 focus:border-transparent ${errors.effectiveHeight ? 'border-red-500' : 'border-orange-200'}`}
                />
                {errors.effectiveHeight && <p className="text-red-500 text-xs mt-1">{errors.effectiveHeight}</p>}
              </div>
            </div>
            <p className="text-xs text-orange-600 mt-2 mt-2 leading-relaxed">
              * Area ini adalah area kertas yang bisa digunakan untuk mencetak setelah dikurangi pinggiran mesin (grip).
            </p>
          </div>

          {/* Urutan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Urutan (Sort Order)</label>
            <input
              type="number"
              value={form.sortOrder}
              onChange={(e) => setForm({ ...form, sortOrder: e.target.value })}
              placeholder="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent"
            />
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
            <button type="submit" disabled={saving} className="flex-1 px-4 py-2 bg-color-secondary text-white rounded-lg hover:bg-opacity-90 text-sm font-medium transition-colors disabled:opacity-50">
              {saving ? 'Menyimpan...' : mode === 'create' ? 'Tambah' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanoTypeModal;
