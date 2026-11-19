import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { MOODS } from '../../core/types'
import type { Mood } from '../../core/types'
import { MOOD_LABELS } from '../labels'

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
    <form onSubmit={handleSubmit} className="w-full max-w-md border-t border-line pt-3 text-left">
      <h2 className="font-display text-base font-semibold text-ink">Bagaimana suasana hatimu?</h2>
      <p className="mt-0.5 text-xs text-muted">
        Pilih satu mood untuk sesi fokus tadi, atau lewati.
      </p>
      <fieldset className="mt-2" disabled={isSaving}>
        <legend className="sr-only">Mood sesi</legend>
        <div className="grid grid-cols-2 gap-x-2 gap-y-1">
          {MOODS.map((mood) => (
            <label
              key={mood}
              className="flex min-h-11 cursor-pointer items-center gap-2 px-1 text-sm text-ink"
            >
              <input
                type="radio"
                name="mood"
                value={mood}
                checked={selectedMood === mood}
                onChange={() => setSelectedMood(mood)}
                required
                className="h-4 w-4 shrink-0 accent-moss"
              />
              <span>{MOOD_LABELS[mood]}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="submit"
          disabled={isSaving}
          className="min-h-11 rounded-md bg-moss px-4 text-sm font-medium text-white transition-colors hover:bg-moss/90 active:bg-moss/80 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Simpan mood
        </button>
        <button
          type="button"
          onClick={handleSkip}
          disabled={isSaving}
          className="min-h-11 rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 disabled:opacity-[0.45] motion-reduce:transition-none"
        >
          Lewati
        </button>
      </div>
    </form>
  )
}
