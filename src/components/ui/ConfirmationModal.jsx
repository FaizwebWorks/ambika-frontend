import { X, AlertTriangle, Trash2 } from 'lucide-react';

const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // "default", "danger", "warning"
  isLoading = false
}) => {
  if (!isOpen) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'danger':
        return {
          icon: <Trash2 size={28} className="text-red-600" />,
          iconBg: 'bg-red-100',
          confirmBtn: 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
        };
      case 'warning':
        return {
          icon: <AlertTriangle size={28} className="text-yellow-600" />,
          iconBg: 'bg-yellow-100',
          confirmBtn: 'bg-yellow-600 hover:bg-yellow-700 focus:ring-yellow-500'
        };
      default:
        return {
          icon: <AlertTriangle size={28} className="text-blue-600" />,
          iconBg: 'bg-blue-100',
          confirmBtn: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/20 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-xl shadow-2xl max-w-md w-full mx-auto transform transition-all">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
          >
            <X size={20} />
          </button>

          <div className="p-6 sm:p-8">
            {/* Icon */}
            <div className={`w-16 h-16 ${typeStyles.iconBg} rounded-full flex items-center justify-center mx-auto mb-6`}>
              {typeStyles.icon}
            </div>

            {/* Title */}
            <h3 className="text-xl font-semibold text-neutral-900 text-center mb-3">
              {title}
            </h3>

            {/* Message */}
            <p className="text-neutral-600 text-center mb-8 leading-relaxed text-sm sm:text-base">
              {message}
            </p>

            {/* Actions */}
            <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-between">
              <button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 w-[50%] sm:flex-none px-6 py-2.5 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50 focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium cursor-pointer"
              >
                {cancelText}
              </button>
              <button
                onClick={onConfirm}
                disabled={isLoading}
                className={`flex-1 w-[50%] cursor-pointer sm:flex-none px-6 py-2.5 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium ${typeStyles.confirmBtn}`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </div>
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
