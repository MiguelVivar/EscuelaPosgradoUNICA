import { ModalProps } from "@/types/Admin";

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 p-2 sm:p-4 pointer-events-none">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm pointer-events-auto" onClick={onClose}></div>
      <div className="bg-white rounded-lg sm:rounded-xl lg:rounded-2xl w-full max-w-xs sm:max-w-lg lg:max-w-2xl xl:max-w-4xl max-h-[95vh] sm:max-h-[90vh] overflow-y-auto shadow-2xl border-2 border-gray-300 transform transition-all duration-300 pointer-events-auto relative z-10">
        <div className="p-3 sm:p-4 lg:p-6">
          <div className="flex justify-between items-center mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800 pr-2">{title}</h3>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-xl sm:text-2xl transition-colors duration-200 flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              aria-label="Cerrar modal"
            >
              ×
            </button>
          </div>
          <div className="max-h-[calc(95vh-8rem)] sm:max-h-[calc(90vh-8rem)] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
