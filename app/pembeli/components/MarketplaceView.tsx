"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  StarIcon, HeartIcon, CartIcon, LocationIcon
} from "@/components/ProductIcons";

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
    bannerText: "🌾 Dapatkan Beras Organik Cianjur Segar Langsung dari Sawah Desa Sukamaju!"
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
    bannerText: "🧅 Bawang Merah Brebes Khas Petani Wanasari, Pedas dan Gurih Alami!"
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
    bannerText: "☕ Cita Rasa Kopi Arabika Gayo Premium Langsung dari Pegunungan Aceh Tengah!"
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
    bannerText: "🥥 Kelapa Segar Minahasa Diolah Menjadi VCO dan Santan Berkualitas!"
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
    bannerText: "🍯 Madu Murni Hutan Kalimantan Langsung dari Konservasi Suku Dayak Putussibau!"
  }
};

// Mapping of products to co-op stores based on their ID or category
const productStoreMap: Record<number, string> = {
  1: "Koperasi Tani Maju", // Beras Merah Organik
  2: "Koperasi Gayo Indah", // Kopi Arabika Gayo
  3: "Koperasi Brebes Jaya", // Bawang Merah Brebes
  4: "Koperasi Sulawesi Makmur", // Minyak Kelapa VCO
  5: "Koperasi Brebes Jaya", // Cabai Merah Keriting
  6: "Koperasi Sulawesi Makmur", // Cokelat Bubuk Sulawesi
  7: "Koperasi Sulawesi Makmur", // Santan Segar Kelapa
  8: "Koperasi Madu Borneo" // Madu Hutan Kalimantan
};

export default function MarketplaceView({ onCartUpdated }: { onCartUpdated?: () => void }) {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [activeLocation, setActiveLocation] = useState("Semua Wilayah");
  const [selectedStore, setSelectedStore] = useState("");
  const [sortBy, setSortBy] = useState("terlaris");
  const [loading, setLoading] = useState(true);
  const [wishlistedIds, setWishlistedIds] = useState<number[]>([]);

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
        const [prodRes, wlRes] = await Promise.all([
          fetch("/api/products"),
          fetch("/api/wishlist")
        ]);
        const prodData = await prodRes.json();
        const wlData = await wlRes.json();

        setProducts(prodData);
        setWishlistedIds(wlData.map((w: any) => w.product_id));
      } catch (err) {
        console.error("Failed to load products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleAddToWishlist = async (productId: number) => {
    if (wishlistedIds.includes(productId)) {
      alert("Produk sudah ada di wishlist!");
      return;
    }
    try {
      const res = await fetch("/api/wishlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product_id: productId })
      });
      if (res.ok) {
        setWishlistedIds([...wishlistedIds, productId]);
        alert("Berhasil ditambahkan ke wishlist!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddOrder = (p: any) => {
    const storeName = productStoreMap[p.id] || "Koperasi Pelosok Pilihan";
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

      const existingIdx = currentItems.findIndex((item: any) => item.product.id === p.id);
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
      if (onCartUpdated) onCartUpdated();
    } catch (err) {
      console.error(err);
    }
  };

  // Filtering Logic
  let filtered = products.map(p => ({
    ...p,
    store: productStoreMap[p.id] || "Koperasi Pelosok Pilihan"
  }));

  // Filter by category
  if (activeCategory !== "Semua") {
    filtered = filtered.filter(p => p.category === activeCategory);
  }

  // Filter by location
  if (activeLocation !== "Semua Wilayah") {
    filtered = filtered.filter(p => p.origin.toLowerCase().includes(activeLocation.toLowerCase()));
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
    filtered.sort((a, b) => b.rating - a.rating);
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
          <div style={{ marginTop: "1rem", padding: "0.75rem", background: "var(--color-primary-light)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", color: "var(--color-primary)", fontWeight: 500 }}>
            {activeCoop.bannerText}
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

      {/* Filter and Search Bar */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        
        {/* Categories Chips */}
        <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
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
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
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

          <div style={{ display: "flex", alignItems: "center", gap: "0.35rem" }}>
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
            <div key={p.id} className="product-card card-hover" id={`mp-product-${p.id}`}>
              <div className="product-img" style={{ background: "var(--color-border-light)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <IconRenderer type={p.icon_type} size={32} className="text-amber-600" />
              </div>
              <div className="product-body">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.375rem" }}>
                  <div className="badge badge-gray text-xs">{p.category}</div>
                  <span 
                    onClick={() => setSelectedStore(p.store)}
                    className="text-xs text-primary font-bold" 
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                  >
                    {p.store}
                  </span>
                </div>
                <div className="product-name">{p.name}</div>
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
                <div className="product-footer">
                  <button className="btn-primary" onClick={() => handleAddOrder(p)} style={{ padding: "0.4rem 0.875rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-mp-add-cart-${p.id}`}>
                    <CartIcon size={14} /> + Beli
                  </button>
                  <button 
                    className="icon-btn" 
                    id={`btn-mp-wishlist-${p.id}`} 
                    title="Simpan ke Wishlist" 
                    onClick={() => handleAddToWishlist(p.id)}
                    style={{ 
                      display: "inline-flex", 
                      alignItems: "center", 
                      justifyContent: "center",
                      color: wishlistedIds.includes(p.id) ? "var(--color-alert)" : "inherit"
                    }}
                  >
                    <HeartIcon size={16} fill={wishlistedIds.includes(p.id) ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
