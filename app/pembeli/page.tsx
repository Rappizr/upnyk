import AppLayout from "@/components/AppLayout";
import type { Metadata } from "next";
import { 
  RiceIcon, CoffeeIcon, SpiceIcon, OilIcon, LeafIcon, 
  FactoryIcon, StarIcon, HeartIcon, CartIcon, PackageIcon,
  BellIcon, TruckIcon
} from "@/components/ProductIcons";

export const metadata: Metadata = {
  title: "Beranda Pembeli — Lural Commerce & Supply Chain",
  description: "Dashboard pembeli Lural Commerce. Temukan produk UMKM lokal terbaik dan pantau aktivitas belanja Anda.",
};

const products = [
  { id: 1, icon: <RiceIcon size={32} className="text-amber-600" />, name: "Beras Merah Organik", origin: "Cianjur, Jawa Barat", price: "Rp 28.000/kg", stock: "Tersedia", rating: 4.9 },
  { id: 2, icon: <CoffeeIcon size={32} className="text-amber-800" />, name: "Kopi Arabika Gayo", origin: "Gayo, Aceh", price: "Rp 95.000/250g", stock: "Tersedia", rating: 4.8 },
  { id: 3, icon: <SpiceIcon size={32} className="text-red-500" />, name: "Bawang Merah Brebes", origin: "Brebes, Jawa Tengah", price: "Rp 18.500/kg", stock: "Terbatas", rating: 4.7 },
  { id: 4, icon: <OilIcon size={32} className="text-emerald-600" />, name: "Minyak Kelapa VCO", origin: "Minahasa, Sulawesi Utara", price: "Rp 62.000/500ml", stock: "Tersedia", rating: 4.9 },
];

const producers = [
  { icon: <LeafIcon size={24} className="text-emerald-500" />, name: "Koperasi Tani Maju", location: "Karawang", products: 48, rating: 4.8 },
  { icon: <FactoryIcon size={24} className="text-slate-600" />, name: "UMKM Rempah Nusantara", location: "Medan", products: 35, rating: 4.7 },
  { icon: <LeafIcon size={24} className="text-blue-500" />, name: "Agro Organik Sentosa", location: "Malang", products: 62, rating: 4.9 },
];

export default function PembeliHomePage() {
  return (
    <AppLayout>
      {/* Hero Banner */}
      <div className="hero-banner">
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="badge badge-info" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <StarIcon size={14} fill="currentColor" /> Platform UMKM #1 Indonesia
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", lineHeight: 1.3 }}>
            Selamat Datang, Arif!
          </h1>
          <p style={{ opacity: 0.85, maxWidth: "460px", marginBottom: "1.25rem", fontSize: "0.9375rem" }}>
            Temukan produk unggulan dari ribuan UMKM lokal terpercaya dan nikmati transparansi rantai pasok dari hulu ke hilir.
          </p>
          <div style={{ display: "flex", gap: "0.75rem" }}>
            <a href="/pembeli/marketplace" className="btn-primary" style={{ background: "white", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "0.5rem" }} id="btn-explore-marketplace">
              <CartIcon size={16} /> Jelajahi Marketplace
            </a>
            <a href="/pembeli/pesanan" className="btn-ghost" style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", display: "inline-flex", alignItems: "center", gap: "0.5rem" }} id="btn-lihat-pesanan">
              <PackageIcon size={16} /> Lihat Pesanan Saya
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">
            <PackageIcon size={22} />
          </div>
          <div>
            <div className="stat-value">8</div>
            <div className="stat-label">Pesanan Aktif</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"/>
            </svg>
          </div>
          <div>
            <div className="stat-value">24</div>
            <div className="stat-label">Pesanan Selesai</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <StarIcon size={22} />
          </div>
          <div>
            <div className="stat-value">12</div>
            <div className="stat-label">Voucher Tersedia</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <HeartIcon size={22} />
          </div>
          <div>
            <div className="stat-value">18</div>
            <div className="stat-label">Item di Wishlist</div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Produk */}
      <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StarIcon size={20} className="text-amber-500" fill="currentColor" /> Rekomendasi untuk Anda
          </div>
          <div className="text-sm text-muted">Produk terlaris dari UMKM lokal terdekat</div>
        </div>
        <a href="/pembeli/marketplace" className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }} id="btn-lihat-semua-produk">
          Lihat Semua →
        </a>
      </div>

      <div className="product-grid" style={{ marginBottom: "1.75rem" }}>
        {products.map((p) => (
          <div key={p.id} className="product-card card-hover" id={`product-card-${p.id}`}>
            <div className="product-img" style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.icon}
            </div>
            <div className="product-body">
              <div className="product-name">{p.name}</div>
              <div className="product-origin" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.375rem" }}>
                <LocationIcon size={14} /> {p.origin}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <span className={`badge ${p.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                  {p.stock === "Tersedia" ? "✓" : "!"} {p.stock}
                </span>
                <span className="text-xs text-muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {p.rating}
                </span>
              </div>
              <div className="product-price">{p.price}</div>
              <div className="product-footer">
                <button className="btn-primary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-add-cart-${p.id}`}>
                  <CartIcon size={14} /> + Keranjang
                </button>
                <button className="icon-btn" id={`btn-wishlist-${p.id}`} title="Tambah Wishlist" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <HeartIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Produsen Lokal */}
      <div style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FactoryIcon size={20} className="text-slate-700" /> Produsen Lokal Terdekat
          </div>
          <div className="text-sm text-muted">Supplier terpercaya di sekitar Anda</div>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom: "1.75rem" }}>
        {producers.map((p, i) => (
          <div key={i} className="card card-hover" id={`producer-card-${i}`} style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)" }}>
              {p.icon}
            </div>
            <div>
              <div className="font-semibold text-sm">{p.name}</div>
              <div className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                <LocationIcon size={12} /> {p.location}
              </div>
              <div className="text-xs text-muted" style={{ marginTop: "0.25rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                <span>{p.products} produk</span>
                <span>·</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.15rem" }}>
                  <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {p.rating}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
