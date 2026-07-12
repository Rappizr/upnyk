"use client";
import { useState, useEffect } from "react";
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

function TrashIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
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

// Product Store Mapping
const productStoreMap: Record<number, string> = {
  1: "Koperasi Tani Maju",
  2: "Koperasi Gayo Indah",
  3: "Koperasi Brebes Jaya",
  4: "Koperasi Sulawesi Makmur",
  5: "Koperasi Brebes Jaya",
  6: "Koperasi Sulawesi Makmur",
  7: "Koperasi Sulawesi Makmur",
  8: "Koperasi Madu Borneo"
};

export default function WishlistView({ onCartUpdated }: { onCartUpdated?: () => void }) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadWishlist() {
      try {
        const res = await fetch("/api/wishlist");
        const data = await res.json();
        setItems(data);
      } catch (err) {
        console.error("Failed to load wishlist:", err);
      } finally {
        setLoading(false);
      }
    }
    loadWishlist();
  }, []);

  const remove = async (id: number) => {
    try {
      const res = await fetch(`/api/wishlist?id=${id}`, {
        method: "DELETE"
      });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutAll = async () => {
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

      for (const item of items) {
        const p = item.product;
        const existingIdx = currentItems.findIndex((ci: any) => ci.product.id === p.id);
        if (existingIdx > -1) {
          currentItems[existingIdx].qty += 1;
        } else {
          currentItems.push({
            id: Date.now() + Math.random(),
            product: p,
            qty: 1
          });
        }
        await fetch(`/api/wishlist?id=${item.id}`, { method: "DELETE" });
      }

      localStorage.setItem("cartItems", JSON.stringify(currentItems));
      setItems([]);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <HeartIcon size={28} className="text-red-500" fill="currentColor" /> Wishlist Saya
      </h1>
      <p className="page-subtitle">Pantau produk favorit dan dapatkan notifikasi saat harga turun</p>

      {/* Summary */}
      <div className="card wishlist-summary-card">
        <div className="wishlist-summary-stats">
          <div><div className="stat-value">{items.length}</div><div className="text-sm text-muted">Item Tersimpan</div></div>
          <div><div className="stat-value text-secondary">{items.filter((i) => i.price_dropped).length}</div><div className="text-sm text-muted">Harga Turun</div></div>
          <div><div className="stat-value text-primary">
            Rp {items.reduce((a, b) => a + (b.product?.price || 0), 0).toLocaleString("id-ID")}
          </div><div className="text-sm text-muted">Total Estimasi</div></div>
        </div>
        <button className="btn-primary" onClick={handleCheckoutAll} disabled={items.length === 0} style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }} id="btn-checkout-all-wishlist">
          <CartIcon size={16} /> Pindah Semua ke Keranjang
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat wishlist...</div>
      ) : (
        /* Wishlist Items */
        <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
          {items.map((item) => {
            const p = item.product;
            if (!p) return null;
            const storeName = productStoreMap[p.id] || "Supplier Koperasi";
            return (
              <div key={item.id} className="wishlist-card" id={`wishlist-item-${item.id}`}>
                <div style={{ width: 100, height: 100, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconRenderer type={p.icon_type} size={44} className="text-amber-500" />
                </div>
                <div className="wishlist-card-body">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      {item.price_dropped && (
                        <span className="badge badge-danger text-xs">Harga Turun!</span>
                      )}
                      <span className="badge badge-info text-xs">Toko Koperasi Pelosok</span>
                      <span className="text-xs text-primary font-semibold">{storeName}</span>
                    </div>
                    <div className="font-semibold">{p.name}</div>
                    <div className="text-sm text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                      <LocationIcon size={14} /> {p.origin}
                    </div>
                    <div className="text-xs text-subtle" style={{ marginTop: "0.25rem" }}>Disimpan {item.saved_at}</div>
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <span className={`badge ${p.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                      {p.stock}
                    </span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-bold text-primary" style={{ fontSize: "1.1rem" }}>
                      Rp {p.price.toLocaleString("id-ID")}
                    </div>
                  </div>
                  <div className="wishlist-card-actions">
                    <button 
                      className="btn-secondary" 
                      onClick={async () => {
                        const saved = localStorage.getItem("cartItems");
                        let currentItems = [];
                        if (saved) {
                          try {
                            currentItems = JSON.parse(saved);
                          } catch (e) {
                            console.error(e);
                          }
                        }

                        const existingIdx = currentItems.findIndex((ci: any) => ci.product.id === p.id);
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
                        await remove(item.id);
                        if (onCartUpdated) onCartUpdated();
                      }}
                      style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} 
                      id={`btn-wl-cart-${item.id}`}
                    >
                      <CartIcon size={14} /> Beli
                    </button>
                    <button className="btn-ghost" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", color: "var(--color-alert)", borderColor: "var(--color-alert-light)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} onClick={() => remove(item.id)} id={`btn-wl-remove-${item.id}`}>
                      <TrashIcon size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
          {items.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-subtle)" }}>
              Tidak ada produk di wishlist Anda.
            </div>
          )}
        </div>
      )}
    </>
  );
}
