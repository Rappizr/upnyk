

-- 1. Create Products Table
CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    icon_type TEXT NOT NULL,
    name TEXT NOT NULL,
    origin TEXT NOT NULL,
    price INT NOT NULL,
    stock TEXT NOT NULL,
    rating NUMERIC(3,2) NOT NULL DEFAULT 5.0,
    category TEXT NOT NULL,
    reviews INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Products
INSERT INTO products (id, icon_type, name, origin, price, stock, rating, category, reviews) VALUES
(1, 'rice', 'Beras Merah Organik', 'Cianjur, Jawa Barat', 28000, 'Tersedia', 4.9, 'Pangan', 312),
(2, 'coffee', 'Kopi Arabika Gayo', 'Gayo, Aceh', 95000, 'Tersedia', 4.8, 'Minuman', 218),
(3, 'spice', 'Bawang Merah Brebes', 'Brebes, Jawa Tengah', 18500, 'Terbatas', 4.7, 'Pangan', 156),
(4, 'oil', 'Minyak Kelapa VCO', 'Minahasa, Sulawesi Utara', 62000, 'Tersedia', 4.9, 'Organik', 407),
(5, 'spice', 'Cabai Merah Keriting', 'Garut, Jawa Barat', 45000, 'Tersedia', 4.6, 'Rempah', 89),
(6, 'coffee', 'Cokelat Bubuk Sulawesi', 'Makassar, Sulawesi Selatan', 55000, 'Tersedia', 4.8, 'Olahan', 174),
(7, 'oil', 'Santan Segar Kelapa', 'Manado, Sulawesi Utara', 12000, 'Terbatas', 4.5, 'Pangan', 93),
(8, 'honey', 'Madu Hutan Kalimantan', 'Pontianak, Kalimantan Barat', 135000, 'Tersedia', 5.0, 'Organik', 521)
ON CONFLICT (id) DO NOTHING;

-- 2. Create Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    status TEXT NOT NULL,
    date TEXT NOT NULL,
    supplier TEXT NOT NULL,
    items JSONB NOT NULL,
    total INT NOT NULL,
    timeline JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Orders
INSERT INTO orders (id, status, date, supplier, items, total, timeline) VALUES
(
    'ORD-20250701-001',
    'Dikirim',
    '01 Jul 2025',
    'Koperasi Tani Maju',
    '[{"icon_type": "rice", "name": "Beras Merah Organik 5kg", "qty": 2, "price": 140000}]'::jsonb,
    280000,
    '[
        {"label": "Pesanan Dibuat", "time": "01 Jul, 08:12", "done": true},
        {"label": "Pembayaran Dikonfirmasi", "time": "01 Jul, 08:35", "done": true},
        {"label": "Diproses Supplier", "time": "01 Jul, 10:00", "done": true},
        {"label": "Dikirim Ekspedisi", "time": "02 Jul, 09:15", "done": true},
        {"label": "Di Kurir Lokal", "time": "03 Jul, 07:30", "done": false, "active": true},
        {"label": "Tiba di Tujuan", "time": "Estimasi 03 Jul", "done": false}
    ]'::jsonb
),
(
    'ORD-20250625-002',
    'Selesai',
    '25 Jun 2025',
    'UMKM Rempah Nusantara',
    '[{"icon_type": "coffee", "name": "Kopi Arabika Gayo 250g", "qty": 3, "price": 95000}]'::jsonb,
    285000,
    '[]'::jsonb
),
(
    'ORD-20250620-003',
    'Belum Dibayar',
    '20 Jun 2025',
    'Agro Organik Sentosa',
    '[{"icon_type": "honey", "name": "Madu Hutan 500g", "qty": 1, "price": 135000}]'::jsonb,
    135000,
    '[]'::jsonb
)
ON CONFLICT (id) DO NOTHING;

-- 3. Create Wishlist Table
CREATE TABLE IF NOT EXISTS wishlist (
    id SERIAL PRIMARY KEY,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    saved_at TEXT NOT NULL DEFAULT 'Baru saja',
    price_dropped BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Wishlist
INSERT INTO wishlist (id, product_id, saved_at, price_dropped) VALUES
(1, 8, '2 hari lalu', TRUE),
(2, 2, '5 hari lalu', FALSE),
(3, 3, '1 minggu lalu', TRUE),
(4, 4, '2 minggu lalu', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 4. Create Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    type TEXT NOT NULL,
    icon_type TEXT NOT NULL,
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    time TEXT NOT NULL,
    unread BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Notifications
INSERT INTO notifications (id, type, icon_type, title, body, time, unread) VALUES
(1, 'Transaksi', 'package', 'Pesanan Sedang Dikirim!', 'Pesanan ORD-20250701-001 kini ada di tangan kurir lokal. Estimasi tiba hari ini.', '30 menit lalu', TRUE),
(2, 'Promo', 'star', 'Voucher Cashback 15%', 'Dapatkan cashback 15% untuk pembelian produk organik minimum Rp 200.000. Berlaku s/d 10 Jul.', '2 jam lalu', TRUE),
(3, 'Transaksi', 'package', 'Pembayaran Dikonfirmasi', 'Pembayaran untuk pesanan ORD-20250701-001 sebesar Rp 280.000 berhasil dikonfirmasi.', '5 jam lalu', TRUE),
(4, 'Promo', 'leaf', 'Flash Sale Produk Lokal', 'Flash sale dimulai! Diskon hingga 40% untuk produk pilihan dari Koperasi Tani Maju.', 'Kemarin', FALSE),
(5, 'Keamanan', 'lock', 'Login dari Perangkat Baru', 'Terdeteksi login dari perangkat baru (Chrome, Windows). Jika bukan Anda, segera ubah kata sandi.', '2 hari lalu', FALSE),
(6, 'Transaksi', 'star', 'Ulasan Anda Membantu!', 'Ulasan Anda untuk Kopi Arabika Gayo telah dipublikasikan dan membantu 47 pembeli lain.', '3 hari lalu', FALSE)
ON CONFLICT (id) DO NOTHING;

-- 5. Create Profile Table
CREATE TABLE IF NOT EXISTS profile (
    id INT PRIMARY KEY DEFAULT 1,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    bio TEXT,
    addresses JSONB DEFAULT '[]'::jsonb,
    payment_methods JSONB DEFAULT '[]'::jsonb,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT check_single_row CHECK (id = 1)
);

-- Seed Profile
INSERT INTO profile (id, name, email, phone, bio, addresses, payment_methods) VALUES
(
    1,
    'Arif Kurniawan',
    'arif.kurniawan@email.com',
    '+62 812-3456-7890',
    'Pengusaha UMKM yang aktif mencari supplier terpercaya untuk kebutuhan bisnis kuliner.',
    '[
      {"id": 1, "label": "Rumah", "address": "Jl. Merdeka No. 45, RT 03/RW 07, Kel. Sukamaju, Kec. Cikarang Barat", "city": "Bekasi, Jawa Barat 17520", "default": true},
      {"id": 2, "label": "Kantor", "address": "Menara BRI Lantai 12, Jl. Jenderal Sudirman Kav. 44-46", "city": "Jakarta Selatan, DKI Jakarta 12930", "default": false}
    ]'::jsonb,
    '[
      {"name": "GoPay", "detail": "0812-3456-7890", "default": true},
      {"name": "Bank BCA", "detail": "••••  ••••  ••••  1234", "default": false}
    ]'::jsonb
)
ON CONFLICT (id) DO NOTHING;
