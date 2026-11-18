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
