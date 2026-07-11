"use client";

import { useMemo, useState, FormEvent } from "react";

type StokStatus = "Aman" | "Menipis" | "Habis";

interface StokItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  status: StokStatus;
}

interface Props {
  stokList: StokItem[];
  addStok: (item: Omit<StokItem, "id" | "status">) => void;
  updateStok: (id: string, patch: Partial<StokItem>) => void;
  deleteStok: (id: string) => void;
}

const statusStyle: Record<StokStatus, { bg: string; color: string }> = {
  Aman: { bg: "#D1FAE5", color: "#065F46" },
  Menipis: { bg: "#FEF3C7", color: "#92400E" },
  Habis: { bg: "#FEE2E2", color: "#991B1B" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPackage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function StokKomoditas({ stokList, addStok, updateStok, deleteStok }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [restockItem, setRestockItem] = useState<StokItem | null>(null);
  const [restockJumlah, setRestockJumlah] = useState(0);
  const [addForm, setAddForm] = useState({ nama: "", jumlah: "", satuan: "kg", hargaSatuan: "" });

  const filtered = useMemo(() => {
    return stokList.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || s.nama.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [stokList, search, statusFilter]);

  const totalNilaiStok = stokList.reduce((s, x) => s + x.jumlah * x.hargaSatuan, 0);
  const totalMenipis = stokList.filter((s) => s.status !== "Aman").length;

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addForm.nama || !addForm.jumlah) return;
    addStok({ nama: addForm.nama, jumlah: Number(addForm.jumlah), satuan: addForm.satuan, hargaSatuan: Number(addForm.hargaSatuan) || 0 });
    setAddForm({ nama: "", jumlah: "", satuan: "kg", hargaSatuan: "" });
    setShowAddModal(false);
  }

  function handleRestockSubmit(e: FormEvent) {
    e.preventDefault();
    if (!restockItem || restockJumlah <= 0) return;
    updateStok(restockItem.id, { jumlah: restockItem.jumlah + restockJumlah });
    setRestockItem(null);
    setRestockJumlah(0);
  }

  function handleDelete(id: string, nama: string) {
    if (confirm(`Hapus stok "${nama}"?`)) deleteStok(id);
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Stok Komoditas</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola persediaan produk dan bahan baku produksi kamu.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Tambah Stok Baru</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconPackage /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{stokList.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Jenis Produk</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalNilaiStok)}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Nilai Stok</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalMenipis}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Perlu Restock</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produk atau kode..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Aman">Aman</option>
          <option value="Menipis">Menipis</option>
          <option value="Habis">Habis</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>Kode</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Produk</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Jumlah</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Harga Satuan</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada stok yang cocok.</td></tr>
            )}
            {filtered.map((item) => {
              const s = statusStyle[item.status];
              return (
                <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{item.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{item.nama}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{item.jumlah} {item.satuan}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{formatRupiah(item.hargaSatuan)}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{item.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => { setRestockItem(item); setRestockJumlah(0); }} style={{ background: "#EFF6FF", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Restock</button>
                    <button onClick={() => handleDelete(item.id, item.nama)} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#991B1B", cursor: "pointer" }}>Hapus</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Tambah Stok Baru</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Produk *</label>
                <input required value={addForm.nama} onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })} placeholder="Contoh: Keripik Tempe BBQ" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah *</label>
                  <input required type="number" min="0" value={addForm.jumlah} onChange={(e) => setAddForm({ ...addForm, jumlah: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
                </div>
                <div style={{ width: "100px" }}>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Satuan</label>
                  <select value={addForm.satuan} onChange={(e) => setAddForm({ ...addForm, satuan: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.5rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                    <option value="kg">kg</option>
                    <option value="pcs">pcs</option>
                    <option value="liter">liter</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Harga Satuan (Rp)</label>
                <input type="number" min="0" value={addForm.hargaSatuan} onChange={(e) => setAddForm({ ...addForm, hargaSatuan: e.target.value })} placeholder="Contoh: 45000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {restockItem && (
        <div onClick={() => setRestockItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Restock {restockItem.nama}</h2>
              <button onClick={() => setRestockItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Stok saat ini: {restockItem.jumlah} {restockItem.satuan}</p>
            <form onSubmit={handleRestockSubmit}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah tambahan ({restockItem.satuan})</label>
              <input required type="number" min="1" value={restockJumlah || ""} onChange={(e) => setRestockJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", marginBottom: "1rem" }} />
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tambahkan ke Stok</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}