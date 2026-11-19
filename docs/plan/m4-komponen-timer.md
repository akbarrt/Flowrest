# m4 - Komponen Timer

Status: done

Tujuan: Menghadirkan kontrol timer yang bisa dipakai di `src/ui/components/Timer.tsx` dan `src/ui/pages/HomePage.tsx`.

Langkah:
- Pakai elemen `<button>` untuk mulai, jeda, dan reset dengan label Bahasa Indonesia serta target sentuh minimal 44px.
- Tampilkan hitungan dengan peran timer dan `aria-live="polite"`.
- Tambah akses keyboard `Space` untuk mulai/jeda dan `R` untuk reset, dengan focus ring yang terlihat.

Selesai ketika:
- Setiap tombol melakukan aksi nyata dan tidak ada kontrol mati.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan `npm run dev`, klik tiap tombol, lalu uji Tab, Enter/Space, dan R. Cek konsol tetap bersih.

Catatan: Hindari animasi dekoratif. Gerakan cukup sebagai feedback interaksi singkat dan mengikuti `prefers-reduced-motion`.

## Hasil

- `src/ui/components/Timer.tsx`: memakai `useTimer`; menampilkan label fase, hitungan `mm:ss` dengan `role="timer"` dan `aria-live="polite"`, status, serta cincin progres SVG.
- Cincin progres memakai `FOCUS_DURATION_MS`/`BREAK_DURATION_MS` sebagai acuan, warna moss saat fokus dan sage saat jeda. SVG ditandai `aria-hidden` karena teks di tengah sudah menyampaikan informasi yang sama.
- Tombol `<button>`: tombol utama berganti label Mulai, Jeda, atau Lanjut sesuai status; tombol Reset nonaktif pada state awal fokus. Target sentuh `min-h-11` (44px). Tombol memakai `transition-colors` dengan `motion-reduce:transition-none`.
- Keyboard: `Space` memulai atau menjeda, `R` mereset. Listener mengabaikan input, textarea, select, button, link, dan elemen contentEditable agar tidak bentrok dengan aksi bawaan.
- `src/ui/pages/HomePage.tsx`: menampilkan `Timer` di bawah judul.
- `src/index.css`: menambahkan `cursor: not-allowed` untuk kontrol disabled.

Verifikasi aktual: `npm run lint`, `npm run build`, dan `npm test` lolos (14 test). Dev server boot HTTP 200. Render awal diverifikasi lewat server-render sementara: `25:00`, `Sesi fokus`, `Mulai`, `Reset`, `role="timer"`, dan `aria-live="polite"` muncul, lalu test sementara dihapus. Uji klik dan keyboard di browser tetap perlu dicek manual karena tidak ada browser otomasi di lingkungan ini.
