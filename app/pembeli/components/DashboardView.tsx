"use client";
import { useEffect, useState } from "react";
function RiceIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CoffeeIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  );
}

function SpiceIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2c1.5 4 4 4 4 8 0 4.5-3.5 8-8 8s-8-3.5-8-8c0-4 2.5-4 4-8" />
      <path d="M12 10a4 4 0 0 0-4-4" />
    </svg>
  );
}

function OilIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function HoneyIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12M8 10h8M6 14h12" />
    </svg>
  );
}

function GrainIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2a15 15 0 0 0-8 13.5C4 19.5 7.5 22 12 22s8-2.5 8-6.5C20 15 16 2 12 2z" />
      <path d="M12 2v20" />
    </svg>
  );
}

function LeafIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 8.5C17 15 15 18 11 20z" />
      <path d="M19 2c-2.26 4.33-5.27 7.14-8 18" />
    </svg>
  );
}

function FactoryIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M2 20h20M20 16v4M4 20v-8l6-4v4l6-4v4l4-4v12" />
    </svg>
  );
}

function StarIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function CartIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function PackageIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function LocationIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconRenderer({ type, size = 24, className = "", ...props }: any) {
  const normalized = type.toLowerCase();
  switch (normalized) {
    case "rice":
      return <RiceIcon size={size} className={className} {...props} />;
    case "coffee":
      return <CoffeeIcon size={size} className={className} {...props} />;
    case "spice":
      return <SpiceIcon size={size} className={className} {...props} />;
    case "oil":
      return <OilIcon size={size} className={className} {...props} />;
    case "honey":
      return <HoneyIcon size={size} className={className} {...props} />;
    case "grain":
      return <GrainIcon size={size} className={className} {...props} />;
    case "leaf":
      return <LeafIcon size={size} className={className} {...props} />;
    case "factory":
      return <FactoryIcon size={size} className={className} {...props} />;
    default:
      return <RiceIcon size={size} className={className} {...props} />;
  }
}

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

export default function DashboardView({ onCartUpdated, onNavigate }: { onCartUpdated?: () => void, onNavigate?: (tab: string, storeName?: string) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        setWishlistItems(wlData);
        setWishlistCount(wlData.length);
      } catch (err) {
        console.error("Failed to load dashboard data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddToWishlist = async (productId: number) => {
    const existingItem = wishlistItems.find((w: any) => w.product_id === productId);
    if (existingItem) {
      try {
        const res = await fetch(`/api/wishlist?id=${existingItem.id}`, {
          method: "DELETE"
        });
        if (res.ok) {
          setWishlistItems(prev => prev.filter((w: any) => w.id !== existingItem.id));
          setWishlistCount(prev => Math.max(0, prev - 1));
        }
      } catch (err) {
        console.error(err);
      }
      return;
    }

    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        const newItem = await res.json();
        if (res.status === 201) {
          setWishlistItems(prev => [...prev, newItem]);
          setWishlistCount(prev => prev + 1);
          alert("Produk berhasil ditambahkan ke wishlist!");
        }
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
            <button 
              onClick={() => onNavigate?.("Marketplace")} 
              className="btn-primary" 
              style={{ background: "white", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "none", cursor: "pointer" }} 
              id="btn-explore-marketplace"
            >
              <CartIcon size={16} /> Jelajahi Marketplace
            </button>
            <button 
              onClick={() => onNavigate?.("Pesanan")} 
              className="btn-ghost" 
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", cursor: "pointer" }} 
              id="btn-lihat-pesanan"
            >
              <PackageIcon size={16} /> Lihat Pesanan Saya
            </button>
          </div>
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
              <button 
                onClick={() => onNavigate?.("Marketplace", c.name)} 
                className="btn-secondary" 
                style={{ fontSize: "0.75rem", padding: "0.35rem 0.75rem", border: "none", cursor: "pointer" }}
              >
                Kunjungi Toko
              </button>
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
        <button 
          onClick={() => onNavigate?.("Marketplace")} 
          className="btn-ghost" 
          style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", cursor: "pointer", background: "transparent" }} 
          id="btn-lihat-semua-produk"
        >
          Lihat Semua →
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Memuat produk rekomendasi...</div>
      ) : (
        <div className="product-grid" style={{ marginBottom: "1.75rem" }}>
          {products.map((p) => {
            const isWishlisted = wishlistItems.some((w: any) => w.product_id === p.id);
            return (
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
                    <button 
                      className="icon-btn" 
                      onClick={() => handleAddToWishlist(p.id)} 
                      id={`btn-wishlist-${p.id}`} 
                      title={isWishlisted ? "Hapus dari Wishlist" : "Tambah Wishlist"} 
                      style={{ 
                        display: "inline-flex", 
                        alignItems: "center", 
                        justifyContent: "center",
                        color: isWishlisted ? "var(--color-alert)" : "var(--color-text-subtle)",
                        background: isWishlisted ? "rgba(239, 68, 68, 0.08)" : "transparent"
                      }}
                    >
                      <HeartIcon size={16} fill={isWishlisted ? "currentColor" : "none"} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
