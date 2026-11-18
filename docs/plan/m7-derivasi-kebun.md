# m7 - Derivasi Kebun

Status: todo

Tujuan: Menurunkan daftar bunga dari sesi tersimpan lewat `src/core/garden.ts`.

Langkah:
- Buat fungsi murni yang mengubah `Session[]` menjadi daftar bunga: satu bunga per sesi, `flower` menentukan jenis, `date` menentukan urutan.
- Tulis test di `src/core/__tests__/garden.test.ts` untuk jumlah bunga, urutan tanggal, dan tidak adanya state tersimpan.

Selesai ketika:
- Jumlah bunga sama dengan jumlah sesi dan urutannya mengikuti `date`.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: `npm test -- src/core/__tests__/garden.test.ts`

Catatan: `docs/PRD.md` melarang state taman terpisah. Jangan menambah penyimpanan bunga baru.
