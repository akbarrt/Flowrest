import { useCallback, useEffect } from 'react'
import type { UseTimerResult } from '../../hooks/useTimer'

const RING_RADIUS = 54
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS

type TimerProps = {
  timer: UseTimerResult
  active?: boolean
}

function formatTime(remainingMs: number): string {
  const totalSeconds = Math.ceil(remainingMs / 1000)
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}

function isTextEntryTarget(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) {
    return false
  }

  const tag = target.tagName

  return (
    target.isContentEditable ||
    tag === 'INPUT' ||
    tag === 'TEXTAREA' ||
    tag === 'SELECT' ||
    tag === 'BUTTON' ||
    tag === 'A'
  )
}

export function Timer({ timer, active = true }: TimerProps) {
  const { phase, status, remainingMs, durations, start, pause, reset, finishEarly, skipBreak } =
    timer

  const handleToggle = useCallback(() => {
    if (status === 'running') {
      pause()
      return
    }

    start()
  }, [pause, start, status])

  useEffect(() => {
    if (!active) {
      return
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey) {
        return
      }

      if (isTextEntryTarget(event.target)) {
        return
      }

      if (event.code === 'Space') {
        event.preventDefault()
        handleToggle()
        return
      }

      if (event.key === 'r' || event.key === 'R') {
        event.preventDefault()
        reset()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [active, handleToggle, reset])

  const totalMs = phase === 'focus' ? durations.focusDurationMs : durations.breakDurationMs
  const remainingFraction = Math.min(1, Math.max(0, remainingMs / totalMs))
  const dashOffset = RING_CIRCUMFERENCE * (1 - remainingFraction)
  const ringColor = phase === 'focus' ? 'var(--color-moss)' : 'var(--color-sage)'

  const phaseLabel = phase === 'focus' ? 'Sesi fokus' : 'Istirahat'
  const primaryLabel = status === 'running' ? 'Jeda' : status === 'paused' ? 'Lanjut' : 'Mulai'
  const statusLabel =
    status === 'running'
      ? 'Sedang berjalan'
      : status === 'paused'
        ? 'Dijeda'
        : phase === 'break'
          ? 'Siap untuk istirahat'
          : 'Siap dimulai'
  const resetDisabled =
    phase === 'focus' && status === 'idle' && remainingMs === durations.focusDurationMs
  const showFinishEarly = phase === 'focus' && status !== 'idle'
  const showSkipBreak = phase === 'break'

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="relative aspect-square w-full max-w-[13rem] sm:max-w-[15rem]">
        <svg viewBox="0 0 120 120" aria-hidden="true" className="h-full w-full -rotate-90">
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke="var(--color-line)"
            strokeWidth="6"
          />
          <circle
            cx="60"
            cy="60"
            r={RING_RADIUS}
            fill="none"
            stroke={ringColor}
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={RING_CIRCUMFERENCE}
            strokeDashoffset={dashOffset}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          <p className="text-sm font-medium text-moss">{phaseLabel}</p>
          <p
            role="timer"
            aria-live="polite"
            aria-atomic="true"
            className="font-display text-4xl font-semibold tabular-nums tracking-tight text-ink sm:text-5xl"
          >
            {formatTime(remainingMs)}
          </p>
          <p className="text-sm text-muted">{statusLabel}</p>
        </div>
      </div>
      <div className="flex w-full flex-wrap items-center justify-center gap-2">
        <button
          type="button"
          onClick={handleToggle}
          className="min-h-11 min-w-20 rounded-md bg-moss px-3 text-sm font-medium text-white transition-colors hover:bg-moss/90 active:bg-moss/80 motion-reduce:transition-none"
        >
          {primaryLabel}
        </button>
        <button
          type="button"
          onClick={reset}
          disabled={resetDisabled}
          className="min-h-11 min-w-20 rounded-md border border-line bg-surface px-3 text-sm font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Reset
        </button>
        {showFinishEarly ? (
          <button
            type="button"
            onClick={finishEarly}
            className="min-h-11 rounded-md border border-line bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 motion-reduce:transition-none"
          >
            Selesai lebih awal
          </button>
        ) : null}
        {showSkipBreak ? (
          <button
            type="button"
            onClick={skipBreak}
            className="min-h-11 rounded-md border border-line bg-surface px-3 text-xs font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 motion-reduce:transition-none"
          >
            Lewati istirahat
          </button>
        ) : null}
      </div>
      <p className="hidden text-xs text-muted sm:block">
        Tekan Space untuk mulai atau jeda, R untuk reset.
      </p>
    </div>
  )
}
