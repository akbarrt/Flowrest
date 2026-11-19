# m1 - Fondasi UI

Status: done

Tujuan: Menyiapkan shell aplikasi dan layout dasar berbahasa Indonesia tanpa dependency baru.

Langkah:
- Taruh token warna di `src/index.css` berdasarkan arah visual `docs/DESIGN.md` (kertas hangat `#F6F2EA`, lumut `#3F5D3A`), tetap dengan `@import "tailwindcss"`.
- Isi `src/ui/components/Layout.tsx` dengan header sederhana dan area `<main>`.
- Rangkai `src/App.tsx` memakai `Layout`, tampilkan halaman Timer sebagai satu-satunya tampilan aktif.
- Belum pasang tautan ke Kebun atau Stats agar tidak ada tautan mati.

Selesai ketika:
- `npm run lint && npm run build && npm test` lolos.
- Teks antarmuka berbahasa Indonesia dan `lang="id"` di `index.html` tetap ada.

Verifikasi: jalankan `npm run dev`, buka halaman, cek konsol bersih, dan lebar 375px tidak overflow.

Catatan: Jangan membuat logo, avatar, atau angka statistik palsu.

## Hasil

- `src/index.css`: token warna lewat `@theme` (paper, surface, ink, muted, line, moss, sage, terracotta, success, warning, danger), font `sans` dan `display` serif, base body, `cursor: pointer`, serta `focus-visible` ring 2px moss.
- `src/ui/components/Layout.tsx`: header dengan brand teks "Flowrest" dan `<main>` berlebar maksimum 5xl, pemisah hairline `border-line`, tanpa kartu atau shadow.
- `src/ui/pages/HomePage.tsx`: tampilan aktif tunggal berisi `<h1>Timer fokus</h1>` dan keterangan "Sesi fokus 25 menit, lalu jeda 5 menit."
- `src/App.tsx`: merangkai `Layout` dan `HomePage`.
- Tautan ke Kebun atau Stats belum dipasang.
- Muted digelapkan dari `#6E7268` (DESIGN.md) menjadi `#5A5F55` agar teks normal lolos kontras WCAG AA di atas paper.

Verifikasi aktual: `npm run lint`, `npm run build`, dan `npm test` lolos. `npm run dev` merespons HTTP 200. Token `bg-paper`, `text-ink`, `text-muted`, `text-moss`, `border-line`, dan `font-display` ter-generate di CSS hasil build.
