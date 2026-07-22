"use client";

import { useMemo, useState, useEffect, useCallback, useRef } from "react";
import type { ReactElement, FormEvent, ChangeEvent } from "react";
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
const IconAlertTriangle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconPackage = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconUsers = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>;

interface MenuItemDef { key: string; label: string; icon: () => ReactElement }
interface MenuGroupDef { title: string; items: MenuItemDef[] }

const menuGroups: MenuGroupDef[] = [
  { title: "MAIN", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  { title: "PENGAWASAN", items: [
    { key: "umkm", label: "Data UMKM", icon: IconStore },
    { key: "produsen", label: "Data Produsen", icon: IconPackage },
    { key: "pembeli", label: "Data Pembeli", icon: IconUsers },
    { key: "peta", label: "Peta Rantai Pasok", icon: IconMap },
    { key: "pengaduan", label: "Pengaduan", icon: IconFlag },
  ] },
  { title: "TRANSAKSI", items: [{ key: "escrow", label: "Escrow & Transaksi", icon: IconShieldLock }] },
  { title: "LAPORAN", items: [{ key: "laporan", label: "Laporan Dampak", icon: IconReport }] },
];

function formatRupiah(n: number) { return "Rp " + n.toLocaleString("id-ID"); }

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard", umkm: "Data UMKM", produsen: "Data Produsen", pembeli: "Data Pembeli",
  peta: "Peta Rantai Pasok", pengaduan: "Pengaduan", escrow: "Escrow & Transaksi", laporan: "Laporan Dampak",
};

export default function AdminPlatformDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profilPopupOpen, setProfilPopupOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  // STATE GATEKEEPER / VERIFIKASI DATA ADMIN
  const [perluLengkapiData, setPerluLengkapiData] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [submittingData, setSubmittingData] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);

  const [formLengkapi, setFormLengkapi] = useState({
    namaLengkap: "",
    jabatan: "Super Admin" as ProfilAdmin["jabatan"],
  });

  const [entitasList] = useState<Entitas[]>(initialEntitas);
  const [transaksiList, setTransaksiList] = useState<EscrowTx[]>(initialTransaksi);
  const [komoditasList] = useState<Komoditas[]>(initialKomoditas);
  
  const [counts, setCounts] = useState({ toko: 0, produsen: 0, pengaduanAktif: 0 });

  const [profilAdmin, setProfilAdmin] = useState<ProfilAdmin>({
    nama: "Admin Platform",
    jabatan: "Super Admin",
    email: "admin@pasarnusa.id",
    telepon: "-",
    bergabung: "2026",
    inisial: "AP",
  });

  // CEK KELENGKAPAN DATA ADMIN PLATFORM
  const cekKelengkapanAdmin = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);

      const { data: adminData } = await supabase
        .from("admin_platform")
        .select("id, profile_id, nama_lengkap, jabatan, no_hp, foto, created_at")
        .eq("profile_id", user.id)
        .maybeSingle();

      const { data: profileData } = await supabase
        .from("profiles")
        .select("phone, email")
        .eq("id", user.id)
        .maybeSingle();

      if (!adminData || !adminData.nama_lengkap) {
        setPerluLengkapiData(true);
        if (adminData?.nama_lengkap) {
          setFormLengkapi({
            namaLengkap: adminData.nama_lengkap || "",
            jabatan: (adminData.jabatan as ProfilAdmin["jabatan"]) || "Super Admin",
          });
        }
        if (adminData?.foto) setFotoPreview(adminData.foto);
      } else {
        setPerluLengkapiData(false);
        const inisial = adminData.nama_lengkap.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "AP";
        setProfilAdmin({
          id: adminData.id,
          profile_id: user.id,
          nama: adminData.nama_lengkap,
          jabatan: adminData.jabatan || "Super Admin",
          email: user.email || "",
          telepon: adminData.no_hp || profileData?.phone || "-",
          bergabung: new Date(adminData.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" }),
          inisial,
          fotoUrl: adminData.foto,
        });
      }
    } catch (err) {
      console.error("Gagal memeriksa profil admin:", err);
    }
  }, []);

  const fetchCounts = useCallback(async () => {
    try {
      const { count: countToko } = await supabase.from("admin_toko").select("*", { count: "exact", head: true });
      const { count: countProd } = await supabase.from("produsen").select("*", { count: "exact", head: true });
      const { count: countAduan } = await supabase.from("pengaduan").select("*", { count: "exact", head: true }).neq("status", "Selesai");

      setCounts({ toko: countToko || 0, produsen: countProd || 0, pengaduanAktif: countAduan || 0 });
    } catch (err) {
      console.error("Gagal muat metrik counts:", err);
    }
  }, []);

  useEffect(() => {
    cekKelengkapanAdmin();
    fetchCounts();
  }, [cekKelengkapanAdmin, fetchCounts, activeMenu]);

  function handleFotoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoPreview(reader.result as string);
    reader.readAsDataURL(file);
  }

// SIMPAN DATA ADMIN (ANTI-CRASH & ERROR HANDLING DETAIL)
  const handleSimpanDataAwal = async (e: FormEvent) => {
    e.preventDefault();
    if (!userId || submittingData) return;

    setSubmittingData(true);
    try {
      // 1. Ambil data profil user saat ini
      const { data: profileData } = await supabase
        .from("profiles")
        .select("phone")
        .eq("id", userId)
        .maybeSingle();

      const noHpOtomatis = profileData?.phone || "-";

      // 2. Simpan/Upsert ke admin_platform
      const { error: errAdmin } = await supabase
        .from("admin_platform")
        .upsert(
          {
            profile_id: userId,
            nama_lengkap: formLengkapi.namaLengkap,
            jabatan: formLengkapi.jabatan,
            no_hp: noHpOtomatis,
            foto: fotoPreview || null,
            status: "aktif",
          },
          { onConflict: "profile_id" }
        );

      if (errAdmin) {
        console.error("Error admin_platform:", errAdmin);
        alert(`Gagal menyimpan ke admin_platform: ${errAdmin.message}`);
        setSubmittingData(false);
        return;
      }

      // 3. Update nama di tabel profiles
      const { error: errProfile } = await supabase
        .from("profiles")
        .update({ nama: formLengkapi.namaLengkap })
        .eq("id", userId);

      if (errProfile) {
        console.error("Error profiles update:", errProfile);
      }

      // Berhasil
      setPerluLengkapiData(false);
      await cekKelengkapanAdmin();
    } catch (err: any) {
      console.error("Gagal menyimpan data:", err);
      alert(`Gagal menyimpan data: ${err?.message || JSON.stringify(err)}`);
    } finally {
      setSubmittingData(false);
    }
  };

  function salurkanDana(id: string) { setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Tersalur" } : t))); }
  function tandaiSengketa(id: string) { setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Disengketakan" } : t))); }
  function selesaikanSengketa(id: string) { setTransaksiList((prev) => prev.map((t) => (t.id === id ? { ...t, status: "Tersalur" } : t))); }

  const totalGMV = transaksiList.reduce((s, t) => s + t.nominal, 0);

  const indeksHargaAdil = useMemo(() => {
    if (komoditasList.length === 0) return 0;
    const rasio = komoditasList.map((k) => k.hargaTengkulak / k.hargaPlatform);
    return Math.round((rasio.reduce((s, r) => s + r, 0) / rasio.length) * 100);
  }, [komoditasList]);

  const daerahProduktif = useMemo(() => {
    const map: Record<string, number> = {};
    entitasList.forEach((e) => { map[e.lokasi] = (map[e.lokasi] || 0) + 1; });
    return Object.entries(map).map(([lokasi, jumlah]) => ({ lokasi, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
  }, [entitasList]);

  function selectMenu(key: string) {
    if (perluLengkapiData && key !== "dashboard") {
      alert("Harap lengkapi profil pengelola terlebih dahulu!");
      return;
    }
    setActiveMenu(key);
    setSidebarOpen(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F1F5F9", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .ap-sidebar { width: 220px; }
        .ap-hamburger { display: none; }
        .ap-stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 1rem; }
        
        @media (max-width: 900px) {
          .ap-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .ap-sidebar.open { transform: translateX(0); }
          .ap-hamburger { display: flex; }
          .ap-stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
        }
      `}} />

      {/* ============================================================ */}
      {/* POPUP MODAL LENGKAPI PROFIL ADMIN (TANPA INPUT NO HP) */}
      {/* ============================================================ */}
      {perluLengkapiData && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15, 23, 42, 0.35)", backdropFilter: "blur(1.5px)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "1.75rem", width: "460px", maxWidth: "100%", boxShadow: "0 25px 50px -12px rgba(15,23,42,0.25)", boxSizing: "border-box" }}>
            
            <h2 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#1E293B", margin: "0 0 1rem 0" }}>Lengkapi Profil Admin Anda</h2>
            
            {/* ALERT BOX KUNING DI DALAM MODAL */}
            <div style={{ background: "#FEF3C7", border: "1px solid #FCD34D", borderRadius: "8px", padding: "0.85rem 1rem", fontSize: "0.82rem", color: "#92400E", fontWeight: 600, marginBottom: "1.25rem", lineHeight: 1.4 }}>
              Isi data pengelola di bawah ini agar seluruh fitur pengawasan platform aktif.
            </div>

            <form onSubmit={handleSimpanDataAwal} style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              
              {/* UPLOAD FOTO AREA */}
              <div>
                <label style={{ display: "block", fontSize: "0.68rem", fontWeight: 700, color: "#64748B", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "0.4rem" }}>
                  UPLOAD FOTO PROFIL / AVATAR
                </label>
                <div 
                  onClick={() => fileInputRef.current?.click()} 
                  style={{ border: "2px dashed #CBD5E1", background: "#F8FAFC", borderRadius: "10px", padding: "1.25rem", textAlign: "center", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "80px" }}
                >
                  {fotoPreview ? (
                    <img src={fotoPreview} alt="Preview" style={{ width: "60px", height: "60px", borderRadius: "50%", objectFit: "cover", border: "2px solid #1E293B" }} />
                  ) : (
                    <span style={{ fontSize: "0.85rem", color: "#475569", fontWeight: 600 }}>Pilih foto profil pengelola</span>
                  )}
                  <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoSelect} style={{ display: "none" }} />
                </div>
              </div>

              {/* INPUT NAMA LENGKAP */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.35rem" }}>Nama Lengkap *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="Contoh: Nadia Ramadhani" 
                  value={formLengkapi.namaLengkap} 
                  onChange={(e) => setFormLengkapi({...formLengkapi, namaLengkap: e.target.value})} 
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", boxSizing: "border-box", color: "#1E293B" }} 
                />
              </div>

              {/* INPUT JABATAN (FULL WIDTH - TANPA NO HP) */}
              <div>
                <label style={{ display: "block", fontSize: "0.82rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.35rem" }}>Jabatan Admin *</label>
                <select 
                  value={formLengkapi.jabatan} 
                  onChange={(e) => setFormLengkapi({...formLengkapi, jabatan: e.target.value as ProfilAdmin["jabatan"]})} 
                  style={{ width: "100%", padding: "0.65rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", background: "white", color: "#1E293B", boxSizing: "border-box" }}
                >
                  <option value="Super Admin">Super Admin</option>
                  <option value="Admin Operasional">Admin Operasional</option>
                  <option value="Admin Teknis">Admin Teknis</option>
                </select>
              </div>

              {/* TOMBOL SIMPAN SLATE ABU-ABU GELAP */}
              <button 
                type="submit" 
                disabled={submittingData} 
                style={{ marginTop: "0.5rem", width: "100%", padding: "0.75rem", borderRadius: "8px", border: "none", background: "#1E293B", color: "white", fontWeight: 800, fontSize: "0.92rem", cursor: "pointer", opacity: submittingData ? 0.7 : 1, transition: "background 0.2s" }}
              >
                {submittingData ? "Menyimpan Data..." : "Simpan Data Pengelola"}
              </button>

            </form>
          </div>
        </div>
      )}

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 40 }} />}

      {/* SIDEBAR */}
      <aside className={`ap-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "99px", overflow: "hidden", background: "#1E293B", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <img src="/logo.png" alt="Logo" style={{ width: "100%", height: "100%", objectFit: "contain" }} />
            </div>
            <div><div style={{ fontWeight: 800, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Admin Platform Dashboard</div></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="ap-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
        </div>

        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: "16px" }}>
              <div style={{ fontSize: "10px", fontWeight: 800, color: "#94A3B8", letterSpacing: ".05em", padding: "0 8px 6px" }}>{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.key;
                const badge = item.key === "pengaduan" && counts.pengaduanAktif > 0 ? counts.pengaduanAktif : 0;
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", background: active ? "#1E293B" : "transparent", color: active ? "#fff" : "#475569", fontSize: "13px", cursor: "pointer", marginBottom: "2px", fontWeight: active ? 700 : 500 }}
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
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "8px", background: "#FEE2E2", color: "#EF4444", textDecoration: "none", fontSize: "13px", fontWeight: 700 }}>Keluar</Link>
        </div>
      </aside>

      {/* LAYOUT KONTEN UTAMA */}
      <div style={{ flex: 1, height: "100vh", overflowY: "auto", minWidth: 0 }}>
        
        {/* HEADER TOPBAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px clamp(1rem, 4vw, 1.75rem)", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setSidebarOpen(true)} className="ap-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#334155" }} aria-label="Buka menu"><IconMenu /></button>
            <div style={{ fontSize: "20px", fontWeight: 800, color: "#1E293B" }}>{pageTitles[activeMenu]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative" }}>
              <div onClick={() => setNotifOpen((v) => !v)} style={{ position: "relative", width: "34px", height: "34px", borderRadius: "50%", background: notifOpen ? "#F1F5F9" : "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <IconBell />
              </div>
            </div>
            <div onClick={() => setProfilPopupOpen(true)} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#1E293B", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                {profilAdmin.fotoUrl ? <img src={profilAdmin.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profilAdmin.inisial}
              </div>
              <div className="ap-user-name">
                <div style={{ fontSize: "13px", fontWeight: 700, color: "#1E293B" }}>{profilAdmin.nama}</div>
                <div style={{ fontSize: "11px", color: "#94A3B8" }}>{profilAdmin.jabatan}</div>
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

        {/* ISI DASHBOARD UTAMA */}
        {activeMenu === "dashboard" && (
          <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
            
            {/* 1. ALERT BANNER MERAH DI ATAS HERO */}
            {perluLengkapiData && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FECDD3", borderRadius: "10px", padding: "0.9rem 1.25rem", color: "#991B1B", fontSize: "0.83rem", fontWeight: 600, marginBottom: "1.25rem", display: "flex", alignItems: "flex-start", gap: "0.6rem", lineHeight: 1.5 }}>
                <span style={{ color: "#EF4444", flexShrink: 0, marginTop: "2px" }}><IconAlertTriangle /></span>
                <span>
                  <strong>Akun Admin Platform Anda mendeteksi data pengelola belum terdaftar lengkap.</strong> Silakan klik tombol profil di pojok kanan atas atau tombol lengkapi di bawah untuk mengisi data diri agar seluruh fitur pengawasan dapat diaktifkan kembali.
                </span>
              </div>
            )}

            {/* 2. BANNER HERO DARK SLATE */}
            <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", borderRadius: "14px", padding: "1.75rem 2rem", marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", color: "#fff" }}>
              <div style={{ maxWidth: "600px" }}>
                <span style={{ display: "inline-block", background: "rgba(255,255,255,0.12)", color: "#E2E8F0", fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "999px", marginBottom: "0.75rem" }}>
                  Platform UMKM #1 Indonesia
                </span>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, margin: "0 0 0.4rem 0", lineHeight: 1.2 }}>
                  Selamat Datang, {profilAdmin.nama.split(" ")[0]}!
                </h1>
                <p style={{ fontSize: "0.9rem", color: "#94A3B8", margin: 0, lineHeight: 1.5 }}>
                  Pantau pertumbuhan ekosistem, analisis data rantai pasok dari hulu ke hilir, serta jaga transparansi transaksi mitra UMKM.
                </p>
              </div>

              {perluLengkapiData && (
                <button 
                  onClick={() => setPerluLengkapiData(true)} 
                  style={{ background: "rgba(255,255,255,0.15)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", padding: "0.75rem 1.25rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.88rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "8px" }}
                >
                  Lengkapi Profil Sekarang →
                </button>
              )}
            </div>

            {/* 3. GRID METRIK & STATISTIK */}
            <div className="ap-stats-grid" style={{ marginBottom: "1.5rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("umkm")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", letterSpacing: ".04em", marginBottom: "0.4rem" }}>TOTAL ADMIN TOKO</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{counts.toko}</div>
                <div style={{ fontSize: "0.75rem", color: "#2563EB", marginTop: "0.2rem", fontWeight: 600 }}>Lihat data →</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("produsen")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", letterSpacing: ".04em", marginBottom: "0.4rem" }}>TOTAL PRODUSEN</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{counts.produsen}</div>
                <div style={{ fontSize: "0.75rem", color: "#10B981", marginTop: "0.2rem", fontWeight: 600 }}>Lihat data →</div>
              </div>

              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("pengaduan")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#94A3B8", letterSpacing: ".04em", marginBottom: "0.4rem" }}>PENGADUAN AKTIF</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: counts.pengaduanAktif > 0 ? "#EF4444" : "#1E293B" }}>{counts.pengaduanAktif}</div>
                <div style={{ fontSize: "0.75rem", color: counts.pengaduanAktif > 0 ? "#EF4444" : "#64748B", marginTop: "0.2rem", fontWeight: 600 }}>{counts.pengaduanAktif > 0 ? "Perlu ditinjau →" : "Tidak ada aduan"}</div>
              </div>

              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }} onClick={() => selectMenu("laporan")}>
                <div style={{ fontSize: "0.68rem", fontWeight: 800, color: "#065F46", letterSpacing: ".04em", marginBottom: "0.4rem" }}>INDEKS HARGA ADIL</div>
                <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#065F46" }}>{indeksHargaAdil} <span style={{ fontSize: "0.75rem", fontWeight: 400 }}>/100</span></div>
                <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.2rem", fontWeight: 600 }}>Lebih adil dari tengkulak</div>
              </div>
            </div>

          </main>
        )}

        {/* SUB HALAMAN */}
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