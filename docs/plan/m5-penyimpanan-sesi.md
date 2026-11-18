# m5 - Penyimpanan Sesi

Status: todo

Tujuan: Menghubungkan penyimpanan sesi ke antarmuka lewat `src/hooks/useSessions.ts` dan menguji implementasi localStorage.

Langkah:
- Buat test untuk `src/storage/localStorage.ts`: tambah, baca, hapus, kunci `flowrest.sessions`, dan data rusak dibuang.
- Buat hook yang membaca sesi saat mount dan menulis sesi baru ketika callback selesai dari `m3` dipanggil.
- Tetap panggil `SessionStorage` di `src/storage/storage.ts`, jangan akses `localStorage` langsung dari hook atau UI.

Selesai ketika:
- Test storage lolos dan sesi bertahan setelah halaman di-refresh.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: `npm test -- src/storage/__tests__/localStorage.test.ts`

Catatan: Vitest berjalan di Node tanpa jsdom. Test storage harus memakai stub `Storage` buatan sendiri, bukan `window.localStorage`.
