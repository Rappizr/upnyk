

# Dokumen Spesifikasi Sistem: Lural Commerce & Supply Chain

Dokumen ini berisi rancangan arsitektur, panduan desain modern, sistem warna, serta detail menu untuk **Role Pembeli** pada platform **Lural Commerce & Supply Chain**. Platform ini dirancang untuk menghubungkan ekosistem perdagangan lokal (rural/UMKM) dengan rantai pasok cerdas menggunakan pendekatan antarmuka yang bersih, intuitif, dan responsif.

---

## 1. Konsep & Filosofi Desain

**Lural Commerce & Supply Chain** mengusung tema digitalisasi ekonomi daerah dengan memodernisasi jalur distribusi barang. Desain website menerapkan prinsip **Modern Minimalism & Data-Driven UI**:
- **Clean Layout:** Pemanfaatan *whitespace* (ruang kosong) yang luas untuk mengurangi beban kognitif pengguna.
- **Visual Hierarchy:** Penggunaan ukuran font dan ketebalan (*font weight*) yang kontras untuk memandu pandangan pengguna ke informasi penting terlebih dahulu.
- **Card-Based UI:** Informasi produk, metrik, dan status pesanan dibungkus dalam komponen kartu (*card*) modern dengan *border-radius* lembut (8px - 12px) dan *subtle shadow*.

---

## 2. Sistem Warna (Design System)

Warna yang digunakan dipilih secara saksama untuk memancarkan profesionalisme teknologi, sekaligus kenyamanan bagi pengguna yang bertransaksi dalam waktu lama.

| Elemen UI | Kode Warna (Hex) | Deskripsi & Implementasi |
| :--- | :--- | :--- |
| **Background (Dasar)** | `#F8FAFC` | *Slate 50 / Off-White*. Memberikan kesan bersih, lega, dan modern. Digunakan sebagai latar belakang utama halaman agar mata tidak cepat lelah. |
| **Primary (Warna Utama)** | `#2563EB` | *Royal Blue*. Merepresentasikan teknologi, profesionalisme, keamanan, dan aspek tepercaya. Digunakan pada *Header*, tombol *Call to Action* (CTA) utama, navigasi aktif, dan teks penting. |
| **Secondary (Aksen / Sukses)** | `#10B981` | *Emerald Green*. Melambangkan pertumbuhan ekonomi, keuntungan, bisnis yang sehat, dan indikator sukses. Digunakan untuk tombol beli/restock, badge "Tersedia", grafik profit, serta notifikasi sukses. |
| **Warning / Alert** | `#EF4444` | *Red / Coral*. Digunakan sebagai penanda urgensi. Diimplementasikan pada peringatan stok hampir habis (*Expired Alert*), pembatalan pesanan, atau indikator potensi kerugian. |
| **Text / Typography** | `#1E293B` | *Dark Slate / Slate 800*. Warna teks utama. Lebih lembut di mata dibandingkan hitam pekat (`#000000`), namun tetap mempertahankan tingkat kontras yang tinggi (aksesibilitas WCAG). |

---

## 3. Arsitektur Menu & Fitur: Role Pembeli

Sebagai **Pembeli**, antarmuka difokuskan pada kemudahan pencarian komoditas/produk, transparansi pelacakan rantai pasok, dan efisiensi transaksi. Berikut adalah struktur menu beserta fungsionalitas di dalamnya:

### 🏠 1. Beranda (Dashboard & Discovery)
Halaman utama yang dipersonalisasi khusus untuk pembeli ketika pertama kali masuk ke platform.
- **Komponen UI:**
  - *Hero Banner:* Menggunakan latar belakang putih murni (`#FFFFFF`) di atas dasar `#F8FAFC`, menampilkan promo atau edukasi rantai pasok lokal.
  - *Quick Stats/Metrics:* Ringkasan aktivitas pembeli (misal: jumlah pesanan aktif, voucher yang tersedia).
  - *Rekomendasi Cerdas:* Menampilkan produk terlaris atau produsen lokal terdekat berdasarkan lokasi pembeli menggunakan algoritma cerdas.
- **Penerapan Warna:** Tombol eksplorasi utama menggunakan `#2563EB`.

### 🛒 2. Marketplace (Katalog Produk & Supply Chain B2B/B2C)
Pusat perbelanjaan tempat pembeli melihat, memfilter, dan memilih produk dari berbagai supplier/UMKM lokal.
- **Komponen UI:**
  - *Advanced Filtering:* Filter berdasarkan kategori, rentang harga, lokasi supplier, dan rating.
  - *Product Grid:* Kartu produk modern dengan gambar berkualitas tinggi, nama produk, harga, dan asal daerah.
  - *Stock Indicator:* Indikator ketersediaan real-time dari sistem *supply chain*.
- **Penerapan Warna:** Badge stok melimpah menggunakan teks hijau `#10B981`, tombol "Tambah ke Keranjang" menggunakan `#2563EB`.

### ❤️ 3. Wishlist (Produk Favorit)
Halaman khusus untuk menyimpan produk-produk incaran pembeli agar bisa dipantau atau dibeli di kemudian hari.
- **Komponen UI:**
  - *Grid Layout:* Menampilkan daftar barang yang telah disukai dalam bentuk list atau grid.
  - *Price Drop Alert:* Notifikasi otomatis jika barang di wishlist mengalami penurunan harga.
  - *Fast Checkout:* Tombol instan untuk memindahkan barang dari wishlist langsung ke keranjang belanja.
- **Penerapan Warna:** Ikon hati berwarna merah `#EF4444` sebagai penanda item tersimpan.

### 📦 4. Pesanan (Pelacakan Rantai Pasok & Transaksi)
Halaman manajemen transaksi yang memberikan transparansi penuh terhadap proses pengiriman barang dari hulu ke hilir.
- **Komponen UI:**
  - *Tab Status Pesanan:* Belum Dibayar, Diproses, Dikirim, Selesai, Dibatalkan.
  - *Live Tracking Timeline:* Grafik linear modern yang menunjukkan posisi logistik barang (misal: di gudang supplier -> ekspedisi -> kurir lokal).
  - *Digital Invoice:* Tempat mengunduh bukti transaksi yang sah.
- **Penerapan Warna:** Status "Dikirim/Selesai" menggunakan badge hijau `#10B981`, status "Dibatalkan" menggunakan merah `#EF4444`.

### 🔔 5. Notifikasi (Pusat Informasi Real-Time)
Pusat pemberitahuan yang melacak segala aktivitas akun pembeli.
- **Komponen UI:**
  - *Kategori Notifikasi:* Transaksi, Promo, dan Keamanan Akun.
  - *Real-time Alert:* Notifikasi push ketika status pengiriman barang berubah atau ada pesan dari supplier.
- **Penerapan Warna:** Notifikasi belum dibaca ditandai dengan dot kecil berwarna biru `#2563EB`.

### 👤 6. Profil (Manajemen Akun & Preferensi)
Halaman pengaturan data diri pembeli dan konfigurasi aplikasi.
- **Komponen UI:**
  - *Biodata Pengguna:* Nama, foto profil, email, dan nomor telepon.
  - *Daftar Alamat:* Manajemen multi-alamat untuk mempermudah perhitungan ongkos kirim rantai pasok.
  - *Metode Pembayaran:* Integrasi dengan dompet digital, transfer bank, atau sistem pembayaran berjangka (jika berlaku untuk supply chain B2B).
- **Penerapan Warna:** Tombol "Simpan Perubahan" menggunakan warna utama `#2563EB`.

---

## 4. Panduan Implementasi Komponen (Mockup Code Contoh)

Berikut adalah contoh implementasi CSS modern (menggunakan variabel warna yang telah ditentukan) untuk struktur komponen dasar website:


```

```text
Markdown file successfully generated.

```css
:root {
  --color-bg: #F8FAFC;
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --color-alert: #EF4444;
  --color-text: #1E293B;
  --color-card-bg: #FFFFFF;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

/* Header & Navigasi */
.header-nav {
  background-color: var(--color-primary);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Kartu Produk Marketplace */
.product-card {
  background-color: var(--color-card-bg);
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Tombol Utama */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #1D4ED8; /* Darker Blue */
}

/* Status Sukses / Berhasil */
.status-success {
  background-color: #D1FAE5;
  color: var(--color-secondary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

```

---

*Dokumen ini dibuat sebagai acuan bagi UI/UX Designer dan Frontend Engineer dalam membangun platform Lural Commerce & Supply Chain.*
"""

with open("lural_commerce_spec.md", "w", encoding="utf-8") as f:
f.write(markdown_content)

print("Markdown file successfully generated.")

```
File Markdown (.md) Anda sudah siap! 
[file-tag: code-generated-file-0-1783572898522255714]

Selain mengunduh file di atas, Anda juga bisa langsung menyalin kode Markdown di bawah ini untuk dimasukkan ke dalam dokumentasi proyek (seperti GitHub README, Notion, atau dokumen sistem Anda):

```markdown
# Dokumen Spesifikasi Sistem: Lural Commerce & Supply Chain

Dokumen ini berisi rancangan arsitektur, panduan desain modern, sistem warna, serta detail menu untuk **Role Pembeli** pada platform **Lural Commerce & Supply Chain**. Platform ini dirancang untuk menghubungkan ekosistem perdagangan lokal (rural/UMKM) dengan rantai pasok cerdas menggunakan pendekatan antarmuka yang bersih, intuitif, dan responsif.

---

## 1. Konsep & Filosofi Desain

**Lural Commerce & Supply Chain** mengusung tema digitalisasi ekonomi daerah dengan memodernisasi jalur distribusi barang. Desain website menerapkan prinsip **Modern Minimalism & Data-Driven UI**:
- **Clean Layout:** Pemanfaatan *whitespace* (ruang kosong) yang luas untuk mengurangi beban kognitif pengguna.
- **Visual Hierarchy:** Penggunaan ukuran font dan ketebalan (*font weight*) yang kontras untuk memandu pandangan pengguna ke informasi penting terlebih dahulu.
- **Card-Based UI:** Informasi produk, metrik, dan status pesanan dibungkus dalam komponen kartu (*card*) modern dengan *border-radius* lembut (8px - 12px) dan *subtle shadow*.

---

## 2. Sistem Warna (Design System)

Warna yang digunakan dipilih secara saksama untuk memancarkan profesionalisme teknologi, sekaligus kenyamanan bagi pengguna yang bertransaksi dalam waktu lama.

| Elemen UI | Kode Warna (Hex) | Deskripsi & Implementasi |
| :--- | :--- | :--- |
| **Background (Dasar)** | `#F8FAFC` | *Slate 50 / Off-White*. Memberikan kesan bersih, lega, dan modern. Digunakan sebagai latar belakang utama halaman agar mata tidak cepat lelah. |
| **Primary (Warna Utama)** | `#2563EB` | *Royal Blue*. Merepresentasikan teknologi, profesionalisme, keamanan, dan aspek tepercaya. Digunakan pada *Header*, tombol *Call to Action* (CTA) utama, navigasi aktif, dan teks penting. |
| **Secondary (Aksen / Sukses)** | `#10B981` | *Emerald Green*. Melambangkan pertumbuhan ekonomi, keuntungan, bisnis yang sehat, dan indikator sukses. Digunakan untuk tombol beli/restock, badge "Tersedia", grafik profit, serta notifikasi sukses. |
| **Warning / Alert** | `#EF4444` | *Red / Coral*. Digunakan sebagai penanda urgensi. Diimplementasikan pada peringatan stok hampir habis (*Expired Alert*), pembatalan pesanan, atau indikator potensi kerugian. |
| **Text / Typography** | `#1E293B` | *Dark Slate / Slate 800*. Warna teks utama. Lebih lembut di mata dibandingkan hitam pekat (`#000000`), namun tetap mempertahankan tingkat kontras yang tinggi (aksesibilitas WCAG). |

---

## 3. Arsitektur Menu & Fitur: Role Pembeli

Sebagai **Pembeli**, antarmuka difokuskan pada kemudahan pencarian komoditas/produk, transparansi pelacakan rantai pasok, dan efisiensi transaksi. Berikut adalah struktur menu beserta fungsionalitas di dalamnya:

### 🏠 1. Beranda (Dashboard & Discovery)
Halaman utama yang dipersonalisasi khusus untuk pembeli ketika pertama kali masuk ke platform.
- **Komponen UI:**
  - *Hero Banner:* Menggunakan latar belakang putih murni (`#FFFFFF`) di atas dasar `#F8FAFC`, menampilkan promo atau edukasi rantai pasok lokal.
  - *Quick Stats/Metrics:* Ringkasan aktivitas pembeli (misal: jumlah pesanan aktif, voucher yang tersedia).
  - *Rekomendasi Cerdas:* Menampilkan produk terlaris atau produsen lokal terdekat berdasarkan lokasi pembeli menggunakan algoritma cerdas.
- **Penerapan Warna:** Tombol eksplorasi utama menggunakan `#2563EB`.

### 🛒 2. Marketplace (Katalog Produk & Supply Chain B2B/B2C)
Pusat perbelanjaan tempat pembeli melihat, memfilter, dan memilih produk dari berbagai supplier/UMKM lokal.
- **Komponen UI:**
  - *Advanced Filtering:* Filter berdasarkan kategori, rentang harga, lokasi supplier, dan rating.
  - *Product Grid:* Kartu produk modern dengan gambar berkualitas tinggi, nama produk, harga, dan asal daerah.
  - *Stock Indicator:* Indikator ketersediaan real-time dari sistem *supply chain*.
- **Penerapan Warna:** Badge stok melimpah menggunakan teks hijau `#10B981`, tombol "Tambah ke Keranjang" menggunakan `#2563EB`.

### ❤️ 3. Wishlist (Produk Favorit)
Halaman khusus untuk menyimpan produk-produk incaran pembeli agar bisa dipantau atau dibeli di kemudian hari.
- **Komponen UI:**
  - *Grid Layout:* Menampilkan daftar barang yang telah disukai dalam bentuk list atau grid.
  - *Price Drop Alert:* Notifikasi otomatis jika barang di wishlist mengalami penurunan harga.
  - *Fast Checkout:* Tombol instan untuk memindahkan barang dari wishlist langsung ke keranjang belanja.
- **Penerapan Warna:** Ikon hati berwarna merah `#EF4444` sebagai penanda item tersimpan.

### 📦 4. Pesanan (Pelacakan Rantai Pasok & Transaksi)
Halaman manajemen transaksi yang memberikan transparansi penuh terhadap proses pengiriman barang dari hulu ke hilir.
- **Komponen UI:**
  - *Tab Status Pesanan:* Belum Dibayar, Diproses, Dikirim, Selesai, Dibatalkan.
  - *Live Tracking Timeline:* Grafik linear modern yang menunjukkan posisi logistik barang (misal: di gudang supplier -> ekspedisi -> kurir lokal).
  - *Digital Invoice:* Tempat mengunduh bukti transaksi yang sah.
- **Penerapan Warna:** Status "Dikirim/Selesai" menggunakan badge hijau `#10B981`, status "Dibatalkan" menggunakan merah `#EF4444`.

### 🔔 5. Notifikasi (Pusat Informasi Real-Time)
Pusat pemberitahuan yang melacak segala aktivitas akun pembeli.
- **Komponen UI:**
  - *Kategori Notifikasi:* Transaksi, Promo, dan Keamanan Akun.
  - *Real-time Alert:* Notifikasi push ketika status pengiriman barang berubah atau ada pesan dari supplier.
- **Penerapan Warna:** Notifikasi belum dibaca ditandai dengan dot kecil berwarna biru `#2563EB`.

### 👤 6. Profil (Manajemen Akun & Preferensi)
Halaman pengaturan data diri pembeli dan konfigurasi aplikasi.
- **Komponen UI:**
  - *Biodata Pengguna:* Nama, foto profil, email, dan nomor telepon.
  - *Daftar Alamat:* Manajemen multi-alamat untuk mempermudah perhitungan ongkos kirim rantai pasok.
  - *Metode Pembayaran:* Integrasi dengan dompet digital, transfer bank, atau sistem pembayaran berjangka.
- **Penerapan Warna:** Tombol "Simpan Perubahan" menggunakan warna utama `#2563EB`.

---

## 4. Panduan Implementasi Komponen (Mockup Code Contoh)

Berikut adalah contoh implementasi CSS modern (menggunakan variabel warna yang telah ditentukan) untuk struktur komponen dasar website:

```css
:root {
  --color-bg: #F8FAFC;
  --color-primary: #2563EB;
  --color-secondary: #10B981;
  --color-alert: #EF4444;
  --color-text: #1E293B;
  --color-card-bg: #FFFFFF;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

/* Header & Navigasi */
.header-nav {
  background-color: var(--color-primary);
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* Kartu Produk Marketplace */
.product-card {
  background-color: var(--color-card-bg);
  border: 1px solid #E2E8F0;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

/* Tombol Utama */
.btn-primary {
  background-color: var(--color-primary);
  color: white;
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-primary:hover {
  background-color: #1D4ED8; /* Darker Blue */
}

/* Status Sukses / Berhasil */
.status-success {
  background-color: #D1FAE5;
  color: var(--color-secondary);
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.85em;
  font-weight: 500;
}

```

```

```