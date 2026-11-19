# m10 - Pertahankan timer lintas halaman

Status: done

Tujuan: Menjaga state timer tetap hidup saat pengguna berpindah antara Timer dan Kebun, dan mematikan shortcut keyboard ketika timer tidak tampil.

Langkah:
- Render `HomePage` terus di `src/App.tsx`, sembunyikan dengan kelas `hidden` saat halaman Kebun. `GardenPage` tetap dirender kondisional.
- Tambah prop `isActive` di `HomePage` dan teruskan ke `Timer` sebagai `active`.
- Di `Timer`, kunci effect keydown `Space` dan `R` dengan prop `active`.

Selesai ketika:
- Timer yang berjalan tetap berjalan setelah membuka Kebun dan kembali, tidak reset ke `25:00`.
- `Space` dan `R` tidak mengubah timer saat di Kebun atau saat form mood terbuka.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan timer, buka Kebun, tunggu beberapa detik, kembali ke Timer, cek waktu. Uji keyboard di Kebun dan saat form mood terbuka.

Catatan: Tidak menambah penyimpanan timer baru. State `useTimer` cukup dijaga tetap ter-mount.

## Hasil

- `src/App.tsx`: `HomePage` tetap dirender dalam wrapper yang diberi kelas `hidden` saat `page === 'garden'`. `GardenPage` dirender hanya saat halaman Kebun. Prop `isActive` dikirim dari `page === 'timer'`.
- `src/ui/pages/HomePage.tsx`: menerima prop `isActive`, meneruskan `active={isActive && !isMoodFormOpen}` ke `Timer`.
- `src/ui/components/Timer.tsx`: menerima prop opsional `active` (default `true`). Effect keydown lebih awal `return` saat `!active`, dan `active` masuk ke dependency array.
- Bug lama ikut tertutup: saat form mood terbuka, `Space`/`R` dulu masih mengubah timer jeda yang tersembunyi; sekarang tidak.
- Verifikasi otomatis lewat Chrome headless + CDP dengan 10 pemeriksaan, semuanya lolos: timer jalan sebelum navigasi, wrapper tersembunyi di Kebun, waktu terus berkurang di Kebun, `Space`/`R` diabaikan di Kebun, timer selamat kembali ke Timer, form mood muncul, timer tersembunyi saat form mood, `Space`/`R` diabaikan saat form mood, tanpa console error.
- `npm run lint`: lolos. `npm run build`: lolos. `npm test`: 4 file, 27 test lolos.
