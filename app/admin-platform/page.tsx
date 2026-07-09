import Link from "next/link";
import type { Metadata } from "next";
import { 
  LockIcon, UserIcon, PackageIcon, DollarIcon, TruckIcon
} from "@/components/ProductIcons";

export const metadata: Metadata = {
  title: "Admin Platform Dashboard — Lural Commerce & Supply Chain",
};

const activities = [
  { time: "10:15", user: "Admin Toko Citra", action: "Menambahkan produk Kopi Arabika Gayo baru", category: "Katalog" },
  { time: "09:42", user: "Produsen Pak Budi", action: "Memperbarui stok Beras Merah sebanyak +500kg", category: "Stok Gudang" },
  { time: "08:12", user: "Sistem Rantai Pasok", action: "Penghitungan ongkos kirim rute Makassar-Jakarta berhasil", category: "Logistik" },
  { time: "07:30", user: "Admin Toko Dedi", action: "Menyetujui pendaftaran pembeli baru: arif.pembeli@lural.com", category: "Registrasi" },
];

export default function AdminPlatformDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar Admin Platform */}
      <aside style={{ width: "240px", background: "#1E293B", color: "#F8FAFC", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#3B82F6" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>Lural<span>Platform</span></span>
        </div>

        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.75rem" }}>Sistem Utama</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <a href="#" className="nav-item active" style={{ color: "#FFFFFF", background: "#334155", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <LockIcon size={16} /> Ringkasan Platform
          </a>
          <a href="#" className="nav-item" style={{ color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <UserIcon size={16} /> Kelola Mitra (UMKM)
          </a>
          <a href="#" className="nav-item" style={{ color: "#94A3B8", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PackageIcon size={16} /> Analisis Data
          </a>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <Link href="/login" className="btn-ghost" style={{ width: "100%", justifyContent: "center", color: "#F87171", borderColor: "#475569", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <LockIcon size={28} className="text-primary" /> Portal Admin Platform (Dharma)
            </h1>
            <p className="page-subtitle">Pusat pemantauan kinerja ekonomi digital rural, integrasi sistem logistik B2B, dan tata kelola user.</p>
          </div>
          <button className="btn-primary" style={{ background: "#2563EB" }}>Unduh Laporan Audit</button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
          <div className="stat-card">
            <div className="stat-icon blue">
              <PackageIcon size={20} />
            </div>
            <div>
              <div className="stat-value">2.410</div>
              <div className="stat-label">Total UMKM Aktif</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <DollarIcon size={20} />
            </div>
            <div>
              <div className="stat-value">Rp 1.2M</div>
              <div className="stat-label">Total GMV (Bulan Ini)</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <TruckIcon size={20} />
            </div>
            <div>
              <div className="stat-value">14.820</div>
              <div className="stat-label">Pengiriman Logistik</div>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon yellow">
              <UserIcon size={20} />
            </div>
            <div>
              <div className="stat-value">48.2K</div>
              <div className="stat-label">Total Akun Terdaftar</div>
            </div>
          </div>
        </div>

        {/* Audit Log Activity */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold text-lg mb-4">Aktivitas Platform Terkini</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {activities.map((a, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #E2E8F0", borderRadius: "8px", background: "#FFFFFF" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--color-text-subtle)", marginRight: "1rem" }}>{a.time}</span>
                <div style={{ flex: 1 }}>
                  <div className="font-medium text-sm">
                    <strong>{a.user}</strong> — {a.action}
                  </div>
                </div>
                <div>
                  <span className="badge badge-gray text-xs" style={{ background: "#F1F5F9" }}>{a.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
