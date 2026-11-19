# m7 - Derivasi Kebun

Status: done

Tujuan: Menurunkan daftar bunga dari sesi tersimpan lewat `src/core/garden.ts`.

Langkah:
- Buat fungsi murni yang mengubah `Session[]` menjadi daftar bunga: satu bunga per sesi, `flower` menentukan jenis, `date` menentukan urutan.
- Tulis test di `src/core/__tests__/garden.test.ts` untuk jumlah bunga, urutan tanggal, dan tidak adanya state tersimpan.

Selesai ketika:
- Jumlah bunga sama dengan jumlah sesi dan urutannya mengikuti `date`.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: `npm test -- src/core/__tests__/garden.test.ts`

Catatan: `docs/PRD.md` melarang state taman terpisah. Jangan menambah penyimpanan bunga baru.

## Hasil

- `src/core/garden.ts`: tipe `GardenFlower` (`sessionId`, `date`, `mood`, `flower`) dan fungsi `deriveFlowers(sessions)`. Fungsi menyalin array, mengurutkan naik memakai `Date.parse` (tanggal tidak valid diperlakukan sebagai `0`), lalu memetakan satu bunga per sesi. Tidak ada state atau penyimpanan baru, dan input tidak diubah.
- `src/core/__tests__/garden.test.ts`: 5 test untuk jumlah dan isi bunga, urutan tanggal, input tidak termutasi, sesi kosong, serta jenis bunga tiap sesi.

Verifikasi aktual: `npm test -- src/core/__tests__/garden.test.ts` lolos (5 test). `npm run lint`, `npm run build`, dan `npm test` juga lolos (3 file, 25 test).
