"use client";

const ConfirmActionModal = ({
  open,
  onClose,
  onConfirm,
  title,
  subtitle,
  confirmText,
  cancelText,
  message,
  loading,
  loadingText,
}) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-all duration-300 ease-in-out ${
        open ? "opacity-100" : "opacity-0 invisible"
      }`}
    >
      <div
        className={`w-full max-w-md rounded-2xl border border-base-nav bg-highlightedProductsbg shadow-2xl transition-all duration-300 ease-in-out ${
          open ? "opacity-100" : "opacity-0 invisible"
        }`}
      >
        <div className="flex flex-col items-center px-6 pt-8 text-center">
          <div className="mb-4 w-16 flex justify-center items-center h-16 rounded-full border border-base-coffe/20 bg-base-coffe/10">
            <div className="bg-base-coffe rounded-full w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-base-light">{title}</h2>

          <p className="mt-3 text-base-lighter leading-7">{subtitle}</p>
        </div>

        <div className="flex justify-center gap-3 px-6 py-5">
          <button
            onClick={onClose}
            className="cursor-pointer rounded-lg border border-base-nav px-5 py-2.5 font-medium text-base-light transition hover:bg-base-nav"
          >
            {cancelText}
          </button>

          <button
            disabled={loading}
            onClick={onConfirm}
            className={`cursor-pointer rounded-lg bg-base-coffe px-5 py-2.5 font-semibold text-white transition hover:opacity-90
          `}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                {loadingText}
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
        {message && (
          <div className="mx-6 mb-5 rounded-xl border border-base-coffe/20 bg-base-coffe/5 p-4 text-center">
            <p className="font-medium text-base-light">{message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ConfirmActionModal;
