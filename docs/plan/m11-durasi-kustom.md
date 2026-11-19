# m11 - Durasi kustom

Status: todo

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
