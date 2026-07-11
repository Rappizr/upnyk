"use client";

import { useMemo, useState, FormEvent } from "react";

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
  stokList: StokToko[];
  pembelianList: Pembelian[];
  terimaPembelian: (id: string, grade: Grade) => void;
  updateStok: (id: string, patch: Partial<StokToko>) => void;
}

const gradeStyle: Record<Grade, { bg: string; color: string }> = {
  A: { bg: "#D1FAE5", color: "#065F46" },
  B: { bg: "#FEF3C7", color: "#92400E" },
  C: { bg: "#FEE2E2", color: "#991B1B" },
  "Belum Dinilai": { bg: "#F1F5F9", color: "#475569" },
};

const IconBox = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconTruckIn = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function InventarisGrading({ stokList, pembelianList, terimaPembelian, updateStok }: Props) {
  const [search, setSearch] = useState("");
  const [gradingItem, setGradingItem] = useState<Pembelian | null>(null);
  const [gradePilih, setGradePilih] = useState<Grade>("A");
  const [editItem, setEditItem] = useState<StokToko | null>(null);
  const [editJumlah, setEditJumlah] = useState(0);

  const menungguGrading = pembelianList.filter((p) => p.status === "Menunggu");
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stokList.filter((s) => !q || s.nama.toLowerCase().includes(q) || s.asalProdusen.toLowerCase().includes(q));
  }, [stokList, search]);

  const totalNilaiStok = stokList.reduce((s, x) => s + x.jumlah * x.hargaBeli, 0);

  function handleGradingSubmit(e: FormEvent) {
    e.preventDefault();
    if (!gradingItem) return;
    terimaPembelian(gradingItem.id, gradePilih);
    setGradingItem(null);
    setGradePilih("A");
  }

  function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    updateStok(editItem.id, { jumlah: editJumlah });
    setEditItem(null);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Inventaris & Grading</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Kelola stok gudang dan nilai kualitas barang masuk dari produsen (Grade A/B/C).</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBox /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{stokList.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Jenis Produk Digudang</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalNilaiStok)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Nilai Stok</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconTruckIn /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{menungguGrading.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Barang Menunggu Grading</div></div>
        </div>
      </div>

      {menungguGrading.length > 0 && (
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.9rem 0", fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Barang Masuk — Perlu Grading</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {menungguGrading.map((p) => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", background: "#F8FAFC", borderRadius: "8px", padding: "0.7rem 0.9rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <div><div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>{p.item} — {p.jumlah} {p.satuan}</div><div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Dari {p.produsen} • {p.tanggal}</div></div>
                <button onClick={() => { setGradingItem(p); setGradePilih("A"); }} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.78rem", fontWeight: 600, padding: "0.45rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}>Terima & Grading</button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produk atau produsen..." style={{ width: "100%", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Produk</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Asal Produsen</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Jumlah</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Harga Beli</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Grade</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada stok yang cocok.</td></tr>
            )}
            {filtered.map((s) => {
              const g = gradeStyle[s.grade];
              return (
                <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{s.asalProdusen}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{s.jumlah} {s.satuan}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{formatRupiah(s.hargaBeli)}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: g.bg, color: g.color, padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 700 }}>Grade {s.grade}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button onClick={() => { setEditItem(s); setEditJumlah(s.jumlah); }} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Sesuaikan Stok</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {gradingItem && (
        <div onClick={() => setGradingItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Terima & Nilai Kualitas</h2>
              <button onClick={() => setGradingItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{gradingItem.item} — {gradingItem.jumlah} {gradingItem.satuan} dari {gradingItem.produsen}</p>
            <form onSubmit={handleGradingSubmit}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.5rem" }}>Pilih Grade Kualitas</label>
              <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.2rem" }}>
                {(["A", "B", "C"] as Grade[]).map((g) => (
                  <button key={g} type="button" onClick={() => setGradePilih(g)} style={{ flex: 1, padding: "0.7rem", borderRadius: "8px", border: gradePilih === g ? "2px solid #F59E0B" : "1px solid #E2E8F0", background: gradePilih === g ? "#FFFBEB" : "white", color: gradePilih === g ? "#92400E" : "#64748B", fontWeight: 700, cursor: "pointer" }}>{g}</button>
                ))}
              </div>
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Masukkan ke Gudang</button>
            </form>
          </div>
        </div>
      )}

      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1E293B" }}>Sesuaikan Stok {editItem.nama}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", margin: "1rem 0 0.3rem" }}>Jumlah Stok Saat Ini ({editItem.satuan})</label>
              <input required type="number" min="0" value={editJumlah} onChange={(e) => setEditJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", marginBottom: "1rem" }} />
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}