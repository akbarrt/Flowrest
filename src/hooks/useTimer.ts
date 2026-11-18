import { useCallback, useEffect, useRef, useState } from 'react'
import {
  createTimerState,
  pauseTimer,
  remainingTime,
  resetTimer,
  startTimer,
  tickTimer,
} from '../core/timer'
import type { TimerPhase, TimerState, TimerStatus } from '../core/timer'

const TICK_INTERVAL_MS = 250

export interface UseTimerOptions {
  /** Dipanggil tepat sekali saat fase focus selesai. */
  onSessionComplete?: () => void
}

export interface UseTimerResult {
  phase: TimerPhase
  status: TimerStatus
  /** Sisa waktu dalam milidetik, dihitung dari timestamp. */
  remainingMs: number
  start: () => void
  pause: () => void
  reset: () => void
}

interface TimerView {
  phase: TimerPhase
  status: TimerStatus
  remainingMs: number
}

function toView(state: TimerState, now: number): TimerView {
  return {
    phase: state.phase,
    status: state.status,
    remainingMs: remainingTime(state, now),
  }
}

export function useTimer(options: UseTimerOptions = {}): UseTimerResult {
  const { onSessionComplete } = options
  const stateRef = useRef<TimerState>(createTimerState())
  const onCompleteRef = useRef(onSessionComplete)
  const [view, setView] = useState<TimerView>(() => toView(createTimerState(), Date.now()))

  useEffect(() => {
    onCompleteRef.current = onSessionComplete
  }, [onSessionComplete])

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
    const next = resetTimer()

    stateRef.current = next
    setView(toView(next, now))
  }, [])

  return {
    phase: view.phase,
    status: view.status,
    remainingMs: view.remainingMs,
    start,
    pause,
    reset,
  }
}
