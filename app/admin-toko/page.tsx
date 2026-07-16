"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";

import MarketplaceProdusen from "./components/marketplace-produsen";
import InventarisGrading from "./components/inventaris-grading";
import SmartRestock from "./components/smart-restock";
import EtalasePenjualan from "./components/etalase-penjualan";
import LaporanBukuKas from "./components/laporan-buku-kas";
import ProfilTokoPage, { ProfilToko } from "./components/profil-toko";

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
  status: "Menunggu" | "Diterima";
  tanggal: string;
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

const initialProdusen: Produsen[] = [
  { id: "PRD-01", nama: "Keripik Tempe Sanan", lokasi: "Malang, Jawa Timur", komoditas: "Keripik Tempe", estimasiPanenHari: 2 },
  { id: "PRD-02", nama: "Kopi Arabika Gayo", lokasi: "Surabaya, Jawa Timur", komoditas: "Kopi Arabika", estimasiPanenHari: 12 },
  { id: "PRD-03", nama: "Gabungan Kelompok Tani Jombang", lokasi: "Jombang, Jawa Timur", komoditas: "Beras Organik", estimasiPanenHari: 4 },
  { id: "PRD-04", nama: "Madu Hutan Sumbawa", lokasi: "Sumbawa, NTB", komoditas: "Madu Hutan", estimasiPanenHari: 20 },
];

const initialStok: StokToko[] = [
  { id: "STK-01", nama: "Keripik Tempe Original", jumlah: 85, satuan: "kg", batasMinimum: 20, hargaBeli: 32000, hargaJual: 45000, diskonPersen: 0, grade: "A", asalProdusen: "Keripik Tempe Sanan", live: true },
  { id: "STK-02", nama: "Beras Organik 5kg", jumlah: 40, satuan: "karung", batasMinimum: 15, hargaBeli: 55000, hargaJual: 78000, diskonPersen: 10, grade: "A", asalProdusen: "Gabungan Kelompok Tani Jombang", live: true },
  { id: "STK-03", nama: "Kopi Arabika Bubuk", jumlah: 6, satuan: "kg", batasMinimum: 10, hargaBeli: 55000, hargaJual: 78000, diskonPersen: 0, grade: "B", asalProdusen: "Kopi Arabika Gayo", live: true },
];

const initialPembelian: Pembelian[] = [
  { id: "PO-4401", produsenId: "PRD-02", produsen: "Kopi Arabika Gayo", item: "Kopi Arabika", jumlah: 15, satuan: "kg", hargaSatuan: 55000, total: 825000, status: "Menunggu", tanggal: "09 Jul 2026" },
];

const initialPenjualan: Penjualan[] = [
  { id: "SL-9001", pembeli: "Minimarket Sejahtera", produk: "Keripik Tempe Original", jumlah: 20, total: 900000, tanggal: "08 Jul 2026" },
  { id: "SL-9002", pembeli: "Warung Bu Ida", produk: "Beras Organik 5kg", jumlah: 6, total: 468000, tanggal: "09 Jul 2026" },
  { id: "SL-9003", pembeli: "Koperasi Pasar Besar", produk: "Keripik Tempe Original", jumlah: 12, total: 540000, tanggal: "10 Jul 2026" },
];

const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconBox = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconRefresh = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path></svg>;
const IconTag = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.5 3H4a1 1 0 0 0-1 1v5.5a2 2 0 0 0 .83 1.5l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"></path><circle cx="7.5" cy="7.5" r="1.5"></circle></svg>;
const IconBook = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z"></path></svg>;
const IconMenu = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconBell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconSparkle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path></svg>;
const IconArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

interface MenuItemDef { key: string; label: string; icon: () => ReactElement }
interface MenuGroupDef { title: string; items: MenuItemDef[] }

const menuGroups: MenuGroupDef[] = [
  { title: "Main", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  { title: "Belanja Bahan Baku", items: [{ key: "marketplace", label: "Marketplace Produsen", icon: IconStore }] },
  { title: "Manajemen Stok", items: [
    { key: "inventaris", label: "Inventaris & Grading", icon: IconBox },
    { key: "restock", label: "Smart Restock", icon: IconRefresh },
  ] },
  { title: "Penjualan", items: [{ key: "etalase", label: "Etalase Penjualan", icon: IconTag }] },
  { title: "Laporan", items: [{ key: "laporan", label: "Buku Kas", icon: IconBook }] },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatRupiahRingkas(n: number) {
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return formatRupiah(n);
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  marketplace: "Marketplace Produsen",
  inventaris: "Inventaris & Grading",
  restock: "Smart Restock",
  etalase: "Etalase Penjualan",
  laporan: "Buku Kas",
};

export default function AdminTokoDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilPopupOpen, setProfilPopupOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profilToko, setProfilToko] = useState<ProfilToko>({
    namaToko: "Warung Makmur Jaya",
    namaPemilik: "Arif Kurniawan",
    alamat: "Jl. Merdeka No. 5, Malang, Jawa Timur",
    telepon: "0812-9988-7766",
    email: "arif.makmurjaya@gmail.com",
    inisial: "AK",
  });

  const [produsenList] = useState<Produsen[]>(initialProdusen);
  const [stokList, setStokList] = useState<StokToko[]>(initialStok);
  const [pembelianList, setPembelianList] = useState<Pembelian[]>(initialPembelian);
  const [penjualanList] = useState<Penjualan[]>(initialPenjualan);

  function belanjaProdusen(produsenId: string, item: string, jumlah: number, hargaSatuan: number, satuan: string) {
    const produsen = produsenList.find((p) => p.id === produsenId);
    if (!produsen) return;
    const id = `PO-${4400 + pembelianList.length + 1}`;
    const total = jumlah * hargaSatuan;
    setPembelianList((prev) => [{ id, produsenId, produsen: produsen.nama, item, jumlah, satuan, hargaSatuan, total, status: "Menunggu", tanggal: todayLabel() }, ...prev]);
  }

  function terimaPembelian(id: string, grade: Grade) {
    setPembelianList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Diterima" } : p)));
    const po = pembelianList.find((p) => p.id === id);
    if (!po) return;
    setStokList((prev) => {
      const existing = prev.find((s) => s.nama === po.item && s.asalProdusen === po.produsen);
      if (existing) {
        return prev.map((s) => (s.id === existing.id ? { ...s, jumlah: s.jumlah + po.jumlah, grade } : s));
      }
      const newId = `STK-${String(prev.length + 1).padStart(2, "0")}`;
      return [...prev, { id: newId, nama: po.item, jumlah: po.jumlah, satuan: po.satuan, batasMinimum: 10, hargaBeli: po.hargaSatuan, hargaJual: Math.round(po.hargaSatuan * 1.4), diskonPersen: 0, grade, asalProdusen: po.produsen, live: false }];
    });
  }

  function updateStok(id: string, patch: Partial<StokToko>) {
    setStokList((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));
  }

  const totalStokNilai = stokList.reduce((s, x) => s + x.jumlah * x.hargaJual, 0);
  const pesananMenunggu = pembelianList.filter((p) => p.status === "Menunggu").length;
  const totalOmset = penjualanList.reduce((s, p) => s + p.total, 0);
  const totalBelanja = pembelianList.reduce((s, p) => s + p.total, 0);
  const labaBersih = totalOmset - totalBelanja;
  const restockMendesak = produsenList.filter((p) => p.estimasiPanenHari <= 7).length;
  const produkLive = stokList.filter((s) => s.live).length;
  const stokMenipis = stokList.filter((s) => s.jumlah <= s.batasMinimum);

  const 所有Notif = useMemo(() => {
    const list: { id: string; text: string; sub: string; tujuan: string }[] = [];
    stokMenipis.forEach((s) => list.push({ id: `stok-${s.id}`, text: `Stok ${s.nama} menipis`, sub: `Sisa ${s.jumlah} ${s.satuan}`, tujuan: "restock" }));
    pembelianList.filter((p) => p.status === "Menunggu").forEach((p) => list.push({ id: `po-${p.id}`, text: `Pembelian menunggu dari ${p.produsen}`, sub: `${p.item} × ${p.jumlah} ${p.satuan}`, tujuan: "inventaris" }));
    produsenList.filter((p) => p.estimasiPanenHari <= 7).forEach((p) => list.push({ id: `panen-${p.id}`, text: `${p.nama} mendekati panen`, sub: `${p.komoditas} • ${p.estimasiPanenHari} hari lagi`, tujuan: "restock" }));
    return list;
  }, [stokMenipis, pembelianList, produsenList]);

  function selectMenu(key: string) {
    setActiveMenu(key);
    setSidebarOpen(false);
  }

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
          
          /* Dikecilkan proporsional khusus mobile */
          .hero-banner-container {
            padding: 0.85rem !important;
            border-radius: 10px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.4rem !important;
          }
          .hero-banner-container span {
            font-size: 0.55rem !important;
            padding: 0.15rem 0.4rem !important;
            margin-bottom: 0.2rem !important;
          }
          .hero-banner-container div:nth-of-type(1) {
            font-size: 1.05rem !important;
            line-height: 1.15 !important;
          }
          .hero-banner-container div:nth-of-type(2) {
            font-size: 0.68rem !important;
            margin-top: 0.1rem !important;
            line-height: 1.2 !important;
          }
          .hero-banner-container button {
            padding: 0.4rem 0.75rem !important;
            font-size: 0.68rem !important;
            border-radius: 5px !important;
            width: 100% !important;
            justify-content: center !important;
            margin-top: 0.2rem !important;
          }

          /* FORCE GRID KARTU METRIK 3 KOLOM MENYAMPING DI HP */
          .at-stats-grid { 
            grid-template-columns: repeat(3, 1fr) !important; 
            gap: 0.25rem !important; 
            margin-bottom: 1rem !important;
          }
          .at-stats-grid > div {
            padding: 0.4rem 0.3rem !important;
            border-radius: 6px !important;
          }
          .at-stats-grid > div > div:first-child {
            font-size: 0.52rem !important;
            line-height: 1.1 !important;
            margin-bottom: 0.25rem !important;
          }
          .at-stats-grid > div > div:nth-child(2) {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .at-stats-grid > div > div:last-child {
            font-size: 0.5rem !important;
            line-height: 1.1 !important;
            margin-top: 0.1rem !important;
          }
          
          .at-panels-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .at-user-name { display: none; }
        }
      `}} />

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 40 }} />}

      <aside className={`at-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#F59E0B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" /></svg>
            </div>
            <div><div style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Admin Toko / UMKM</div></div>
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
                const badge = item.key === "marketplace" && pesananMenunggu > 0 ? pesananMenunggu : item.key === "restock" && restockMendesak > 0 ? restockMendesak : 0;
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: active ? "#F59E0B" : "transparent", color: active ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "1px", fontWeight: active ? 700 : 500 }}
                  >
                    <Icon /> <span style={{ flex: 1 }}>{item.label}</span>
                    {badge > 0 && <span style={{ background: active ? "rgba(255,255,255,.3)" : "#EF4444", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "999px" }}>{badge}</span>}
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
            <div style={{ position: "relative" }}>
              <div onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative", width: "32px", height: "32px", borderRadius: "50%", background: notifOpen ? "#FFFBEB" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <IconBell />
                {所有Notif.length > 0 && <span style={{ position: "absolute", top: "6px", right: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />}
              </div>
              {notifOpen && (
                <>
                  <div onClick={() => setNotifOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 55 }} />
                  <div style={{ position: "absolute", top: "42px", right: 0, width: "320px", background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", boxShadow: "0 12px 32px rgba(15,23,42,.14)", zIndex: 60, maxHeight: "380px", overflowY: "auto" }}>
                    <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #F1F5F9", fontWeight: 700, fontSize: "0.85rem", color: "#1E293B" }}>Notifikasi</div>
                    {所有Notif.length === 0 ? (
                      <div style={{ padding: "1.25rem 1rem", fontSize: "0.8rem", color: "#94A3B8", textAlign: "center" }}>Tidak ada notifikasi baru.</div>
                    ) : (
                      所有Notif.map((n) => (
                        <div key={n.id} onClick={() => { selectMenu(n.tujuan); setNotifOpen(false); }} style={{ padding: "0.7rem 1rem", borderBottom: "1px solid #F1F5F9", cursor: "pointer" }}>
                          <div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{n.text}</div>
                          <div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>{n.sub}</div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}
            </div>
            <div onClick={() => setProfilPopupOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#F59E0B", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {profilToko.fotoUrl ? <img src={profilToko.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profilToko.inisial}
              </div>
              <div className="at-user-name">
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B" }}>{profilToko.namaPemilik}</div>
                <div style={{ fontSize: "10.5px", color: "#94A3B8" }}>PasarNusa Admin Toko</div>
              </div>
              <span className="at-user-name" style={{ color: "#94A3B8" }}><IconChevronDown /></span>
            </div>
          </div>
        </div>

        {profilPopupOpen && (
          <div onClick={() => setProfilPopupOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4.5rem 1rem 1rem", overflowY: "auto" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px", width: "100%" }}>
              <ProfilTokoPage profil={profilToko} setProfil={setProfilToko} />
            </div>
          </div>
        )}

        {activeMenu === "dashboard" && (
          <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
            <div className="hero-banner-container" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconSparkle /> Platform UMKM #1 Indonesia</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {profilToko.namaPemilik.split(" ")[0]}!</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.9)", marginTop: "0.3rem", maxWidth: "440px" }}>Pantau arus kas, analisis prediktif restock komoditas, dan kelola rantai pasok dari hulu ke hilir.</div>
              </div>
              <button onClick={() => selectMenu("laporan")} style={{ background: "#fff", color: "#D97706", border: "none", padding: "0.65rem 1.1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                Lihat Buku Kas <IconArrowRight />
              </button>
            </div>

            <div className="at-stats-grid" style={{ marginBottom: "1.25rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>OMSET PENJUALAN</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalOmset)}</div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }}>{penjualanList.length} transaksi</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("etalase")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PRODUK LIVE</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{produkLive}</div>
                <div style={{ fontSize: "0.68rem", color: "#F59E0B", marginTop: "0.15rem" }}>Lihat etalase →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("marketplace")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PESANAN MENUNGGU</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{pesananMenunggu}</div>
                <div style={{ fontSize: "0.68rem", color: "#D97706", marginTop: "0.15rem" }}>Perlu diproses</div>
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
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Belum ada produsen yang mendekati waktu panen.</p>
                ) : (
                  produsenList.filter((p) => p.estimasiPanenHari <= 7).sort((a, b) => a.estimasiPanenHari - b.estimasiPanenHari).map((p) => (
                    <div key={p.id} style={{ background: "#FFFBEB", borderRadius: "8px", padding: "0.6rem 0.7rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{p.nama}</div><div style={{ fontSize: "0.68rem", color: "#B45309" }}>{p.komoditas} • Prediksi panen {p.estimasiPanenHari} hari lagi</div></div>
                      <button onClick={() => selectMenu("marketplace")} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.68rem", fontWeight: 600, padding: "0.4rem 0.7rem", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>Pesan Sekarang</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.2rem" }}>Penjualan terbaru</div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Transaksi ke pembeli kota</div>
                {penjualanList.slice(0, 3).map((s, i) => (
                  <div key={s.id} style={{ padding: "0.5rem 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1E293B" }}>{s.pembeli}</span>
                      <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#10B981" }}>{formatRupiah(s.total)}</span>
                    </div>
                    <div style={{ fontSize: "0.7rem", color: "#64748B" }}>{s.produk} × {s.jumlah}</div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {activeMenu === "marketplace" && <MarketplaceProdusen produsenList={produsenList} belanjaProdusen={belanjaProdusen} pembelianList={pembelianList} />}
        {activeMenu === "inventaris" && <InventarisGrading stokList={stokList} pembelianList={pembelianList} produsenList={produsenList} terimaPembelian={terimaPembelian} updateStok={updateStok} />}
        {activeMenu === "restock" && <SmartRestock produsenList={produsenList} stokList={stokList} updateStok={updateStok} onPesan={() => selectMenu("marketplace")} />}
        {activeMenu === "etalase" && <EtalasePenjualan stokList={stokList} updateStok={updateStok} />}
        {activeMenu === "laporan" && <LaporanBukuKas pembelianList={pembelianList} penjualanList={penjualanList} />}
      </div>
    </div>
  );
}