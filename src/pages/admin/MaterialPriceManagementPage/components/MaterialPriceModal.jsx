import { useState, useEffect } from 'react';

const MaterialPriceModal = ({ mode, option, planoTypes, materials, onClose, onSave }) => {
  const [form, setForm] = useState({
    planoCode: '',
    materialCode: '',
    thickness: '',
    price: '',
  });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (mode === 'edit' && option) {
      setForm({
        planoCode: option.planoCode || '',
        materialCode: option.materialCode || '',
        thickness: option.thickness != null ? String(option.thickness) : '',
        price: option.price != null ? String(option.price) : '',
      });
    } else if (mode === 'create') {
      setForm({
        planoCode: planoTypes.length > 0 ? planoTypes[0].code : '',
        materialCode: materials.length > 0 ? materials[0].code : '',
        thickness: '',
        price: '',
      });
    }
  }, [mode, option, planoTypes, materials]);

  const validate = () => {
    const e = {};
    if (!form.planoCode) e.planoCode = 'Plano wajib dipilih';
    if (!form.materialCode) e.materialCode = 'Bahan wajib dipilih';
    if (!form.thickness || parseInt(form.thickness) <= 0) e.thickness = 'Gramatur wajib diisi dan > 0';
    if (!form.price || parseFloat(form.price) < 0) e.price = 'Harga wajib diisi dan >= 0';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await onSave({
        planoCode: form.planoCode,
        materialCode: form.materialCode,
        thickness: parseInt(form.thickness, 10),
        price: parseFloat(form.price),
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
            {mode === 'create' ? 'Tambah Harga Kertas' : 'Edit Harga Kertas'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Plano Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Ukuran Plano <span className="text-red-500">*</span></label>
            <select
              value={form.planoCode}
              onChange={(e) => setForm({ ...form, planoCode: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.planoCode ? 'border-red-500' : 'border-gray-300'}`}
              disabled={mode === 'edit'}
            >
              <option value="" disabled>Pilih ukuran plano...</option>
              {planoTypes.map((p) => (
                <option key={p.id} value={p.code}>{p.code}</option>
              ))}
            </select>
            {errors.planoCode && <p className="text-red-500 text-xs mt-1">{errors.planoCode}</p>}
          </div>

          {/* Material Code */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Jenis Bahan <span className="text-red-500">*</span></label>
            <select
              value={form.materialCode}
              onChange={(e) => setForm({ ...form, materialCode: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.materialCode ? 'border-red-500' : 'border-gray-300'}`}
              disabled={mode === 'edit'}
            >
              <option value="" disabled>Pilih jenis bahan...</option>
              {materials.map((m) => (
                <option key={m.id} value={m.code}>{m.name}</option>
              ))}
            </select>
            {errors.materialCode && <p className="text-red-500 text-xs mt-1">{errors.materialCode}</p>}
          </div>

          {/* Thickness */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gramatur / Ketebalan (GSM) <span className="text-red-500">*</span></label>
            <input
              type="number"
              value={form.thickness}
              onChange={(e) => setForm({ ...form, thickness: e.target.value })}
              placeholder="310"
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.thickness ? 'border-red-500' : 'border-gray-300'}`}
              disabled={mode === 'edit'}
            />
            {errors.thickness && <p className="text-red-500 text-xs mt-1">{errors.thickness}</p>}
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Harga Per Plano (Rp) <span className="text-red-500">*</span></label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">Rp</span>
              <input
                type="number"
                value={form.price}
                onChange={(e) => setForm({ ...form, price: e.target.value })}
                placeholder="4500"
                className={`w-full pl-9 pr-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-color-secondary focus:border-transparent ${errors.price ? 'border-red-500' : 'border-gray-300'}`}
              />
            </div>
            {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
          </div>

          {mode === 'edit' && (
            <p className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded border border-orange-100">
              Catatan: Pada mode edit, Anda hanya dapat mengubah harga. Kombinasi Plano, Bahan, dan Gramatur tidak dapat diubah (silakan hapus dan buat baru jika ada kesalahan).
            </p>
          )}

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
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

export default MaterialPriceModal;
