import { useCallback, useMemo, useRef, useState } from 'react'
import { createSession } from '../../core/session'
import { timerDurationsFromSettings } from '../../core/settings'
import { countSessionsToday } from '../../core/stats'
import type { Mood } from '../../core/types'
import { useSessions } from '../../hooks/useSessions'
import { useSettings } from '../../hooks/useSettings'
import { useTimer } from '../../hooks/useTimer'
import { DurationSettings } from '../components/DurationSettings'
import { MoodForm } from '../components/MoodForm'
import { Timer } from '../components/Timer'

export function HomePage({ isActive }: { isActive: boolean }) {
  const { sessions, addSession } = useSessions()
  const { settings, isLoading, error, saveSettings } = useSettings()
  const durations = useMemo(() => timerDurationsFromSettings(settings), [settings])
  const todayCount = countSessionsToday(sessions)
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const isSavingRef = useRef(false)

  const handleSessionComplete = useCallback(() => {
    setIsMoodFormOpen(true)
  }, [])

  const timer = useTimer({ durations, onSessionComplete: handleSessionComplete })

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
      className="mx-auto flex w-full max-w-md flex-col items-center gap-8 py-4 text-center sm:py-10"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="timer-title"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Timer fokus
        </h1>
        <p className="text-base leading-relaxed text-muted">
          Sesi fokus {settings.focusMinutes} menit, lalu jeda {settings.breakMinutes} menit.
        </p>
        <p className="text-sm text-muted">
          {todayCount === 0
            ? 'Belum ada sesi selesai hari ini.'
            : `${todayCount} sesi selesai hari ini.`}
        </p>
      </div>
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
    </section>
  )
}
