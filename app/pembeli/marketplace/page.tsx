"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  RiceIcon, CoffeeIcon, SpiceIcon, OilIcon, HoneyIcon, GrainIcon, LeafIcon,
  StarIcon, HeartIcon, CartIcon
} from "@/components/ProductIcons";

const categories = ["Semua", "Pangan", "Minuman", "Rempah", "Organik", "Olahan", "Peternakan"];

const products = [
  { id: 1, icon: <RiceIcon size={32} className="text-amber-600" />, name: "Beras Merah Organik", origin: "Cianjur, Jawa Barat", price: "Rp 28.000/kg", stock: "Tersedia", rating: 4.9, category: "Pangan", reviews: 312 },
  { id: 2, icon: <CoffeeIcon size={32} className="text-amber-800" />, name: "Kopi Arabika Gayo", origin: "Gayo, Aceh", price: "Rp 95.000/250g", stock: "Tersedia", rating: 4.8, category: "Minuman", reviews: 218 },
  { id: 3, icon: <SpiceIcon size={32} className="text-red-500" />, name: "Bawang Merah Brebes", origin: "Brebes, Jawa Tengah", price: "Rp 18.500/kg", stock: "Terbatas", rating: 4.7, category: "Pangan", reviews: 156 },
  { id: 4, icon: <OilIcon size={32} className="text-emerald-600" />, name: "Minyak Kelapa VCO", origin: "Minahasa, Sulawesi Utara", price: "Rp 62.000/500ml", stock: "Tersedia", rating: 4.9, category: "Organik", reviews: 407 },
  { id: 5, icon: <SpiceIcon size={32} className="text-orange-500" />, name: "Cabai Merah Keriting", origin: "Garut, Jawa Barat", price: "Rp 45.000/kg", stock: "Tersedia", rating: 4.6, category: "Rempah", reviews: 89 },
  { id: 6, icon: <CoffeeIcon size={32} className="text-yellow-900" />, name: "Cokelat Bubuk Sulawesi", origin: "Makassar, Sulawesi Selatan", price: "Rp 55.000/200g", stock: "Tersedia", rating: 4.8, category: "Olahan", reviews: 174 },
  { id: 7, icon: <OilIcon size={32} className="text-yellow-600" />, name: "Santan Segar Kelapa", origin: "Manado, Sulawesi Utara", price: "Rp 12.000/200ml", stock: "Terbatas", rating: 4.5, category: "Pangan", reviews: 93 },
  { id: 8, icon: <HoneyIcon size={32} className="text-amber-500" fill="currentColor" />, name: "Madu Hutan Kalimantan", origin: "Pontianak, Kalimantan Barat", price: "Rp 135.000/500g", stock: "Tersedia", rating: 5.0, category: "Organik", reviews: 521 },
];

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terlaris");

  const filtered = products.filter(
    (p) => activeCategory === "Semua" || p.category === activeCategory
  );

  return (
    <AppLayout>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <CartIcon size={28} className="text-primary" /> Marketplace
      </h1>
      <p className="page-subtitle">Temukan produk terbaik dari ribuan UMKM & supplier lokal Indonesia</p>

      {/* Filter Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              id={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <label className="text-sm text-muted">Urutkan:</label>
          <select
            className="form-input"
            style={{ width: "auto", padding: "0.4rem 0.75rem" }}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            id="sort-select"
          >
            <option value="terlaris">Terlaris</option>
            <option value="termurah">Harga Terendah</option>
            <option value="termahal">Harga Tertinggi</option>
            <option value="rating">Rating Tertinggi</option>
          </select>
        </div>
      </div>

      {/* Result count */}
      <div className="text-sm text-muted mb-4">
        Menampilkan <strong>{filtered.length}</strong> produk
        {activeCategory !== "Semua" && <> dalam kategori <strong>{activeCategory}</strong></>}
      </div>

      {/* Product Grid */}
      <div className="product-grid">
        {filtered.map((p) => (
          <div key={p.id} className="product-card card-hover" id={`mp-product-${p.id}`}>
            <div className="product-img" style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
              {p.icon}
            </div>
            <div className="product-body">
              <div className="badge badge-gray text-xs" style={{ marginBottom: "0.375rem" }}>{p.category}</div>
              <div className="product-name">{p.name}</div>
              <div className="product-origin" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.375rem" }}>
                <LocationIcon size={14} /> {p.origin}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className={`badge ${p.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                  {p.stock === "Tersedia" ? "✓" : "!"} {p.stock}
                </span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }} className="text-xs text-muted">
                  <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {p.rating}
                  <span className="text-xs text-muted">({p.reviews} ulasan)</span>
                </span>
              </div>
              <div className="product-price">{p.price}</div>
              <div className="product-footer">
                <button className="btn-primary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-mp-add-cart-${p.id}`}>
                  <CartIcon size={14} /> + Keranjang
                </button>
                <button className="icon-btn" id={`btn-mp-wishlist-${p.id}`} title="Simpan ke Wishlist" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                  <HeartIcon size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
