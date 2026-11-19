# m15 - Notifikasi selesai

Status: done

Tujuan: Memberi notifikasi browser saat sesi fokus selesai dan saat istirahat selesai, dengan izin eksplisit dari pengguna.

Langkah:
- Buat hook `useNotifications` untuk membaca `Notification.permission`, meminta izin, dan mengirim notifikasi.
- Tampilkan tombol "Aktifkan notifikasi" hanya di browser yang mendukung. Tampilkan status aktif atau diblokir tanpa tombol.
- Tambah callback penyelesaian istirahat di `useTimer`.
- Kirim notifikasi dari `HomePage` hanya saat `phaseCompleted`, bukan saat tombol lewati ditekan.
- Pakai judul dan isi yang menyebut durasi istirahat dari pengaturan aktif, serta `tag` agar notifikasi tidak menumpuk.

Selesai ketika:
- Notifikasi fokus dan istirahat muncul setelah izin granted.
- Form mood tetap muncul saat fokus selesai.
- Lewati istirahat tidak memicu notifikasi.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: beri izin via CDP, stub konstruktor `Notification` di halaman, jalankan dua transisi dengan virtual time, lalu periksa judul dan isi yang terekam.

Catatan: Perubahan ini di-commit lokal ke `feat/optimasi-pomodoro` tanpa push, sesuai permintaan pengguna.

## Hasil

- `src/hooks/useNotifications.ts`: hook baru dengan state izin (`unsupported`, `default`, `granted`, `denied`), `requestPermission`, `notifyFocusComplete(restMinutes)`, dan `notifyRestComplete`. Notifikasi memakai `tag: flowrest-phase-complete`.
- `src/ui/components/NotificationSettings.tsx`: komponen baru. Tombol "Aktifkan notifikasi" hanya muncul saat izin `default`. Status `granted` dan `denied` ditampilkan sebagai teks tanpa tombol.
- `src/hooks/useTimer.ts`: opsi baru `onRestComplete`, dipanggil tepat sekali saat `tickTimer` mengembalikan `phaseCompleted === 'break'`. Callback focus tetap dipanggil untuk `phaseCompleted === 'focus'`.
- `src/ui/pages/HomePage.tsx`: `onSessionComplete` mengirim notifikasi fokus memakai `settings.breakMinutes` aktif dan tetap membuka form mood. `onRestComplete` mengirim notifikasi istirahat. Tombol selesai lebih awal dan lewati istirahat tidak memicu notifikasi karena keduanya tidak melewati `tickTimer`.
- Verifikasi browser 375px dengan 11 pemeriksaan, semuanya lolos: tombol izin muncul awalnya, izin granted menyembunyikan tombol, selesai lebih awal dan lewati istirahat tidak mengirim notifikasi, fokus selesai mengirim satu notifikasi dengan isi durasi istirahat aktif, form mood tetap muncul, istirahat selesai mengirim notifikasi tepat sekali, tanpa sesi tersimpan otomatis, overflow nol, console bersih.
- `npm run lint`, `npm run build`, `npm test`: lolos dengan 6 file dan 54 test.
- Commit lokal: `feat(m15): notify focus and rest completion`. Tidak di-push.
