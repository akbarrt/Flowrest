# m3 - Hook Timer

Status: done

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

## Hasil

- `src/hooks/useTimer.ts`: `useTimer({ onSessionComplete })` mengembalikan `phase`, `status`, `remainingMs`, serta aksi `start`, `pause`, dan `reset`.
- `TimerState` disimpan di `useRef` agar callback interval tidak menangkap state basi. `view` React state menyimpan fase, status, dan sisa waktu untuk render.
- Interval hanya berjalan saat `status === 'running'`, memakai `setInterval` 250 ms dan `tickTimer` berbasis `Date.now()`, lalu dibersihkan di cleanup sehingga aman di `StrictMode`.
- `onSessionComplete` disimpan di ref dan dipanggil hanya ketika `phaseCompleted === 'focus'`. Setelah state berganti ke break idle, tick berikutnya tidak lagi melaporkan focus, jadi callback tidak terpicu dua kali.
- `start` juga berfungsi sebagai lanjut setelah jeda karena `startTimer` memakai ulang `remainingMs` yang disimpan saat pause.

Verifikasi aktual: `npm run lint`, `npm run build`, dan `npm test` lolos (14 test). Uji manual mulai, jeda, lanjut, dan reset di browser menyusul saat hook dipasang ke komponen di m4.
