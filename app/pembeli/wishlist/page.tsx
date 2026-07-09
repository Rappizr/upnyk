"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  HoneyIcon, CoffeeIcon, SpiceIcon, OilIcon, 
  HeartIcon, CartIcon, TrashIcon, StarIcon
} from "@/components/ProductIcons";

const wishlistItems = [
  { id: 1, icon: <HoneyIcon size={44} className="text-amber-500" fill="currentColor" />, name: "Madu Hutan Kalimantan", origin: "Pontianak, Kalimantan Barat", price: 135000, oldPrice: 155000, stock: "Tersedia", saved: "2 hari lalu", priceDropped: true },
  { id: 2, icon: <CoffeeIcon size={44} className="text-amber-800" />, name: "Kopi Arabika Gayo Premium", origin: "Gayo, Aceh", price: 95000, oldPrice: null, stock: "Tersedia", saved: "5 hari lalu", priceDropped: false },
  { id: 3, icon: <SpiceIcon size={44} className="text-red-500" />, name: "Sambal Roa Manado", origin: "Manado, Sulawesi Utara", price: 48000, oldPrice: 55000, stock: "Terbatas", saved: "1 minggu lalu", priceDropped: true },
  { id: 4, icon: <OilIcon size={44} className="text-emerald-600" />, name: "Minyak Kelapa Extra Virgin", origin: "Minahasa, Sulawesi Utara", price: 62000, oldPrice: null, stock: "Tersedia", saved: "2 minggu lalu", priceDropped: false },
];

export default function WishlistPage() {
  const [items, setItems] = useState(wishlistItems);

  const remove = (id: number) => setItems((prev) => prev.filter((i) => i.id !== id));

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
          <div><div className="stat-value text-secondary">{items.filter((i) => i.priceDropped).length}</div><div className="text-sm text-muted">Harga Turun</div></div>
          <div><div className="stat-value text-primary">
            Rp {items.reduce((a, b) => a + b.price, 0).toLocaleString("id-ID")}
          </div><div className="text-sm text-muted">Total Estimasi</div></div>
        </div>
        <button className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }} id="btn-checkout-all-wishlist">
          <CartIcon size={16} /> Pindah Semua ke Keranjang
        </button>
      </div>

      {/* Wishlist Items */}
      <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
        {items.map((item) => (
          <div key={item.id} className="wishlist-card" id={`wishlist-item-${item.id}`}>
            <div style={{ width: 100, height: 100, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {item.icon}
            </div>
            <div style={{ padding: "1rem", flex: 1, display: "flex", alignItems: "center", gap: "1rem", justifyContent: "space-between" }}>
              <div>
                {item.priceDropped && (
                  <div className="badge badge-danger" style={{ marginBottom: "0.375rem", display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                    Harga Turun!
                  </div>
                )}
                <div className="font-semibold">{item.name}</div>
                <div className="text-sm text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                  <LocationIcon size={14} /> {item.origin}
                </div>
                <div className="text-xs text-subtle" style={{ marginTop: "0.25rem" }}>Disimpan {item.saved}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <span className={`badge ${item.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                  {item.stock}
                </span>
              </div>
              <div style={{ textAlign: "right" }}>
                {item.oldPrice && (
                  <div className="text-sm text-muted" style={{ textDecoration: "line-through" }}>
                    Rp {item.oldPrice.toLocaleString("id-ID")}
                  </div>
                )}
                <div className="font-bold text-primary" style={{ fontSize: "1.1rem" }}>
                  Rp {item.price.toLocaleString("id-ID")}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                <button className="btn-secondary" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-wl-cart-${item.id}`}>
                  <CartIcon size={14} /> Beli
                </button>
                <button className="btn-ghost" style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", color: "var(--color-alert)", borderColor: "var(--color-alert-light)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} onClick={() => remove(item.id)} id={`btn-wl-remove-${item.id}`}>
                  <TrashIcon size={14} /> Hapus
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
