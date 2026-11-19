import type { NotificationPermissionState } from '../../hooks/useNotifications'

type NotificationSettingsProps = {
  permission: NotificationPermissionState
  onRequest: () => Promise<void>
}

export function NotificationSettings({ permission, onRequest }: NotificationSettingsProps) {
  if (permission === 'unsupported') {
    return null
  }

  return (
    <section
      aria-labelledby="notification-title"
      className="w-full rounded-xl border border-line bg-surface p-4 text-left sm:p-5"
    >
      <h2 id="notification-title" className="font-display text-lg font-semibold text-ink">
        Notifikasi
      </h2>

      {permission === 'granted' ? (
        <p className="mt-1 text-sm text-muted">Notifikasi aktif saat sesi selesai.</p>
      ) : permission === 'denied' ? (
        <p className="mt-1 text-sm text-muted">Notifikasi diblokir di pengaturan browser.</p>
      ) : (
        <>
          <p className="mt-1 text-sm text-muted">
            Minta notifikasi saat fokus dan istirahat selesai.
          </p>
          <button
            type="button"
            onClick={() => void onRequest()}
            className="mt-3 min-h-11 rounded-md border border-line bg-paper px-4 text-sm font-medium text-ink transition-colors hover:bg-line/40 active:bg-line/60 motion-reduce:transition-none"
          >
            Aktifkan notifikasi
          </button>
        </>
      )}
    </section>
  )
}
