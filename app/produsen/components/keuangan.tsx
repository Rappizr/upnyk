"use client";

import { useMemo, useState, FormEvent } from "react";

interface Pesanan {
  id: string;
  pembeli: string;
  total: number;
  status: string;
  tanggal: string;
}

interface Pengeluaran {
  id: string;
  keterangan: string;
  nominal: number;
  tanggal: string;
  kategori: string;
}

interface Props {
  pesananList: Pesanan[];
  pengeluaranList: Pengeluaran[];
  addPengeluaran: (entry: Omit<Pengeluaran, "id" | "tanggal">) => void;
}

const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconArrowUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconArrowDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconBanknote = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="6" width="20" height="12" rx="2"></rect><circle cx="12" cy="12" r="2"></circle><path d="M6 12h.01M18 12h.01"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function Keuangan({ pesananList, pengeluaranList, addPengeluaran }: Props) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showTarikModal, setShowTarikModal] = useState(false);
  const [form, setForm] = useState({ keterangan: "", nominal: "", kategori: "Bahan Baku" });
  const [tarikForm, setTarikForm] = useState({ nominal: "", metode: "Transfer Bank", rekening: "" });
  const [tarikError, setTarikError] = useState("");

  const pemasukan = useMemo(
    () => pesananList.filter((p) => p.status === "Selesai").map((p) => ({ id: p.id, keterangan: `Penjualan — ${p.pembeli}`, nominal: p.total, tanggal: p.tanggal, tipe: "masuk" as const })),
    [pesananList]
  );
  const pengeluaran = useMemo(() => pengeluaranList.map((p) => ({ ...p, tipe: "keluar" as const })), [pengeluaranList]);

  const riwayat = useMemo(() => [...pemasukan, ...pengeluaran].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)), [pemasukan, pengeluaran]);

  const totalMasuk = pemasukan.reduce((s, x) => s + x.nominal, 0);
  const totalKeluar = pengeluaran.reduce((s, x) => s + x.nominal, 0);
  const saldo = totalMasuk - totalKeluar;

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.keterangan || !form.nominal) return;
    addPengeluaran({ keterangan: form.keterangan, nominal: Number(form.nominal), kategori: form.kategori });
    setForm({ keterangan: "", nominal: "", kategori: "Bahan Baku" });
    setShowAddModal(false);
  }

  function handleTarikSubmit(e: FormEvent) {
    e.preventDefault();
    const nominal = Number(tarikForm.nominal);
    if (!nominal || nominal <= 0) return;
    if (nominal > saldo) {
      setTarikError(`Nominal melebihi saldo tersedia (${formatRupiah(saldo)}).`);
      return;
    }
    const tujuan = tarikForm.metode === "Transfer Bank" ? tarikForm.rekening || "rekening terdaftar" : "tunai di mitra terdekat";
    addPengeluaran({ keterangan: `Penarikan saldo — ${tarikForm.metode} (${tujuan})`, nominal, kategori: "Penarikan Tunai" });
    setTarikForm({ nominal: "", metode: "Transfer Bank", rekening: "" });
    setTarikError("");
    setShowTarikModal(false);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Keuangan</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau arus kas — pemasukan otomatis dari penjualan selesai, pengeluaran dicatat manual.</p>
        </div>
        <div style={{ display: "flex", gap: "0.6rem" }}>
          <button onClick={() => setShowTarikModal(true)} style={{ background: "#10B981", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>Tarik Tunai</button>
          <button onClick={() => setShowAddModal(true)} style={{ background: "#EF4444", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Catat Pengeluaran</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#10B981", padding: "1.25rem", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
              <div style={{ background: "rgba(255,255,255,.2)", color: "#fff", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconWallet /></div>
              <span style={{ fontSize: "0.8rem", color: "rgba(255,255,255,.85)", fontWeight: 600 }}>Saldo Saat Ini</span>
            </div>
            <button onClick={() => setShowTarikModal(true)} style={{ display: "flex", alignItems: "center", gap: "4px", background: "rgba(255,255,255,.2)", border: "none", color: "white", fontSize: "0.72rem", fontWeight: 600, padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}><IconBanknote /> Tarik</button>
          </div>
          <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{formatRupiah(saldo)}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconArrowUp /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Pemasukan</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalMasuk)}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconArrowDown /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Pengeluaran</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalKeluar)}</div>
        </div>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <h3 style={{ margin: 0, padding: "1.1rem 1.1rem 0.75rem", fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Riwayat Transaksi</h3>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "550px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "0.85rem 1.1rem", color: "#475569" }}>Tanggal</th>
              <th style={{ padding: "0.85rem 1.1rem", color: "#475569" }}>Keterangan</th>
              <th style={{ padding: "0.85rem 1.1rem", color: "#475569", textAlign: "right" }}>Nominal</th>
            </tr>
          </thead>
          <tbody>
            {riwayat.length === 0 && (
              <tr><td colSpan={3} style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", textAlign: "center", color: "#94A3B8" }}>Belum ada transaksi.</td></tr>
            )}
            {riwayat.map((r) => (
              <tr key={r.id + r.tipe} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "0.85rem 1.1rem", color: "#64748B" }}>{r.tanggal}</td>
                <td style={{ padding: "0.85rem 1.1rem", color: "#1E293B", fontWeight: 500 }}>{r.keterangan}</td>
                <td style={{ padding: "0.85rem 1.1rem", textAlign: "right", fontWeight: 700, color: r.tipe === "masuk" ? "#10B981" : "#EF4444" }}>{r.tipe === "masuk" ? "+ " : "− "}{formatRupiah(r.nominal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Catat Pengeluaran</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Keterangan *</label>
                <input required value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Contoh: Pembelian minyak goreng" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nominal (Rp) *</label>
                <input required type="number" min="0" value={form.nominal} onChange={(e) => setForm({ ...form, nominal: e.target.value })} placeholder="Contoh: 250000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Kategori</label>
                <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="Bahan Baku">Bahan Baku</option>
                  <option value="Kemasan">Kemasan</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#EF4444", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showTarikModal && (
        <div onClick={() => { setShowTarikModal(false); setTarikError(""); }} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Tarik Saldo</h2>
              <button onClick={() => { setShowTarikModal(false); setTarikError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Saldo tersedia: <strong style={{ color: "#1E293B" }}>{formatRupiah(saldo)}</strong></p>
            <form onSubmit={handleTarikSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nominal Penarikan (Rp) *</label>
                <input required type="number" min="1" max={saldo} value={tarikForm.nominal} onChange={(e) => { setTarikForm({ ...tarikForm, nominal: e.target.value }); setTarikError(""); }} placeholder="Contoh: 1000000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Metode Pencairan</label>
                <select value={tarikForm.metode} onChange={(e) => setTarikForm({ ...tarikForm, metode: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Tunai di Mitra Terdekat">Tunai di Mitra Terdekat</option>
                </select>
              </div>
              {tarikForm.metode === "Transfer Bank" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>No. Rekening Tujuan</label>
                  <input value={tarikForm.rekening} onChange={(e) => setTarikForm({ ...tarikForm, rekening: e.target.value })} placeholder="Contoh: BCA 1234567890 a.n. Baihaqi" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
                </div>
              )}
              {tarikError && <div style={{ background: "#FEE2E2", color: "#991B1B", fontSize: "0.8rem", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>{tarikError}</div>}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => { setShowTarikModal(false); setTarikError(""); }} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Konfirmasi Penarikan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}