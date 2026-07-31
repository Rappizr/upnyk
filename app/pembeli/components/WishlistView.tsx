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
  onNavigateMarketplace,
  onNavigateToCart
}: { 
  onCartUpdated?: () => void;
  onNavigateMarketplace?: () => void;
  onNavigateToCart?: () => void;
}) {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [cartModalState, setCartModalState] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });

  const loadWishlistRealtime = useCallback(async () => {
    setLoading(true);
    try {
      const wishData = await getWishlistAction();
      
      if (wishData && wishData.length > 0) {
        const formattedItems = wishData.map((w: any) => {
          const p = w.product || {};
          return {
            id: w.id || w.product_id,
            product_id: w.product_id,
            product: {
              id: p.id || w.product_id,
              name: p.name || p.nama_produk || "Produk Favorit",
              price: Number(p.price) || Number(p.harga_jual) || 0,
              stock: p.stock || "Tersedia",
              supplier: p.supplier || "Toko Mitra",
              origin: p.origin || "Indonesia",
              foto: p.foto || p.image || null,
              icon_type: p.icon_type || "rice"
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
    setLoading(true);
    const count = items.length;
    await Promise.all(
      items.map(async (item) => {
        const prodId = item.product_id || item.product?.id || item.id;
        if (prodId) {
          await addToCartAction(prodId, 1);
          await removeFromWishlistAction(prodId);
        }
      })
    );

    setItems([]);
    if (onCartUpdated) onCartUpdated();

    setCartModalState({
      isOpen: true,
      product: {
        name: `${count} Produk Wishlist`,
        qty: count
      }
    });
  } catch (err) {
    console.error("Error batch checkout wishlist:", err);
    alert("Gagal memindahkan sebagian item ke keranjang.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <HeartIcon size={28} className="text-red-500" fill="currentColor" /> Wishlist Saya
      </h1>
      <p className="page-subtitle">Pantau produk favorit dan dapatkan notifikasi saat harga turun</p>

     
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
                        const targetId = item.product_id || p.id || item.id;
                        await addToCartAction(targetId, 1);
                        await remove(item.product_id, item.id);
                        if (onCartUpdated) onCartUpdated();
                        setCartModalState({
                          isOpen: true,
                          product: {
                            name: p.name || "Produk Wishlist",
                            price: p.price,
                            foto: p.foto,
                            supplier: p.supplier,
                            qty: 1
                          }
                        });
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
            <div className="wishlist-empty-state" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", textAlign: "center" }}>
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

      {cartModalState.isOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(15, 23, 42, 0.6)",
            backdropFilter: "blur(6px)",
            WebkitBackdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "1rem",
          }}
          onClick={() => setCartModalState({ isOpen: false, product: null })}
        >
          <div
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "20px",
              padding: "1.75rem",
              width: "380px",
              maxWidth: "100%",
              boxShadow: "0 25px 50px -12px rgba(15, 23, 42, 0.25)",
              position: "relative",
              textAlign: "center",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setCartModalState({ isOpen: false, product: null })}
              style={{
                position: "absolute",
                top: "14px",
                right: "14px",
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                border: "none",
                backgroundColor: "#F1F5F9",
                color: "#64748B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: "1.1rem",
              }}
            >
              ✕
            </button>

            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                boxShadow: "0 10px 25px rgba(16, 185, 129, 0.35)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0.25rem auto 1rem auto",
              }}
            >
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>

            <h3 style={{ margin: "0 0 0.35rem 0", fontSize: "1.15rem", fontWeight: 800, color: "#0F172A" }}>
              Berhasil Ditambahkan!
            </h3>
            <p style={{ fontSize: "0.825rem", color: "#64748B", margin: "0 0 1.25rem 0", lineHeight: "1.4" }}>
              Produk pilihan Anda telah dimasukkan ke keranjang belanja.
            </p>

            {cartModalState.product && (
              <div
                style={{
                  backgroundColor: "#F8FAFC",
                  border: "1px solid #E2E8F0",
                  borderRadius: "14px",
                  padding: "0.875rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.875rem",
                  textAlign: "left",
                  marginBottom: "1.5rem",
                }}
              >
                <div
                  style={{
                    width: "56px",
                    height: "56px",
                    borderRadius: "10px",
                    backgroundColor: "#E2E8F0",
                    overflow: "hidden",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {cartModalState.product.foto ? (
                    <img src={cartModalState.product.foto} alt={cartModalState.product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "1.75rem" }}>📦</span>
                  )}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  {cartModalState.product.supplier && (
                    <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#2563EB", textTransform: "uppercase", marginBottom: "0.15rem" }}>
                      🏪 {cartModalState.product.supplier}
                    </div>
                  )}
                  <div style={{ fontSize: "0.875rem", fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {cartModalState.product.name}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.25rem" }}>
                    {cartModalState.product.price ? (
                      <span style={{ fontSize: "0.825rem", fontWeight: 700, color: "#059669" }}>
                        Rp {cartModalState.product.price.toLocaleString("id-ID")}
                      </span>
                    ) : (
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>Item siap diproses</span>
                    )}
                    <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#64748B", backgroundColor: "#E2E8F0", padding: "0.15rem 0.45rem", borderRadius: "6px" }}>
                      {cartModalState.product.qty || 1} item
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <button
                onClick={() => {
                  setCartModalState({ isOpen: false, product: null });
                  if (onNavigateToCart) onNavigateToCart();
                }}
                style={{
                  width: "100%",
                  padding: "0.75rem 1rem",
                  borderRadius: "12px",
                  border: "none",
                  background: "linear-gradient(135deg, #10B981 0%, #059669 100%)",
                  color: "#FFFFFF",
                  fontWeight: 700,
                  fontSize: "0.875rem",
                  cursor: "pointer",
                  boxShadow: "0 4px 14px rgba(16, 185, 129, 0.35)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="9" cy="21" r="1" />
                  <circle cx="20" cy="21" r="1" />
                  <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                </svg>
                Lihat Keranjang
              </button>
              <button
                onClick={() => setCartModalState({ isOpen: false, product: null })}
                style={{
                  width: "100%",
                  padding: "0.7rem 1rem",
                  borderRadius: "12px",
                  border: "1px solid #E2E8F0",
                  backgroundColor: "#FFFFFF",
                  color: "#475569",
                  fontWeight: 600,
                  fontSize: "0.85rem",
                  cursor: "pointer",
                }}
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}