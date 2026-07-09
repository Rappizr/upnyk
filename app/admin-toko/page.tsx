import Link from "next/link";
import type { Metadata } from "next";
import { 
  CartIcon, DollarIcon, StarIcon, PackageIcon
} from "@/components/ProductIcons";

export const metadata: Metadata = {
  title: "Admin Toko Dashboard — Lural Commerce & Supply Chain",
};

const orders = [
  { id: "ORD-9821", buyer: "Arif Kurniawan", product: "Beras Merah 5kg", qty: 2, total: "Rp 280.000", status: "Perlu Diproses" },
  { id: "ORD-9819", buyer: "Siti Rahma", product: "Kopi Arabika Gayo 250g", qty: 3, total: "Rp 285.000", status: "Sudah Dikemas" },
  { id: "ORD-9815", buyer: "Dedi Wijaya", product: "Madu Hutan Kalimantan", qty: 1, total: "Rp 135.000", status: "Dalam Pengiriman" },
];

export default function AdminTokoDashboard() {
  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar Admin Toko */}
      <aside style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#F59E0B" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F59E0B" }}>Lural<span>Toko</span></span>
        </div>

        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Panel Toko B2C</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <a href="#" className="nav-item active" style={{ color: "#D97706", background: "#FEF3C7", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <CartIcon size={16} /> Dashboard Toko
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PackageIcon size={16} /> Kelola Produk
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PackageIcon size={16} /> Pesanan Pelanggan
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
        <div style={{ display: "flex", justifyBetween: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CartIcon size={28} className="text-amber-500" /> Portal Admin Toko (Citra)
            </h1>
            <p className="page-subtitle">Kelola penjualan, promosi toko, dan konfirmasi pesanan masuk.</p>
          </div>
          <button className="btn-secondary" style={{ background: "#F59E0B" }}>+ Tambah Produk Baru</button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card" style={{ borderLeft: "4px solid #F59E0B" }}>
            <div className="stat-icon yellow">
              <PackageIcon size={20} />
            </div>
            <div>
              <div className="stat-value">12 Pesanan</div>
              <div className="stat-label">Baru Perlu Diproses</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
            <div className="stat-icon green">
              <DollarIcon size={20} />
            </div>
            <div>
              <div className="stat-value">Rp 8.4 Jt</div>
              <div className="stat-label">Omset Penjualan Hari Ini</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #2563EB" }}>
            <div className="stat-icon blue">
              <StarIcon size={20} fill="currentColor" />
            </div>
            <div>
              <div className="stat-value">4.8 / 5</div>
              <div className="stat-label">Rating Kepuasan Toko</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold text-lg mb-4">📦 Pesanan Masuk Terbaru</h3>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "2px solid #E2E8F0", paddingBottom: "0.5rem" }}>
                  <th style={{ padding: "0.75rem 0" }}>ID Pesanan</th>
                  <th>Pembeli</th>
                  <th>Produk</th>
                  <th>Jumlah</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem 0", fontWeight: 600 }}>{o.id}</td>
                    <td>{o.buyer}</td>
                    <td>{o.product}</td>
                    <td>x{o.qty}</td>
                    <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>{o.total}</td>
                    <td>
                      <span className={`badge ${o.status === "Perlu Diproses" ? "badge-warning" : o.status === "Sudah Dikemas" ? "badge-info" : "badge-success"}`}>
                        {o.status}
                      </span>
                    </td>
                    <td>
                      <button className="btn-primary" style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem", background: o.status === "Perlu Diproses" ? "var(--color-primary)" : "var(--color-text-muted)" }}>
                        {o.status === "Perlu Diproses" ? "Proses" : "Detail"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
