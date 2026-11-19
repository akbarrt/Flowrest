export const FOCUS_DURATION_MS = 25 * 60 * 1000
export const BREAK_DURATION_MS = 5 * 60 * 1000

export type TimerPhase = 'focus' | 'break'
export type TimerStatus = 'idle' | 'running' | 'paused'

export interface TimerDurations {
  focusDurationMs: number
  breakDurationMs: number
}

export const DEFAULT_DURATIONS: TimerDurations = {
  focusDurationMs: FOCUS_DURATION_MS,
  breakDurationMs: BREAK_DURATION_MS,
}

export interface TimerState extends TimerDurations {
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

function durationFor(durations: TimerDurations, phase: TimerPhase): number {
  return phase === 'focus' ? durations.focusDurationMs : durations.breakDurationMs
}

function createPhaseState(phase: TimerPhase, durations: TimerDurations): TimerState {
  return {
    phase,
    status: 'idle',
    remainingMs: durationFor(durations, phase),
    segmentStartedAt: null,
    focusDurationMs: durations.focusDurationMs,
    breakDurationMs: durations.breakDurationMs,
  }
}

export function createTimerState(
  phase: TimerPhase = 'focus',
  durations: TimerDurations = DEFAULT_DURATIONS,
): TimerState {
  return createPhaseState(phase, durations)
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

export function resetTimer(
  phase: TimerPhase = 'focus',
  durations: TimerDurations = DEFAULT_DURATIONS,
): TimerState {
  return createPhaseState(phase, durations)
}

/**
 * Memakai durasi baru hanya ketika timer idle. Fase yang sedang dipilih dipertahankan
 * supaya pengguna tidak dikirim kembali ke fokus hanya karena mengubah pengaturan.
 */
export function withDurations(state: TimerState, durations: TimerDurations): TimerState {
  if (
    state.status !== 'idle' ||
    (state.focusDurationMs === durations.focusDurationMs &&
      state.breakDurationMs === durations.breakDurationMs)
  ) {
    return state
  }

  return createPhaseState(state.phase, durations)
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
    state: createPhaseState(nextPhase, state),
    phaseCompleted: state.phase,
  }
}
