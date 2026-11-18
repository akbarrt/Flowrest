# m9 - Integrasi dan Verifikasi

Status: done

Tujuan: Merangkai seluruh alur MVP dan menutup semua file plan.

Langkah:
- Rangkai halaman Timer dan Kebun di `src/App.tsx`, hapus placeholder yang tidak dipakai.
- Jalankan `npm run lint && npm run build && npm test` dan pastikan semuanya lolos.
- Uji alur lengkap di browser: mulai sesi, isi mood, lihat bunga, refresh, lalu cek mobile, keyboard, dan `prefers-reduced-motion`.
- Ubah `Status: todo` menjadi `done` di `m1` sampai `m9` setelah langkah di atas terpenuhi.

Selesai ketika:
- Alur Timer ke mood ke Kebun bekerja tanpa error konsol dan semua file plan berstatus `done`.

Verifikasi: catat hasil klik per kontrol dan hasil tiga perintah di atas di laporan akhir.

Catatan: Stats, sync, pengingat, PWA, dan Framer Motion tetap deferred sesuai `docs/PRD.md`.

## Hasil

- `src/App.tsx` sudah merangkai Timer dan Kebun lewat hash `#timer` / `#kebun`. Tidak ada placeholder fitur deferred yang tersisa: `src/core/stats.ts`, `src/ui/pages/StatsPage.tsx`, dan file `.gitkeep` di folder yang sudah terisi dihapus.
- `src/storage/__tests__/session-flow.test.ts`: 2 test integrasi untuk alur simpan sesi, muat ulang, lalu derivasi kebun. Test memastikan satu sesi menjadi satu bunga dan dua sesi tetap dua serta terurut.
- `index.html`: menambah `<link rel="icon" href="data:," />` agar browser tidak meminta favicon yang belum ada. Ini menghapus satu-satunya error konsol (404 favicon) tanpa membuat aset logo palsu.
- Semua plan `m1` sampai `m9` berstatus `done`.

Verifikasi browser dengan Chrome headless pada viewport 375x812:

- Timer: judul dokumen `Flowrest`, `lang="id"`, timer awal `25:00`, nav menandai Timer, tidak ada overflow horizontal.
- Kontrol: Mulai berjalan (`24:59`), Jeda menampilkan "Dijeda" dan tombol "Lanjut", Reset kembali `25:00`. Space mulai/jeda dan `R` reset juga bekerja.
- Penyelesaian fokus disimulasikan dengan virtual time 25 menit. Form mood muncul dengan 5 radio, "Simpan mood", dan "Lewati". Memilih "Sangat baik" menyimpan satu sesi `mood: great`, `flower: rose`.
- Siklus kedua diselesaikan lalu "Lewati" ditekan. Sesi kedua tersimpan dengan `mood: neutral`, `flower: tulip`, dan total tetap dua sesi dengan ID unik (tidak ada entri ganda).
- Kebun: satu baris Mawar, lalu dua baris Mawar dan Tulip setelah siklus kedua. Nav menandai Kebun, tanpa overflow. Klik baris membuka detail Tanggal, Mood "Sangat baik", dan Jenis bunga "Mawar".
- Empty state setelah storage dikosongkan menampilkan "Kebunmu masih kosong." dan CTA "Mulai fokus". Klik CTA membuka halaman Timer dengan hash `#timer`.
- Refresh di `#kebun` mempertahankan halaman dan sesi. Tidak ada error konsol.
- Tangkapan layar timer, form mood, kebun satu bunga, detail kebun, kebun dua bunga, dan empty state diperiksa pada 375px.

Verifikasi perintah: `npm run lint`, `npm run build`, dan `npm test` lolos (4 file, 27 test).
