"use client";

import { useMemo, useState } from "react";

type PesananStatus = "Baru" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";

interface Pesanan {
  id: string;
  pembeli: string;
  itemId: string;
  item: string;
  jumlah: number;
  satuan: string;
  total: number;
  status: PesananStatus;
  tanggal: string;
  alamatKirim: string;
  noResi?: string;
}
interface Props {
  pesananList: Pesanan[];
  deletePesanan: (id: string) => void;
  updatePesananStatus: (id: string, status: PesananStatus) => void;
}

const statusStyle: Record<PesananStatus, { bg: string; color: string }> = {
  Baru: { bg: "#F1F5F9", color: "#475569" },
  Diproses: { bg: "#FEF3C7", color: "#92400E" },
  Dikirim: { bg: "#E0F2FE", color: "#075985" },
  Selesai: { bg: "#D1FAE5", color: "#065F46" },
  Dibatalkan: { bg: "#FEE2E2", color: "#991B1B" },
};

const stepOrder: PesananStatus[] = ["Baru", "Diproses", "Dikirim", "Selesai"];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PenjualanB2B({ pesananList, deletePesanan, updatePesananStatus }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Pesanan | null>(null);

  const filtered = useMemo(() => {
    return pesananList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.pembeli.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.item.toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pesananList, search, statusFilter]);

  const totalPendapatan = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0);
  const totalAktif = pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses").length;

  function ubahStatus(status: PesananStatus) {
    if (!detail) return;
    updatePesananStatus(detail.id, status);
    setDetail({ ...detail, status });
  }

  function handleTolak(id: string, pembeli: string) {
    if (confirm(`Tolak pesanan dari ${pembeli}? Stok akan dikembalikan otomatis.`)) {
      deletePesanan(id);
      if (detail?.id === id) setDetail(null);
    }
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
          .b2b-table-container th, .b2b-table-container td {
            padding: 0.5rem 0.4rem !important;
            font-size: 0.58rem !important;
          }
          .b2b-table-container table {
            min-width: auto !important;
            width: 100% !important;
          }
          .b2b-table-container button {
            padding: 0.2rem 0.4rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
          .b2b-table-container span {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.52rem !important;
            border-radius: 4px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Penjualan B2B</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola pesanan grosir yang masuk dari Admin Toko, terhubung langsung dengan stok kamu.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconStore /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{pesananList.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Pesanan</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Pendapatan Selesai</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Perlu Ditindaklanjuti</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pembeli, ID, atau produk..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          {stepOrder.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <div className="b2b-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Pembeli</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Produk</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Total</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada pesanan yang cocok.</td></tr>
              )}
              {filtered.map((p) => {
                const s = statusStyle[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>
                      <span onClick={() => setDetail(p)} style={{ cursor: "pointer", color: "#10B981", textDecoration: "underline", textDecorationColor: "#A7F3D0" }}>{p.id}</span>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{p.pembeli}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{p.item} ({p.jumlah} {p.satuan})</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(p.total)}</td>
                    <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.status}</span></td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {p.status === "Baru" ? (
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                          <button onClick={() => updatePesananStatus(p.id, "Diproses")} style={{ background: "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Terima</button>
                          <button onClick={() => handleTolak(p.id, p.pembeli)} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                        </div>
                      ) : (
                        <button onClick={() => setDetail(p)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#334155", cursor: "pointer" }}>Kelola</button>
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
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "480px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.tanggal}</p>

            {detail.status !== "Dibatalkan" ? (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                {stepOrder.map((step, i) => {
                  const currentIdx = stepOrder.indexOf(detail.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: done ? "#10B981" : "#E2E8F0", color: done ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700 }}>{i + 1}</div>
                        <span style={{ fontSize: "0.65rem", color: done ? "#1E293B" : "#94A3B8", marginTop: "0.25rem", fontWeight: done ? 600 : 400 }}>{step}</span>
                      </div>
                      {i < stepOrder.length - 1 && <div style={{ flex: 1, height: "2px", background: i < currentIdx ? "#10B981" : "#E2E8F0", margin: "0 0.3rem 1.1rem" }} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.7rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>Pesanan ini dibatalkan</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pembeli</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{detail.pembeli}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Produk</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{detail.item} ({detail.jumlah} {detail.satuan})</div>
              </div>
            </div>
            <div style={{ background: "#ECFDF5", borderRadius: "10px", padding: "0.85rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#10B981", fontWeight: 600 }}>Total Pesanan</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(detail.total)}</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#334155", background: "#F8FAFC", padding: "0.65rem 0.85rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
              <strong>Alamat kirim:</strong> {detail.alamatKirim}
              {detail.noResi && <div style={{ marginTop: "0.3rem" }}><strong>No. resi:</strong> {detail.noResi}</div>}
            </div>

            {detail.status !== "Selesai" && detail.status !== "Dibatalkan" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => ubahStatus("Dibatalkan")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Batalkan</button>
                {detail.status === "Diproses" && <button onClick={() => ubahStatus("Dikirim")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Kirim Pesanan</button>}
                {detail.status === "Dikirim" && <button onClick={() => ubahStatus("Selesai")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Selesai</button>}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}