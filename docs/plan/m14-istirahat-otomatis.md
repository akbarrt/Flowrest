# m14 - Istirahat otomatis

Status: done

Tujuan: Menjalankan fase istirahat otomatis setelah fokus selesai maupun setelah tombol selesai lebih awal, dan memakai istilah "Istirahat" di seluruh antarmuka.

Langkah:
- Ubah `tickTimer` agar fase berikutnya langsung berjalan dengan timestamp saat transisi, baik fokus ke istirahat maupun istirahat ke fokus.
- Ubah `finishEarly(state, now)` agar menghasilkan istirahat yang langsung berjalan.
- Biarkan `skipBreak` menghasilkan fokus idle dengan mulai manual.
- Sesuaikan hook dan test lama yang mengharapkan fase idle setelah transisi.
- Ganti teks "Jeda" menjadi "Istirahat" pada label fase, status idle, tombol lewati, subtitle, dan label input.

Selesai ketika:
- Fokus selesai dengan sendirinya langsung masuk istirahat yang berjalan.
- Tombol selesai lebih awal langsung masuk istirahat yang berjalan tanpa sesi baru.
- Istirahat selesai langsung masuk fokus yang berjalan.
- Tidak ada teks "jeda" yang dipakai sebagai nama fase.

Verifikasi: jalankan fokus dengan durasi singkat via virtual time, cek transisi otomatis. Uji tombol selesai lebih awal dan lewati istirahat.

Catatan: Ini mengubah keputusan m2 yang menjadikan istirahat idle. Tombol pause tetap bertuliskan "Jeda" sebagai kata kerja.

## Hasil

- `src/core/timer.ts`: `tickTimer` kini menghasilkan fase berikutnya dalam keadaan `running` dengan `segmentStartedAt = now`, untuk kedua arah transisi. `finishEarly(state, now)` juga menghasilkan istirahat yang langsung berjalan. `skipBreak` tetap menghasilkan fokus idle.
- `src/hooks/useTimer.ts`: `finishEarly` mengirim `Date.now()` ke core.
- Test lama diperbarui: transisi fokus ke istirahat dan istirahat ke fokus sekarang diharapkan `running` dengan timestamp, termasuk pada test durasi kustom. Test `finishEarly` juga memakai argumen waktu dan mengharapkan state berjalan.
- `src/ui/components/Timer.tsx`: label fase "Istirahat", status idle "Siap untuk istirahat", tombol "Lewati istirahat". "Jeda" tersisa hanya sebagai kata kerja pada tombol pause dan petunjuk keyboard.
- `src/ui/pages/HomePage.tsx`: subtitle memakai "lalu istirahat N menit".
- `src/ui/components/DurationSettings.tsx`: label input "Istirahat (menit)". Kunci `flowrest.settings` dan field `breakMinutes` tidak berubah.
- Verifikasi browser 375px dengan 11 pemeriksaan, semuanya lolos: istilah istirahat konsisten, selesai lebih awal langsung menjalankan istirahat tanpa sesi atau form mood, lewati istirahat kembali ke fokus idle, fokus selesai alami langsung menjalankan istirahat dengan form mood tetap muncul, istirahat selesai langsung menjalankan fokus, tanpa overflow dan console error.
- `npm run lint`, `npm run build`, `npm test`: lolos dengan 6 file dan 54 test.
