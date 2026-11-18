# FEATURES: Flowrest

Dokumen ini menggabungkan perilaku fitur dan rencana task MVP. Scope ada di `PRD.md`. File `TASKS.md` lama sudah digabung ke sini, dan `SPEC.md` lama sudah digabung ke `PRD.md`. Task harian tetap satu file per langkah di `plan/m<n>-<nama>.md`.

## Pemetaan

| Fitur | Kode utama | Task |
|:---|:---|:---|
| Fondasi UI | `src/index.css`, `src/ui/components/Layout.tsx`, `src/App.tsx` | m1 |
| Timer | `src/core/timer.ts`, `src/hooks/useTimer.ts`, `src/ui/components/Timer.tsx`, `src/ui/pages/HomePage.tsx` | m2, m3, m4 |
| Penyimpanan sesi | `src/storage/`, `src/hooks/useSessions.ts` | m5 |
| Form mood | `src/ui/components/MoodForm.tsx` | m6 |
| Kebun | `src/core/garden.ts`, `src/ui/components/Flower.tsx`, `src/ui/components/Garden.tsx`, `src/ui/pages/GardenPage.tsx` | m7, m8 |
| Integrasi | `src/App.tsx` | m9 |

## 1. Fondasi UI (m1)

- Pakai token warna dari `DESIGN.md` hanya sebagai arah visual, tetap dengan `@import "tailwindcss"`.
- `Layout.tsx` berisi header dan area `<main>`. `App.tsx` merangkai layout dan menampilkan Timer.
- Navigasi ke Kebun baru dipasang di m8 setelah halamannya ada.
- Selesai ketika build lolos, teks berbahasa Indonesia, dan lebar 375px tidak overflow.

## 2. Timer (m2, m3, m4)

Perilaku: hitung mundur 25/5 dengan mulai, jeda, lanjut, dan reset. Sesi selesai memicu satu callback yang dipakai form mood.

Kriteria penerimaan:

- Durasi tetap 25/5. Input durasi bebas bukan bagian MVP.
- Logika di `core/timer.ts` murni TypeScript. Hook menghitung sisa waktu dari timestamp dan membersihkan interval saat unmount agar aman di `StrictMode`.
- Kontrol memakai `<button>`, `Space` untuk mulai atau jeda, `R` untuk reset, focus ring terlihat, target sentuh minimal 44px.
- Hitungan memakai peran timer dan `aria-live="polite"`.
- Callback selesai tidak boleh terpicu dua kali.

Verifikasi: `npm test -- src/core/__tests__/timer.test.ts`, lalu cek manual tiap tombol dan keyboard.

## 3. Penyimpanan sesi (m5)

Perilaku: sesi ditulis lewat antarmuka async `SessionStorage`, dibaca kembali saat aplikasi dimuat, dan bertahan setelah refresh.

Kriteria penerimaan:

- Implementasi localStorage memakai kunci `flowrest.sessions`.
- Entri dengan field tidak valid dibuang saat dibaca.
- Hook tidak mengakses `localStorage` langsung, semua lewat `src/storage/storage.ts`.
- Test memakai stub `Storage` karena Vitest berjalan di Node tanpa jsdom.

Verifikasi: `npm test -- src/storage/__tests__/localStorage.test.ts` dan cek manual refresh.

## 4. Form mood (m6)

Perilaku: muncul setelah sesi fokus selesai. Pengguna memilih salah satu dari `very_bad`, `bad`, `neutral`, `good`, `great`, atau melewati form.

Kriteria penerimaan:

- Pilihan memakai radio dengan label terlihat dan teks Bahasa Indonesia.
- Kirim menyimpan satu sesi dengan mood terpilih. Tombol lewati menyimpan satu sesi dengan mood `neutral`.
- Tidak ada entri ganda untuk satu selesai sesi.

Verifikasi: jalankan alur di browser, kirim dan lewati, lalu refresh untuk memastikan sesi tetap ada.

## 5. Kebun (m7, m8)

Perilaku: setiap sesi menghasilkan satu bunga. Jenis bunga berasal dari field `flower`, urutan berasal dari `date`. Tidak ada state kebun tersimpan.

Kriteria penerimaan:

- Fungsi derivasi di `core/garden.ts` murni dan diuji untuk jumlah bunga serta urutan tanggal.
- Tampilan menampilkan empty state saat belum ada sesi.
- Detail bunga menampilkan tanggal, mood, dan jenis bunga.
- Pengelompokan memakai whitespace dan divider, bukan grid kartu berulang.
- Tautan nav Kebun hanya muncul setelah halaman tersedia.

Verifikasi: `npm test -- src/core/__tests__/garden.test.ts`, lalu cek alur sesi ke bunga dan tampilan 375px.

## 6. Integrasi (m9)

- Rangkai Timer dan Kebun di `App.tsx`, hapus placeholder yang tidak dipakai.
- Uji alur lengkap, mobile, keyboard, dan `prefers-reduced-motion`.
- Jalankan `npm run lint && npm run build && npm test`.
- Tandai `m1` sampai `m9` menjadi `done` di `plan/` setelah semua lolos.

## Urutan pengerjaan

| Task | Bergantung pada | Verifikasi utama |
|:---|:---|:---|
| m1 | tidak ada | build dan cek lebar 375px |
| m2 | m1 | test timer |
| m3 | m2 | cek manual mulai, jeda, reset |
| m4 | m3 | cek manual tombol dan keyboard |
| m5 | m4 | test storage dan refresh |
| m6 | m5 | cek manual kirim dan lewati |
| m7 | m6 | test derivasi kebun |
| m8 | m7 | cek manual empty state dan detail |
| m9 | m8 | lint, build, test, cek browser |

Satu task dikerjakan per sesi. Detail langkah ada di file `plan/` masing-masing.

## Di luar MVP

Weekly stats, sync, pengingat, PWA, Framer Motion, streak dan varian langka, ekspor, auth, admin. Rincian lama ada di `API.md`, `DATABASE.md`, dan `DECISIONS.md`, tetapi bukan untuk dikerjakan sekarang.
