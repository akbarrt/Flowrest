import type { NotificationPermissionState } from '../../hooks/useNotifications'

type NotificationSettingsProps = {
  permission: NotificationPermissionState
  onRequest: () => Promise<void>
}

function statusText(permission: NotificationPermissionState): string {
  if (permission === 'granted') {
    return 'Toast Windows aktif. Jika senyap, cek Focus Assist.'
  }

  if (permission === 'denied') {
    return 'Diblokir. Ubah izin di Chrome dan Windows.'
  }

  return 'Aktifkan untuk toast Windows saat sesi selesai.'
}

export function NotificationSettings({ permission, onRequest }: NotificationSettingsProps) {
  if (permission === 'unsupported') {
    return null
  }

  return (
    <section
      aria-labelledby="notification-title"
      className="w-full border-t border-line pt-3 text-left"
    >
      <div className="flex min-h-11 items-center justify-between gap-3">
        <div className="min-w-0">
          <h2 id="notification-title" className="font-display text-base font-semibold text-ink">
            Notifikasi
          </h2>
          <p className="text-xs leading-tight text-muted">{statusText(permission)}</p>
        </div>

        {permission === 'default' ? (
          <button
            type="button"
            onClick={() => void onRequest()}
            className="min-h-11 shrink-0 rounded-md border border-line bg-paper px-3 text-xs font-medium text-ink transition-colors hover:bg-line/40 active:bg-line/60 motion-reduce:transition-none"
          >
            Aktifkan notifikasi
          </button>
        ) : null}
      </div>
    </section>
  )
}
