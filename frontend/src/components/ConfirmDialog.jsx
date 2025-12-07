import { AlertCircle } from 'lucide-react'

export default function ConfirmDialog({ 
  isOpen, 
  title, 
  message, 
  confirmText = 'Delete', 
  cancelText = 'Cancel',
  isDangerous = false,
  onConfirm, 
  onCancel 
}) {
  if (!isOpen) return null

  const confirmButtonClass = isDangerous
    ? 'btn btn-compact bg-red-600 hover:bg-red-500 text-white border border-red-500/70 shadow-none dark:bg-red-600/90 dark:hover:bg-red-500/90'
    : 'btn btn-primary btn-compact'

  const iconWrapperClass = isDangerous
    ? 'bg-red-100 text-red-600'
    : 'bg-primary-100/80 text-primary-600 border border-primary-200/70 shadow-inner'

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4">
      <div className="relative w-full max-w-md rounded-3xl border border-primary-100/70 bg-white/95 p-6 shadow-2xl dark:border-gh-border dark:bg-gh-bg-secondary/95">
        <div className="absolute inset-0 rounded-3xl bg-future-radial opacity-50" aria-hidden />
        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl ${iconWrapperClass}`}>
              <AlertCircle className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-gh-text">
                {title}
              </h3>
              {message && (
                <p className="mt-2 text-sm text-future-muted dark:text-gh-text-secondary">
                  {message}
                </p>
              )}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap justify-end gap-3">
            <button
              onClick={onCancel}
              className="btn btn-outline btn-compact"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={confirmButtonClass}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
