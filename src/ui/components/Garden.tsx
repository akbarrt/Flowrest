import { useState } from 'react'
import type { GardenFlower } from '../../core/garden'
import { FLOWER_LABELS, MOOD_LABELS } from '../labels'
import { Flower } from './Flower'

const dateFormatter = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
})

function formatDate(value: string): string {
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date)
}

type GardenProps = {
  flowers: GardenFlower[]
}

export function Garden({ flowers }: GardenProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null)

  return (
    <ul className="divide-y divide-line border-y border-line">
      {flowers.map((flower, index) => {
        const isSelected = flower.sessionId === selectedId
        const detailId = `flower-detail-${index}`

        return (
          <li key={flower.sessionId}>
            <button
              type="button"
              aria-expanded={isSelected}
              aria-controls={detailId}
              onClick={() => setSelectedId(isSelected ? null : flower.sessionId)}
              className="flex min-h-16 w-full items-center gap-4 px-2 py-3 text-left transition-colors hover:bg-surface active:bg-line/30 motion-reduce:transition-none"
            >
              <Flower type={flower.flower} />
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-base font-medium text-ink">
                  {FLOWER_LABELS[flower.flower]}
                </span>
                <span className="text-sm text-muted">{formatDate(flower.date)}</span>
              </span>
              <span aria-hidden="true" className="text-lg text-muted">
                {isSelected ? '\u2212' : '+'}
              </span>
            </button>
            <div id={detailId} hidden={!isSelected}>
              <dl className="grid gap-x-4 gap-y-1 border-t border-line px-2 py-4 text-sm sm:grid-cols-[8rem_1fr] sm:pl-16">
                <dt className="text-muted">Tanggal</dt>
                <dd className="text-ink">{formatDate(flower.date)}</dd>
                <dt className="text-muted">Mood</dt>
                <dd className="text-ink">{MOOD_LABELS[flower.mood]}</dd>
                <dt className="text-muted">Jenis bunga</dt>
                <dd className="text-ink">{FLOWER_LABELS[flower.flower]}</dd>
              </dl>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
