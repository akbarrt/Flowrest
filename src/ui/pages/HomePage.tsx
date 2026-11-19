import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createSession } from '../../core/session'
import { timerDurationsFromSettings } from '../../core/settings'
import { countSessionsToday } from '../../core/stats'
import type { Mood } from '../../core/types'
import { useNotifications } from '../../hooks/useNotifications'
import { useSessions } from '../../hooks/useSessions'
import { useSettings } from '../../hooks/useSettings'
import { useTimer } from '../../hooks/useTimer'
import { DurationSettings } from '../components/DurationSettings'
import { InlineNotification } from '../components/InlineNotification'
import { MoodForm } from '../components/MoodForm'
import { NotificationSettings } from '../components/NotificationSettings'
import { Timer } from '../components/Timer'

interface InlineNotice {
  id: number
  message: string
}

export function HomePage({ isActive }: { isActive: boolean }) {
  const { sessions, addSession } = useSessions()
  const { settings, isLoading, error, saveSettings } = useSettings()
  const { permission, requestPermission, notifyFocusComplete, notifyRestComplete } =
    useNotifications()
  const durations = useMemo(() => timerDurationsFromSettings(settings), [settings])
  const todayCount = countSessionsToday(sessions)
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const [inlineNotice, setInlineNotice] = useState<InlineNotice | null>(null)
  const isSavingRef = useRef(false)
  const noticeIdRef = useRef(0)

  const showNotice = useCallback((message: string) => {
    noticeIdRef.current += 1
    setInlineNotice({ id: noticeIdRef.current, message })
  }, [])

  useEffect(() => {
    if (inlineNotice === null) {
      return
    }

    const timeout = window.setTimeout(() => setInlineNotice(null), 6000)

    return () => window.clearTimeout(timeout)
  }, [inlineNotice])

  const handleSessionComplete = useCallback(() => {
    setIsMoodFormOpen(true)
    notifyFocusComplete(settings.breakMinutes)
    showNotice(`Sesi fokus selesai. Istirahat ${settings.breakMinutes} menit dimulai.`)
  }, [notifyFocusComplete, settings.breakMinutes, showNotice])

  const handleRestComplete = useCallback(() => {
    notifyRestComplete()
    showNotice('Istirahat selesai. Siap untuk sesi fokus berikutnya.')
  }, [notifyRestComplete, showNotice])

  const timer = useTimer({
    durations,
    onSessionComplete: handleSessionComplete,
    onRestComplete: handleRestComplete,
  })

  const saveSession = useCallback(
    async (mood: Mood) => {
      if (isSavingRef.current) {
        return
      }

      isSavingRef.current = true

      try {
        await addSession(
          createSession({
            id: crypto.randomUUID(),
            date: new Date().toISOString(),
            durationMinutes: settings.focusMinutes,
            mood,
          }),
        )
        setIsMoodFormOpen(false)
      } finally {
        isSavingRef.current = false
      }
    },
    [addSession, settings.focusMinutes],
  )

  const handleSkip = useCallback(() => saveSession('neutral'), [saveSession])

  return (
    <section
      id="timer"
      aria-labelledby="timer-title"
      className="mx-auto flex w-full max-w-md flex-col gap-3 text-center"
    >
      <div className="flex items-baseline justify-between gap-2 text-left">
        <h1 id="timer-title" className="font-display text-xl font-semibold tracking-tight text-ink">
          Timer fokus
        </h1>
        <p className="text-xs text-muted">
          {todayCount === 0
            ? 'Belum ada sesi selesai hari ini.'
            : `${todayCount} sesi selesai hari ini.`}
        </p>
      </div>
      <p id="duration-summary" className="-mt-2 text-left text-xs text-muted">
        Sesi fokus {settings.focusMinutes} menit, lalu istirahat {settings.breakMinutes} menit.
      </p>

      <div className={isMoodFormOpen ? 'hidden' : 'w-full'}>
        <Timer timer={timer} active={isActive && !isMoodFormOpen} />
      </div>
      {isMoodFormOpen ? <MoodForm onSave={saveSession} onSkip={handleSkip} /> : null}

      <DurationSettings
        key={`${settings.focusMinutes}-${settings.breakMinutes}`}
        settings={settings}
        disabled={timer.status !== 'idle'}
        isLoading={isLoading}
        error={error}
        onSave={saveSettings}
      />
      <NotificationSettings permission={permission} onRequest={requestPermission} />

      {inlineNotice !== null ? (
        <InlineNotification
          message={inlineNotice.message}
          onDismiss={() => setInlineNotice(null)}
        />
      ) : null}
    </section>
  )
}
