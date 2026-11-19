# m2 - Logika Timer

Status: done

Tujuan: Membuat logika timer murni di `src/core/timer.ts`, tanpa React atau browser API.

Langkah:
- Definisikan tipe/status eksplisit untuk fase focus dan break, durasi default 25/5, serta operasi mulai, jeda, lanjut, dan reset.
- Ganti test placeholder di `src/core/__tests__/timer.test.ts` dengan test untuk transisi fase dan perilaku reset.

Selesai ketika:
- Test mencakup start, pause, resume, reset, dan perpindahan focus ke break.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: `npm test -- src/core/__tests__/timer.test.ts`

Catatan: Durasi tetap 25/5 sesuai `docs/PRD.md`. Durasi bebas dan breakpoint lain ada di blueprint lama, bukan MVP ini.

## Hasil

- `src/core/timer.ts`: konstanta `FOCUS_DURATION_MS` (25 menit) dan `BREAK_DURATION_MS` (5 menit), tipe `TimerPhase` (`'focus' | 'break'`) dan `TimerStatus` (`'idle' | 'running' | 'paused'`), serta `TimerState` dengan `remainingMs` dan `segmentStartedAt`.
- Operasi murni: `createTimerState`, `startTimer`, `pauseTimer`, `resumeTimer`, `resetTimer`, `remainingTime`, dan `tickTimer`.
- Hitungan memakai selisih `now - segmentStartedAt`, bukan pengurangan per tick. Jeda menyimpan sisa waktu, lalu lanjut memakai ulang sisa itu.
- `tickTimer` menyelesaikan fase saat sisa 0: focus menjadi break idle 5 menit, break menjadi focus idle 25 menit, dan mengembalikan `phaseCompleted` agar hook bisa memicu callback satu kali.
- `src/core/__tests__/timer.test.ts`: 14 test mencakup start, pause, resume, reset, hitungan berbasis timestamp, serta transisi focus ke break dan break ke focus.

Verifikasi aktual: `npm test -- src/core/__tests__/timer.test.ts` lolos 14 test. `npm run lint`, `npm run build`, dan `npm test` juga lolos.
