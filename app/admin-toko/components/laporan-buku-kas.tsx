"use client";

import { useMemo, useState } from "react";

interface Pembelian {
  id: string;
  produsenId?: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan?: string;
  hargaSatuan?: number;
  total: number;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan";
  tanggal: string;
  noResi?: string;
  fotoProduk?: string;
  rating?: number;
  fotoUlasan?: string;
  keteranganUlasan?: string;
  lokasiProdusen?: string;
}

interface Penjualan {
  id: string;
  pembeli: string;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
}

interface Props {
  pembelianList: Pembelian[];
  penjualanList: Penjualan[];
}

const IconArrowUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconArrowDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

export default function LaporanBukuKas({ pembelianList = [], penjualanList = [] }: Props) {
  const [tab, setTab] = useState<"semua" | "masuk" | "keluar">("semua");

  const riwayat = useMemo(() => {
    const masuk = (penjualanList || []).map((p) => ({
      id: p.id,
      keterangan: `Penjualan — ${p.pembeli} (${p.produk})`,
      nominal: p.total,
      tanggal: p.tanggal,
      tipe: "masuk" as const,
    }));

    const keluar = (pembelianList || [])
      .filter((p) => p.status === "Diterima" || p.status === "Selesai")
      .map((p) => ({
        id: p.id,
        keterangan: `Belanja — ${p.produsen} (${p.item})`,
        nominal: p.total,
        tanggal: p.tanggal,
        tipe: "keluar" as const,
      }));

    return [...masuk, ...keluar].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1));
  }, [pembelianList, penjualanList]);

  const filtered = riwayat.filter((r) => tab === "semua" || (tab === "masuk" && r.tipe === "masuk") || (tab === "keluar" && r.tipe === "keluar"));

  const totalMasuk = (penjualanList || []).reduce((s, p) => s + p.total, 0);
  const totalKeluar = (pembelianList || [])
    .filter((p) => p.status === "Diterima" || p.status === "Selesai")
    .reduce((s, p) => s + p.total, 0);
  const labaBersih = totalMasuk - totalKeluar;

  function unduhPDF() {
    window.print();
  }

  function unduhWord() {
    const rows = riwayat
      .map((r) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${r.tanggal}</td><td style="padding:6px 10px;border:1px solid #ddd;">${r.keterangan}</td><td style="padding:6px 10px;border:1px solid #ddd;">${r.tipe === "masuk" ? "+" : "-"} ${formatRupiah(r.nominal)}</td></tr>`)
      .join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Buku Kas</title></head><body style="font-family:Calibri,Arial,sans-serif;">
      <h1>Buku Kas — PasarNusa Admin Toko</h1>
      <table style="border-collapse:collapse;margin-bottom:20px;">
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Total Omset (Masuk)</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(totalMasuk)}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Total Belanja (Keluar)</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(totalKeluar)}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Laba Bersih</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(labaBersih)}</td></tr>
      </table>
      <h2>Riwayat Transaksi</h2>
      <table style="border-collapse:collapse;">
        <tr><th style="padding:6px 10px;border:1px solid #ddd;">Tanggal</th><th style="padding:6px 10px;border:1px solid #ddd;">Keterangan</th><th style="padding:6px 10px;border:1px solid #ddd;">Nominal</th></tr>
        ${rows}
      </table>
    </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Buku-Kas-PasarNusa.doc";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main {
            padding: 0.5rem 0.25rem !important;
          }
          main > div:first-child {
            gap: 0.4rem !important;
            margin-bottom: 1rem !important;
          }
          main h1 {
            font-size: 1.15rem !important;
          }
          main p {
            font-size: 0.62rem !important;
            line-height: 1.2 !important;
          }
          .cashbook-action-buttons {
            width: 100% !important;
            justify-content: flex-end !important;
          }
          .cashbook-action-buttons button {
            padding: 0.4rem 0.65rem !important;
            font-size: 0.68rem !important;
            border-radius: 6px !important;
          }
          .cashbook-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            margin-bottom: 1rem !important;
          }
          .cashbook-stat-card {
            padding: 0.4rem !important;
            border-radius: 6px !important;
          }
          .cashbook-stat-card > div:first-child {
            gap: 0.25rem !important;
            margin-bottom: 0.25rem !important;
          }
          .cashbook-stat-card > div:first-child span:first-child {
            display: flex !important;
            align-items: center !important;
          }
          .cashbook-stat-card > div:first-child span:first-child svg {
            width: 12px !important;
            height: 12px !important;
          }
          .cashbook-stat-card > div:first-child span:last-child {
            font-size: 0.52rem !important;
            line-height: 1.1 !important;
          }
          .cashbook-stat-card > div:last-child {
            font-size: 0.62rem !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
            letter-spacing: -0.02em !important;
          }
          .cashbook-filter-tabs button {
            padding: 0.35rem 0.65rem !important;
            font-size: 0.68rem !important;
          }
          .cashbook-table-container th, .cashbook-table-container td {
            padding: 0.5rem 0.4rem !important;
            font-size: 0.58rem !important;
          }
          .cashbook-table-container table {
            min-width: auto !important;
            width: 100% !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Buku Kas</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Total belanja bahan baku ke produsen vs total omset penjualan ke pembeli kota, dalam satu buku kas digital.</p>
        </div>
        <div className="cashbook-action-buttons" style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={unduhPDF} style={{ background: "#FEE2E2", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#991B1B", cursor: "pointer" }}>Unduh PDF</button>
          <button onClick={unduhWord} style={{ background: "#EFF6FF", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>Unduh Word</button>
        </div>
      </div>

      <div className="cashbook-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="cashbook-stat-card" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "#D97706", display: "flex" }}><IconWallet /></span>
            <span style={{ fontSize: "0.78rem", color: "#92400E", fontWeight: 600 }}>Laba Bersih</span>
          </div>
          <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#92400E" }}>{formatRupiah(labaBersih)}</div>
        </div>
        <div className="cashbook-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "#10B981", display: "flex" }}><IconArrowUp /></span>
            <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>Total Omset</span>
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalMasuk)}</div>
        </div>
        <div className="cashbook-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.4rem" }}>
            <span style={{ color: "#EF4444", display: "flex" }}><IconArrowDown /></span>
            <span style={{ fontSize: "0.78rem", color: "#64748B", fontWeight: 600 }}>Total Belanja</span>
          </div>
          <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalKeluar)}</div>
        </div>
      </div>

      <div className="cashbook-filter-tabs" style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem" }}>
        {(["semua", "masuk", "keluar"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{ background: tab === t ? "#F59E0B" : "white", color: tab === t ? "#fff" : "#334155", border: "1px solid " + (tab === t ? "#F59E0B" : "#E2E8F0"), padding: "0.5rem 0.9rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer", textTransform: "capitalize" }}>{t}</button>
        ))}
      </div>

      <div className="cashbook-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "550px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>Tanggal</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Keterangan</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "right" }}>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada transaksi.</td></tr>
              )}
              {filtered.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", color: "#64748B", whiteSpace: "nowrap" }}>{r.tanggal}</td>
                  <td style={{ padding: "1rem", color: "#1E293B", fontWeight: 500 }}>{r.keterangan}</td>
                  <td style={{ padding: "1rem", textAlign: "right", fontWeight: 700, color: r.tipe === "masuk" ? "#10B981" : "#EF4444" }}>{r.tipe === "masuk" ? "+ " : "− "}{formatRupiah(r.nominal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}