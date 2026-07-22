import { X, Package, Calendar, Tag, FileText, Image } from 'lucide-react';



const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  return new Date(dateStr).toLocaleDateString('id-ID', {
    day: '2-digit', month: 'long', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
};

const InfoRow = ({ label, value, className = '' }) => (
  <div className="flex flex-col gap-0.5">
    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{label}</span>
    <span className={`text-sm font-medium text-gray-800 ${className}`}>{value || '-'}</span>
  </div>
);

const MaterialDetailModal = ({ material, onClose }) => {
  if (!material) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
        {/* Header strip */}
        <div className="h-1 bg-gradient-to-r from-color-darker to-color-primary" />

        {/* Header */}
        <div className="flex items-center gap-3 px-6 py-4 border-b border-gray-100">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-color-darker to-color-primary flex items-center justify-center flex-shrink-0">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Detail Material</h2>
            <p className="text-xs text-gray-500">{material.code} — {material.name}</p>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Image + Status */}
          <div className="flex gap-4 items-start">
            {material.imageUrl ? (
              <img
                src={material.imageUrl}
                alt={material.name}
                className="w-24 h-24 object-contain border border-gray-200 rounded-xl bg-gray-50 flex-shrink-0"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
            ) : (
              <div className="w-24 h-24 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 flex items-center justify-center flex-shrink-0">
                <Image size={24} className="text-gray-300" />
              </div>
            )}
            <div className="flex-1 space-y-3">
              <InfoRow label="ID" value={`#${material.id}`} />
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Status</span>
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold w-fit ${
                    material.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                  }`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${material.isActive ? 'bg-green-500' : 'bg-red-500'}`} />
                  {material.isActive ? 'Aktif' : 'Tidak Aktif'}
                </span>
              </div>
            </div>
          </div>

          {/* Basic Info */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={12} /> Informasi Dasar
            </p>
            <div className="grid grid-cols-2 gap-4">
              <InfoRow label="Kode" value={material.code} className="font-mono" />
              <InfoRow label="Nama" value={material.name} />
            </div>
            {material.description && (
              <div className="flex flex-col gap-0.5">
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                  <FileText size={10} /> Deskripsi
                </span>
                <p className="text-sm text-gray-700 leading-relaxed">{material.description}</p>
              </div>
            )}
          </div>



          {/* Timestamps */}
          <div className="p-4 bg-gray-50 rounded-xl space-y-3">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1.5">
              <Calendar size={12} /> Waktu
            </p>
            <div className="grid grid-cols-1 gap-3">
              <InfoRow label="Dibuat" value={formatDate(material.createdAt)} />
              <InfoRow label="Diperbarui" value={formatDate(material.updatedAt)} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium text-sm transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};

export default MaterialDetailModal;
