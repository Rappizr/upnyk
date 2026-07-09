import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik Arus Bahan Baku — PasarNusa Super Admin",
};

export default function StatistikBahanBakuPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Statistik Komoditas Bahan Baku</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau stabilitas stok penawaran suplai komoditas utama kebutuhan industri rural.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#0284C7" }}>1,412 SKU</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Total Jenis Bahan Baku Tersedia</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#16A34A" }}>Stable</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Status Indeks Harga Pasar</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#7C3AED" }}>88.4 Ton</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Total Volume Distribusi Bahan Baku</div>
          </div>
        </div>
      </main>
    </div>
  );
}