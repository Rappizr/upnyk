import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Semua Kolaborasi — PasarNusa Super Admin",
};

const dataKolaborasi = [
  { id: "COL-7701", inisiator: "UMKM Tahu Sumedang", mitra: "Petani Budidaya Jamur", proyek: "Pemanfaatan Ampas Tahu untuk Media Tanam", durasi: "6 Bulan", status: "Berjalan" },
  { id: "COL-7702", inisiator: "Gabungan Kelompok Tani", mitra: "UMKM Keripik Buah", proyek: "Sharing Session & Sharing Alat Vacuum Frying", durasi: "12 Bulan", status: "Aktif" },
  { id: "COL-7703", inisiator: "Kopi Gayo Kolektif", mitra: "Pabrik Plastik Biodegradable", proyek: "Suplai Limbah Kulit Ceri Kopi", durasi: "3 Bulan", status: "Selesai" },
  { id: "COL-7704", inisiator: "Tenun Ikat Lombok", mitra: "Supplier Pewarna Alami", proyek: "Kontrak Eksklusif Suplai Indigofera", durasi: "24 Bulan", status: "Menunggu TTD" },
];

export default function SemuaKolaborasiPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Semua Kolaborasi</h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau kontrak kemitraan sirkular dan gotong royong infrastruktur antar pelaku usaha.</p>
          </div>
          <button style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Buka Hub Hubungan Baru</button>
        </div>

        {/* Tabel Kolaborasi */}
        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID Kontrak</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Inisiator Utama</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Mitra Kolaborasi</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Proyek Kolaborasi</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Durasi Kontrak</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status Hubungan</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataKolaborasi.map((col) => {
                let badgeBg = "#FEF3C7", badgeColor = "#92400E";
                if (col.status === "Berjalan" || col.status === "Aktif") { badgeBg = "#D1FAE5"; badgeColor = "#065F46"; }
                if (col.status === "Selesai") { badgeBg = "#E2E8F0"; badgeColor = "#475569"; }

                return (
                  <tr key={col.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{col.id}</td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{col.inisiator}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{col.mitra}</td>
                    <td style={{ padding: "1rem", color: "#1E293B", fontWeight: 500 }}>{col.proyek}</td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{col.durasi}</td>
                    <td style={{ padding: "1rem" }}>
                      <span style={{ background: badgeBg, color: badgeColor, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{col.status}</span>
                    </td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button style={{ background: "#2563EB", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "white", cursor: "pointer", marginRight: "0.25rem" }}>Tinjau MOU</button>
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