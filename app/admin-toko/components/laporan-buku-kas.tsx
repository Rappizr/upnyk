"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";

interface TransaksiKas {
  id: string;
  keterangan: string;
  nominal: number;
  tanggal: string;
  tipe: "masuk" | "keluar";
}

const IconArrowUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconArrowDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

function formatDate(dateStr: string) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric"
    });
  } catch {
    return dateStr;
  }
}

export default function LaporanBukuKas() {
  const [tab, setTab] = useState<"semua" | "masuk" | "keluar">("semua");
  const [riwayat, setRiwayat] = useState<TransaksiKas[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBukuKasRealtime = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setRiwayat([]);
        setLoading(false);
        return;
      }

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id, nama_toko")
        .eq("profile_id", user.id)
        .maybeSingle();

      const possibleIds = [user.id, "a89317e5-1407-4cd7-9698-3514680b4e51"];
      if (adminToko?.id) possibleIds.push(adminToko.id);

      const { data: pesananBeli } = await supabase
        .from("pesanan")
        .select("id, total_harga, status, created_at, produsen_id")
        .in("admin_toko_id", possibleIds)
        .order("created_at", { ascending: false });

      const produsenIds = Array.from(new Set((pesananBeli || []).map((p) => p.produsen_id).filter(Boolean)));
      
      const { data: produsenData } = produsenIds.length > 0
        ? await supabase.from("produsen").select("id, nama_usaha").in("id", produsenIds)
        : { data: [] };

      const produsenMap = new Map((produsenData || []).map((p) => [p.id, p.nama_usaha]));

      const listKeluarPesanan: TransaksiKas[] = (pesananBeli || [])
        .filter((p: any) => {
          const st = String(p.status || "").toLowerCase();
          return st === "selesai" || st === "diterima" || st === "dikirim" || st === "diproses" || !p.status;
        })
        .map((p: any) => {
          const namaProd = produsenMap.get(p.produsen_id) || "Pak Jay Store";
          return {
            id: `po-${p.id}`,
            keterangan: `Belanja Bahan Baku — ${namaProd}`,
            nominal: Number(p.total_harga || p.total) || 0,
            tanggal: p.created_at || new Date().toISOString(),
            tipe: "keluar",
          };
        });

      let { data: inventarisData } = await supabase
        .from("inventaris")
        .select("*")
        .in("admin_toko_id", possibleIds);

      if (!inventarisData || inventarisData.length === 0) {
        const { data: fallbackInv } = await supabase
          .from("inventaris")
          .select("*")
          .eq("admin_toko_id", "a89317e5-1407-4cd7-9698-3514680b4e51");
        inventarisData = fallbackInv;
      }

      const listKeluarInventaris: TransaksiKas[] = (inventarisData || [])
        .map((inv: any) => {
          const namaFix = inv.nama_produk && inv.nama_produk !== "NULL" ? inv.nama_produk : (inv.nama || "kripik");
          const hgBeli = Number(inv.harga_beli) || 10000;
          const jmlStok = Number(inv.stok) || 0;
          const totalModal = hgBeli * jmlStok;

          return {
            id: `inv-${inv.id}`,
            keterangan: `Modal Inventaris — ${namaFix} (${jmlStok} ${inv.satuan || "pcs"} @ ${formatRupiah(hgBeli)})`,
            nominal: totalModal,
            tanggal: inv.created_at || inv.updated_at || new Date().toISOString(),
            tipe: "keluar" as const,
          };
        })
        .filter((item) => item.nominal > 0);

      let listMasuk: TransaksiKas[] = [];
      const { data: penjualanData, error: errPenjualan } = await supabase
        .from("penjualan")
        .select("id, total, status, created_at, nama_pembeli")
        .in("admin_toko_id", possibleIds);

      if (!errPenjualan && penjualanData) {
        listMasuk = penjualanData
          .filter((pj: any) => {
            const st = String(pj.status || "").toLowerCase();
            return st === "selesai" || st === "dikirim" || st === "diproses";
          })
          .map((pj: any) => ({
            id: `in-${pj.id}`,
            keterangan: `Penjualan Toko (${pj.nama_pembeli || "Pelanggan"})`,
            nominal: Number(pj.total) || 0,
            tanggal: pj.created_at || new Date().toISOString(),
            tipe: "masuk",
          }));
      }

      const { data: pesananSales } = await supabase
        .from("pesanan")
        .select("id, total, total_harga, status, escrow_status, created_at, supplier, kode_pesanan")
        .order("created_at", { ascending: false });

      const listMasukPesanan: TransaksiKas[] = (pesananSales || [])
        .filter((p: any) => {
          const st = String(p.status || "").toLowerCase();
          const esc = String(p.escrow_status || "").toLowerCase();
          return st === "sudah dibayar" || st === "diproses" || st === "dikirim" || st === "selesai" || esc === "tersalur";
        })
        .map((p: any) => {
          const isTersalur = p.escrow_status === "Tersalur" || p.status === "Selesai";
          return {
            id: `in-pesanan-${p.id}`,
            keterangan: isTersalur
              ? `Pemasukan (Escrow Tersalur) — ${p.kode_pesanan || p.id}`
              : `Penjualan Toko (Escrow Ditahan Platform) — ${p.kode_pesanan || p.id}`,
            nominal: Number(p.total || p.total_harga) || 0,
            tanggal: p.created_at || new Date().toISOString(),
            tipe: "masuk" as const,
          };
        })
        .filter((item) => item.nominal > 0);

      const gabungan = [...listMasuk, ...listMasukPesanan, ...listKeluarPesanan, ...listKeluarInventaris].sort(
        (a, b) => new Date(b.tanggal).getTime() - new Date(a.tanggal).getTime()
      );

      setRiwayat(gabungan);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBukuKasRealtime();
  }, [fetchBukuKasRealtime]);

  const totalMasuk = useMemo(() => {
    return riwayat.filter((r) => r.tipe === "masuk").reduce((s, r) => s + r.nominal, 0);
  }, [riwayat]);

  const totalKeluar = useMemo(() => {
    return riwayat.filter((r) => r.tipe === "keluar").reduce((s, r) => s + r.nominal, 0);
  }, [riwayat]);

  const labaBersih = totalMasuk - totalKeluar;

  const filtered = riwayat.filter(
    (r) => tab === "semua" || (tab === "masuk" && r.tipe === "masuk") || (tab === "keluar" && r.tipe === "keluar")
  );

  function unduhPDF() {
    window.print();
  }

  function unduhExcel() {
    let csvContent = "data:text/csv;charset=utf-8,Tanggal,Tipe,Keterangan Transaksi,Nominal (Rp)\n";
    riwayat.forEach((r) => {
      const row = `"${formatDate(r.tanggal)}","${r.tipe === "masuk" ? "Pemasukan" : "Pengeluaran"}","${r.keterangan.replace(/"/g, '""')}","${r.nominal}"`;
      csvContent += row + "\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Buku_Kas_PasarNusa_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function unduhWord() {
    const rows = riwayat
      .map(
        (r) =>
          `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${formatDate(r.tanggal)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${r.keterangan}</td><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;color:${r.tipe === "masuk" ? "#059669" : "#DC2626"};">${r.tipe === "masuk" ? "+" : "-"} ${formatRupiah(r.nominal)}</td></tr>`
      )
      .join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Buku Kas Digital</title></head><body style="font-family:Calibri,Arial,sans-serif;">
      <h1>Buku Kas Digital — PasarNusa Admin Toko</h1>
      <table style="border-collapse:collapse;margin-bottom:20px;width:100%;">
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Total Omset (Masuk)</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(totalMasuk)}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">Total Belanja (Keluar)</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(totalKeluar)}</td></tr>
        <tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;background:#FEF3C7;">Laba Bersih</td><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;background:#FEF3C7;">${formatRupiah(labaBersih)}</td></tr>
      </table>
      <h2>Riwayat Transaksi Realtime</h2>
      <table style="border-collapse:collapse;width:100%;">
        <tr style="background:#F3F4F6;"><th style="padding:6px 10px;border:1px solid #ddd;">Tanggal</th><th style="padding:6px 10px;border:1px solid #ddd;">Keterangan</th><th style="padding:6px 10px;border:1px solid #ddd;">Nominal</th></tr>
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
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        @media print {
          .no-print { display: none !important; }
        }

        .cashbook-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.85rem;
        }

        .cashbook-filter-tabs {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.25rem;
          -webkit-overflow-scrolling: touch;
        }

        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          
          .cashbook-header-box {
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.75rem !important;
            margin-bottom: 1rem !important;
          }

          .cashbook-header-box h1 {
            font-size: 1.15rem !important;
          }

          .cashbook-header-box p {
            font-size: 0.65rem !important;
            line-height: 1.25 !important;
          }

          .cashbook-action-buttons {
            width: 100% !important;
            display: flex !important;
            gap: 0.35rem !important;
          }

          .cashbook-action-buttons button {
            flex: 1 !important;
            padding: 0.4rem 0.5rem !important;
            font-size: 0.68rem !important;
            border-radius: 6px !important;
            text-align: center !important;
            white-space: nowrap !important;
          }

          .cashbook-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.35rem !important;
            margin-bottom: 1rem !important;
          }

          .cashbook-stat-card {
            padding: 0.5rem 0.4rem !important;
            border-radius: 8px !important;
          }

          .cashbook-stat-card > div:first-child {
            font-size: 0.6rem !important;
            margin-bottom: 0.15rem !important;
          }

          .cashbook-stat-card > div:last-child {
            font-size: 0.82rem !important;
            line-height: 1.1 !important;
          }

          .cashbook-filter-tabs button {
            padding: 0.35rem 0.65rem !important;
            font-size: 0.68rem !important;
            white-space: nowrap !important;
          }

          .cashbook-table-container table {
            min-width: 520px !important;
          }

          .cashbook-table-container th, 
          .cashbook-table-container td {
            padding: 0.5rem 0.45rem !important;
            font-size: 0.68rem !important;
          }
        }

        @media (max-width: 480px) {
          .cashbook-stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
      `}} />

      <div className="cashbook-header-box" style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>Buku Kas Digital</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.85rem" }}>Ringkasan arus kas masuk dari pelanggan vs arus kas keluar belanja ke produsen &amp; modal inventaris.</p>
        </div>
        <div className="cashbook-action-buttons no-print" style={{ display: "flex", gap: "0.4rem" }}>
          <button onClick={unduhExcel} style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "0.5rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#059669", cursor: "pointer" }}>Export CSV</button>
          <button onClick={unduhWord} style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.5rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>Word</button>
          <button onClick={unduhPDF} style={{ background: "#FEE2E2", border: "1px solid #FECACA", padding: "0.5rem 0.85rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "#991B1B", cursor: "pointer" }}>Cetak PDF</button>
        </div>
      </div>

      <div className="cashbook-stats-grid" style={{ marginBottom: "1.25rem" }}>
        <div className="cashbook-stat-card" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", padding: "1rem", borderRadius: "10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <span style={{ color: "#D97706", display: "flex" }}><IconWallet /></span>
            <span style={{ fontSize: "0.75rem", color: "#92400E", fontWeight: 700 }}>Laba Bersih</span>
          </div>
          <div style={{ fontSize: "1.2rem", fontWeight: 800, color: labaBersih >= 0 ? "#92400E" : "#DC2626" }}>{formatRupiah(labaBersih)}</div>
        </div>

        <div className="cashbook-stat-card" style={{ background: "white", padding: "1rem", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <span style={{ color: "#10B981", display: "flex" }}><IconArrowUp /></span>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Total Omset</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalMasuk)}</div>
        </div>

        <div className="cashbook-stat-card" style={{ background: "white", padding: "1rem", borderRadius: "10px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", marginBottom: "0.3rem" }}>
            <span style={{ color: "#EF4444", display: "flex" }}><IconArrowDown /></span>
            <span style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 600 }}>Total Belanja</span>
          </div>
          <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalKeluar)}</div>
        </div>
      </div>

      <div className="cashbook-filter-tabs no-print" style={{ marginBottom: "1rem" }}>
        {(["semua", "masuk", "keluar"] as const).map((t) => (
          <button 
            key={t} 
            onClick={() => setTab(t)} 
            style={{ 
              background: tab === t ? "#F59E0B" : "white", 
              color: tab === t ? "#fff" : "#475569", 
              border: "1px solid " + (tab === t ? "#F59E0B" : "#CBD5E1"), 
              padding: "0.4rem 0.85rem", 
              borderRadius: "20px", 
              fontSize: "0.78rem", 
              fontWeight: 600, 
              cursor: "pointer", 
              textTransform: "capitalize",
              flexShrink: 0
            }}
          >
            {t === "semua" ? `Semua (${riwayat.length})` : t === "masuk" ? "Pemasukan" : "Pengeluaran"}
          </button>
        ))}
      </div>

      <div className="cashbook-table-container" style={{ background: "white", borderRadius: "10px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: 600 }}>Tanggal</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: 600 }}>Tipe</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: 600 }}>Keterangan Transaksi</th>
                <th style={{ padding: "0.75rem 1rem", color: "#475569", fontWeight: 600, textAlign: "right" }}>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Memuat Transaksi Kas Realtime...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada catatan transaksi real untuk filter ini.</td></tr>
              ) : (
                filtered.map((r, i) => (
                  <tr key={r.id || i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "0.75rem 1rem", color: "#64748B", whiteSpace: "nowrap", fontSize: "0.8rem" }}>
                      {formatDate(r.tanggal)}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", whiteSpace: "nowrap" }}>
                      <span style={{ 
                        fontSize: "0.68rem", 
                        fontWeight: 700, 
                        padding: "0.2rem 0.5rem", 
                        borderRadius: "999px",
                        backgroundColor: r.tipe === "masuk" ? "#ECFDF5" : "#FEE2E2",
                        color: r.tipe === "masuk" ? "#059669" : "#DC2626"
                      }}>
                        {r.tipe === "masuk" ? "PEMASUKAN" : "PENGELUARAN"}
                      </span>
                    </td>
                    <td style={{ padding: "0.75rem 1rem", color: "#1E293B", fontWeight: 500 }}>
                      {r.keterangan}
                    </td>
                    <td style={{ padding: "0.75rem 1rem", textAlign: "right", fontWeight: 700, color: r.tipe === "masuk" ? "#059669" : "#DC2626", whiteSpace: "nowrap" }}>
                      {r.tipe === "masuk" ? "+ " : "− "}{formatRupiah(r.nominal)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}