"use client";
import { useEffect, useState } from "react";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  StarIcon, HeartIcon, CartIcon, PackageIcon, LocationIcon
} from "@/components/ProductIcons";

// Mocking Rural Co-op Stores (Toko-Toko Koperasi Pelosok Pilihan)
const coops = [
  { 
    name: "Koperasi Tani Maju", 
    desa: "Desa Sukamaju", 
    kabupaten: "Cianjur", 
    provinsi: "Jawa Barat", 
    rating: 4.9, 
    reviews: 480, 
    desc: "Kelompok tani desa Sukamaju yang berdedikasi memproduksi beras organik berkualitas tinggi sejak 2015.",
    bg_color: "var(--color-primary-light)",
    icon: "leaf"
  },
  { 
    name: "Koperasi Brebes Jaya", 
    desa: "Desa Wanasari", 
    kabupaten: "Brebes", 
    provinsi: "Jawa Tengah", 
    rating: 4.8, 
    reviews: 320, 
    desc: "Produsen bawang merah Brebes segar bermutu tinggi langsung dari lahan petani lokal.",
    bg_color: "rgba(239, 68, 68, 0.1)",
    icon: "spice"
  },
  { 
    name: "Koperasi Gayo Indah", 
    desa: "Desa Kenawat", 
    kabupaten: "Aceh Tengah", 
    provinsi: "Aceh", 
    rating: 4.9, 
    reviews: 218, 
    desc: "Kopi Arabika Gayo organik bercita rasa tinggi, diproses basah secara tradisional oleh petani Gayo.",
    bg_color: "rgba(245, 158, 11, 0.1)",
    icon: "coffee"
  },
];

const promos = [
  { id: 1, title: "Diskon Panen Raya 20%", min: "Min. Belanja Rp 100K", code: "PANENRAYA20", color: "#10B981" },
  { id: 2, title: "Gratis Ongkir Pelosok", min: "Min. Belanja Rp 50K", code: "ONGKIRPELOSOK", color: "#3B82F6" },
  { id: 3, title: "Voucher Koperasi Tani", min: "Tanpa Min. Belanja", code: "TANIMAJU15", color: "#EC4899" }
];

export default function DashboardView({ onCartUpdated }: { onCartUpdated?: () => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [claimedCodes, setClaimedCodes] = useState<string[]>([]);
  const [currentPromoIdx, setCurrentPromoIdx] = useState(0);

  useEffect(() => {
    // Load claimed vouchers from localStorage
    const saved = localStorage.getItem("claimedVouchers");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setClaimedCodes(parsed.map((v: any) => v.code));
      } catch (e) {
        console.error(e);
      }
    }

    async function loadData() {
      try {
        const [prodRes, orderRes, wlRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/orders"),
          fetch("/api/wishlist")
        ]);
        const prodData = await prodRes.json();
        const orderData = await orderRes.json();
        const wlData = await wlRes.json();

        setProducts(prodData.slice(0, 4)); // Show top 4
        setOrders(orderData);
        setWishlistCount(wlData.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // Auto scroll promo banners
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentPromoIdx((prev) => (prev + 1) % promos.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const handleClaimVoucher = (promo: any) => {
    if (claimedCodes.includes(promo.code)) {
      alert("Voucher sudah diklaim sebelumnya!");
      return;
    }

    const saved = localStorage.getItem("claimedVouchers");
    let currentVouchers = [];
    if (saved) {
      try {
        currentVouchers = JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }

    const newVoucher = {
      code: promo.code,
      title: promo.title,
      min: promo.min,
      claimedAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
      status: "Tersedia"
    };

    currentVouchers.push(newVoucher);
    localStorage.setItem("claimedVouchers", JSON.stringify(currentVouchers));
    setClaimedCodes([...claimedCodes, promo.code]);
    alert(`Berhasil mengklaim voucher ${promo.title}! Cek riwayatnya di tab Profil.`);
  };

  const handleAddToWishlist = async (productId: number) => {
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        setWishlistCount(prev => prev + 1);
        alert("Produk berhasil ditambahkan ke wishlist!");
      } else {
        alert("Produk sudah ada di wishlist!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrder = (p: any) => {
    try {
      const saved = localStorage.getItem("cartItems");
      let currentItems = [];
      if (saved) {
        try {
          currentItems = JSON.parse(saved);
        } catch (e) {
          console.error(e);
        }
      }

      const existingIdx = currentItems.findIndex((item: any) => item.product.id === p.id);
      if (existingIdx > -1) {
        currentItems[existingIdx].qty += 1;
      } else {
        currentItems.push({
          id: Date.now() + Math.random(),
          product: p,
          qty: 1
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(currentItems));
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  const activeOrdersCount = orders.filter(o => o.status !== "Selesai" && o.status !== "Dibatalkan").length;
  const completedOrdersCount = orders.filter(o => o.status === "Selesai").length;

  return (
    <>
      {/* Hero Banner */}
      <div className="hero-banner" style={{ marginBottom: "1.5rem" }}>
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

      {/* Promo Banner Slider */}
      <div className="card" style={{ marginBottom: "1.5rem", padding: "1.25rem", background: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)", color: "white", border: "none", overflow: "hidden", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div className="badge badge-warning" style={{ marginBottom: "0.5rem", background: "rgba(245,158,11,0.2)", color: "#F59E0B" }}>
              Klaim Voucher Toko Koperasi
            </div>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, margin: "0 0 0.25rem 0", color: "#FFFFFF" }}>
              {promos[currentPromoIdx].title}
            </h3>
            <p style={{ fontSize: "0.85rem", opacity: 0.8, margin: "0 0 1rem 0" }}>
              {promos[currentPromoIdx].min} · Kode: <strong style={{ color: "#F59E0B" }}>{promos[currentPromoIdx].code}</strong>
            </p>
            <button 
              className="btn-primary" 
              onClick={() => handleClaimVoucher(promos[currentPromoIdx])} 
              style={{ fontSize: "0.8rem", padding: "0.4rem 1rem", background: promos[currentPromoIdx].color, border: "none", color: "white" }}
            >
              {claimedCodes.includes(promos[currentPromoIdx].code) ? "✓ Voucher Diklaim" : "Klaim Sekarang"}
            </button>
          </div>
          <div style={{ fontSize: "3.5rem", opacity: 0.25 }}>
            🎟️
          </div>
        </div>
        <div style={{ display: "flex", gap: "0.35rem", justifyContent: "center", marginTop: "0.75rem" }}>
          {promos.map((p, idx) => (
            <span 
              key={p.id} 
              onClick={() => setCurrentPromoIdx(idx)}
              style={{ 
                width: "8px", 
                height: "8px", 
                borderRadius: "50%", 
                background: currentPromoIdx === idx ? "#FFFFFF" : "rgba(255,255,255,0.3)", 
                cursor: "pointer" 
              }} 
            />
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon blue">
            <PackageIcon size={22} />
          </div>
          <div>
            <div className="stat-value">{loading ? "..." : activeOrdersCount}</div>
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
            <div className="stat-value">{loading ? "..." : completedOrdersCount}</div>
            <div className="stat-label">Pesanan Selesai</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">
            <StarIcon size={22} />
          </div>
          <div>
            <div className="stat-value">{claimedCodes.length} / {promos.length}</div>
            <div className="stat-label">Voucher Diklaim</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red">
            <HeartIcon size={22} />
          </div>
          <div>
            <div className="stat-value">{loading ? "..." : wishlistCount}</div>
            <div className="stat-label">Item di Wishlist</div>
          </div>
        </div>
      </div>

      {/* Rekomendasi Toko Koperasi Pelosok Pilihan */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <IconRenderer type="factory" size={20} className="text-slate-700" /> Koperasi Pelosok Pilihan (B2B & B2C)
          </div>
          <div className="text-sm text-muted">Koperasi tani dan kelompok usaha pedesaan terpercaya</div>
        </div>
      </div>
      <div className="grid-3" style={{ marginBottom: "1.75rem" }}>
        {coops.map((c, i) => (
          <div key={i} className="card card-hover" id={`coop-card-${i}`} style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: c.bg_color, borderRadius: "var(--radius-sm)" }}>
                  <IconRenderer type={c.icon} size={22} className="text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-sm">{c.name}</div>
                  <div className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <LocationIcon size={12} /> {c.desa}, {c.kabupaten}
                  </div>
                </div>
              </div>
              <p className="text-xs text-muted" style={{ lineHeight: 1.4, marginBottom: "1rem" }}>{c.desc}</p>
            </div>
            <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span className="text-xs text-muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.15rem" }}>
                <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {c.rating} ({c.reviews} ulasan)
              </span>
              <a href={`/pembeli/marketplace?store=${encodeURIComponent(c.name)}`} className="btn-secondary" style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", textDecoration: "none" }}>
                Kunjungi Toko
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Rekomendasi Produk */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StarIcon size={20} className="text-amber-500" fill="currentColor" /> Rekomendasi untuk Anda
          </div>
          <div className="text-sm text-muted">Produk segar dan olahan unggulan langsung dari desa</div>
        </div>
        <a href="/pembeli/marketplace" className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }} id="btn-lihat-semua-produk">
          Lihat Semua →
        </a>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Memuat produk rekomendasi...</div>
      ) : (
        <div className="product-grid" style={{ marginBottom: "1.75rem" }}>
          {products.map((p) => (
            <div key={p.id} className="product-card card-hover" id={`product-card-${p.id}`}>
              <div className="product-img" style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconRenderer type={p.icon_type} size={32} className="text-amber-600" />
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
                <div className="product-price">Rp {p.price.toLocaleString("id-ID")}/unit</div>
                <div className="product-footer">
                  <button className="btn-primary" onClick={() => handleAddOrder(p)} style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-add-cart-${p.id}`}>
                    <CartIcon size={14} /> + Beli
                  </button>
                  <button className="icon-btn" onClick={() => handleAddToWishlist(p.id)} id={`btn-wishlist-${p.id}`} title="Tambah Wishlist" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
                    <HeartIcon size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
