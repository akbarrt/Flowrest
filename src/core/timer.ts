export const FOCUS_DURATION_MS = 25 * 60 * 1000
export const BREAK_DURATION_MS = 5 * 60 * 1000

export type TimerPhase = 'focus' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerState {
  phase: TimerPhase
  status: TimerStatus
  /** Sisa waktu saat `segmentStartedAt` dicatat, atau sisa waktu saat ini ketika tidak berjalan. */
  remainingMs: number
  /** Epoch ms saat segmen berjalan dimulai; null ketika idle atau jeda. */
  segmentStartedAt: number | null
}

export interface TimerTick {
  state: TimerState
  phaseCompleted: TimerPhase | null
}

const PHASE_DURATION_MS: Record<TimerPhase, number> = {
  focus: FOCUS_DURATION_MS,
  break: BREAK_DURATION_MS,
}

function createPhaseState(phase: TimerPhase): TimerState {
  return {
    phase,
    status: 'idle',
    remainingMs: PHASE_DURATION_MS[phase],
    segmentStartedAt: null,
  }
}

export function createTimerState(): TimerState {
  return createPhaseState('focus')
}

export function startTimer(state: TimerState, now: number): TimerState {
  if (state.status === 'running') {
    return state
  }

  return {
    ...state,
    status: 'running',
    segmentStartedAt: now,
  }
}

export function pauseTimer(state: TimerState, now: number): TimerState {
  if (state.status !== 'running' || state.segmentStartedAt === null) {
    return state
  }

  return {
    ...state,
    status: 'paused',
    remainingMs: remainingTime(state, now),
    segmentStartedAt: null,
  }
}

export function resumeTimer(state: TimerState, now: number): TimerState {
  if (state.status !== 'paused') {
    return state
  }

  return startTimer(state, now)
}

export function resetTimer(): TimerState {
  return createPhaseState('focus')
}

export function remainingTime(state: TimerState, now: number): number {
  if (state.status !== 'running' || state.segmentStartedAt === null) {
    return state.remainingMs
  }

  const elapsed = now - state.segmentStartedAt
  return Math.max(0, state.remainingMs - elapsed)
}

export function tickTimer(state: TimerState, now: number): TimerTick {
  if (state.status !== 'running') {
    return { state, phaseCompleted: null }
  }

  if (remainingTime(state, now) > 0) {
    return { state, phaseCompleted: null }
  }

  const nextPhase: TimerPhase = state.phase === 'focus' ? 'break' : 'focus'

  return {
    state: createPhaseState(nextPhase),
    phaseCompleted: state.phase,
  }
}
