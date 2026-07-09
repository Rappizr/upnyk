"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  HeartIcon, CartIcon, TrashIcon, LocationIcon
} from "@/components/ProductIcons";

export default function WishlistPage() {
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
      // Loop checkout all products
      for (const item of items) {
        const p = item.product;
        await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplier: "Supplier Lokasi Terdekat",
            items: [{ icon_type: p.icon_type, name: p.name, qty: 1, price: p.price }],
            total: p.price
          })
        });
        // Remove from wishlist
        await fetch(`/api/wishlist?id=${item.id}`, { method: "DELETE" });
      }
      setItems([]);
      alert("Semua item berhasil dipindahkan ke pesanan!");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
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
            return (
              <div key={item.id} className="wishlist-card" id={`wishlist-item-${item.id}`}>
                <div style={{ width: 100, height: 100, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <IconRenderer type={p.icon_type} size={44} className="text-amber-500" />
                </div>
                <div style={{ padding: "1rem", flex: 1, display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
                  <div>
                    {item.price_dropped && (
                      <div className="badge badge-danger" style={{ marginBottom: "0.375rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                        Harga Turun!
                      </div>
                    )}
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
                        await fetch("/api/orders", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            supplier: "Supplier Lokasi Terdekat",
                            items: [{ icon_type: p.icon_type, name: p.name, qty: 1, price: p.price }],
                            total: p.price
                          })
                        });
                        await remove(item.id);
                        alert("Berhasil dipindahkan ke pesanan!");
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
    </AppLayout>
  );
}

