"use client";

import { useState } from "react";

const distribusiData = [
  { nama: "Ampas Kopi Organik", persen: 42, warna: "#10B981", industri: ["Kopi Arabika Gayo", "Kedai Kopi Kita"], nilai: "Rp 74 Juta" },
  { nama: "Sekam Padi", persen: 25, warna: "#F59E0B", industri: ["Penggilingan Padi Makmur"], nilai: "Rp 46 Juta" },
  { nama: "Kulit Kayu & Serbuk", persen: 18, warna: "#2563EB", industri: ["Sawmill Kalimantan"], nilai: "Rp 33 Juta" },
  { nama: "Kain Perca Katun", persen: 15, warna: "#8B5CF6", industri: ["Konveksi Batik Solo", "Tenun Ikat Sasak"], nilai: "Rp 31 Juta" },
];

const IconRecycle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 19H4.815a1.83 1.83 0 0 1-1.57-.881 1.785 1.785 0 0 1-.004-1.784L7.196 9.5"></path><path d="M11 19h8.203a1.83 1.83 0 0 0 1.556-.89 1.784 1.784 0 0 0 0-1.775l-1.226-2.12"></path><path d="m14 16-3 3 3 3"></path></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function StatistikLimbahPage() {
  const [detail, setDetail] = useState<(typeof distribusiData)[number] | null>(null);

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Statistik Tata Kelola Limbah</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Metrik ekonomi sirkular — volume ampas industri yang berhasil didaur ulang kembali.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconRecycle /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Limbah Terutilisasi</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>45.2 Ton</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconWallet /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Nilai Ekonomi Sirkular</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>Rp 184 Juta</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconAlert /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Belum Terserap Pasar</span>
          </div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#1E293B" }}>12.4 Ton</div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
        <h3 style={{ margin: "0 0 0.25rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Kategori Limbah Paling Diminati</h3>
        <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Klik salah satu kategori untuk melihat industri penghasilnya</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1.1rem" }}>
          {distribusiData.map((d) => (
            <div key={d.nama} onClick={() => setDetail(d)} style={{ cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                <span style={{ color: "#334155", fontWeight: 500 }}>{d.nama}</span>
                <strong style={{ color: "#1E293B" }}>{d.persen}%</strong>
              </div>
              <div style={{ width: "100%", background: "#F1F5F9", height: "12px", borderRadius: "999px", overflow: "hidden" }}>
                <div style={{ background: d.warna, width: `${d.persen}%`, height: "100%" }} />
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
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Porsi Kategori</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.persen}%</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Nilai Ekonomi</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nilai}</div>
              </div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Industri Penghasil</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {detail.industri.map((nama, i) => (
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