"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

type Grade = "A" | "B" | "C" | "Belum Dinilai";

interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiPanenHari: number;
}
interface StokToko {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  batasMinimum: number;
  asalProdusen: string;
}

interface Props {
  produsenList: Produsen[];
  stokList: StokToko[];
  updateStok: (id: string, patch: Partial<StokToko>) => void;
  onPesan: () => void;
}

const IconRefresh = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconBox = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;

function urgensi(hari: number): { label: string; bg: string; color: string } {
  if (hari <= 3) return { label: "Sangat Mendesak", bg: "#FEE2E2", color: "#991B1B" };
  if (hari <= 7) return { label: "Mendesak", bg: "#FEF3C7", color: "#92400E" };
  return { label: "Terjadwal", bg: "#F1F5F9", color: "#475569" };
}

export default function SmartRestock({ produsenList = [], stokList = [], updateStok, onPesan }: Props) {
  const [threshold, setThreshold] = useState(14);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState(0);

  const terjadwal = useMemo(() => (produsenList || []).filter((p) => p.estimasiPanenHari <= threshold).sort((a, b) => a.estimasiPanenHari - b.estimasiPanenHari), [produsenList, threshold]);
  const sangatMendesak = useMemo(() => (produsenList || []).filter((p) => p.estimasiPanenHari <= 3).length, [produsenList]);
  const mendesak = useMemo(() => (produsenList || []).filter((p) => p.estimasiPanenHari > 3 && p.estimasiPanenHari <= 7).length, [produsenList]);

  const stokMenipis = useMemo(() => (stokList || []).filter((s) => s.jumlah <= s.batasMinimum), [stokList]);

  function mulaiEditBatas(s: StokToko) {
    setEditId(s.id);
    setEditValue(s.batasMinimum);
  }
  function simpanBatas(id: string) {
    updateStok(id, { batasMinimum: editValue });
    setEditId(null);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main {
            padding: 0.5rem 0.25rem !important;
          }
          main h1 {
            font-size: 1.15rem !important;
          }
          main p {
            font-size: 0.62rem !important;
            line-height: 1.2 !important;
          }
          .restock-warehouse-box {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            margin-bottom: 1rem !important;
          }
          .restock-warehouse-box h2 {
            font-size: 0.95rem !important;
          }
          .restock-warehouse-item {
            padding: 0.5rem 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .restock-warehouse-item div:first-child div:first-child {
            font-size: 0.75rem !important;
          }
          .restock-warehouse-item div:first-child div:last-child {
            font-size: 0.62rem !important;
          }
          .restock-warehouse-item button, .restock-warehouse-item input {
            padding: 0.25rem 0.45rem !important;
            font-size: 0.62rem !important;
            border-radius: 4px !important;
          }
          
          /* FORCE GRID KARTU METRIK 3 KOLOM MENYAMPING DI HP */
          .restock-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .restock-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .restock-stat-card > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          .restock-stat-card > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .restock-stat-card > div:last-child > div:first-child {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .restock-stat-card > div:last-child > div:last-child {
            font-size: 0.48rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          .restock-filter-row {
            gap: 0.4rem !important;
            margin-bottom: 0.75rem !important;
          }
          .restock-filter-row label, .restock-filter-row select {
            font-size: 0.75rem !important;
          }
          .restock-filter-row select {
            padding: 0.3rem 0.5rem !important;
            border-radius: 6px !important;
          }
          .producer-list-card {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            gap: 0.5rem !important;
          }
          .producer-meta-info span:first-child {
            font-size: 0.75rem !important;
          }
          .producer-meta-info span:last-child {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
          .producer-meta-info div:nth-of-type(1) {
            font-size: 0.68rem !important;
            margin-bottom: 0.1rem !important;
          }
          .producer-meta-info div:nth-of-type(2) {
            font-size: 0.62rem !important;
            gap: 3px !important;
          }
          .producer-meta-info div:nth-of-type(2) svg {
            width: 10px !important;
            height: 10px !important;
          }
          .producer-list-card button {
            padding: 0.4rem 0px !important;
            font-size: 0.65rem !important;
            border-radius: 5px !important;
            width: 100% !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Smart Restock</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Dua sumber pengingat: stok gudang yang mau habis, dan produsen binaan yang mendekati waktu panen.</p>
      </div>

      <div className="restock-warehouse-box" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem", marginBottom: "1.75rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "0.2rem" }}>
          <span style={{ color: "#EF4444", display: "flex" }}><IconBox /></span>
          <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Stok Gudang Mau Habis</h2>
        </div>
        <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Atur sendiri batas minimum tiap barang (kg/karung/pcs/apapun satuannya) — kalau stok turun di bawah batas itu, muncul di sini.</p>

        {stokMenipis.length === 0 ? (
          <p style={{ fontSize: "0.85rem", color: "#64748B" }}>Semua stok gudang masih di atas batas minimum. Aman.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {stokMenipis.map((s) => (
              <div key={s.id} className="restock-warehouse-item" style={{ background: "#FEF2F2", borderRadius: "8px", padding: "0.75rem 0.9rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</div>
                  <div style={{ fontSize: "0.72rem", color: "#DC2626" }}>Sisa {s.jumlah} {s.satuan} • dari {s.asalProdusen}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  {editId === s.id ? (
                    <>
                      <input type="number" min="0" value={editValue} onChange={(e) => setEditValue(Number(e.target.value))} style={{ width: "70px", padding: "0.35rem 0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.8rem" }} />
                      <span style={{ fontSize: "0.75rem", color: "#64748B" }}>{s.satuan}</span>
                      <button onClick={() => simpanBatas(s.id)} style={{ background: "#10B981", color: "#fff", border: "none", fontSize: "0.72rem", fontWeight: 600, padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>Simpan</button>
                    </>
                  ) : (
                    <>
                      <span style={{ fontSize: "0.72rem", color: "#64748B" }}>Batas: {s.batasMinimum} {s.satuan}</span>
                      <button onClick={() => mulaiEditBatas(s)} style={{ background: "#F1F5F9", border: "none", fontSize: "0.72rem", fontWeight: 600, padding: "0.4rem 0.6rem", borderRadius: "6px", cursor: "pointer", color: "#334155" }}>Ubah Batas</button>
                    </>
                  )}
                  <button onClick={onPesan} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.72rem", fontWeight: 600, padding: "0.4rem 0.7rem", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>Beli Sekarang</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="restock-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="restock-stat-card" style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#991B1B" }}>{sangatMendesak}</div><div style={{ fontSize: "0.78rem", color: "#991B1B" }}>Panen Sangat Mendesak (≤3 hari)</div></div>
        </div>
        <div className="restock-stat-card" style={{ background: "#FEF3C7", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconRefresh /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#92400E" }}>{mendesak}</div><div style={{ fontSize: "0.78rem", color: "#92400E" }}>Panen Mendesak (4–7 hari)</div></div>
        </div>
        <div className="restock-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{produsenList.length - sangatMendesak - mendesak}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Masih Terjadwal</div></div>
        </div>
      </div>

      <div className="restock-filter-row" style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem", flexWrap: "wrap" }}>
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
            <div key={p.id} className="producer-list-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem 1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div className="producer-meta-info" style={{ minWidth: 0, flex: 1 }}>
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