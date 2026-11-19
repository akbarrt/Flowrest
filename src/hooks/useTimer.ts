import { useCallback, useEffect, useRef, useState } from 'react'
import {
  DEFAULT_DURATIONS,
  createTimerState,
  finishEarly as finishEarlyTimer,
  pauseTimer,
  remainingTime,
  resetTimer,
  skipBreak as skipBreakTimer,
  startTimer,
  tickTimer,
  withDurations,
} from '../core/timer'
import type { TimerDurations, TimerPhase, TimerState, TimerStatus } from '../core/timer'

const TICK_INTERVAL_MS = 250

export interface UseTimerOptions {
  /** Dipanggil tepat sekali saat fase focus selesai. */
  onSessionComplete?: () => void
  durations?: TimerDurations
}

export interface UseTimerResult {
  phase: TimerPhase
  status: TimerStatus
  /** Sisa waktu dalam milidetik, dihitung dari timestamp. */
  remainingMs: number
  durations: TimerDurations
  start: () => void
  pause: () => void
  reset: () => void
  finishEarly: () => void
  skipBreak: () => void
}

interface TimerView {
  phase: TimerPhase
  status: TimerStatus
  remainingMs: number
  durations: TimerDurations
}

function toView(state: TimerState, now: number): TimerView {
  return {
    phase: state.phase,
    status: state.status,
    remainingMs: remainingTime(state, now),
    durations: {
      focusDurationMs: state.focusDurationMs,
      breakDurationMs: state.breakDurationMs,
    },
  }
}

export function useTimer(options: UseTimerOptions = {}): UseTimerResult {
  const { onSessionComplete, durations = DEFAULT_DURATIONS } = options
  const stateRef = useRef<TimerState>(createTimerState('focus', durations))
  const onCompleteRef = useRef(onSessionComplete)
  const [view, setView] = useState<TimerView>(() => ({
    phase: 'focus',
    status: 'idle',
    remainingMs: durations.focusDurationMs,
    durations: {
      focusDurationMs: durations.focusDurationMs,
      breakDurationMs: durations.breakDurationMs,
    },
  }))

  useEffect(() => {
    onCompleteRef.current = onSessionComplete
  }, [onSessionComplete])

  useEffect(() => {
    const current = stateRef.current
    const next = withDurations(current, durations)

    if (next !== current) {
      stateRef.current = next
      setView(toView(next, Date.now()))
    }
  }, [durations])

  useEffect(() => {
    if (view.status !== 'running') {
      return
    }

    const id = window.setInterval(() => {
      const now = Date.now()
      const result = tickTimer(stateRef.current, now)

      stateRef.current = result.state
      setView(toView(result.state, now))

      if (result.phaseCompleted === 'focus') {
        onCompleteRef.current?.()
      }
    }, TICK_INTERVAL_MS)

    return () => window.clearInterval(id)
  }, [view.status])

  const start = useCallback(() => {
    const now = Date.now()
    const next = startTimer(stateRef.current, now)

    stateRef.current = next
    setView(toView(next, now))
  }, [])

  const pause = useCallback(() => {
    const now = Date.now()
    const next = pauseTimer(stateRef.current, now)

    stateRef.current = next
    setView(toView(next, now))
  }, [])

  const reset = useCallback(() => {
    const now = Date.now()
    const next = resetTimer('focus', stateRef.current)

    stateRef.current = next
    setView(toView(next, now))
  }, [])

  const finishEarly = useCallback(() => {
    const next = finishEarlyTimer(stateRef.current)
    if (next === stateRef.current) {
      return
    }

    stateRef.current = next
    setView(toView(next, Date.now()))
  }, [])

  const skipBreak = useCallback(() => {
    const next = skipBreakTimer(stateRef.current)
    if (next === stateRef.current) {
      return
    }

    stateRef.current = next
    setView(toView(next, Date.now()))
  }, [])

  return {
    phase: view.phase,
    status: view.status,
    remainingMs: view.remainingMs,
    durations: view.durations,
    start,
    pause,
    reset,
    finishEarly,
    skipBreak,
  }
}
