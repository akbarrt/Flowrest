# m6 - Form Mood

Status: todo

Tujuan: Menampilkan form mood setelah sesi focus selesai lewat `src/ui/components/MoodForm.tsx`.

Langkah:
- Pakai kelima nilai `MOODS` dari `src/core/types.ts` sebagai pilihan radio dengan label terlihat.
- Tombol kirim menyimpan sesi memakai mood terpilih lewat hook dari `m5`.
- Sediakan tombol lewati yang tetap menyimpan sesi dengan mood `neutral`.

Selesai ketika:
- Submit dan lewati keduanya menghasilkan satu sesi tersimpan, tanpa entri ganda.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: jalankan `npm run dev`, selesaikan sesi, kirim mood, refresh, lalu cek sesi muncul. Uji juga tombol lewati.

Catatan: Jenis bunga belum dipilih di sini. Itu menjadi bagian dari `m7`.
