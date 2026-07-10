"use client";
import { useState, useEffect } from "react";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  HeartIcon, CartIcon, TrashIcon, LocationIcon
} from "@/components/ProductIcons";

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
      <div className="card" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", gap: "2rem" }}>
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
                <div style={{ padding: "1rem", flex: 1, display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
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
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
