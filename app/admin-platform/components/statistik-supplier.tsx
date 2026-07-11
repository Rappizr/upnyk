"use client";

<<<<<<< Updated upstream
import { useState } from "react";

const monthlyGrowth = [
  { bulan: "Feb", jumlah: 260 },
  { bulan: "Mar", jumlah: 275 },
  { bulan: "Apr", jumlah: 290 },
  { bulan: "Mei", jumlah: 300 },
  { bulan: "Jun", jumlah: 308 },
  { bulan: "Jul", jumlah: 318 },
];

const supplierRanking = [
  { nama: "Pengepul Kedelai Lokal", kategori: "Bahan Baku", wilayah: "Malang", rating: 4.9, slaTepatWaktu: 98, totalTransaksi: 142 },
  { nama: "Koperasi Petani Cabai Makmur", kategori: "Bahan Baku", wilayah: "Garut", rating: 4.8, slaTepatWaktu: 96, totalTransaksi: 118 },
  { nama: "Distributor Benang Sutra Nusantara", kategori: "Tekstil", wilayah: "Bandung", rating: 4.7, slaTepatWaktu: 95, totalTransaksi: 96 },
  { nama: "Pabrik Pupuk Kompos Sejahtera", kategori: "Pertanian", wilayah: "Bogor", rating: 4.6, slaTepatWaktu: 92, totalTransaksi: 87 },
  { nama: "Sawmill Kalimantan", kategori: "Kayu & Serbuk", wilayah: "Kalimantan", rating: 4.3, slaTepatWaktu: 84, totalTransaksi: 54 },
];

const IconStar = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconTruck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconBuilding = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="1"></rect><line x1="9" y1="7" x2="9" y2="7.01"></line><line x1="15" y1="7" x2="15" y2="7.01"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function StatistikSupplierPage() {
  const [detail, setDetail] = useState<(typeof supplierRanking)[number] | null>(null);
  const maxGrowth = Math.max(...monthlyGrowth.map((m) => m.jumlah));

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Statistik Produsen & Supplier</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Analisis kinerja ketepatan pengiriman logistik, pemenuhan order B2B, dan rating kepuasan mitra.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconStar /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Rata-rata Rating Supplier</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>4.8 / 5.0</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconTruck /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>SLA Ketepatan Waktu</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>96.5%</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#F3E8FF", color: "#9333EA", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconBuilding /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Produsen Skala Besar</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>318 Mitra</div>
        </div>
      </div>

      {/* Grafik pertumbuhan supplier */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Pertumbuhan Jumlah Supplier</h3>
        <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "1.25rem", paddingLeft: "0.5rem", borderLeft: "2px solid #E2E8F0", borderBottom: "2px solid #E2E8F0" }}>
          {monthlyGrowth.map((m) => (
            <div key={m.bulan} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>{m.jumlah}</div>
              <div style={{ width: "100%", maxWidth: "40px", height: `${(m.jumlah / maxGrowth) * 100}%`, background: "#10B981", borderRadius: "6px 6px 0 0", minHeight: "4px" }} />
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.4rem" }}>{m.bulan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Ranking Supplier — klik untuk detail kinerja */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Peringkat Supplier Terbaik</h3>
        <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Klik salah satu supplier untuk melihat rincian kinerjanya</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {supplierRanking.map((s, i) => (
            <div key={s.nama} onClick={() => setDetail(s)} style={{ display: "flex", alignItems: "center", gap: "0.9rem", padding: "0.75rem 0.9rem", background: "#F8FAFC", borderRadius: "10px", cursor: "pointer" }}>
              <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: i === 0 ? "#F59E0B" : "#E2E8F0", color: i === 0 ? "white" : "#64748B", fontSize: "0.75rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{i + 1}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</div>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{s.kategori} • {s.wilayah}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.3rem", color: "#D97706", fontWeight: 700, fontSize: "0.85rem" }}>
                <span style={{ display: "flex" }}><IconStar /></span>{s.rating}
              </div>
            </div>
          ))}
        </div>
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.kategori} • {detail.wilayah}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#D97706" }}>{detail.rating}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B" }}>Rating</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#2563EB" }}>{detail.slaTepatWaktu}%</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B" }}>SLA Tepat Waktu</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#10B981" }}>{detail.totalTransaksi}</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B" }}>Total Transaksi</div>
              </div>
            </div>
            <button onClick={() => setDetail(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
=======
import SimpleStatsPage from "./ui/SimpleStatsPage";
import { Icon } from "./ui/icons";

export default function StatistikSupplierPage() {
  return (
    <SimpleStatsPage
      title="Statistik Produsen & Supplier"
      subtitle="Analisis kinerja ketepatan pengiriman logistik, pemenuhan order B2B, dan rating kepuasan mitra."
      stats={[
        { icon: <Icon.Sparkle size={20} />, value: "4.8 / 5.0", label: "Rata-rata Rating Supplier", tone: "amber" },
        { icon: <Icon.Truck size={20} />, value: "96.5%", label: "SLA Ketepatan Waktu Logistik", tone: "blue" },
        { icon: <Icon.Building size={20} />, value: "318 Mitra", label: "Total Produsen Skala Besar", tone: "violet" },
      ]}
    />
>>>>>>> Stashed changes
  );
}
