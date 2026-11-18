# m6 - Form Mood

Status: done

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

## Hasil

- `src/core/session.ts`: `flowerForMood` dan `createSession` murni. Pemetaan bunga dari mood: `very_bad`/`bad` ke `daisy`, `neutral` ke `tulip`, `good` ke `sunflower`, `great` ke `rose`. Pemetaan ini diputuskan di m6 karena `Session` mewajibkan `flower`; form tetap tanpa picker bunga.
- `src/ui/components/MoodForm.tsx`: lima radio dari `MOODS` dengan label Bahasa Indonesia, `fieldset`/`legend`, tombol "Simpan mood" dan "Lewati" (mood `neutral`). Ref guard mencegah kirim ganda; fieldset dan tombol dinonaktifkan selama menyimpan.
- `src/ui/pages/HomePage.tsx`: `useSessions` dipakai untuk membaca dan menyimpan lewat `SessionStorage`. Timer tetap ter-mount (disembunyikan) saat form tampil agar fase break tidak hilang; `onSessionComplete` membuka form sekali, lalu simpan atau lewati menulis satu sesi dan menutup form.

Verifikasi aktual: `npm run lint`, `npm run build`, dan `npm test` lolos (2 file, 20 test). Render SSR sementara menunjukkan 5 radio, label, "Simpan mood", "Lewati", dan `createSession` memetakan mood ke bunga; test sementara dihapus. Uji klik submit/lewati dan refresh di browser belum dijalankan karena tidak ada browser otomasi.
