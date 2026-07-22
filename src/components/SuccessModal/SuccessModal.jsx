import { useEffect } from 'react';

const SuccessModal = ({ isOpen, title = 'Berhasil!', message = '', onClose, autoCloseDelay = 2000 }) => {
  useEffect(() => {
    if (isOpen && autoCloseDelay) {
      const timer = setTimeout(() => {
        onClose();
      }, autoCloseDelay);
      return () => clearTimeout(timer);
    }
  }, [isOpen, autoCloseDelay, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[9999] p-4 transition-opacity duration-300">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden transform transition-all duration-300 scale-95 opacity-100 flex flex-col items-center p-6 text-center animate-scale-in">
        {/* Animated Checkmark Icon Wrapper */}
        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4 relative">
          <div className="absolute inset-0 bg-green-100/50 rounded-full animate-ping opacity-75" style={{ animationDuration: '2s' }} />
          <svg
            className="w-10 h-10 text-green-500 relative z-10"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path
              className="animate-checkmark"
              d="M5 13l4 4L19 7"
              style={{
                strokeDasharray: 48,
                strokeDashoffset: 48,
                animation: 'checkmark 0.6s cubic-bezier(0.65, 0, 0.45, 1) 0.1s forwards'
              }}
            />
          </svg>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-900 mb-1">{title}</h3>

        {/* Message */}
        <p className="text-sm text-gray-500 mb-6">{message}</p>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full py-2.5 bg-green-500 hover:bg-green-600 active:bg-green-700 text-white rounded-xl font-semibold text-sm transition-colors shadow-lg shadow-green-500/20"
        >
          Selesai
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
