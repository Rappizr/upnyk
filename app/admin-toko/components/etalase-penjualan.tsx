"use client";

import { useState } from "react";
import type { FormEvent } from "react";

type Grade = "A" | "B" | "C" | "Belum Dinilai";

interface StokToko {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  grade: Grade;
  asalProdusen: string;
  live: boolean;
}

interface Props {
  stokList: StokToko[];
  updateStok: (id: string, patch: Partial<StokToko>) => void;
}

const IconTag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.5 3H4a1 1 0 0 0-1 1v5.5a2 2 0 0 0 .83 1.5l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"></path></svg>;
const IconEye = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path><circle cx="12" cy="12" r="3"></circle></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function hargaSetelahDiskon(harga: number, diskon: number) {
  return Math.round(harga * (1 - diskon / 100));
}

export default function EtalasePenjualan({ stokList = [], updateStok }: Props) {
  const [editItem, setEditItem] = useState<StokToko | null>(null);
  const [form, setForm] = useState({ hargaJual: "", diskonPersen: "" });

  const live = stokList.filter((s) => s.live);
  const belumLive = stokList.filter((s) => !s.live);

  function openEdit(item: StokToko) {
    setEditItem(item);
    setForm({ hargaJual: String(item.hargaJual), diskonPersen: String(item.diskonPersen) });
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    updateStok(editItem.id, { hargaJual: Number(form.hargaJual) || editItem.hargaJual, diskonPersen: Math.min(90, Math.max(0, Number(form.diskonPersen) || 0)) });
    setEditItem(null);
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
          .showcase-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .showcase-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .showcase-stat-card > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          .showcase-stat-card > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .showcase-stat-card > div:last-child > div:first-child {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .showcase-stat-card > div:last-child > div:last-child {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          
          /* FORCE 3 KOLOM GRID MENYAMPING DI HP */
          .showcase-cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .showcase-main-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
          }
          .showcase-badge-container {
            margin-bottom: 0.25rem !important;
          }
          .showcase-badge-container span {
            padding: 0.1rem 0.3rem !important;
            border-radius: 4px !important;
            font-size: 0.45rem !important;
          }
          .showcase-title-text {
            font-size: 0.58rem !important;
            line-height: 1.15 !important;
            margin-bottom: 0.1rem !important;
          }
          .showcase-stock-text {
            font-size: 0.48rem !important;
            margin-bottom: 0.25rem !important;
          }
          .showcase-price-block {
            margin-bottom: 0.4rem !important;
            line-height: 1.1 !important;
          }
          .showcase-price-block span:nth-child(1) {
            font-size: 0.45rem !important;
            margin-right: 2px !important;
          }
          .showcase-price-block span:nth-child(2) {
            font-size: 0.55rem !important;
            font-weight: 700 !important;
          }
          .showcase-price-block span:nth-child(3) {
            font-size: 0.42rem !important;
            padding: 0.05rem 0.2rem !important;
            border-radius: 2px !important;
            margin-left: 2px !important;
          }
          .showcase-actions-row {
            gap: 0.2rem !important;
          }
          .showcase-actions-row button {
            padding: 0.25rem 0px !important;
            font-size: 0.5rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Etalase Penjualan</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Atur harga jual, diskon, dan tampilkan produk ke pembeli — seperti etalase toko online.</p>
      </div>

      <div className="showcase-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="showcase-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconEye /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{live.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Produk Tayang</div></div>
        </div>
        <div className="showcase-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconTag /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{belumLive.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Belum Ditayangkan</div></div>
        </div>
      </div>

      <div className="showcase-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1rem" }}>
        {stokList.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Belum ada produk di gudang. Isi dulu lewat Inventaris & Grading.</div>
        )}
        {stokList.map((s) => {
          const hargaFinal = hargaSetelahDiskon(s.hargaJual, s.diskonPersen);
          return (
            <div key={s.id} className="showcase-main-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem" }}>
              <div className="showcase-badge-container" style={{ display: "flex", justifyContent: "flex-end", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <span style={{ background: s.live ? "#D1FAE5" : "#F1F5F9", color: s.live ? "#065F46" : "#64748B", fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px" }}>{s.live ? "Tayang" : "Draft"}</span>
              </div>
              <div className="showcase-title-text" style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.15rem" }}>{s.nama}</div>
              <div className="showcase-stock-text" style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.6rem" }}>Stok: {s.jumlah} {s.satuan}</div>
              <div className="showcase-price-block" style={{ marginBottom: "0.9rem" }}>
                {s.diskonPersen > 0 ? (
                  <>
                    <span style={{ fontSize: "0.75rem", color: "#94A3B8", textDecoration: "line-through", marginRight: "6px" }}>{formatRupiah(s.hargaJual)}</span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: "#F59E0B" }}>{formatRupiah(hargaFinal)}</span>
                    <span style={{ marginLeft: "6px", fontSize: "0.68rem", fontWeight: 700, background: "#FEE2E2", color: "#991B1B", padding: "0.1rem 0.4rem", borderRadius: "4px" }}>-{s.diskonPersen}%</span>
                  </>
                ) : (
                  <span style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(s.hargaJual)}</span>
                )}
              </div>
              <div className="showcase-actions-row" style={{ display: "flex", gap: "0.4rem" }}>
                <button onClick={() => openEdit(s)} style={{ flex: 1, background: "#FFFBEB", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: "#92400E", fontWeight: 600, cursor: "pointer" }}>Ubah Harga</button>
                <button onClick={() => updateStok(s.id, { live: !s.live })} style={{ flex: 1, background: s.live ? "#F1F5F9" : "#10B981", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: s.live ? "#334155" : "white", fontWeight: 600, cursor: "pointer" }}>{s.live ? "Sembunyikan" : "Tayangkan"}</button>
              </div>
            </div>
          );
        })}
      </div>

      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "380px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1E293B" }}>Ubah Harga — {editItem.nama}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "#94A3B8" }}>Harga beli: {formatRupiah(editItem.hargaBeli)}</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Harga Jual (Rp)</label>
                <input type="number" min="0" value={form.hargaJual} onChange={(e) => setForm({ ...form, hargaJual: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Diskon (%)</label>
                <input type="number" min="0" max="90" value={form.diskonPersen} onChange={(e) => setForm({ ...form, diskonPersen: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
              </div>
              {form.hargaJual && (
                <div style={{ background: "#FFFBEB", borderRadius: "8px", padding: "0.6rem 0.8rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#92400E", fontWeight: 600 }}>Harga akhir pembeli</span>
                  <strong style={{ color: "#1E293B" }}>{formatRupiah(hargaSetelahDiskon(Number(form.hargaJual) || 0, Number(form.diskonPersen) || 0))}</strong>
                </div>
              )}
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}