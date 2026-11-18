export function HomePage() {
  return (
    <section
      aria-labelledby="timer-title"
      className="mx-auto flex w-full max-w-md flex-col items-center gap-2 py-8 text-center sm:py-16"
    >
      <h1
        id="timer-title"
        className="font-display text-4xl font-semibold tracking-tight text-ink sm:text-5xl"
      >
        Timer fokus
      </h1>
      <p className="text-base leading-relaxed text-muted">
        Sesi fokus 25 menit, lalu jeda 5 menit.
      </p>
    </section>
  )
}
