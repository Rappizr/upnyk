"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { getProductsAction, getWishlistAction, addToWishlistAction, removeFromWishlistAction, addToCartAction } from "@/app/actions";
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

function InfoIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
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

const categories = ["Semua", "Pangan", "Minuman", "Rempah", "Organik", "Olahan", "Peternakan"];

// List of locations (Kabupaten) to filter
const locations = ["Semua Wilayah", "Cianjur", "Brebes", "Aceh Tengah", "Minahasa", "Kapuas Hulu"];

// Full detailed Profile Info for each co-op store
const coopProfiles: Record<string, any> = {
  "Koperasi Tani Maju": {
    name: "Koperasi Tani Maju",
    desc: "Kelompok tani desa Sukamaju yang berdedikasi memproduksi beras organik berkualitas tinggi sejak 2015.",
    desa: "Desa Sukamaju",
    kabupaten: "Cianjur",
    provinsi: "Jawa Barat",
    rating: 4.9,
    reviews: 480,
    established: "2015",
    productsCount: 2,
    badge: "Koperasi Pelosok Pilihan",
    bannerText: "Dapatkan Beras Organik Cianjur Segar Langsung dari Sawah Desa Sukamaju!"
  },
  "Koperasi Brebes Jaya": {
    name: "Koperasi Brebes Jaya",
    desc: "Produsen bawang merah Brebes segar bermutu tinggi langsung dari lahan petani lokal desa Wanasari.",
    desa: "Desa Wanasari",
    kabupaten: "Brebes",
    provinsi: "Jawa Tengah",
    rating: 4.8,
    established: "2018",
    reviews: 320,
    productsCount: 2,
    badge: "UMKM Unggulan Desa",
    bannerText: "Bawang Merah Brebes Khas Petani Wanasari, Pedas dan Gurih Alami!"
  },
  "Koperasi Gayo Indah": {
    name: "Koperasi Gayo Indah",
    desc: "Kopi Arabika Gayo organik bercita rasa tinggi, diproses basah secara tradisional oleh petani desa Kenawat.",
    desa: "Desa Kenawat",
    kabupaten: "Aceh Tengah",
    provinsi: "Aceh",
    rating: 4.9,
    established: "2012",
    reviews: 218,
    productsCount: 1,
    badge: "Koperasi Kopi Ekspor",
    bannerText: "Cita Rasa Kopi Arabika Gayo Premium Langsung dari Pegunungan Aceh Tengah!"
  },
  "Koperasi Sulawesi Makmur": {
    name: "Koperasi Sulawesi Makmur",
    desc: "Koperasi penghasil kelapa terpadu desa Ranomeeto, Sulawesi Utara. Memproduksi minyak kelapa VCO dan santan instan higienis.",
    desa: "Desa Ranomeeto",
    kabupaten: "Minahasa",
    provinsi: "Sulawesi Utara",
    rating: 4.7,
    established: "2019",
    reviews: 500,
    productsCount: 3,
    badge: "Koperasi Kelapa Pelosok",
    bannerText: "Kelapa Segar Minahasa Diolah Menjadi VCO dan Santan Berkualitas!"
  },
  "Koperasi Madu Borneo": {
    name: "Koperasi Madu Borneo",
    desc: "Koperasi konservasi madu hutan liar desa Putussibau, Kalimantan Barat. Mengambil madu murni langsung dari pohon sialang hutan.",
    desa: "Desa Putussibau",
    kabupaten: "Kapuas Hulu",
    provinsi: "Kalimantan Barat",
    rating: 5.0,
    established: "2016",
    reviews: 521,
    productsCount: 1,
    badge: "Madu Hutan Bersertifikat",
    bannerText: "Madu Murni Hutan Kalimantan Langsung dari Konservasi Suku Dayak Putussibau!"
  }
};

// Mapping of products to co-op stores based on their ID or category
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

const productDetailMap: Record<number, { weight: string; desc: string }> = {
  1: {
    weight: "1,0 kg",
    desc: "Beras merah organik pilihan kualitas prima dari sawah pegunungan Cianjur. Diproduksi secara alami tanpa pestisida kimia oleh Koperasi Tani Maju. Sangat tinggi serat, cocok untuk konsumsi harian sehat dan diet indeks glikemik rendah."
  },
  2: {
    weight: "0,5 kg",
    desc: "Kopi Arabika Gayo asli Aceh Tengah dengan pemrosesan semi-washed tradisional. Memiliki aroma floral yang kuat, body tebal, dan keasaman seimbang yang khas. Dipanen dari perkebunan rakyat organik binaan Koperasi Gayo Indah."
  },
  3: {
    weight: "1,0 kg",
    desc: "Bawang merah segar asli Brebes kualitas super, dipanen langsung dari lahan subur desa Wanasari. Memiliki kandungan air rendah sehingga lebih renyah, aromatik kuat, dan tahan lama disimpan. Sangat cocok untuk bumbu dapur premium."
  },
  4: {
    weight: "0,5 kg",
    desc: "Minyak Kelapa Murni (Virgin Coconut Oil) cold-pressed hasil olahan kelapa segar pilihan Minahasa. Kaya akan asam laurat yang baik untuk metabolisme, perawatan kulit, dan kesehatan rambut. Diproduksi tanpa pemanasan suhu tinggi."
  },
  5: {
    weight: "0,25 kg",
    desc: "Cabai merah keriting pilihan dari daerah Garut, Jawa Barat. Memiliki tingkat kepedasan yang pas, warna merah menyala yang segar, serta tekstur cabai yang padat dan padat rasa. Sangat cocok untuk sambal tradisional Indonesia."
  },
  6: {
    weight: "0,25 kg",
    desc: "Cokelat bubuk murni kualitas ekspor terbuat dari biji kakao fermentasi pilihan petani lokal Luwu, Sulawesi Selatan. Memiliki rasa cokelat pahit-manis yang kaya, cocok untuk minuman cokelat hangat premium maupun bahan kue."
  },
  7: {
    weight: "0,5 kg",
    desc: "Santan kelapa murni segar yang diperas dari kelapa tua pilihan daerah pesisir Manado. Diproses secara higienis tanpa bahan pengawet untuk menjaga keaslian rasa gurih alami masakan tradisional Indonesia Anda."
  },
  8: {
    weight: "0,5 kg",
    desc: "Madu hutan murni 100% organik yang dipanen langsung dari sarang lebah Apis Dorsata liar di pohon Sialang pedalaman hutan Kalimantan Barat. Kaya akan enzim alami, antioksidan, dan nutrisi penting untuk stamina keluarga."
  }
};

interface MarketplaceViewProps {
  onCartUpdated?: () => void;
  onNavigateToCart?: () => void;
  initialStoreFilter?: string;
  clearInitialStoreFilter?: () => void;
}

// Helper: map icon_type -> category label untuk filter UI
function iconTypeToCategory(iconType: string): string {
  switch (iconType) {
    case 'rice': return 'Beras';
    case 'coffee': return 'Kopi';
    case 'spice': return 'Rempah';
    case 'oil': return 'Minyak';
    case 'honey': return 'Madu';
    case 'grain': return 'Biji-bijian';
    case 'leaf': return 'Sayuran';
    default: return 'Lainnya';
  }
}

export default function MarketplaceView({ 
  onCartUpdated, 
  onNavigateToCart,
  initialStoreFilter,
  clearInitialStoreFilter
}: MarketplaceViewProps) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeLocation, setActiveLocation] = useState("Semua Wilayah");
  const [selectedStore, setSelectedStore] = useState("");
  const [sortBy, setSortBy] = useState("terlaris");
  const [loading, setLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<string[]>([]);
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [detailQty, setDetailQty] = useState(1);
  const [showAddedToCartPopup, setShowAddedToCartPopup] = useState(false);
  const [addedProductName, setAddedProductName] = useState("");

  useEffect(() => {
    if (initialStoreFilter) {
      setSelectedStore(initialStoreFilter);
      clearInitialStoreFilter?.();
    }
  }, [initialStoreFilter, clearInitialStoreFilter]);

  useEffect(() => {
    if (searchParams) {
      const storeParam = searchParams.get("store");
      if (storeParam) {
        setSelectedStore(storeParam);
      }
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodData, wlData] = await Promise.all([
          getProductsAction(),
          getWishlistAction()
        ]);

        setProducts(prodData || []);
        setWishlistItems(wlData || []);
        setWishlistedIds((wlData || []).map((w: any) => w.product_id));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddToWishlist = async (productId: string) => {
    try {
      const savedIds = wishlistedIds;
      if (savedIds.includes(productId)) {
        // Hapus dari wishlist database
        const success = await removeFromWishlistAction(productId);
        if (success) {
          setWishlistedIds(prev => prev.filter(id => id !== productId));
          setWishlistItems(prev => prev.filter((w: any) => w.product_id !== productId));
        } else {
          alert("Gagal menghapus dari wishlist.");
        }
      } else {
        // Tambah ke wishlist database
        const res = await addToWishlistAction(productId);
        if (res) {
          setWishlistedIds(prev => [...prev, productId]);
          setWishlistItems(prev => [...prev, { id: res.id, product_id: productId }]);
          alert("Berhasil ditambahkan ke wishlist!");
        } else {
          alert("Gagal menambahkan ke wishlist.");
        }
      }
    } catch (err) {
      console.error(err);
    }
  };



  const handleAddOrder = async (p: any, qty = 1) => {
    try {
      await addToCartAction(p.id, qty);
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering Logic — produk dari Supabase menggunakan UUID, tidak ada field 'category'/'store' langsung
  let filtered = products.map(p => ({
    ...p,
    // Derive category label from icon_type for filtering
    category: p.category || iconTypeToCategory(p.icon_type),
    // Store mapping: for Supabase products, use supplier field or fallback
    store: p.supplier || "Koperasi Pelosok Pilihan"
  }));

  // Filter by search query
  if (searchQuery.trim() !== "") {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p => 
      (p.name || "").toLowerCase().includes(q) || 
      (p.category || "").toLowerCase().includes(q) ||
      (p.store || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }

  // Filter by category
  if (activeCategory !== "Semua") {
    filtered = filtered.filter(p => (p.category || "") === activeCategory);
  }

  // Filter by location
  if (activeLocation !== "Semua Wilayah") {
    filtered = filtered.filter(p => (p.origin || "").toLowerCase().includes(activeLocation.toLowerCase()));
  }

  // Filter by selected co-op store profile
  if (selectedStore) {
    filtered = filtered.filter(p => p.store === selectedStore);
  }

  // Sorting
  if (sortBy === "termurah") {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === "termahal") {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === "rating") {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  }

  const activeCoop = coopProfiles[selectedStore];

  return (
    <>
      {selectedStore && activeCoop ? (
        /* Toko Profile Header Card */
        <div className="card" style={{ marginBottom: "1.5rem", borderLeft: "4px solid var(--color-primary)", padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                <span className="badge badge-info">{activeCoop.badge}</span>
                <span className="text-xs text-muted">Est. {activeCoop.established}</span>
              </div>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
                {activeCoop.name}
              </h2>
              <p className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "0.25rem", marginBottom: "0.5rem" }}>
                <LocationIcon size={14} /> {activeCoop.desa}, {activeCoop.kabupaten}, {activeCoop.provinsi}
              </p>
              <p className="text-sm" style={{ maxWidth: "600px", lineHeight: 1.5, margin: "0 0 1rem 0" }}>
                {activeCoop.desc}
              </p>
              <div style={{ display: "flex", gap: "1.5rem", alignItems: "center", flexWrap: "wrap" }}>
                <span className="text-xs text-muted" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  <StarIcon size={12} fill="currentColor" className="text-amber-400" /> <strong>{activeCoop.rating}</strong> ({activeCoop.reviews} ulasan)
                </span>
                <span className="text-xs text-muted">Katalog: <strong>{filtered.length} Komoditas</strong></span>
                <span className="text-xs text-muted">Verifikasi Rantai Pasok: <strong className="text-emerald-600">✓ Aktif</strong></span>
              </div>
            </div>
            <button
              className="btn-ghost"
              onClick={() => setSelectedStore("")}
              style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }}
            >
              ← Tutup Profil Toko
            </button>
          </div>
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <InfoIcon size={16} style={{ flexShrink: 0 }} />
            <span>{activeCoop.bannerText}</span>
          </div>
        </div>
      ) : (
        <>
          <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
            <CartIcon size={28} className="text-primary" /> Marketplace
          </h1>
          <p className="page-subtitle">Temukan produk terbaik dari ribuan UMKM & supplier lokal Indonesia</p>
        </>
      )}

      {/* Search Bar */}
      <div style={{ marginBottom: "1rem", position: "relative", width: "100%" }}>
        <input
          type="text"
          className="form-input"
          placeholder="Cari produk berdasarkan nama, kategori, atau koperasi..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          id="marketplace-search-input"
          style={{
            width: "100%",
            padding: "0.625rem 2.5rem 0.625rem 2.75rem",
            fontSize: "0.9rem",
            borderRadius: "var(--radius-md)",
            border: "1.5px solid var(--color-border)",
            height: "44px",
            boxSizing: "border-box"
          }}
        />
        <svg 
          style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)", color: "var(--color-text-muted)" }} 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            style={{
              position: "absolute",
              right: "1rem",
              top: "50%",
              transform: "translateY(-50%)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--color-text-muted)",
              fontSize: "1.2rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: 0
            }}
          >
            ×
          </button>
        )}
      </div>

      {/* Filter and Search Bar Controls */}
      <div className="marketplace-controls">
        {/* Categories Chips */}
        <div className="category-scroll-strip" style={{ display: "flex", gap: "0.5rem" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-chip${activeCategory === cat ? " active" : ""}`}
              onClick={() => setActiveCategory(cat)}
              id={`filter-${cat.toLowerCase()}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Location Dropdown and Sorting */}
        <div className="filter-row">
          <div className="filter-select-group">
            <label className="text-xs text-muted" style={{ fontWeight: 600 }}>Wilayah:</label>
            <select
              className="form-input"
              style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
              value={activeLocation}
              onChange={(e) => setActiveLocation(e.target.value)}
              id="location-select"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
          </div>

          <div className="filter-select-group">
            <label className="text-xs text-muted" style={{ fontWeight: 600 }}>Urutkan:</label>
            <select
              className="form-input"
              style={{ width: "auto", padding: "0.4rem 0.75rem", fontSize: "0.85rem" }}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              id="sort-select"
            >
              <option value="terlaris">Terlaris</option>
              <option value="termurah">Harga Terendah</option>
              <option value="termahal">Harga Tertinggi</option>
              <option value="rating">Rating Tertinggi</option>
            </select>
          </div>
        </div>
      </div>

      {/* Result count / breadcrumb */}
      <div className="text-sm text-muted mb-4" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          Menampilkan <strong>{filtered.length}</strong> produk
          {activeCategory !== "Semua" && <> dalam <strong>{activeCategory}</strong></>}
          {activeLocation !== "Semua Wilayah" && <> dari <strong>{activeLocation}</strong></>}
          {selectedStore && <> di <strong>{selectedStore}</strong></>}
        </div>
        {selectedStore && (
          <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
            Melihat Katalog {selectedStore}
          </span>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat produk marketplace...</div>
      ) : (
        /* Product Grid */
        <div className="product-grid">
          {filtered.map((p) => (
            <div 
              key={p.id} 
              className="product-card card-hover" 
              id={`mp-product-${p.id}`}
              style={{ position: "relative" }}
            >
              {/* Floating Wishlist Button */}
              <button 
                className="icon-btn" 
                id={`btn-mp-wishlist-${p.id}`} 
                title="Simpan ke Wishlist" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleAddToWishlist(p.id);
                }}
                style={{ 
                  position: "absolute",
                  top: "0.5rem",
                  right: "0.5rem",
                  display: "inline-flex", 
                  alignItems: "center", 
                  justifyContent: "center",
                  width: "30px",
                  height: "30px",
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.9)",
                  border: wishlistedIds.includes(p.id) ? "1px solid var(--color-alert)" : "1px solid var(--color-border)",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  cursor: "pointer",
                  color: wishlistedIds.includes(p.id) ? "var(--color-alert)" : "var(--color-text-subtle)",
                  zIndex: 5,
                  transition: "transform 0.15s, background 0.15s"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "scale(1.1)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <HeartIcon size={14} fill={wishlistedIds.includes(p.id) ? "currentColor" : "none"} />
              </button>

              <div 
                className="product-img" 
                onClick={() => {
                  setSelectedProduct(p);
                  setDetailQty(1);
                }}
                style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}
              >
                <IconRenderer type={p.icon_type} size={32} className="text-amber-600" />
              </div>
              <div className="product-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                  <div className="badge badge-gray text-xs">{p.category}</div>
                  <span 
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStore(p.store);
                    }}
                    className="text-xs text-primary font-bold" 
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {p.store}
                  </span>
                </div>
                <div 
                  className="product-name" 
                  onClick={() => {
                    setSelectedProduct(p);
                    setDetailQty(1);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {p.name}
                </div>
                <div className="product-origin" style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.8rem", marginBottom: "0.375rem" }}>
                  <LocationIcon size={14} /> {p.origin}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
                  <span className={`badge ${p.stock === "Tersedia" ? "badge-success" : "badge-warning"}`}>
                    {p.stock === "Tersedia" ? "✓" : "!"} {p.stock}
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.375rem", marginBottom: "0.5rem" }}>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }} className="text-xs text-muted">
                    <StarIcon size={12} fill="currentColor" className="text-amber-400" /> {p.rating}
                    <span className="text-xs text-muted">({p.reviews} ulasan)</span>
                  </span>
                </div>
                <div className="product-price">Rp {p.price.toLocaleString("id-ID")}</div>
                
                <div className="product-actions" style={{ display: "flex", gap: "0.5rem", width: "100%", marginTop: "0.75rem" }}>
                  <button 
                    className="btn-secondary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddOrder(p, 1);
                      setAddedProductName(p.name);
                      setShowAddedToCartPopup(true);
                    }} 
                    style={{ 
                      flex: 1, 
                      padding: "0.5rem 0.25rem", 
                      fontSize: "0.75rem", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "0.25rem",
                      borderRadius: "6px",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-primary)",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: "pointer"
                    }} 
                    id={`btn-mp-add-cart-${p.id}`}
                  >
                    <CartIcon size={12} /> Keranjang
                  </button>
                  <button 
                    className="btn-primary" 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddOrder(p, 1);
                      if (onNavigateToCart) onNavigateToCart();
                    }} 
                    style={{ 
                      flex: 1, 
                      padding: "0.5rem 0.25rem", 
                      fontSize: "0.75rem", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      gap: "0.25rem",
                      borderRadius: "6px",
                      fontWeight: 600,
                      whiteSpace: "nowrap",
                      cursor: "pointer"
                    }} 
                    id={`btn-mp-buy-now-${p.id}`}
                  >
                    <CashIcon size={12} /> Beli
                  </button>
                </div>
              </div>
            </div>
          ))
}
        </div >
      )}

      {selectedProduct && (
        <div className="modal-overlay">
          <div className="modal-container" style={{ maxWidth: "640px" }}>
            {/* Modal Header */}
            <div className="modal-header">
              <span className="modal-header-title">Detail Produk</span>
              <button onClick={() => setSelectedProduct(null)} className="modal-close-btn">
                &times;
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body">
              <div className="modal-product-layout">
                {/* Product Image Icon container */}
                <div className="modal-product-img">
                  <IconRenderer type={selectedProduct.icon_type} size={80} className="text-amber-600" />
                </div>

                {/* Main Product Info */}
                <div className="modal-product-info">
                  <div>
                    <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", marginBottom: "0.5rem" }}>
                      <span className="badge badge-gray text-xs">{selectedProduct.category}</span>
                      <span 
                        className="text-xs text-primary font-bold" 
                        style={{ cursor: "pointer", textDecoration: "underline" }}
                        onClick={() => {
                          setSelectedStore(selectedProduct.store);
                          setSelectedProduct(null);
                        }}
                      >
                        {selectedProduct.store}
                      </span>
                    </div>
                    <h2 style={{ fontSize: "1.6rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--color-primary)", lineHeight: 1.2 }}>
                      {selectedProduct.name}
                    </h2>
                    <p style={{ display: "flex", alignItems: "center", gap: "0.25rem", color: "var(--color-text-muted)", fontSize: "0.85rem", margin: "0 0 0.75rem 0" }}>
                      <LocationIcon size={14} /> {selectedProduct.origin}
                    </p>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.25rem" }} className="text-xs text-muted">
                        <StarIcon size={12} fill="currentColor" className="text-amber-400" /> <strong>{selectedProduct.rating}</strong> ({selectedProduct.reviews} ulasan)
                      </span>
                      <span className={`badge ${selectedProduct.stock === "Tersedia" ? "badge-success" : "badge-warning"}`} style={{ fontSize: "0.7rem" }}>
                        {selectedProduct.stock}
                      </span>
                      <span className="badge badge-info" style={{ fontSize: "0.7rem" }}>
                        Berat: {productDetailMap[selectedProduct.id]?.weight || "1,0 kg"}
                      </span>
                    </div>
                  </div>

                  <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary)", marginTop: "0.5rem" }}>
                    Rp {selectedProduct.price.toLocaleString("id-ID")}
                  </div>
                </div>
              </div>

              {/* Description */}
              <div style={{ borderTop: "1px solid var(--color-border-light)", paddingTop: "1rem" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 700, color: "var(--color-text)" }}>Deskripsi Produk</h4>
                <p style={{ fontSize: "0.875rem", lineHeight: 1.6, color: "var(--color-text-subtle)", margin: 0 }}>
                  {productDetailMap[selectedProduct.id]?.desc || "Komoditas pilihan bermutu tinggi langsung dari koperasi tani Indonesia."}
                </p>
              </div>

              {/* Action area */}
              <div className="modal-action-bar">
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <span style={{ fontSize: "0.85rem", color: "var(--color-text-subtle)" }}>Jumlah:</span>
                  <div className="qty-selector">
                    <button 
                      onClick={() => setDetailQty(Math.max(1, detailQty - 1))}
                      className="qty-btn"
                    >
                      -
                    </button>
                    <span className="qty-value">
                      {detailQty}
                    </span>
                    <button 
                      onClick={() => setDetailQty(detailQty + 1)}
                      className="qty-btn"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button 
                    className="modal-wishlist-btn"
                    onClick={() => {
                      handleAddToWishlist(selectedProduct.id);
                    }}
                    style={{
                      color: wishlistedIds.includes(selectedProduct.id) ? "var(--color-alert)" : "inherit"
                    }}
                  >
                    <HeartIcon size={18} fill={wishlistedIds.includes(selectedProduct.id) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    className="btn-secondary"
                    onClick={() => {
                      handleAddOrder(selectedProduct, detailQty);
                      setAddedProductName(selectedProduct.name);
                      setShowAddedToCartPopup(true);
                      setSelectedProduct(null);
                    }}
                    style={{ 
                      padding: "0.5rem 1rem", 
                      fontSize: "0.85rem", 
                      display: "inline-flex", 
                      alignItems: "center", 
                      gap: "0.5rem", 
                      borderRadius: "8px",
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                      border: "1px solid var(--color-primary)"
                    }}
                  >
                    <CartIcon size={16} /> Keranjang
                  </button>
                  <button 
                    className="btn-primary"
                    onClick={() => {
                      handleAddOrder(selectedProduct, detailQty);
                      setSelectedProduct(null);
                      if (onNavigateToCart) onNavigateToCart();
                    }}
                    style={{ padding: "0.5rem 1rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.5rem", borderRadius: "8px" }}
                  >
                    <CashIcon size={16} /> Beli Sekarang
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showAddedToCartPopup && (
        <div className="modal-overlay" style={{ zIndex: 10000 }}>
          <div className="card modal-container" style={{ maxWidth: "400px", padding: "2rem", textAlign: "center", position: "relative" }}>
            <button 
              onClick={() => setShowAddedToCartPopup(false)}
              className="modal-close-btn"
              style={{ position: "absolute", top: "1rem", right: "1rem" }}
            >
              &times;
            </button>
            
            <div style={{ width: "60px", height: "60px", background: "var(--color-primary-light)", color: "var(--color-primary)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.25rem auto" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/>
                <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>
                <polyline points="10 10 12 12 16 8"/>
              </svg>
            </div>

            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, margin: "0 0 0.5rem 0", color: "var(--color-primary)" }}>
              Berhasil Ditambahkan!
            </h3>
            
            <p style={{ fontSize: "0.9rem", color: "var(--color-text-subtle)", margin: "0 0 1.5rem 0", lineHeight: 1.5 }}>
              <strong>{addedProductName}</strong> telah berhasil dimasukkan ke dalam keranjang belanja Anda.
            </p>

            <div style={{ display: "flex", gap: "0.75rem", flexDirection: "column" }}>
              <button 
                className="btn-primary" 
                onClick={() => {
                  setShowAddedToCartPopup(false);
                  if (onNavigateToCart) onNavigateToCart();
                }}
                style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.85rem", justifyContent: "center" }}
              >
                Lihat Keranjang Belanja
              </button>
              <button 
                className="btn-secondary" 
                onClick={() => setShowAddedToCartPopup(false)}
                style={{ width: "100%", padding: "0.6rem 1rem", fontSize: "0.85rem", justifyContent: "center" }}
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
