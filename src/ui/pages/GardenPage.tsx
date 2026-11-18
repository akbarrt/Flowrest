import { deriveFlowers } from '../../core/garden'
import { useSessions } from '../../hooks/useSessions'
import { Garden } from '../components/Garden'

function GardenSkeleton() {
  return (
    <div>
      <p role="status" className="sr-only">
        Memuat kebun...
      </p>
      <ul
        aria-hidden="true"
        className="divide-y divide-line border-y border-line"
      >
        {[0, 1, 2].map((row) => (
          <li key={row} className="flex min-h-16 items-center gap-4 px-2 py-3">
            <span className="h-10 w-10 shrink-0 rounded-full bg-line/60" />
            <span className="flex flex-1 flex-col gap-2">
              <span className="h-4 w-24 rounded bg-line/60" />
              <span className="h-3 w-36 rounded bg-line/40" />
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function EmptyGarden() {
  return (
    <div className="border-y border-line py-12 text-center">
      <p className="font-display text-xl font-semibold text-ink">
        Kebunmu masih kosong.
      </p>
      <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted">
        Setiap sesi fokus menanam satu bunga. Mulai sesi pertama untuk melihat
        kebunmu tumbuh.
      </p>
      <a
        href="#timer"
        className="mt-6 inline-flex min-h-11 items-center rounded-md bg-moss px-6 text-base font-medium text-white transition-colors hover:bg-moss/90 active:bg-moss/80 motion-reduce:transition-none"
      >
        Mulai fokus
      </a>
    </div>
  )
}

export function GardenPage() {
  const { sessions, isLoading, error, refresh } = useSessions()
  const flowers = deriveFlowers(sessions)

  return (
    <section
      id="kebun"
      aria-labelledby="garden-title"
      className="mx-auto flex w-full max-w-2xl flex-col gap-8"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="garden-title"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Kebun
        </h1>
        <p className="text-base leading-relaxed text-muted">
          Setiap sesi fokus menanam satu bunga. Pilih bunga untuk melihat
          detailnya.
        </p>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 border-y border-line py-3"
        >
          <p className="text-sm text-danger">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="inline-flex min-h-11 items-center rounded-md border border-line bg-surface px-4 text-sm font-medium text-ink transition-colors hover:bg-paper active:bg-line/40 motion-reduce:transition-none"
          >
            Coba lagi
          </button>
        </div>
      ) : null}

      {isLoading ? (
        <GardenSkeleton />
      ) : flowers.length > 0 ? (
        <Garden flowers={flowers} />
      ) : error ? null : (
        <EmptyGarden />
      )}
    </section>
  )
}
