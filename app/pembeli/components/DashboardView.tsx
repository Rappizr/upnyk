"use client";
import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/db";
import { 
  getOrdersAction, 
  getWishlistAction, 
  getProfileAction, 
  addToWishlistAction, 
  removeFromWishlistAction,
  addToCartAction
} from "@/app/actions";

function RiceIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
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

function FactoryIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M2 20h20M20 16v4M4 20v-8l6-4v4l6-4v4l4-4v12" />
    </svg>
  );
}

export default function DashboardView({ onCartUpdated, onNavigate, currentUserName }: { onCartUpdated?: () => void, onNavigate?: (tab: string, storeName?: string) => void, currentUserName?: string }) {
  const [products, setProducts] = useState<any[]>([]);
  const [coopStores, setCoopStores] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [profileName, setProfileName] = useState(currentUserName || "");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUserName) {
      setProfileName(currentUserName);
    }
  }, [currentUserName]);

 
const loadDashboardRealtime = useCallback(async () => {
    setLoading(true);
    try {
    
      const { data: adminTokoData } = await supabase
        .from("admin_toko")
        .select("id, nama_toko, desa, kecamatan, kabupaten, provinsi, foto, status");

    
      const activeAdminToko = (adminTokoData || []).filter((t: any) => {
        const st = String(t.status || "").toLowerCase().trim();
        return st !== "suspended" && st !== "nonaktif" && st !== "terblokir";
      });

      if (activeAdminToko && activeAdminToko.length > 0) {
        const mappedStores = activeAdminToko.map((t: any) => ({
          id: t.id,
          name: t.nama_toko || "Toko Mitra",
          desa: t.desa || "Desa Mitra",
          kabupaten: t.kabupaten || "Jawa Timur",
          rating: 4.9,
          reviews: 88,
          desc: `Toko resmi ${t.nama_toko} memproduksi dan menyediakan komoditas olahan unggulan.`,
          bg_color: "var(--color-primary-light)",
          foto: t.foto || null,
        }));
        setCoopStores(mappedStores);
      } else {
        setCoopStores([]);
      }

      const { data: etalaseData } = await supabase
        .from("etalase")
        .select("*")
        .or("status.eq.tayang,status.eq.Tayang,status.eq.live,status.eq.aktif,status.is.null")
        .order("created_at", { ascending: false });

      if (etalaseData && etalaseData.length > 0) {
        const tokoIds = etalaseData.map((e) => e.admin_toko_id).filter(Boolean);
        let tokoMap = new Map();
        if (tokoIds.length > 0) {
          const { data: tokoList } = await supabase
            .from("admin_toko")
            .select("id, nama_toko, desa, kabupaten, status")
            .in("id", tokoIds);

          if (tokoList) {
            tokoMap = new Map(tokoList.map((tk) => [tk.id, tk]));
          }
        }

        // 💡 FILTER BUANG PRODUK UNTUK TOKO YANG SUSPENDED
        const activeProducts = etalaseData.filter((e: any) => {
          const tokoObj = tokoMap.get(e.admin_toko_id);
          if (!tokoObj) return false;
          const st = String(tokoObj.status || "").toLowerCase().trim();
          return st !== "suspended" && st !== "nonaktif" && st !== "terblokir";
        });

        const mappedProducts = activeProducts.map((e: any) => {
          const tokoObj = tokoMap.get(e.admin_toko_id);
          const asal = [tokoObj?.desa, tokoObj?.kabupaten].filter(Boolean).join(", ") || "Indonesia";

          return {
            id: e.id,
            produk_id: e.produk_id || e.id,
            name: e.nama_produk || "Produk Toko",
            origin: asal,
            stock: Number(e.stok) > 0 ? "Tersedia" : "Habis",
            rating: 5.0,
            price: Number(e.harga_jual) || 0,
            weight: Number(e.berat) || Number(e.berat_kg) || 1,
            supplier: tokoObj?.nama_toko || "Toko Mitra",
            foto: e.foto || null,
          };
        });

        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }

      const [orderData, profileData, wlData] = await Promise.all([
        getOrdersAction(),
        getProfileAction(),
        getWishlistAction()
      ]);

      setOrders(orderData || []);
      setProfileName(currentUserName || (profileData ? (profileData.name || "Pengguna") : "Pengguna"));
      setWishlistItems(wlData || []);
      setWishlistCount(wlData ? wlData.length : 0);

    } catch (err) {
      console.error("Gagal memuat dashboard:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUserName]);

  useEffect(() => {
    loadDashboardRealtime();
  }, [loadDashboardRealtime]);

  const handleAddToWishlist = async (productId: string) => {
    try {
      const isWishlisted = wishlistItems.some((w: any) => (w.product_id === productId || w.id === productId));
      
      if (isWishlisted) {
        const success = await removeFromWishlistAction(productId);
        if (success) {
          setWishlistItems(prev => prev.filter((w: any) => (w.product_id !== productId && w.id !== productId)));
          setWishlistCount(prev => Math.max(0, prev - 1));
          alert("Produk berhasil dihapus dari wishlist.");
        } else {
          alert("Gagal menghapus dari wishlist.");
        }
      } else {
        const res = await addToWishlistAction(productId);
        if (res) {
          setWishlistItems(prev => [...prev, { id: res.id, product_id: productId }]);
          setWishlistCount(prev => prev + 1);
          alert("Berhasil ditambahkan ke wishlist!");
        } else {
          alert("Gagal menyimpan ke wishlist. Silakan coba lagi.");
        }
      }
    } catch (err) {
      console.error("Error handleAddToWishlist:", err);
    }
  };

  const [cartModalState, setCartModalState] = useState<{ isOpen: boolean; product: any }>({ isOpen: false, product: null });

  const handleAddOrder = async (p: any) => {
    try {
      const targetProductId = p.id || p.produk_id;
      if (!targetProductId) {
        alert("Gagal: ID Produk tidak ditemukan.");
        return;
      }

      const res = await addToCartAction(targetProductId, 1);
      if (res) {
        if (onCartUpdated) onCartUpdated();
        setCartModalState({
          isOpen: true,
          product: {
            name: p.name,
            price: p.price,
            foto: p.foto,
            supplier: p.supplier,
            qty: 1
          }
        });
      } else {
        alert("Gagal menambahkan produk ke keranjang. Silakan coba lagi.");
      }
    } catch (err: any) {
      console.error("Error handleAddOrder:", err);
      alert("Terjadi kesalahan: " + (err?.message || "Gagal memasukkan keranjang"));
    }
  };

  const activeOrdersCount = orders.filter(o => o.status !== "Selesai" && o.status !== "Dibatalkan").length;
  const completedOrdersCount = orders.filter(o => o.status === "Selesai").length;

  return (
    <>
   
      <div className="hero-banner" style={{ marginBottom: "1.5rem" }}>
        <div style={{ position: "relative", zIndex: 1 }}>
          <div className="badge badge-info" style={{ background: "rgba(255,255,255,0.2)", color: "white", marginBottom: "0.75rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            <StarIcon size={14} fill="currentColor" /> Platform UMKM #1 Indonesia
          </div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem", lineHeight: 1.3 }}>
            Selamat Datang, {profileName || (loading ? "..." : "Pengguna")}!
          </h1>
          <p style={{ opacity: 0.85, maxWidth: "460px", marginBottom: "1.25rem", fontSize: "0.9375rem" }}>
            Temukan produk unggulan dari toko-toko UMKM lokal terpercaya.
          </p>
          <div className="hero-actions" style={{ display: "flex", gap: "0.75rem" }}>
            <button 
              onClick={() => onNavigate?.("Marketplace")} 
              className="btn-primary" 
              style={{ background: "white", color: "var(--color-primary)", display: "inline-flex", alignItems: "center", gap: "0.5rem", border: "none", cursor: "pointer" }}
            >
              <CartIcon size={16} /> Jelajahi Marketplace
            </button>
            <button 
              onClick={() => onNavigate?.("Pesanan")} 
              className="btn-ghost" 
              style={{ borderColor: "rgba(255,255,255,0.4)", color: "white", display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "transparent", cursor: "pointer" }}
            >
              <PackageIcon size={16} /> Lihat Pesanan Saya
            </button>
          </div>
        </div>
      </div>

   
      <div className="stats-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="stat-card">
          <div className="stat-icon blue"><PackageIcon size={22} /></div>
          <div>
            <div className="stat-value">{loading ? "..." : activeOrdersCount}</div>
            <div className="stat-label">Pesanan Aktif</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"/></svg>
          </div>
          <div>
            <div className="stat-value">{loading ? "..." : completedOrdersCount}</div>
            <div className="stat-label">Pesanan Selesai</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon red"><HeartIcon size={22} /></div>
          <div>
            <div className="stat-value">{loading ? "..." : wishlistCount}</div>
            <div className="stat-label">Item di Wishlist</div>
          </div>
        </div>
      </div>

    
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <FactoryIcon size={20} /> Toko Admin &amp; UMKM Mitra
          </div>
          <div className="text-sm text-muted">Daftar toko resmi terdaftar di PasarNusa</div>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Memuat toko...</div>
      ) : coopStores.length === 0 ? (
        <div style={{ background: "white", padding: "2rem", textAlign: "center", borderRadius: "12px", border: "1px solid var(--color-border-light)", color: "#94A3B8", marginBottom: "1.5rem" }}>
          Belum ada toko yang terdaftar di sistem.
        </div>
      ) : (
        <div className="grid-3" style={{ marginBottom: "1.75rem" }}>
          {coopStores.map((c) => (
            <div key={c.id} className="card card-hover" style={{ display: "flex", flexDirection: "column", height: "100%", justifyContent: "space-between" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                
                  <div style={{ width: 44, height: 44, display: "flex", alignItems: "center", justifyContent: "center", background: "var(--color-primary-light)", borderRadius: "8px", overflow: "hidden", flexShrink: 0 }}>
                    {c.foto ? (
                      <img src={c.foto} alt={c.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "1.2rem" }}>🏪</span>
                    )}
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
                  <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {c.rating}
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
      )}

    
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1rem" }}>
        <div>
          <div className="text-lg font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <StarIcon size={20} className="text-amber-500" fill="currentColor" /> Produk Tayang Etalase
          </div>
          <div className="text-sm text-muted">Produk yang ditayangkan langsung oleh toko mitra</div>
        </div>
        <button 
          onClick={() => onNavigate?.("Marketplace")} 
          className="btn-ghost" 
          style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", cursor: "pointer", background: "transparent" }}
        >
          Lihat Semua →
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Memuat produk...</div>
      ) : products.length === 0 ? (
        <div style={{ background: "white", padding: "2rem", textAlign: "center", borderRadius: "12px", border: "1px solid var(--color-border-light)", color: "#94A3B8" }}>
          Belum ada produk yang ditayangkan oleh Admin Toko di Etalase.
        </div>
      ) : (
        <div className="product-grid" style={{ marginBottom: "1.75rem" }}>
          {products.map((p) => {
            const isWishlisted = wishlistItems.some((w: any) => (w.product_id === p.id || w.id === p.id));
            return (
              <div key={p.id} className="product-card card-hover">
                <div className="product-img" style={{ background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", height: "130px" }}>
                  {p.foto ? (
                    <img src={p.foto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "2rem" }}>📦</span>
                  )}
                </div>
                <div className="product-body">
                  <div className="text-xs text-primary font-bold" style={{ marginBottom: "0.2rem" }}>🏪 {p.supplier}</div>
                  <div className="product-name">{p.name}</div>
                  <div className="product-origin" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.375rem" }}>
                    <LocationIcon size={14} /> {p.origin}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                    <span className={`badge ${p.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                      {p.stock}
                    </span>
                  </div>
                  <div className="product-price">Rp {p.price.toLocaleString("id-ID")}</div>
                  <div className="product-footer" style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                    <button className="btn-primary" onClick={() => handleAddOrder(p)} style={{ flex: 1, padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }}>
                      <CartIcon size={14} /> + Beli
                    </button>
                    <button 
                      type="button" 
                      className="icon-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToWishlist(p.id);
                      }} 
                      style={{ color: isWishlisted ? "var(--color-alert)" : "inherit", cursor: "pointer" }}
                    >
                      <span style={{ pointerEvents: "none", display: "flex" }}>
                        <HeartIcon size={16} fill={isWishlisted ? "currentColor" : "none"} />
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
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
                  if (onNavigate) onNavigate("Keranjang");
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