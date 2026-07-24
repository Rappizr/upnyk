"use client";

import React, { useState, useEffect, useCallback } from "react";
import { 
  supabase, 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist, 
  addToCart 
} from "@/lib/db";

// ==================== ICONS ====================
function StarIcon({ size = 12, className = "", style }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} style={style}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function HeartIcon({ size = 16, filled = false, className = "", style }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? "#EF4444" : "none"} stroke={filled ? "#EF4444" : "currentColor"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
    </svg>
  );
}

function LocationIcon({ size = 12, className = "", style }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function StoreIcon({ size = 14, className = "", style }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} style={style}>
      <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
      <path d="M2 7h20" />
    </svg>
  );
}

// ==================== INTERFACES ====================
interface MarketplaceViewProps {
  onCartUpdated?: () => void;
  onNavigateToCart?: () => void;
  initialStoreFilter?: string;
  clearInitialStoreFilter?: () => void;
  searchQuery?: string; // Prop opsional jika ingin menghubungkan search dari topbar utama
}

export default function MarketplaceView({ 
  onCartUpdated, 
  onNavigateToCart,
  initialStoreFilter,
  clearInitialStoreFilter,
  searchQuery = ""
}: MarketplaceViewProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>("");
  const [activeLocation, setActiveLocation] = useState("Semua Wilayah");
  const [sortBy, setSortBy] = useState("terbaru");
  const [loading, setLoading] = useState(true);

  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [showCartPopup, setShowCartPopup] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  const loadMarketplaceData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: tokoData, error: errToko } = await supabase
        .from("admin_toko")
        .select("id, nama_toko, desa, kecamatan, kabupaten, provinsi, foto");

      if (errToko) console.error("Error load admin_toko:", errToko.message);
      setStores(tokoData || []);

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
          const lokasi = [toko?.desa, toko?.kabupaten].filter(Boolean).join(", ");

          return {
            id: e.id,
            produk_id: e.produk_id || e.id,
            etalase_id: e.id,
            admin_toko_id: e.admin_toko_id,
            name: e.nama_produk || "",
            price: Number(e.harga_jual) || 0,
            diskon: Number(e.diskon_persen) || 0,
            stock: Number(e.stok) || 0,
            satuan: e.satuan || "pcs",
            storeName: toko?.nama_toko || "",
            kabupaten: toko?.kabupaten || "",
            origin: lokasi,
            foto: e.foto || null,
            deskripsi: e.deskripsi || "",
          };
        });

        setProducts(mappedProducts);
      } else {
        setProducts([]);
      }

      const wlData = await getWishlist();
      if (wlData) {
        setWishlistedIds(wlData.map((w: any) => w.product_id || w.id));
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

  const handleToggleWishlist = async (productId: string) => {
    try {
      const isWishlisted = wishlistedIds.includes(productId);

      if (isWishlisted) {
        setWishlistedIds((prev) => prev.filter((id) => id !== productId));
        const ok = await removeFromWishlist(productId);
        if (!ok) setWishlistedIds((prev) => [...prev, productId]);
      } else {
        setWishlistedIds((prev) => [...prev, productId]);
        const res = await addToWishlist(productId);
        if (!res) {
          setWishlistedIds((prev) => prev.filter((id) => id !== productId));
          alert("Gagal menyimpan ke wishlist. Pastikan Anda sudah login!");
        }
      }
    } catch (err: any) {
      console.error("Error toggle wishlist:", err);
    }
  };

  const handleAddToCart = async (p: any, qty = 1) => {
    try {
      const targetProductId = p.id || p.produk_id || p.etalase_id;
      if (!targetProductId) return;

      const res = await addToCart(targetProductId, qty);
      if (res) {
        if (onCartUpdated) onCartUpdated();
        setAddedProductName(p.name);
        setShowCartPopup(true);
      } else {
        alert("Gagal menambahkan ke keranjang! Cek koneksi atau pastikan Anda sudah login.");
      }
    } catch (e: any) {
      console.error("Gagal tambah keranjang:", e);
    }
  };

  // FILTER & SORT
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
    <div style={{ width: "100%", paddingBottom: "2rem", fontFamily: "inherit" }}>
      
      {/* FILTER PILAN WILAYAH */}
      <div style={{ display: "flex", gap: "0.5rem", overflowX: "auto", paddingBottom: "0.5rem", marginBottom: "1rem", scrollbarWidth: "none" }}>
        {locationOptions.map((loc) => (
          <button
            key={loc}
            onClick={() => setActiveLocation(loc)}
            style={{
              whiteSpace: "nowrap",
              padding: "0.4rem 0.85rem",
              borderRadius: "20px",
              fontSize: "0.8rem",
              fontWeight: activeLocation === loc ? 600 : 400,
              border: activeLocation === loc ? "1px solid #10B981" : "1px solid #E2E8F0",
              backgroundColor: activeLocation === loc ? "#ECFDF5" : "#FFFFFF",
              color: activeLocation === loc ? "#059669" : "#64748B",
              cursor: "pointer",
              transition: "all 0.15s ease"
            }}
          >
            <LocationIcon size={12} style={{ marginRight: "4px", verticalAlign: "middle" }} />
            {loc}
          </button>
        ))}
      </div>

      {/* BAR FILTER TOKO & SORTING */}
      <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "0.75rem 1rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        
        {/* TOKO SELECTOR */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", flex: "1 1 200px" }}>
          <StoreIcon size={16} style={{ color: "#64748B" }} />
          <select
            value={selectedStoreId}
            onChange={(e) => setSelectedStoreId(e.target.value)}
            style={{ border: "none", fontSize: "0.85rem", fontWeight: 600, color: "#334155", backgroundColor: "transparent", outline: "none", cursor: "pointer", width: "100%" }}
          >
            <option value="">Semua Toko Mitra</option>
            {stores.map((s) => (
              <option key={s.id} value={s.id}>{s.nama_toko}</option>
            ))}
          </select>
        </div>

        {/* SORTING DROPDOWN */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ fontSize: "0.8rem", color: "#64748B" }}>Urutkan:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ border: "1px solid #E2E8F0", borderRadius: "6px", padding: "0.3rem 0.5rem", fontSize: "0.8rem", color: "#334155", backgroundColor: "#FFF", outline: "none" }}
          >
            <option value="terbaru">Paling Sesuai</option>
            <option value="termurah">Harga Terendah</option>
            <option value="termahal">Harga Tertinggi</option>
          </select>
        </div>

      </div>

      {/* BANNER PROFIL TOKO AKTIF */}
      {selectedStoreObj && (
        <div style={{ backgroundColor: "#FFFFFF", borderLeft: "4px solid #10B981", borderRadius: "8px", padding: "1rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
          <div>
            <div style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 700, textTransform: "uppercase" }}>Sedang Belanja di Toko</div>
            <h2 style={{ margin: "0.1rem 0", fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{selectedStoreObj.nama_toko}</h2>
            <div style={{ fontSize: "0.75rem", color: "#64748B", display: "flex", alignItems: "center", gap: "4px" }}>
              <LocationIcon size={12} />
              {[selectedStoreObj.desa, selectedStoreObj.kabupaten, selectedStoreObj.provinsi].filter(Boolean).join(", ")}
            </div>
          </div>
          <button 
            onClick={() => setSelectedStoreId("")}
            style={{ background: "#F1F5F9", border: "none", padding: "0.4rem 0.75rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600, color: "#475569", cursor: "pointer" }}
          >
            Buka Semua Toko ✕
          </button>
        </div>
      )}

      {/* PRODUCT GRID */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "4rem", color: "#94A3B8", fontSize: "0.9rem" }}>
          Memuat Produk...
        </div>
      ) : filteredProducts.length === 0 ? (
        <div style={{ backgroundColor: "#FFFFFF", borderRadius: "10px", padding: "4rem 1rem", textAlign: "center", color: "#94A3B8" }}>
          <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>🌾</div>
          <div style={{ fontSize: "0.95rem", fontWeight: 600, color: "#475569" }}>Produk tidak ditemukan</div>
          <p style={{ fontSize: "0.8rem", margin: "0.25rem 0 0 0" }}>Coba ubah kata kunci atau pencarian Anda.</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "1rem" }}>
          {filteredProducts.map((p) => {
            const isWishlisted = wishlistedIds.includes(p.id);
            const hargaFinal = p.diskon > 0 ? Math.round(p.price * (1 - p.diskon / 100)) : p.price;

            return (
              <div 
                key={p.etalase_id || p.id} 
                style={{
                  backgroundColor: "#FFFFFF",
                  borderRadius: "10px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  border: "1px solid #E2E8F0",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                  cursor: "pointer"
                }}
                onClick={() => { setSelectedProduct(p); setDetailQty(1); }}
              >

                {/* WISHLIST BUTTON */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleToggleWishlist(p.id);
                  }}
                  style={{ 
                    position: "absolute", 
                    top: "8px", 
                    right: "8px", 
                    zIndex: 10, 
                    backgroundColor: "rgba(255, 255, 255, 0.9)", 
                    border: "none", 
                    borderRadius: "50%", 
                    width: "28px", 
                    height: "28px", 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center", 
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.1)"
                  }}
                >
                  <HeartIcon size={14} filled={isWishlisted} />
                </button>

                {/* PRODUCT IMAGE */}
                <div style={{ width: "100%", aspectRatio: "1/1", backgroundColor: "#F8FAFC", position: "relative", overflow: "hidden" }}>
                  {p.foto ? (
                    <img src={p.foto} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", color: "#CBD5E1" }}>
                      📦
                    </div>
                  )}

                  {p.diskon > 0 && (
                    <div style={{ position: "absolute", bottom: "0", left: "0", backgroundColor: "#EF4444", color: "#FFFFFF", padding: "2px 6px", fontSize: "0.65rem", fontWeight: 700, borderTopRightRadius: "4px" }}>
                      {p.diskon}% OFF
                    </div>
                  )}
                </div>

                {/* DETAILS */}
                <div style={{ padding: "0.75rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B", height: "2.4rem", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", lineHeight: "1.2rem", marginBottom: "0.4rem" }}>
                    {p.name}
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    {p.diskon > 0 && (
                      <div style={{ fontSize: "0.68rem", color: "#94A3B8", textDecoration: "line-through" }}>
                        Rp {p.price.toLocaleString("id-ID")}
                      </div>
                    )}
                    <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#DC2626" }}>
                      Rp {hargaFinal.toLocaleString("id-ID")}
                    </div>
                  </div>

                  <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.3rem", display: "flex", alignItems: "center", gap: "3px" }}>
                    <LocationIcon size={11} />
                    <span>{p.kabupaten || "Lokal"}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "0.4rem", fontSize: "0.7rem", color: "#64748B" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "2px", color: "#F59E0B" }}>
                      <StarIcon size={11} />
                      <span style={{ color: "#475569", fontWeight: 600 }}>5.0</span>
                    </div>
                    <div>
                      {p.stock > 0 ? `${p.stock} ${p.satuan}` : <span style={{ color: "#EF4444" }}>Habis</span>}
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddToCart(p, 1);
                    }}
                    disabled={p.stock <= 0}
                    style={{
                      marginTop: "0.6rem",
                      width: "100%",
                      padding: "0.4rem 0",
                      borderRadius: "6px",
                      border: "1px solid #10B981",
                      backgroundColor: "#FFFFFF",
                      color: "#10B981",
                      fontSize: "0.75rem",
                      fontWeight: 600,
                      cursor: p.stock > 0 ? "pointer" : "not-allowed",
                      opacity: p.stock > 0 ? 1 : 0.4
                    }}
                  >
                    + Keranjang
                  </button>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* QUICK VIEW MODAL */}
      {selectedProduct && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.5)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", width: "450px", maxWidth: "100%", overflow: "hidden", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)", position: "relative" }}>
            
            <button 
              onClick={() => setSelectedProduct(null)}
              style={{ position: "absolute", top: "12px", right: "12px", zIndex: 10, background: "#F1F5F9", border: "none", width: "28px", height: "28px", borderRadius: "50%", cursor: "pointer", fontSize: "0.9rem", color: "#64748B" }}
            >
              ✕
            </button>

            <div style={{ padding: "1.25rem" }}>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <div style={{ width: "90px", height: "90px", borderRadius: "8px", overflow: "hidden", backgroundColor: "#F8FAFC", flexShrink: 0 }}>
                  {selectedProduct.foto ? (
                    <img src={selectedProduct.foto} alt={selectedProduct.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem" }}>📦</div>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 700 }}>🏪 {selectedProduct.storeName}</div>
                  <h3 style={{ margin: "0.2rem 0", fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>{selectedProduct.name}</h3>
                  <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#DC2626", marginTop: "0.2rem" }}>
                    Rp {(selectedProduct.diskon > 0 ? Math.round(selectedProduct.price * (1 - selectedProduct.diskon / 100)) : selectedProduct.price).toLocaleString("id-ID")}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.2rem" }}>Stok: {selectedProduct.stock} {selectedProduct.satuan}</div>
                </div>
              </div>

              {selectedProduct.deskripsi && (
                <div style={{ backgroundColor: "#F8FAFC", padding: "0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#475569", lineHeight: "1.4", maxHeight: "100px", overflowY: "auto", marginBottom: "1rem" }}>
                  {selectedProduct.deskripsi}
                </div>
              )}

              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#334155" }}>Jumlah Beli:</span>
                <div style={{ display: "flex", alignItems: "center", border: "1px solid #E2E8F0", borderRadius: "6px" }}>
                  <button onClick={() => setDetailQty(Math.max(1, detailQty - 1))} style={{ padding: "0.25rem 0.6rem", border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>-</button>
                  <span style={{ padding: "0 0.5rem", fontSize: "0.85rem", fontWeight: 600 }}>{detailQty}</span>
                  <button onClick={() => setDetailQty(detailQty + 1)} style={{ padding: "0.25rem 0.6rem", border: "none", background: "none", cursor: "pointer", fontWeight: 700 }}>+</button>
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                  }}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: "6px", border: "1px solid #10B981", backgroundColor: "#ECFDF5", color: "#059669", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  + Keranjang
                </button>
                <button
                  onClick={() => {
                    handleAddToCart(selectedProduct, detailQty);
                    setSelectedProduct(null);
                    if (onNavigateToCart) onNavigateToCart();
                  }}
                  style={{ flex: 1, padding: "0.65rem", borderRadius: "6px", border: "none", backgroundColor: "#10B981", color: "#FFFFFF", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
                >
                  Beli Langsung
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* POPUP SUKSES KERANJANG */}
      {showCartPopup && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "1rem" }}>
          <div style={{ backgroundColor: "#FFFFFF", borderRadius: "12px", padding: "1.5rem", width: "320px", maxWidth: "100%", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ width: "40px", height: "40px", backgroundColor: "#ECFDF5", color: "#059669", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.75rem auto", fontSize: "1.2rem", fontWeight: 700 }}>
              ✓
            </div>
            <h4 style={{ margin: "0 0 0.25rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>Berhasil Ditambahkan!</h4>
            <p style={{ fontSize: "0.75rem", color: "#64748B", margin: "0 0 1rem 0" }}>
              <strong>{addedProductName}</strong> dimasukkan ke keranjang.
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              <button 
                onClick={() => {
                  setShowCartPopup(false);
                  if (onNavigateToCart) onNavigateToCart();
                }} 
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "none", backgroundColor: "#10B981", color: "#FFFFFF", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
              >
                Lihat Keranjang
              </button>
              <button 
                onClick={() => setShowCartPopup(false)} 
                style={{ width: "100%", padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", backgroundColor: "#FFFFFF", color: "#475569", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer" }}
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