"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  StarIcon, HeartIcon, CartIcon, LocationIcon
} from "@/components/ProductIcons";

const categories = ["Semua", "Pangan", "Minuman", "Rempah", "Organik", "Olahan", "Peternakan"];

export default function MarketplacePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [sortBy, setSortBy] = useState("terlaris");
  const [loading, setLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, wlRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/wishlist")
        ]);
        const prodData = await prodRes.json();
        const wlData = await wlRes.json();

        setProducts(prodData);
        setWishlistedIds(wlData.map((w: any) => w.product_id));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddToWishlist = async (productId: number) => {
    if (wishlistedIds.includes(productId)) {
      alert("Produk sudah ada di wishlist!");
      return;
    }
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        setWishlistedIds([...wishlistedIds, productId]);
        alert("Berhasil ditambahkan ke wishlist!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrder = async (p: any) => {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          supplier: "Supplier Lokasi Terdekat",
          items: [{ icon_type: p.icon_type, name: p.name, qty: 1, price: p.price }],
          total: p.price
        })
      });
      if (res.ok) {
        alert("Pesanan berhasil dibuat! Silakan cek di halaman Pesanan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

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

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat produk marketplace...</div>
      ) : (
        /* Product Grid */
        <div className="product-grid">
          {filtered.map((p) => (
            <div key={p.id} className="product-card card-hover" id={`mp-product-${p.id}`}>
              <div className="product-img" style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconRenderer type={p.icon_type} size={32} className="text-amber-600" />
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
                <div className="product-price">Rp {p.price.toLocaleString("id-ID")}</div>
                <div className="product-footer">
                  <button className="btn-primary" onClick={() => handleAddOrder(p)} style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-mp-add-cart-${p.id}`}>
                    <CartIcon size={14} /> + Beli
                  </button>
                  <button 
                    className="icon-btn" 
                    id={`btn-mp-wishlist-${p.id}`} 
                    title="Simpan ke Wishlist" 
                    onClick={() => handleAddToWishlist(p.id)}
                    style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: wishlistedIds.includes(p.id) ? "var(--color-alert)" : "inherit"
                    }}
                  >
                    <HeartIcon size={16} fill={wishlistedIds.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </AppLayout>
  );
}

