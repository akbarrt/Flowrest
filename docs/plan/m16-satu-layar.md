# m16 - Satu layar tanpa scroll

Status: done

Tujuan: Menampilkan timer, pengaturan durasi, dan izin notifikasi dalam satu layar tanpa scroll pada ponsel, serta memberi banner inline sebagai cadangan ketika toast Windows tidak muncul.

Langkah:
- Rapatkan header dan padding halaman.
- Kecilkan ring timer, tombol, dan jarak antar elemen tanpa merusak tap target 44px.
- Ubah pengaturan durasi jadi baris ringkas memakai hairline divider, bukan kartu penuh.
- Ubah pengaturan notifikasi jadi status plus tombol ringkas dengan teks yang menyebut toast Windows.
- Tambah banner inline tetap di bawah layar saat fokus atau istirahat selesai secara alami, dengan tombol tutup dan auto-dismiss.
- Tambah `requireInteraction` pada `Notification` agar toast Windows bertahan sampai ditutup.
- Sesuaikan script verifikasi lama yang mengasumsikan layout dan status lama.

Selesai ketika:
- Pada 375x812 dan 375x667, halaman Timer tidak memiliki scroll vertikal maupun horizontal.
- Tombol preset, input durasi, tombol simpan, dan tombol izin notifikasi tetap terlihat dan bisa diklik tanpa scroll.
- Banner inline muncul saat fokus dan istirahat selesai, tidak muncul saat lewati istirahat atau selesai lebih awal.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: ukur `scrollHeight` terhadap `innerHeight` lewat CDP pada dua tinggi viewport, klik semua kontrol tanpa scroll, jalankan transisi dengan virtual time, dan periksa banner serta notifikasi.

Catatan: perubahan tetap di-commit lokal ke `feat/optimasi-pomodoro` tanpa push.

## Hasil

- `src/ui/components/Layout.tsx`: header dan padding main dirapikan agar area konten lebih tinggi di ponsel.
- `src/ui/components/Timer.tsx`: ring diperkecil, tombol dipadatkan, petunjuk keyboard hanya tampil di layar besar. Tombol masih memenuhi tap target 44px dan tetap muat satu baris saat tombol "Lewati istirahat" muncul.
- `src/ui/components/DurationSettings.tsx`: kartu diganti baris kompak dengan hairline divider. Preset, dua input, dan tombol "Simpan durasi" berada dalam satu blok tanpa scroll. Label input dan validasi tetap ada.
- `src/ui/components/NotificationSettings.tsx`: kartu diganti status ringkas. Teks menyebut toast Windows dan Focus Assist. Tombol hanya muncul saat izin `default`.
- `src/ui/components/InlineNotification.tsx`: komponen baru, fixed di bawah layar, `role="status"`, tombol "Tutup notifikasi", auto-dismiss setelah 6 detik. Karena fixed, banner tidak menambah tinggi dokumen.
- `src/ui/pages/HomePage.tsx`: ringkasan halaman dan kontrol dirapikan. Banner dipicu hanya dari `onSessionComplete` dan `onRestComplete`, sehingga tidak muncul pada "Selesai lebih awal" atau "Lewati istirahat". Ringkasan durasi diberi `id="duration-summary"` agar bisa diverifikasi.
- `src/ui/components/MoodForm.tsx`: form mood dipadatkan jadi dua kolom agar tetap muat dalam satu layar saat muncul setelah fokus selesai.
- `src/hooks/useNotifications.ts`: `requireInteraction: true` ditambahkan agar toast Windows bertahan sampai ditutup.
- Verifikasi browser 375x812 dan 375x667: `scrollHeight` sama dengan tinggi viewport, semua tombol preset, input durasi, tombol simpan, dan tombol izin berada di dalam viewport. Verifikasi transisi memakai 14 pemeriksaan, semuanya lolos, termasuk banner focus dan istirahat, fixed positioning, dismiss, form mood tetap muat, tanpa overflow horizontal, dan console bersih.
- Regresi browser m10 sampai m15 dijalankan ulang dan lolos setelah expectation lama disesuaikan dengan perilaku istirahat otomatis dan istilah "Istirahat".
- `npm run lint`, `npm run build`, `npm test`: lolos dengan 6 file dan 54 test.
- Commit lokal: `feat(m16): fit timer screen and add inline fallback`. Tidak di-push.
