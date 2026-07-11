"use client";

import { useMemo, useState } from "react";

type JenisAkun = "Admin Toko" | "Produsen" | "Supplier";

interface Pendaftar {
  id: string;
  nama: string;
  jenisAkun: JenisAkun;
  lokasi: string;
  tanggal: string;
  status: "Menunggu" | "Disetujui" | "Ditolak";
}

interface Props {
  pendaftarList: Pendaftar[];
  approvePendaftar: (id: string) => void;
  rejectPendaftar: (id: string) => void;
}

const jenisStyle: Record<JenisAkun, { bg: string; color: string }> = {
  "Admin Toko": { bg: "#EFF6FF", color: "#2563EB" },
  Produsen: { bg: "#ECFDF5", color: "#059669" },
  Supplier: { bg: "#FEF3C7", color: "#92400E" },
};
const statusStyle: Record<string, { bg: string; color: string }> = {
  Menunggu: { bg: "#FEF3C7", color: "#92400E" },
  Disetujui: { bg: "#D1FAE5", color: "#065F46" },
  Ditolak: { bg: "#FEE2E2", color: "#991B1B" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUserCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="m17 11 2 2 4-4"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconUserX = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><line x1="17" y1="8" x2="22" y2="13"></line><line x1="22" y1="8" x2="17" y2="13"></line></svg>;

export default function VerifikasiPeran({ pendaftarList, approvePendaftar, rejectPendaftar }: Props) {
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [detail, setDetail] = useState<Pendaftar | null>(null);

  const filtered = useMemo(() => {
    return pendaftarList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.nama.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
      const matchJenis = !jenisFilter || p.jenisAkun === jenisFilter;
      return matchSearch && matchJenis;
    });
  }, [pendaftarList, search, jenisFilter]);

  const totalMenunggu = pendaftarList.filter((p) => p.status === "Menunggu").length;
  const totalDisetujui = pendaftarList.filter((p) => p.status === "Disetujui").length;
  const totalDitolak = pendaftarList.filter((p) => p.status === "Ditolak").length;

  function handleApprove(id: string) {
    approvePendaftar(id);
    setDetail((d) => (d && d.id === id ? { ...d, status: "Disetujui" } : d));
  }
  function handleReject(id: string) {
    rejectPendaftar(id);
    setDetail((d) => (d && d.id === id ? { ...d, status: "Ditolak" } : d));
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Verifikasi & Peran</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Tinjau pendaftar baru dan pastikan peran (Admin Toko / Produsen / Supplier) terisi dengan benar sebelum masuk ekosistem.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalMenunggu}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Menunggu Tinjauan</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconUserCheck /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalDisetujui}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Disetujui</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconUserX /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalDitolak}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Ditolak</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau ID pendaftaran..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Jenis Akun</option>
          <option value="Admin Toko">Admin Toko</option>
          <option value="Produsen">Produsen</option>
          <option value="Supplier">Supplier</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Jenis Akun</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Lokasi</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada pendaftar yang cocok.</td></tr>
            )}
            {filtered.map((p) => {
              const j = jenisStyle[p.jenisAkun];
              const s = statusStyle[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{p.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>
                    <span onClick={() => setDetail(p)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{p.nama}</span>
                  </td>
                  <td style={{ padding: "1rem" }}><span style={{ background: j.bg, color: j.color, padding: "0.2rem 0.55rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.jenisAkun}</span></td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{p.lokasi}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    {p.status === "Menunggu" ? (
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => handleApprove(p.id)} style={{ background: "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Setujui</button>
                        <button onClick={() => handleReject(p.id)} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                      </div>
                    ) : (
                      <button onClick={() => setDetail(p)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Detail</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.id} • Diajukan {detail.tanggal}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              <div><strong style={{ color: "#64748B" }}>Jenis Akun:</strong> <span style={{ color: "#1E293B" }}>{detail.jenisAkun}</span></div>
              <div><strong style={{ color: "#64748B" }}>Lokasi:</strong> <span style={{ color: "#1E293B" }}>{detail.lokasi}</span></div>
              <div><strong style={{ color: "#64748B" }}>Status:</strong> <span style={{ color: "#1E293B" }}>{detail.status}</span></div>
            </div>
            {detail.status === "Menunggu" ? (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => handleReject(detail.id)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                <button onClick={() => handleApprove(detail.id)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#059669", color: "white", fontWeight: 600, cursor: "pointer" }}>Setujui & Buat Akun</button>
              </div>
            ) : (
              <button onClick={() => setDetail(null)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            )}
          </div>
        </div>
      )}
    </main>
  );
}