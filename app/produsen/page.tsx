import Link from "next/link";
import type { Metadata } from "next";
import { 
  RiceIcon, SpiceIcon, LeafIcon, FactoryIcon, TruckIcon, DollarIcon
} from "@/components/ProductIcons";

export const metadata: Metadata = {
  title: "Produsen Dashboard — Lural Commerce & Supply Chain",
};

const items = [
  { id: 1, icon: <RiceIcon size={24} className="text-amber-600" />, name: "Beras Merah Organik", stock: "1.200 kg", price: "Rp 24.000/kg", status: "Siap Kirim" },
  { id: 2, icon: <LeafIcon size={24} className="text-emerald-500" />, name: "Jagung Manis Pipil", stock: "850 kg", price: "Rp 8.000/kg", status: "Dalam Proses" },
  { id: 3, icon: <SpiceIcon size={24} className="text-red-500" />, name: "Kentang Granola", stock: "600 kg", price: "Rp 12.000/kg", status: "Menunggu Sortasi" },
];

export default function ProdusenDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar Produsen */}
      <aside style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#10B981" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>Lural<span>Produsen</span></span>
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
              <LeafIcon size={28} className="text-secondary" /> Portal Produsen (Pak Budi)
            </h1>
            <p className="page-subtitle">Kelola komoditas hasil tani dan distribusi ke agen/marketplace.</p>
          </div>
          <button className="btn-secondary" style={{ background: "#10B981" }}>+ Tambah Hasil Bumi</button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
            <div className="stat-icon green">
              <LeafIcon size={20} />
            </div>
            <div>
              <div className="stat-value">2.650 kg</div>
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
              <div className="stat-value">Rp 12.8M</div>
              <div className="stat-label">Estimasi Omset Bulan Ini</div>
            </div>
          </div>
        </div>

        {/* Commodity Stock */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold text-lg mb-4">📦 Daftar Komoditas di Gudang</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {items.map((i) => (
              <div key={i.id} style={{ display: "flex", alignItems: "center", justifyBetween: "space-between", padding: "1rem", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#FFFFFF" }}>
                <span style={{ width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "#F1F5F9", borderRadius: "8px", marginRight: "1rem" }}>
                  {i.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="font-semibold">{i.name}</div>
                  <div className="text-xs text-muted">Stok: <strong>{i.stock}</strong> · Estimasi: {i.price}</div>
                </div>
                <div style={{ marginRight: "2rem" }}>
                  <span className="badge badge-success" style={{ background: "#D1FAE5", color: "#10B981" }}>{i.status}</span>
                </div>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="btn-ghost" style={{ padding: "0.4rem 0.8rem", fontSize: "0.8rem" }}>Ubah Stok</button>
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
