# STEP 9 — Deployment & Documentation

Dokumen ini menyiapkan proses rilis Scenova ke host publik. **Belum ada deployment live** yang dilakukan saat dokumen ini dibuat; semua langkah di bawah masih berstatus persiapan.

## 1. Prasyarat

- Node.js 20.9 atau lebih baru (disarankan LTS).
- Akun Neon dengan branch PostgreSQL produksi yang sudah aktif.
- Akun host publik yang mendukung Next.js 16, misalnya Vercel.
- Source code tersedia di Git provider, atau akses CLI host untuk deploy langsung dari folder proyek.
- Kredensial database dan variabel lingkungan hanya disimpan di pengaturan host, bukan di repository.

> Workspace lokal saat ini bukan git repository. Inisialisasi repository dan push ke Git provider terlebih dahulu jika menggunakan integrasi Git, atau gunakan CLI host dari folder `D:\SF Group\Scenova`.

## 2. Variabel Lingkungan

Salin `.env.example` ke `.env.local` untuk lokal, lalu daftarkan nilai yang sama di pengaturan environment host produksi.

| Variabel | Wajib | Keterangan |
|---|---|---|
| `DATABASE_URL` | Ya | Connection string Neon. Gunakan endpoint pooled untuk produksi. |
| `APP_URL` | Ya | Origin aplikasi untuk redirect/link server-side, tanpa trailing slash. Bersifat private, tidak diekspos ke browser. |
| `NODE_ENV` | Diatur host | Nilai produksi diatur otomatis oleh host; jangan diubah manual. |

Jangan pernah memasukkan `.env.local` ke source control. `.env.example` hanya berisi placeholder.

## 3. Inisialisasi Database

Jalankan migrasi awal sekali pada branch produksi sebelum aplikasi menerima traffic:

```bash
psql "$DATABASE_URL" -f db/migrations/0001_initial.sql
```

Migrasi ini membuat:

- `app_users` dan `sessions` untuk autentikasi email/password berbasis server.
- `businesses`, `simulations`, dan `scenarios`.
- Indeks, trigger `updated_at`, serta kebijakan RLS berbasis `app.current_user_id`.

Verifikasi setelah migrasi:

```bash
psql "$DATABASE_URL" -c "\dt"
```

Pastikan keenam tabel di atas tersedia dan RLS aktif pada tiga tabel bisnis.

## 4. Verifikasi Sebelum Rilis

Jalankan dari root proyek:

```bash
npm ci
npm run lint
npm run typecheck
npm test -- --run
npm run build
```

Semua perintah harus lolos. Build terakhir yang tercatat lolos dengan 12 test passed, 2 test file passed, dan seluruh route ter-compile sebagai dynamic server-rendered routes.

## 5. Deploy

### Opsi A — Integrasi Git

1. Inisialisasi dan push repository ke Git provider.
2. Import repository di host deployment.
3. Pilih framework Next.js; biarkan build command dan output directory default.
4. Isi `DATABASE_URL` dan `APP_URL` di pengaturan environment produksi.
5. Deploy ke produksi setelah migrasi database selesai.

### Opsi B — CLI host

1. Jalankan CLI host dari `D:\SF Group\Scenova`.
2. Hubungkan project ke akun dan scope yang tepat.
3. Tambahkan variabel lingkungan produksi.
4. Deploy dari folder proyek.

Tidak ada perubahan konfigurasi khusus di `next.config.ts`; `pg` sudah ditandai sebagai `serverExternalPackages`.

## 6. Smoke Test Produksi

Lakukan setelah deployment selesai:

- [ ] Landing page tampil dengan CTA **Start Simulation**.
- [ ] Switcher **EN / ID** berfungsi; cookie `scenova_lang` tersimpan dan `<html lang>` berubah.
- [ ] Bahasa default tanpa cookie adalah English; pilihan Indonesia menampilkan seluruh UI, pesan validasi, chart, dan halaman error dalam bahasa Indonesia.
- [ ] Registrasi akun baru berhasil.
- [ ] Login dan logout berhasil; cookie sesi bersifat httpOnly dan aman di produksi.
- [ ] Dashboard dapat menampilkan simulasi dan empty state.
- [ ] Business setup dapat membuat simulasi baru dengan validasi angka.
- [ ] Workspace menghitung ulang saat asumsi diubah; reset-to-baseline bekerja.
- [ ] Save scenario berhasil untuk minimal dua skenario bernama.
- [ ] Halaman compare menampilkan tabel dan chart dengan benar.
- [ ] Halaman results menampilkan asumsi, disclaimer estimasi, dan metric edge cases.
- [ ] Akun berbeda tidak dapat melihat simulasi akun lain.
- [ ] Tampilan desktop dan mobile tetap terbaca; tabel dapat di-scroll horizontal di layar sempit.

### Hasil smoke test otomatis (read-only)

| Pemeriksaan | Hasil |
|---|---|
| `GET /` | 200 `text/html`; judul, CTA, disclaimer, dan favicon tampil |
| `GET /login` | 200 `text/html` |
| `GET /api/simulations` | 405 — method tidak diizinkan, sesuai route yang hanya menerima POST |
| `POST /api/simulations` tanpa autentikasi | 401 `{"error":"Please sign in to create a simulation."}` |
| Cookie `scenova_lang=id` | `<html lang="id">`, metadata Bahasa Indonesia, seluruh CTA landing terlokalisasi |
| Redirect CTA produksi | Setelah perbaikan CTA, build baru terverifikasi menampilkan **Mulai Simulasi** pada mode ID |

Alur yang memerlukan akun (registrasi, login, buat simulasi, simpan/bandingkan skenario, isolasi antar-akun, dan tampilan mobile) masih perlu review manual pada STEP 10.

## 7. Rollback

- Jika rilis aplikasi bermasalah, rollback ke deployment sebelumnya di host.
- Jika perubahan database bermasalah, pulihkan branch/snapshot Neon yang sesuai sebelum rilis ulang kode.
- Jangan menghapus branch produksi tanpa backup dan konfirmasi.

## 8. Status Checklist

| Item | Status |
|---|---|
| Dokumentasi deployment | Selesai |
| Variabel lingkungan produksi | Selesai — `DATABASE_URL` dan `APP_URL` terkonfigurasi di Vercel |
| Migrasi database produksi | Selesai — 5 tabel aktif pada branch Neon `br-crimson-darkness-b3mljqfm` |
| Deployment live | Selesai — https://scenova-seven.vercel.app/ |
| Smoke test produksi | Sebagian — pemeriksaan read-only lolos; alur terautentikasi perlu review manual |
| Product review (STEP 10) | Selesai — final approval diterima; bukti smoke test tercatat |

## 9. Catatan Implementasi

- Autentikasi MVP menggunakan direktori `app_users` server-side, bukan Supabase Auth, karena kredensial Supabase tidak tersedia saat build. Ini sudah disetujui sebagai fallback Neon pada `coldstart.md`.
- RLS tetap aktif dan identitas pengguna disetel per-transaksi melalui `app.current_user_id`.
- Kalkulasi murni berada di TypeScript dan diuji dengan Vitest.
- Semua hasil adalah estimasi matematis, bukan prediksi atau jaminan finansial.
