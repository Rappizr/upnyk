"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";

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
  rawId: string; // ID UUID dari tabel pesanan
  noResi?: string;
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
const IconPrinter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

export default function PenjualanB2B() {
  const [pesananList, setPesananList] = useState<Pesanan[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Pesanan | null>(null);

  // MEMBACA PESANAN GROSIR DARI TABEL SUPABASE 'pesanan'
  const muatPesananB2B = useCallback(async () => {
    setLoading(true);
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

    // 1. Ambil data pesanan beserta detail produknya
    const { data: pesananData, error: pesananError } = await supabase
      .from("pesanan")
      .select(`
        id, jumlah, total_harga, status, created_at, admin_toko_id,
        produk ( id, nama, satuan )
      `)
      .eq("produsen_id", produsen.id)
      .order("created_at", { ascending: false });

    if (pesananError) {
      console.error("Gagal memuat pesanan B2B:", pesananError);
      setLoading(false);
      return;
    }

    // 2. Ambil data admin_toko untuk pemetaan nama & lokasi pembeli
    const { data: adminList } = await supabase
      .from("admin_toko")
      .select("id, nama_toko, alamat, kabupaten");
      
    const adminMap = new Map((adminList || []).map((a) => [a.id, a]));

    // 3. Pemetaan data
    const mapped: Pesanan[] = (pesananData || []).map((p: any) => {
      const tgl = new Date(p.created_at).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
      const adminObj = adminMap.get(p.admin_toko_id);
      const lokasiKirim = [adminObj?.alamat, adminObj?.kabupaten].filter(Boolean).join(", ") || "Alamat belum disetel";
      const codeId = p.id.slice(0, 8).toUpperCase();

      // Normalisasi status "Menunggu" menjadi "Baru" untuk tampilan UI
      let statusFormat: PesananStatus = (p.status as PesananStatus) || "Baru";
      if ((p.status as string) === "Menunggu") {
        statusFormat = "Baru";
      }

      return {
        id: codeId,
        pembeli: adminObj?.nama_toko || "Admin Toko PasarNusa",
        itemId: p.produk?.id || "",
        item: p.produk?.nama || "Komoditas",
        jumlah: Number(p.jumlah) || 1,
        satuan: p.produk?.satuan || "pcs",
        total: Number(p.total_harga) || 0,
        status: statusFormat,
        tanggal: tgl,
        alamatKirim: lokasiKirim,
        rawId: p.id,
        noResi: `PN-${codeId}`
      };
    });

    setPesananList(mapped);
    setLoading(false);
  }, []);

  useEffect(() => {
    muatPesananB2B();
  }, [muatPesananB2B]);

  // UPDATE STATUS DENGAN POTONG STOK DI DATABASE
  async function updatePesananStatusInDb(rawId: string, status: PesananStatus) {
    try {
      // A. Ambil data pesanan saat ini untuk mengetahui produk_id & jumlah
      const { data: pesananDetail } = await supabase
        .from("pesanan")
        .select("produk_id, jumlah, status")
        .eq("id", rawId)
        .maybeSingle();

      if (pesananDetail?.produk_id) {
        const targetStatus = ["Diproses", "Dikirim", "Selesai"];
        const isTarget = targetStatus.includes(status);
        const isLamaTarget = targetStatus.includes(pesananDetail.status);

        // Potong stok jika berubah dari 'Baru'/'Menunggu' ke 'Diproses'/'Selesai'
        if (isTarget && !isLamaTarget) {
          const { data: produkData } = await supabase
            .from("produk")
            .select("stok")
            .eq("id", pesananDetail.produk_id)
            .maybeSingle();

          if (produkData) {
            const stokSaatIni = Number(produkData.stok) || 0;
            const jumlahBeli = Number(pesananDetail.jumlah) || 0;
            const stokBaru = Math.max(0, stokSaatIni - jumlahBeli);

            const { error: errStok } = await supabase
              .from("produk")
              .update({ stok: stokBaru })
              .eq("id", pesananDetail.produk_id);

            if (errStok) {
              console.error("Gagal memotong stok:", errStok);
              alert(`Gagal memotong stok produk di database: ${errStok.message}`);
            }
          }
        }
      }

      // B. Update status di tabel `pesanan`
      const { error: errPesanan } = await supabase
        .from("pesanan")
        .update({ status: status })
        .eq("id", rawId);

      if (errPesanan) {
        console.error("Gagal update status pesanan:", errPesanan);
        alert(`Gagal mengubah status: ${errPesanan.message}`);
        return;
      }

      // C. Sinkronkan status di tabel `transaksi`
      let statusTx = "Pending";
      if (status === "Selesai") statusTx = "Lunas";
      if (status === "Dibatalkan") statusTx = "Gagal";

      await supabase
        .from("transaksi")
        .update({ status: statusTx })
        .eq("pesanan_id", rawId);

      await muatPesananB2B();
    } catch (err) {
      console.error("System error saat update status:", err);
    }
  }

  // FUNGSI CETAK RESI PENGIRIMAN
  function cetakResi(pesanan: Pesanan) {
    const windowCetak = window.open("", "_blank");
    if (!windowCetak) return;

    windowCetak.document.write(`
      <html>
        <head>
          <title>Resi Pengiriman #${pesanan.id}</title>
          <style>
            body { font-family: sans-serif; padding: 20px; color: #1e293b; max-width: 500px; margin: 0 auto; border: 2px dashed #000; }
            .header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 10px; margin-bottom: 15px; }
            .resi { font-size: 1.4rem; font-weight: bold; letter-spacing: 2px; }
            .section { margin-bottom: 12px; }
            .label { font-size: 0.75rem; color: #64748b; font-weight: bold; text-transform: uppercase; }
            .val { font-size: 0.95rem; font-weight: bold; }
            .grid { display: flex; justify-content: space-between; margin-bottom: 10px; }
            .footer { text-align: center; font-size: 0.7rem; color: #64748b; margin-top: 20px; border-top: 1px solid #ccc; padding-top: 8px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2 style="margin:0; font-size: 1.2rem;">PASARNUSA LOGISTIK</h2>
            <div class="resi">${pesanan.noResi}</div>
          </div>
          <div class="grid">
            <div>
              <div class="label">ID PESANAN</div>
              <div class="val">#${pesanan.id}</div>
            </div>
            <div style="text-align: right;">
              <div class="label">TANGGAL</div>
              <div class="val">${pesanan.tanggal}</div>
            </div>
          </div>
          <div class="section">
            <div class="label">PENERIMA (PEMBELI)</div>
            <div class="val">${pesanan.pembeli}</div>
            <div style="font-size: 0.85rem; margin-top: 2px;">${pesanan.alamatKirim}</div>
          </div>
          <div class="section">
            <div class="label">ISI PAKET / KOMODITAS</div>
            <div class="val">${pesanan.item} (${pesanan.jumlah} ${pesanan.satuan})</div>
          </div>
          <div class="footer">
            Harap tempelkan label ini pada kemasan barang sebelum dikirim.
          </div>
          <script>
            window.onload = function() { window.print(); }
          </script>
        </body>
      </html>
    `);
    windowCetak.document.close();
  }

  const filtered = useMemo(() => {
    return pesananList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        p.pembeli.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.item.toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pesananList, search, statusFilter]);

  const totalPendapatan = useMemo(
    () => pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0),
    [pesananList]
  );
  
  const totalAktif = useMemo(
    () => pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses").length,
    [pesananList]
  );

  function ubahStatus(status: PesananStatus) {
    if (!detail) return;
    updatePesananStatusInDb(detail.rawId, status);
    setDetail({ ...detail, status });
  }

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontFamily: "sans-serif" }}>
        Memuat Pesanan B2B Masuk...
      </div>
    );
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Penjualan B2B</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola pesanan grosir yang masuk secara live dari Admin Toko.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}>
            <IconStore />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{pesananList.length}</div>
            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Pesanan</div>
          </div>
        </div>

        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}>
            <IconWallet />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div>
            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Pendapatan Selesai</div>
          </div>
        </div>

        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}>
            <IconClock />
          </div>
          <div>
            <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div>
            <div style={{ fontSize: "0.8rem", color: "#64748B" }}>Perlu Ditindaklanjuti</div>
          </div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama pembeli, ID pesanan, atau produk..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
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
                <th style={{ padding: "1rem", color: "#475569" }}>ID Pesanan</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Admin Toko (Pembeli)</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Produk Komoditas</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Total Tagihan</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada pesanan masuk dari Admin Toko.</td></tr>
              )}
              {filtered.map((p) => {
                const s = statusStyle[p.status];
                return (
                  <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>
                      <span onClick={() => setDetail(p)} style={{ cursor: "pointer", color: "#10B981", textDecoration: "underline" }}>#{p.id}</span>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{p.pembeli}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{p.item} ({p.jumlah} {p.satuan})</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(p.total)}</td>
                    <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.status}</span></td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      {p.status === "Baru" ? (
                        <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center" }}>
                          <button onClick={() => updatePesananStatusInDb(p.rawId, "Diproses")} style={{ background: "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Terima</button>
                          <button onClick={() => updatePesananStatusInDb(p.rawId, "Dibatalkan")} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
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
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>Pesanan #{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Dibuat tanggal: {detail.tanggal}</p>

            {detail.status !== "Dibatalkan" ? (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.25rem" }}>
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
              <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.7rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem" }}>Pesanan ini dibatalkan</div>
            )}

            {detail.status !== "Dibatalkan" && (
              <button 
                onClick={() => cetakResi(detail)} 
                style={{ width: "100%", background: "#F8FAFC", border: "1px dashed #CBD5E1", padding: "0.6rem", borderRadius: "8px", color: "#334155", fontWeight: 600, fontSize: "0.8rem", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", marginBottom: "1rem" }}
              >
                <IconPrinter /> Cetak Resi Pengiriman ({detail.noResi})
              </button>
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
            </div>

            {detail.status !== "Selesai" && detail.status !== "Dibatalkan" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => ubahStatus("Dibatalkan")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Batalkan</button>
                {detail.status === "Baru" && <button onClick={() => ubahStatus("Diproses")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Proses Pesanan</button>}
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