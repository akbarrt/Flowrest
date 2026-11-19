type InlineNotificationProps = {
  message: string
  onDismiss: () => void
}

export function InlineNotification({ message, onDismiss }: InlineNotificationProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-line bg-surface p-3 text-left"
    >
      <div className="flex items-center gap-3">
        <p className="min-w-0 flex-1 text-sm leading-snug text-ink">{message}</p>
        <button
          type="button"
          onClick={onDismiss}
          aria-label="Tutup notifikasi"
          className="min-h-11 min-w-11 shrink-0 rounded-md border border-line bg-paper text-xs font-medium text-ink transition-colors hover:bg-line/40 active:bg-line/60 motion-reduce:transition-none"
        >
          Tutup
        </button>
      </div>
    </div>
  )
}
