"use client";

import { useMemo, useState } from "react";
import type { FormEvent } from "react";

interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiPanenHari: number;
}
interface Pembelian {
  id: string;
  produsenId: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  total: number;
  status: "Menunggu" | "Diterima";
  tanggal: string;
}

interface Props {
  produsenList: Produsen[];
  pembelianList: Pembelian[];
  belanjaProdusen: (produsenId: string, item: string, jumlah: number, hargaSatuan: number, satuan: string) => void;
}

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function MarketplaceProdusen({ produsenList, pembelianList, belanjaProdusen }: Props) {
  const [search, setSearch] = useState("");
  const [beliItem, setBeliItem] = useState<Produsen | null>(null);
  const [form, setForm] = useState({ jumlah: "", satuan: "kg", hargaSatuan: "" });

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return produsenList.filter((p) => !q || p.nama.toLowerCase().includes(q) || p.komoditas.toLowerCase().includes(q) || p.lokasi.toLowerCase().includes(q));
  }, [produsenList, search]);

  const pesananMenunggu = pembelianList.filter((p) => p.status === "Menunggu").length;

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!beliItem || !form.jumlah || !form.hargaSatuan) return;
    belanjaProdusen(beliItem.id, beliItem.komoditas, Number(form.jumlah), Number(form.hargaSatuan), form.satuan);
    setForm({ jumlah: "", satuan: "kg", hargaSatuan: "" });
    setBeliItem(null);
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
          .warn-banner-mobile {
            padding: 0.4rem 0.6rem !important;
            border-radius: 6px !important;
            margin-bottom: 0.75rem !important;
            gap: 0.4rem !important;
          }
          .warn-banner-mobile svg {
            width: 14px !important;
            height: 14px !important;
          }
          .warn-banner-mobile span {
            font-size: 0.58rem !important;
            line-height: 1.2 !important;
          }
          .search-wrapper-mobile {
            max-width: 100% !important;
            margin-bottom: 1rem !important;
          }
          .search-wrapper-mobile input {
            padding: 0.35rem 0.5rem 0.35rem 1.75rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          .search-wrapper-mobile span {
            left: 0.5rem !important;
          }
          
          /* FORCE 3 KOLOM GRID MENYAMPING DI HP */
          .marketplace-cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .marketplace-main-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
          }
          .marketplace-main-card > div:first-child {
            gap: 0.4rem !important;
            margin-bottom: 0.4rem !important;
          }
          .marketplace-icon-box {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px !important;
          }
          .marketplace-icon-box svg {
            width: 14px !important;
            height: 14px !important;
          }
          .marketplace-title-text {
            font-size: 0.58rem !important;
            line-height: 1.15 !important;
          }
          .marketplace-location-text {
            font-size: 0.48rem !important;
            gap: 2px !important;
          }
          .marketplace-location-text svg {
            width: 8px !important;
            height: 8px !important;
          }
          .marketplace-commodity-text {
            font-size: 0.52rem !important;
            margin-bottom: 0.15rem !important;
            line-height: 1.2 !important;
          }
          .marketplace-harvest-text {
            font-size: 0.48rem !important;
            margin-bottom: 0.4rem !important;
          }
          .marketplace-main-card button {
            padding: 0.3rem 0px !important;
            font-size: 0.55rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Marketplace Produsen</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Lihat produsen binaan, cek komoditas yang tersedia, dan beli bahan baku langsung lewat sistem.</p>
      </div>

      {pesananMenunggu > 0 && (
        <div className="warn-banner-mobile" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ color: "#D97706" }}><IconClock /></span>
          <span style={{ fontSize: "0.85rem", color: "#92400E" }}><strong>{pesananMenunggu} pembelian</strong> menunggu konfirmasi penerimaan barang. Cek di menu Inventaris & Grading.</span>
        </div>
      )}

      <div className="search-wrapper-mobile" style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari produsen atau komoditas..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
      </div>

      <div className="marketplace-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Tidak ada produsen yang cocok.</div>
        )}
        {filtered.map((p) => (
          <div key={p.id} className="marketplace-main-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
              <div className="marketplace-icon-box" style={{ background: "#FEF3C7", color: "#D97706", width: "38px", height: "38px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconStore /></div>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="marketplace-title-text" style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B" }}>{p.nama}</div>
                <div className="marketplace-location-text" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.72rem", color: "#94A3B8" }}><IconMapPin /> {p.lokasi}</div>
              </div>
            </div>
            <div className="marketplace-commodity-text" style={{ fontSize: "0.82rem", color: "#334155", marginBottom: "0.4rem" }}>Komoditas: <strong>{p.komoditas}</strong></div>
            <div className="marketplace-harvest-text" style={{ fontSize: "0.75rem", color: p.estimasiPanenHari <= 7 ? "#D97706" : "#64748B", marginBottom: "0.9rem" }}>
              {p.estimasiPanenHari <= 7 ? `⚡ Panen ${p.estimasiPanenHari} hari` : `Estimasi panen ${p.estimasiPanenHari} hari`}
            </div>
            <button onClick={() => setBeliItem(p)} style={{ width: "100%", background: "#F59E0B", color: "white", border: "none", padding: "0.55rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Beli Bahan Baku</button>
          </div>
        ))}
      </div>

      {beliItem && (
        <div onClick={() => setBeliItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Beli dari {beliItem.nama}</h2>
              <button onClick={() => setBeliItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Komoditas: {beliItem.komoditas}</p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah *</label>
                  <input required type="number" min="1" value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
                </div>
                <div style={{ width: "100px" }}>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Satuan</label>
                  <select value={form.satuan} onChange={(e) => setForm({ ...form, satuan: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.4rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white" }}>
                    <option value="kg">kg</option>
                    <option value="karung">karung</option>
                    <option value="pcs">pcs</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Harga Sepakat per Satuan (Rp) *</label>
                <input required type="number" min="0" value={form.hargaSatuan} onChange={(e) => setForm({ ...form, hargaSatuan: e.target.value })} placeholder="Contoh: 32000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
              </div>
              {form.jumlah && form.hargaSatuan && (
                <div style={{ background: "#FFFBEB", borderRadius: "8px", padding: "0.6rem 0.8rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#92400E", fontWeight: 600 }}>Total Pembelian</span>
                  <strong style={{ color: "#1E293B" }}>{formatRupiah(Number(form.jumlah) * Number(form.hargaSatuan))}</strong>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                <button type="button" onClick={() => setBeliItem(null)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Kirim Pesanan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}