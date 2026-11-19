# m8 - Tampilan Kebun

Status: done

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

## Hasil

- `src/ui/labels.ts`: label mood dan jenis bunga dipakai bersama, sehingga `MoodForm` dan kebun tidak menduplikasi teks.
- `src/ui/components/Flower.tsx`: ikon SVG untuk `daisy`, `tulip`, `sunflower`, dan `rose`. Ikon `aria-hidden`; nama bunga tetap dibaca dari teks baris.
- `src/ui/components/Garden.tsx`: daftar bunga dengan divider, bukan kartu. Tiap baris adalah tombol native dengan `aria-expanded` dan `aria-controls`; detail berisi tanggal, mood, dan jenis bunga muncul saat dipilih. Tanggal diformat `id-ID`.
- `src/ui/pages/GardenPage.tsx`: memakai `useSessions` dan `deriveFlowers`. Ada loading skeleton tanpa spinner, banner error dengan tombol "Coba lagi", dan empty state dengan CTA "Mulai fokus" ke `#timer`.
- `src/ui/components/Layout.tsx`: navigasi Timer/Kebun memakai anchor nyata ke `#timer` dan `#kebun`, dengan `aria-current="page"` pada halaman aktif.
- `src/App.tsx`: routing hash sederhana; `#kebun` menampilkan kebun, hash lain menampilkan timer. Refresh dan tombol back browser tetap bekerja.
- `src/ui/pages/HomePage.tsx`: menambah `id="timer"` sebagai target navigasi.
- `src/ui/components/MoodForm.tsx`: memakai label mood bersama dari `src/ui/labels.ts`.

Verifikasi aktual: `npm run lint`, `npm run build`, dan `npm test` lolos (3 file, 25 test). Render SSR sementara membuktikan baris bunga, detail tersembunyi, ikon keempat jenis bunga, dan `aria-current` navigasi; test sementara dihapus. Uji klik di browser dan lebar 375px belum dijalankan karena tidak ada browser otomasi.
