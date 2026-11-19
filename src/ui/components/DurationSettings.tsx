import { useState } from 'react'
import { MAX_TIMER_MINUTES, MIN_TIMER_MINUTES } from '../../core/settings'
import type { TimerSettings } from '../../core/settings'

const PRESETS: ReadonlyArray<{ label: string; settings: TimerSettings }> = [
  { label: '25 / 5', settings: { focusMinutes: 25, breakMinutes: 5 } },
  { label: '50 / 10', settings: { focusMinutes: 50, breakMinutes: 10 } },
  { label: '15 / 3', settings: { focusMinutes: 15, breakMinutes: 3 } },
]

type DurationSettingsProps = {
  settings: TimerSettings
  disabled: boolean
  isLoading: boolean
  error: string | null
  onSave: (settings: TimerSettings) => Promise<void>
}

function isValidMinute(value: string): boolean {
  const parsed = Number(value)

  return (
    value.trim() !== '' &&
    Number.isInteger(parsed) &&
    parsed >= MIN_TIMER_MINUTES &&
    parsed <= MAX_TIMER_MINUTES
  )
}

export function DurationSettings({
  settings,
  disabled,
  isLoading,
  error,
  onSave,
}: DurationSettingsProps) {
  const [focusMinutes, setFocusMinutes] = useState(String(settings.focusMinutes))
  const [breakMinutes, setBreakMinutes] = useState(String(settings.breakMinutes))
  const [isSaving, setIsSaving] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const locked = disabled || isLoading || isSaving

  const activePreset = PRESETS.find(
    (preset) =>
      preset.settings.focusMinutes === settings.focusMinutes &&
      preset.settings.breakMinutes === settings.breakMinutes,
  )

  const isDirty =
    Number(focusMinutes) !== settings.focusMinutes ||
    Number(breakMinutes) !== settings.breakMinutes

  async function commit(next: TimerSettings) {
    if (locked) {
      return
    }

    setIsSaving(true)
    setLocalError(null)

    try {
      await onSave(next)
    } finally {
      setIsSaving(false)
    }
  }

  async function handleManualSave() {
    if (!isValidMinute(focusMinutes) || !isValidMinute(breakMinutes)) {
      setLocalError(`Isi angka bulat antara ${MIN_TIMER_MINUTES} dan ${MAX_TIMER_MINUTES}.`)
      return
    }

    await commit({
      focusMinutes: Number(focusMinutes),
      breakMinutes: Number(breakMinutes),
    })
  }

  return (
    <section
      aria-labelledby="duration-title"
      className="w-full rounded-xl border border-line bg-surface p-4 text-left sm:p-5"
    >
      <div className="flex flex-col gap-1">
        <h2 id="duration-title" className="font-display text-lg font-semibold text-ink">
          Durasi sesi
        </h2>
        <p className="text-sm leading-relaxed text-muted">
          Pilih preset atau isi sendiri. Berlaku untuk sesi berikutnya.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Preset durasi">
        {PRESETS.map((preset) => (
          <button
            key={preset.label}
            type="button"
            disabled={locked}
            aria-pressed={activePreset?.label === preset.label}
            onClick={() => void commit(preset.settings)}
            className="min-h-11 rounded-md border border-line bg-paper px-3 text-sm font-medium text-ink transition-colors hover:bg-line/40 active:bg-line/60 aria-pressed:border-moss aria-pressed:bg-moss aria-pressed:text-white disabled:opacity-[0.45] motion-reduce:transition-none"
          >
            {preset.label}
          </button>
        ))}
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="focus-minutes" className="text-sm font-medium text-ink">
            Fokus (menit)
          </label>
          <input
            id="focus-minutes"
            type="number"
            inputMode="numeric"
            min={MIN_TIMER_MINUTES}
            max={MAX_TIMER_MINUTES}
            step={1}
            value={focusMinutes}
            disabled={locked}
            aria-invalid={localError !== null}
            aria-describedby={localError !== null ? 'duration-error' : undefined}
            onChange={(event) => {
              setFocusMinutes(event.target.value)
              setLocalError(null)
            }}
            className="min-h-11 w-full rounded-md border border-line bg-paper px-3 text-base text-ink"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="break-minutes" className="text-sm font-medium text-ink">
            Istirahat (menit)
          </label>
          <input
            id="break-minutes"
            type="number"
            inputMode="numeric"
            min={MIN_TIMER_MINUTES}
            max={MAX_TIMER_MINUTES}
            step={1}
            value={breakMinutes}
            disabled={locked}
            aria-invalid={localError !== null}
            aria-describedby={localError !== null ? 'duration-error' : undefined}
            onChange={(event) => {
              setBreakMinutes(event.target.value)
              setLocalError(null)
            }}
            className="min-h-11 w-full rounded-md border border-line bg-paper px-3 text-base text-ink"
          />
        </div>
      </div>

      {localError !== null ? (
        <p id="duration-error" role="alert" className="mt-3 text-sm text-danger">
          {localError}
        </p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={locked || !isDirty}
          onClick={() => void handleManualSave()}
          className="min-h-11 rounded-md bg-moss px-5 text-sm font-medium text-white transition-colors hover:bg-moss/90 active:bg-moss/80 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Simpan durasi
        </button>
        {disabled ? (
          <p className="text-xs text-muted">Durasi bisa diubah saat timer tidak berjalan.</p>
        ) : null}
      </div>

      {error !== null ? (
        <p role="alert" className="mt-3 text-sm text-danger">
          {error}
        </p>
      ) : null}
    </section>
  )
}
