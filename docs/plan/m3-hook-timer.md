# m3 - Hook Timer

Status: todo

Tujuan: Menjalankan logika `m2` lewat `src/hooks/useTimer.ts` untuk dipakai komponen.

Langkah:
- Simpan sisa waktu, fase, dan status jalan sebagai state React.
- Jalankan tick dari perbedaan timestamp, bukan penambahan tetap per tick, lalu bersihkan interval saat unmount.
- Ekspos `start`, `pause`, `reset`, dan callback ketika sesi selesai tepat satu kali.

Selesai ketika:
- Hook bisa dipakai dari komponen tanpa error dan callback selesai tidak terpicu dua kali.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan `npm run dev`, mulai timer, jeda, lanjutkan, reset, dan amati konsol.

Catatan: `src/main.tsx` memakai `StrictMode`, jadi efek yang membuat interval harus dibersihkan dengan benar.
