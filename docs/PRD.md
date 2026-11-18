# PRD: Flowrest

Flowrest adalah timer fokus offline-first dengan kebun mood. Setiap sesi fokus selesai menambah satu bunga, dan pilihan mood menentukan tampilannya. Visi: "Grow your focus. Bloom your mind."

## Sumber kebenaran

- Scope MVP ada di dokumen ini. `SPEC.md` lama sudah digabung ke sini.
- Perilaku detail dan urutan task ada di `FEATURES.md`. Task harian satu file ada di `plan/m<n>-<nama>.md`.
- Kode dan perintah ada di `package.json` dan `src/`. Aturan arsitektur ada di `AGENTS.md` di root repo.
- `API.md`, `DATABASE.md`, dan `DECISIONS.md` adalah blueprint lama, bukan scope aktif. `DESIGN.md` dipakai hanya sebagai arah visual.

## Masalah dan pengguna

Timer Pomodoro kebanyakan mengabaikan konteks emosi atau memakai streak yang memicu rasa bersalah. Flowrest memakai metafora kebun dan tidak menghukum pengguna yang berhenti sejenak.

Penggunanya: pelajar yang mengatur sesi belajar, pekerja jarak jauh yang butuh siklus fokus dan istirahat, serta orang yang ingin mencatat suasana hati tanpa aplikasi yang memaksa.

## Scope MVP

1. Layout dasar dan navigasi yang hanya mengarah ke halaman yang sudah ada.
2. Timer 25/5 dengan mulai, jeda, lanjut, dan reset.
3. Form mood setelah sesi fokus selesai.
4. Sesi disimpan di localStorage melalui antarmuka `SessionStorage`.
5. Kebun diturunkan dari sesi tersimpan, bukan dari state terpisah.

## Di luar MVP

Backend dan auth, cloud sync, pengingat, weekly stats, PWA, Framer Motion, streak dan varian langka, ekspor data, panel admin. Jangan mengerjakannya tanpa permintaan baru.

## Model data

`Session` adalah satu-satunya sumber kebenaran:

```ts
{
  id: string
  date: string // ISO 8601
  durationMinutes: number
  mood: 'very_bad' | 'bad' | 'neutral' | 'good' | 'great'
  flower: 'daisy' | 'tulip' | 'sunflower' | 'rose'
}
```

Nilai mood dan bunga berasal dari `src/core/types.ts` (`MOODS` dan `FLOWER_TYPES`). Implementasi localStorage memakai kunci `flowrest.sessions` dan membuang entri yang tidak valid saat dibaca.

## Derivasi kebun

Satu sesi selesai menghasilkan satu bunga. `flower` menentukan jenis bunga, `date` menentukan urutan. Tidak ada penyimpanan kebun terpisah. Bunga yang tampil selalu dihitung dari `Session[]`.

## Persyaratan fungsional

| ID | Persyaratan | Rincian |
|:---|:---|:---|
| MVP-1 | Layout dasar | Fondasi UI, tanpa tautan mati |
| MVP-2 | Timer 25/5 | Logika murni, hook, komponen, akses keyboard |
| MVP-3 | Form mood | Lima pilihan mood, tombol lewati, satu sesi per selesai |
| MVP-4 | Penyimpanan sesi | `SessionStorage` async, validasi data, test dengan stub |
| MVP-5 | Kebun | Derivasi murni, empty state, detail bunga |

Detail penerimaan ada di `FEATURES.md`.

## Persyaratan nonfungsional

- Offline: seluruh alur MVP berjalan tanpa jaringan.
- Bahasa: semua teks UI Bahasa Indonesia dan `index.html` memakai `lang="id"`.
- Aksesibilitas: kontrol keyboard, focus ring terlihat, target sentuh minimal 44px, kontras WCAG AA, menghormati `prefers-reduced-motion`.
- Kualitas: `npm run lint`, `npm run build`, dan `npm test` harus lolos sebelum pekerjaan dinyatakan selesai.
- Privasi: data mood tetap di browser pengguna, tidak dikirim ke layanan luar.
- Performa: tidak ada angka target yang dipakai sebagai klaim sebelum diukur.

## Stack saat ini

Vite, React 19, TypeScript 7, Tailwind CSS v4 lewat plugin Vite, Vitest, oxlint. Tidak ada backend. Perintah: `npm run dev`, `npm run lint`, `npm run build`, `npm test`.

## Asumsi dan batasan

- Data hilang jika pengguna menghapus penyimpanan browser. Tidak ada pemulihan di MVP.
- Penulisan storage yang gagal, misalnya mode privat atau kuota penuh, diabaikan sesuai implementasi saat ini.
- Tidak ada akun, profil publik, berbagi kebun, atau pembayaran.
