"use client";

import { useMemo, useState, FormEvent } from "react";

interface KategoriItem {
  id: string;
  nama: string;
  totalItem: string;
  status: "Aktif" | "Nonaktif";
  anggota: string[];
  pertumbuhan: number;
}

const initialData: KategoriItem[] = [
  { id: "CAT-B01", nama: "Petani Kelompok Tani", totalItem: "140 Mitra", status: "Aktif", pertumbuhan: 9, anggota: ["Gapoktan Sumber Makmur", "Kelompok Tani Sejahtera"] },
  { id: "CAT-B02", nama: "Pengepul Skala Besar", totalItem: "85 Mitra", status: "Aktif", pertumbuhan: 2, anggota: ["Pengepul Kedelai Lokal", "Pengepul Cabai Garut"] },
  { id: "CAT-B03", nama: "Distributor Resmi Pabrik", totalItem: "93 Mitra", status: "Aktif", pertumbuhan: -1, anggota: ["Distributor Pupuk Nasional"] },
];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLayers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IconTrend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default function KategoriSupplierPage() {
  const [kategoriList, setKategoriList] = useState<KategoriItem[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [detailItem, setDetailItem] = useState<KategoriItem | null>(null);
  const [editItem, setEditItem] = useState<KategoriItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ nama: "", totalItem: "", status: "Aktif" as "Aktif" | "Nonaktif" });

  const filtered = useMemo(() => {
    return kategoriList.filter((k) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || k.nama.toLowerCase().includes(q) || k.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || k.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [kategoriList, search, statusFilter]);

  const totalAnggota = useMemo(() => kategoriList.reduce((sum, k) => sum + k.anggota.length, 0), [kategoriList]);
  const totalAktif = useMemo(() => kategoriList.filter((k) => k.status === "Aktif").length, [kategoriList]);

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addForm.nama) return;
    const nextNumber = kategoriList.length + 1;
    const id = `CAT-B${String(nextNumber).padStart(2, "0")}`;
    setKategoriList((prev) => [{ id, nama: addForm.nama, totalItem: addForm.totalItem || "0 Mitra", status: addForm.status, pertumbuhan: 0, anggota: [] }, ...prev]);
    setAddForm({ nama: "", totalItem: "", status: "Aktif" });
    setShowAddModal(false);
  }

  function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    setKategoriList((prev) => prev.map((k) => (k.id === editItem.id ? editItem : k)));
    setEditItem(null);
  }

  function handleDelete(id: string, nama: string) {
    if (confirm(`Hapus kategori "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) {
      setKategoriList((prev) => prev.filter((k) => k.id !== id));
    }
  }

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Kategori Produsen & Supplier</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola klasifikasi rantai pasok dan awasi mitra penyuplai bahan baku ekosistem.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Tambah Kategori Supplier</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconLayers /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{kategoriList.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Kategori</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Kategori Aktif</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#F59E0B", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconTrend /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAnggota}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Mitra Terpantau</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama kategori atau kode..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Nonaktif">Nonaktif</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>Kode</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Kategori</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Total Terhubung</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Tren</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada kategori yang cocok.</td></tr>
            )}
            {filtered.map((item) => (
              <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{item.id}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>
                  <span onClick={() => setDetailItem(item)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#CBD5E1" }}>{item.nama}</span>
                </td>
                <td style={{ padding: "1rem", color: "#475569" }}>{item.totalItem}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: item.pertumbuhan >= 0 ? "#10B981" : "#EF4444" }}>{item.pertumbuhan >= 0 ? "▲" : "▼"} {Math.abs(item.pertumbuhan)}%</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ background: item.status === "Aktif" ? "#D1FAE5" : "#F1F5F9", color: item.status === "Aktif" ? "#065F46" : "#475569", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{item.status}</span>
                </td>
                <td style={{ padding: "1rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setDetailItem(item)} style={{ background: "#EFF6FF", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Detail</button>
                  <button onClick={() => setEditItem(item)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", cursor: "pointer" }}>Edit</button>
                  <button onClick={() => handleDelete(item.id, item.nama)} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#991B1B", cursor: "pointer" }}>Hapus</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {detailItem && (
        <div onClick={() => setDetailItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "480px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detailItem.nama}</h2>
              <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detailItem.id}</p>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Total Terhubung</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detailItem.totalItem}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Tren Bulan Ini</div>
                <div style={{ fontSize: "1.1rem", fontWeight: 700, color: detailItem.pertumbuhan >= 0 ? "#10B981" : "#EF4444" }}>{detailItem.pertumbuhan >= 0 ? "▲" : "▼"} {Math.abs(detailItem.pertumbuhan)}%</div>
              </div>
            </div>

            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Mitra dalam kategori ini ({detailItem.anggota.length})</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
              {detailItem.anggota.length === 0 && <p style={{ fontSize: "0.85rem", color: "#94A3B8" }}>Belum ada mitra terhubung ke kategori ini.</p>}
              {detailItem.anggota.map((nama, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.8rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem" }}>
                  <span style={{ color: "#334155" }}>{nama}</span>
                  <span style={{ fontSize: "0.7rem", color: "#10B981", fontWeight: 600 }}>● Aktif</span>
                </div>
              ))}
            </div>

            <button onClick={() => setDetailItem(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}

      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Edit Kategori</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleEditSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Kategori</label>
                <input required value={editItem.nama} onChange={(e) => setEditItem({ ...editItem, nama: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Total Terhubung</label>
                <input value={editItem.totalItem} onChange={(e) => setEditItem({ ...editItem, totalItem: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Status</label>
                <select value={editItem.status} onChange={(e) => setEditItem({ ...editItem, status: e.target.value as "Aktif" | "Nonaktif" })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="Aktif">Aktif</option>
                  <option value="Nonaktif">Nonaktif</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setEditItem(null)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Tambah Kategori Supplier</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Kategori *</label>
                <input required value={addForm.nama} onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })} placeholder="Contoh: Koperasi Nelayan" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Total Terhubung (opsional)</label>
                <input value={addForm.totalItem} onChange={(e) => setAddForm({ ...addForm, totalItem: e.target.value })} placeholder="Contoh: 0 Mitra" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
