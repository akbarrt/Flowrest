import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MOODS } from '../../core/types'
import type { Mood } from '../../core/types'

const MOOD_LABELS: Record<Mood, string> = {
  very_bad: 'Sangat tidak baik',
  bad: 'Kurang baik',
  neutral: 'Biasa saja',
  good: 'Baik',
  great: 'Sangat baik',
}

type MoodFormProps = {
  onSave: (mood: Mood) => Promise<void>
  onSkip: () => Promise<void>
}

export function MoodForm({ onSave, onSkip }: MoodFormProps) {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const isSavingRef = useRef(false)

  async function runSave(action: () => Promise<void>) {
    if (isSavingRef.current) {
      return
    }

    isSavingRef.current = true
    setIsSaving(true)

    try {
      await action()
    } catch {
      isSavingRef.current = false
      setIsSaving(false)
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (selectedMood === null) {
      return
    }

    void runSave(() => onSave(selectedMood))
  }

  function handleSkip() {
    void runSave(onSkip)
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md border-t border-line pt-6 text-left"
    >
      <h2 className="font-display text-xl font-semibold text-ink">Bagaimana suasana hatimu?</h2>
      <p className="mt-1 text-sm leading-relaxed text-muted">
        Pilih satu mood untuk sesi fokus tadi, atau lewati.
      </p>
      <fieldset className="mt-4" disabled={isSaving}>
        <legend className="sr-only">Mood sesi</legend>
        <div className="divide-y divide-line border-y border-line">
          {MOODS.map((mood) => (
            <label
              key={mood}
              className="flex min-h-11 cursor-pointer items-center gap-3 px-1 py-2 text-base text-ink"
            >
              <input
                type="radio"
                name="mood"
                value={mood}
                checked={selectedMood === mood}
                onChange={() => setSelectedMood(mood)}
                required
                className="h-4 w-4 accent-moss"
              />
              <span>{MOOD_LABELS[mood]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving}
          className="min-h-11 rounded-md bg-moss px-6 text-base font-medium text-white transition-colors hover:bg-moss/90 active:bg-moss/80 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Simpan mood
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSaving}
          className="min-h-11 rounded-md border border-line bg-surface px-6 text-base font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Lewati
        </button>
      </div>
    </form>
  )
}
