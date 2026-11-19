# m13 - Selesai lebih awal dan lewati jeda

Status: done

Tujuan: Memberi kontrol untuk mengakhiri fokus lebih awal tanpa menyimpan sesi, dan untuk melewati jeda kembali ke fokus idle.

Langkah:
- Tambah `finishEarly(state)` dan `skipBreak(state)` di `src/core/timer.ts`. Keduanya tidak menghasilkan `phaseCompleted`.
- Expose keduanya lewat `src/hooks/useTimer.ts`.
- Tambah tombol kontekstual "Selesai lebih awal" saat fokus aktif dan "Lewati jeda" saat jeda di `Timer`.
- Sembunyikan tombol saat fokus idle.

Selesai ketika:
- "Selesai lebih awal" masuk ke jeda idle dan tidak menambah sesi atau form mood.
- "Lewati jeda" kembali ke fokus idle dengan durasi fokus yang berlaku.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan fokus, tekan selesai lebih awal, cek tidak ada sesi baru. Lewati jeda, cek timer kembali ke fokus idle.

Catatan: Keputusan pengguna: selesai lebih awal tanpa sesi, lewati jeda kembali ke fokus idle dengan mulai manual.

## Hasil

- `src/core/timer.ts`: `finishEarly(state)` hanya berlaku untuk fokus yang berjalan atau dijeda dan menghasilkan jeda idle. `skipBreak(state)` berlaku untuk jeda idle maupun berjalan dan menghasilkan fokus idle. Keduanya mempertahankan durasi dari state dan tidak mengembalikan `phaseCompleted`, sehingga tidak ada sesi baru.
- `src/hooks/useTimer.ts`: expose `finishEarly` dan `skipBreak`. Keduanya mengabaikan panggilan yang tidak mengubah state.
- `src/ui/components/Timer.tsx`: tombol "Selesai lebih awal" muncul hanya saat fokus berjalan atau dijeda. Tombol "Lewati jeda" muncul saat jeda. Keduanya memakai gaya sekunder, tinggi minimum 44px, dan tidak menggeser tombol utama.
- `src/core/__tests__/timer.test.ts`: 7 test baru untuk transisi dan no-op, termasuk durasi kustom. Total 6 file, 54 test lolos.
- Verifikasi browser 375px dengan 11 pemeriksaan, semuanya lolos: tidak ada tombol kontekstual saat fokus idle, tombol selesai muncul saat berjalan dan dijeda, selesai lebih awal masuk ke jeda 3 menit kustom tanpa sesi atau form mood, tombol lewati menggantikan tombol selesai, lewati jeda kembali ke fokus 15 menit kustom dan mulai manual tetap berfungsi, tanpa overflow horizontal dan console error.
- Regresi: verifikasi m10 (10 pemeriksaan) dan m11 (13 pemeriksaan) dijalankan ulang setelah perubahan ini, semuanya lolos.
- `npm run lint`, `npm run build`, `npm test`: lolos.
