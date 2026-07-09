"use client";

import { useState } from "react";
import Link from "next/link";

// 1. IMPORT SEMUA KOMPONEN DARI FOLDER COMPONENTS
import DataUMKM from "./components/dataUMKM";
import VerifikasiAkun from "./components/verivikasiAkun";
import SuspendAkun from "./components/suspandAkun";
import KategoriUsaha from "./components/manajemen-kategori"; // Memakai file manajemen-kategori yang berisi Kategori Usaha
import KategoriSupplier from "./components/kategori-supplier";
import KategoriBahanBaku from "./components/kategori-bahan-baku";
import KategoriLimbah from "./components/kategori-limbah";
import SemuaTransaksi from "./components/semua-transaksi";
import SemuaKolaborasi from "./components/semua-kolaborasi";
import StatistikUMKM from "./components/statistik-umkm";
import StatistikLimbah from "./components/statistik-limbah";
import StatistikBahanBaku from "./components/statistik-bahan-baku";
import StatistikSupplier from "./components/statistik-supplier";

const activities = [
  { time: "10:15", user: "UMKM Keripik Tempe", action: "Mengajukan verifikasi profil usaha baru", category: "Verifikasi" },
  { time: "09:42", user: "Supplier Makmur", action: "Menambahkan stok limbah sekam padi sebanyak +2 Ton", category: "Limbah" },
  { time: "08:12", user: "Sistem Transaksi", action: "Kolaborasi sewa alat pencacah sampah plastik berhasil diverifikasi", category: "Penyewaan" },
  { time: "07:30", user: "Admin", action: "Menangguhkan (Suspend) akun 'Toko Curang' karena pelanggaran syarat & ketentuan", category: "Manajemen User" },
];

// Komponen SVG Ikon Mandiri
const IconDashboard = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconLayers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IconActivity = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconFileText = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 22 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconDollar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const IconPackage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="16.5" y1="9.4" x2="7.5" y2="4.21"></line><polygon points="12 22.08 12 12 3 6.92 3 17.08 12 22.08"></polygon><polygon points="12 12 21 6.92 21 17.08 12 22.08"></polygon><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;

export default function AdminPlatformDashboard() {
  // 2. STATE UNTUK MENENTUKAN KONTEN HALAMAN YANG AKTIF
  const [activeMenu, setActiveMenu] = useState("ringkasan");

  // Fungsi pembantu untuk membuat style navigasi aktif/tidak
  const getNavStyle = (menuName: string) => ({
    color: activeMenu === menuName ? "#FFFFFF" : "#94A3B8",
    background: activeMenu === menuName ? "#334155" : "transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.9rem",
    cursor: "pointer"
  });

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      
      {/* Sidebar Admin Platform */}
      <aside style={{ width: "260px", background: "#1E293B", color: "#F8FAFC", padding: "1.5rem 1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", height: "100vh" }}>
        
        {/* Header Sidebar */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingRight: "0.5rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#3B82F6" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Pasar<span style={{ color: "#3B82F6" }}>Nusa</span></span>
        </div>

        {/* AREA MENU YANG BISA DI-SCROLL */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", flex: 1, paddingRight: "0.5rem", paddingBottom: "1rem" }}>
          
          {/* Sistem Utama */}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.5rem" }}>Sistem Utama</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("ringkasan")} style={getNavStyle("ringkasan")}>
                <IconDashboard /> Dashboard Ringkasan
              </span>
            </nav>
          </div>

          {/* Manajemen User */}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.5rem" }}>Manajemen User</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("data-umkm")} style={getNavStyle("data-umkm")}>
                <IconUser /> Data UMKM
              </span>
              <span onClick={() => setActiveMenu("verifikasi-umkm")} style={getNavStyle("verifikasi-umkm")}>
                <IconUser /> Verifikasi UMKM <span style={{ background: "#3B82F6", color: "white", fontSize: "0.65rem", padding: "1px 5px", borderRadius: "10px", marginLeft: "auto" }}>4</span>
              </span>
              <span onClick={() => setActiveMenu("suspend-akun")} style={getNavStyle("suspend-akun")}>
                <IconUser /> Suspend Akun
              </span>
            </nav>
          </div>

          {/* Manajemen Kategori */}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.5rem" }}>Manajemen Kategori</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("kat-usaha")} style={getNavStyle("kat-usaha")}>
                <IconLayers /> Kategori Usaha
              </span>
              <span onClick={() => setActiveMenu("kat-supplier")} style={getNavStyle("kat-supplier")}>
                <IconLayers /> Kategori Produsen & Supplier
              </span>
              <span onClick={() => setActiveMenu("kat-bahan")} style={getNavStyle("kat-bahan")}>
                <IconLayers /> Kategori Bahan Baku
              </span>
              <span onClick={() => setActiveMenu("kat-limbah")} style={getNavStyle("kat-limbah")}>
                <IconLayers /> Kategori Limbah
              </span>
            </nav>
          </div>

          {/* Monitoring */}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.5rem" }}>Monitoring</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("semua-transaksi")} style={getNavStyle("semua-transaksi")}>
                <IconActivity /> Semua Transaksi
              </span>
              <span onClick={() => setActiveMenu("semua-kolaborasi")} style={getNavStyle("semua-kolaborasi")}>
                <IconActivity /> Semua Kolaborasi
              </span>
            </nav>
          </div>

          {/* Laporan */}
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.5rem" }}>Laporan</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("stat-umkm")} style={getNavStyle("stat-umkm")}>
                <IconFileText /> Statistik UMKM
              </span>
              <span onClick={() => setActiveMenu("stat-limbah")} style={getNavStyle("stat-limbah")}>
                <IconFileText /> Statistik Limbah
              </span>
              <span onClick={() => setActiveMenu("stat-bahan")} style={getNavStyle("stat-bahan")}>
                <IconFileText /> Statistik Bahan Baku
              </span>
              <span onClick={() => setActiveMenu("stat-supplier")} style={getNavStyle("stat-supplier")}>
                <IconFileText /> Statistik Produsen & Supplier
              </span>
            </nav>
          </div>
        </div>

        {/* Footer Sidebar */}
        <div style={{ borderTop: "1px solid #334155", paddingTop: "1rem", marginTop: "auto", paddingRight: "0.5rem" }}>
          <Link href="/login" style={{ width: "100%", justifyContent: "center", color: "#F87171", border: "1px solid #475569", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>
            Keluar
          </Link>
        </div>
      </aside>

      {/* AREA UTAMA / KONTEN DINAMIS */}
      <div style={{ flex: 1, height: "100vh", overflow: "hidden" }}>
        
        {/* RENDER KONDISIONAL BERDASARKAN MENU YANG DIKLIK */}
        {activeMenu === "ringkasan" && (
          <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Dashboard Super Admin</h1>
                <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Panel kontrol penuh pengelolaan siklus ekosistem PasarNusa.</p>
              </div>
              <button style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>Unduh Laporan Audit</button>
            </div>

            {/* Stats Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#DBEAFE", color: "#1E40AF", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconUser /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>2.410</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total UMKM</div></div>
              </div>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#D1FAE5", color: "#065F46", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconDollar /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>18.4K</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Transaksi</div></div>
              </div>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconPackage /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>842</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Penyewaan Alat</div></div>
              </div>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#FEF3C7", color: "#92400E", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconActivity /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>1.205</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Kolaborasi</div></div>
              </div>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#E0F2FE", color: "#075985", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconTruck /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>45.2 T</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Limbah Terjual</div></div>
              </div>
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem" }}>
                <div style={{ background: "#F3E8FF", color: "#6B21A8", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconUser /></div>
                <div><div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#0F172A" }}>318</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Supplier</div></div>
              </div>
            </div>

            {/* Audit Log Activity */}
            <div style={{ background: "white", padding: "1.5rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
              <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", fontWeight: 600, color: "#0F172A" }}>Aktivitas Log Sistem & Tata Kelola Platform</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                {activities.map((a, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "1rem", border: "1px solid #F1F5F9", borderRadius: "8px", background: "#F8FAFC" }}>
                    <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#64748B", marginRight: "1rem" }}>{a.time}</span>
                    <div style={{ flex: 1 }}><div style={{ fontSize: "0.9rem", color: "#334155" }}><strong>{a.user}</strong> — {a.action}</div></div>
                    <div><span style={{ background: "#E2E8F0", color: "#475569", fontSize: "0.75rem", padding: "0.25rem 0.5rem", borderRadius: "4px" }}>{a.category}</span></div>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}

        {/* 3. MEMANGGIL AREA KOMPONEN YANG SUDAH ANDA BUAT DI FOLDER COMPONENTS */}
        {activeMenu === "data-umkm" && <DataUMKM />}
        {activeMenu === "verifikasi-umkm" && <VerifikasiAkun />}
        {activeMenu === "suspend-akun" && <SuspendAkun />}
        {activeMenu === "kat-usaha" && <KategoriUsaha />}
        {activeMenu === "kat-supplier" && <KategoriSupplier />}
        {activeMenu === "kat-bahan" && <KategoriBahanBaku />}
        {activeMenu === "kat-limbah" && <KategoriLimbah />}
        {activeMenu === "semua-transaksi" && <SemuaTransaksi />}
        {activeMenu === "semua-kolaborasi" && <SemuaKolaborasi />}
        {activeMenu === "stat-umkm" && <StatistikUMKM />}
        {activeMenu === "stat-limbah" && <StatistikLimbah />}
        {activeMenu === "stat-bahan" && <StatistikBahanBaku />}
        {activeMenu === "stat-supplier" && <StatistikSupplier />}

      </div>
    </div>
  );
}