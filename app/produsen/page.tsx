"use client";
import { useState } from "react";
import Link from "next/link";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  RiceIcon, LeafIcon, FactoryIcon, TruckIcon, DollarIcon
} from "@/components/ProductIcons";

export default function ProdusenDashboard() {
  const [items, setItems] = useState([
    { id: 1, icon_type: "rice", name: "Beras Merah Organik", stock: 1200, price: 24000, status: "Siap Kirim" },
    { id: 2, icon_type: "leaf", name: "Jagung Manis Pipil", stock: 850, price: 8000, status: "Dalam Proses" },
    { id: 3, icon_type: "spice", name: "Kentang Granola", stock: 600, price: 12000, status: "Menunggu Sortasi" },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newStock, setNewStock] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newIcon, setNewIcon] = useState("leaf");

  const handleAddCommodity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName || !newStock || !newPrice) return;
    const newItem = {
      id: items.length + 1,
      icon_type: newIcon,
      name: newName,
      stock: parseInt(newStock) || 0,
      price: parseInt(newPrice) || 0,
      status: "Siap Kirim"
    };
    setItems([...items, newItem]);
    setNewName("");
    setNewStock("");
    setNewPrice("");
    setShowAddForm(false);
  };

  const handleUpdateStock = (id: number) => {
    const amount = prompt("Masukkan jumlah stok baru (kg):");
    if (amount === null) return;
    const parsed = parseInt(amount);
    if (isNaN(parsed)) return;
    setItems(items.map(item => item.id === id ? { ...item, stock: parsed } : item));
  };

  const totalHarvest = items.reduce((sum, item) => sum + item.stock, 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar Produsen */}
      <aside style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#10B981" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>Pasar<span>Nusa</span></span>
        </div>

        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Panel Produsen</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <a href="#" className="nav-item active" style={{ color: "#10B981", background: "#D1FAE5", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <LeafIcon size={16} /> Stok Komoditas
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <DollarIcon size={16} /> Penjualan B2B
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <TruckIcon size={16} /> Pengiriman
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <FactoryIcon size={16} /> Profil UMKM
          </a>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <Link href="/login" className="btn-ghost" style={{ width: "100%", justifyContent: "center", color: "#EF4444", borderColor: "#FEE2E2", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LeafIcon size={28} className="text-secondary" fill="currentColor" /> Portal Produsen (Pak Budi)
            </h1>
            <p className="page-subtitle">Kelola komoditas hasil tani dan distribusi ke agen/marketplace.</p>
          </div>
          <button className="btn-secondary" onClick={() => setShowAddForm(!showAddForm)} style={{ background: "#10B981", color: "white" }}>
            {showAddForm ? "Batal" : "+ Tambah Hasil Bumi"}
          </button>
        </div>

        {/* Add Form */}
        {showAddForm && (
          <form onSubmit={handleAddCommodity} className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
            <h3 className="font-semibold text-base mb-3">Tambah Hasil Panen</h3>
            <div className="grid-3" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nama Komoditas</label>
                <input className="form-input" value={newName} onChange={e => setNewName(e.target.value)} placeholder="Misal: Singkong Gajah" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Stok (kg)</label>
                <input className="form-input" type="number" value={newStock} onChange={e => setNewStock(e.target.value)} placeholder="1000" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Harga per kg (Rp)</label>
                <input className="form-input" type="number" value={newPrice} onChange={e => setNewPrice(e.target.value)} placeholder="15000" required />
              </div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Ikon</label>
                <select className="form-input" value={newIcon} onChange={e => setNewIcon(e.target.value)}>
                  <option value="leaf">Daun</option>
                  <option value="rice">Padi/Beras</option>
                  <option value="spice">Rempah</option>
                  <option value="grain">Biji-bijian</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ background: "#10B981", color: "white", marginTop: "1.2rem" }}>
                Simpan Komoditas
              </button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
            <div className="stat-icon green">
              <LeafIcon size={20} />
            </div>
            <div>
              <div className="stat-value">{totalHarvest.toLocaleString("id-ID")} kg</div>
              <div className="stat-label">Total Hasil Panen Aktif</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #2563EB" }}>
            <div className="stat-icon blue">
              <TruckIcon size={20} />
            </div>
            <div>
              <div className="stat-value">3 Pengiriman</div>
              <div className="stat-label">Sedang dalam Perjalanan</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #F59E0B" }}>
            <div className="stat-icon yellow">
              <DollarIcon size={20} />
            </div>
            <div>
              <div className="stat-value">Rp {(totalHarvest * 12000).toLocaleString("id-ID")}</div>
              <div className="stat-label">Estimasi Nilai Stok</div>
            </div>
          </div>
        </div>

        {/* Commodity Stock */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold text-lg mb-4">📦 Daftar Komoditas di Gudang</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#FFFFFF" }}>
                <span style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9", borderRadius: "8px", marginRight: "1rem" }}>
                  <IconRenderer type={i.icon_type} size={24} />
                </span>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-muted">Stok: <strong>{i.stock.toLocaleString("id-ID")} kg</strong> · Harga: Rp {i.price.toLocaleString("id-ID")}/kg</div>
                </div>
                <div style={{ marginRight: "2rem" }}>
                  <span className="badge badge-success" style={{ background: "#D1FAE5", color: "#10B981" }}>{i.status}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn-ghost" onClick={() => handleUpdateStock(i.id)} style={{ padding: "0.4rem 0.8/rem", fontSize: "0.8rem" }}>Ubah Stok</button>
                  <button className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>Lacak</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

