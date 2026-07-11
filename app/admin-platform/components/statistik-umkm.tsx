"use client";

import { useState } from "react";

const monthlyData = [
  { bulan: "Feb", jumlah: 165 },
  { bulan: "Mar", jumlah: 190 },
  { bulan: "Apr", jumlah: 210 },
  { bulan: "Mei", jumlah: 225 },
  { bulan: "Jun", jumlah: 260 },
  { bulan: "Jul", jumlah: 240 },
];

const sektorData = [
  { nama: "Makanan & Minuman", jumlah: 1240, warna: "#2563EB" },
  { nama: "Kerajinan & Kriya", jumlah: 450, warna: "#10B981" },
  { nama: "Fashion & Tekstil", jumlah: 312, warna: "#F59E0B" },
  { nama: "Pertanian / Komoditas", jumlah: 285, warna: "#8B5CF6" },
  { nama: "Bahan Pokok", jumlah: 123, warna: "#EF4444" },
];

const wilayahData = [
  { nama: "Jawa Timur", jumlah: 612, umkmContoh: ["Keripik Tempe Sanan", "Sambal Bu Rudy"] },
  { nama: "Jawa Barat", jumlah: 498, umkmContoh: ["Batik Pekalongan Asli"] },
  { nama: "Nusa Tenggara", jumlah: 340, umkmContoh: ["Tenun Ikat Sasak", "Madu Hutan Sumbawa"] },
  { nama: "Sumatera", jumlah: 305, umkmContoh: ["Kopi Arabika Gayo"] },
  { nama: "Kalimantan", jumlah: 210, umkmContoh: ["Anyaman Rotan Kalimantan"] },
];

const IconTrend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMap = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function StatistikUmkmPage() {
  const [bulanDetail, setBulanDetail] = useState<{ bulan: string; jumlah: number } | null>(null);
  const [wilayahDetail, setWilayahDetail] = useState<(typeof wilayahData)[number] | null>(null);

  const maxBulan = Math.max(...monthlyData.map((m) => m.jumlah));
  const totalSektor = sektorData.reduce((s, x) => s + x.jumlah, 0);
  const totalWilayah = wilayahData.reduce((s, x) => s + x.jumlah, 0);

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Statistik Data UMKM</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Analisis pertumbuhan pendaftaran, sebaran wilayah, dan keaktifan mitra UMKM secara menyeluruh.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconTrend /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>UMKM Baru Bulan Ini</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>+240</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconCheck /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Rasio UMKM Aktif Transaksi</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>94.2%</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#FEF3C7", color: "#F59E0B", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconMap /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Sebaran Jangkauan Wilayah</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>34 Provinsi</div>
        </div>
      </div>

      {/* Grafik Pertumbuhan Bulanan — klik batang untuk detail */}
      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Tren Pertumbuhan Bulanan (2026)</h3>
        <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Klik salah satu batang untuk melihat rincian bulan tersebut</p>
        <div style={{ display: "flex", alignItems: "flex-end", height: "200px", gap: "1.25rem", paddingLeft: "0.5rem", borderLeft: "2px solid #E2E8F0", borderBottom: "2px solid #E2E8F0" }}>
          {monthlyData.map((m) => (
            <div
              key={m.bulan}
              onClick={() => setBulanDetail(m)}
              style={{ flex: 1, background: m.jumlah === maxBulan ? "#2563EB" : "#93C5FD", height: `${(m.jumlah / maxBulan) * 100}%`, borderRadius: "6px 6px 0 0", textAlign: "center", color: "white", fontSize: "0.75rem", paddingBottom: "6px", cursor: "pointer", transition: "opacity 0.15s", fontWeight: 600, display: "flex", alignItems: "flex-end", justifyContent: "center" }}
            >
              {m.bulan}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
        {/* Sebaran Sektor */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Sebaran Berdasarkan Sektor</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            {sektorData.map((s) => (
              <div key={s.nama}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#334155" }}>{s.nama}</span>
                  <strong style={{ color: "#1E293B" }}>{s.jumlah.toLocaleString("id-ID")} ({Math.round((s.jumlah / totalSektor) * 100)}%)</strong>
                </div>
                <div style={{ width: "100%", background: "#F1F5F9", height: "10px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${(s.jumlah / totalSektor) * 100}%`, height: "100%", background: s.warna }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sebaran Wilayah — klik untuk lihat contoh UMKM */}
        <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Sebaran Berdasarkan Wilayah</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {wilayahData.map((w) => (
              <div key={w.nama} onClick={() => setWilayahDetail(w)} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.65rem 0.85rem", background: "#F8FAFC", borderRadius: "8px", cursor: "pointer" }}>
                <span style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 500 }}>{w.nama}</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#2563EB" }}>{w.jumlah} UMKM →</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Modal detail bulan */}
      {bulanDetail && (
        <div onClick={() => setBulanDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Detail Bulan {bulanDetail.bulan}</h2>
              <button onClick={() => setBulanDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ fontSize: "2rem", fontWeight: 700, color: "#2563EB", marginBottom: "0.25rem" }}>{bulanDetail.jumlah} UMKM</div>
            <p style={{ fontSize: "0.85rem", color: "#64748B", margin: 0 }}>UMKM baru terdaftar dan terverifikasi pada bulan {bulanDetail.bulan} 2026.</p>
            <button onClick={() => setBulanDetail(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}

      {/* Modal detail wilayah */}
      {wilayahDetail && (
        <div onClick={() => setWilayahDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{wilayahDetail.nama}</h2>
              <button onClick={() => setWilayahDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{wilayahDetail.jumlah} UMKM terdaftar ({Math.round((wilayahDetail.jumlah / totalWilayah) * 100)}% dari total sebaran)</p>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Contoh UMKM di wilayah ini</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {wilayahDetail.umkmContoh.map((nama, i) => (
                <div key={i} style={{ padding: "0.55rem 0.8rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem", color: "#334155" }}>{nama}</div>
              ))}
            </div>
            <button onClick={() => setWilayahDetail(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}
