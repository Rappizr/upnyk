"use client";

import { useState } from "react";

const monthlyVolume = [
  { bulan: "Feb", ton: 62 },
  { bulan: "Mar", ton: 71 },
  { bulan: "Apr", ton: 78 },
  { bulan: "Mei", ton: 84 },
  { bulan: "Jun", ton: 90 },
  { bulan: "Jul", ton: 88.4 },
];

const komoditasData = [
  { nama: "Biji Kopi Mentah (Green Bean)", sku: 320, tren: 12, pemasok: ["Pengepul Kopi Gayo", "Petani Kopi Sidikalang"] },
  { nama: "Tepung Tapioka Industri", sku: 265, tren: 6, pemasok: ["Pabrik Tapioka Lampung"] },
  { nama: "Serat Kain Alam", sku: 190, tren: -3, pemasok: ["Distributor Benang Sutra Nusantara"] },
  { nama: "Minyak Kelapa Mentah", sku: 158, tren: 4, pemasok: ["Koperasi Kelapa Manado"] },
  { nama: "Cabai & Rempah Segar", sku: 141, tren: -2, pemasok: ["Petani Cabai Makmur"] },
];

const IconLayers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IconTrend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>;
const IconTruck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function StatistikBahanBakuPage() {
  const [detail, setDetail] = useState<(typeof komoditasData)[number] | null>(null);
  const maxVolume = Math.max(...monthlyVolume.map((m) => m.ton));

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Statistik Komoditas Bahan Baku</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau stabilitas stok dan penawaran suplai komoditas utama kebutuhan industri rural.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#E0F2FE", color: "#0284C7", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconLayers /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Jenis Bahan Baku</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>1.412 SKU</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#D1FAE5", color: "#16A34A", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconTrend /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Status Indeks Harga Pasar</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>Stabil</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#F3E8FF", color: "#7C3AED", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconTruck /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Volume Distribusi</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>88.4 Ton</div>
        </div>
      </div>

      {/* Grafik volume distribusi bulanan */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: "0 0 1.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Volume Distribusi Bulanan (Ton)</h3>
        <div style={{ display: "flex", alignItems: "flex-end", height: "180px", gap: "1.25rem", paddingLeft: "0.5rem", borderLeft: "2px solid #E2E8F0", borderBottom: "2px solid #E2E8F0" }}>
          {monthlyVolume.map((m) => (
            <div key={m.bulan} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
              <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>{m.ton}</div>
              <div style={{ width: "100%", maxWidth: "40px", height: `${(m.ton / maxVolume) * 100}%`, background: "#7C3AED", borderRadius: "6px 6px 0 0", minHeight: "4px" }} />
              <div style={{ fontSize: "0.75rem", color: "#64748B", marginTop: "0.4rem" }}>{m.bulan}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Komoditas — klik untuk lihat pemasok */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Komoditas dengan SKU Terbanyak</h3>
        <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Klik salah satu komoditas untuk melihat pemasok terkait</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {komoditasData.map((k) => (
            <div key={k.nama} onClick={() => setDetail(k)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.75rem 0.9rem", background: "#F8FAFC", borderRadius: "8px", cursor: "pointer" }}>
              <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 500 }}>{k.nama}</span>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: 600, color: k.tren >= 0 ? "#10B981" : "#EF4444" }}>{k.tren >= 0 ? "▲" : "▼"} {Math.abs(k.tren)}%</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>{k.sku} SKU</span>
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
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", margin: "1rem 0" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Total SKU</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.sku}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Tren Bulan Ini</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: detail.tren >= 0 ? "#10B981" : "#EF4444" }}>{detail.tren >= 0 ? "▲" : "▼"} {Math.abs(detail.tren)}%</div>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Pemasok Terkait</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {detail.pemasok.map((nama, i) => (
                <div key={i} style={{ padding: "0.55rem 0.8rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem", color: "#334155" }}>{nama}</div>
              ))}
            </div>
            <button onClick={() => setDetail(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}
