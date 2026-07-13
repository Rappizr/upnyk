"use client";

import { useMemo, useState } from "react";

type KategoriPengaduan = "Manipulasi Harga" | "Kendala Teknis" | "Sengketa Transaksi" | "Lainnya";

interface Pengaduan {
  id: string;
  pelapor: string;
  role: string;
  kontak: string;
  kategori: KategoriPengaduan;
  deskripsi: string;
  status: "Baru" | "Diproses" | "Selesai";
  tanggal: string;
}

interface Props {
  pengaduanList: Pengaduan[];
  updateStatusPengaduan: (id: string, status: Pengaduan["status"]) => void;
}

const statusStyle: Record<Pengaduan["status"], { bg: string; color: string }> = {
  Baru: { bg: "#FEF3C7", color: "#92400E" },
  Diproses: { bg: "#E0F2FE", color: "#075985" },
  Selesai: { bg: "#D1FAE5", color: "#065F46" },
};
const kategoriStyle: Record<KategoriPengaduan, { bg: string; color: string }> = {
  "Manipulasi Harga": { bg: "#FEE2E2", color: "#991B1B" },
  "Kendala Teknis": { bg: "#EFF6FF", color: "#2563EB" },
  "Sengketa Transaksi": { bg: "#FEF3C7", color: "#92400E" },
  Lainnya: { bg: "#F1F5F9", color: "#475569" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconFlag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
const IconAlertTriangle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;

export default function PengaduanPage({ pengaduanList, updateStatusPengaduan }: Props) {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Pengaduan | null>(null);

  const filtered = useMemo(() => {
    return pengaduanList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.pelapor.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.deskripsi.toLowerCase().includes(q);
      const matchKategori = !kategoriFilter || p.kategori === kategoriFilter;
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchKategori && matchStatus;
    });
  }, [pengaduanList, search, kategoriFilter, statusFilter]);

  const totalBaru = pengaduanList.filter((p) => p.status === "Baru").length;
  const totalManipulasiHarga = pengaduanList.filter((p) => p.kategori === "Manipulasi Harga" && p.status !== "Selesai").length;
  const totalSelesai = pengaduanList.filter((p) => p.status === "Selesai").length;

  function updateDetail(id: string, status: Pengaduan["status"]) {
    setDetail((d) => (d && d.id === id ? { ...d, status } : d));
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Pengaduan</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Tiket bantuan dari Pusat Bantuan pengguna — termasuk laporan indikasi manipulasi Indeks Harga Adil oleh Admin Toko.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconFlag /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalBaru}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Tiket Baru</div></div>
        </div>
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlertTriangle /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#991B1B" }}>{totalManipulasiHarga}</div><div style={{ fontSize: "0.78rem", color: "#991B1B" }}>Laporan Manipulasi Harga</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalSelesai}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Selesai Ditangani</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pelapor, ID, atau isi aduan..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Kategori</option>
          <option value="Manipulasi Harga">Manipulasi Harga</option>
          <option value="Kendala Teknis">Kendala Teknis</option>
          <option value="Sengketa Transaksi">Sengketa Transaksi</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Baru">Baru</option>
          <option value="Diproses">Diproses</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada tiket yang cocok.</div>
        )}
        {filtered.map((p) => {
          const s = statusStyle[p.status];
          const k = kategoriStyle[p.kategori];
          return (
            <div key={p.id} onClick={() => setDetail(p)} style={{ background: "white", border: p.kategori === "Manipulasi Harga" ? "1px solid #FCA5A5" : "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem 1.25rem", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "1rem", flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.35rem", flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.9rem" }}>{p.id}</span>
                    <span style={{ fontSize: "0.8rem", color: "#64748B" }}>• {p.pelapor} ({p.role})</span>
                    <span style={{ background: k.bg, color: k.color, fontSize: "0.68rem", fontWeight: 700, padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{p.kategori}</span>
                  </div>
                  <p style={{ margin: 0, fontSize: "0.82rem", color: "#334155", lineHeight: 1.5 }}>{p.deskripsi}</p>
                </div>
                <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px", whiteSpace: "nowrap" }}>{p.status}</span>
              </div>
            </div>
          );
        })}
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "460px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.tanggal}</p>

            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
              <span style={{ background: kategoriStyle[detail.kategori].bg, color: kategoriStyle[detail.kategori].color, fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px" }}>{detail.kategori}</span>
              <span style={{ background: statusStyle[detail.status].bg, color: statusStyle[detail.status].color, fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px" }}>{detail.status}</span>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>PELAPOR</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>{detail.pelapor}</div>
                <div style={{ fontSize: "0.72rem", color: "#64748B" }}>{detail.role}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>KONTAK</div>
                <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B" }}>{detail.kontak}</div>
              </div>
            </div>

            <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700, marginBottom: "0.3rem" }}>DESKRIPSI ADUAN</div>
            <p style={{ fontSize: "0.85rem", color: "#334155", background: "#F8FAFC", padding: "0.75rem", borderRadius: "8px", lineHeight: 1.6, marginBottom: "1.25rem" }}>{detail.deskripsi}</p>

            {detail.status !== "Selesai" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                {detail.status === "Baru" && (
                  <button onClick={() => { updateStatusPengaduan(detail.id, "Diproses"); updateDetail(detail.id, "Diproses"); }} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Diproses</button>
                )}
                <button onClick={() => { updateStatusPengaduan(detail.id, "Selesai"); updateDetail(detail.id, "Selesai"); }} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Selesai</button>
              </div>
            )}
            {detail.status === "Selesai" && (
              <div style={{ textAlign: "center", padding: "0.6rem", background: "#ECFDF5", borderRadius: "8px", color: "#059669", fontWeight: 600, fontSize: "0.85rem" }}>Aduan sudah ditangani</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}