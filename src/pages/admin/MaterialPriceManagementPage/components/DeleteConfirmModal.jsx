import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ item, itemType = 'Item', onClose, onConfirm }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="p-6 text-center">
          <div className="w-14 h-14 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="text-red-600" size={28} />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Hapus {itemType}?</h3>
          {item && (
            <p className="text-sm text-gray-600 mb-1">
              <span className="font-semibold">{item.name}</span>
              {item.code && <span className="text-gray-400"> ({item.code})</span>}
            </p>
          )}
          <p className="text-sm text-red-600 mt-3">Tindakan ini tidak dapat dibatalkan.</p>
        </div>
        <div className="flex gap-3 p-6 pt-0">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition-colors"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
