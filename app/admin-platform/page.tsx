"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { ReactElement } from "react";
import Link from "next/link";
import { supabase } from "@/lib/db";

import PetaRantaiPasok from "./components/peta-rantai-pasok";
import EscrowTransaksi from "./components/escrow-transaksi";
import LaporanDampak from "./components/laporan-dampak";
import ProfilAdminPage, { ProfilAdmin } from "./components/profil-admin";
import PengaduanPage from "./components/pengaduan";
import DataUMKM from "./components/data-umkm";
import DataProdusen from "./components/data-produsen";
import DataPembeli from "./components/data-pembeli";

export interface Entitas {
  id: string;
  nama: string;
  pemilik: string;
  tipe: "Toko" | "Produsen";
  lokasi: string;
  status: "Aktif" | "Nonaktif";
}

export interface EscrowTx {
  id: string;
  pembeli: string;
  toko: string;
  produsen: string;
  nominal: number;
  persenToko: number;
  persenProdusen: number;
  status: "Ditahan" | "Tersalur" | "Disengketakan";
  tanggal: string;
}

export interface Komoditas {
  nama: string;
  hargaPlatform: number;
  hargaTengkulak: number;
  volumeTon: number;
}

const initialEntitas: Entitas[] = [
  { id: "ENT-01", nama: "Warung Makmur Jaya", pemilik: "Made Aditya", tipe: "Toko", lokasi: "Malang, Jawa Timur", status: "Aktif" },
  { id: "ENT-02", nama: "Toko Sembako Berkah", pemilik: "Siti Rahma", tipe: "Toko", lokasi: "Jombang, Jawa Timur", status: "Aktif" },
  { id: "ENT-03", nama: "Keripik Tempe Sanan", pemilik: "Budi Santoso", tipe: "Produsen", lokasi: "Malang, Jawa Timur", status: "Aktif" },
  { id: "ENT-04", nama: "Kopi Arabika Gayo", pemilik: "Rina Kartika", tipe: "Produsen", lokasi: "Surabaya, Jawa Timur", status: "Aktif" },
];

const initialTransaksi: EscrowTx[] = [
  { id: "TX-90211", pembeli: "Minimarket Sejahtera", toko: "Warung Makmur Jaya", produsen: "Keripik Tempe Sanan", nominal: 1575000, persenToko: 70, persenProdusen: 30, status: "Tersalur", tanggal: "05 Jul 2026" },
  { id: "TX-90212", pembeli: "Koperasi Pasar Besar", toko: "Toko Sembako Berkah", produsen: "Kopi Arabika Gayo", nominal: 900000, persenToko: 65, persenProdusen: 35, status: "Ditahan", tanggal: "08 Jul 2026" },
  { id: "TX-90213", pembeli: "Warung Bu Ida", toko: "Warung Makmur Jaya", produsen: "Keripik Tempe Sanan", nominal: 1500000, persenToko: 70, persenProdusen: 30, status: "Ditahan", tanggal: "09 Jul 2026" },
];

const initialKomoditas: Komoditas[] = [
  { nama: "Keripik Tempe", hargaPlatform: 45000, hargaTengkulak: 32000, volumeTon: 12.4 },
  { nama: "Kopi Arabika", hargaPlatform: 78000, hargaTengkulak: 55000, volumeTon: 8.1 },
  { nama: "Beras Organik", hargaPlatform: 15500, hargaTengkulak: 11000, volumeTon: 24.6 },
];

const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconMap = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6"></polygon></svg>;
const IconShieldLock = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><rect x="9" y="11" width="6" height="5" rx="1"></rect><path d="M10 11V9a2 2 0 0 1 4 0v2"></path></svg>;
const IconReport = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="9" y1="13" x2="15" y2="13"></line><line x1="9" y1="17" x2="15" y2="17"></line></svg>;
const IconFlag = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
const IconMenu = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconBell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconShield = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path></svg>;
const IconArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const IconChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconPackage = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconUsers = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

interface MenuItemDef { key: string; label: string; icon: () => ReactElement }
interface MenuGroupDef { title: string; items: MenuItemDef[] }

const menuGroups: MenuGroupDef[] = [
  { title: "Main", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  { title: "Pengawasan", items: [
    { key: "umkm", label: "Data UMKM", icon: IconStore },
    { key: "produsen", label: "Data Produsen", icon: IconPackage },
    { key: "pembeli", label: "Data Pembeli", icon: IconUsers },
    { key: "peta", label: "Peta Rantai Pasok", icon: IconMap },
    { key: "pengaduan", label: "Pengaduan", icon: IconFlag },
  ] },
  { title: "Transaksi", items: [{ key: "escrow", label: "Escrow & Transaksi", icon: IconShieldLock }] },
  { title: "Laporan", items: [{ key: "laporan", label: "Laporan Dampak", icon: IconReport }] },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatRupiahRingkas(n: number) {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(1)}M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return formatRupiah(n);
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  umkm: "Data UMKM",
  produsen: "Data Produsen",
  pembeli: "Data Pembeli",
  peta: "Peta Rantai Pasok",
  pengaduan: "Pengaduan",
  escrow: "Escrow & Transaksi",
  laporan: "Laporan Dampak",
};

export default function AdminPlatformDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilPopupOpen, setProfilPopupOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [entitasList] = useState<Entitas[]>(initialEntitas);
  const [transaksiList, setTransaksiList] = useState<EscrowTx[]>(initialTransaksi);
  const [komoditasList] = useState<Komoditas[]>(initialKomoditas);
  
  const [counts, setCounts] = useState({
    toko: 0,
    produsen: 0,
    pengaduanAktif: 0,
  });

  const [profilAdmin, setProfilAdmin] = useState<ProfilAdmin>({
    nama: "Nadia Ramadhani",
    jabatan: "Super Admin",
    email: "nadia@pasarnusa.id",
    telepon: "0813-2345-6789",
    bergabung: "Jan 2026",
    inisial: "NR",
  });

  // METRIK COUNTS LIVE DARI SUPABASE
  const fetchCounts = useCallback(async () => {
    try {
      const { count: countToko } = await supabase.from("admin_toko").select("*", { count: "exact", head: true });
      const { count: countProd } = await supabase.from("produsen").select("*", { count: "exact", head: true });
      const { count: countAduan } = await supabase.from("pengaduan").select("*", { count: "exact", head: true }).neq("status", "Selesai");

      setCounts({
        toko: countToko || 0,
        produsen: countProd || 0,
        pengaduanAktif: countAduan || 0,
      });
    } catch (err) {
      console.error("Gagal muat metrik counts:", err);
    }
  }, []);

  useEffect(() => {
    fetchCounts();
  }, [fetchCounts, activeMenu]);

  function salurkanDana(id: string) {
    setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Tersalur" } : t)));
  }
  function tandaiSengketa(id: string) {
    setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Disengketakan" } : t)));
  }
  function selesaikanSengketa(id: string) {
    setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Tersalur" } : t)));
  }

  const totalGMV = transaksiList.reduce((s, t) => s + t.nominal, 0);

  const indeksHargaAdil = useMemo(() => {
    if (komoditasList.length === 0) return 0;
    const rasio = komoditasList.map((k) => k.hargaTengkulak / k.hargaPlatform);
    const avgRasio = rasio.reduce((s, r) => s + r, 0) / rasio.length;
    return Math.round(avgRasio * 100);
  }, [komoditasList]);

  const daerahProduktif = useMemo(() => {
    const map: Record<string, number> = {};
    entitasList.forEach((e) => { map[e.lokasi] = (map[e.lokasi] || 0) + 1; });
    return Object.entries(map).map(([lokasi, jumlah]) => ({ lokasi, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
  }, [entitasList]);

  function selectMenu(key: string) {
    setActiveMenu(key);
    setSidebarOpen(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .ap-sidebar { width: 220px; }
        .ap-hamburger { display: none; }
        .ap-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .ap-panels-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .ap-user-name { display: block; }
        
        @media (max-width: 900px) {
          .ap-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .ap-sidebar.open { transform: translateX(0); }
          .ap-hamburger { display: flex; }
          
          .admin-banner-hero-container {
            padding: 0.85rem !important;
            border-radius: 10px !important;
            flex-direction: column !important;
            align-items: flex-start !important;
            gap: 0.4rem !important;
          }
          .admin-banner-hero-container span {
            font-size: 0.55rem !important;
            padding: 0.15rem 0.4rem !important;
            margin-bottom: 0.2rem !important;
          }
          .admin-banner-hero-container button {
            padding: 0.4rem 0.75rem !important;
            font-size: 0.68rem !important;
            border-radius: 5px !important;
            width: 100% !important;
            justify-content: center !important;
            margin-top: 0.2rem !important;
          }

          .ap-stats-grid { 
            grid-template-columns: repeat(3, 1fr) !important; 
            gap: 0.25rem !important; 
            margin-bottom: 1rem !important;
          }
          .ap-panels-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .ap-user-name { display: none; }
        }
      `}} />

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 40 }} />}

      <aside className={`ap-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", overflow: "hidden", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/logo.png" alt="Logo PasarNusa" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div><div style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Admin Platform</div></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ap-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", letterSpacing: ".04em", textTransform: "uppercase", padding: "0 8px 6px" }}>{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.key;
                const badge = item.key === "pengaduan" && counts.pengaduanAktif > 0 ? counts.pengaduanAktif : 0;
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: active ? "#1E293B" : "transparent", color: active ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "1px", fontWeight: active ? 600 : 400 }}
                  >
                    <Icon /> <span style={{ flex: 1 }}>{item.label}</span>
                    {badge > 0 && <span style={{ background: active ? "rgba(255,255,255,.25)" : "#EF4444", color: "#fff", fontSize: "10px", fontWeight: 700, padding: "1px 6px", borderRadius: "999px" }}>{badge}</span>}
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
            <button onClick={() => setSidebarOpen(true)} className="ap-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#334155" }} aria-label="Buka menu"><IconMenu /></button>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#1E293B" }}>{pageTitles[activeMenu]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <div onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative", width: "32px", height: "32px", borderRadius: "50%", background: notifOpen ? "#F1F5F9" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <IconBell />
              </div>
            </div>
            <div onClick={() => setProfilPopupOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#1E293B", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {profilAdmin.fotoUrl ? <img src={profilAdmin.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profilAdmin.inisial}
              </div>
              <div className="ap-user-name">
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B" }}>{profilAdmin.nama}</div>
                <div style={{ fontSize: "10.5px", color: "#94A3B8" }}>{profilAdmin.jabatan}</div>
              </div>
              <span className="ap-user-name" style={{ color: "#94A3B8" }}><IconChevronDown /></span>
            </div>
          </div>
        </div>

        {profilPopupOpen && (
          <div onClick={() => setProfilPopupOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", zIndex: 1000, display: "flex", alignItems: "flex-start", justifyContent: "center", padding: "4.5rem 1rem 1rem", overflowY: "auto" }}>
            <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "480px", width: "100%" }}>
              <ProfilAdminPage profil={profilAdmin} setProfil={setProfilAdmin} onClose={() => setProfilPopupOpen(false)} />
            </div>
          </div>
        )}

        {activeMenu === "dashboard" && (
          <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
            <div className="admin-banner-hero-container" style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.1)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconShield /> Super Admin Console</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {profilAdmin.nama.split(" ")[0]}!</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.65)", marginTop: "0.3rem", maxWidth: "460px" }}>Awasi pertumbuhan ekosistem, verifikasi mitra baru, dan pastikan setiap transaksi berjalan adil dan aman.</div>
              </div>
              <button onClick={() => selectMenu("laporan")} style={{ background: "#fff", color: "#1E293B", border: "none", padding: "0.65rem 1.1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                Lihat Laporan Dampak <IconArrowRight />
              </button>
            </div>

            <div className="ap-stats-grid" style={{ marginBottom: "1.25rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("umkm")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>TOTAL ADMIN TOKO</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{counts.toko}</div>
                <div style={{ fontSize: "0.68rem", color: "#2563EB", marginTop: "0.15rem" }}>Lihat data →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("produsen")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>TOTAL PRODUSEN</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{counts.produsen}</div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }}>Lihat data →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("pengaduan")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PENGADUAN AKTIF</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{counts.pengaduanAktif}</div>
                <div style={{ fontSize: "0.68rem", color: counts.pengaduanAktif > 0 ? "#EF4444" : "#64748B", marginTop: "0.15rem" }}>{counts.pengaduanAktif > 0 ? "Perlu ditinjau →" : "Tidak ada aduan"}</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("escrow")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PERPUTARAN DANA</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalGMV)}</div>
                <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.15rem" }}>{transaksiList.length} transaksi</div>
              </div>
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("laporan")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#065F46", letterSpacing: ".03em", marginBottom: "0.4rem" }}>INDEKS HARGA ADIL</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065F46" }}>{indeksHargaAdil} <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>/100</span></div>
                <div style={{ fontSize: "0.68rem", color: "#059669", marginTop: "0.15rem" }}>Lebih adil dari tengkulak</div>
              </div>
            </div>
          </main>
        )}

        {/* SUB HALAMAN TANPA PROPS KARENA KOMPONEN SUDAH FETCH DATA DIRECT SUPABASE */}
        {activeMenu === "umkm" && <DataUMKM />}
        {activeMenu === "produsen" && <DataProdusen />}
        {activeMenu === "pembeli" && <DataPembeli />}
        {activeMenu === "peta" && <PetaRantaiPasok entitasList={entitasList} transaksiList={transaksiList} />}
        {activeMenu === "pengaduan" && <PengaduanPage />}
        {activeMenu === "escrow" && <EscrowTransaksi transaksiList={transaksiList} salurkanDana={salurkanDana} tandaiSengketa={tandaiSengketa} selesaikanSengketa={selesaikanSengketa} />}
        {activeMenu === "laporan" && <LaporanDampak komoditasList={komoditasList} daerahProduktif={daerahProduktif} indeksHargaAdil={indeksHargaAdil} totalGMV={totalGMV} entitasList={entitasList} />}
      </div>
    </div>
  );
}