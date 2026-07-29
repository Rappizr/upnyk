"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { supabase } from "@/lib/db";
import { getPenjualanAdminTokoAction, updateOrderStatusAction } from "@/app/actions";

import MarketplaceProdusen from "./components/marketplace-produsen";
import InventarisGrading from "./components/inventaris-grading";
import SmartRestock from "./components/smart-restock";
import EtalasePenjualan from "./components/etalase-penjualan";
import LaporanBukuKas from "./components/laporan-buku-kas";
import ProfilTokoPage from "./components/profil-toko";
import PelacakanPesanan, { Penjualan } from "./components/pelacakan-pesanan";

export type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiRestockHari: number;
  estimasiPanenHari?: number; // Fallback kompatibilitas
}

export interface StokToko {
  id: string;
  produk_id?: string;
  nama: string;
  jumlah: number;
  satuan: string;
  batasMinimum: number;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  grade: Grade;
  asalProdusen: string;
  live: boolean;
  foto?: string | null;
  deskripsi?: string;
  rating?: number;
  totalUlasan?: number;
}

export interface Pembelian {
  id: string;
  rawId: String;
  produkId?: string;
  produsenId: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
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

const todayLabel = () => new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconTruck = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconBox = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconRefresh = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
const IconTag = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.5 3H4a1 1 0 0 0-1 1v5.5a2 2 0 0 0 .83 1.5l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"></path><circle cx="7.5" cy="7.5" r="1.5"></circle></svg>;
const IconBook = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path></svg>;
const IconMenu = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconSparkle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path></svg>;
const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

interface MenuItemDef {
  key: string;
  label: string;
  icon: () => ReactElement;
  children?: { key: string; label: string }[];
}

interface MenuGroupDef {
  title: string;
  items: MenuItemDef[];
}

const menuGroups: MenuGroupDef[] = [
  { title: "Main", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  {
    title: "Belanja Bahan Baku",
    items: [
      { key: "marketplace", label: "Marketplace Produsen", icon: IconStore },
      {
        key: "pelacakan",
        label: "Pelacakan Pesanan",
        icon: IconTruck,
        children: [
          { key: "pelacakan-produsen-toko", label: "Produsen ke Toko" },
          { key: "pelacakan-toko-pembeli", label: "Toko ke Pembeli" },
        ],
      },
    ],
  },
  {
    title: "Manajemen Stok",
    items: [
      { key: "inventaris", label: "Inventaris", icon: IconBox },
      { key: "restock", label: "Smart Restock", icon: IconRefresh },
    ],
  },
  { title: "Penjualan", items: [{ key: "etalase", label: "Etalase Penjualan", icon: IconTag }] },
  { title: "Laporan", items: [{ key: "laporan", label: "Buku Kas", icon: IconBook }] },
];

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}
function formatRupiahRingkas(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return formatRupiah(n);
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  marketplace: "Marketplace Produsen",
  pelacakan: "Pelacakan Pesanan",
  "pelacakan-produsen-toko": "Pelacakan Pesanan (Produsen ke Toko)",
  "pelacakan-toko-pembeli": "Pelacakan Pesanan (Toko ke Pembeli)",
  inventaris: "Inventaris",
  restock: "Smart Restock",
  etalase: "Etalase Penjualan",
  laporan: "Buku Kas",
};

export default function AdminTokoDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [openSubmenu, setOpenSubmenu] = useState<string | null>("pelacakan");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilPopupOpen, setProfilPopupOpen] = useState(false);

  const [isDataLengkap, setIsDataLengkap] = useState(true);
  const [isSuspended, setIsSuspended] = useState(false);
  const [loadingProfil, setLoadingProfil] = useState(true);

  const [headerProfil, setHeaderProfil] = useState({
    namaPemilik: "Admin PasarNusa",
    namaToko: "Toko Baru Admin",
    inisial: "AT",
    fotoUrl: "",
  });
  const [alamatToko, setAlamatToko] = useState("");

  const [produsenList, setProdusenList] = useState<Produsen[]>([]);
  const [stokList, setStokList] = useState<StokToko[]>([]);
  const [pembelianList, setPembelianList] = useState<Pembelian[]>([]);
  const [penjualanList, setPenjualanList] = useState<Penjualan[]>([]);
  const [totalEtalaseTayang, setTotalEtalaseTayang] = useState<number>(0);

  const periksaKelengkapanAdmin = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { 
        setLoadingProfil(false); 
        return; 
      }

      const { data: profile } = await supabase.from("profiles").select("nama, avatar_url, status").eq("id", user.id).maybeSingle();
      const { data: adminToko } = await supabase.from("admin_toko").select("nama_toko, alamat, desa, kecamatan, kabupaten, provinsi, status").eq("profile_id", user.id).maybeSingle();

      if (profile?.status === "suspended" || profile?.status === "nonaktif" || adminToko?.status === "suspended" || adminToko?.status === "nonaktif") {
        setIsSuspended(true);
      } else {
        setIsSuspended(false);
      }

      const lengkap = !!(adminToko && adminToko.alamat && adminToko.nama_toko);
      setIsDataLengkap(lengkap);

      if (adminToko) {
        const alamatLengkap = [adminToko.alamat, adminToko.desa, adminToko.kecamatan, adminToko.kabupaten, adminToko.provinsi].filter(Boolean).join(", ");
        if (alamatLengkap) setAlamatToko(alamatLengkap);
      }

      setHeaderProfil({
        namaPemilik: profile?.nama || "Admin Toko",
        namaToko: adminToko?.nama_toko || "Nama Toko Belum Diisi",
        inisial: adminToko?.nama_toko ? adminToko.nama_toko.slice(0, 2).toUpperCase() : "AT",
        fotoUrl: profile?.avatar_url || "",
      });
    } catch (error) {
      console.error("Gagal memeriksa kelengkapan admin:", error);
    } finally {
      setLoadingProfil(false);
    }
  }, []);

  const fetchPembelianLive = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      const possibleAdminIds = [user.id];
      if (adminToko?.id) {
        possibleAdminIds.push(adminToko.id);
      }

      const { data: pesananData, error: pesananError } = await supabase
        .from("pesanan")
        .select("id, jumlah, total_harga, status, created_at, produsen_id, produk_id, admin_toko_id")
        .in("admin_toko_id", possibleAdminIds)
        .order("created_at", { ascending: false });

      if (pesananError) {
        console.error("Error Fetch Pesanan:", JSON.stringify(pesananError, null, 2));
        return;
      }

      if (!pesananData || pesananData.length === 0) {
        setPembelianList([]);
        return;
      }

      const produsenIds = Array.from(new Set(pesananData.map((p) => p.produsen_id).filter(Boolean)));
      const produkIds = Array.from(new Set(pesananData.map((p) => p.produk_id).filter(Boolean)));

      const [{ data: produsenData }, { data: produkData }] = await Promise.all([
        produsenIds.length > 0
          ? supabase.from("produsen").select("id, nama_usaha").in("id", produsenIds)
          : Promise.resolve({ data: [] }),
        produkIds.length > 0
          ? supabase.from("produk").select("id, nama, harga, satuan").in("id", produkIds)
          : Promise.resolve({ data: [] }),
      ]);

      const produsenMap = new Map((produsenData || []).map((p) => [p.id, p]));
      const produkMap = new Map((produkData || []).map((p) => [p.id, p]));

      const mapped: Pembelian[] = pesananData.map((p) => {
        const rawStatus = String(p.status || "").toLowerCase().trim();
        let statusFormat: Pembelian["status"] = "Menunggu";

        if (rawStatus === "diproses") statusFormat = "Diproses";
        else if (rawStatus === "dikirim") statusFormat = "Dikirim";
        else if (rawStatus === "selesai" || rawStatus === "diterima") statusFormat = "Selesai";
        else if (rawStatus === "dibatalkan" || rawStatus === "batal") statusFormat = "Dibatalkan";

        const prodObj = produsenMap.get(p.produsen_id);
        const prodObjProduk = produkMap.get(p.produk_id);

        return {
          id: `#PO-${p.id.slice(0, 8).toUpperCase()}`,
          rawId: p.id,
          produkId: p.produk_id,
          produsenId: p.produsen_id || "",
          produsen: prodObj?.nama_usaha || "Produsen Mitra",
          item: prodObjProduk?.nama || "Komoditas",
          jumlah: Number(p.jumlah) || 1,
          satuan: prodObjProduk?.satuan || "pcs",
          hargaSatuan: Number(prodObjProduk?.harga) || 0,
          total: Number(p.total_harga) || 0,
          status: statusFormat,
          tanggal: new Date(p.created_at).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          }),
        };
      });

      setPembelianList(mapped);
    } catch (err) {
      console.error("fetchPembelianLive Unexpected Error:", err);
    }
  }, []);

// FETCH INVENTARIS TOKO SECARA UTUH
  const fetchInventaris = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      const possibleIds = [user.id];
      if (adminToko?.id) possibleIds.push(adminToko.id);

      let { data: dbItems } = await supabase
        .from("inventaris")
        .select("*")
        .in("admin_toko_id", possibleIds)
        .order("updated_at", { ascending: false });

      if (!dbItems || dbItems.length === 0) {
        const { data: fallbackItems } = await supabase
          .from("inventaris")
          .select("*")
          .eq("admin_toko_id", "a89317e5-1407-4cd7-9698-3514680b4e51")
          .order("updated_at", { ascending: false });
        dbItems = fallbackItems;
      }

      // Mapping tanpa mengeliminasi data yang nama_produk-nya NULL
      const mappedItems: StokToko[] = (dbItems || []).map((item: any) => {
        // Fallback nama jika nama_produk di DB bernilai NULL
        const namaFix = item.nama_produk && item.nama_produk !== "NULL" 
          ? item.nama_produk 
          : (item.nama || "kripik");

        const limitFix = Number(item.stok_minimum) || 10;
        const metaKey = `inventaris_meta_${item.id}`;
        let localMeta: Partial<StokToko> = {};
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem(metaKey);
            if (stored) localMeta = JSON.parse(stored);
          } catch {}
        }

        return {
          id: String(item.id),
          produk_id: item.produk_id ? String(item.produk_id) : undefined,
          nama: String(namaFix),
          jumlah: Number(item.stok) || 0,
          satuan: String(item.satuan || "pcs"),
          batasMinimum: localMeta.batasMinimum !== undefined ? localMeta.batasMinimum : limitFix,
          hargaBeli: Number(item.harga_beli) || 0,
          hargaJual: localMeta.hargaJual !== undefined ? localMeta.hargaJual : 0,
          diskonPersen: localMeta.diskonPersen !== undefined ? localMeta.diskonPersen : 0,
          grade: (localMeta.grade || item.grade || "Belum Dinilai") as Grade,
          asalProdusen: String(item.lokasi_rak || "Gudang Utama"),
          live: localMeta.live !== undefined ? localMeta.live : true,
          foto: null,
        };
      });

      setStokList(mappedItems);
    } catch (err: any) {
      console.error("fetchInventaris error:", err?.message || err);
    }
  }, []);

  // 💡 FETCH HITUNG JUMLAH ETALASE TAYANG RIIEL MENGGUNAKAN COUNT
  const fetchEtalaseCount = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      const possibleIds = [user.id];
      if (adminToko?.id) possibleIds.push(adminToko.id);

      const { count, error } = await supabase
        .from("etalase")
        .select("id", { count: "exact", head: true })
        .in("admin_toko_id", possibleIds)
        .eq("status", "tayang");

      if (!error && count !== null) {
        setTotalEtalaseTayang(count);
      } else {
        // Fallback jika id spesifik belum terikat
        const { count: fallbackCount } = await supabase
          .from("etalase")
          .select("id", { count: "exact", head: true })
          .eq("status", "tayang");
        if (fallbackCount !== null) setTotalEtalaseTayang(fallbackCount);
      }
    } catch (err) {
      console.error("fetchEtalaseCount error:", err);
    }
  }, []);

  const fetchPenjualan = useCallback(async () => {
    try {
      const list = await getPenjualanAdminTokoAction();
      setPenjualanList(list || []);
    } catch (err) {
      console.error("fetchPenjualan error:", err);
    }
  }, []);

  const fetchProdusenList = useCallback(async () => {
    try {
      const { data: produsenData } = await supabase.from("produsen").select("id, nama_usaha, desa, kabupaten, kategori").eq("status", "aktif");
      const { data: produkData } = await supabase.from("produk").select("id, nama, harga, satuan, produsen_id");
        
      if (produsenData) {
        const mapped: Produsen[] = produsenData.map((p) => {
          const relatedProduk = (produkData || []).filter((prod) => prod.produsen_id === p.id);
          const komoditas = relatedProduk.map((r) => r.nama).join(", ") || p.kategori || "Bahan Pangan";
          const hariEst = Math.floor(Math.random() * 14) + 2;
          return {
            id: p.id,
            nama: p.nama_usaha || "Produsen",
            lokasi: `${p.desa || ""}, ${p.kabupaten || ""}`.trim().replace(/^,\s*/, ""),
            komoditas: komoditas,
            estimasiRestockHari: hariEst,
            estimasiPanenHari: hariEst,
          };
        });
        setProdusenList(mapped);
      }
    } catch (e) {
      console.error("fetchProdusenList error:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("admin_inventaris_list");
    }

    periksaKelengkapanAdmin();
    fetchInventaris();
    fetchPenjualan();
    fetchProdusenList();
    fetchPembelianLive();
    fetchEtalaseCount();

    const channel = supabase
      .channel("realtime-admin-toko")
      .on("postgres_changes", { event: "*", schema: "public", table: "pesanan" }, () => {
        fetchPembelianLive();
        fetchPenjualan();
        fetchEtalaseCount();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [periksaKelengkapanAdmin, fetchInventaris, fetchPenjualan, fetchProdusenList, fetchPembelianLive, fetchEtalaseCount]);

  function belanjaProdusen(produsenId: string, item: string, jumlah: number, hargaSatuan: number, satuan: string) {
    fetchPembelianLive();
  }

  async function terimaPembelian(id: string, grade: Grade, rating?: number, fotoUlasan?: string, keteranganUlasan?: string) {
    await fetchPembelianLive();
    await fetchInventaris();
  }

  async function handleUpdateStatusPenjualan(orderId: string, status: string, noResi?: string) {
    const ok = await updateOrderStatusAction(orderId, status, noResi);
    if (ok) {
      await fetchPenjualan();
    }
  }

  async function updateStok(id: string, patch: Partial<StokToko>) {
    let updatedList = stokList.map((item) => {
      if (item.id === id || item.produk_id === id) {
        const metaKey = `inventaris_meta_${item.id}`;
        if (typeof window !== "undefined") {
          const stored = localStorage.getItem(metaKey);
          const currentMeta = stored ? JSON.parse(stored) : {};
          localStorage.setItem(metaKey, JSON.stringify({ ...currentMeta, ...patch }));
        }
        return { ...item, ...patch };
      }
      return item;
    });

    setStokList(updatedList);
  }

  // HITUNG METRIK DINAMIS DASHBOARD
  const pesananMenunggu = penjualanList.filter((p) => p.status === "Belum Dibayar" || p.status === "Diproses").length;
  const totalOmset = penjualanList.filter((p) => p.status === "Selesai" || p.status === "Dikirim" || p.status === "Diproses").reduce((s, p) => s + p.total, 0);
  const totalStokUnit = stokList.reduce((acc, curr) => acc + (Number(curr.jumlah) || 0), 0);
  const barangRestockKritis = stokList.filter((s) => s.jumlah <= 15 || s.jumlah <= s.batasMinimum);

  function selectMenu(key: string) {
    if (isSuspended) {
      alert("Akses Ditangguhkan: Akun Anda dalam status dibekukan.");
      return;
    }
    if (!isDataLengkap && key !== "dashboard") {
      alert("Harap lengkapi Profil Toko Anda terlebih dahulu!");
      setProfilPopupOpen(true);
      return;
    }
    setActiveMenu(key);
    setSidebarOpen(false);
  }

  if (loadingProfil) return <div style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontFamily: "sans-serif" }}>Menyelaraskan Autentikasi Admin...</div>;

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .at-sidebar { width: 220px; }
        .at-hamburger { display: none; }
        .at-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; }
        .at-panels-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 16px; }
        .at-user-name { display: block; }
        
        @media (max-width: 1024px) {
          .at-stats-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .at-panels-grid { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 900px) {
          .at-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .at-sidebar.open { transform: translateX(0); }
          .at-hamburger { display: flex; }
          .hero-banner-container { padding: 1rem !important; border-radius: 12px !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.5rem !important; }
          .at-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
        }
        @media (max-width: 480px) { 
          .at-user-name { display: none; } 
          .at-stats-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

     
      {isSuspended && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.75)", backdropFilter: "blur(4px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "2rem", width: "420px", maxWidth: "100%", textAlign: "center" }}>
            <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "#FEE2E2", color: "#EF4444", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem auto", fontSize: "1.5rem", fontWeight: 800 }}>🚫</div>
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1E293B", margin: "0 0 0.5rem 0" }}>Akun Toko Ditangguhkan</h2>
            <p style={{ fontSize: "0.85rem", color: "#64748B", lineHeight: 1.5, margin: "0 0 1.5rem 0" }}>Akses akun Admin Toko Anda telah dibekukan sementara oleh Admin Platform PasarNusa.</p>
            <Link href="/login" style={{ display: "inline-block", width: "100%", padding: "0.75rem", borderRadius: "8px", background: "#EF4444", color: "white", fontWeight: 700, textDecoration: "none", fontSize: "0.9rem" }}>Keluar Ke Halaman Login</Link>
          </div>
        </div>
      )}

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 40 }} />}

    
      <aside className={`at-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              <img src="/logo.png" alt="Logo PasarNusa" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div><div style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Admin Toko Dashboard</div></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="at-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", letterSpacing: ".04em", textTransform: "uppercase", padding: "0 8px 6px" }}>{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const menuTerpaku = !isDataLengkap && item.key !== "dashboard";
                const isParentActive = activeMenu.startsWith(item.key);

                if (item.children) {
                  const isOpen = openSubmenu === item.key;
                  return (
                    <div key={item.key} style={{ marginBottom: "2px" }}>
                      <div
                        onClick={() => {
                          if (menuTerpaku) return;
                          setOpenSubmenu(isOpen ? null : item.key);
                          if (item.children?.[0]) {
                            selectMenu(item.children[0].key);
                          }
                        }}
                        style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 10px", borderRadius: "8px", background: isParentActive ? "#FEF3C7" : "transparent", color: menuTerpaku ? "#CBD5E1" : isParentActive ? "#D97706" : "#334155", fontSize: "13px", cursor: menuTerpaku ? "not-allowed" : "pointer", fontWeight: isParentActive ? 700 : 500 }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                          <Icon /> <span>{item.label}</span>
                        </div>
                        <span style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform .2s" }}><IconChevronDown /></span>
                      </div>
                      {isOpen && (
                        <div style={{ paddingLeft: "28px", marginTop: "4px", display: "flex", flexDirection: "column", gap: "2px" }}>
                          {item.children.map((sub) => {
                            const activeSub = activeMenu === sub.key;
                            return (
                              <div
                                key={sub.key}
                                onClick={() => selectMenu(sub.key)}
                                style={{ padding: "7px 10px", borderRadius: "6px", background: activeSub ? "#F59E0B" : "transparent", color: activeSub ? "#fff" : "#64748B", fontSize: "12px", cursor: "pointer", fontWeight: activeSub ? 700 : 500 }}
                              >
                                {sub.label}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                }

                const active = activeMenu === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: active ? "#F59E0B" : "transparent", color: menuTerpaku ? "#CBD5E1" : active ? "#fff" : "#334155", fontSize: "13px", cursor: menuTerpaku ? "not-allowed" : "pointer", marginBottom: "1px", fontWeight: active ? 700 : 500 }}
                  >
                    <Icon /> <span style={{ flex: 1 }}>{item.label}</span>
                  </div>
                );
              })}
            </div>
          ))}
        </nav>
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "12px" }}>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "8px", background: "#FEE2E2", color: "#EF4444", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Keluar</Link>
        </div>
      </aside>

 
      <div style={{ flex: 1, height: "100vh", overflowY: "auto", minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px clamp(1rem, 4vw, 1.75rem)", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setSidebarOpen(true)} className="at-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#334155" }} aria-label="Buka menu"><IconMenu /></button>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#1E293B" }}>{pageTitles[activeMenu] || "Dashboard"}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div onClick={() => setProfilPopupOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#F59E0B", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {headerProfil.fotoUrl ? <img src={headerProfil.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : headerProfil.inisial}
              </div>
              <div className="at-user-name">
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B" }}>{headerProfil.namaPemilik}</div>
                <div style={{ fontSize: "10.5px", color: "#94A3B8" }}>PasarNusa Admin Toko</div>
              </div>
              <span className="at-user-name" style={{ color: "#94A3B8" }}><IconChevronDown /></span>
            </div>
          </div>
        </div>


        {activeMenu === "dashboard" && (
          <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
            
       
            <div className="hero-banner-container" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconSparkle /> Platform Rantai Pasok & UMKM #1 Indonesia</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {headerProfil.namaPemilik.split(" ")[0]}!</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.9)", marginTop: "0.3rem", maxWidth: "480px" }}>Pantau arus kas, analisis prediktif restock komoditas, dan kelola distribusi toko Anda secara real-time.</div>
              </div>


              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                <button onClick={() => selectMenu("etalase")} style={{ background: "#fff", color: "#D97706", border: "none", padding: "0.6rem 1rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
                  + Tambah Etalase
                </button>
                <button onClick={() => selectMenu("marketplace")} style={{ background: "rgba(255,255,255,0.2)", color: "#fff", border: "1px solid rgba(255,255,255,0.4)", padding: "0.6rem 1rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>
                  Beli Bahan Baku
                </button>
              </div>
            </div>


            <div className="at-stats-grid" style={{ marginBottom: "1.5rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem" }}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>OMSET PENJUALAN</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E293B" }}>{formatRupiahRingkas(totalOmset)}</div>
                <div style={{ fontSize: "0.7rem", color: "#10B981", marginTop: "0.3rem" }}>Pendapatan Bersih</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("pelacakan-produsen-toko")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PESANAN MENUNGGU</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: pesananMenunggu > 0 ? "#F59E0B" : "#1E293B" }}>{pesananMenunggu} Pesanan</div>
                <div style={{ fontSize: "0.7rem", color: "#D97706", marginTop: "0.3rem", fontWeight: 600 }}>Lacak pesanan →</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("inventaris")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>STOK GUDANG TOKO</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E293B" }}>{stokList.length} Produk</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.3rem" }}>Total: {totalStokUnit} unit</div>
              </div>

              <div style={{ background: barangRestockKritis.length > 0 ? "#FEF2F2" : "#fff", border: `1px solid ${barangRestockKritis.length > 0 ? "#FCA5A5" : "#E2E8F0"}`, borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("restock")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: barangRestockKritis.length > 0 ? "#991B1B" : "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>ALERT RESTOCK</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: barangRestockKritis.length > 0 ? "#DC2626" : "#1E293B" }}>{barangRestockKritis.length} Barang</div>
                <div style={{ fontSize: "0.7rem", color: barangRestockKritis.length > 0 ? "#DC2626" : "#10B981", marginTop: "0.3rem", fontWeight: 600 }}>{barangRestockKritis.length > 0 ? "Stok ≤15 pcs" : "Stok Aman"}</div>
              </div>

             
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("etalase")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>ETALASE PENJUALAN</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 800, color: "#1E293B" }}>{totalEtalaseTayang} Live</div>
                <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.3rem" }}>Tampil di Pembeli</div>
              </div>
            </div>

       
            <div className="at-panels-grid">
              
          
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ color: "#EF4444" }}><IconAlert /></span>
                    <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1E293B" }}>Perlu Restock Segera</h3>
                  </div>
                  <button onClick={() => selectMenu("restock")} style={{ background: "none", border: "none", color: "#F59E0B", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>Lihat Semua →</button>
                </div>

                {barangRestockKritis.length === 0 ? (
                  <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "1.5rem", textAlign: "center", color: "#64748B", fontSize: "0.85rem" }}>
                    🎉 Semua stok barang gudang Anda dalam kondisi aman (di atas 15 pcs).
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                    {barangRestockKritis.slice(0, 4).map((item) => (
                      <div key={item.id} style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "0.75rem 1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <div>
                          <div style={{ fontSize: "0.88rem", fontWeight: 800, color: "#1E293B" }}>{item.nama}</div>
                          <div style={{ fontSize: "0.75rem", color: "#DC2626", marginTop: "2px" }}>Sisa Stok: <strong>{item.jumlah} {item.satuan}</strong> (Min: {item.batasMinimum} {item.satuan})</div>
                        </div>
                        <button onClick={() => selectMenu("marketplace")} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.75rem", fontWeight: 700, padding: "0.45rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}>
                          Restock Now
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

        
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.25rem", display: "flex", flexDirection: "column" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1E293B" }}>Aktivitas Pesanan Terakhir</h3>
                  <button onClick={() => selectMenu("pelacakan-produsen-toko")} style={{ background: "none", border: "none", color: "#F59E0B", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer" }}>Lacak Semua →</button>
                </div>

                {pembelianList.length === 0 ? (
                  <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "1.5rem", textAlign: "center", color: "#94A3B8", fontSize: "0.85rem" }}>
                    Belum ada riwayat pesanan bahan baku dari produsen.
                  </div>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                    {pembelianList.slice(0, 4).map((p) => (
                      <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px dashed #F1F5F9" }}>
                        <div>
                          <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>{p.item}</div>
                          <div style={{ fontSize: "0.72rem", color: "#64748B" }}>{p.produsen} • {p.jumlah} {p.satuan}</div>
                        </div>
                        <div style={{ textAlign: "right" }}>
                          <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "#1E293B" }}>{formatRupiah(p.total)}</div>
                          <span style={{ fontSize: "0.65rem", fontWeight: 800, padding: "2px 6px", borderRadius: "4px", background: p.status === "Selesai" ? "#D1FAE5" : "#FEF3C7", color: p.status === "Selesai" ? "#065F46" : "#D97706" }}>
                            {p.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </main>
        )}

      
        {activeMenu === "marketplace" && isDataLengkap && <MarketplaceProdusen belanjaProdusen={belanjaProdusen} pembelianList={pembelianList} />}
        
      
        {activeMenu === "inventaris" && isDataLengkap && (
          <InventarisGrading 
            stokList={stokList} 
          />
        )}

        {(activeMenu === "pelacakan" || activeMenu === "pelacakan-produsen-toko" || activeMenu === "pelacakan-toko-pembeli") && isDataLengkap && (
          <PelacakanPesanan 
            pembelianList={pembelianList} 
            penjualanList={penjualanList}
            terimaPesanan={terimaPembelian} 
            updateStatusPenjualan={handleUpdateStatusPenjualan}
            alamatToko={alamatToko} 
            tabDefault={activeMenu === "pelacakan-toko-pembeli" ? "toko-pembeli" : "produsen-toko"}
            onRefreshData={fetchPembelianLive}
          />
        )}

        {activeMenu === "restock" && isDataLengkap && <SmartRestock produsenList={produsenList} stokList={stokList} updateStok={updateStok} onPesan={() => selectMenu("marketplace")} />}
        {activeMenu === "etalase" && isDataLengkap && <EtalasePenjualan stokList={stokList} updateStok={updateStok} />}
        {activeMenu === "laporan" && isDataLengkap && <LaporanBukuKas />}
      </div>

      <ProfilTokoPage open={profilPopupOpen} onClose={() => setProfilPopupOpen(false)} onProfileUpdate={periksaKelengkapanAdmin} />
    </div>
  );
}