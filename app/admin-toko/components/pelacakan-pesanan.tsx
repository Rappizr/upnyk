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
  status: "Belum Dibayar" | "Sudah Dibayar" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan" | string;
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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    setEnrichedPenjualanList(penjualanList || []);
  }, [penjualanList]);

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

      let pTargetId: string | null = targetPesanan?.produk_id || modalTerimaItem.produkId || null;
      let pProdusenId: string | null = modalTerimaItem.produsenId || targetPesanan?.produsen_id || null;

      if (!pTargetId) {
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
          if (!match) match = produkList[0];
          if (match) pTargetId = match.id;
        }
      }

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

      if (pTargetId) {
        const { data: listPesananProduk } = await dbClient
          .from("pesanan")
          .select("rating")
          .eq("produk_id", pTargetId)
          .not("rating", "is", null);

        const ratings = (listPesananProduk || []).map((p: any) => Number(p.rating)).filter((r: number) => !isNaN(r) && r > 0);
        if (!ratings.includes(ratingInput)) ratings.push(ratingInput);
        if (ratings.length === 0) ratings.push(ratingInput);

        const totalUlasan = ratings.length;
        const avgRating = Number((ratings.reduce((a: number, b: number) => a + b, 0) / totalUlasan).toFixed(1));

        await dbClient.from("produk").update({ rating: avgRating, total_ulasan: totalUlasan }).eq("id", pTargetId);
      } else if (pProdusenId) {
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

  // Styles responsive
  const containerStyle = {
    padding: isMobile ? "0.5rem 0.25rem" : "1.25rem clamp(1rem, 4vw, 1.75rem)",
    fontFamily: "sans-serif"
  };

  const tabButtonStyle = (isActive: boolean) => ({
    padding: isMobile ? "0.4rem 0.7rem" : "0.6rem 1.2rem",
    borderRadius: "8px",
    border: "none",
    background: isActive ? WARNA_UTAMA : "#F1F5F9",
    color: isActive ? "#fff" : "#64748B",
    fontWeight: 700,
    fontSize: isMobile ? "0.7rem" : "0.85rem",
    cursor: "pointer",
    whiteSpace: "nowrap" as const,
    flexShrink: 0 as const,
  });

  const filterPillStyle = (isActive: boolean) => ({
    padding: isMobile ? "0.25rem 0.5rem" : "0.4rem 0.8rem",
    borderRadius: "20px",
    border: isActive ? `1px solid ${WARNA_UTAMA}` : "1px solid #E2E8F0",
    background: isActive ? "#FFFBEB" : "#fff",
    color: isActive ? WARNA_UTAMA_GELAP : "#64748B",
    fontSize: isMobile ? "0.6rem" : "0.78rem",
    fontWeight: isActive ? 700 : 500,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: "4px",
    whiteSpace: "nowrap" as const,
    flexShrink: 0 as const,
  });

  const cardStyle = {
    background: "#fff",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    overflow: "hidden" as const,
    boxShadow: "0 1px 3px rgba(0,0,0,0.04)"
  };

  const cardHeaderStyle = {
    display: "flex",
    justifyContent: "space-between" as const,
    alignItems: "center",
    padding: isMobile ? "0.5rem 0.6rem" : "0.75rem 1rem",
    borderBottom: "1px solid #F1F5F9",
    background: "#F8FAFC",
    flexWrap: "wrap" as const,
    gap: "0.3rem"
  };

  const cardBodyStyle = {
    padding: isMobile ? "0.6rem" : "1.1rem"
  };

  const gridStyle = {
    display: "grid",
    gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(240px, 1fr))",
    gap: isMobile ? "0.5rem" : "0.75rem",
    marginBottom: "0.75rem"
  };

  return (
    <div style={containerStyle}>
      {/* TABS SUBNAVIGATION */}
      <div style={{ 
        display: "flex", 
        gap: "0.4rem", 
        marginBottom: "0.75rem", 
        borderBottom: "1px solid #E2E8F0", 
        paddingBottom: "0.4rem",
        overflowX: "auto" as const,
        WebkitOverflowScrolling: "touch" as const
      }}>
        <button
          onClick={() => setActiveTab("produsen-toko")}
          style={tabButtonStyle(activeTab === "produsen-toko")}
        >
          📦 Produsen ke Toko
        </button>
        <button
          onClick={() => setActiveTab("toko-pembeli")}
          style={{
            ...tabButtonStyle(activeTab === "toko-pembeli"),
            display: "flex",
            alignItems: "center",
            gap: "4px"
          }}
        >
          <span>🛍️ Toko ke Pembeli</span>
          {enrichedPenjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length > 0 && (
            <span style={{ 
              background: "#EF4444", 
              color: "white", 
              fontSize: isMobile ? "0.5rem" : "0.7rem", 
              borderRadius: "999px", 
              padding: "1px 5px", 
              fontWeight: 800 
            }}>
              {enrichedPenjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length}
            </span>
          )}
        </button>
      </div>

      {/* PRODUSEN KE TOKO TAB */}
      {activeTab === "produsen-toko" && (
        <div>
          {/* FILTER PILLS */}
          <div style={{ 
            display: "flex", 
            gap: "0.3rem", 
            marginBottom: "0.75rem", 
            overflowX: "auto" as const,
            paddingBottom: "0.2rem",
            WebkitOverflowScrolling: "touch" as const
          }}>
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
                  style={filterPillStyle(isAktif)}
                >
                  <span>{st}</span>
                  <span style={{ fontSize: isMobile ? "0.5rem" : "0.7rem", opacity: 0.8 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {pembelianFiltered.length === 0 ? (
            <div style={{ 
              background: "#fff", 
              border: "1px solid #E2E8F0", 
              borderRadius: "12px", 
              padding: isMobile ? "1.5rem 0.75rem" : "2.5rem 1rem", 
              textAlign: "center", 
              color: "#64748B", 
              fontSize: isMobile ? "0.75rem" : "0.85rem" 
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem", color: "#CBD5E1" }}><IconPackage /></div>
              Belum ada pesanan bahan baku pada status <strong>{filterPembelian}</strong>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "0.6rem" : "1rem" }}>
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
                  <div key={p.id} style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: isMobile ? "0.7rem" : "0.82rem", fontWeight: 700, color: "#1E293B" }}>#{p.id}</span>
                        <span style={{ fontSize: isMobile ? "0.6rem" : "0.75rem", color: "#94A3B8" }}>• {p.tanggal}</span>
                        <span style={{ 
                          fontSize: isMobile ? "0.55rem" : "0.72rem", 
                          fontWeight: 700, 
                          color: WARNA_UTAMA_GELAP, 
                          background: "#FEF3C7", 
                          padding: "0.1rem 0.35rem", 
                          borderRadius: "4px" 
                        }}>
                          🏭 {p.produsen}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: isMobile ? "0.6rem" : "0.72rem", 
                        fontWeight: 700, 
                        color: badgeColor, 
                        background: badgeBg, 
                        padding: isMobile ? "0.15rem 0.4rem" : "0.25rem 0.75rem", 
                        borderRadius: "999px" 
                      }}>
                        {displayStatus}
                      </span>
                    </div>

                    <div style={cardBodyStyle}>
                      <div style={gridStyle}>
                        <div style={{ background: "#F8FAFC", padding: isMobile ? "0.5rem" : "0.75rem", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: isMobile ? "0.7rem" : "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>
                            <IconUser /> Produsen: {p.produsen}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: isMobile ? "0.65rem" : "0.75rem", color: "#64748B", lineHeight: 1.3 }}>
                            <IconMapPin />
                            <span>{p.lokasiProdusen || "Lokasi produsen terdaftar"}</span>
                          </div>
                        </div>

                        <div style={{ background: "#F8FAFC", padding: isMobile ? "0.5rem" : "0.75rem", borderRadius: "8px", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: isMobile ? "0.55rem" : "0.68rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".02em" }}>STATUS TRACKING</div>
                            <div style={{ fontSize: isMobile ? "0.7rem" : "0.85rem", fontWeight: 700, color: "#1E293B", marginTop: "1px" }}>{displayStatus}</div>
                          </div>
                          <div style={{ marginTop: isMobile ? "0.2rem" : "0.4rem" }}>
                            <div style={{ fontSize: isMobile ? "0.55rem" : "0.68rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>TOTAL BELANJA</div>
                            <div style={{ fontSize: isMobile ? "0.85rem" : "1.05rem", fontWeight: 800, color: "#10B981" }}>{formatRupiah(p.total)}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "0.75rem" }}>
                        <div style={{ fontSize: isMobile ? "0.65rem" : "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>Rincian Bahan Baku Dipesan:</div>
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "0.4rem 0.5rem" : "0.6rem 0.75rem", fontSize: isMobile ? "0.65rem" : "0.8rem" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                              {p.fotoProduk ? (
                                <div style={{ width: isMobile ? "20px" : "28px", height: isMobile ? "20px" : "28px", borderRadius: "4px", overflow: "hidden", border: "1px solid #CBD5E1", flexShrink: 0 }}>
                                  <img src={p.fotoProduk} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                </div>
                              ) : (
                                <div style={{ width: isMobile ? "20px" : "28px", height: isMobile ? "20px" : "28px", borderRadius: "4px", background: "#FEF3C7", color: WARNA_UTAMA_GELAP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                                  <IconPackage />
                                </div>
                              )}
                              <span style={{ color: "#1E293B", fontWeight: 600 }}>{p.item} <span style={{ color: "#64748B", fontWeight: 400 }}>× {p.jumlah} {p.satuan || "pcs"}</span></span>
                            </div>
                            <span style={{ color: "#475569", fontWeight: 700, fontSize: isMobile ? "0.65rem" : "0.8rem" }}>{formatRupiah(p.total)}</span>
                          </div>
                        </div>

                        {p.noResi && (
                          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: isMobile ? "0.3rem 0.5rem" : "0.5rem 0.75rem", borderRadius: "8px", marginTop: "0.4rem", fontSize: isMobile ? "0.65rem" : "0.78rem", color: "#1E40AF" }}>
                            📦 <strong>No. Resi:</strong> <code style={{ background: "#DBEAFE", padding: "2px 4px", borderRadius: "4px", fontWeight: 700, fontSize: isMobile ? "0.6rem" : "0.78rem" }}>{p.noResi}</code>
                          </div>
                        )}

                        <div style={{ padding: isMobile ? "0.4rem 0.1rem 0.3rem" : "0.75rem 0.25rem 0.5rem" }}>
                          <div style={{ display: "flex", alignItems: "center" }}>
                            {LANGKAH.map((l, i) => {
                              const Icon = l.icon;
                              const selesai = i <= langkahAktif;
                              return (
                                <div key={l.key} style={{ display: "flex", alignItems: "center", flex: i < LANGKAH.length - 1 ? 1 : "unset" }}>
                                  <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                    <div style={{ 
                                      width: isMobile ? "22px" : "28px", 
                                      height: isMobile ? "22px" : "28px", 
                                      borderRadius: "50%", 
                                      background: selesai ? WARNA_UTAMA : "#E2E8F0", 
                                      color: selesai ? "white" : "#94A3B8", 
                                      display: "flex", 
                                      alignItems: "center", 
                                      justifyContent: "center" 
                                    }}>
                                      <Icon />
                                    </div>
                                    <span style={{ 
                                      fontSize: isMobile ? "0.45rem" : "0.6rem", 
                                      fontWeight: 600, 
                                      color: selesai ? "#1E293B" : "#94A3B8", 
                                      marginTop: "1px" 
                                    }}>{l.label}</span>
                                  </div>
                                  {i < LANGKAH.length - 1 && <div style={{ flex: 1, height: "2px", background: i < langkahAktif ? WARNA_UTAMA : "#E2E8F0" }} />}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {p.status === "Dikirim" && (
                          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "0.3rem" }}>
                            <button
                              onClick={() => bukaModalTerima(p)}
                              style={{ 
                                padding: isMobile ? "0.4rem 0.6rem" : "0.55rem 1rem", 
                                borderRadius: "8px", 
                                border: "none", 
                                background: WARNA_UTAMA, 
                                color: "white", 
                                fontWeight: 700, 
                                fontSize: isMobile ? "0.65rem" : "0.78rem", 
                                cursor: "pointer",
                                width: isMobile ? "100%" : "auto"
                              }}
                            >
                              Pesanan Diterima & Beri Ulasan
                            </button>
                          </div>
                        )}

                        {(p.status === "Selesai" || p.status === "Diterima" || (p.status || "").toLowerCase() === "selesai") && (
                          <div style={{ 
                            display: "flex", 
                            justifyContent: isMobile ? "space-between" : "flex-end", 
                            alignItems: "center", 
                            gap: "0.4rem", 
                            flexWrap: "wrap", 
                            marginTop: "0.3rem" 
                          }}>
                            <span style={{ 
                              fontSize: isMobile ? "0.6rem" : "0.75rem", 
                              color: "#047857", 
                              fontWeight: 700, 
                              background: "#D1FAE5", 
                              padding: isMobile ? "0.15rem 0.4rem" : "0.35rem 0.75rem", 
                              borderRadius: "6px" 
                            }}>
                              ✓ Pesanan Diterima {p.rating ? `(${p.rating}★)` : ""}
                            </span>
                            <button
                              onClick={() => bukaModalTerima(p)}
                              style={{ 
                                padding: isMobile ? "0.15rem 0.4rem" : "0.35rem 0.75rem", 
                                borderRadius: "6px", 
                                border: `1px solid ${WARNA_UTAMA}`, 
                                background: "#fff", 
                                color: WARNA_UTAMA_GELAP, 
                                fontWeight: 700, 
                                fontSize: isMobile ? "0.6rem" : "0.72rem", 
                                cursor: "pointer" 
                              }}
                            >
                              ⭐ {p.rating ? "Edit Ulasan" : "Beri Rating"}
                            </button>
                          </div>
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

      {/* TOKO KE PEMBELI TAB - truncated for brevity, similar responsive changes */}
      {activeTab === "toko-pembeli" && (
        <div>
          <div style={{ 
            display: "flex", 
            gap: "0.3rem", 
            marginBottom: "0.75rem", 
            overflowX: "auto" as const,
            paddingBottom: "0.2rem",
            WebkitOverflowScrolling: "touch" as const
          }}>
            {["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((st) => {
              const count = st === "Semua" ? enrichedPenjualanList.length : enrichedPenjualanList.filter(p => (p.status || "Belum Dibayar") === st).length;
              const isAktif = filterPenjualan === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterPenjualan(st)}
                  style={filterPillStyle(isAktif)}
                >
                  <span>{st}</span>
                  <span style={{ fontSize: isMobile ? "0.5rem" : "0.7rem", opacity: 0.8 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {penjualanFiltered.length === 0 ? (
            <div style={{ 
              background: "#fff", 
              border: "1px solid #E2E8F0", 
              borderRadius: "12px", 
              padding: isMobile ? "1.5rem 0.75rem" : "2.5rem 1rem", 
              textAlign: "center", 
              color: "#64748B", 
              fontSize: isMobile ? "0.75rem" : "0.85rem" 
            }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.5rem", color: "#CBD5E1" }}><IconPackage /></div>
              Belum ada pesanan pembeli pada status <strong>{filterPenjualan}</strong>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "0.6rem" : "1rem" }}>
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
                  <div key={pj.id} style={cardStyle}>
                    <div style={cardHeaderStyle}>
                      <div style={{ display: "flex", alignItems: "center", gap: isMobile ? "4px" : "8px", flexWrap: "wrap" }}>
                        <span style={{ fontSize: isMobile ? "0.7rem" : "0.82rem", fontWeight: 700, color: "#1E293B" }}>#{pj.kodePesanan || pj.id}</span>
                        <span style={{ fontSize: isMobile ? "0.6rem" : "0.75rem", color: "#94A3B8" }}>• {pj.tanggal}</span>
                        {pj.escrowStatus === "Tersalur" ? (
                          <span style={{ fontSize: isMobile ? "0.5rem" : "0.68rem", fontWeight: 700, color: "#065F46", background: "#D1FAE5", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>
                            🛡️ Tersalur
                          </span>
                        ) : (
                          <span style={{ fontSize: isMobile ? "0.5rem" : "0.68rem", fontWeight: 700, color: "#92400E", background: "#FEF3C7", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>
                            🛡️ Ditahan
                          </span>
                        )}
                      </div>
                      <span style={{ 
                        fontSize: isMobile ? "0.6rem" : "0.72rem", 
                        fontWeight: 700, 
                        color: badgeColor, 
                        background: badgeBg, 
                        padding: isMobile ? "0.15rem 0.4rem" : "0.25rem 0.75rem", 
                        borderRadius: "999px" 
                      }}>
                        {pj.status}
                      </span>
                    </div>

                    <div style={cardBodyStyle}>
                      <div style={gridStyle}>
                        <div style={{ background: "#F8FAFC", padding: isMobile ? "0.5rem" : "0.75rem", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: isMobile ? "0.7rem" : "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>
                            <IconUser /> {pj.pembeli}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "4px", fontSize: isMobile ? "0.65rem" : "0.75rem", color: "#64748B", lineHeight: 1.3 }}>
                            <IconMapPin />
                            <span>{pj.alamatPembeli || "Alamat belum diisi"}</span>
                          </div>
                        </div>

                        <div style={{ background: "#F8FAFC", padding: isMobile ? "0.5rem" : "0.75rem", borderRadius: "8px", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: isMobile ? "0.55rem" : "0.68rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>METODE PEMBAYARAN</div>
                            <div style={{ fontSize: isMobile ? "0.7rem" : "0.85rem", fontWeight: 700, color: "#1E293B", marginTop: "1px" }}>{pj.metodePembayaran || "QRIS"}</div>
                            {pj.buktiPembayaran && (
                              <button
                                onClick={() => setModalBuktiUrl(pj.buktiPembayaran || null)}
                                style={{ marginTop: "0.2rem", border: "none", background: "none", color: "#2563EB", fontSize: isMobile ? "0.6rem" : "0.72rem", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                              >
                                🖼️ Lihat Bukti
                              </button>
                            )}
                          </div>
                          <div style={{ marginTop: isMobile ? "0.2rem" : "0.4rem" }}>
                            <div style={{ fontSize: isMobile ? "0.55rem" : "0.68rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>TOTAL BELANJA</div>
                            <div style={{ fontSize: isMobile ? "0.85rem" : "1.05rem", fontWeight: 800, color: "#10B981" }}>{formatRupiah(pj.total)}</div>
                          </div>
                        </div>
                      </div>

                      <div style={{ marginBottom: "0.75rem" }}>
                        <div style={{ fontSize: isMobile ? "0.65rem" : "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.2rem" }}>Rincian Barang Dipesan:</div>
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                          {(pj.items && pj.items.length > 0) ? (
                            pj.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: isMobile ? "0.35rem 0.5rem" : "0.55rem 0.75rem", borderBottom: idx < pj.items!.length - 1 ? "1px solid #F1F5F9" : "none", fontSize: isMobile ? "0.65rem" : "0.78rem" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                                  {it.foto && (
                                    <div style={{ width: isMobile ? "18px" : "26px", height: isMobile ? "18px" : "28px", borderRadius: "4px", overflow: "hidden", border: "1px solid #CBD5E1", flexShrink: 0 }}>
                                      <img src={it.foto} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    </div>
                                  )}
                                  <span style={{ color: "#1E293B", fontWeight: 600 }}>{it.nama} <span style={{ color: "#64748B", fontWeight: 400 }}>× {it.jumlah}</span></span>
                                </div>
                                <span style={{ color: "#475569", fontWeight: 700, fontSize: isMobile ? "0.65rem" : "0.78rem" }}>{formatRupiah(it.subtotal || (it.harga * it.jumlah))}</span>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: isMobile ? "0.35rem 0.5rem" : "0.55rem 0.75rem", fontSize: isMobile ? "0.65rem" : "0.78rem", color: "#475569" }}>
                              {pj.produk} ({pj.jumlah} pcs)
                            </div>
                          )}
                        </div>

                        {pj.noResi && (
                          <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: isMobile ? "0.3rem 0.5rem" : "0.5rem 0.75rem", borderRadius: "8px", marginTop: "0.4rem", fontSize: isMobile ? "0.65rem" : "0.78rem", color: "#1E40AF" }}>
                            📦 <strong>No. Resi:</strong> <code style={{ background: "#DBEAFE", padding: "2px 4px", borderRadius: "4px", fontWeight: 700, fontSize: isMobile ? "0.6rem" : "0.78rem" }}>{pj.noResi}</code>
                          </div>
                        )}

                        <div style={{ 
                          display: "flex", 
                          flexDirection: isMobile ? "column" : "row",
                          gap: isMobile ? "0.4rem" : "0.5rem", 
                          justifyContent: "flex-end", 
                          marginTop: "0.6rem",
                          width: "100%"
                        }}>
                          {(pj.status === "Belum Dibayar" || pj.status === "Sudah Dibayar" || pj.status === "Diproses" || !pj.status) && (
                            <>
                              {(pj.status === "Belum Dibayar" || !pj.status) && (
                                <button
                                  disabled={isBusy}
                                  onClick={() => handleUbahStatusPenjualan(targetId, "Dibatalkan")}
                                  style={{ 
                                    padding: isMobile ? "0.35rem 0.5rem" : "0.5rem 0.85rem", 
                                    borderRadius: "8px", 
                                    border: "1px solid #FCA5A5", 
                                    background: "#FEF2F2", 
                                    color: "#991B1B", 
                                    fontSize: isMobile ? "0.65rem" : "0.78rem", 
                                    fontWeight: 700, 
                                    cursor: "pointer",
                                    width: isMobile ? "100%" : "auto"
                                  }}
                                >
                                  Batalkan
                                </button>
                              )}
                              <button
                                disabled={isBusy}
                                onClick={() => { setModalResiOrder(pj); setInputNoResi(`NUSA-${Date.now().toString().slice(-6)}`); }}
                                style={{ 
                                  padding: isMobile ? "0.35rem 0.5rem" : "0.5rem 1rem", 
                                  borderRadius: "8px", 
                                  border: "none", 
                                  background: "#2563EB", 
                                  color: "white", 
                                  fontSize: isMobile ? "0.65rem" : "0.78rem", 
                                  fontWeight: 700, 
                                  cursor: "pointer", 
                                  display: "flex", 
                                  alignItems: "center", 
                                  gap: "4px",
                                  justifyContent: "center",
                                  width: isMobile ? "100%" : "auto"
                                }}
                              >
                                <IconTruck />
                                <span>{isBusy ? "Memproses..." : "Konfirmasi & Kirim Barang"}</span>
                              </button>
                            </>
                          )}

                          {pj.status === "Dikirim" && (
                            <button
                              disabled={isBusy}
                              onClick={() => handleUbahStatusPenjualan(targetId, "Selesai")}
                              style={{ 
                                padding: isMobile ? "0.35rem 0.5rem" : "0.5rem 1rem", 
                                borderRadius: "8px", 
                                border: "none", 
                                background: "#10B981", 
                                color: "white", 
                                fontSize: isMobile ? "0.65rem" : "0.78rem", 
                                fontWeight: 700, 
                                cursor: "pointer", 
                                display: "flex", 
                                alignItems: "center", 
                                gap: "4px",
                                justifyContent: "center",
                                width: isMobile ? "100%" : "auto"
                              }}
                            >
                              <IconCheck />
                              <span>{isBusy ? "Selesai..." : "Tandai Selesai"}</span>
                            </button>
                          )}

                          {pj.status === "Selesai" && (
                            <span style={{ 
                              fontSize: isMobile ? "0.6rem" : "0.75rem", 
                              color: "#047857", 
                              fontWeight: 700, 
                              background: "#D1FAE5", 
                              padding: isMobile ? "0.15rem 0.4rem" : "0.35rem 0.75rem", 
                              borderRadius: "6px",
                              width: isMobile ? "100%" : "auto",
                              textAlign: "center"
                            }}>
                              ✓ Transaksi Selesai
                            </span>
                          )}
                          {pj.status === "Dibatalkan" && (
                            <span style={{ 
                              fontSize: isMobile ? "0.6rem" : "0.75rem", 
                              color: "#B91C1C", 
                              fontWeight: 700, 
                              background: "#FEE2E2", 
                              padding: isMobile ? "0.15rem 0.4rem" : "0.35rem 0.75rem", 
                              borderRadius: "6px",
                              width: isMobile ? "100%" : "auto",
                              textAlign: "center"
                            }}>
                              ✕ Pesanan Dibatalkan
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL INPUT RESI */}
      {modalResiOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: isMobile ? "0.75rem" : "1.25rem", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.5rem" }}>
              <div style={{ fontWeight: 800, fontSize: isMobile ? "0.82rem" : "0.95rem", color: "#1E293B" }}>Kirim Pesanan #{modalResiOrder.kodePesanan || modalResiOrder.id}</div>
              <button onClick={() => setModalResiOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ fontSize: isMobile ? "0.7rem" : "0.78rem", color: "#64748B", marginBottom: "0.6rem", lineHeight: 1.3 }}>
              Masukkan nomor resi pengiriman untuk pembeli <strong>{modalResiOrder.pembeli}</strong>.
            </p>
            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: isMobile ? "0.65rem" : "0.72rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>Nomor Resi / Kurir</label>
              <input
                type="text"
                value={inputNoResi}
                onChange={(e) => setInputNoResi(e.target.value)}
                placeholder="Contoh: NUSA-882199"
                style={{ width: "100%", padding: isMobile ? "0.4rem 0.5rem" : "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: isMobile ? "0.75rem" : "0.82rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.4rem", justifyContent: "flex-end" }}>
              <button onClick={() => setModalResiOrder(null)} style={{ padding: isMobile ? "0.35rem 0.6rem" : "0.5rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontSize: isMobile ? "0.7rem" : "0.78rem", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button onClick={handleKirimResi} style={{ padding: isMobile ? "0.35rem 0.6rem" : "0.5rem 1rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: isMobile ? "0.7rem" : "0.78rem", fontWeight: 700, cursor: "pointer" }}>Konfirmasi</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TERIMA PESANAN */}
      {modalTerimaItem && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: isMobile ? "0.75rem" : "1.25rem", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" }}>
            <div style={{ fontWeight: 800, fontSize: isMobile ? "0.85rem" : "1rem", color: "#1E293B", marginBottom: "0.2rem" }}>
              Konfirmasi Terima
            </div>
            <p style={{ fontSize: isMobile ? "0.7rem" : "0.78rem", color: "#64748B", marginBottom: "0.6rem" }}>
              Terima <strong>{modalTerimaItem.item}</strong> ({modalTerimaItem.jumlah} {modalTerimaItem.satuan || "pcs"}).
            </p>

            <div style={{ marginBottom: "0.6rem" }}>
              <label style={{ display: "block", fontSize: isMobile ? "0.65rem" : "0.72rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>
                Rating Kualitas
              </label>
              <div style={{ display: "flex", gap: "4px" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRatingInput(star)}
                    style={{
                      fontSize: isMobile ? "1.1rem" : "1.3rem",
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

            <div style={{ marginBottom: "0.75rem" }}>
              <label style={{ display: "block", fontSize: isMobile ? "0.65rem" : "0.72rem", fontWeight: 700, color: "#334155", marginBottom: "0.2rem" }}>
                Ulasan / Catatan
              </label>
              <textarea
                rows={isMobile ? 2 : 3}
                value={keteranganInput}
                onChange={(e) => setKeteranganInput(e.target.value)}
                placeholder="Contoh: Barang bagus, kualitas renyah..."
                style={{
                  width: "100%",
                  padding: isMobile ? "0.4rem 0.5rem" : "0.55rem",
                  borderRadius: "8px",
                  border: "1px solid #CBD5E1",
                  fontSize: isMobile ? "0.75rem" : "0.82rem",
                  outline: "none",
                  boxSizing: "border-box"
                }}
              />
            </div>

            <div style={{ display: "flex", gap: "0.4rem", flexDirection: isMobile ? "column" : "row" }}>
              <button
                onClick={() => setModalTerimaItem(null)}
                style={{ 
                  flex: 1, 
                  padding: isMobile ? "0.4rem" : "0.55rem", 
                  borderRadius: "8px", 
                  border: "1px solid #CBD5E1", 
                  background: "white", 
                  color: "#475569", 
                  fontWeight: 600, 
                  fontSize: isMobile ? "0.7rem" : "0.78rem", 
                  cursor: "pointer",
                  width: isMobile ? "100%" : "auto"
                }}
              >
                Batal
              </button>
              <button
                onClick={kirimTerimaPesanan}
                disabled={submitting}
                style={{ 
                  flex: 1, 
                  padding: isMobile ? "0.4rem" : "0.55rem", 
                  borderRadius: "8px", 
                  border: "none", 
                  background: WARNA_UTAMA, 
                  color: "white", 
                  fontWeight: 700, 
                  fontSize: isMobile ? "0.7rem" : "0.78rem", 
                  cursor: "pointer",
                  width: isMobile ? "100%" : "auto"
                }}
              >
                {submitting ? "Memproses..." : "Konfirmasi Terima"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL BUKTI TRANSFER */}
      {modalBuktiUrl && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: isMobile ? "0.75rem" : "1rem", width: "100%", maxWidth: "400px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
              <div style={{ fontWeight: 700, fontSize: isMobile ? "0.8rem" : "0.88rem", color: "#1E293B" }}>Bukti Transfer</div>
              <button onClick={() => setModalBuktiUrl(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: "0.6rem", maxHeight: isMobile ? "240px" : "320px", minHeight: isMobile ? "80px" : "120px", display: "flex", justifyContent: "center", alignItems: "center", background: "#F8FAFC" }}>
              <img
                src={modalBuktiUrl}
                alt="Bukti Transfer"
                style={{ maxWidth: "100%", maxHeight: isMobile ? "240px" : "320px", objectFit: "contain" }}
              />
            </div>
            <button onClick={() => setModalBuktiUrl(null)} style={{ padding: isMobile ? "0.35rem 0.8rem" : "0.45rem 1.25rem", borderRadius: "6px", border: "none", background: "#64748B", color: "white", fontWeight: 600, cursor: "pointer", fontSize: isMobile ? "0.7rem" : "0.8rem", width: isMobile ? "100%" : "auto" }}>Tutup</button>
          </div>
        </div>
      )}

      {/* NOTIFIKASI POPUP */}
      {notifState.open && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1100, display: "flex", alignItems: "center", justifyContent: "center", padding: "0.5rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: isMobile ? "1rem" : "1.5rem", width: "100%", maxWidth: "380px", textAlign: "center" }}>
            <div style={{
              width: isMobile ? "44px" : "56px",
              height: isMobile ? "44px" : "56px",
              borderRadius: "50%",
              background: notifState.type === "success" ? "#D1FAE5" : "#FEE2E2",
              color: notifState.type === "success" ? "#059669" : "#DC2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 0.6rem",
              fontSize: isMobile ? "1.2rem" : "1.5rem",
              fontWeight: 800
            }}>
              {notifState.type === "success" ? "✓" : "✕"}
            </div>
            <h3 style={{ fontSize: isMobile ? "0.9rem" : "1.05rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.3rem" }}>
              {notifState.title}
            </h3>
            <p style={{ fontSize: isMobile ? "0.7rem" : "0.8rem", color: "#64748B", marginBottom: "0.75rem", lineHeight: 1.3 }}>
              {notifState.message}
            </p>
            <button
              onClick={() => setNotifState({ ...notifState, open: false })}
              style={{
                width: "100%",
                padding: isMobile ? "0.5rem" : "0.65rem",
                borderRadius: "8px",
                border: "none",
                background: notifState.type === "success" ? "#10B981" : "#EF4444",
                color: "white",
                fontWeight: 700,
                fontSize: isMobile ? "0.75rem" : "0.85rem",
                cursor: "pointer"
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