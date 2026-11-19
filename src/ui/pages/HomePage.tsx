import { useCallback, useRef, useState } from 'react'
import { createSession } from '../../core/session'
import { FOCUS_DURATION_MS } from '../../core/timer'
import type { Mood } from '../../core/types'
import { useSessions } from '../../hooks/useSessions'
import { MoodForm } from '../components/MoodForm'
import { Timer } from '../components/Timer'

const SESSION_MINUTES = FOCUS_DURATION_MS / (60 * 1000)

export function HomePage({ isActive }: { isActive: boolean }) {
  const { addSession } = useSessions()
  const [isMoodFormOpen, setIsMoodFormOpen] = useState(false)
  const isSavingRef = useRef(false)

  const handleSessionComplete = useCallback(() => {
    setIsMoodFormOpen(true)
  }, [])

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
            durationMinutes: SESSION_MINUTES,
            mood,
          }),
        )
        setIsMoodFormOpen(false)
      } finally {
        isSavingRef.current = false
      }
    },
    [addSession],
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
          Sesi fokus 25 menit, lalu jeda 5 menit.
        </p>
      </div>
      <div className={isMoodFormOpen ? 'hidden' : 'w-full'}>
        <Timer
          onSessionComplete={handleSessionComplete}
          active={isActive && !isMoodFormOpen}
        />
      </div>
      {isMoodFormOpen ? <MoodForm onSave={saveSession} onSkip={handleSkip} /> : null}
    </section>
  )
}
