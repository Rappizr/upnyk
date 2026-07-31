"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase, supabaseAdmin } from "@/lib/db";

export type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface Pembelian {
  id: string;
  rawId: String;
  produsenId?: string;
  produkId?: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan?: string;
  hargaSatuan?: number;
  total: number;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan" | "Baru";
  tanggal: string;
  noResi?: string;
  fotoProduk?: string;
  rating?: number;
  fotoUlasan?: string;
  keteranganUlasan?: string;
  lokasiProdusen?: string;
}

export interface PenjualanItem {
  id: string;
  produk_id: string;
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
  foto?: string | null;
}

export interface Penjualan {
  id: string;
  kodePesanan?: string;
  pembeli: string;
  noHpPembeli?: string;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
  status: "Belum Dibayar" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";
  escrowStatus?: "Ditahan" | "Tersalur" | "Disengketakan";
  alamatPembeli?: string;
  metodePembayaran?: string;
  buktiPembayaran?: string | null;
  noResi?: string;
  items?: PenjualanItem[];
}

const WARNA_UTAMA = "#F59E0B";
const WARNA_UTAMA_GELAP = "#D97706";

const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14 14"></polyline></svg>;
const IconBox = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconPackage = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

const LANGKAH = [
  { key: "Baru", label: "Menunggu", icon: IconClock },
  { key: "Diproses", label: "Diproses", icon: IconBox },
  { key: "Dikirim", label: "Dikirim", icon: IconTruck },
  { key: "Selesai", label: "Diterima", icon: IconCheck },
] as const;

function indeksLangkah(status?: string) {
  const st = String(status || "").toLowerCase();
  if (st === "menunggu" || st === "baru" || st === "belum dibayar" || st === "pending") return 0;
  if (st === "diproses") return 1;
  if (st === "dikirim") return 2;
  if (st === "diterima" || st === "selesai") return 3;
  return 0;
}

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

interface Props {
  pembelianList: Pembelian[];
  penjualanList?: Penjualan[];
  terimaPesanan: (id: string, grade: Grade, rating?: number, fotoUlasan?: string, keteranganUlasan?: string) => void;
  updateStatusPenjualan?: (orderId: string, status: string, noResi?: string) => Promise<void>;
  alamatToko?: string;
  tabDefault?: "produsen-toko" | "toko-pembeli";
  onRefreshData?: () => void;
}

export default function PelacakanPesanan({
  pembelianList = [],
  penjualanList = [],
  terimaPesanan,
  updateStatusPenjualan,
  tabDefault = "produsen-toko",
  onRefreshData,
}: Props) {
  const [activeTab, setActiveTab] = useState<"produsen-toko" | "toko-pembeli">(tabDefault);
  const [modalTerimaItem, setModalTerimaItem] = useState<Pembelian | null>(null);
  const [gradeInput, setGradeInput] = useState<Grade>("A");
  const [ratingInput, setRatingInput] = useState(5);
  const [keteranganInput, setKeteranganInput] = useState("");
  const [fotoUlasanInput, setFotoUlasanInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [notifState, setNotifState] = useState<{ open: boolean; title: string; message: string; type: "success" | "error" }>({
    open: false,
    title: "",
    message: "",
    type: "success"
  });

  const [filterPembelian, setFilterPembelian] = useState<string>("Semua");
  const [filterPenjualan, setFilterPenjualan] = useState<string>("Semua");
  const [modalResiOrder, setModalResiOrder] = useState<Penjualan | null>(null);
  const [inputNoResi, setInputNoResi] = useState("");
  const [modalBuktiUrl, setModalBuktiUrl] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [enrichedPenjualanList, setEnrichedPenjualanList] = useState<Penjualan[]>([]);

  useEffect(() => {
    setActiveTab(tabDefault);
  }, [tabDefault]);

  useEffect(() => {
    if (!onRefreshData) return;

    const channel = supabase
      .channel("realtime-pelacakan-pesanan")
      .on("postgres_changes", { event: "*", schema: "public", table: "pesanan" }, () => onRefreshData())
      .on("postgres_changes", { event: "*", schema: "public", table: "transaksi" }, () => onRefreshData())
      .on("postgres_changes", { event: "*", schema: "public", table: "inventaris" }, () => onRefreshData())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [onRefreshData]);

  function bukaModalTerima(item: Pembelian) {
    setGradeInput("A");
    setRatingInput(5);
    setKeteranganInput("");
    setFotoUlasanInput("");
    setModalTerimaItem(item);
  }

  async function kirimTerimaPesanan() {
    if (!modalTerimaItem || submitting) return;
    setSubmitting(true);

    try {
      const dbClient = supabaseAdmin || supabase;
      const { data: { user } } = await supabase.auth.getUser();
      const { data: adminToko } = user ? await dbClient.from("admin_toko").select("id").eq("profile_id", user.id).maybeSingle() : { data: null };

      const rawIdStr = String(modalTerimaItem.rawId || modalTerimaItem.id || "").replace(/^[#PO-]+/g, "").trim();

      let targetPesanan: any = null;
      if (modalTerimaItem.rawId && typeof modalTerimaItem.rawId === "string" && modalTerimaItem.rawId.length > 20) {
        const { data } = await dbClient.from("pesanan").select("id, produk_id, produsen_id").eq("id", modalTerimaItem.rawId).maybeSingle();
        targetPesanan = data;
      }

      if (!targetPesanan && rawIdStr) {
        const { data: pesList } = await dbClient.from("pesanan").select("id, produk_id, produsen_id, kode_pesanan");
        if (pesList) {
          targetPesanan = pesList.find((p: any) =>
            p.id === rawIdStr ||
            (p.id && p.id.toLowerCase().startsWith(rawIdStr.toLowerCase())) ||
            (p.kode_pesanan && (
              p.kode_pesanan.toUpperCase() === rawIdStr.toUpperCase() ||
              p.kode_pesanan.toUpperCase() === ("PN-" + rawIdStr.toUpperCase()) ||
              p.kode_pesanan.toUpperCase() === ("PO-" + rawIdStr.toUpperCase())
            ))
          ) || null;
        }
      }

      // Step 1: Cari produk_id dari berbagai sumber
      let pTargetId: string | null = targetPesanan?.produk_id || modalTerimaItem.produkId || null;
      let pProdusenId: string | null = modalTerimaItem.produsenId || targetPesanan?.produsen_id || null;

      if (!pTargetId) {
        // Cari semua produk milik produsen ini
        const produkQuery = pProdusenId
          ? dbClient.from("produk").select("id, nama").eq("produsen_id", pProdusenId)
          : dbClient.from("produk").select("id, nama");
        const { data: produkList } = await produkQuery;
        if (produkList && produkList.length > 0) {
          const itemClean = (modalTerimaItem.item || "").toLowerCase().trim();
          let match: any = null;
          if (itemClean && itemClean !== "komoditas") {
            match = produkList.find((p: any) => p.nama.toLowerCase().trim() === itemClean);
            if (!match) match = produkList.find((p: any) =>
              p.nama.toLowerCase().includes(itemClean) || itemClean.includes(p.nama.toLowerCase())
            );
          }
          if (!match) match = produkList[0]; // fallback: produk pertama milik produsen ini
          if (match) pTargetId = match.id;
        }
      }

      // Step 2: Update baris pesanan
      const updatePesData: any = {
        status: "selesai",
        rating: ratingInput,
        ulasan: keteranganInput || null,
        updated_at: new Date().toISOString()
      };
      if (pTargetId) updatePesData.produk_id = pTargetId;
      if (pProdusenId) updatePesData.produsen_id = pProdusenId;

      if (targetPesanan?.id) {
        await dbClient.from("pesanan").update(updatePesData).eq("id", targetPesanan.id);
      } else if (rawIdStr) {
        await dbClient.from("pesanan").update(updatePesData).ilike("id", `${rawIdStr}%`);
      }

      // Step 3: Update inventaris
      let existingInv = null;

      if (pTargetId) {
        const { data } = await dbClient
          .from("inventaris")
          .select("id, stok, admin_toko_id")
          .eq("produk_id", pTargetId)
          .maybeSingle();
        existingInv = data;
      }

      if (!existingInv && modalTerimaItem.item) {
        const { data } = await dbClient
          .from("inventaris")
          .select("id, stok, admin_toko_id")
          .ilike("nama_produk", modalTerimaItem.item)
          .maybeSingle();
        existingInv = data;
      }

      if (existingInv) {
        const stokBaru = (Number(existingInv.stok) || 0) + Number(modalTerimaItem.jumlah);
        const updateData: any = { stok: stokBaru, updated_at: new Date().toISOString() };
        if (!existingInv.admin_toko_id && adminToko?.id) updateData.admin_toko_id = adminToko.id;
        const { error: errUpdateInv } = await dbClient.from("inventaris").update(updateData).eq("id", existingInv.id);
        if (errUpdateInv) throw errUpdateInv;
      } else {
        const { error: errInsertInv } = await dbClient.from("inventaris").insert({
          admin_toko_id: adminToko?.id || null,
          produk_id: pTargetId || null,
          nama_produk: modalTerimaItem.item,
          stok: modalTerimaItem.jumlah,
          harga_beli: modalTerimaItem.hargaSatuan || 0,
          grade: gradeInput || "A",
          satuan: modalTerimaItem.satuan || "pcs",
          updated_at: new Date().toISOString()
        });
        if (errInsertInv) throw errInsertInv;
      }

      // Step 4: Update rating di tabel produk LANGSUNG
      if (pTargetId) {
        // Ambil semua rating untuk produk ini
        const { data: listPesananProduk } = await dbClient
          .from("pesanan")
          .select("rating")
          .eq("produk_id", pTargetId)
          .not("rating", "is", null);

        const ratings = (listPesananProduk || []).map((p: any) => Number(p.rating)).filter((r: number) => !isNaN(r) && r > 0);
        // Pastikan rating baru ikut dihitung
        if (!ratings.includes(ratingInput)) ratings.push(ratingInput);
        if (ratings.length === 0) ratings.push(ratingInput);

        const totalUlasan = ratings.length;
        const avgRating = Number((ratings.reduce((a: number, b: number) => a + b, 0) / totalUlasan).toFixed(1));

        await dbClient.from("produk").update({ rating: avgRating, total_ulasan: totalUlasan }).eq("id", pTargetId);
      } else if (pProdusenId) {
        // Fallback akhir: update semua produk milik produsen ini jika pTargetId masih null
        await dbClient.from("produk").update({ rating: ratingInput, total_ulasan: 1 }).eq("produsen_id", pProdusenId);
      }

      const itemNama = modalTerimaItem.item;
      const itemId = modalTerimaItem.id;

      setModalTerimaItem(null);

      if (terimaPesanan) {
        await terimaPesanan(itemId, gradeInput, ratingInput, fotoUlasanInput || undefined, keteranganInput || undefined);
      }
      if (onRefreshData) onRefreshData();

      setNotifState({
        open: true,
        type: "success",
        title: "Pesanan Berhasil Diterima!",
        message: `Stok ${itemNama} telah berhasil ditambahkan ke Inventaris Gudang, dan ulasan Anda telah terkirim.`
      });
    } catch (err: any) {
      const errorMsg = err?.message || err?.details || (typeof err === "object" ? JSON.stringify(err) : String(err));
      console.error("Detail Error penerimaan pesanan:", errorMsg, err);

      setNotifState({
        open: true,
        type: "error",
        title: "Gagal Memproses Pesanan",
        message: errorMsg || "Terjadi kesalahan sistem saat memproses penerimaan barang."
      });
    } finally {
      setSubmitting(false);
    }
  }

  async function handleUbahStatusPenjualan(orderId: string, status: string, resi?: string) {
    if (!updateStatusPenjualan) return;
    setActionLoadingId(orderId);
    try {
      await updateStatusPenjualan(orderId, status, resi);
      if (onRefreshData) onRefreshData();
    } catch (e) {
      console.error("Error ubah status:", e);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleKirimResi() {
    if (!modalResiOrder || !inputNoResi.trim()) return;
    const targetId = modalResiOrder.kodePesanan || modalResiOrder.id;
    await handleUbahStatusPenjualan(targetId, "Dikirim", inputNoResi.trim());
    setModalResiOrder(null);
    setInputNoResi("");
  }

  const pembelianFiltered = pembelianList.filter((pb) => {
    if (filterPembelian === "Semua") return true;
    const st = String(pb.status || "").toLowerCase();
    const f = filterPembelian.toLowerCase();
    if (f === "belum dibayar") return st === "belum dibayar" || st === "menunggu" || st === "baru" || st === "pending";
    if (f === "selesai") return st === "selesai" || st === "diterima";
    return st === f;
  });

  const penjualanFiltered = enrichedPenjualanList.filter((pj) => {
    if (filterPenjualan === "Semua") return true;
    return (pj.status || "Belum Dibayar") === filterPenjualan;
  });

  return (
    <div style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif" }}>
      {/* TABS SUBNAVIGATION */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("produsen-toko")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "produsen-toko" ? WARNA_UTAMA : "#F1F5F9",
            color: activeTab === "produsen-toko" ? "#fff" : "#64748B",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          📦 Produsen ke Toko
        </button>
        <button
          onClick={() => setActiveTab("toko-pembeli")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "toko-pembeli" ? WARNA_UTAMA : "#F1F5F9",
            color: activeTab === "toko-pembeli" ? "#fff" : "#64748B",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>🛍️ Toko ke Pembeli</span>
          {enrichedPenjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length > 0 && (
            <span style={{ background: "#EF4444", color: "white", fontSize: "0.7rem", borderRadius: "999px", padding: "1px 6px", fontWeight: 800 }}>
              {enrichedPenjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length}
            </span>
          )}
        </button>
      </div>

      {/* PRODUSEN KE TOKO TAB */}
      {activeTab === "produsen-toko" && (
        <div>
          {/* FILTER PILLS */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((st) => {
              const count = st === "Semua"
                ? pembelianList.length
                : pembelianList.filter((pb) => {
                    const s = String(pb.status || "").toLowerCase();
                    const f = st.toLowerCase();
                    if (f === "belum dibayar") return s === "belum dibayar" || s === "menunggu" || s === "baru" || s === "pending";
                    if (f === "selesai") return s === "selesai" || s === "diterima";
                    return s === f;
                  }).length;
              const isAktif = filterPembelian === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterPembelian(st)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    border: isAktif ? `1px solid ${WARNA_UTAMA}` : "1px solid #E2E8F0",
                    background: isAktif ? "#FFFBEB" : "#fff",
                    color: isAktif ? WARNA_UTAMA_GELAP : "#64748B",
                    fontSize: "0.78rem",
                    fontWeight: isAktif ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>{st}</span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {pembelianFiltered.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
              Belum ada pesanan bahan baku pada status <strong>{filterPembelian}</strong>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {pembelianFiltered.map((p) => {
                const langkahAktif = indeksLangkah(p.status);

                let displayStatus = "Belum Dibayar";
                const st = String(p.status || "").toLowerCase();
                if (st === "diproses") displayStatus = "Diproses";
                else if (st === "dikirim") displayStatus = "Dikirim";
                else if (st === "selesai" || st === "diterima") displayStatus = "Selesai";
                else if (st === "dibatalkan") displayStatus = "Dibatalkan";

                let badgeBg = "#FEF3C7";
                let badgeColor = "#D97706";
                if (displayStatus === "Diproses") { badgeBg = "#DBEAFE"; badgeColor = "#1D4ED8"; }
                if (displayStatus === "Dikirim") { badgeBg = "#E0E7FF"; badgeColor = "#4338CA"; }
                if (displayStatus === "Selesai") { badgeBg = "#D1FAE5"; badgeColor = "#047857"; }
                if (displayStatus === "Dibatalkan") { badgeBg = "#FEE2E2"; badgeColor = "#B91C1C"; }

                return (
                  <div key={p.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>#{p.id}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>• {p.tanggal}</span>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: WARNA_UTAMA_GELAP, background: "#FEF3C7", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                          🏭 Produsen: {p.produsen}
                        </span>
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: badgeColor, background: badgeBg, padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                        {displayStatus}
                      </span>
                    </div>

                    <div style={{ padding: "1.1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                            <IconUser /> Produsen: {p.produsen}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                            <IconMapPin />
                            <span>{p.lokasiProdusen || "Lokasi produsen terdaftar"}</span>
                          </div>
                        </div>

                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".02em" }}>STATUS TRACKING</div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginTop: "2px" }}>{displayStatus}</div>
                          </div>
                          <div style={{ marginTop: "0.5rem" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>TOTAL BELANJA BAHAN BAKU</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>{formatRupiah(p.total)}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Rincian Bahan Baku Dipesan:</div>
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", fontSize: "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                              {p.fotoProduk ? (
                                <div style={{ width: "28px", height: "28px", borderRadius: "4px", overflow: "hidden", border: "1px solid #CBD5E1", flexShrink: 0 }}>
                                  <img src={p.fotoProduk} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ) : (
                                <div style={{ width: "28px", height: "28px", borderRadius: "4px", background: "#FEF3C7", color: WARNA_UTAMA_GELAP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <IconPackage />
                                </div>
                              )}
                              <span style={{ color: "#1E293B", fontWeight: 600 }}>{p.item} <span style={{ color: "#64748B", fontWeight: 400 }}>× {p.jumlah} {p.satuan || "pcs"}</span></span>
                            </div>
                            <span style={{ color: "#475569", fontWeight: 700 }}>{formatRupiah(p.total)}</span>
                          </div>
                        </div>
                      </div>

                      {p.noResi && (
                        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem", color: "#1E40AF" }}>
                          📦 <strong>No. Resi Pengiriman:</strong> <code style={{ background: "#DBEAFE", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>{p.noResi}</code>
                        </div>
                      )}

                      <div style={{ padding: "0.5rem 0.5rem 1rem" }}>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          {LANGKAH.map((l, i) => {
                            const Icon = l.icon;
                            const selesai = i <= langkahAktif;
                            return (
                              <div key={l.key} style={{ display: "flex", alignItems: "center", flex: i < LANGKAH.length - 1 ? 1 : "unset" }}>
                                <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                  <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: selesai ? WARNA_UTAMA : "#E2E8F0", color: selesai ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <Icon />
                                  </div>
                                  <span style={{ fontSize: "0.65rem", fontWeight: 600, color: selesai ? "#1E293B" : "#94A3B8" }}>{l.label}</span>
                                </div>
                                {i < LANGKAH.length - 1 && <div style={{ flex: 1, height: "3px", background: i < langkahAktif ? WARNA_UTAMA : "#E2E8F0" }} />}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {p.status === "Dikirim" && (
                        <div style={{ display: "flex", justifyContent: "flex-end" }}>
                          <button
                            onClick={() => bukaModalTerima(p)}
                            style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, fontSize: "0.8rem", cursor: "pointer" }}
                          >
                            Pesanan Diterima & Beri Ulasan
                          </button>
                        </div>
                      )}

                      {(p.status === "Selesai" || p.status === "Diterima" || (p.status || "").toLowerCase() === "selesai") && (
                        <div style={{ display: "flex", justifyContent: "flex-end", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                          <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, background: "#D1FAE5", padding: "0.4rem 0.8rem", borderRadius: "6px" }}>
                            ✓ Pesanan Diterima & Stok Ditambahkan {p.rating ? `(Rating: ${p.rating}★)` : ""}
                          </span>
                          <button
                            onClick={() => bukaModalTerima(p)}
                            style={{ padding: "0.4rem 0.82rem", borderRadius: "6px", border: `1px solid ${WARNA_UTAMA}`, background: "#fff", color: WARNA_UTAMA_GELAP, fontWeight: 700, fontSize: "0.75rem", cursor: "pointer" }}
                          >
                            ⭐ {p.rating ? "Edit Ulasan & Rating" : "Beri Rating & Ulasan"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}


      {activeTab === "toko-pembeli" && (
        <div>
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((st) => {
              const count = st === "Semua" ? enrichedPenjualanList.length : enrichedPenjualanList.filter(p => (p.status || "Belum Dibayar") === st).length;
              const isAktif = filterPenjualan === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterPenjualan(st)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    border: isAktif ? `1px solid ${WARNA_UTAMA}` : "1px solid #E2E8F0",
                    background: isAktif ? "#FFFBEB" : "#fff",
                    color: isAktif ? WARNA_UTAMA_GELAP : "#64748B",
                    fontSize: "0.78rem",
                    fontWeight: isAktif ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>{st}</span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {penjualanFiltered.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
              Belum ada pesanan pembeli pada status <strong>{filterPenjualan}</strong>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {penjualanFiltered.map((pj) => {
                const targetId = pj.kodePesanan || pj.id;
                const isBusy = actionLoadingId === targetId;

                let badgeBg = "#FEF3C7";
                let badgeColor = "#D97706";
                if (pj.status === "Diproses") { badgeBg = "#DBEAFE"; badgeColor = "#1D4ED8"; }
                if (pj.status === "Dikirim") { badgeBg = "#E0E7FF"; badgeColor = "#4338CA"; }
                if (pj.status === "Selesai") { badgeBg = "#D1FAE5"; badgeColor = "#047857"; }
                if (pj.status === "Dibatalkan") { badgeBg = "#FEE2E2"; badgeColor = "#B91C1C"; }

                return (
                  <div key={pj.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>#{pj.kodePesanan || pj.id}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>• {pj.tanggal}</span>
                        {pj.escrowStatus === "Tersalur" ? (
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#065F46", background: "#D1FAE5", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                            🛡️ Escrow: Dana Tersalur ke Toko
                          </span>
                        ) : (
                          <span style={{ fontSize: "0.7rem", fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "0.15rem 0.5rem", borderRadius: "6px" }}>
                            🛡️ Escrow: Dana Ditahan Admin Platform
                          </span>
                        )}
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: badgeColor, background: badgeBg, padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                        {pj.status}
                      </span>
                    </div>

                    <div style={{ padding: "1.1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                            <IconUser /> {pj.pembeli} {pj.noHpPembeli && <span style={{ fontWeight: 400, color: "#64748B", fontSize: "0.75rem" }}>({pj.noHpPembeli})</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                            <IconMapPin />
                            <span>{pj.alamatPembeli || "Alamat pengiriman belum diisi"}</span>
                          </div>
                        </div>

                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".02em" }}>METODE PEMBAYARAN</div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginTop: "2px" }}>{pj.metodePembayaran || "QRIS"}</div>
                            {pj.buktiPembayaran && (
                              <button
                                onClick={() => setModalBuktiUrl(pj.buktiPembayaran || null)}
                                style={{ marginTop: "0.4rem", border: "none", background: "none", color: "#2563EB", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                              >
                                🖼️ Lihat Bukti Transfer
                              </button>
                            )}
                          </div>
                          <div style={{ marginTop: "0.5rem" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>TOTAL BELANJA</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>{formatRupiah(pj.total)}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Rincian Barang Dipesan:</div>
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                          {(pj.items && pj.items.length > 0) ? (
                            pj.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0.85rem", borderBottom: idx < pj.items!.length - 1 ? "1px solid #F1F5F9" : "none", fontSize: "0.8rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                  {it.foto && (
                                    <div style={{ width: "28px", height: "28px", borderRadius: "4px", overflow: "hidden", border: "1px solid #CBD5E1", flexShrink: 0 }}>
                                      <img src={it.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                  )}
                                  <span style={{ color: "#1E293B", fontWeight: 600 }}>{it.nama} <span style={{ color: "#64748B", fontWeight: 400 }}>× {it.jumlah}</span></span>
                                </div>
                                <span style={{ color: "#475569", fontWeight: 700 }}>{formatRupiah(it.subtotal || (it.harga * it.jumlah))}</span>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: "0.6rem 0.85rem", fontSize: "0.8rem", color: "#475569" }}>
                              {pj.produk} ({pj.jumlah} pcs)
                            </div>
                          )}
                        </div>
                      </div>

                      {pj.noResi && (
                        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem", color: "#1E40AF" }}>
                          📦 <strong>No. Resi Pengiriman:</strong> <code style={{ background: "#DBEAFE", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>{pj.noResi}</code>
                        </div>
                      )}

                      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {(pj.status === "Belum Dibayar" || !pj.status) && (
                          <>
                            <button
                              disabled={isBusy}
                              onClick={() => handleUbahStatusPenjualan(targetId, "Dibatalkan")}
                              style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#991B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                            >
                              Batalkan
                            </button>
                            <button
                              disabled={isBusy}
                              onClick={() => handleUbahStatusPenjualan(targetId, "Diproses")}
                              style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                            >
                              {isBusy ? "Memproses..." : "Konfirmasi Pembayaran & Proses"}
                            </button>
                          </>
                        )}

                        {pj.status === "Diproses" && (
                          <button
                            disabled={isBusy}
                            onClick={() => { setModalResiOrder(pj); setInputNoResi(`NUSA-${Date.now().toString().slice(-6)}`); }}
                            style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            <IconTruck />
                            <span>Kirim Pesanan & Input Resi</span>
                          </button>
                        )}

                        {pj.status === "Dikirim" && (
                          <button
                            disabled={isBusy}
                            onClick={() => handleUbahStatusPenjualan(targetId, "Selesai")}
                            style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            <IconCheck />
                            <span>{isBusy ? "Menyelesaikan..." : "Tandai Pesanan Selesai"}</span>
                          </button>
                        )}

                        {pj.status === "Selesai" && (
                          <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, background: "#D1FAE5", padding: "0.4rem 0.8rem", borderRadius: "6px" }}>
                            ✓ Transaksi Selesai
                          </span>
                        )}
                        {pj.status === "Dibatalkan" && (
                          <span style={{ fontSize: "0.78rem", color: "#B91C1C", fontWeight: 700, background: "#FEE2E2", padding: "0.4rem 0.8rem", borderRadius: "6px" }}>
                            ✕ Pesanan Dibatalkan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {modalResiOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1E293B" }}>Kirim Pesanan #{modalResiOrder.kodePesanan || modalResiOrder.id}</div>
              <button onClick={() => setModalResiOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "1rem", lineHeight: 1.4 }}>
              Masukkan nomor resi pengiriman atau nama kurir pengantar untuk pembeli <strong>{modalResiOrder.pembeli}</strong>.
            </p>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>Nomor Resi / Kurir</label>
              <input
                type="text"
                value={inputNoResi}
                onChange={(e) => setInputNoResi(e.target.value)}
                placeholder="Contoh: NUSA-882199 / Kurir Toko"
                style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button onClick={() => setModalResiOrder(null)} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button onClick={handleKirimResi} style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Konfirmasi Kirim</button>
            </div>
          </div>
        </div>
      )}


      {modalTerimaItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "100%", maxWidth: "460px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 800, fontSize: "1.1rem", color: "#1E293B", marginBottom: "0.25rem" }}>
              Konfirmasi Terima & Ulas Produk
            </div>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "1rem" }}>
              Terima <strong>{modalTerimaItem.item}</strong> ({modalTerimaItem.jumlah} {modalTerimaItem.satuan || "pcs"}). Stok akan langsung masuk ke Inventaris Gudang Toko.
            </p>


            <div style={{ marginBottom: "1rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                Rating Kualitas Komoditas
              </label>
              <div style={{ display: "flex", gap: "6px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRatingInput(star)}
                    style={{
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: star <= ratingInput ? "#F59E0B" : "#CBD5E1",
                      transition: "color 0.15s"
                    }}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>


            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                Ulasan / Catatan Kualitas
              </label>
              <textarea
                rows={3}
                value={keteranganInput}
                onChange={(e) => setKeteranganInput(e.target.value)}
                placeholder="Contoh: Barang bagus, kualitas renyah dan kemasan rapi..."
                style={{
                  width: "100%",
                  padding: "0.6rem",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: "0.85rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button
                onClick={() => setModalTerimaItem(null)}
                style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontWeight: 600, cursor: "pointer" }}
              >
                Batal
              </button>
              <button
                onClick={kirimTerimaPesanan}
                disabled={submitting}
                style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, cursor: "pointer" }}
              >
                {submitting ? "Memproses..." : "Konfirmasi & Masukkan Stok"}
              </button>
            </div>
          </div>
        </div>
      )}

      {modalBuktiUrl && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.25rem", width: "100%", maxWidth: "440px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1E293B" }}>Bukti Transfer Pembayaran</div>
              <button onClick={() => setModalBuktiUrl(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: "1rem", maxHeight: "360px", minHeight: "140px", display: "flex", justifyContent: "center", alignItems: "center", background: "#F8FAFC" }}>
              <img
                src={modalBuktiUrl}
                alt="Bukti Transfer"
                style={{ maxWidth: "100%", maxHeight: "360px", objectFit: "contain" }}
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                  const container = (e.target as HTMLElement).parentElement;
                  if (container && !container.querySelector(".bukti-fallback-msg")) {
                    const msg = document.createElement("div");
                    msg.className = "bukti-fallback-msg";
                    msg.style.padding = "1.25rem 1rem";
                    msg.style.color = "#475569";
                    msg.style.fontSize = "0.85rem";
                    msg.style.lineHeight = "1.5";
                    msg.innerHTML = `⚠️ <strong>Gambar Bukti Tidak Dapat Dimuat</strong><br/><span style="font-size: 0.75rem; color: #64748B; margin-top: 6px; display: block;">${modalBuktiUrl.startsWith('data:') ? 'Format gambar tidak valid' : 'Transaksi ini sebelumnya hanya mencatat nama file: <code>' + modalBuktiUrl + '</code>.<br/>Silakan minta pembeli mengunggah bukti gambar kembali.'}</span>`;
                    container.appendChild(msg);
                  }
                }}
              />
            </div>
            <button onClick={() => setModalBuktiUrl(null)} style={{ padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", background: "#64748B", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Tutup</button>
          </div>
        </div>
      )}


      {notifState.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "1.75rem", width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}>

            <div style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background: notifState.type === "success" ? "#D1FAE5" : "#FEE2E2",
              color: notifState.type === "success" ? "#059669" : "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.25rem",
              fontSize: "1.75rem",
              fontWeight: 800
            }}>
              {notifState.type === "success" ? "✓" : "✕"}
            </div>

            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.5rem", margin: 0 }}>
              {notifState.title}
            </h3>

            <p style={{ fontSize: "0.85rem", color: "#64748B", marginTop: "0.5rem", marginBottom: "1.5rem", lineHeight: 1.5 }}>
              {notifState.message}
            </p>

            <button
              onClick={() => setNotifState({ ...notifState, open: false })}
              style={{
                width: "100%",
                padding: "0.75rem",
                borderRadius: "10px",
                border: "none",
                background: notifState.type === "success" ? "#10B981" : "#EF4444",
                color: "white",
                fontWeight: 700,
                fontSize: "0.9rem",
                cursor: "pointer",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)"
              }}
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

    </div>
  );
}