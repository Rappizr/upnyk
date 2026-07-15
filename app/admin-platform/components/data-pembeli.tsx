"use client";

import { useMemo, useState } from "react";

interface Pembeli {
  id: string;
  namaLengkap: string;
  alamat: string;
  telepon: string;
  email: string;
  status: "Aktif" | "Nonaktif";
}

interface Props {
  pembeliList: Pembeli[];
  toggleSuspendPembeli: (id: string) => void;
}

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUsers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;
const IconBan = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;
const IconMail = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconPhone = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

export default function DataPembeli({ pembeliList = [], toggleSuspendPembeli }: Props) {
  const [search, setSearch] = useState("");
  const [detail, setDetail] = useState<Pembeli | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return (pembeliList || []).filter((b) => !q || b.namaLengkap?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q) || b.email?.toLowerCase().includes(q));
  }, [pembeliList, search]);

  const totalAktif = useMemo(() => (pembeliList || []).filter((b) => b.status === "Aktif").length, [pembeliList]);
  const totalSuspended = useMemo(() => (pembeliList || []).filter((b) => b.status === "Nonaktif").length, [pembeliList]);

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
          .buyer-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .buyer-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .buyer-stat-card > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          .buyer-stat-card > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .buyer-stat-card > div:last-child > div:first-child {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .buyer-stat-card > div:last-child > div:last-child {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          .search-wrapper-mobile {
            max-width: 100% !important;
            margin-bottom: 1rem !important;
          }
          .search-wrapper-mobile input {
            padding: 0.35rem 0.5rem !important;
            padding-left: 1.75rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          .buyer-table-container th, .buyer-table-container td {
            padding: 0.5rem 0.4rem !important;
            font-size: 0.58rem !important;
          }
          .buyer-table-container table {
            min-width: auto !important;
            width: 100% !important;
          }
          .buyer-table-container button {
            padding: 0.25rem 0.4rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
          .buyer-table-container span {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Data Pembeli</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Daftar akun pembeli terdaftar di ekosistem PasarNusa.</p>
      </div>

      <div className="buyer-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="buyer-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconUsers /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Pembeli Aktif</div></div>
        </div>
        <div className="buyer-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBan /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalSuspended}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Ditangguhkan</div></div>
        </div>
      </div>

      <div className="search-wrapper-mobile" style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama atau email pembeli..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
      </div>

      <div className="buyer-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "650px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Lengkap</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Email</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada pembeli yang cocok.</td></tr>
              )}
              {filtered.map((b) => (
                <tr key={b.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{b.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>
                    <span onClick={() => setDetail(b)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{b.namaLengkap}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{b.email}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ background: b.status === "Aktif" ? "#D1FAE5" : "#FEE2E2", color: b.status === "Aktif" ? "#065F46" : "#991B1B", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{b.status === "Aktif" ? "Aktif" : "Suspended"}</span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                      <button onClick={() => toggleSuspendPembeli(b.id)} style={{ background: b.status === "Aktif" ? "#FEE2E2" : "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: b.status === "Aktif" ? "#991B1B" : "#059669", fontWeight: 600, cursor: "pointer" }}>{b.status === "Aktif" ? "Suspend" : "Aktifkan"}</button>
                      <button onClick={() => setDetail(b)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Detail</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.namaLengkap}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.id}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: "#2563EB", background: "#EFF6FF", width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMapPin /></span>
                <div style={{ fontSize: "0.85rem", color: "#334155" }}>{detail.alamat}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: "#2563EB", background: "#EFF6FF", width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconPhone /></span>
                <div style={{ fontSize: "0.85rem", color: "#334155" }}>{detail.telepon}</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <span style={{ color: "#2563EB", background: "#EFF6FF", width: "30px", height: "30px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></span>
                <div style={{ fontSize: "0.85rem", color: "#334155" }}>{detail.email}</div>
              </div>
            </div>
            <button onClick={() => { toggleSuspendPembeli(detail.id); setDetail(null); }} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: detail.status === "Aktif" ? "#EF4444" : "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>{detail.status === "Aktif" ? "Suspend Akun Ini" : "Aktifkan Kembali"}</button>
          </div>
        </div>
      )}
    </main>
  );
}