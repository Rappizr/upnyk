import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik Pertumbuhan UMKM — PasarNusa Super Admin",
};

export default function StatistikUmkmPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Statistik Data UMKM</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Analisis pertumbuhan pendaftaran, sebaran wilayah, dan keaktifan mitra UMKM.</p>
        </div>

        {/* Ringkasan Angka */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB" }}>+240</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>UMKM Baru Bulan Ini</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#16A34A" }}>94.2%</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Rasio UMKM Aktif Transaksi</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#EA580C" }}>34 Provinsi</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Sebaran Jangkauan Wilayah</div>
          </div>
        </div>

        {/* Visualisasi Grafik Sederhana */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <h3 style={{ margin: "0 0 1.5rem 0", fontSize: "1.1rem", color: "#0F172A" }}>Tren Pertumbuhan Bulanan (2026)</h3>
          <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "2rem", paddingLeft: "1rem", borderLeft: "2px solid #E2E8F0", borderBottom: "2px solid #E2E8F0" }}>
            <div style={{ flex: 1, background: "#3B82F6", height: "40%", borderRadius: "4px 4px 0 0", textAlign: "center", color: "white", fontSize: "0.8rem", paddingBottom: "5px" }}>Jan</div>
            <div style={{ flex: 1, background: "#3B82F6", height: "55%", borderRadius: "4px 4px 0 0", textAlign: "center", color: "white", fontSize: "0.8rem", paddingBottom: "5px" }}>Feb</div>
            <div style={{ flex: 1, background: "#3B82F6", height: "70%", borderRadius: "4px 4px 0 0", textAlign: "center", color: "white", fontSize: "0.8rem", paddingBottom: "5px" }}>Mar</div>
            <div style={{ flex: 1, background: "#2563EB", height: "95%", borderRadius: "4px 4px 0 0", textAlign: "center", color: "white", fontSize: "0.8rem", paddingBottom: "5px", fontWeight: "bold" }}>Apr</div>
          </div>
        </div>
      </main>
    </div>
  );
}