"use client";

import { useMemo, useState } from "react";
import type { ReactElement } from "react";
import Link from "next/link";

import StokKomoditas from "./components/stok-komoditas";
import PenjualanB2B from "./components/penjualan-b2b";
import Pengiriman from "./components/pengiriman";
import Keuangan from "./components/keuangan";
import ProfilUMKM from "./components/profil-umkm";

// ============================================================================
// TIPE DATA BERSAMA — dipegang di sini, dioper ke semua halaman lewat props
// ============================================================================
export interface Profil {
  nama: string;
  usaha: string;
  alamat: string;
  telepon: string;
  email: string;
  kategori: string;
  terverifikasi: boolean;
  inisial: string;
  fotoUrl?: string;
}

export interface Ulasan {
  pembeli: string;
  rating: number;
  komentar: string;
}

export interface StokItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  status: "Aman" | "Menipis" | "Habis";
  kategori: string;
  fotoUrl?: string;
  ulasan: Ulasan[];
}

export interface Pesanan {
  id: string;
  pembeli: string;
  itemId: string;
  item: string;
  jumlah: number;
  satuan: string;
  total: number;
  status: "Baru" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";
  tanggal: string;
  alamatKirim: string;
  noResi?: string;
}

export interface Pengeluaran {
  id: string;
  keterangan: string;
  nominal: number;
  tanggal: string;
  kategori: string;
}

const todayLabel = () => new Date().toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });

const initialProfil: Profil = {
  nama: "Budi Santoso",
  usaha: "Keripik Tempe Sanan",
  alamat: "Jl. Sanan No. 12, Malang, Jawa Timur",
  telepon: "0812-3456-7890",
  email: "budi.sanan@gmail.com",
  kategori: "Makanan & Minuman",
  terverifikasi: true,
  inisial: "BS",
};

const initialStok: StokItem[] = [
  {
    id: "STK-01", nama: "Keripik Tempe Original", jumlah: 320, satuan: "kg", hargaSatuan: 45000, status: "Aman", kategori: "Makanan & Minuman",
    ulasan: [
      { pembeli: "Warung Makmur Jaya", rating: 5, komentar: "Kualitas keripik selalu konsisten." },
      { pembeli: "Minimarket Sejahtera", rating: 5, komentar: "Renyah dan tidak apek." },
    ],
  },
  {
    id: "STK-02", nama: "Keripik Tempe Pedas", jumlah: 8, satuan: "kg", hargaSatuan: 48000, status: "Menipis", kategori: "Makanan & Minuman",
    ulasan: [{ pembeli: "Toko Sembako Berkah", rating: 4, komentar: "Enak, pengiriman kadang telat." }],
  },
  { id: "STK-03", nama: "Kemasan Vakum 250gr", jumlah: 15, satuan: "pcs", hargaSatuan: 1200, status: "Menipis", kategori: "Kemasan", ulasan: [] },
  { id: "STK-04", nama: "Tempe Kedelai Mentah", jumlah: 0, satuan: "kg", hargaSatuan: 12000, status: "Habis", kategori: "Bahan Baku", ulasan: [] },
];

const initialPesanan: Pesanan[] = [
  { id: "ORD-2201", pembeli: "Warung Makmur Jaya", itemId: "STK-01", item: "Keripik Tempe Original", jumlah: 20, satuan: "kg", total: 900000, status: "Selesai", tanggal: "05 Jul 2026", alamatKirim: "Jl. Merdeka No. 5, Malang", noResi: "JNE-88213411" },
  { id: "ORD-2202", pembeli: "Toko Sembako Berkah", itemId: "STK-02", item: "Keripik Tempe Pedas", jumlah: 12, satuan: "kg", total: 576000, status: "Dikirim", tanggal: "08 Jul 2026", alamatKirim: "Jl. Gus Dur No. 9, Jombang, Jawa Timur", noResi: "JNE-88220091" },
  { id: "ORD-2203", pembeli: "Minimarket Sejahtera", itemId: "STK-01", item: "Keripik Tempe Original", jumlah: 35, satuan: "kg", total: 1575000, status: "Diproses", tanggal: "09 Jul 2026", alamatKirim: "Jl. Gajah Mada No. 3, Surabaya, Jawa Timur" },
  { id: "ORD-2204", pembeli: "Koperasi Pasar Besar", itemId: "STK-01", item: "Keripik Tempe Original", jumlah: 10, satuan: "kg", total: 450000, status: "Baru", tanggal: "10 Jul 2026", alamatKirim: "Pasar Besar Malang, Los C12" },
];

const initialPengeluaran: Pengeluaran[] = [
  { id: "EXP-01", keterangan: "Pembelian kedelai mentah", nominal: 850000, tanggal: "03 Jul 2026", kategori: "Bahan Baku" },
  { id: "EXP-02", keterangan: "Kemasan vakum & label", nominal: 320000, tanggal: "06 Jul 2026", kategori: "Kemasan" },
  { id: "EXP-03", keterangan: "Ongkos kirim bahan baku", nominal: 150000, tanggal: "07 Jul 2026", kategori: "Logistik" },
];

// Komponen SVG Ikon Mandiri
const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconPackage = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconTruck = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconWallet = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconUser = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMenu = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconBell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconSparkle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path></svg>;
const IconArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

interface MenuItemDef { key: string; label: string; icon: () => ReactElement }
interface MenuGroupDef { title: string; items: MenuItemDef[] }

const menuGroups: MenuGroupDef[] = [
  { title: "Main", items: [{ key: "dashboard", label: "Dashboard", icon: IconDashboard }] },
  { title: "Manajemen Stok", items: [{ key: "stok", label: "Stok Komoditas", icon: IconPackage }] },
  { title: "Penjualan & Logistik", items: [
    { key: "penjualan", label: "Penjualan B2B", icon: IconStore },
    { key: "pengiriman", label: "Pengiriman", icon: IconTruck },
  ] },
  { title: "Operasional", items: [
    { key: "keuangan", label: "Keuangan", icon: IconWallet },
    { key: "profil", label: "Profil UMKM", icon: IconUser },
  ] },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard",
  stok: "Stok Komoditas",
  penjualan: "Penjualan B2B",
  pengiriman: "Pengiriman",
  keuangan: "Keuangan",
  profil: "Profil UMKM",
};

export default function ProdusenDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [profil, setProfil] = useState<Profil>(initialProfil);
  const [stokList, setStokList] = useState<StokItem[]>(initialStok);
  const [pesananList, setPesananList] = useState<Pesanan[]>(initialPesanan);
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>(initialPengeluaran);

  function hitungStatus(jumlah: number): StokItem["status"] {
    if (jumlah <= 0) return "Habis";
    if (jumlah <= 10) return "Menipis";
    return "Aman";
  }

  function addStok(item: Omit<StokItem, "id" | "status" | "ulasan">) {
    const id = `STK-${String(stokList.length + 1).padStart(2, "0")}`;
    setStokList((prev) => [{ id, status: hitungStatus(item.jumlah), ulasan: [], ...item }, ...prev]);
  }
  function updateStok(id: string, patch: Partial<StokItem>) {
    setStokList((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch, status: hitungStatus(patch.jumlah ?? s.jumlah) } : s)));
  }
  function deleteStok(id: string) {
    setStokList((prev) => prev.filter((s) => s.id !== id));
  }

  function addPesanan(pembeli: string, itemId: string, jumlah: number, alamatKirim: string) {
    const item = stokList.find((s) => s.id === itemId);
    if (!item) return;
    const id = `ORD-${2200 + pesananList.length + 1}`;
    const total = item.hargaSatuan * jumlah;
    setPesananList((prev) => [{ id, pembeli, itemId, item: item.nama, jumlah, satuan: item.satuan, total, status: "Baru", tanggal: todayLabel(), alamatKirim }, ...prev]);
    updateStok(itemId, { jumlah: Math.max(0, item.jumlah - jumlah) });
  }

  function updatePesananStatus(id: string, status: Pesanan["status"]) {
    setPesananList((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const noResi = status === "Dikirim" && !p.noResi ? `JNE-${Math.floor(80000000 + Math.random() * 9999999)}` : p.noResi;
        return { ...p, status, noResi };
      })
    );
  }

  function addPengeluaran(entry: Omit<Pengeluaran, "id" | "tanggal">) {
    const id = `EXP-${String(pengeluaranList.length + 1).padStart(2, "0")}`;
    setPengeluaranList((prev) => [{ id, tanggal: todayLabel(), ...entry }, ...prev]);
  }

  const totalStok = stokList.reduce((s, x) => s + x.jumlah, 0);
  const stokMenipis = stokList.filter((s) => s.status === "Menipis" || s.status === "Habis");
  const totalPendapatan = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0);
  const totalPengeluaran = pengeluaranList.reduce((s, p) => s + p.nominal, 0);
  const saldo = totalPendapatan - totalPengeluaran;
  const pesananAktif = pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses" || p.status === "Dikirim").length;
  const semuaUlasan = useMemo(() => stokList.flatMap((s) => s.ulasan.map((u) => ({ ...u, produk: s.nama }))), [stokList]);
  const ratingRata = useMemo(() => (semuaUlasan.length ? semuaUlasan.reduce((s, u) => s + u.rating, 0) / semuaUlasan.length : 0), [semuaUlasan]);

  function selectMenu(key: string) {
    setActiveMenu(key);
    setSidebarOpen(false);
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style>{`
        .pn-sidebar { width: 220px; }
        .pn-hamburger { display: none; }
        .pn-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .pn-panels-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .pn-user-name { display: block; }
        @media (max-width: 900px) {
          .pn-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .pn-sidebar.open { transform: translateX(0); }
          .pn-hamburger { display: flex; }
          .pn-stats-grid { grid-template-columns: repeat(2, 1fr); }
          .pn-panels-grid { grid-template-columns: 1fr; }
        }
        @media (max-width: 480px) {
          .pn-stats-grid { grid-template-columns: 1fr; }
          .pn-user-name { display: none; }
        }
      `}</style>

      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,.4)", zIndex: 40 }} />}

      {/* Sidebar */}
      <aside className={`pn-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "9px", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" /></svg>
            </div>
            <div><div style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Produsen / UMKM</div></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="pn-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          {menuGroups.map((group) => (
            <div key={group.title} style={{ marginBottom: "14px" }}>
              <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", letterSpacing: ".04em", textTransform: "uppercase", padding: "0 8px 6px" }}>{group.title}</div>
              {group.items.map((item) => {
                const Icon = item.icon;
                const active = activeMenu === item.key;
                return (
                  <div
                    key={item.key}
                    onClick={() => selectMenu(item.key)}
                    style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: active ? "#10B981" : "transparent", color: active ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "1px", fontWeight: active ? 600 : 400 }}
                  >
                    <Icon /> {item.label}
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

      {/* Konten */}
      <div style={{ flex: 1, height: "100vh", overflowY: "auto", minWidth: 0 }}>
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px clamp(1rem, 4vw, 1.75rem)", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setSidebarOpen(true)} className="pn-hamburger" style={{ background: "none", border: "none", cursor: "pointer", color: "#334155" }} aria-label="Buka menu"><IconMenu /></button>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#1E293B" }}>{pageTitles[activeMenu]}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ position: "relative", width: "32px", height: "32px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <IconBell />
              {stokMenipis.length > 0 && <span style={{ position: "absolute", top: "6px", right: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />}
            </div>
            <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#10B981", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
              {profil.fotoUrl ? <img src={profil.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
            </div>
            <div className="pn-user-name">
              <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B" }}>{profil.nama}</div>
              <div style={{ fontSize: "10.5px", color: "#94A3B8" }}>PasarNusa Produsen</div>
            </div>
          </div>
        </div>

        {activeMenu === "dashboard" && (
          <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
            {/* Hero */}
            <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "16px", padding: "1.5rem clamp(1.25rem, 4vw, 2rem)", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.18)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconSparkle /> Mitra Produsen Terpercaya</span>
                <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {profil.nama.split(" ")[0]}!</div>
                <div style={{ fontSize: "0.85rem", color: "rgba(255,255,255,.85)", marginTop: "0.3rem", maxWidth: "420px" }}>Pantau stok panen, pesanan dari Admin Toko, dan saldo hasil penjualanmu di sini.</div>
              </div>
              <button onClick={() => selectMenu("pengiriman")} style={{ background: "#fff", color: "#059669", border: "none", padding: "0.65rem 1.1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
                Lihat Riwayat Panen <IconArrowRight />
              </button>
            </div>

            {/* Stat cards */}
            <div className="pn-stats-grid" style={{ marginBottom: "1.25rem" }}>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>STOK TERSEDIA</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{totalStok} <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748B" }}>unit</span></div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }} onClick={() => selectMenu("stok")}>Kelola stok →</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("penjualan")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PESANAN MASUK</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{pesananAktif} <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748B" }}>order</span></div>
                <div style={{ fontSize: "0.68rem", color: "#D97706", marginTop: "0.15rem" }}>Perlu ditindaklanjuti</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>PENDAPATAN SELESAI</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div>
                <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }}>Total transaksi lunas</div>
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => selectMenu("keuangan")}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>SALDO WALLET</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(saldo)}</div>
                <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.15rem" }}>Siap ditarik</div>
              </div>
              <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "0.85rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#065F46", letterSpacing: ".03em", marginBottom: "0.4rem" }}>RATING PRODUK</div>
                <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065F46" }}>{ratingRata ? ratingRata.toFixed(1) : "0.0"} <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>/5.0</span></div>
                <div style={{ fontSize: "0.68rem", color: "#059669", marginTop: "0.15rem" }}>Dari {semuaUlasan.length} ulasan pembeli</div>
              </div>
            </div>

            {/* Panels */}
            <div className="pn-panels-grid">
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>Pengingat panen & stok</div>
                  {stokMenipis.length > 0 && <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>Butuh tindakan</span>}
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Analisis prediktif berbasis sisa stok dan jadwal panen</div>
                {stokMenipis.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Semua stok dalam kondisi aman.</p>
                ) : (
                  stokMenipis.map((s) => (
                    <div key={s.id} style={{ background: "#FEF2F2", borderRadius: "8px", padding: "0.6rem 0.7rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.5rem", flexWrap: "wrap" }}>
                      <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</div><div style={{ fontSize: "0.68rem", color: "#DC2626" }}>{s.status === "Habis" ? "Stok habis" : `Hampir habis (sisa ${s.jumlah} ${s.satuan})`}</div></div>
                      <button onClick={() => selectMenu("stok")} style={{ background: "#10B981", color: "#fff", border: "none", fontSize: "0.68rem", fontWeight: 600, padding: "0.4rem 0.7rem", borderRadius: "6px", cursor: "pointer", whiteSpace: "nowrap" }}>Kelola stok</button>
                    </div>
                  ))
                )}
              </div>
              <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.2rem" }}>Ulasan terbaru dari pembeli</div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Otomatis tersinkron dari transaksi pembeli</div>
                {semuaUlasan.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Belum ada ulasan masuk.</p>
                ) : (
                  semuaUlasan.slice(0, 3).map((u, i) => (
                    <div key={i} style={{ padding: "0.5rem 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1E293B" }}>{u.pembeli}</span>
                        <span style={{ color: "#D97706", fontSize: "0.72rem" }}>{"★".repeat(u.rating)}{"☆".repeat(5 - u.rating)}</span>
                      </div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B" }}>{u.komentar}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </main>
        )}

        {activeMenu === "stok" && <StokKomoditas stokList={stokList} addStok={addStok} updateStok={updateStok} deleteStok={deleteStok} />}
        {activeMenu === "penjualan" && <PenjualanB2B pesananList={pesananList} stokList={stokList} addPesanan={addPesanan} updatePesananStatus={updatePesananStatus} />}
        {activeMenu === "pengiriman" && <Pengiriman pesananList={pesananList} updatePesananStatus={updatePesananStatus} />}
        {activeMenu === "keuangan" && <Keuangan pesananList={pesananList} pengeluaranList={pengeluaranList} addPengeluaran={addPengeluaran} />}
        {activeMenu === "profil" && <ProfilUMKM profil={profil} setProfil={setProfil} />}
      </div>
    </div>
  );
}