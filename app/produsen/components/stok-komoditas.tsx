"use client";

import { useMemo, useState, useRef } from "react";
import type { FormEvent, ChangeEvent } from "react";

type StokStatus = "Aman" | "Menipis" | "Habis";

interface Ulasan { pembeli: string; rating: number; komentar: string }
interface StokItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  status: StokStatus;
  kategori: string;
  fotoUrl?: string;
  ulasan: Ulasan[];
}

interface Props {
  stokList: StokItem[];
  addStok: (item: Omit<StokItem, "id" | "status" | "ulasan">) => void;
  updateStok: (id: string, patch: Partial<StokItem>) => void;
  deleteStok: (id: string) => void;
}

const statusStyle: Record<StokStatus, { bg: string; color: string }> = {
  Aman: { bg: "#D1FAE5", color: "#065F46" },
  Menipis: { bg: "#FEF3C7", color: "#92400E" },
  Habis: { bg: "#FEE2E2", color: "#991B1B" },
};

const kategoriOptions = ["Makanan & Minuman", "Kerajinan & Kriya", "Fashion & Tekstil", "Bahan Baku", "Kemasan", "Lainnya"];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPackage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconCamera = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconPlus = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function avgRating(ulasan: Ulasan[]) {
  return ulasan.length ? ulasan.reduce((s, u) => s + u.rating, 0) / ulasan.length : 0;
}

export default function StokKomoditas({ stokList, addStok, updateStok, deleteStok }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailItem, setDetailItem] = useState<StokItem | null>(null);
  const [restockItem, setRestockItem] = useState<StokItem | null>(null);
  const [restockJumlah, setRestockJumlah] = useState(0);
  const [addForm, setAddForm] = useState({ nama: "", jumlah: "", satuan: "kg", hargaSatuan: "", kategori: kategoriOptions[0], deskripsi: "", fotoUrl: "" });
  const fileRef = useRef<HTMLInputElement>(null);

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

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAddForm((f) => ({ ...f, fotoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addForm.nama || !addForm.jumlah) return;
    addStok({ nama: addForm.nama, jumlah: Number(addForm.jumlah), satuan: addForm.satuan, hargaSatuan: Number(addForm.hargaSatuan) || 0, kategori: addForm.kategori, fotoUrl: addForm.fotoUrl || undefined });
    setAddForm({ nama: "", jumlah: "", satuan: "kg", hargaSatuan: "", kategori: kategoriOptions[0], deskripsi: "", fotoUrl: "" });
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
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main {
            padding: 0.5rem 0.25rem !important;
          }
          .header-row-stok {
            display: flex !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-end !important;
            gap: 0.4rem !important;
            margin-bottom: 1.25rem !important;
            width: 100% !important;
            flex-wrap: nowrap !important;
          }
          .header-text-block {
            min-width: 0 !important;
            flex: 1 !important;
          }
          .header-text-block h1 {
            font-size: 1.05rem !important; /* Perkecil judul agar pas */
            margin: 0px !important;
            white-space: nowrap !important;
          }
          .header-text-block p {
            font-size: 0.58rem !important; /* Perkecil deskripsi */
            margin: 0px !important;
            line-height: 1.2 !important;
            white-space: normal !important; /* Mengizinkan teks melipat ke baris baru */
            overflow: visible !important;
            text-overflow: clip !important;
          }
          .btn-add-stok-mobile {
            padding: 0.35rem 0.5rem !important; /* Perkecil ukuran tombol */
            font-size: 0.62rem !important;
            border-radius: 6px !important;
            gap: 3px !important;
            white-space: nowrap !important;
            flex-shrink: 0 !important;
            margin-top: 0px !important;
            align-self: flex-end !important;
          }
          .btn-add-stok-mobile svg {
            width: 8px !important;
            height: 8px !important;
          }
          main > div:nth-of-type(2) {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          main > div:nth-of-type(2) > div {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          main > div:nth-of-type(2) > div > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          main > div:nth-of-type(2) > div > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          main > div:nth-of-type(2) > div > div:last-child > div:first-child {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          main > div:nth-of-type(2) > div > div:last-child > div:last-child {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          main > div:nth-of-type(3) {
            padding: 0.4rem !important;
            border-radius: 8px !important;
            gap: 0.4rem !important;
            margin-bottom: 1rem !important;
          }
          main > div:nth-of-type(3) input {
            padding: 0.35rem 0.5rem 0.35rem 1.75rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          main > div:nth-of-type(3) span {
            left: 0.5rem !important;
          }
          main > div:nth-of-type(3) select {
            padding: 0.35rem 0.5rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          
          .stok-cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .stok-main-card {
            border-radius: 6px !important;
          }
          .stok-main-card > div:first-child {
            height: 60px !important;
          }
          .stok-main-card > div:first-child svg {
            width: 18px !important;
            height: 18px !important;
          }
          .stok-main-card > div:last-child {
            padding: 0.4rem 0.3rem !important;
          }
          .stok-title-container {
            margin-bottom: 0.15rem !important;
          }
          .stok-title-container div:first-child {
            font-size: 0.58rem !important;
            line-height: 1.15 !important;
          }
          .stok-title-container span {
            padding: 0.1rem 0.3rem !important;
            border-radius: 4px !important;
            font-size: 0.45rem !important;
          }
          .stok-meta-text {
            font-size: 0.48rem !important;
            margin-bottom: 0.2rem !important;
          }
          .stok-data-text {
            font-size: 0.52rem !important;
            line-height: 1.2 !important;
            margin-bottom: 0.15rem !important;
          }
          .stok-rating-container {
            font-size: 0.48rem !important;
            gap: 2px !important;
            margin-bottom: 0.4rem !important;
          }
          .stok-rating-container svg {
            width: 8px !important;
            height: 8px !important;
          }
          .stok-actions-row {
            gap: 0.2rem !important;
          }
          .stok-actions-row button {
            padding: 0.25rem 0px !important;
            font-size: 0.5rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div className="header-row-stok" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", width: "100%" }}>
        <div className="header-text-block">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Stok Komoditas</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Kelola persediaan produk dan bahan baku produksi kamu.</p>
        </div>
        <button className="btn-add-stok-mobile" onClick={() => setShowAddModal(true)} style={{ background: "#10B981", color: "white", border: "none", padding: "0.6rem 1.15rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "4px" }}><IconPlus /> Tambah Produk Baru</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconPackage /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{stokList.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Jenis Produk</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalNilaiStok)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Nilai Stok</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalMenipis}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Perlu Restock</div></div>
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

      <div className="stok-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Tidak ada stok yang cocok.</div>
        )}
        {filtered.map((item) => {
          const s = statusStyle[item.status];
          const rating = avgRating(item.ulasan);
          return (
            <div key={item.id} className="stok-main-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
              <div style={{ height: "110px", background: item.fotoUrl ? undefined : "#F0FDF9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.fotoUrl ? <img src={item.fotoUrl} alt={item.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconPackage />}
              </div>
              <div style={{ padding: "0.9rem" }}>
                <div className="stok-title-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B" }}>{item.nama}</div>
                  <span style={{ background: s.bg, color: s.color, padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap" }}>{item.status}</span>
                </div>
                <div className="stok-meta-text" style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.4rem" }}>{item.id} • {item.kategori}</div>
                <div className="stok-data-text" style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.3rem" }}>{item.jumlah} {item.satuan} · {formatRupiah(item.hargaSatuan)}/{item.satuan}</div>
                <div className="stok-rating-container" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#D97706", marginBottom: "0.75rem" }}>
                  <IconStar /> {rating ? rating.toFixed(1) : "0.0"} <span style={{ color: "#94A3B8" }}>({item.ulasan.length})</span>
                </div>
                <div className="stok-actions-row" style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={() => setDetailItem(item)} style={{ flex: 1, background: "#ECFDF5", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Detail</button>
                  <button onClick={() => { setRestockItem(item); setRestockJumlah(0); }} style={{ flex: 1, background: "#EFF6FF", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Restock</button>
                  <button onClick={() => handleDelete(item.id, item.nama)} style={{ background: "#FEE2E2", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", fontSize: "0.76rem", color: "#991B1B", cursor: "pointer" }}>Hapus</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", width: "440px", maxWidth: "100%", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}><IconPackage /> Form Tambah Produk Baru</div>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>FOTO PRODUK</label>
                <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #A7F3D0", background: "#F0FDF9", borderRadius: "10px", height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                  {addForm.fotoUrl ? (
                    <img src={addForm.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <>
                      <span style={{ color: "#10B981" }}><IconCamera /></span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#059669", marginTop: "0.3rem" }}>Klik untuk unggah foto utama</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>NAMA PRODUK *</label>
                <input required value={addForm.nama} onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })} placeholder="Contoh: Keripik Tempe Original" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>HARGA JUAL (RP) *</label>
                  <input required type="number" min="0" value={addForm.hargaSatuan} onChange={(e) => setAddForm({ ...addForm, hargaSatuan: e.target.value })} placeholder="45000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>KUANTITAS STOK *</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input required type="number" min="0" value={addForm.jumlah} onChange={(e) => setAddForm({ ...addForm, jumlah: e.target.value })} placeholder="100" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none" }} />
                    <select value={addForm.satuan} onChange={(e) => setAddForm({ ...addForm, satuan: e.target.value })} style={{ padding: "0.55rem 0.4rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white" }}>
                      <option value="kg">kg</option>
                      <option value="pcs">pcs</option>
                      <option value="liter">liter</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>KATEGORI KOMODITAS</label>
                <select value={addForm.kategori} onChange={(e) => setAddForm({ ...addForm, kategori: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", background: "white" }}>
                  {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.65rem 0.8rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
                  <span style={{ color: "#D97706" }}><IconStar /></span>
                  <div><div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>0.0</div><div style={{ fontSize: "0.68rem", color: "#94A3B8" }}>Belum ada ulasan</div></div>
                </div>
                <span style={{ background: "#ECFDF5", color: "#059669", fontSize: "0.68rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "999px" }}>Otomatis dari pembeli</span>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>DESKRIPSI & CATATAN</label>
                <textarea value={addForm.deskripsi} onChange={(e) => setAddForm({ ...addForm, deskripsi: e.target.value })} placeholder="Tuliskan spesifikasi produk di sini..." rows={3} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tayangkan Produk (Live)</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailItem && (
        <div onClick={() => setDetailItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", width: "420px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ height: "140px", background: detailItem.fotoUrl ? undefined : "#F0FDF9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
              {detailItem.fotoUrl ? <img src={detailItem.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#A7F3D0" }}><IconPackage /></span>}
            </div>
            <div style={{ padding: "1.1rem 1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>{detailItem.nama}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{detailItem.id} • {detailItem.kategori}</div>
                </div>
                <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", margin: "1rem 0" }}>
                <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>STOK</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detailItem.jumlah} {detailItem.satuan}</div>
                </div>
                <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>HARGA</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(detailItem.hargaSatuan)}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Ulasan pembeli ({detailItem.ulasan.length})</div>
              {detailItem.ulasan.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Belum ada ulasan untuk produk ini.</p>
              ) : (
                detailItem.ulasan.map((u, i) => (
                  <div key={i} style={{ padding: "0.5rem 0", borderBottom: i < detailItem.ulasan.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{u.pembeli}</span>
                      <span style={{ color: "#D97706", fontSize: "0.75rem" }}>{"★".repeat(u.rating)}{"☆".repeat(5 - u.rating)}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{u.komentar}</div>
                  </div>
                ))
              )}
              <button onClick={() => setDetailItem(null)} style={{ marginTop: "1.1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {restockItem && (
        <div onClick={() => setRestockItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1E293B" }}>Restock {restockItem.nama}</h2>
              <button onClick={() => setRestockItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Stok saat ini: {restockItem.jumlah} {restockItem.satuan}</p>
            <form onSubmit={handleRestockSubmit}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah tambahan ({restockItem.satuan})</label>
              <input required type="number" min="1" value={restockJumlah || ""} onChange={(e) => setRestockJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", marginBottom: "1rem" }} />
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tambahkan ke Stok</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}