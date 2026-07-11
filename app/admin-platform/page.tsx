"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

// 1. IMPORT SEMUA KOMPONEN DARI FOLDER COMPONENTS
import DataUMKM from "./components/dataUMKM";
import VerifikasiAkun from "./components/verivikasiAkun";
import SuspendAkun from "./components/suspandAkun";
import KategoriUsaha from "./components/manajemen-kategori";
import KategoriSupplier from "./components/kategori-supplier";
import KategoriBahanBaku from "./components/kategori-bahan-baku";
import KategoriLimbah from "./components/kategori-limbah";
import SemuaTransaksi from "./components/semua-transaksi";
import SemuaKolaborasi from "./components/semua-kolaborasi";
import StatistikUMKM from "./components/statistik-umkm";
import StatistikLimbah from "./components/statistik-limbah";
import StatistikBahanBaku from "./components/statistik-bahan-baku";
import StatistikSupplier from "./components/statistik-supplier";

// ============================================================================
// TIPE DATA — dipakai bersama, ditulis manual di sini (tanpa file lib terpisah)
// ============================================================================
export type UmkmStatus = "Aktif" | "Pending" | "Suspended" | "Ditolak";

export interface UmkmEntry {
  id: string;
  nama: string;
  pemilik: string;
  kategori: string;
  wilayah: string;
  status: UmkmStatus;
  tanggal: string;
  dokumen?: string;
}

export interface PelanggaranEntry {
  id: string;
  nama: string;
  jenis: string;
  pelanggaran: string;
  status: string;
  tanggal: string;
}

const todayLabel = () => new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

function bulanFromTanggal(tanggal: string) {
  const parts = tanggal.split(" ");
  return parts.length >= 2 ? parts[1] : tanggal;
}

// ============================================================================
// DATA DUMMY AWAL
// ============================================================================
const initialUmkm: UmkmEntry[] = [
  { id: "UMKM-001", nama: "Keripik Tempe Sanan", pemilik: "Pak Baihaqi", kategori: "Makanan & Minuman", wilayah: "Malang", status: "Aktif", tanggal: "12 Feb 2026" },
  { id: "UMKM-002", nama: "Kopi Arabika Gayo", pemilik: "Ibu Citra", kategori: "Pertanian / Komoditas", wilayah: "Aceh", status: "Pending", tanggal: "05 Jul 2026", dokumen: "NIB & Sertifikat Halal" },
  { id: "UMKM-003", nama: "Kerajinan Bambu Jaya", pemilik: "Dedi Kurniawan", kategori: "Kerajinan Kriya", wilayah: "Yogyakarta", status: "Aktif", tanggal: "20 Jan 2025" },
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", pemilik: "Rian", kategori: "Bahan Pokok", wilayah: "Jakarta", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "UMKM-005", nama: "Tenun Ikat Sasak", pemilik: "Ibu Nur", kategori: "Fashion & Tekstil", wilayah: "Lombok", status: "Aktif", tanggal: "09 Mei 2026" },
  { id: "UMKM-006", nama: "Sambal Bu Rudy", pemilik: "Ibu Rudy", kategori: "Makanan & Minuman", wilayah: "Surabaya", status: "Aktif", tanggal: "02 Jun 2026" },
  { id: "UMKM-007", nama: "Madu Hutan Sumbawa", pemilik: "Pak Ahmad", kategori: "Pertanian / Komoditas", wilayah: "NTB", status: "Pending", tanggal: "07 Jul 2026", dokumen: "P-IRT & KTP Pemilik" },
  { id: "UMKM-008", nama: "Batik Pekalongan Asli", pemilik: "Ibu Sari", kategori: "Fashion & Tekstil", wilayah: "Pekalongan", status: "Aktif", tanggal: "18 Apr 2026" },
  { id: "UMKM-009", nama: "Anyaman Rotan Kalimantan", pemilik: "Pak Junaidi", kategori: "Kerajinan Kriya", wilayah: "Kalimantan", status: "Aktif", tanggal: "25 Mei 2026" },
  { id: "UMKM-010", nama: "Beras Organik Cianjur", pemilik: "Pak Dadan", kategori: "Bahan Pokok", wilayah: "Cianjur", status: "Pending", tanggal: "08 Jul 2026", dokumen: "NIB & Surat Domisili" },
];

const initialPelanggaran: PelanggaranEntry[] = [
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", jenis: "UMKM", pelanggaran: "Manipulasi Stok & Harga Subsidi", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "SUP-012", nama: "Supplier Pupuk Palsu", jenis: "Supplier", pelanggaran: "Aduan Kualitas Tidak Sesuai Deskripsi", status: "Review Internal", tanggal: "02 Jul 2026" },
];

const activities = [
  { tanggal: "10 Jul 2026, 10:15", umkm: "UMKM Keripik Tempe", keterangan: "Mengajukan verifikasi profil usaha baru", status: "Verifikasi", warna: "#2563EB" },
  { tanggal: "10 Jul 2026, 09:42", umkm: "Supplier Makmur", keterangan: "Menambahkan stok limbah sekam padi sebanyak +2 Ton", status: "Limbah", warna: "#10B981" },
  { tanggal: "10 Jul 2026, 08:12", umkm: "Sistem Transaksi", keterangan: "Kolaborasi sewa alat pencacah sampah plastik berhasil diverifikasi", status: "Penyewaan", warna: "#F59E0B" },
  { tanggal: "09 Jul 2026, 07:30", umkm: "Toko Curang (Minyak Kita)", keterangan: "Ditangguhkan (suspend) karena pelanggaran syarat & ketentuan", status: "Manajemen User", warna: "#EF4444" },
  { tanggal: "09 Jul 2026, 16:05", umkm: "Kopi Arabika Gayo", keterangan: "Transaksi penjualan bahan baku senilai Rp 12.500.000 berhasil", status: "Transaksi", warna: "#2563EB" },
];

const admins = [
  { id: 1, nama: "Ringga", peran: "Admin Utama", inisial: "RG", warna: "#2563EB" },
  { id: 2, nama: "Raffy", peran: "Admin Operasional", inisial: "RF", warna: "#10B981" },
  { id: 3, nama: "Rizal", peran: "Admin Teknis", inisial: "RZ", warna: "#F59E0B" },
];

const transaksiMonthly = [
  { bulan: "Feb", untung: 120, rugi: 20 },
  { bulan: "Mar", untung: 95, rugi: 40 },
  { bulan: "Apr", untung: 150, rugi: 15 },
  { bulan: "Mei", untung: 60, rugi: 110 },
  { bulan: "Jun", untung: 180, rugi: 25 },
  { bulan: "Jul", untung: 140, rugi: 30 },
];

const alatDisewa = [
  { nama: "Vacuum Frying Machine", jumlah: 210 },
  { nama: "Mesin Pencacah Plastik", jumlah: 180 },
  { nama: "Cold Storage Portable", jumlah: 150 },
  { nama: "Mesin Pengemas Vakum", jumlah: 130 },
  { nama: "Alat Pengering Surya", jumlah: 172 },
];

const kolaborasiList = [
  { mitra: "Gabungan Kelompok Tani Makmur", bidang: "Suplai Bahan Baku Organik", status: "Aktif" },
  { mitra: "Pabrik Plastik Biodegradable", bidang: "Pengolahan Limbah Kulit Kopi", status: "Aktif" },
  { mitra: "Koperasi Tenun Lombok", bidang: "Kontrak Suplai Pewarna Alami", status: "Berjalan" },
  { mitra: "UMKM Keripik Buah Sejahtera", bidang: "Sharing Alat Vacuum Frying", status: "Selesai" },
];

const limbahList = [
  { jenis: "Ampas Kopi Organik", jumlah: "18.4 Ton" },
  { jenis: "Sekam Padi", jumlah: "12.1 Ton" },
  { jenis: "Kain Perca Katun", jumlah: "8.7 Ton" },
  { jenis: "Kulit Kayu & Serbuk", jumlah: "6.0 Ton" },
];

const supplierMonthly = [
  { bulan: "Feb", jumlah: 260 },
  { bulan: "Mar", jumlah: 275 },
  { bulan: "Apr", jumlah: 290 },
  { bulan: "Mei", jumlah: 300 },
  { bulan: "Jun", jumlah: 308 },
  { bulan: "Jul", jumlah: 318 },
];
const supplierList = [
  { nama: "Pengepul Kedelai Lokal", kategori: "Bahan Baku", wilayah: "Malang" },
  { nama: "Koperasi Petani Cabai Makmur", kategori: "Bahan Baku", wilayah: "Garut" },
  { nama: "Distributor Benang Sutra Nusantara", kategori: "Tekstil", wilayah: "Bandung" },
  { nama: "Pabrik Pupuk Kompos Sejahtera", kategori: "Pertanian", wilayah: "Bogor" },
];

// Komponen SVG Ikon Mandiri
const IconDashboard = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconUser = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconLayers = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IconActivity = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>;
const IconFileText = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 22 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line></svg>;
const IconDollar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="1" x2="12" y2="23"></line><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>;
const IconPackage = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

type StatKey = "umkm" | "transaksi" | "alat" | "kolaborasi" | "limbah" | "supplier";

// Bar chart sederhana tanpa library — cukup pakai div + style
function MiniBarChart({ data, labelKey, valueKey, color = "#2563EB" }: { data: any[]; labelKey: string; valueKey: string; color?: string }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "160px", padding: "0.5rem 0" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>{d[valueKey]}</div>
          <div style={{ width: "100%", maxWidth: "36px", height: `${(d[valueKey] / max) * 100}%`, background: color, borderRadius: "6px 6px 0 0", minHeight: "4px" }} />
          <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.4rem" }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

// Grafik untung/rugi
function ProfitLossChart({ data }: { data: { bulan: string; untung: number; rugi: number }[] }) {
  const maxVal = Math.max(...data.map((d) => Math.max(d.untung, d.rugi)), 1);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", height: "220px", padding: "0.5rem 0" }}>
      {data.map((d, i) => {
        const net = d.untung - d.rugi;
        const isProfit = net >= 0;
        const barHeight = (Math.abs(net) / maxVal) * 90;
        return (
          <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%" }}>
            <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "flex-end", width: "100%" }}>
              {isProfit && <div style={{ width: "100%", maxWidth: "34px", margin: "0 auto", height: `${barHeight}%`, background: "#2563EB", borderRadius: "6px 6px 0 0", minHeight: "4px" }} title={`Untung Rp ${net}jt`} />}
            </div>
            <div style={{ width: "100%", borderTop: "2px solid #CBD5E1" }} />
            <div style={{ flex: 1, width: "100%" }}>
              {!isProfit && <div style={{ width: "100%", maxWidth: "34px", margin: "0 auto", height: `${barHeight}%`, background: "#EF4444", borderRadius: "0 0 6px 6px", minHeight: "4px" }} title={`Rugi Rp ${Math.abs(net)}jt`} />}
            </div>
            <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.4rem" }}>{d.bulan}</div>
          </div>
        );
      })}
    </div>
  );
}

export default function AdminPlatformDashboard() {
  const [activeMenu, setActiveMenu] = useState("ringkasan");
  const [statModal, setStatModal] = useState<StatKey | null>(null);
  const [exportOpen, setExportOpen] = useState(false);
  const [exportView, setExportView] = useState(false);
  const [onDutyId, setOnDutyId] = useState(1);

  // ---- SEMUA DATA UTAMA DIPEGANG DI SINI, DIOPER SEBAGAI PROPS KE HALAMAN LAIN ----
  const [umkmList, setUmkmList] = useState<UmkmEntry[]>(initialUmkm);
  const [pelanggaranList, setPelanggaranList] = useState<PelanggaranEntry[]>(initialPelanggaran);

  function addUmkm(entry: Omit<UmkmEntry, "id" | "tanggal">) {
    setUmkmList((prev) => {
      const nextNumber = prev.length + 1;
      const id = `UMKM-${String(nextNumber).padStart(3, "0")}`;
      return [{ id, tanggal: todayLabel(), ...entry }, ...prev];
    });
  }

  function setUmkmStatus(id: string, status: UmkmStatus) {
    setUmkmList((prev) => prev.map((u) => (u.id === id ? { ...u, status } : u)));
  }

  function addPelanggaran(entry: { nama: string; jenis: string; pelanggaran: string; targetUmkmId?: string }) {
    setPelanggaranList((prev) => {
      const id = entry.targetUmkmId || `VIO-${String(prev.length + 1).padStart(3, "0")}`;
      return [{ id, nama: entry.nama, jenis: entry.jenis, pelanggaran: entry.pelanggaran, status: "Suspended", tanggal: todayLabel() }, ...prev];
    });
    if (entry.targetUmkmId) setUmkmStatus(entry.targetUmkmId, "Suspended");
  }

  function pulihkanPelanggaran(id: string) {
    setPelanggaranList((prev) => prev.map((p) => (p.id === id ? { ...p, status: "Dipulihkan" } : p)));
    setUmkmStatus(id, "Aktif");
  }

  const onDuty = admins.find((a) => a.id === onDutyId)!;

  // ---- Angka & grafik dashboard dihitung langsung dari umkmList ----
  const totalUmkm = umkmList.length;
  const pendingCount = umkmList.filter((u) => u.status === "Pending").length;

  const umkmMonthly = useMemo(() => {
    const map: Record<string, number> = {};
    umkmList.forEach((u) => { const b = bulanFromTanggal(u.tanggal); map[b] = (map[b] || 0) + 1; });
    return Object.entries(map).map(([bulan, jumlah]) => ({ bulan, jumlah }));
  }, [umkmList]);

  const umkmBySektor = useMemo(() => {
    const map: Record<string, number> = {};
    umkmList.forEach((u) => { map[u.kategori] = (map[u.kategori] || 0) + 1; });
    return Object.entries(map).map(([sektor, jumlah]) => ({ sektor, jumlah })).sort((a, b) => b.jumlah - a.jumlah);
  }, [umkmList]);

  const bulanRugi = useMemo(() => transaksiMonthly.filter((t) => t.rugi > t.untung), []);

  const getNavStyle = (menuName: string) => ({
    color: activeMenu === menuName ? "#FFFFFF" : "rgba(255, 255, 255, 0.75)",
    background: activeMenu === menuName ? "rgba(255,255,255,0.18)" : "transparent",
    display: "inline-flex",
    alignItems: "center",
    gap: "0.5rem",
    padding: "0.5rem 0.75rem",
    borderRadius: "6px",
    textDecoration: "none",
    fontSize: "0.9rem",
    cursor: "pointer",
  });

  function exportWord() {
    const rows = activities.map((a) => `<tr><td style="padding:6px;border:1px solid #ddd;">${a.tanggal}</td><td style="padding:6px;border:1px solid #ddd;">${a.umkm}</td><td style="padding:6px;border:1px solid #ddd;">${a.keterangan}</td><td style="padding:6px;border:1px solid #ddd;">${a.status}</td></tr>`).join("");
    const html = `<html><head><meta charset="utf-8"><title>Laporan Audit PasarNusa</title></head><body>
      <h2>Laporan Audit Platform PasarNusa</h2>
      <p>Diunduh oleh: ${onDuty.nama} (${onDuty.peran}) — ${new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
      <h3>Ringkasan</h3>
      <ul>
        <li>Total UMKM: ${totalUmkm}</li>
        <li>Total Transaksi: 18.400</li>
        <li>Penyewaan Alat: 842</li>
        <li>Total Kolaborasi: 1.205</li>
        <li>Limbah Terjual: 45.2 Ton</li>
        <li>Total Supplier: 318</li>
      </ul>
      <h3>Log Aktivitas Terbaru</h3>
      <table style="border-collapse:collapse;width:100%;font-size:12px;">
        <tr style="background:#EFF6FF;"><th style="padding:6px;border:1px solid #ddd;">Tanggal</th><th style="padding:6px;border:1px solid #ddd;">UMKM</th><th style="padding:6px;border:1px solid #ddd;">Keterangan</th><th style="padding:6px;border:1px solid #ddd;">Status</th></tr>
        ${rows}
      </table>
    </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "laporan-audit-pasarnusa.doc";
    link.click();
    URL.revokeObjectURL(url);
    setExportOpen(false);
  }

  function exportPDF() {
    setExportOpen(false);
    setTimeout(() => window.print(), 100);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`@media print { .no-print { display: none !important; } .print-area { overflow: visible !important; height: auto !important; } }`}</style>

      {/* Sidebar Admin Platform */}
      <aside className="no-print" style={{ width: "260px", background: "#2563EB", color: "#F8FAFC", padding: "1.5rem 1rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "1.5rem", paddingRight: "0.5rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#FFFFFF" fillOpacity="0.15" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "#FFFFFF" }}>Pasar<span style={{ color: "#D1FAE5" }}>Nusa</span></span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem", overflowY: "auto", flex: 1, paddingRight: "0.5rem", paddingBottom: "1rem" }}>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Sistem Utama</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("ringkasan")} style={getNavStyle("ringkasan")}><IconDashboard /> Dashboard Ringkasan</span>
            </nav>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Manajemen User</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("data-umkm")} style={getNavStyle("data-umkm")}><IconUser /> Data UMKM</span>
              <span onClick={() => setActiveMenu("verifikasi-umkm")} style={getNavStyle("verifikasi-umkm")}>
                <IconUser /> Verifikasi UMKM
                {pendingCount > 0 && <span style={{ background: "#10B981", color: "white", fontSize: "0.65rem", padding: "1px 5px", borderRadius: "10px", marginLeft: "auto" }}>{pendingCount}</span>}
              </span>
              <span onClick={() => setActiveMenu("suspend-akun")} style={getNavStyle("suspend-akun")}><IconUser /> Suspend Akun</span>
            </nav>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Manajemen Kategori</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("kat-usaha")} style={getNavStyle("kat-usaha")}><IconLayers /> Kategori Usaha</span>
              <span onClick={() => setActiveMenu("kat-supplier")} style={getNavStyle("kat-supplier")}><IconLayers /> Kategori Produsen & Supplier</span>
              <span onClick={() => setActiveMenu("kat-bahan")} style={getNavStyle("kat-bahan")}><IconLayers /> Kategori Bahan Baku</span>
              <span onClick={() => setActiveMenu("kat-limbah")} style={getNavStyle("kat-limbah")}><IconLayers /> Kategori Limbah</span>
            </nav>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Monitoring</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("semua-transaksi")} style={getNavStyle("semua-transaksi")}><IconActivity /> Semua Transaksi</span>
              <span onClick={() => setActiveMenu("semua-kolaborasi")} style={getNavStyle("semua-kolaborasi")}><IconActivity /> Semua Kolaborasi</span>
            </nav>
          </div>
          <div>
            <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", marginBottom: "0.5rem" }}>Laporan</div>
            <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
              <span onClick={() => setActiveMenu("stat-umkm")} style={getNavStyle("stat-umkm")}><IconFileText /> Statistik UMKM</span>
              <span onClick={() => setActiveMenu("stat-limbah")} style={getNavStyle("stat-limbah")}><IconFileText /> Statistik Limbah</span>
              <span onClick={() => setActiveMenu("stat-bahan")} style={getNavStyle("stat-bahan")}><IconFileText /> Statistik Bahan Baku</span>
              <span onClick={() => setActiveMenu("stat-supplier")} style={getNavStyle("stat-supplier")}><IconFileText /> Statistik Produsen & Supplier</span>
            </nav>
          </div>
        </div>

        <div style={{ borderTop: "1px solid rgba(255,255,255,0.2)", paddingTop: "1rem", marginTop: "auto", paddingRight: "0.5rem" }}>
          <Link href="/login" style={{ width: "100%", justifyContent: "center", color: "#FFFFFF", background: "#EF4444", border: "1px solid #EF4444", borderRadius: "6px", display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Keluar</Link>
        </div>
      </aside>

      {/* AREA UTAMA / KONTEN DINAMIS */}
      <div style={{ flex: 1, height: "100vh", overflow: "hidden" }} className="print-area">
        {activeMenu === "ringkasan" && (
          <main style={{ flex: 1, padding: "1.5rem clamp(1rem, 4vw, 2rem)", overflowY: "auto", height: "100vh" }}>

            <div className="no-print" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1rem" }}>
              <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginRight: "0.25rem" }}>Admin Bertugas Hari Ini:</div>
              <div style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
                {admins.map((a) => (
                  <button key={a.id} onClick={() => setOnDutyId(a.id)} style={{ display: "flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 0.75rem 0.4rem 0.4rem", borderRadius: "999px", border: a.id === onDutyId ? `2px solid ${a.warna}` : "1px solid #E2E8F0", background: a.id === onDutyId ? `${a.warna}15` : "white", cursor: "pointer" }}>
                    <div style={{ width: "28px", height: "28px", borderRadius: "50%", background: a.warna, color: "white", fontSize: "0.7rem", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>{a.inisial}</div>
                    <div style={{ textAlign: "left" }}>
                      <div style={{ fontSize: "0.8rem", fontWeight: 700, color: "#1E293B" }}>{a.nama}</div>
                      <div style={{ fontSize: "0.65rem", color: "#64748B" }}>{a.peran}</div>
                    </div>
                    {a.id === onDutyId && <span style={{ fontSize: "0.65rem", fontWeight: 700, color: a.warna, marginLeft: "0.25rem" }}>● Bertugas</span>}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Dashboard Super Admin</h1>
                <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Panel kontrol penuh pengelolaan siklus ekosistem PasarNusa.</p>
              </div>
              <div className="no-print" style={{ position: "relative" }}>
                <button onClick={() => setExportOpen((v) => !v)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
                  Unduh Laporan Audit <IconChevronDown />
                </button>
                {exportOpen && (
                  <div style={{ position: "absolute", right: 0, top: "110%", background: "white", border: "1px solid #E2E8F0", borderRadius: "10px", boxShadow: "0 8px 20px rgba(0,0,0,0.1)", width: "200px", overflow: "hidden", zIndex: 50 }}>
                    <div onClick={() => { setExportView(true); setExportOpen(false); }} style={{ padding: "0.7rem 1rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}>👁️ Lihat Ringkasan</div>
                    <div onClick={exportPDF} style={{ padding: "0.7rem 1rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer", borderBottom: "1px solid #F1F5F9" }}>📄 Unduh PDF</div>
                    <div onClick={exportWord} style={{ padding: "0.7rem 1rem", fontSize: "0.85rem", color: "#334155", cursor: "pointer" }}>📝 Unduh Word</div>
                  </div>
                )}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
              {[
                { key: "umkm" as StatKey, icon: <IconUser />, bg: "#EFF6FF", color: "#2563EB", value: totalUmkm.toLocaleString("id-ID"), label: "Total UMKM" },
                { key: "transaksi" as StatKey, icon: <IconDollar />, bg: "#D1FAE5", color: "#10B981", value: "18.4K", label: "Total Transaksi" },
                { key: "alat" as StatKey, icon: <IconPackage />, bg: "#FEE2E2", color: "#EF4444", value: "842", label: "Penyewaan Alat" },
                { key: "kolaborasi" as StatKey, icon: <IconActivity />, bg: "#FEF3C7", color: "#92400E", value: "1.205", label: "Total Kolaborasi" },
                { key: "limbah" as StatKey, icon: <IconTruck />, bg: "#EFF6FF", color: "#2563EB", value: "45.2 T", label: "Limbah Terjual" },
                { key: "supplier" as StatKey, icon: <IconUser />, bg: "#D1FAE5", color: "#10B981", value: "318", label: "Total Supplier" },
              ].map((s) => (
                <div key={s.key} onClick={() => setStatModal(s.key)} style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "1rem", cursor: "pointer" }}>
                  <div style={{ background: s.bg, color: s.color, padding: "0.5rem", borderRadius: "8px", display: "flex" }}>{s.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>{s.value}</div>
                    <div style={{ fontSize: "0.8rem", color: "#64748B" }}>{s.label}</div>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Detail →</span>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <h3 style={{ margin: 0, padding: "1.25rem 1.25rem 0.75rem", fontSize: "1.1rem", fontWeight: 600, color: "#1E293B" }}>Aktivitas Log Sistem & Tata Kelola Platform</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem", minWidth: "600px" }}>
                  <thead>
                    <tr style={{ background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
                      <th style={{ padding: "0.75rem 1.25rem", color: "#475569", fontWeight: 600 }}>Tanggal</th>
                      <th style={{ padding: "0.75rem 1.25rem", color: "#475569", fontWeight: 600 }}>UMKM / Entitas</th>
                      <th style={{ padding: "0.75rem 1.25rem", color: "#475569", fontWeight: 600 }}>Keterangan</th>
                      <th style={{ padding: "0.75rem 1.25rem", color: "#475569", fontWeight: 600 }}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activities.map((a, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #F1F5F9" }}>
                        <td style={{ padding: "0.85rem 1.25rem", color: "#64748B", whiteSpace: "nowrap" }}>{a.tanggal}</td>
                        <td style={{ padding: "0.85rem 1.25rem", fontWeight: 600, color: "#1E293B" }}>{a.umkm}</td>
                        <td style={{ padding: "0.85rem 1.25rem", color: "#334155" }}>{a.keterangan}</td>
                        <td style={{ padding: "0.85rem 1.25rem" }}>
                          <span style={{ background: `${a.warna}18`, color: a.warna, fontSize: "0.75rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}>{a.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {statModal && (
              <div className="no-print" onClick={() => setStatModal(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
                <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "560px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>
                      {statModal === "umkm" && "Detail Total UMKM"}
                      {statModal === "transaksi" && "Detail Untung & Rugi Transaksi"}
                      {statModal === "alat" && "Detail Penyewaan Alat"}
                      {statModal === "kolaborasi" && "Detail Kolaborasi"}
                      {statModal === "limbah" && "Detail Limbah Terjual"}
                      {statModal === "supplier" && "Detail Supplier"}
                    </h2>
                    <button onClick={() => setStatModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
                  </div>

                  {statModal === "umkm" && (
                    <>
                      <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>UMKM terdaftar per bulan (data asli dari Data UMKM)</p>
                      <MiniBarChart data={umkmMonthly} labelKey="bulan" valueKey="jumlah" color="#2563EB" />
                      <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "1rem 0 0.5rem" }}>Sebaran berdasarkan bidang usaha</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {umkmBySektor.map((s) => (
                          <div key={s.sektor} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", padding: "0.5rem 0.75rem", background: "#F8FAFC", borderRadius: "8px" }}>
                            <span style={{ color: "#334155" }}>{s.sektor}</span>
                            <strong style={{ color: "#1E293B" }}>{s.jumlah}</strong>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {statModal === "transaksi" && (
                    <>
                      <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>Untung (biru) vs Rugi (merah) per bulan, dalam juta rupiah</p>
                      <ProfitLossChart data={transaksiMonthly} />
                      {bulanRugi.length > 0 ? (
                        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", borderRadius: "10px", padding: "0.85rem 1rem", marginTop: "1rem", display: "flex", gap: "0.6rem" }}>
                          <span style={{ color: "#EF4444" }}><IconAlert /></span>
                          <div style={{ fontSize: "0.8rem", color: "#991B1B" }}>
                            <strong>Rekomendasi otomatis:</strong> Terdeteksi kerugian di bulan {bulanRugi.map((b) => b.bulan).join(", ")}. Disarankan audit ulang biaya operasional dan tinjau kembali harga jual di bulan tersebut.
                          </div>
                        </div>
                      ) : (
                        <div style={{ background: "#D1FAE5", borderRadius: "10px", padding: "0.85rem 1rem", marginTop: "1rem", fontSize: "0.8rem", color: "#065F46" }}>Tidak ada bulan dengan kerugian saat ini. Performa transaksi sehat.</div>
                      )}
                    </>
                  )}

                  {statModal === "alat" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {alatDisewa.map((a) => {
                        const max = Math.max(...alatDisewa.map((x) => x.jumlah));
                        return (
                          <div key={a.nama}>
                            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.25rem" }}>
                              <span style={{ color: "#334155" }}>{a.nama}</span>
                              <strong style={{ color: "#1E293B" }}>{a.jumlah}x</strong>
                            </div>
                            <div style={{ height: "8px", background: "#F1F5F9", borderRadius: "999px", overflow: "hidden" }}>
                              <div style={{ width: `${(a.jumlah / max) * 100}%`, height: "100%", background: "#EF4444" }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {statModal === "kolaborasi" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                      {kolaborasiList.map((k) => (
                        <div key={k.mitra} style={{ padding: "0.75rem", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #F1F5F9" }}>
                          <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.9rem" }}>{k.mitra}</div>
                          <div style={{ color: "#64748B", fontSize: "0.8rem", margin: "0.2rem 0" }}>{k.bidang}</div>
                          <span style={{ fontSize: "0.7rem", fontWeight: 600, color: "#92400E", background: "#FEF3C7", padding: "0.15rem 0.5rem", borderRadius: "999px" }}>{k.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {statModal === "limbah" && (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {limbahList.map((l) => (
                        <div key={l.jenis} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.85rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem" }}>
                          <span style={{ color: "#334155" }}>{l.jenis}</span>
                          <strong style={{ color: "#2563EB" }}>{l.jumlah}</strong>
                        </div>
                      ))}
                    </div>
                  )}

                  {statModal === "supplier" && (
                    <>
                      <p style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>Pertumbuhan jumlah supplier per bulan</p>
                      <MiniBarChart data={supplierMonthly} labelKey="bulan" valueKey="jumlah" color="#10B981" />
                      <p style={{ fontSize: "0.85rem", color: "#64748B", margin: "1rem 0 0.5rem" }}>Beberapa supplier terbaru</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                        {supplierList.map((s) => (
                          <div key={s.nama} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.85rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.85rem" }}>
                            <div>
                              <div style={{ fontWeight: 600, color: "#1E293B" }}>{s.nama}</div>
                              <div style={{ color: "#94A3B8", fontSize: "0.75rem" }}>{s.kategori} • {s.wilayah}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}

            {exportView && (
              <div className="no-print" onClick={() => setExportView(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
                <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "480px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                    <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>Ringkasan Laporan Audit</h2>
                    <button onClick={() => setExportView(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
                  </div>
                  <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "1rem" }}>Disiapkan oleh {onDuty.nama} ({onDuty.peran}) • {new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total UMKM</span><strong>{totalUmkm}</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Transaksi</span><strong>18.400</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Penyewaan Alat</span><strong>842</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Kolaborasi</span><strong>1.205</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Limbah Terjual</span><strong>45.2 Ton</strong></div>
                    <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total Supplier</span><strong>318</strong></div>
                  </div>
                </div>
              </div>
            )}
          </main>
        )}

        {/* Halaman lain — data & fungsi umkm/pelanggaran dioper lewat props */}
        {activeMenu === "data-umkm" && <DataUMKM umkmList={umkmList} addUmkm={addUmkm} setUmkmStatus={setUmkmStatus} />}
        {activeMenu === "verifikasi-umkm" && <VerifikasiAkun umkmList={umkmList} setUmkmStatus={setUmkmStatus} />}
        {activeMenu === "suspend-akun" && <SuspendAkun umkmList={umkmList} pelanggaranList={pelanggaranList} addPelanggaran={addPelanggaran} pulihkanPelanggaran={pulihkanPelanggaran} />}
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
