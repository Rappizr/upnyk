import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Statistik Kinerja Supplier — PasarNusa Super Admin",
};

export default function StatistikSupplierPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div style={{ marginBottom: "2rem" }}>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Statistik Produsen & Supplier</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Analisis kinerja ketepatan pengiriman logistik, pemenuhan order B2B, dan rating kepuasan mitra.</p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem", marginBottom: "2rem" }}>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#D97706" }}>4.8 / 5.0</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Rata-rata Rating Supplier</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB" }}>96.5%</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>SLA Ketepatan Waktu Logistik</div>
          </div>
          <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#9333EA" }}>318 Mitra</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 600 }}>Total Produsen Skala Besar</div>
          </div>
        </div>
      </main>
    </div>
  );
}