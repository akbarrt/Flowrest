# m4 - Komponen Timer

Status: todo

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
