# STEP 3 — Text Wireframes

Wireframe berikut menggambarkan struktur dan prioritas elemen halaman. Ini merupakan rancangan low-fidelity, bukan desain visual final.

## 1. Landing Page

**Tujuan:** Menjelaskan manfaat produk dan mengarahkan pengguna memulai simulasi.

```text
┌──────────────────────────────────────────────────────────────┐
│ SCENOVA                              How it works   Sign in   │
│                                      [Start Simulation]       │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│  Explore scenarios.                                          │
│  Make better decisions.               [Ilustrasi visual      │
│                                        tanaman / bentuk      │
│  Simulate how changes in price,         organik]             │
│  costs, and transactions affect                               │
│  your business.                                               │
│                                                              │
│  [Start Simulation]   [Learn More]                            │
├──────────────────────────────────────────────────────────────┤
│  HOW IT WORKS                                                 │
│  01 Set up business  →  02 Adjust assumptions → 03 Compare   │
├──────────────────────────────────────────────────────────────┤
│  FOOTER: Scenova · About · Disclaimer · Contact              │
└──────────────────────────────────────────────────────────────┘
```

**Elemen:** logo/nama, navigasi, headline, deskripsi singkat, CTA, penjelasan tiga langkah, footer.

## 2. Login / Register

**Tujuan:** Memberi akses aman ke data simulasi milik pengguna.

```text
┌────────────────────────────────────────────────────┐
│ SCENOVA                                             │
│                                                    │
│              Welcome back                          │
│       Continue exploring your scenarios            │
│                                                    │
│       Email     [________________________]          │
│       Password  [________________________]          │
│                                                    │
│       [Sign In]                                     │
│       Don't have an account? Create account        │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Elemen:** email, password, tombol masuk, tautan daftar, validasi dan pesan error.

## 3. Dashboard

**Tujuan:** Menampilkan ringkasan dan daftar simulasi pengguna.

```text
┌──────────────────────────────────────────────────────────────┐
│ SCENOVA     Dashboard   Simulations              Profile      │
├──────────────────────────────────────────────────────────────┤
│  Good morning                                                │
│  Explore your business possibilities.                        │
│                                          [+ New Simulation]  │
├──────────────────────────────────────────────────────────────┤
│  TOTAL SIMULATIONS       SAVED SCENARIOS       LAST UPDATED   │
│       04                      12                 Today        │
├──────────────────────────────────────────────────────────────┤
│  YOUR SIMULATIONS                                             │
│  ┌────────────────────────────────────────────────────────┐  │
│  │ Business / Simulation name     Updated       [Open]    │  │
│  │ Coffee Shop Scenario           18 Nov 2026              │  │
│  │ Freelance Service Plan         17 Nov 2026              │  │
│  └────────────────────────────────────────────────────────┘  │
│                                                              │
│  Empty state: Create your first business simulation.         │
└──────────────────────────────────────────────────────────────┘
```

**Elemen:** navigasi, ringkasan jumlah simulasi, daftar simulasi, tombol buat baru, empty state.

## 4. Business Setup

**Tujuan:** Mengumpulkan data dasar yang digunakan dalam model perhitungan.

```text
┌──────────────────────────────────────────────────────────────┐
│ SCENOVA                                  Step 1 of 2          │
├──────────────────────────────────────────────────────────────┤
│  Set up your business                                         │
│  Give your simulation a starting point.                       │
│                                                              │
│  Simulation name [____________________________]               │
│  Business type   [Product / Service / Other v]                │
│  Period          [Monthly v]                                  │
│                                                              │
│  Average transaction value  [Rp ______________]               │
│  Variable cost / transaction [Rp _____________]               │
│  Fixed cost per period       [Rp _____________]               │
│  Transaction volume          [_______________]                │
│                                                              │
│  [Back]                                  [Continue]           │
└──────────────────────────────────────────────────────────────┘
```

**Catatan:** Business type hanya label konteks pada MVP, bukan pemilih rumus industri khusus. Pengguna tetap menggunakan model input umum.

## 5. Simulation Workspace

**Tujuan:** Menjadi ruang utama untuk mengubah asumsi dan melihat dampaknya.

```text
┌──────────────────────────────────────────────────────────────┐
│ SCENOVA     Dashboard   Simulation: My Business     [Save]   │
├──────────────────────────────────────────────────────────────┤
│  ASSUMPTIONS                     RESULTS                      │
│  Average transaction value      Revenue                      │
│  [Rp 15.000          ]           Rp 15.000.000                 │
│  ───────●───────────             Total Cost                   │
│                                  Rp 11.000.000                 │
│  Variable cost / transaction    Operating Profit              │
│  [Rp 6.000           ]           Rp 4.000.000                  │
│  ─────●─────────────             Operating Margin             │
│                                  26.7%                         │
│  Fixed cost                     Break-even Volume             │
│  [Rp 5.000.000       ]           556 transactions              │
│                                                              │
│  Transaction volume             [Chart: scenario projection]  │
│  [1,000              ]                                       │
│                                                              │
│  [Reset to Baseline]               [Save as Scenario]         │
└──────────────────────────────────────────────────────────────┘
```

**Elemen:** input angka, slider bila sesuai, ringkasan metrik, grafik, reset, simpan skenario. Pada layar kecil, bagian asumsi dan hasil ditumpuk secara vertikal.

## 6. Results & Insights

**Tujuan:** Menjelaskan hasil perhitungan dan asumsi yang digunakan.

```text
┌──────────────────────────────────────────────────────────────┐
│  Simulation Results                         [Save Scenario]  │
├──────────────────────────────────────────────────────────────┤
│  Revenue         Total Cost       Operating Profit            │
│  Rp 15.000.000   Rp 11.000.000    Rp 4.000.000                │
│                                                              │
│  Operating Margin     Break-even Volume                      │
│  26.7%                556 transactions                       │
├──────────────────────────────────────────────────────────────┤
│  FINANCIAL OVERVIEW                                           │
│  [Bar chart: Revenue vs Total Cost vs Operating Profit]       │
├──────────────────────────────────────────────────────────────┤
│  ASSUMPTIONS USED                                             │
│  Transaction value · Variable cost · Fixed cost · Volume      │
│                                                              │
│  These results are estimates based on your inputs.           │
└──────────────────────────────────────────────────────────────┘
```

## 7. Scenario Comparison

**Tujuan:** Membandingkan hasil dari dua atau lebih skenario tersimpan.

```text
┌──────────────────────────────────────────────────────────────┐
│  Scenario Comparison                       [+ New Scenario]  │
├──────────────────────────────────────────────────────────────┤
│  Select scenarios: [Baseline v] [Optimistic v] [Conservative] │
├──────────────────────────────────────────────────────────────┤
│  Metric             Baseline    Optimistic    Conservative    │
│  Revenue            ...         ...           ...             │
│  Total Cost         ...         ...           ...             │
│  Operating Profit   ...         ...           ...             │
│  Margin             ...         ...           ...             │
│  Break-even         ...         ...           ...             │
├──────────────────────────────────────────────────────────────┤
│  [Chart: comparison by scenario]                              │
│                                                              │
│  [Back to Simulation]                                        │
└──────────────────────────────────────────────────────────────┘
```

## 8. Responsive Behavior

- Desktop: dashboard dan workspace dapat menggunakan dua kolom.
- Tablet: kurangi lebar panel dan pertahankan hierarki informasi.
- Mobile: navigasi ringkas, kartu metrik bertumpuk, input satu kolom, tabel perbandingan dapat digulir horizontal.
- Tombol dan kontrol input harus nyaman disentuh.
- Grafik harus tetap terbaca pada lebar layar kecil.
