import { useCallback, useState } from 'react'

export type NotificationPermissionState = 'unsupported' | 'default' | 'granted' | 'denied'

export interface UseNotificationsResult {
  permission: NotificationPermissionState
  requestPermission: () => Promise<void>
  notifyFocusComplete: (restMinutes: number) => void
  notifyRestComplete: () => void
}

function readPermission(): NotificationPermissionState {
  if (typeof Notification === 'undefined') {
    return 'unsupported'
  }

  return Notification.permission
}

export function useNotifications(): UseNotificationsResult {
  const [permission, setPermission] = useState<NotificationPermissionState>(readPermission)

  const requestPermission = useCallback(async () => {
    if (typeof Notification === 'undefined') {
      return
    }

    setPermission(await Notification.requestPermission())
  }, [])

  const notify = useCallback((title: string, body: string) => {
    if (typeof Notification === 'undefined' || Notification.permission !== 'granted') {
      return
    }

    new Notification(title, {
      body,
      tag: 'flowrest-phase-complete',
      requireInteraction: true,
    })
  }, [])

  const notifyFocusComplete = useCallback(
    (restMinutes: number) => {
      notify('Sesi fokus selesai', `Istirahat ${restMinutes} menit dimulai.`)
    },
    [notify],
  )

  const notifyRestComplete = useCallback(() => {
    notify('Istirahat selesai', 'Siap untuk sesi fokus berikutnya.')
  }, [notify])

  return { permission, requestPermission, notifyFocusComplete, notifyRestComplete }
}
