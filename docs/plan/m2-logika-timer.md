# m2 - Logika Timer

Status: todo

Tujuan: Membuat logika timer murni di `src/core/timer.ts`, tanpa React atau browser API.

Langkah:
- Definisikan tipe/status eksplisit untuk fase focus dan break, durasi default 25/5, serta operasi mulai, jeda, lanjut, dan reset.
- Ganti test placeholder di `src/core/__tests__/timer.test.ts` dengan test untuk transisi fase dan perilaku reset.

Selesai ketika:
- Test mencakup start, pause, resume, reset, dan perpindahan focus ke break.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: `npm test -- src/core/__tests__/timer.test.ts`

Catatan: Durasi tetap 25/5 sesuai `docs/PRD.md`. Durasi bebas dan breakpoint lain ada di blueprint lama, bukan MVP ini.
