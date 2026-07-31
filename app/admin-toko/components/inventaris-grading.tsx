"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/db";

type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface StokToko {
  id: string;
  produk_id?: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  grade: Grade;
  asalProdusen: string;
  live: boolean;
  lokasiRak?: string;
}

interface Props {
  stokList?: StokToko[];
  onRefresh?: () => void;
}

const IconBox = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconCheckCircle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

export default function InventarisGrading({ stokList: initialStokList, onRefresh }: Props) {
  const [inventarisDb, setInventarisDb] = useState<StokToko[]>(initialStokList || []);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<StokToko | null>(null);
  const [editJumlah, setEditJumlah] = useState(0);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  useEffect(() => {
    if (initialStokList && initialStokList.length > 0) {
      setInventarisDb(initialStokList);
    }
  }, [initialStokList]);

  const muatInventarisFromDb = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      let possibleIds: string[] = [];

      if (user) {
        possibleIds.push(user.id);
        const { data: adminToko } = await supabase
          .from("admin_toko")
          .select("id")
          .eq("profile_id", user.id)
          .maybeSingle();

        if (adminToko?.id) possibleIds.push(adminToko.id);
      }

      let query = supabase.from("inventaris").select("*").order("updated_at", { ascending: false });
      if (possibleIds.length > 0) {
        query = query.in("admin_toko_id", possibleIds);
      }

      let { data: invData, error: errInv } = await query;

      // Fallback jika tidak menemukan baris yang persis cocok
      if (!invData || invData.length === 0) {
        const { data: fallbackData } = await supabase
          .from("inventaris")
          .select("*")
          .order("updated_at", { ascending: false });
        invData = fallbackData;
      }

      if (errInv) throw errInv;

      if (invData && invData.length > 0) {
        const prodIds = invData.map((i) => i.produk_id).filter(Boolean);
        let prodMap = new Map();

        if (prodIds.length > 0) {
          const { data: prodList } = await supabase
            .from("produk")
            .select("id, nama, harga, satuan")
            .in("id", prodIds);

          if (prodList) {
            prodMap = new Map(prodList.map((pr) => [pr.id, pr]));
          }
        }

        const mapped: StokToko[] = invData.map((item: any) => {
          const prodObj = item.produk_id ? prodMap.get(item.produk_id) : null;
          const hargaBeliPasti = Number(item.harga_beli) || Number(prodObj?.harga) || 0;

          return {
            id: item.id,
            produk_id: item.produk_id,
            nama: item.nama_produk || prodObj?.nama || item.nama || "Komoditas Panen",
            jumlah: Number(item.stok) || 0,
            satuan: item.satuan || prodObj?.satuan || "pcs",
            hargaBeli: hargaBeliPasti,
            hargaJual: Math.round(hargaBeliPasti * 1.3),
            diskonPersen: 0,
            grade: item.grade || "A",
            asalProdusen: "Mitra Produsen",
            live: true,
            lokasiRak: item.lokasi_rak || "Gudang Utama",
          };
        });

        setInventarisDb(mapped);
      } else {
        setInventarisDb([]);
      }
    } catch (err) {
      console.error("Gagal muat inventaris:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatInventarisFromDb();

    const channel = supabase
      .channel("realtime-inventaris-stok")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventaris" },
        () => {
          muatInventarisFromDb();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [muatInventarisFromDb]);

  async function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;

    try {
      const { error: errInv } = await supabase
        .from("inventaris")
        .update({
          stok: editJumlah,
          updated_at: new Date().toISOString(),
        })
        .eq("id", editItem.id);

      if (errInv) throw errInv;

      let updatedEtalase = false;

      if (editItem.produk_id) {
        const { error: errEt1 } = await supabase
          .from("etalase")
          .update({ stok: editJumlah, updated_at: new Date().toISOString() })
          .eq("produk_id", editItem.produk_id);

        if (!errEt1) updatedEtalase = true;
      }

      if (!updatedEtalase && editItem.nama) {
        await supabase
          .from("etalase")
          .update({ stok: editJumlah, updated_at: new Date().toISOString() })
          .ilike("nama_produk", editItem.nama.trim());
      }

      showToast(`Stok ${editItem.nama} berhasil disesuaikan di Gudang & Etalase!`);
      setEditItem(null);
      await muatInventarisFromDb();
      if (onRefresh) onRefresh();
    } catch (err: any) {
      showToast(`Gagal memperbarui stok: ${err.message || "Terjadi kesalahan"}`);
    }
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return inventarisDb.filter(
      (s) => !q || s.nama.toLowerCase().includes(q) || s.asalProdusen.toLowerCase().includes(q)
    );
  }, [inventarisDb, search]);

  const totalNilaiStok = inventarisDb.reduce((s, x) => s + x.jumlah * x.hargaBeli, 0);

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif", position: "relative" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .grading-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          main h1 { font-size: 1.15rem !important; }
          main p { font-size: 0.62rem !important; line-height: 1.2 !important; }

          .grading-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.4rem !important;
            margin-bottom: 0.85rem !important;
          }
          .grading-stat-card {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            gap: 0.5rem !important;
          }
          .grading-stat-card > div:first-child {
            padding: 0.35rem !important;
            border-radius: 6px !important;
          }
          .grading-stat-card > div:last-child > div:first-child {
            font-size: 0.85rem !important;
          }
          .grading-stat-card > div:last-child > div:last-child {
            font-size: 0.6rem !important;
          }

          /* RESPONSIP TABEL UNTUK MOBILE */
          .inventory-table-wrapper {
            overflow-x: auto !important;
            -webkit-overflow-scrolling: touch;
          }
          .inventory-table-wrapper table {
            min-width: 520px !important;
          }
          .inventory-table-wrapper th, .inventory-table-wrapper td {
            padding: 0.6rem 0.5rem !important;
            font-size: 0.72rem !important;
          }
        }
      `
      }} />

      {toastMessage && (
        <div style={{ position: "fixed", top: "20px", right: "20px", zIndex: 9999, background: "#1E293B", color: "white", padding: "0.85rem 1.25rem", borderRadius: "10px", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)", display: "flex", alignItems: "center", gap: "0.75rem", fontSize: "0.88rem", fontWeight: 600 }}>
          <span style={{ color: "#10B981", display: "flex" }}><IconCheckCircle /></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#1E293B" }}>Inventaris Gudang</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Pantau seluruh ketersediaan stok barang dan komoditas di gudang toko.</p>
      </div>

      <div className="grading-stats-grid" style={{ marginBottom: "1.25rem" }}>
        <div className="grading-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBox /></div>
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{inventarisDb.length}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Jenis Produk</div>
          </div>
        </div>

        <div className="grading-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{formatRupiah(totalNilaiStok)}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Nilai Aset Stok</div>
          </div>
        </div>
      </div>

      <div style={{ position: "relative", marginBottom: "1.25rem", maxWidth: "420px" }}>
        <input 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          placeholder="Cari nama produk atau produsen..." 
          style={{ width: "100%", padding: "0.55rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }} 
        />
      </div>

      {/* TABEL RESPONSIP (DESTOP & MOBILE DENGAN SCROLL) */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div className="inventory-table-wrapper">
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Produk</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Asal / Sumber</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Sisa Stok</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Harga Beli / Modal</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#64748B" }}>Memuat data stok gudang...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada stok barang di gudang. Barang yang diterima dari produsen akan otomatis tersimpan di sini.</td></tr>
              ) : (
                filtered.map((s) => (
                  <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{s.nama}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>
                      <span style={{ background: "#F1F5F9", padding: "0.25rem 0.6rem", borderRadius: "6px", fontSize: "0.78rem", fontWeight: 600, color: "#475569" }}>
                        {s.asalProdusen}
                      </span>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 800, color: s.jumlah > 0 ? "#10B981" : "#EF4444" }}>
                      {s.jumlah} {s.satuan}
                    </td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{formatRupiah(s.hargaBeli)}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button 
                        onClick={() => { setEditItem(s); setEditJumlah(s.jumlah); }} 
                        style={{ background: "#F1F5F9", border: "1px solid #CBD5E1", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}
                      >
                        Sesuaikan Stok
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.45)", backdropFilter: "blur(2px)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", padding: "1.25rem", width: "360px", maxWidth: "100%", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#1E293B" }}>Sesuaikan Stok {editItem.nama}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", margin: "0.85rem 0 0.3rem" }}>Jumlah Stok Saat Ini ({editItem.satuan})</label>
              <input required type="number" min="0" value={editJumlah} onChange={(e) => setEditJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }} />
              <button type="submit" style={{ width: "100%", padding: "0.55rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>Simpan Perubahan</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}