# m8 - Tampilan Kebun

Status: todo

Tujuan: Menampilkan kebun dari sesi nyata lewat `Flower.tsx`, `Garden.tsx`, dan `GardenPage.tsx`, lalu menghubungkan tautan navigasinya.

Langkah:
- Render bunga dari hook `m5` dan derivasi `m7`, dengan empty state berbahasa Indonesia saat belum ada sesi.
- Tampilkan detail bunga berupa tanggal, mood, dan jenis bunga saat bunga dipilih.
- Tambahkan tautan navigasi ke Kebun hanya di task ini, setelah halamannya benar-benar ada.

Selesai ketika:
- empty state muncul saat belum ada sesi, dan bunga muncul setelah sesi selesai.
- Tidak ada tautan navigasi ke halaman yang belum ada.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan `npm run dev`, selesaikan satu sesi, buka Kebun, cek detail bunga, dan uji lebar 375px.

Catatan: Pakai divider dan whitespace untuk pengelompokan, bukan grid kartu berulang, sesuai arah `docs/DESIGN.md`.
