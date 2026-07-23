"use client";
import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";
import { 
  getWishlistAction, 
  addToWishlistAction, 
  removeFromWishlistAction 
} from "@/app/actions";

// ICON COMPONENTS
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

function LocationIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function CashIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect width="20" height="12" x="2" y="6" rx="2" />
      <circle cx="12" cy="12" r="2" />
      <line x1="6" y1="12" x2="6.01" y2="12" />
      <line x1="18" y1="12" x2="18.01" y2="12" />
    </svg>
  );
}

interface MarketplaceViewProps {
  onCartUpdated?: () => void;
  onNavigateToCart?: () => void;
  initialStoreFilter?: string;
  clearInitialStoreFilter?: () => void;
}

export default function MarketplaceView({ 
  onCartUpdated, 
  onNavigateToCart,
  initialStoreFilter,
  clearInitialStoreFilter
}: MarketplaceViewProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState("Semua Wilayah");
  const [sortBy, setSortBy] = useState("terbaru");
  const [loading, setLoading] = useState(true);

  // WISHLIST & MODAL STATE
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  // 1. FETCH DATA REALTIME TOKO & ETALASE TAYANG DARI SUPABASE
  const loadMarketplaceData = useCallback(async () => {
    setLoading(true);
    try {
      // A. Load Toko dari `admin_toko`
      const { data: tokoData, error: errToko } = await supabase
        .from("admin_toko")
        .select("id, nama_toko, desa, kecamatan, kabupaten, provinsi, foto");

      if (errToko) console.error("Error load admin_toko:", errToko.message);
      setStores(tokoData || []);

      // B. Load Produk dari `etalase` yang status = 'tayang'
      const { data: etalaseData, error: errEtalase } = await supabase
        .from("etalase")
        .select("*")
        .eq("status", "tayang")
        .order("created_at", { ascending: false });

      if (errEtalase) console.error("Error load etalase:", errEtalase.message);

      if (etalaseData && etalaseData.length > 0) {
        const tokoMap = new Map((tokoData || []).map((t) => [t.id, t]));

        const mappedProducts = etalaseData.map((e: any) => {
          const toko = tokoMap.get(e.admin_toko_id);
          const lokasi = [toko?.desa, toko?.kabupaten].filter(Boolean).join(", ") || "Indonesia";

          return {
            id: e.id,
            admin_toko_id: e.admin_toko_id,
            name: e.nama_produk || "Produk Toko",
            price: Number(e.harga_jual) || 0,
            diskon: Number(e.diskon_persen) || 0,
            stock: Number(e.stok) || 0,
            satuan: e.satuan || "pcs",
            storeName: toko?.nama_toko || "Toko Mitra",
            kabupaten: toko?.kabupaten || "",
            origin: lokasi,
            foto: e.foto || null,
            deskripsi: e.deskripsi || "Produk berkualitas tinggi tersedia di toko mitra kami.",
            rating: 5.0,
            reviews: 0
          };
        });

        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }

      // C. Load Wishlist User
      const wlData = await getWishlistAction();
      if (wlData) {
        setWishlistedIds(wlData.map((w: any) => w.product_id));
      }

    } catch (err) {
      console.error("Gagal memuat data marketplace:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMarketplaceData();
  }, [loadMarketplaceData]);

  useEffect(() => {
    if (initialStoreFilter && stores.length > 0) {
      const found = stores.find((s) => s.nama_toko.toLowerCase() === initialStoreFilter.toLowerCase());
      if (found) setSelectedStoreId(found.id);
      clearInitialStoreFilter?.();
    }
  }, [initialStoreFilter, stores, clearInitialStoreFilter]);

// TOGGLE WISHLIST REALTIME DENGAN HANDLING ERROR
  const handleToggleWishlist = async (productId: string) => {
    try {
      const isWishlisted = wishlistedIds.includes(productId);

      if (isWishlisted) {
        // Optimistic UI Update (langsung ubah warna agar responsif)
        setWishlistedIds((prev) => prev.filter((id) => id !== productId));

        const ok = await removeFromWishlistAction(productId);
        if (!ok) {
          // Revert jika gagal di server
          setWishlistedIds((prev) => [...prev, productId]);
          alert("Gagal menghapus dari wishlist.");
        }
      } else {
        // Optimistic UI Update
        setWishlistedIds((prev) => [...prev, productId]);

        const res = await addToWishlistAction(productId);
        if (!res) {
          // Revert jika gagal
          setWishlistedIds((prev) => prev.filter((id) => id !== productId));
          alert("Gagal menyimpan ke wishlist. Pastikan Anda sudah login!");
        }
      }
    } catch (err: any) {
      console.error("Error toggle wishlist:", err);
      alert("Terjadi kesalahan saat menyimpan wishlist: " + (err.message || ""));
    }
  };

  // TAMBAH KE KERANJANG BELANJA (LOCALSTORAGE)
  const handleAddToCart = (p: any, qty = 1) => {
    try {
      const saved = localStorage.getItem("cartItems");
      let cart = saved ? JSON.parse(saved) : [];

      const idx = cart.findIndex((item: any) => item.product.id === p.id);
      if (idx > -1) {
        cart[idx].qty += qty;
      } else {
        cart.push({
          id: Date.now() + Math.random(),
          product: {
            id: p.id,
            admin_toko_id: p.admin_toko_id,
            name: p.name,
            price: p.diskon > 0 ? Math.round(p.price * (1 - p.diskon / 100)) : p.price,
            supplier: p.storeName,
            origin: p.origin,
            foto: p.foto,
            satuan: p.satuan
          },
          qty: qty
        });
      }

      localStorage.setItem("cartItems", JSON.stringify(cart));
      if (onCartUpdated) onCartUpdated();

      setAddedProductName(p.name);
      setShowCartPopup(true);
    } catch (e) {
      console.error("Gagal tambah keranjang:", e);
    }
  };

  // FILTER & SORTING PRODUK
  let filteredProducts = products.filter((p) => {
    const q = searchQuery.toLowerCase().trim();
    const matchSearch = !q || p.name.toLowerCase().includes(q) || p.storeName.toLowerCase().includes(q);
    const matchStore = !selectedStoreId || p.admin_toko_id === selectedStoreId;
    const matchLoc = activeLocation === "Semua Wilayah" || (p.kabupaten || "").toLowerCase().includes(activeLocation.toLowerCase());
    return matchSearch && matchStore && matchLoc;
  });

  if (sortBy === "termurah") {
    filteredProducts.sort((a, b) => a.price - b.price);
  } else if (sortBy === "termahal") {
    filteredProducts.sort((a, b) => b.price - a.price);
  }

  const selectedStoreObj = stores.find((s) => s.id === selectedStoreId);
  const locationOptions = ["Semua Wilayah", ...Array.from(new Set(stores.map((s) => s.kabupaten).filter(Boolean)))];

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      {/* HEADER MARKETPLACE */}
      <div style={{ marginBottom: "1.25rem" }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem", margin: 0 }}>
          <CartIcon size={28} className="text-primary" /> Marketplace Toko
        </h1>
        <p className="page-subtitle" style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
          Jelajahi komoditas segar dan olahan unggulan dari Toko Admin terpercaya.
        </p>
      </div>

      {/* SEARCH BAR */}
      <div style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Cari produk berdasarkan nama atau nama toko..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ width: "100%", padding: "0.75rem 1rem", borderRadius: "10px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      {/* BARIS FILTER (PILIK TOKO, WILAYAH, URUTAN) */}
      <div style={{ display: "flex", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap", alignItems: "center" }}>
        {/* DROPDOWN TOKO */}
        <div style={{ flex: 1, minWidth: "180px" }}>
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white", color: "#1E293B", outline: "none" }}
          >
            <option value="">-- Filter Semua Toko --</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>🏪 {s.nama_toko}</option>
            ))}
          </select>
        </div>

        {/* DROPDOWN WILAYAH */}
        <div style={{ minWidth: "150px" }}>
          <select
            value={activeLocation}
            onChange={(e) => setActiveLocation(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white", color: "#1E293B", outline: "none" }}
          >
            {locationOptions.map((loc: any) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </div>

        {/* DROPDOWN SORTING */}
        <div style={{ minWidth: "150px" }}>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white", color: "#1E293B", outline: "none" }}
          >
            <option value="terbaru">Terbaru</option>
            <option value="termurah">Harga Terendah</option>
            <option value="termahal">Harga Tertinggi</option>
          </select>
        </div>
      </div>

      {/* BANNER PROFIL TOKO AKTIF */}
      {selectedStoreObj && (
        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.75rem" }}>
          <div>
            <span className="badge badge-info" style={{ fontSize: "0.68rem", fontWeight: 700, textTransform: "uppercase" }}>Melihat Katalog Toko</span>
            <h2 style={{ margin: "0.25rem 0 0 0", fontSize: "1.2rem", fontWeight: 800, color: "#1E293B" }}>{selectedStoreObj.nama_toko}</h2>
            <p style={{ margin: "0.2rem 0 0 0", fontSize: "0.8rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
              <LocationIcon size={14} /> {selectedStoreObj.desa}, {selectedStoreObj.kabupaten}, {selectedStoreObj.provinsi}
            </p>
          </div>
          <button 
            onClick={() => setSelectedStoreId("")}
            style={{ background: "white", border: "1px solid #CBD5E1", padding: "0.45rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", cursor: "pointer", color: "#475569", fontWeight: 700 }}
          >
            ✕ Tutup Katalog Toko
          </button>
        </div>
      )}

      {/* RENDER GRID PRODUK */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "#64748B" }}>Memuat produk etalase toko...</div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ background: "white", padding: "3rem", textAlign: "center", borderRadius: "12px", border: "1px solid #E2E8F0", color: "#94A3B8" }}>
          {selectedStoreId ? "Toko ini belum menayangkan produk di etalase." : "Belum ada produk yang ditayangkan oleh Admin Toko."}
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "1.25rem" }}>
          {filteredProducts.map((p) => {
            const isWishlisted = wishlistedIds.includes(p.id);
            const hargaFinal = p.diskon > 0 ? Math.round(p.price * (1 - p.diskon / 100)) : p.price;

            return (
              <div 
                key={p.id} 
                style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", overflow: "hidden", display: "flex", flexDirection: "column", position: "relative", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}
              >
{/* TOMBOL WISHLIST FLOATING */}
<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    e.preventDefault();
    handleToggleWishlist(p.id);
  }}
  style={{ 
    position: "absolute", 
    top: "10px", 
    right: "10px", 
    zIndex: 50, 
    background: "rgba(255, 255, 255, 0.95)", 
    border: isWishlisted ? "1px solid #EF4444" : "1px solid #CBD5E1", 
    borderRadius: "50%", 
    width: "34px", 
    height: "34px", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    cursor: "pointer", 
    color: isWishlisted ? "#EF4444" : "#94A3B8",
    boxShadow: "0 2px 6px rgba(0,0,0,0.12)"
  }}
  title={isWishlisted ? "Hapus dari Wishlist" : "Tambah ke Wishlist"}
>
  <span style={{ pointerEvents: "none", display: "flex" }}>
    <HeartIcon size={18} fill={isWishlisted ? "currentColor" : "none"} />
  </span>
</button>

                {/* GAMBAR PRODUK */}
                <div 
                  onClick={() => { setSelectedProduct(p); setDetailQty(1); }}
                  style={{ height: "140px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", cursor: "pointer" }}
                >
                  {p.foto ? (
                    <img src={p.foto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "2.5rem" }}>📦</span>
                  )}
                </div>

                {/* INFO PRODUK */}
                <div style={{ padding: "0.9rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div 
                    onClick={() => setSelectedStoreId(p.admin_toko_id)}
                    style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 800, textTransform: "uppercase", marginBottom: "0.2rem", cursor: "pointer" }}
                  >
                    🏪 {p.storeName}
                  </div>

                  <div 
                    onClick={() => { setSelectedProduct(p); setDetailQty(1); }}
                    style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.25rem", cursor: "pointer" }}
                  >
                    {p.name}
                  </div>

                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginBottom: "0.4rem", display: "flex", alignItems: "center", gap: "3px" }}>
                    <LocationIcon size={12} /> {p.origin}
                  </div>

                  <div style={{ fontSize: "0.75rem", color: p.stock > 0 ? "#10B981" : "#EF4444", fontWeight: 700, marginBottom: "0.6rem" }}>
                    {p.stock > 0 ? `✓ Tersedia (${p.stock} ${p.satuan})` : "✕ Stok Habis"}
                  </div>

                  {/* HARGA */}
                  <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px dashed #F1F5F9", marginBottom: "0.75rem" }}>
                    {p.diskon > 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", color: "#94A3B8", textDecoration: "line-through" }}>Rp {p.price.toLocaleString("id-ID")}</span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "#FEE2E2", color: "#991B1B", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>-{p.diskon}%</span>
                        </div>
                        <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F59E0B" }}>Rp {hargaFinal.toLocaleString("id-ID")}</div>
                      </div>
                    ) : (
                      <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E293B" }}>Rp {p.price.toLocaleString("id-ID")}</div>
                    )}
                  </div>

                  {/* AKSI TOMBOL */}
                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button
                      onClick={() => handleAddToCart(p, 1)}
                      disabled={p.stock <= 0}
                      style={{ flex: 1, padding: "0.5rem 0.25rem", borderRadius: "6px", border: "1px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontWeight: 700, fontSize: "0.75rem", cursor: p.stock > 0 ? "pointer" : "not-allowed", opacity: p.stock > 0 ? 1 : 0.5 }}
                    >
                      + Keranjang
                    </button>
                    <button
                      onClick={() => {
                        handleAddToCart(p, 1);
                        if (onNavigateToCart) onNavigateToCart();
                      }}
                      disabled={p.stock <= 0}
                      style={{ flex: 1, padding: "0.5rem 0.25rem", borderRadius: "6px", border: "none", background: p.stock > 0 ? "#2563EB" : "#CBD5E1", color: "white", fontWeight: 800, fontSize: "0.75rem", cursor: p.stock > 0 ? "pointer" : "not-allowed" }}
                    >
                      Beli
                    </button>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL DETAIL PRODUK */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "1.5rem", width: "550px", maxWidth: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: "absolute", top: "1rem", right: "1rem", background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "#94A3B8" }}
            >
              &times;
            </button>

            <div style={{ display: "flex", gap: "1.25rem", flexWrap: "wrap", marginBottom: "1rem" }}>
              <div style={{ width: "140px", height: "140px", background: "#F1F5F9", borderRadius: "12px", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {selectedProduct.foto ? (
                  <img src={selectedProduct.foto} alt={selectedProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "3rem" }}>📦</span>
                )}
              </div>

              <div style={{ flex: 1, minWidth: "200px" }}>
                <span style={{ fontSize: "0.75rem", color: "#2563EB", fontWeight: 800, textTransform: "uppercase" }}>🏪 {selectedProduct.storeName}</span>
                <h2 style={{ margin: "0.2rem 0 0.4rem 0", fontSize: "1.25rem", fontWeight: 800, color: "#1E293B" }}>{selectedProduct.name}</h2>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
                  <LocationIcon size={14} /> {selectedProduct.origin}
                </p>

                <div style={{ marginTop: "0.8rem", fontSize: "1.3rem", fontWeight: 800, color: "#F59E0B" }}>
                  Rp {(selectedProduct.diskon > 0 ? Math.round(selectedProduct.price * (1 - selectedProduct.diskon / 100)) : selectedProduct.price).toLocaleString("id-ID")}
                </div>
              </div>
            </div>

            <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "0.85rem", marginBottom: "1.25rem" }}>
              <h4 style={{ margin: "0 0 0.35rem 0", fontSize: "0.88rem", fontWeight: 700, color: "#334155" }}>Deskripsi Produk</h4>
              <p style={{ margin: 0, fontSize: "0.82rem", color: "#64748B", lineHeight: 1.5 }}>{selectedProduct.deskripsi}</p>
            </div>

            {/* BARIS JUMLAH & TOMBOL BUY */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", borderTop: "1px dashed #E2E8F0", paddingTop: "1rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 700, color: "#475569" }}>Jumlah:</span>
                <button onClick={() => setDetailQty(Math.max(1, detailQty - 1))} style={{ width: "28px", height: "28px", border: "1px solid #CBD5E1", borderRadius: "6px", background: "white", cursor: "pointer", fontWeight: 800 }}>-</button>
                <span style={{ fontSize: "0.9rem", fontWeight: 800, minWidth: "20px", textAlign: "center" }}>{detailQty}</span>
                <button onClick={() => setDetailQty(detailQty + 1)} style={{ width: "28px", height: "28px", border: "1px solid #CBD5E1", borderRadius: "6px", background: "white", cursor: "pointer", fontWeight: 800 }}>+</button>
              </div>

              <div style={{ display: "flex", gap: "0.5rem", flex: 1, minWidth: "200px" }}>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "1px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                    if (onNavigateToCart) onNavigateToCart();
                  }}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}
                >
                  Beli Sekarang
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* POPUP SUKSES MASUK KERANJANG */}
      {showCartPopup && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "1.75rem", width: "380px", maxWidth: "100%", textAlign: "center", position: "relative", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <button onClick={() => setShowCartPopup(false)} style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", fontSize: "1.2rem", cursor: "pointer", color: "#94A3B8" }}>&times;</button>
            
            <div style={{ width: "50px", height: "50px", background: "#DCFCE7", color: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", fontSize: "1.5rem" }}>
              ✓
            </div>

            <h3 style={{ fontSize: "1.1rem", fontWeight: 800, margin: "0 0 0.35rem 0", color: "#1E293B" }}>Berhasil Ditambahkan!</h3>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "0 0 1.25rem 0", lineHeight: 1.4 }}>
              <strong>{addedProductName}</strong> berhasil dimasukkan ke keranjang belanja Anda.
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <button 
                onClick={() => {
                  setShowCartPopup(false);
                  if (onNavigateToCart) onNavigateToCart();
                }} 
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 800, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Lihat Keranjang Belanja
              </button>
              <button 
                onClick={() => setShowCartPopup(false)} 
                style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}
              >
                Lanjut Belanja
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}