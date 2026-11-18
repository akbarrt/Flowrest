import { Timer } from '../components/Timer'

export function HomePage() {
  return (
    <section
      aria-labelledby="timer-title"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-8 py-4 text-center sm:py-10"
    >
      <div className="flex flex-col gap-2">
        <h1
          id="timer-title"
          className="font-display text-3xl font-semibold tracking-tight text-ink sm:text-4xl"
        >
          Timer fokus
        </h1>
        <p className="text-base leading-relaxed text-muted">
          Sesi fokus 25 menit, lalu jeda 5 menit.
        </p>
      </div>
      <Timer />
    </section>
  )
}
