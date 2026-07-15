"use client";

import { useMemo, useState } from "react";

type JenisAkun = "Admin Toko" | "Produsen";
interface Pendaftar { id: string; nama: string; pemilik: string; jenisAkun: JenisAkun; lokasi: string; tanggal: string; status: "Menunggu" | "Disetujui" | "Ditolak" }
interface Entitas { id: string; nama: string; pemilik: string; tipe: "Toko" | "Produsen"; lokasi: string; status: "Aktif" | "Nonaktif" }
interface EscrowTx { id: string; pembeli: string; toko: string; produsen: string; nominal: number; status: string; tanggal: string }

interface Props {
  entitasList: Entitas[];
  pendaftarList: Pendaftar[];
  approvePendaftar: (id: string) => void;
  rejectPendaftar: (id: string) => void;
  toggleSuspendEntitas: (id: string) => void;
  transaksiList: EscrowTx[];
}

interface Baris { id: string; nama: string; pemilik: string; lokasi: string; status: string; sumber: "pendaftar" | "entitas"; tanggal?: string }

const statusStyle: Record<string, { bg: string; color: string }> = {
  "Menunggu Verifikasi": { bg: "#FEF3C7", color: "#92400E" },
  Aktif: { bg: "#D1FAE5", color: "#065F46" },
  Suspended: { bg: "#FEE2E2", color: "#991B1B" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconBan = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function DataProdusen({ entitasList = [], pendaftarList = [], approvePendaftar, rejectPendaftar, toggleSuspendEntitas, transaksiList = [] }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Baris | null>(null);

  const gabungan: Baris[] = useMemo(() => {
    const pending: Baris[] = (pendaftarList || []).filter((p) => p.jenisAkun === "Produsen" && p.status === "Menunggu").map((p) => ({ id: p.id, nama: p.nama, pemilik: p.pemilik, lokasi: p.lokasi, status: "Menunggu Verifikasi", sumber: "pendaftar", tanggal: p.tanggal }));
    const aktif: Baris[] = (entitasList || []).filter((e) => e.tipe === "Produsen").map((e) => ({ id: e.id, nama: e.nama, pemilik: e.pemilik, lokasi: e.lokasi, status: e.status === "Aktif" ? "Aktif" : "Suspended", sumber: "entitas" }));
    return [...pending, ...aktif];
  }, [entitasList, pendaftarList]);

  const filtered = useMemo(() => {
    return gabungan.filter((b) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || b.nama?.toLowerCase().includes(q) || b.pemilik?.toLowerCase().includes(q) || b.id?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [gabungan, search, statusFilter]);

  const totalMenunggu = useMemo(() => gabungan.filter((b) => b.status === "Menunggu Verifikasi").length, [gabungan]);
  const totalAktif = useMemo(() => gabungan.filter((b) => b.status === "Aktif").length, [gabungan]);
  const totalSuspended = useMemo(() => gabungan.filter((b) => b.status === "Suspended").length, [gabungan]);

  const relasiUntuk = (nama: string) => (transaksiList || []).filter((t) => t.produsen === nama);

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        /* PROTEKSI BANNER AGAR TEKS MELIPAT SEMPURNA */
        .info-alert-banner {
          display: flex !important;
          flex-direction: row !important;
          align-items: flex-start !important; /* Agar ikon tidak ketarik melar ke bawah */
          gap: 0.5rem !important;
          width: 100% !important;
          box-sizing: border-box !important;
          word-break: break-word !important; /* Paksa teks turun jika mentok */
        }
        .info-alert-banner span:last-child {
          flex: 1 !important;
          white-space: normal !important; /* Mencegah teks memanjang horizontal */
        }
        
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
          .produsen-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .produsen-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .produsen-stat-card > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          .produsen-stat-card > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .produsen-stat-card > div:last-child > div:first-child {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .produsen-stat-card > div:last-child > div:last-child {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          .produsen-filter-wrapper {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            gap: 0.5rem !important;
            margin-bottom: 1rem !important;
          }
          .produsen-filter-wrapper input, .produsen-filter-wrapper select {
            padding: 0.35rem 0.5rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          .produsen-filter-wrapper input {
            padding-left: 1.75rem !important;
          }
          .produsen-table-container th, .produsen-table-container td {
            padding: 0.5rem 0.4rem !important;
            font-size: 0.58rem !important;
          }
          .produsen-table-container table {
            min-width: auto !important;
            width: 100% !important;
          }
          .produsen-table-container button {
            padding: 0.25rem 0.4rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
          .produsen-table-container span {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Data Produsen</h1>
        <p className="info-alert-banner" style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
          <span>Daftar Produsen terdaftar — tinjau pendaftar baru dan kelola status akun yang sudah aktif.</span>
        </p>
      </div>

      <div className="produsen-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="produsen-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalMenunggu}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Verifikasi</div></div>
        </div>
        <div className="produsen-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconStore /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Produsen Aktif</div></div>
        </div>
        <div className="produsen-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBan /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalSuspended}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Suspended</div></div>
        </div>
      </div>

      <div className="produsen-filter-wrapper" style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produsen, pemilik, atau ID..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Menunggu Verifikasi">Menunggu Verifikasi</option>
          <option value="Aktif">Aktif</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="produsen-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Produsen</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Pemilik</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Lokasi</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada data yang cocok.</td></tr>
              )}
              {filtered.map((b) => {
                const s = statusStyle[b.status || "Menunggu Verifikasi"];
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{b.id}</td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{b.nama}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{b.pemilik}</td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{b.lokasi}</td>
                    <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{b.status}</span></td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {b.sumber === "pendaftar" ? (
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                          <button onClick={() => approvePendaftar(b.id)} style={{ background: "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Setujui</button>
                          <button onClick={() => rejectPendaftar(b.id)} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                        </div>
                      ) : (
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                          <button onClick={() => toggleSuspendEntitas(b.id)} style={{ background: b.status === "Aktif" ? "#FEE2E2" : "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: b.status === "Aktif" ? "#991B1B" : "#059669", fontWeight: 600, cursor: "pointer" }}>{b.status === "Aktif" ? "Suspend" : "Aktifkan"}</button>
                          <button onClick={() => setDetail(b)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Lihat Profil</button>
                        </div>
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
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "420px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.id} • {detail.lokasi}</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.88rem", marginBottom: "1.2rem" }}>
              <div><strong style={{ color: "#64748B" }}>Nama Pemilik:</strong> <span style={{ color: "#1E293B" }}>{detail.pemilik}</span></div>
              <div><strong style={{ color: "#64748B" }}>Status:</strong> <span style={{ color: "#1E293B" }}>{detail.status}</span></div>
            </div>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Transaksi terhubung ({relasiUntuk(detail.nama).length})</div>
            {relasiUntuk(detail.nama).length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Belum ada transaksi yang melibatkan produsen ini.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {relasiUntuk(detail.nama).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.8rem" }}>
                    <span style={{ color: "#334155" }}>{t.id} • {t.toko}</span>
                    <strong style={{ color: "#1E293B" }}>{formatRupiah(t.nominal)}</strong>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetail(null)} style={{ marginTop: "1.1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}