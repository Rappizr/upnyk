"use client";

import { useMemo, useState } from "react";

interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiPanenHari: number;
}

interface Props {
  produsenList: Produsen[];
  onPesan: () => void;
}

const IconRefresh = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

function urgensi(hari: number): { label: string; bg: string; color: string } {
  if (hari <= 3) return { label: "Sangat Mendesak", bg: "#FEE2E2", color: "#991B1B" };
  if (hari <= 7) return { label: "Mendesak", bg: "#FEF3C7", color: "#92400E" };
  return { label: "Terjadwal", bg: "#F1F5F9", color: "#475569" };
}

export default function SmartRestock({ produsenList, onPesan }: Props) {
  const [threshold, setThreshold] = useState(14);

  const terjadwal = useMemo(() => produsenList.filter((p) => p.estimasiPanenHari <= threshold).sort((a, b) => a.estimasiPanenHari - b.estimasiPanenHari), [produsenList, threshold]);
  const sangatMendesak = produsenList.filter((p) => p.estimasiPanenHari <= 3).length;
  const mendesak = produsenList.filter((p) => p.estimasiPanenHari > 3 && p.estimasiPanenHari <= 7).length;

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Smart Restock</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Pengingat otomatis produsen binaan yang mendekati waktu panen, biar kamu bisa bersiap membeli lebih dulu.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#991B1B" }}>{sangatMendesak}</div><div style={{ fontSize: "0.78rem", color: "#991B1B" }}>Sangat Mendesak (≤3 hari)</div></div>
        </div>
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconRefresh /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#92400E" }}>{mendesak}</div><div style={{ fontSize: "0.78rem", color: "#92400E" }}>Mendesak (4–7 hari)</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{produsenList.length - sangatMendesak - mendesak}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Masih Terjadwal</div></div>
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
        <label style={{ fontSize: "0.85rem", color: "#334155", fontWeight: 600 }}>Tampilkan produsen dengan panen dalam:</label>
        <select value={threshold} onChange={(e) => setThreshold(Number(e.target.value))} style={{ padding: "0.45rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white" }}>
          <option value={3}>3 hari</option>
          <option value={7}>7 hari</option>
          <option value={14}>14 hari</option>
          <option value={30}>30 hari</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {terjadwal.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada produsen dalam rentang waktu ini.</div>
        )}
        {terjadwal.map((p) => {
          const u = urgensi(p.estimasiPanenHari);
          return (
            <div key={p.id} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>{p.nama}</span>
                  <span style={{ background: u.bg, color: u.color, fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px" }}>{u.label}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.3rem" }}>Komoditas: <strong>{p.komoditas}</strong></div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "#94A3B8" }}><IconMapPin /> {p.lokasi} • Estimasi panen {p.estimasiPanenHari} hari lagi</div>
              </div>
              <button onClick={onPesan} style={{ background: "#F59E0B", color: "#fff", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", whiteSpace: "nowrap" }}>Pesan di Marketplace</button>
            </div>
          );
        })}
      </div>
    </main>
  );
}