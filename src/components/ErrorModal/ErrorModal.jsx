import { useEffect } from 'react';
import { AlertOctagon } from 'lucide-react';

const ErrorModal = ({ isOpen, title = 'Gagal!', message = '', onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 scale-95 opacity-100 flex flex-col items-center p-6 text-center animate-scale-in animate-shake">
        {/* Error Icon Wrapper */}
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 bg-red-100/50 rounded-full animate-ping opacity-75" style={{ animationDuration: '2.5s' }} />
          <AlertOctagon className="w-10 h-10 text-red-500 relative z-10" />
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-red-500 hover:bg-red-600 active:bg-red-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-red-500/20"
        >
          Tutup
        </button>
      </div>
    </div>
  );
};

export default ErrorModal;
