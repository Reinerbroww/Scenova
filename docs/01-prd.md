# STEP 1 — Product Requirements Document

**Product:** Scenova  
**Tagline:** Explore Scenarios. Make Better Decisions.  
**Version:** 1.0  
**Status:** Approved for planning

## 1. Gambaran Umum

Scenova adalah platform simulasi bisnis interaktif yang membantu pemilik bisnis dan wirausahawan memahami dampak perubahan harga atau nilai rata-rata transaksi, biaya, dan volume transaksi terhadap kondisi keuangan bisnis.

Pada tahap MVP, Scenova berfokus pada **Profit & Pricing Simulator** dengan model input umum yang dapat digunakan oleh bisnis produk maupun jasa.

## 2. Latar Belakang dan Permasalahan

Pemilik bisnis perlu mempertimbangkan perubahan harga, biaya operasional, dan volume penjualan atau transaksi. Namun, tidak semua pemilik bisnis memiliki waktu atau kemampuan untuk menyusun perhitungan keuangan dan membandingkan beberapa kemungkinan secara mandiri. Akibatnya, dampak perubahan asumsi terhadap pendapatan, biaya, dan keuntungan sulit dipahami sebelum keputusan diterapkan.

## 3. Tujuan Produk

Menyediakan alat simulasi yang mudah digunakan agar pengguna dapat:
- Memasukkan kondisi dasar bisnis.
- Mengubah asumsi utama secara interaktif.
- Memahami estimasi pendapatan, biaya, dan laba operasional.
- Membandingkan beberapa skenario dalam satu tampilan.

Scenova adalah alat bantu eksplorasi dan perencanaan. Hasilnya merupakan estimasi berdasarkan data dan asumsi pengguna, bukan prediksi, jaminan, atau nasihat keuangan profesional.

## 4. Target Pengguna

- Pemilik usaha kecil dan menengah.
- Calon wirausahawan.
- Pelaku bisnis produk maupun jasa.
- Pengguna yang ingin mengevaluasi skenario harga dan operasional.

## 5. Fitur Utama MVP

### 5.1 Business Model Setup
Pengguna membuat profil simulasi dan memasukkan:
- Nama bisnis atau nama simulasi.
- Periode perhitungan (misalnya bulanan).
- Harga jual atau nilai rata-rata transaksi.
- Biaya variabel per unit/transaksi.
- Biaya tetap selama periode.
- Volume unit atau jumlah transaksi selama periode.

### 5.2 Interactive Simulation
Pengguna dapat mengubah harga/nilai transaksi, biaya variabel, biaya tetap, dan volume. Hasil dihitung ulang ketika input berubah. Kontrol angka dan slider digunakan sesuai rentang nilai yang masuk akal; input angka tetap tersedia agar pengguna dapat memasukkan nilai secara presisi.

### 5.3 Scenario Comparison
Pengguna dapat menyimpan beberapa skenario dengan nama, misalnya Baseline, Optimistic, dan Conservative, kemudian membandingkan hasilnya.

### 5.4 Results & Insights
Sistem menampilkan:
- Revenue / pendapatan.
- Variable cost total.
- Fixed cost.
- Total cost.
- Estimated operating profit.
- Operating margin.
- Break-even volume.
- Grafik perbandingan hasil antarskenario.

## 6. Rumus Perhitungan MVP

Gunakan model umum berikut untuk satu periode:

- `Revenue = Average Transaction Value × Transaction Volume`
- `Total Variable Cost = Variable Cost per Transaction × Transaction Volume`
- `Total Cost = Total Variable Cost + Fixed Cost`
- `Operating Profit = Revenue - Total Cost`
- `Operating Margin = (Operating Profit / Revenue) × 100%`, jika Revenue > 0
- `Contribution per Transaction = Average Transaction Value - Variable Cost per Transaction`
- `Break-even Volume = Fixed Cost / Contribution per Transaction`, jika Contribution per Transaction > 0

Break-even volume ditampilkan sebagai jumlah transaksi utuh yang diperlukan, dibulatkan ke atas. Jika contribution per transaction nol atau negatif, tampilkan bahwa break-even tidak dapat dicapai dengan asumsi saat ini. Istilah “harga jual” dapat dipakai untuk bisnis produk, sedangkan “nilai rata-rata transaksi” lebih umum untuk jasa atau bisnis berbasis transaksi.

## 7. Ruang Lingkup MVP

**Termasuk:**
- Input kondisi dasar bisnis.
- Simulasi interaktif untuk harga/nilai transaksi, biaya, dan volume.
- Perhitungan metrik profitabilitas.
- Penyimpanan skenario.
- Perbandingan skenario.
- Dashboard dan visualisasi responsif.
- Autentikasi pengguna dan data privat per akun.

**Tidak termasuk:**
- Prediksi berbasis AI atau Machine Learning.
- Monte Carlo simulation.
- Integrasi POS, bank, marketplace, atau data pihak ketiga.
- Sistem akuntansi/pembukuan lengkap.
- Model khusus setiap industri.
- Pembuat rumus bebas.
- Kolaborasi tim, billing, dan subscription.
- Rekomendasi otomatis yang mengklaim menjamin hasil bisnis.

## 8. Alur Penggunaan Singkat

Landing Page → Dashboard → Create Simulation → Business Setup → Simulation Workspace → Results → Save Scenario → Scenario Comparison.

## 9. Kriteria Keberhasilan MVP

MVP dianggap memenuhi kebutuhan inti apabila pengguna dapat:
1. Membuat akun dan masuk.
2. Membuat simulasi baru.
3. Memasukkan data bisnis dengan validasi.
4. Melihat metrik hasil perhitungan yang benar.
5. Mengubah asumsi dan melihat hasil diperbarui.
6. Menyimpan minimal dua skenario.
7. Membandingkan skenario yang tersimpan.
8. Membuka kembali simulasi miliknya.
9. Menggunakan fitur utama pada desktop dan mobile.

## 10. Batasan dan Transparansi

Semua hasil bergantung pada asumsi dan input pengguna. MVP tidak memperhitungkan pajak, depresiasi, bunga pinjaman, perubahan permintaan akibat harga, persediaan, atau biaya kompleks lainnya. Antarmuka harus menyebut hasil sebagai estimasi dan memperlihatkan asumsi yang digunakan.
