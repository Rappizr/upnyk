"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/db";

interface Pesanan {
  id: string;
  pembeli: string;
  total: number;
  status: string;
  tanggal: string;
}

interface Pengeluaran {
  id: string;
  keterangan: string;
  nominal: number;
  tanggal: string;
  kategori: string;
}

const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconArrowUp = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="19" x2="12" y2="5"></line><polyline points="5 12 12 5 19 12"></polyline></svg>;
const IconArrowDown = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function formatRupiah(n: number) {
  if (n < 0) {
    return "- Rp " + Math.abs(n).toLocaleString("id-ID");
  }
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}


function formatRupiahRingkas(n: number) {
  const neg = n < 0;
  const a = Math.abs(isNaN(n) ? 0 : n);
  let s: string;
  if (a >= 1000000000) s = `Rp ${(a / 1000000000).toFixed(1)}M`;
  else if (a >= 1000000) s = `Rp ${(a / 1000000).toFixed(1)}jt`;
  else if (a >= 1000) s = `Rp ${Math.round(a / 1000)}rb`;
  else s = "Rp " + a.toLocaleString("id-ID");
  return neg ? "- " + s : s;
}

function formatInputRupiah(value: string) {
  const angka = value.replace(/\D/g, "");
  return angka ? Number(angka).toLocaleString("id-ID") : "";
}

function unformatInputRupiah(value: string) {
  return value.replace(/\./g, "");
}

export default function Keuangan() {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>([]);
  const [loading, setLoading] = useState(true);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showTarikModal, setShowTarikModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ keterangan: "", nominal: "", kategori: "Bahan Baku" });
  const [tarikForm, setTarikForm] = useState({ nominal: "", metode: "Transfer Bank", rekening: "" });
  const [tarikError, setTarikError] = useState("");

  const muatDataKeuangan = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      const { data: produsen } = await supabase
        .from("produsen")
        .select("id")
        .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
        .maybeSingle();

      if (!produsen) {
        setLoading(false);
        return;
      }

    
      const { data: pesananData, error: pesananError } = await supabase
        .from("pesanan")
        .select("id, total_harga, status, created_at, admin_toko_id")
        .eq("produsen_id", produsen.id)
        .order("created_at", { ascending: false });

      if (pesananError) {
        console.error("Gagal muat pesanan di keuangan:", pesananError);
      }

      const { data: adminList } = await supabase
        .from("admin_toko")
        .select("id, nama_toko");

      const adminMap = new Map((adminList || []).map((a) => [a.id, a.nama_toko]));

      if (pesananData) {
        const mappedPesanan: Pesanan[] = pesananData.map((p: any) => {
          const stRaw = String(p.status || "").toLowerCase().trim();
          let statusNormalized = "Lainnya";

          if (stRaw === "selesai" || stRaw === "diterima" || stRaw === "lunas") {
            statusNormalized = "Selesai";
          } else if (stRaw === "diproses" || stRaw === "dikirim" || stRaw === "baru") {
            statusNormalized = "Proses";
          } else if (stRaw === "dibatalkan" || stRaw === "batal") {
            statusNormalized = "Dibatalkan";
          }

          const namaToko = adminMap.get(p.admin_toko_id) || "Admin Toko Mitra";

          return {
            id: p.id.slice(0, 8).toUpperCase(),
            pembeli: namaToko,
            total: Number(p.total_harga) || 0,
            status: statusNormalized,
            tanggal: new Date(p.created_at).toLocaleDateString("id-ID")
          };
        });
        setPesananList(mappedPesanan);
      }

      // 2. Load Pengeluaran
      const { data: pengeluaranData } = await supabase
        .from("pengeluaran")
        .select("*")
        .eq("produsen_id", produsen.id)
        .order("created_at", { ascending: false });

      if (pengeluaranData) {
        const mappedPengeluaran: Pengeluaran[] = pengeluaranData.map((p: any) => ({
          id: p.id,
          keterangan: p.keterangan || "Pengeluaran Toko",
          nominal: Number(p.nominal) || 0,
          tanggal: new Date(p.created_at).toLocaleDateString("id-ID"),
          kategori: p.kategori || "Operasional"
        }));
        setPengeluaranList(mappedPengeluaran);
      }
    } catch (err) {
      console.error("Gagal muat keuangan:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatDataKeuangan();

    const channel = supabase
      .channel("realtime-keuangan-produsen")
      .on("postgres_changes", { event: "*", schema: "public", table: "pesanan" }, () => muatDataKeuangan())
      .on("postgres_changes", { event: "*", schema: "public", table: "pengeluaran" }, () => muatDataKeuangan())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [muatDataKeuangan]);

  const pemasukan = useMemo(
    () =>
      pesananList
        .filter((p) => p.status === "Selesai")
        .map((p) => ({
          id: p.id,
          keterangan: `Penjualan B2B — ${p.pembeli} (#${p.id})`,
          nominal: p.total,
          tanggal: p.tanggal,
          tipe: "masuk" as const
        })),
    [pesananList]
  );

  const pengeluaran = useMemo(
    () => pengeluaranList.map((p) => ({ ...p, tipe: "keluar" as const })),
    [pengeluaranList]
  );

  const riwayat = useMemo(
    () => [...pemasukan, ...pengeluaran].sort((a, b) => (a.tanggal < b.tanggal ? 1 : -1)),
    [pemasukan, pengeluaran]
  );

  const totalMasuk = pemasukan.reduce((s, x) => s + x.nominal, 0);
  const totalKeluar = pengeluaran.reduce((s, x) => s + x.nominal, 0);
  const saldo = totalMasuk - totalKeluar;

  async function addPengeluaran(entry: { keterangan: string; nominal: number; kategori: string }) {
    setSubmitting(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: produsen } = await supabase
        .from("produsen")
        .select("id")
        .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
        .maybeSingle();

      if (!produsen) {
        alert("Gagal mengidentifikasi profil produsen Anda.");
        return;
      }

      const { error } = await supabase.from("pengeluaran").insert({
        produsen_id: produsen.id,
        keterangan: entry.keterangan,
        nominal: entry.nominal,
        kategori: entry.kategori,
        created_at: new Date().toISOString()
      });

      if (error) {
        const { error: errFallback } = await supabase.from("pengeluaran").insert({
          keterangan: entry.keterangan,
          nominal: entry.nominal,
          kategori: entry.kategori,
          created_at: new Date().toISOString()
        });

        if (errFallback) throw errFallback;
      }

      await muatDataKeuangan();
    } catch (err: any) {
      console.error("Gagal mencatat pengeluaran:", err);
      alert("Gagal mencatat pengeluaran: " + (err.message || "Pastikan tabel 'pengeluaran' sudah ada."));
    } finally {
      setSubmitting(false);
    }
  }

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    const nominalNum = Number(unformatInputRupiah(form.nominal));
    if (!form.keterangan || !nominalNum) return;
    addPengeluaran({ keterangan: form.keterangan, nominal: nominalNum, kategori: form.kategori });
    setForm({ keterangan: "", nominal: "", kategori: "Bahan Baku" });
    setShowAddModal(false);
  }

  function handleTarikSubmit(e: FormEvent) {
    e.preventDefault();
    const nominal = Number(unformatInputRupiah(tarikForm.nominal));
    if (!nominal || nominal <= 0) return;
    if (nominal > saldo) {
      setTarikError(`Nominal melebihi saldo tersedia (${formatRupiah(saldo)}).`);
      return;
    }
    const tujuan = tarikForm.metode === "Transfer Bank" ? tarikForm.rekening || "rekening terdaftar" : "tunai di mitra terdekat";
    addPengeluaran({ keterangan: `Penarikan saldo — ${tarikForm.metode} (${tujuan})`, nominal, kategori: "Penarikan Tunai" });
    setTarikForm({ nominal: "", metode: "Transfer Bank", rekening: "" });
    setTarikError("");
    setShowTarikModal(false);
  }

  if (loading) {
    return <div style={{ padding: "3rem", textAlign: "center", color: "#64748B" }}>Memuat Laporan Arus Kas...</div>;
  }

  return (
    <main className="finance-page" style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
     
        .finance-page * { min-width: 0; }

        @media (max-width: 900px) {
          .finance-page { padding: 1rem 1.1rem !important; }
        }

        @media (max-width: 768px) {
          .finance-page { padding: 0.85rem 0.7rem !important; }

        
          .finance-header-row { gap: 0.4rem !important; margin-bottom: 1rem !important; flex-wrap: nowrap !important; align-items: flex-start !important; }
          .finance-title-block { min-width: 0 !important; flex: 1 !important; }
          .finance-title-block h1 { font-size: 1.08rem !important; }
          .finance-title-block p { font-size: 0.66rem !important; line-height: 1.3 !important; }
          .finance-action-buttons { gap: 0.3rem !important; flex-shrink: 0 !important; flex-direction: column !important; }
          .finance-action-buttons button { padding: 0.4rem 0.6rem !important; font-size: 0.66rem !important; border-radius: 7px !important; white-space: nowrap !important; }

         
          .finance-stats-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 0.45rem !important; margin-bottom: 1rem !important; }
          .finance-stat-card { padding: 0.6rem 0.5rem !important; border-radius: 10px !important; }
          .finance-stat-head { gap: 0.35rem !important; margin-bottom: 0.35rem !important; flex-direction: column !important; align-items: flex-start !important; }
          .finance-stat-icon { padding: 0.3rem !important; border-radius: 7px !important; }
          .finance-stat-icon svg { width: 15px !important; height: 15px !important; }
          .finance-stat-label { font-size: 0.55rem !important; line-height: 1.2 !important; }
          .finance-stat-value { font-size: clamp(0.82rem, 3.9vw, 1.1rem) !important; line-height: 1.15 !important; letter-spacing: -0.02em !important; overflow-wrap: anywhere !important; }

       
          .history-table-container h3 { font-size: 0.85rem !important; padding: 0.85rem 0.75rem 0.6rem !important; }
          .history-table-container table { min-width: 0 !important; width: 100% !important; }
          .history-table-container th { font-size: 0.6rem !important; padding: 0.55rem 0.5rem !important; text-transform: uppercase; letter-spacing: .03em; white-space: nowrap; }
          .history-table-container td { font-size: 0.7rem !important; padding: 0.6rem 0.5rem !important; overflow-wrap: anywhere !important; vertical-align: middle !important; }
          .history-table-container td:first-child { white-space: nowrap !important; }
          .history-table-container td:last-child { white-space: nowrap !important; }

        
          .finance-modal { padding: 1rem 0.9rem !important; border-radius: 14px !important; max-height: 88vh !important; overflow-y: auto !important; }
          .finance-modal h2 { font-size: 0.98rem !important; }
          .finance-modal input, .finance-modal select { font-size: 0.82rem !important; padding: 0.55rem 0.7rem !important; }
          .finance-modal button { font-size: 0.8rem !important; }
        }

        @media (max-width: 380px) {
          .finance-stats-grid { gap: 0.3rem !important; }
          .finance-stat-card { padding: 0.5rem 0.4rem !important; }
          .history-table-container td { font-size: 0.66rem !important; }
        }
      `}} />

      <div className="finance-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", width: "100%", gap: "1rem" }}>
        <div className="finance-title-block">
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Keuangan</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau arus kas — pemasukan otomatis dari penjualan selesai, pengeluaran dicatat manual.</p>
        </div>
        <div className="finance-action-buttons" style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={() => setShowTarikModal(true)} style={{ background: "#10B981", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>Tarik Tunai</button>
          <button onClick={() => setShowAddModal(true)} style={{ background: "#EF4444", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Catat Pengeluaran</button>
        </div>
      </div>

      <div className="finance-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="finance-stat-card" style={{ background: "#10B981", padding: "1.25rem", borderRadius: "12px" }}>
          <div className="finance-stat-head" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div className="finance-stat-icon" style={{ background: "rgba(255,255,255,.2)", color: "#fff", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconWallet /></div>
            <span className="finance-stat-label" style={{ fontSize: "0.8rem", color: "rgba(255,255,255,.85)", fontWeight: 600 }}>Saldo Saat Ini</span>
          </div>
          <div className="finance-stat-value" style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff" }}>{formatRupiahRingkas(saldo)}</div>
        </div>
        <div className="finance-stat-card" style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div className="finance-stat-head" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div className="finance-stat-icon" style={{ background: "#D1FAE5", color: "#10B981", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconArrowUp /></div>
            <span className="finance-stat-label" style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Pemasukan</span>
          </div>
          <div className="finance-stat-value" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalMasuk)}</div>
        </div>
        <div className="finance-stat-card" style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div className="finance-stat-head" style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.5rem" }}>
            <div className="finance-stat-icon" style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.45rem", borderRadius: "8px", display: "flex" }}><IconArrowDown /></div>
            <span className="finance-stat-label" style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Pengeluaran</span>
          </div>
          <div className="finance-stat-value" style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalKeluar)}</div>
        </div>
      </div>

      <div className="history-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <h3 style={{ margin: 0, padding: "1.1rem 1.1rem 0.75rem", fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Riwayat Transaksi</h3>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "550px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "0.85rem 1.1rem", color: "#475569" }}>Tanggal</th>
                <th style={{ padding: "0.85rem 1.1rem", color: "#475569" }}>Keterangan</th>
                <th style={{ padding: "0.85rem 1.1rem", color: "#475569", textAlign: "right" }}>Nominal</th>
              </tr>
            </thead>
            <tbody>
              {riwayat.length === 0 && (
                <tr><td colSpan={3} style={{ padding: "1.25rem", textAlign: "center", color: "#94A3B8" }}>Belum ada transaksi lunas.</td></tr>
              )}
              {riwayat.map((r, i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "0.85rem 1.1rem", color: "#64748B" }}>{r.tanggal}</td>
                  <td style={{ padding: "0.85rem 1.1rem", color: "#1E293B", fontWeight: 500 }}>{r.keterangan}</td>
                  <td style={{ padding: "0.85rem 1.1rem", textAlign: "right", fontWeight: 700, color: r.tipe === "masuk" ? "#10B981" : "#EF4444" }}>{r.tipe === "masuk" ? "+ " : "− "}{formatRupiah(r.nominal)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    
      {showAddModal && (
        <div onClick={() => !submitting && setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="finance-modal" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "1.5rem", width: "420px", maxWidth: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#1E293B" }}>Catat Pengeluaran</h2>
              <button disabled={submitting} onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Keterangan Pengeluaran *</label>
                <input required value={form.keterangan} onChange={(e) => setForm({ ...form, keterangan: e.target.value })} placeholder="Contoh: Pembelian bibit & pupuk" style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Nominal Pengeluaran (Rp) *</label>
                <input required type="text" inputMode="numeric" value={formatInputRupiah(form.nominal)} onChange={(e) => setForm({ ...form, nominal: unformatInputRupiah(e.target.value) })} placeholder="0" style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Kategori</label>
                <select value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", outline: "none", boxSizing: "border-box" }}>
                  <option value="Bahan Baku">Bahan Baku</option>
                  <option value="Kemasan">Kemasan</option>
                  <option value="Logistik">Logistik</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" disabled={submitting} onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 700, cursor: "pointer" }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", background: "#EF4444", color: "white", fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Menyimpan..." : "Simpan Pengeluaran"}</button>
              </div>
            </form>
          </div>
        </div>
      )}

   
      {showTarikModal && (
        <div onClick={() => { if (!submitting) { setShowTarikModal(false); setTarikError(""); } }} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="finance-modal" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "1.5rem", width: "420px", maxWidth: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 800, color: "#1E293B" }}>Tarik Saldo</h2>
              <button disabled={submitting} onClick={() => { setShowTarikModal(false); setTarikError(""); }} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "#64748B" }}>Saldo tersedia: <strong style={{ color: "#10B981" }}>{formatRupiah(saldo)}</strong></p>
            <form onSubmit={handleTarikSubmit} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Nominal Penarikan (Rp) *</label>
                <input required type="text" inputMode="numeric" value={formatInputRupiah(tarikForm.nominal)} onChange={(e) => { setTarikForm({ ...tarikForm, nominal: unformatInputRupiah(e.target.value) }); setTarikError(""); }} placeholder="0" style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>Metode Pencairan</label>
                <select value={tarikForm.metode} onChange={(e) => setTarikForm({ ...tarikForm, metode: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", outline: "none", boxSizing: "border-box" }}>
                  <option value="Transfer Bank">Transfer Bank</option>
                  <option value="Tunai di Mitra Terdekat">Tunai di Mitra Terdekat</option>
                </select>
              </div>
              {tarikForm.metode === "Transfer Bank" && (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>No. Rekening Tujuan</label>
                  <input value={tarikForm.rekening} onChange={(e) => setTarikForm({ ...tarikForm, rekening: e.target.value })} placeholder="Contoh: BCA 1234567890 a.n. Budi" style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
                </div>
              )}
              {tarikError && <div style={{ background: "#FEE2E2", color: "#991B1B", fontSize: "0.8rem", padding: "0.6rem 0.8rem", borderRadius: "8px" }}>{tarikError}</div>}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" disabled={submitting} onClick={() => { setShowTarikModal(false); setTarikError(""); }} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 700, cursor: "pointer" }}>Batal</button>
                <button type="submit" disabled={submitting} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 800, cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>{submitting ? "Memproses..." : "Konfirmasi Penarikan"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}