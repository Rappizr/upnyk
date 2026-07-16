"use client";

import { useMemo, useState } from "react";

interface EscrowTx {
  id: string;
  pembeli: string;
  toko: string;
  produsen: string;
  nominal: number;
  persenToko: number;
  persenProdusen: number;
  status: "Ditahan" | "Tersalur" | "Disengketakan";
  tanggal: string;
}

interface Props {
  transaksiList: EscrowTx[];
  salurkanDana: (id: string) => void;
  tandaiSengketa: (id: string) => void;
  selesaikanSengketa: (id: string) => void;
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  Ditahan: { bg: "#FEF3C7", color: "#92400E" },
  Tersalur: { bg: "#D1FAE5", color: "#065F46" },
  Disengketakan: { bg: "#FEE2E2", color: "#991B1B" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconShieldLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function EscrowTransaksi({ transaksiList = [], salurkanDana, tandaiSengketa, selesaikanSengketa }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<EscrowTx | null>(null);

  const filtered = useMemo(() => {
    return (transaksiList || []).filter((t) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || t.id?.toLowerCase().includes(q) || t.toko?.toLowerCase().includes(q) || t.produsen?.toLowerCase().includes(q) || t.pembeli?.toLowerCase().includes(q);
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [transaksiList, search, statusFilter]);

  const totalDitahan = useMemo(() => (transaksiList || []).filter((t) => t.status === "Ditahan").reduce((s, t) => s + t.nominal, 0), [transaksiList]);
  const totalTersalur = useMemo(() => (transaksiList || []).filter((t) => t.status === "Tersalur").reduce((s, t) => s + t.nominal, 0), [transaksiList]);
  const totalSengketa = useMemo(() => (transaksiList || []).filter((t) => t.status === "Disengketakan").length, [transaksiList]);

  function updateDetail(id: string, status: EscrowTx["status"]) {
    setDetail((d) => (d && d.id === id ? { ...d, status } : d));
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
          
          /* FORCE GRID METRIK ATAS 3 KOLOM */
          .escrow-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .escrow-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
            gap: 0.4rem !important;
          }
          .escrow-stat-card > div:first-child {
            padding: 0.3rem !important;
            border-radius: 6px !important;
          }
          .escrow-stat-card > div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .escrow-stat-card > div:last-child > div:first-child {
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
            letter-spacing: -0.02em !important;
          }
          .escrow-stat-card > div:last-child > div:last-child {
            font-size: 0.48rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          
          .escrow-filter-bar {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            gap: 0.5rem !important;
            margin-bottom: 1rem !important;
          }
          .escrow-filter-bar input, .escrow-filter-bar select {
            padding: 0.35rem 0.5rem !important;
            font-size: 0.7rem !important;
            border-radius: 6px !important;
          }
          .escrow-filter-bar input {
            padding-left: 1.75rem !important;
          }
          
          .escrow-table-container th, .escrow-table-container td {
            padding: 0.5rem 0.4rem !important;
            font-size: 0.58rem !important;
          }
          .escrow-table-container table {
            min-width: auto !important;
            width: 100% !important;
          }
          .escrow-table-container button {
            padding: 0.25rem 0.4rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
          .escrow-table-container span {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Escrow & Transaksi</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Dana pembeli ditahan sistem, lalu otomatis dibagi ke Admin Toko dan Produsen setelah barang diterima.</p>
      </div>

      <div className="escrow-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="escrow-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconShieldLock /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalDitahan)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Dana Ditahan</div></div>
        </div>
        <div className="escrow-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalTersalur)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Dana Tersalur</div></div>
        </div>
        <div className="escrow-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{totalSengketa}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Disengketakan</div></div>
        </div>
      </div>

      <div className="escrow-filter-bar" style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari ID, toko, produsen, atau pembeli..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Ditahan">Ditahan</option>
          <option value="Tersalur">Tersalur</option>
          <option value="Disengketakan">Disengketakan</option>
        </select>
      </div>

      <div className="escrow-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID Transaksi</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Toko</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Produsen</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nominal</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada transaksi yang cocok.</td></tr>
              )}
              {filtered.map((t) => {
                const s = statusStyle[t.status || "Ditahan"];
                return (
                  <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#2563EB" }}>
                      <span onClick={() => setDetail(t)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{t.id}</span>
                    </td>
                    <td style={{ padding: "1rem", color: "#1E293B", fontWeight: 600 }}>{t.toko}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{t.produsen}</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(t.nominal)}</td>
                    <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{t.status}</span></td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button onClick={() => setDetail(t)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Kelola</button>
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
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "440px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.tanggal} • Pembeli: {detail.pembeli}</p>

            <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "0.9rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600 }}>Nominal Ditahan</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(detail.nominal)}</span>
            </div>

            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.6rem" }}>Rincian pembagian dana</div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "#334155" }}>{detail.toko} <span style={{ color: "#94A3B8" }}>({detail.persenToko}%)</span></span>
                <strong style={{ color: "#1E293B" }}>{formatRupiah(Math.round(detail.nominal * detail.persenToko / 100))}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.75rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "#334155" }}>{detail.produsen} <span style={{ color: "#94A3B8" }}>({detail.persenProdusen}%)</span></span>
                <strong style={{ color: "#1E293B" }}>{formatRupiah(Math.round(detail.nominal * detail.persenProdusen / 100))}</strong>
              </div>
            </div>

            {detail.status === "Ditahan" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => { tandaiSengketa(detail.id); updateDetail(detail.id, "Disengketakan"); }} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tandai Sengketa</button>
                <button onClick={() => { salurkanDana(detail.id); updateDetail(detail.id, "Tersalur"); }} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Salurkan Dana</button>
              </div>
            )}
            {detail.status === "Disengketakan" && (
              <button onClick={() => { selesaikanSengketa(detail.id); updateDetail(detail.id, "Tersalur"); }} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Selesaikan & Salurkan Dana</button>
            )}
            {detail.status === "Tersalur" && (
              <div style={{ textAlign: "center", padding: "0.6rem", background: "#ECFDF5", borderRadius: "8px", color: "#059669", fontWeight: 600, fontSize: "0.85rem" }}>Dana sudah tersalur ke kedua pihak</div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}