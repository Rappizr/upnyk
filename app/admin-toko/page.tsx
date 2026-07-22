"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import {
  supabase,
  getInventarisAdminToko,
  addInventarisAdminToko,
  updateInventarisStok,
} from "@/lib/db";

import MarketplaceProdusen from "./components/marketplace-produsen";
import InventarisGrading from "./components/inventaris-grading";
import SmartRestock from "./components/smart-restock";
import EtalasePenjualan from "./components/etalase-penjualan";
import LaporanBukuKas from "./components/laporan-buku-kas";
import ProfilTokoPage from "./components/profil-toko";
import PelacakanPesanan from "./components/pelacakan-pesanan";

export type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiPanenHari: number;
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
}

export interface Pembelian {
  id: string;
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

export interface Penjualan {
  id: string;
  pembeli: string;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
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
const IconArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

interface MenuItemDef { key: string; label: string; icon: () => ReactElement }
interface MenuGroupDef { title: string; items: MenuItemDef[] }

const menuGroups: MenuGroupDef[] = [
  { title: "Main", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  { title: "Belanja Bahan Baku", items: [
    { key: "marketplace", label: "Marketplace Produsen", icon: IconStore },
    { key: "pelacakan", label: "Pelacakan Pesanan", icon: IconTruck },
  ] },
  { title: "Manajemen Stok", items: [
    { key: "inventaris", label: "Inventaris", icon: IconBox },
    { key: "restock", label: "Smart Restock", icon: IconRefresh },
  ] },
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
  inventaris: "Inventaris",
  restock: "Smart Restock",
  etalase: "Etalase Penjualan",
  laporan: "Buku Kas",
};

export default function AdminTokoDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilPopupOpen, setProfilPopupOpen] = useState(false);

  const [isDataLengkap, setIsDataLengkap] = useState(true);
  const [loadingProfil, setLoadingProfil] = useState(true);

  const [headerProfil, setHeaderProfil] = useState({
    namaPemilik: "Admin PasarNusa",
    namaToko: "Toko Baru Admin",
    inisial: "AT",
    fotoUrl: ""
  });
  const [alamatToko, setAlamatToko] = useState("");

  const [produsenList, setProdusenList] = useState<Produsen[]>([]);
  const [stokList, setStokList] = useState<StokToko[]>([]);
  const [pembelianList, setPembelianList] = useState<Pembelian[]>([]);
  const [penjualanList] = useState<Penjualan[]>([]);

  const periksaKelengkapanAdmin = useCallback(async () => {
    setLoadingProfil(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoadingProfil(false); return; }

    const { data: profile } = await supabase.from("profiles").select("nama, avatar_url").eq("id", user.id).maybeSingle();
    const { data: adminToko } = await supabase.from("admin_toko").select("nama_toko, alamat, desa, kecamatan, kabupaten, provinsi").eq("profile_id", user.id).maybeSingle();

    const lengkap = !!(adminToko && adminToko.alamat && adminToko.nama_toko);
    setIsDataLengkap(lengkap);

    if (adminToko) {
      const alamatLengkap = [adminToko.alamat, adminToko.desa, adminToko.kecamatan, adminToko.kabupaten, adminToko.provinsi].filter(Boolean).join(", ");
      if (alamatLengkap) setAlamatToko(alamatLengkap);
    }

    if (!lengkap) {
      setActiveMenu("dashboard");
    }

    setHeaderProfil({
      namaPemilik: profile?.nama || "Admin Toko",
      namaToko: adminToko?.nama_toko || "Nama Toko Belum Diisi",
      inisial: adminToko?.nama_toko ? adminToko.nama_toko.slice(0, 2).toUpperCase() : "AT",
      fotoUrl: profile?.avatar_url || ""
    });
    setLoadingProfil(false);
  }, []);

  const fetchInventaris = useCallback(async () => {
    try {
      const dbItems = await getInventarisAdminToko();
      
      let localInv: any[] = [];
      if (typeof window !== "undefined") {
        try {
          const stored = localStorage.getItem("admin_inventaris_list");
          if (stored) localInv = JSON.parse(stored);
        } catch {
          console.error("Gagal membaca localStorage admin_inventaris_list");
        }
      }

      const mergedMap = new Map();

      localInv.forEach((item) => {
        mergedMap.set(item.produk_id || item.id, item);
      });

      dbItems.forEach((item) => {
        const metaKey = `inventaris_meta_${item.produk_id}`;
        let localMeta: Partial<StokToko> = {};
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem(metaKey);
            if (stored) localMeta = JSON.parse(stored);
          } catch {}
        }
        
        const mappedItem = {
          id: item.id,
          produk_id: item.produk_id,
          nama: item.nama,
          jumlah: item.jumlah,
          satuan: item.satuan,
          batasMinimum: localMeta.batasMinimum !== undefined ? localMeta.batasMinimum : item.batasMinimum,
          hargaBeli: item.hargaBeli,
          hargaJual: localMeta.hargaJual !== undefined ? localMeta.hargaJual : item.hargaJual,
          diskonPersen: localMeta.diskonPersen !== undefined ? localMeta.diskonPersen : item.diskonPersen,
          grade: localMeta.grade || item.grade || "Belum Dinilai",
          asalProdusen: item.asalProdusen,
          live: localMeta.live !== undefined ? localMeta.live : item.live,
          foto: item.foto || null,
        };
        
        mergedMap.set(item.produk_id || item.id, mappedItem);
      });

      const finalItems = Array.from(mergedMap.values());
      setStokList(finalItems);

      if (typeof window !== "undefined") {
        localStorage.setItem("admin_inventaris_list", JSON.stringify(finalItems));
      }
    } catch (err) {
      console.error("fetchInventaris error:", err);
    }
  }, []);

  const fetchProdusenList = useCallback(async () => {
    try {
      const { data: produsenData } = await supabase
        .from("produsen")
        .select("id, nama_usaha, desa, kabupaten, kategori")
        .eq("status", "aktif");
      
      const { data: produkData } = await supabase
        .from("produk")
        .select("id, nama, harga, satuan, produsen_id");
        
      if (produsenData) {
        const mapped = produsenData.map((p) => {
          const relatedProduk = (produkData || []).filter((prod) => prod.produsen_id === p.id);
          const komoditas = relatedProduk.map((r) => r.nama).join(", ") || p.kategori || "Bahan Pangan";
          
          return {
            id: p.id,
            nama: p.nama_usaha || "Produsen",
            lokasi: `${p.desa || ""}, ${p.kabupaten || ""}`.trim().replace(/^,\s*/, ""),
            komoditas: komoditas,
            estimasiPanenHari: Math.floor(Math.random() * 14) + 2,
          };
        });
        setProdusenList(mapped);
      }
    } catch (e) {
      console.error("fetchProdusenList error:", e);
    }
  }, []);

  const sinkronisasiBarangDiterima = useCallback(async () => {
    const diterimaList = pembelianList.filter((p) => p.status === "Diterima");
    if (diterimaList.length === 0) return;

    let updatedDb = false;
    for (const po of diterimaList) {
      // Periksa apakah item ini sudah ada di stokList berdasarkan nama
      const inStok = stokList.some((s) => s.nama.toLowerCase() === po.item.toLowerCase());
      if (!inStok) {
        let produkId = "";
        try {
          const { data: mpProd } = await supabase
            .from("marketplace")
            .select("id")
            .eq("produsen_id", po.produsenId)
            .ilike("nama", `%${po.item}%`)
            .limit(1)
            .maybeSingle();

          if (mpProd) {
            produkId = mpProd.id;
          } else {
            const { data: b2bProd } = await supabase
              .from("produk")
              .select("*")
              .eq("produsen_id", po.produsenId)
              .ilike("nama", `%${po.item}%`)
              .limit(1)
              .maybeSingle();

            let targetB2b = b2bProd;
            if (!targetB2b) {
              const { data: fallbackB2b } = await supabase
                .from("produk")
                .select("*")
                .eq("produsen_id", po.produsenId)
                .limit(1)
                .maybeSingle();
              targetB2b = fallbackB2b;
            }

            if (targetB2b) {
              const b2cPrice = Math.round(targetB2b.harga * 1.3);
              const { data: newB2c, error: createError } = await supabase
                .from("marketplace")
                .insert({
                  nama: targetB2b.nama,
                  harga: b2cPrice,
                  deskripsi: targetB2b.deskripsi || "",
                  satuan: targetB2b.satuan || "kg",
                  berat: targetB2b.berat || 0,
                  foto: targetB2b.foto || null,
                  kategori_id: targetB2b.kategori_id || null,
                  produsen_id: targetB2b.produsen_id || null,
                })
                .select("id")
                .single();

              if (!createError && newB2c) {
                produkId = newB2c.id;
              }
            }
          }

          if (produkId) {
            await addInventarisAdminToko({
              produk_id: produkId,
              stok: po.jumlah,
              stok_minimum: 10,
            });
            updatedDb = true;
          }
        } catch (err) {
          console.error("Gagal sinkronisasi produk diterima:", err);
        }
      }
    }

    if (updatedDb) {
      await fetchInventaris();
    }
  }, [pembelianList, stokList, fetchInventaris]);

  useEffect(() => {
    sinkronisasiBarangDiterima();
  }, [stokList, sinkronisasiBarangDiterima]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedPembelian = localStorage.getItem("admin_pembelian_list");
      if (storedPembelian) {
        try {
          setPembelianList(JSON.parse(storedPembelian));
        } catch {
          // JSON Parse fallback
        }
      }
    }
    fetchProdusenList();
  }, [fetchProdusenList]);

  useEffect(() => {
    periksaKelengkapanAdmin();
    fetchInventaris();
  }, [activeMenu, periksaKelengkapanAdmin, fetchInventaris]);

  function belanjaProdusen(produsenId: string, item: string, jumlah: number, hargaSatuan: number, satuan: string) {
    const produsen = produsenList.find((p) => p.id === produsenId);
    if (!produsen) return;
    const id = `PO-${4400 + pembelianList.length + 1}`;
    const total = jumlah * hargaSatuan;
    const newPo: Pembelian = { 
      id, produsenId, produsen: produsen.nama, item, jumlah, satuan, hargaSatuan, total, status: "Menunggu", tanggal: todayLabel() 
    };
    
    setPembelianList((prev) => {
      const updated = [newPo, ...prev];
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_pembelian_list", JSON.stringify(updated));
      }
      return updated;
    });
  }

  async function terimaPembelian(id: string, grade: Grade, rating?: number, fotoUlasan?: string, keteranganUlasan?: string) {
    const po = pembelianList.find((p) => p.id === id);
    if (!po) return;

    let targetB2b = null;
    try {
      const { data: b2bProd } = await supabase
        .from("produk")
        .select("*")
        .eq("produsen_id", po.produsenId)
        .ilike("nama", `%${po.item}%`)
        .limit(1)
        .maybeSingle();
      
      targetB2b = b2bProd;
      if (!targetB2b) {
        const { data: fallbackB2b } = await supabase
          .from("produk")
          .select("*")
          .eq("produsen_id", po.produsenId)
          .limit(1)
          .maybeSingle();
        targetB2b = fallbackB2b;
      }
    } catch (err) {
      console.error("Gagal mencocokkan produk B2B:", err);
    }

    const matchedB2bId = targetB2b?.id || `local-${Date.now()}`;
    const matchedB2bNama = targetB2b?.nama || po.item;
    const matchedB2bHarga = targetB2b?.harga || po.hargaSatuan;
    const matchedB2bSatuan = targetB2b?.satuan || po.satuan || "kg";
    const matchedB2bFoto = targetB2b?.foto || null;

    const asalProdusen = po.produsen || 'Produsen Lokal';

    let localInv: any[] = [];
    if (typeof window !== "undefined") {
      try {
        localInv = JSON.parse(localStorage.getItem("admin_inventaris_list") || "[]");
      } catch {}
    }

    const existingIndex = localInv.findIndex((s) => s.produk_id === matchedB2bId || s.nama === po.item);
    let updatedItem: any;
    if (existingIndex > -1) {
      localInv[existingIndex].jumlah += po.jumlah;
      localInv[existingIndex].grade = grade;
      updatedItem = localInv[existingIndex];
    } else {
      updatedItem = {
        id: `inv-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        produk_id: matchedB2bId,
        nama: matchedB2bNama,
        jumlah: po.jumlah,
        satuan: matchedB2bSatuan,
        batasMinimum: 10,
        hargaBeli: matchedB2bHarga,
        hargaJual: Math.round(matchedB2bHarga * 1.3),
        diskonPersen: 0,
        grade: grade,
        asalProdusen: asalProdusen,
        live: false,
        foto: matchedB2bFoto
      };
      localInv.push(updatedItem);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("admin_inventaris_list", JSON.stringify(localInv));
      
      const metaKey = `inventaris_meta_${matchedB2bId}`;
      try {
        const stored = localStorage.getItem(metaKey) || "{}";
        const meta = JSON.parse(stored);
        meta.grade = grade;
        localStorage.setItem(metaKey, JSON.stringify(meta));
      } catch {}
    }

    try {
      await addInventarisAdminToko({
        produk_id: matchedB2bId,
        stok: updatedItem.jumlah,
        stok_minimum: updatedItem.batasMinimum
      });
    } catch (dbErr) {
      console.warn("Background DB sync ignored:", dbErr);
    }

    setPembelianList((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, status: "Diterima" as const, rating, fotoUlasan, keteranganUlasan } : p));
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_pembelian_list", JSON.stringify(updated));
      }
      return updated;
    });

    await fetchInventaris();
  }

  async function updateStok(id: string, patch: Partial<StokToko>) {
    let updatedList = stokList.map((item) => {
      if (item.id === id || item.produk_id === id) {
        const updated = { ...item, ...patch };
        const metaKey = `inventaris_meta_${item.produk_id || item.id}`;
        if (typeof window !== "undefined") {
          try {
            const stored = localStorage.getItem(metaKey) || "{}";
            const meta = JSON.parse(stored);
            if (patch.hargaJual !== undefined) meta.hargaJual = patch.hargaJual;
            if (patch.diskonPersen !== undefined) meta.diskonPersen = patch.diskonPersen;
            if (patch.live !== undefined) meta.live = patch.live;
            if (patch.grade !== undefined) meta.grade = patch.grade;
            if (patch.batasMinimum !== undefined) meta.batasMinimum = patch.batasMinimum;
            localStorage.setItem(metaKey, JSON.stringify(meta));
          } catch {}
        }
        return updated;
      }
      return item;
    });

    setStokList(updatedList);
    if (typeof window !== "undefined") {
      localStorage.setItem("admin_inventaris_list", JSON.stringify(updatedList));
    }

    const item = stokList.find((s) => s.id === id);
    if (item && patch.jumlah !== undefined) {
      try {
        await updateInventarisStok(item.id, patch.jumlah);
      } catch (err) {
        console.warn("Background DB update ignored:", err);
      }
    }
  }

  const totalStokNilai = stokList.reduce((s, x) => s + x.jumlah * x.hargaJual, 0);
  const pesananMenunggu = pembelianList.filter((p) => p.status === "Menunggu" || p.status === "Dikirim").length;
  const totalOmset = penjualanList.reduce((s, p) => s + p.total, 0);
  const totalBelanja = pembelianList.reduce((s, p) => s + p.total, 0);
  const labaBersih = totalOmset - totalBelanja;
  const restockMendesak = produsenList.filter((p) => p.estimasiPanenHari <= 7).length;
  const produkLive = stokList.filter((s) => s.live).length;

  function selectMenu(key: string) {
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
        .at-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .at-panels-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .at-user-name { display: block; }
        
        @media (max-width: 900px) {
          .at-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .at-sidebar.open { transform: translateX(0); }
          .at-hamburger { display: flex; }
          .hero-banner-container { padding: 0.85rem !important; border-radius: 10px !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.4rem !important; }
          .at-stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.25rem !important; margin-bottom: 1rem !important; }
          .at-panels-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) { .at-user-name { display: none; } }
      `}} />

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
                const active = activeMenu === item.key;
                const menuTerpaku = !isDataLengkap && item.key !== "dashboard";
                
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: active ? "#F59E0B" : "transparent", color: menuTerpaku ? "#CBD5E1" : active ? "#fff" : "#334155", fontSize: "13px", cursor: menuTerpaku ? "not-allowed" : "pointer", marginBottom: "1px", fontWeight: active ? 700 : 500, opacity: menuTerpaku ? 0.5 : 1 }}
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
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#1E293B" }}>{pageTitles[activeMenu]}</div>
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
            
            {!isDataLengkap && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "1rem", borderRadius: "10px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.25rem", lineHeight: "1.4", textAlign: "center" }}>
                ⚠️ Akun Admin Toko Anda mendeteksi data legalitas belum terdaftar lengkap. Silakan klik tombol profil di pojok kanan atas atau tombol lengkapi di bawah untuk mengisi nama toko & alamat cabang operasional agar fitur belanja hulu serta kasir penjualan dapat diaktifkan kembali.
              </div>
            )}

            <div className="hero-banner-container" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconSparkle /> Platform UMKM #1 Indonesia</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {headerProfil.namaPemilik.split(" ")[0]}!</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.9)", marginTop: "0.3rem", maxWidth: "440px" }}>Pantau arus kas, analisis prediktif restock komoditas, dan kelola rantai pasok dari hulu ke hilir.</div>
              </div>
              <button onClick={() => isDataLengkap ? selectMenu("laporan") : setProfilPopupOpen(true)} style={{ background: "#fff", color: "#D97706", border: "none", padding: "0.65rem 1.1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                {isDataLengkap ? "Lihat Buku Kas" : "Lengkapi Profil Sekarang"} <IconArrowRight />
              </button>
            </div>

            <div className="at-stats-grid" style={{ marginBottom: "1.25rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>OMSET PENJUALAN</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalOmset)}</div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }}>{penjualanList.length} transaksi</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: isDataLengkap ? "pointer" : "not-allowed" }} onClick={() => isDataLengkap && selectMenu("etalase")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PRODUK LIVE</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{produkLive}</div>
                <div style={{ fontSize: "0.68rem", color: "#F59E0B", marginTop: "0.15rem" }}>Lihat etalase →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: isDataLengkap ? "pointer" : "not-allowed" }} onClick={() => isDataLengkap && selectMenu("pelacakan")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PESANAN MENUNGGU</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{pesananMenunggu}</div>
                <div style={{ fontSize: "0.68rem", color: "#D97706", marginTop: "0.15rem" }}>Lacak pesanan →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>NILAI STOK GUDANG</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalStokNilai)}</div>
                <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.15rem" }}>{stokList.length} jenis produk</div>
              </div>
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#065F46", letterSpacing: ".03em", marginBottom: "0.4rem" }}>LABA BERSIH</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065F46" }}>{formatRupiahRingkas(labaBersih)}</div>
                <div style={{ fontSize: "0.68rem", color: "#059669", marginTop: "0.15rem" }}>Margin {totalOmset ? Math.round((labaBersih / totalOmset) * 100) : 0}%</div>
              </div>
            </div>

            <div className="at-panels-grid">
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>Smart restock alert</div>
                  {restockMendesak > 0 && <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>Butuh tindakan</span>}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Analisis prediktif berbasis jadwal panen produsen binaan</div>
                {produsenList.filter((p) => p.estimasiPanenHari <= 7).length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Belum ada produsen yang mendekati waktu panen atau data masih kosong.</p>
                ) : (
                  produsenList.filter((p) => p.estimasiPanenHari <= 7).sort((a, b) => a.estimasiPanenHari - b.estimasiPanenHari).map((p) => (
                    <div key={p.id} style={{ background: "#FFFBEB", borderRadius: "8px", padding: "0.6rem 0.7rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{p.nama}</div><div style={{ fontSize: "0.68rem", color: "#B45309" }}>{p.komoditas} • Prediksi panen {p.estimasiPanenHari} hari lagi</div></div>
                      <button onClick={() => isDataLengkap ? selectMenu("marketplace") : setProfilPopupOpen(true)} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.68rem", fontWeight: 600, padding: "0.4rem 0.77rem", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>Pesan Sekarang</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.2rem" }}>Penjualan terbaru</div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Transaksi ke pembeli kota</div>
                {penjualanList.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Belum ada data penjualan tercatat.</p>
                ) : (
                  penjualanList.slice(0, 3).map((s, i) => (
                    <div key={s.id} style={{ padding: "0.5rem 0", borderBottom: i < penjualanList.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1E293B" }}>{s.pembeli}</span>
                        <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10B981" }}>{formatRupiah(s.total)}</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B" }}>{s.produk} × {s.jumlah}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        )}

        {/* SUB HALAMAN OPERASIONAL */}
        {activeMenu === "marketplace" && isDataLengkap && (
          <MarketplaceProdusen belanjaProdusen={belanjaProdusen} pembelianList={pembelianList} />
        )}
        {activeMenu === "pelacakan" && isDataLengkap && (
          <PelacakanPesanan 
            pembelianList={pembelianList} 
            terimaPesanan={terimaPembelian} 
            alamatToko={alamatToko} 
          />
        )}
        {activeMenu === "inventaris" && isDataLengkap && (
          <InventarisGrading 
            stokList={stokList} 
            pembelianList={pembelianList} 
            produsenList={produsenList} 
            terimaPembelian={terimaPembelian} 
            updateStok={updateStok} 
          />
        )}
        {activeMenu === "restock" && isDataLengkap && (
          <SmartRestock 
            produsenList={produsenList} 
            stokList={stokList} 
            updateStok={updateStok} 
            onPesan={() => selectMenu("marketplace")} 
          />
        )}
        {activeMenu === "etalase" && isDataLengkap && (
          <EtalasePenjualan stokList={stokList} updateStok={updateStok} />
        )}
        {activeMenu === "laporan" && isDataLengkap && (
          <LaporanBukuKas pembelianList={pembelianList} penjualanList={penjualanList} />
        )}
      </div>

      <ProfilTokoPage
        open={profilPopupOpen}
        onClose={() => setProfilPopupOpen(false)}
        onProfileUpdate={periksaKelengkapanAdmin}
      />
    </div>
  );
}