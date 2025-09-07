interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  children?: React.ReactNode;
  showLogo?: boolean;
}

export default function InfoModal({
  isOpen,
  onClose,
  title,
  message,
  children,
  showLogo = true,
}: InfoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative rounded-xl shadow-xl max-w-md w-full mx-4" style={{ backgroundColor: '#f7f4ed' }}>
        {/* Header */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {showLogo && (
                <img
                  src="/lovable-icon-bg-light.png"
                  alt="Lovable logo"
                  className="h-6 w-6 rounded"
                />
              )}
              {title && (
                <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
              )}
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Close"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 text-gray-500"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="px-6 py-5">
          {children ? (
            children
          ) : message ? (
            <p className="text-sm text-gray-800">{message}</p>
          ) : null}
        </div>

        {/* Footer */}
        <div className="px-6 pb-5 pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
}


