# m11 - Durasi kustom

Status: done

Tujuan: Memungkinkan pengguna memilih durasi fokus dan jeda yang tersimpan lokal, tanpa mengubah durasi saat timer berjalan.

Langkah:
- Perluas `src/core/timer.ts` dengan `TimerDurations`, `DEFAULT_DURATIONS`, durasi di `TimerState`, `createTimerState`, `resetTimer`, `withDurations`, dan `tickTimer` yang memakai durasi dari state.
- Tambah `SettingsStorage` dan implementasi localStorage di `src/storage` dengan kunci `flowrest.settings` serta validasi bilangan bulat 1-180.
- Buat hook `useSettings` mengikuti pola `useSessions`.
- Tarik `useTimer` ke `HomePage` agar status tersedia; `Timer` menjadi komponen presentasional.
- Buat `DurationSettings` dengan preset 25/5, 50/10, 15/3 dan dua input angka bernama.
- Nonaktifkan input saat `status !== 'idle'`. Perbarui teks dinamis dan durasi sesi yang disimpan.

Selesai ketika:
- Preset dan input mengubah durasi timer setelah tersimpan.
- Timer yang berjalan tidak berubah durasinya dan input terkunci.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: ubah durasi saat idle, mulai timer, cek hitung mundur dan transisi fokus ke jeda. Refresh untuk memastikan durasi tersimpan.

Catatan: Default tetap 25/5 agar test m2 tidak berubah. Perubahan durasi saat idle menjaga fase saat ini.

## Hasil

- `src/core/timer.ts`: `TimerDurations` dan `DEFAULT_DURATIONS` ditambahkan. `TimerState` kini membawa durasi fokus dan jeda, sehingga `tickTimer` memakai durasi dari state, bukan konstanta global. `withDurations` hanya berlaku saat idle dan mempertahankan fase. Semua fungsi lama tetap punya default 25/5 sehingga test lama tidak diubah.
- `src/core/settings.ts`: tipe `TimerSettings`, batas 1-180 menit, `parseTimerSettings` untuk validasi per field, dan konversi ke milidetik.
- `src/storage/storage.ts` dan `src/storage/settings.ts`: `SettingsStorage` dengan kunci `flowrest.settings`. Nilai tidak valid jatuh ke default per field. `getBrowserStorage` diekspor dari `localStorage.ts` untuk dipakai ulang.
- `src/hooks/useSettings.ts`: load async dengan state `isLoading` dan `error`, serta `saveSettings` yang menyimpan nilai tervalidasi.
- `src/hooks/useTimer.ts`: menerima `durations`, menyamakan state saat idle ketika durasi berubah setelah load async, dan mengembalikan durasi aktif.
- `src/ui/components/Timer.tsx`: sekarang presentasional, menerima objek `UseTimerResult`. Ring dan tombol Reset memakai durasi aktif.
- `src/ui/components/DurationSettings.tsx`: tiga preset dengan `aria-pressed`, dua input bernomor dengan label terlihat, pesan pengunci saat timer berjalan, validasi 1-180, dan pesan error.
- `src/ui/pages/HomePage.tsx`: `useTimer` dan `useSettings` ditarik ke sini. Subtitle dan `durationMinutes` sesi memakai durasi aktif. `DurationSettings` diberi `key` agar input tersinkron setelah load atau simpan tanpa effect tambahan.
- Test baru: 7 test durasi kustom di `timer.test.ts`, 4 test `parseTimerSettings`/konversi, 4 test penyimpanan settings. Total 5 file, 42 test lolos.
- Verifikasi browser 375px dengan 13 pemeriksaan, semuanya lolos: default 25/5, preset langsung mengubah subtitle/timer/storage, input terkunci saat berjalan dan dijeda, terbuka lagi setelah Reset, input manual tersimpan, input invalid menampilkan error tanpa merusak storage, durasi bertahan setelah refresh, transisi ke jeda memakai 1 menit kustom, tanpa overflow horizontal dan console error.
- `npm run lint`, `npm run build`, `npm test`: lolos.
