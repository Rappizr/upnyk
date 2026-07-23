"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";
import { getWishlistAction, removeFromWishlistAction, addToCartAction } from "@/app/actions";

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

export default function WishlistView({ 
  onCartUpdated, 
  onNavigateMarketplace 
}: { 
  onCartUpdated?: () => void;
  onNavigateMarketplace?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // FETCH WISHLIST DENGAN INFORMASI ETALASE & ADMIN_TOKO REALTIME
  const loadWishlistRealtime = useCallback(async () => {
    setLoading(true);
    try {
      const wishData = await getWishlistAction();
      
      if (wishData && wishData.length > 0) {
        const prodIds = wishData.map((w: any) => w.product_id).filter(Boolean);

        // Fetch detail etalase
        let etalaseMap = new Map();
        let tokoMap = new Map();

        if (prodIds.length > 0) {
          const { data: etalaseList } = await supabase
            .from("etalase")
            .select("*")
            .in("id", prodIds);

          if (etalaseList && etalaseList.length > 0) {
            etalaseMap = new Map(etalaseList.map((e) => [e.id, e]));

            const tokoIds = etalaseList.map((e) => e.admin_toko_id).filter(Boolean);
            if (tokoIds.length > 0) {
              const { data: tokoList } = await supabase
                .from("admin_toko")
                .select("id, nama_toko, desa, kabupaten")
                .in("id", tokoIds);

              if (tokoList) {
                tokoMap = new Map(tokoList.map((t) => [t.id, t]));
              }
            }
          }
        }

        const formattedItems = wishData.map((w: any) => {
          const etalaseObj = etalaseMap.get(w.product_id) || w.product || {};
          const tokoObj = tokoMap.get(etalaseObj.admin_toko_id);
          const lokasi = [tokoObj?.desa, tokoObj?.kabupaten].filter(Boolean).join(", ") || "Indonesia";

          return {
            id: w.id || w.product_id,
            product_id: w.product_id,
            product: {
              id: etalaseObj.id || w.product_id,
              name: etalaseObj.nama_produk || etalaseObj.name || "Produk Toko",
              price: Number(etalaseObj.harga_jual) || Number(etalaseObj.price) || 0,
              stock: Number(etalaseObj.stok || etalaseObj.stock) > 0 ? "Tersedia" : "Habis",
              supplier: tokoObj?.nama_toko || etalaseObj.supplier || "Toko Mitra",
              origin: lokasi,
              foto: etalaseObj.foto || null,
            },
            price_dropped: false,
            saved_at: "Baru saja"
          };
        });

        setItems(formattedItems);
      } else {
        setItems([]);
      }
    } catch (err) {
      console.error("Gagal memuat wishlist:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWishlistRealtime();
  }, [loadWishlistRealtime]);

  const remove = async (productId: string, wishId: string) => {
    try {
      const success = await removeFromWishlistAction(productId);
      if (success) {
        setItems((prev) => prev.filter((i) => i.product_id !== productId && i.id !== wishId));
      } else {
        alert("Gagal menghapus dari wishlist.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCheckoutAll = async () => {
    try {
      for (const item of items) {
        const p = item.product;
        if (!p) continue;
        await addToCartAction(p.id, 1);
        await removeFromWishlistAction(item.product_id || p.id);
      }

      setItems([]);
      if (onCartUpdated) onCartUpdated();
      alert("Semua item berhasil dipindahkan ke keranjang!");
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
          <div>
            <div className="stat-value">{items.length}</div>
            <div className="text-sm text-muted">Item Tersimpan</div>
          </div>
          <div>
            <div className="stat-value text-secondary">{items.filter((i) => i.price_dropped).length}</div>
            <div className="text-sm text-muted">Harga Turun</div>
          </div>
          <div>
            <div className="stat-value text-primary">
              Rp {items.reduce((a, b) => a + (b.product?.price || 0), 0).toLocaleString("id-ID")}
            </div>
            <div className="text-sm text-muted">Total Estimasi</div>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={handleCheckoutAll} 
          disabled={items.length === 0} 
          style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }} 
          id="btn-checkout-all-wishlist"
        >
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
                <div className="wishlist-img-wrapper" style={{ width: 80, height: 80, background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "8px", overflow: "hidden" }}>
                  {p.foto ? (
                    <img src={p.foto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>📦</span>
                  )}
                </div>

                <div className="wishlist-card-body" style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
                      {item.price_dropped && (
                        <span className="badge badge-danger text-xs">Harga Turun!</span>
                      )}
                      <span className="badge badge-info text-xs">Toko Admin</span>
                      <span className="text-xs text-primary font-semibold">🏪 {p.supplier}</span>
                    </div>

                    <div className="font-semibold" style={{ fontSize: "0.95rem", color: "#1E293B" }}>{p.name}</div>
                    
                    <div className="text-sm text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginTop: "0.15rem" }}>
                      <LocationIcon size={14} /> {p.origin}
                    </div>
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

                  <div className="wishlist-card-actions" style={{ display: "flex", gap: "0.5rem" }}>
                    <button 
                      className="btn-secondary" 
                      onClick={async () => {
                        await addToCartAction(p.id, 1);
                        await remove(item.product_id, item.id);
                        if (onCartUpdated) onCartUpdated();
                      }}
                      style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} 
                      id={`btn-wl-cart-${item.id}`}
                    >
                      <CartIcon size={14} /> Beli
                    </button>
                    <button 
                      className="btn-ghost" 
                      style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", color: "var(--color-alert)", borderColor: "var(--color-alert-light)", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} 
                      onClick={() => remove(item.product_id, item.id)} 
                      id={`btn-wl-remove-${item.id}`}
                    >
                      <TrashIcon size={14} /> Hapus
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="wishlist-empty-state" style={{ background: "white", padding: "3rem", borderRadius: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>
              <div className="wishlist-empty-icon" style={{ marginBottom: "1rem", color: "#94A3B8" }}>
                <HeartIcon size={48} fill="none" />
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)", marginBottom: "0.5rem" }}>
                Wishlist Anda Kosong
              </h3>
              <p style={{ fontSize: "0.875rem", color: "var(--color-text-muted)", maxWidth: "400px", margin: "0 auto 1.5rem auto" }}>
                Jelajahi berbagai produk terbaik dari toko admin mitra kami dan simpan favorit Anda di sini.
              </p>
              {onNavigateMarketplace && (
                <button 
                  className="btn-primary" 
                  onClick={onNavigateMarketplace}
                  style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem" }}
                  id="btn-wishlist-explore"
                >
                  <CartIcon size={16} /> Mulai Belanja
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
}