# m13 - Selesai lebih awal dan lewati jeda

Status: todo

Tujuan: Memberi kontrol untuk mengakhiri fokus lebih awal tanpa menyimpan sesi, dan untuk melewati jeda kembali ke fokus idle.

Langkah:
- Tambah `finishEarly(state, now)` dan `skipBreak(state)` di `src/core/timer.ts`. Keduanya tidak menghasilkan `phaseCompleted`.
- Expose keduanya lewat `src/hooks/useTimer.ts`.
- Tambah tombol kontekstual "Selesai lebih awal" saat fokus aktif dan "Lewati jeda" saat jeda di `Timer`.
- Sembunyikan tombol saat fokus idle.

Selesai ketika:
- "Selesai lebih awal" masuk ke jeda idle dan tidak menambah sesi atau form mood.
- "Lewati jeda" kembali ke fokus idle dengan durasi fokus yang berlaku.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan fokus, tekan selesai lebih awal, cek tidak ada sesi baru. Lewati jeda, cek timer kembali ke fokus idle.

Catatan: Keputusan pengguna: selesai lebih awal tanpa sesi, lewati jeda kembali ke fokus idle dengan mulai manual.
