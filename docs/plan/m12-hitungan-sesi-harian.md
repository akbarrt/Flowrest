# m12 - Hitungan sesi harian

Status: todo

Tujuan: Menampilkan jumlah sesi fokus yang selesai hari ini dari data nyata di penyimpanan lokal.

Langkah:
- Hidupkan `src/core/stats.ts` dengan fungsi murni `countSessionsToday(sessions, now?)` berdasarkan tanggal lokal dan abaikan tanggal tidak valid.
- Tulis test untuk kasus tanpa sesi, sesi hari ini, dan sesi tanggal lain.
- Tampilkan hasil di `HomePage` dari `sessions` yang sudah disediakan `useSessions`.

Selesai ketika:
- Teks menunjukkan "Belum ada sesi selesai hari ini." saat kosong dan "`N` sesi selesai hari ini." saat ada sesi.
- Jumlah bertambah setelah sesi selesai disimpan.
- `npm run lint && npm run build && npm test` lolos.

Verifikasi: simpan satu sesi, cek hitungan, refresh, lalu cek hitungan tetap benar.

Catatan: Angka harus berasal dari data nyata. Tidak boleh menampilkan statistik palsu.
