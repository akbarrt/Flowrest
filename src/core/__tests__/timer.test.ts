import { describe, expect, test } from 'vitest'
import {
  BREAK_DURATION_MS,
  FOCUS_DURATION_MS,
  createTimerState,
  pauseTimer,
  remainingTime,
  resetTimer,
  resumeTimer,
  startTimer,
  tickTimer,
} from '../timer'

const MINUTE = 60 * 1000

describe('createTimerState', () => {
  test('starts in focus, idle, with a full focus duration', () => {
    const state = createTimerState()

    expect(state.phase).toBe('focus')
    expect(state.status).toBe('idle')
    expect(state.remainingMs).toBe(FOCUS_DURATION_MS)
    expect(state.segmentStartedAt).toBeNull()
  })
})

describe('startTimer', () => {
  test('moves an idle timer to running and records the start time', () => {
    const started = startTimer(createTimerState(), 1000)

    expect(started.status).toBe('running')
    expect(started.segmentStartedAt).toBe(1000)
    expect(started.remainingMs).toBe(FOCUS_DURATION_MS)
  })

  test('does nothing when the timer is already running', () => {
    const running = startTimer(createTimerState(), 1000)

    expect(startTimer(running, 5000)).toBe(running)
  })
})

describe('pauseTimer', () => {
  test('keeps the time left based on the elapsed timestamp', () => {
    const running = startTimer(createTimerState(), 0)
    const paused = pauseTimer(running, 10 * MINUTE)

    expect(paused.status).toBe('paused')
    expect(paused.remainingMs).toBe(FOCUS_DURATION_MS - 10 * MINUTE)
    expect(paused.segmentStartedAt).toBeNull()
  })

  test('does nothing when the timer is not running', () => {
    const idle = createTimerState()

    expect(pauseTimer(idle, 1000)).toBe(idle)
  })
})

describe('resumeTimer', () => {
  test('continues from the remaining time', () => {
    const running = startTimer(createTimerState(), 0)
    const paused = pauseTimer(running, 10 * MINUTE)
    const resumed = resumeTimer(paused, 20 * MINUTE)

    expect(resumed.status).toBe('running')
    expect(resumed.segmentStartedAt).toBe(20 * MINUTE)
    expect(remainingTime(resumed, 20 * MINUTE)).toBe(FOCUS_DURATION_MS - 10 * MINUTE)
  })

  test('does nothing when the timer is not paused', () => {
    const idle = createTimerState()

    expect(resumeTimer(idle, 1000)).toBe(idle)
  })
})

describe('resetTimer', () => {
  test('returns to an idle focus timer from any phase', () => {
    const running = startTimer(createTimerState(), 0)
    const onBreak = tickTimer(running, FOCUS_DURATION_MS).state
    expect(onBreak.phase).toBe('break')

    const reset = resetTimer()

    expect(reset.phase).toBe('focus')
    expect(reset.status).toBe('idle')
    expect(reset.remainingMs).toBe(FOCUS_DURATION_MS)
    expect(reset.segmentStartedAt).toBeNull()
  })
})

describe('remainingTime', () => {
  test('counts down from the start timestamp', () => {
    const running = startTimer(createTimerState(), 5000)

    expect(remainingTime(running, 5000)).toBe(FOCUS_DURATION_MS)
    expect(remainingTime(running, 5000 + MINUTE)).toBe(FOCUS_DURATION_MS - MINUTE)
  })

  test('never returns a negative value', () => {
    const running = startTimer(createTimerState(), 0)

    expect(remainingTime(running, FOCUS_DURATION_MS * 2)).toBe(0)
  })
})

describe('tickTimer', () => {
  test('keeps the focus phase while time remains', () => {
    const running = startTimer(createTimerState(), 0)
    const result = tickTimer(running, MINUTE)

    expect(result.phaseCompleted).toBeNull()
    expect(result.state).toBe(running)
  })

  test('moves to an idle break when the focus phase completes', () => {
    const running = startTimer(createTimerState(), 0)
    const result = tickTimer(running, FOCUS_DURATION_MS)

    expect(result.phaseCompleted).toBe('focus')
    expect(result.state.phase).toBe('break')
    expect(result.state.status).toBe('idle')
    expect(result.state.remainingMs).toBe(BREAK_DURATION_MS)
    expect(result.state.segmentStartedAt).toBeNull()
  })

  test('returns to an idle focus timer when the break completes', () => {
    const running = startTimer(createTimerState(), 0)
    const onBreak = tickTimer(running, FOCUS_DURATION_MS).state
    const breakRunning = startTimer(onBreak, 1000)
    const result = tickTimer(breakRunning, 1000 + BREAK_DURATION_MS)

    expect(result.phaseCompleted).toBe('break')
    expect(result.state.phase).toBe('focus')
    expect(result.state.status).toBe('idle')
    expect(result.state.remainingMs).toBe(FOCUS_DURATION_MS)
  })

  test('does nothing when the timer is not running', () => {
    const idle = createTimerState()
    const result = tickTimer(idle, 1000)

    expect(result.phaseCompleted).toBeNull()
    expect(result.state).toBe(idle)
  })
})
