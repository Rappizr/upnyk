import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Transaksi — PasarNusa Super Admin",
};

const dataTransaksi = [
  { id: "TX-90211", tanggal: "09 Jul 2026", umkm: "Keripik Tempe Sanan", supplier: "Pengepul Kedelai Lokal", nominal: "Rp 12.500.000", jenis: "Bahan Baku", status: "Selesai" },
  { id: "TX-90212", tanggal: "08 Jul 2026", umkm: "Kopi Arabika Gayo", supplier: "Pabrik Pupuk Kompos", nominal: "Rp 3.200.000", jenis: "Penjualan Limbah", status: "Diproses" },
  { id: "TX-90213", tanggal: "07 Jul 2026", umkm: "Tenun Ikat Sasak", supplier: "Supplier Benang Sutra", nominal: "Rp 45.000.000", jenis: "Bahan Baku", status: "Dikirim" },
  { id: "TX-90214", tanggal: "05 Jul 2026", umkm: "Sambal Bu Rudy", supplier: "Petani Cabai Makmur", nominal: "Rp 8.750.000", jenis: "Bahan Baku", status: "Dibatalkan" },
];

export default function SemuaTransaksiPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Semua Transaksi</h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Monitor dan audit seluruh aktivitas pembayaran komoditas di dalam platform.</p>
          </div>
          <button style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>Ekspor Laporan (CSV)</button>
        </div>

        {/* Tabel Transaksi */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID Transaksi</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Tanggal</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Pihak UMKM</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Pihak Supplier</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Jenis</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nominal</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataTransaksi.map((tx) => {
                let badgeBg = "#F1F5F9", badgeColor = "#475569";
                if (tx.status === "Selesai") { badgeBg = "#D1FAE5"; badgeColor = "#065F46"; }
                if (tx.status === "Diproses") { badgeBg = "#FEF3C7"; badgeColor = "#92400E"; }
                if (tx.status === "Dikirim") { badgeBg = "#E0F2FE"; badgeColor = "#075985"; }
                if (tx.status === "Dibatalkan") { badgeBg = "#FEE2E2"; badgeColor = "#991B1B"; }

                return (
                  <tr key={tx.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#2563EB" }}>{tx.id}</td>
                    <td style={{ padding: "1rem", color: "#64748B" }}>{tx.tanggal}</td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{tx.umkm}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{tx.supplier}</td>
                    <td style={{ padding: "1rem", color: "#475569" }}>
                      <span style={{ fontSize: "0.85rem", background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px" }}>{tx.jenis}</span>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#0F172A" }}>{tx.nominal}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ background: badgeBg, color: badgeColor, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{tx.status}</span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", cursor: "pointer" }}>Detail Kelola</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}