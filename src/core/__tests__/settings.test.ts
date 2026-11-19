import { describe, expect, test } from 'vitest'
import {
  DEFAULT_TIMER_SETTINGS,
  parseTimerSettings,
  timerDurationsFromSettings,
} from '../settings'

describe('parseTimerSettings', () => {
  test('returns defaults for missing or malformed values', () => {
    expect(parseTimerSettings(null)).toEqual(DEFAULT_TIMER_SETTINGS)
    expect(parseTimerSettings({ focusMinutes: 0, breakMinutes: 181 })).toEqual(
      DEFAULT_TIMER_SETTINGS,
    )
    expect(parseTimerSettings({ focusMinutes: 12.5, breakMinutes: '5' })).toEqual(
      DEFAULT_TIMER_SETTINGS,
    )
  })

  test('keeps valid minute values', () => {
    expect(parseTimerSettings({ focusMinutes: 50, breakMinutes: 10 })).toEqual({
      focusMinutes: 50,
      breakMinutes: 10,
    })
  })

  test('falls back per field when only one value is invalid', () => {
    expect(parseTimerSettings({ focusMinutes: 15, breakMinutes: 0 })).toEqual({
      focusMinutes: 15,
      breakMinutes: DEFAULT_TIMER_SETTINGS.breakMinutes,
    })
  })
})

describe('timerDurationsFromSettings', () => {
  test('converts minutes to milliseconds', () => {
    expect(timerDurationsFromSettings({ focusMinutes: 15, breakMinutes: 3 })).toEqual({
      focusDurationMs: 15 * 60 * 1000,
      breakDurationMs: 3 * 60 * 1000,
    })
  })
})
