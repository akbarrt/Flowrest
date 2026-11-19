import { BREAK_DURATION_MS, FOCUS_DURATION_MS } from './timer'
import type { TimerDurations } from './timer'

export const MIN_TIMER_MINUTES = 1
export const MAX_TIMER_MINUTES = 180

export interface TimerSettings {
  focusMinutes: number
  breakMinutes: number
}

export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  focusMinutes: FOCUS_DURATION_MS / (60 * 1000),
  breakMinutes: BREAK_DURATION_MS / (60 * 1000),
}

function normalizeMinutes(value: unknown, fallback: number): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    return fallback
  }

  if (value < MIN_TIMER_MINUTES || value > MAX_TIMER_MINUTES) {
    return fallback
  }

  return value
}

export function parseTimerSettings(value: unknown): TimerSettings {
  if (typeof value !== 'object' || value === null) {
    return DEFAULT_TIMER_SETTINGS
  }

  const candidate = value as Record<string, unknown>

  return {
    focusMinutes: normalizeMinutes(
      candidate.focusMinutes,
      DEFAULT_TIMER_SETTINGS.focusMinutes,
    ),
    breakMinutes: normalizeMinutes(
      candidate.breakMinutes,
      DEFAULT_TIMER_SETTINGS.breakMinutes,
    ),
  }
}

export function timerDurationsFromSettings(settings: TimerSettings): TimerDurations {
  return {
    focusDurationMs: settings.focusMinutes * 60 * 1000,
    breakDurationMs: settings.breakMinutes * 60 * 1000,
  }
}
