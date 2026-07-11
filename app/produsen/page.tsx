"use client";

import { useEffect, useMemo, useRef, useState } from "react";
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

export interface StokItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  status: "Aman" | "Menipis" | "Habis";
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
  nama: "Pak Baihaqi",
  usaha: "Keripik Tempe Sanan",
  alamat: "Jl. Sanan No. 12, Malang, Jawa Timur",
  telepon: "0812-3456-7890",
  email: "baihaqi.sanan@gmail.com",
  kategori: "Makanan & Minuman",
  terverifikasi: true,
  inisial: "PB",
};

const initialStok: StokItem[] = [
  { id: "STK-01", nama: "Keripik Tempe Original", jumlah: 320, satuan: "kg", hargaSatuan: 45000, status: "Aman" },
  { id: "STK-02", nama: "Keripik Tempe Pedas", jumlah: 8, satuan: "kg", hargaSatuan: 48000, status: "Menipis" },
  { id: "STK-03", nama: "Kemasan Vakum 250gr", jumlah: 15, satuan: "pcs", hargaSatuan: 1200, status: "Menipis" },
  { id: "STK-04", nama: "Tempe Kedelai Mentah", jumlah: 0, satuan: "kg", hargaSatuan: 12000, status: "Habis" },
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

const salesMonthly = [
  { bulan: "Feb", nilai: 8500000 },
  { bulan: "Mar", nilai: 10200000 },
  { bulan: "Apr", nilai: 9600000 },
  { bulan: "Mei", nilai: 13400000 },
  { bulan: "Jun", nilai: 12100000 },
];

// ---- Lokasi kota untuk peta pelacakan (tanpa perlu API key — pakai OpenStreetMap) ----
const cityCoords: Record<string, [number, number]> = {
  Malang: [-7.9666, 112.6326],
  Jombang: [-7.5460, 112.2384],
  Surabaya: [-7.2575, 112.7521],
  Sidoarjo: [-7.4478, 112.7183],
};
const gudangAsal: [number, number] = cityCoords.Malang;

export function extractCity(alamat: string): string {
  const known = Object.keys(cityCoords);
  const found = known.find((c) => alamat.toLowerCase().includes(c.toLowerCase()));
  return found || "Malang";
}
export function coordFromAlamat(alamat: string): [number, number] {
  return cityCoords[extractCity(alamat)];
}

// Peta kecil pakai Leaflet dari CDN — tidak perlu npm install apapun
export function MiniMap({ markers, height = 220 }: { markers: { lat: number; lng: number; label: string; color?: string }[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    function init() {
      const L = (window as any).L;
      if (!ref.current || !L || markers.length === 0) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(ref.current, { scrollWheelZoom: false }).setView([markers[0].lat, markers[0].lng], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
      markers.forEach((m) => {
        L.circleMarker([m.lat, m.lng], { radius: 9, color: m.color || "#2563EB", fillColor: m.color || "#2563EB", fillOpacity: 0.9, weight: 2 }).addTo(map).bindPopup(m.label);
      });
      if (markers.length > 1) {
        map.fitBounds(L.latLngBounds(markers.map((m) => [m.lat, m.lng] as [number, number])), { padding: [30, 30] });
      }
      mapRef.current = map;
    }

    if ((window as any).L) {
      init();
    } else {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      let script = document.getElementById("leaflet-js") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.body.appendChild(script);
      }
      script.addEventListener("load", init);
      return () => script?.removeEventListener("load", init);
    }

    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [markers]);

  return <div ref={ref} style={{ height, borderRadius: "10px", overflow: "hidden", background: "#F1F5F9" }} />;
}

// Komponen SVG Ikon Mandiri
const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconPackage = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconTruck = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconWallet = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconUser = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMapPin = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconCheckCircle = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

const menuItems = [
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "stok", label: "Stok Komoditas", icon: IconPackage },
  { key: "penjualan", label: "Penjualan B2B", icon: IconStore },
  { key: "pengiriman", label: "Pengiriman", icon: IconTruck },
  { key: "keuangan", label: "Keuangan", icon: IconWallet },
  { key: "profil", label: "Profil UMKM", icon: IconUser },
];

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function ProdusenDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");

  const [profil, setProfil] = useState<Profil>(initialProfil);
  const [stokList, setStokList] = useState<StokItem[]>(initialStok);
  const [pesananList, setPesananList] = useState<Pesanan[]>(initialPesanan);
  const [pengeluaranList, setPengeluaranList] = useState<Pengeluaran[]>(initialPengeluaran);

  function hitungStatus(jumlah: number): StokItem["status"] {
    if (jumlah <= 0) return "Habis";
    if (jumlah <= 10) return "Menipis";
    return "Aman";
  }

  function addStok(item: Omit<StokItem, "id" | "status">) {
    const id = `STK-${String(stokList.length + 1).padStart(2, "0")}`;
    setStokList((prev) => [{ id, status: hitungStatus(item.jumlah), ...item }, ...prev]);
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

  // ---- Angka turunan buat dashboard ----
  const totalStok = stokList.reduce((s, x) => s + x.jumlah, 0);
  const stokMenipis = stokList.filter((s) => s.status === "Menipis" || s.status === "Habis");
  const totalPendapatan = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0);
  const totalPengeluaran = pengeluaranList.reduce((s, p) => s + p.nominal, 0);
  const saldo = totalPendapatan - totalPengeluaran;
  const pesananAktif = pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses" || p.status === "Dikirim").length;
  const penjualanBulanIni = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0) + salesMonthly[salesMonthly.length - 1].nilai * 0;
  const maxSales = Math.max(...salesMonthly.map((s) => s.nilai), penjualanBulanIni || 1);

  const getNavStyle = (key: string) => ({
    display: "flex",
    alignItems: "center",
    gap: "9px",
    padding: "9px 10px",
    borderRadius: "8px",
    background: activeMenu === key ? "rgba(255,255,255,.18)" : "transparent",
    color: activeMenu === key ? "#fff" : "rgba(255,255,255,.75)",
    fontSize: "13.5px",
    cursor: "pointer",
    marginBottom: "3px",
  } as const);

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#2563EB", padding: "18px 12px", display: "flex", flexDirection: "column", height: "100vh", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "22px", padding: "0 4px" }}>
          <div style={{ width: "26px", height: "26px", borderRadius: "7px", background: "rgba(255,255,255,.18)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" /></svg>
          </div>
          <span style={{ color: "#fff", fontWeight: 800, fontSize: "15px" }}>PasarNusa</span>
        </div>
        <nav style={{ flex: 1, overflowY: "auto" }}>
          {menuItems.map((m) => {
            const Icon = m.icon;
            return (
              <div key={m.key} onClick={() => setActiveMenu(m.key)} style={getNavStyle(m.key)}>
                <Icon /> {m.label}
              </div>
            );
          })}
        </nav>
        <div style={{ borderTop: "1px solid rgba(255,255,255,.2)", paddingTop: "12px", marginTop: "12px" }}>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "8px", background: "#EF4444", color: "#fff", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Keluar</Link>
        </div>
      </aside>

      {/* Konten */}
      <div style={{ flex: 1, height: "100vh", overflowY: "auto" }}>
        {activeMenu === "dashboard" && (
          <main style={{ padding: "2rem" }}>
            {/* Kartu Sambutan Biru — diperbesar */}
            <div style={{ background: "#2563EB", borderRadius: "16px", padding: "1.75rem 2rem", marginBottom: "1.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
                <div style={{ width: "72px", height: "72px", borderRadius: "50%", background: "rgba(255,255,255,.2)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, flexShrink: 0, overflow: "hidden" }}>
                  {profil.fotoUrl ? <img src={profil.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
                </div>
                <div>
                  <div style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fff", lineHeight: 1.2 }}>Halo, {profil.nama}</div>
                  <div style={{ fontSize: "1rem", color: "rgba(255,255,255,.9)", marginTop: "0.2rem" }}>{profil.usaha}</div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", color: "rgba(255,255,255,.75)", marginTop: "0.4rem" }}><IconMapPin /> {profil.alamat}</div>
                </div>
              </div>
              {profil.terverifikasi && (
                <span style={{ display: "flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.2)", color: "#fff", fontSize: "0.82rem", fontWeight: 600, padding: "0.5rem 0.9rem", borderRadius: "999px" }}><IconCheckCircle /> Terverifikasi</span>
              )}
            </div>

            {/* KPI Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
              <div onClick={() => setActiveMenu("stok")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}><IconPackage /></div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalStok} unit</div>
                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total stok tersedia →</div>
              </div>
              <div onClick={() => setActiveMenu("penjualan")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#D1FAE5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}><IconStore /></div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Penjualan selesai →</div>
              </div>
              <div onClick={() => setActiveMenu("pengiriman")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}><IconTruck /></div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{pesananAktif}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Pesanan diproses →</div>
              </div>
              <div onClick={() => setActiveMenu("keuangan")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", cursor: "pointer" }}>
                <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: "#EFF6FF", color: "#2563EB", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.6rem" }}><IconWallet /></div>
                <div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(saldo)}</div>
                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Saldo tersedia →</div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
              {/* Grafik Penjualan */}
              <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
                <h3 style={{ margin: "0 0 1rem 0", fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>Penjualan Bulanan</h3>
                <div style={{ display: "flex", alignItems: "flex-end", height: "140px", gap: "0.9rem" }}>
                  {salesMonthly.map((m) => (
                    <div key={m.bulan} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                      <div style={{ width: "100%", maxWidth: "34px", height: `${(m.nilai / maxSales) * 100}%`, background: "#93C5FD", borderRadius: "5px 5px 0 0", minHeight: "4px" }} />
                      <div style={{ fontSize: "0.72rem", color: "#64748B", marginTop: "0.35rem" }}>{m.bulan}</div>
                    </div>
                  ))}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%" }}>
                    <div style={{ width: "100%", maxWidth: "34px", height: `${(Math.max(penjualanBulanIni, 1) / maxSales) * 100}%`, background: "#2563EB", borderRadius: "5px 5px 0 0", minHeight: "4px" }} />
                    <div style={{ fontSize: "0.72rem", color: "#1E293B", fontWeight: 700, marginTop: "0.35rem" }}>Jul</div>
                  </div>
                </div>
              </div>

              {/* Stok Menipis */}
              <div onClick={() => setActiveMenu("stok")} style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #FCA5A5", cursor: "pointer" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
                  <span style={{ color: "#EF4444" }}><IconAlert /></span>
                  <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#991B1B" }}>Stok menipis / habis</span>
                </div>
                {stokMenipis.length === 0 ? (
                  <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Semua stok dalam kondisi aman.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                    {stokMenipis.map((s) => (
                      <div key={s.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem" }}>
                        <span style={{ color: "#334155" }}>{s.nama}</span>
                        <strong style={{ color: s.status === "Habis" ? "#EF4444" : "#D97706" }}>{s.jumlah} {s.satuan}</strong>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Peta Pengiriman Aktif */}
            <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.9rem", flexWrap: "wrap", gap: "0.5rem" }}>
                <h3 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>Posisi Pesanan Aktif</h3>
                <span onClick={() => setActiveMenu("pengiriman")} style={{ fontSize: "0.78rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Lihat semua pengiriman →</span>
              </div>
              <MiniMap
                markers={[
                  { lat: gudangAsal[0], lng: gudangAsal[1], label: `Gudang ${profil.usaha} (asal pengiriman)`, color: "#10B981" },
                  ...pesananList
                    .filter((p) => p.status === "Diproses" || p.status === "Dikirim")
                    .map((p) => {
                      const [lat, lng] = coordFromAlamat(p.alamatKirim);
                      return { lat, lng, label: `${p.id} — ${p.pembeli} (${p.status})`, color: p.status === "Dikirim" ? "#2563EB" : "#F59E0B" };
                    }),
                ]}
              />
            </div>

            {/* Pesanan Terbaru */}
            <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
              <h3 style={{ margin: 0, padding: "1.1rem 1.1rem 0.75rem", fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>Pesanan B2B terbaru</h3>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.85rem", minWidth: "500px" }}>
                  <tbody>
                    {pesananList.slice(0, 4).map((p) => (
                      <tr key={p.id} onClick={() => setActiveMenu("penjualan")} style={{ borderTop: "1px solid #F1F5F9", cursor: "pointer" }}>
                        <td style={{ padding: "0.75rem 1.1rem", fontWeight: 600, color: "#1E293B" }}>{p.pembeli}</td>
                        <td style={{ padding: "0.75rem 1.1rem", color: "#64748B" }}>{p.item}</td>
                        <td style={{ padding: "0.75rem 1.1rem", color: "#1E293B", fontWeight: 600 }}>{formatRupiah(p.total)}</td>
                        <td style={{ padding: "0.75rem 1.1rem" }}>
                          <span style={{ fontSize: "0.72rem", fontWeight: 600, padding: "0.2rem 0.55rem", borderRadius: "999px", background: p.status === "Selesai" ? "#D1FAE5" : p.status === "Dikirim" ? "#E0F2FE" : p.status === "Diproses" ? "#FEF3C7" : p.status === "Dibatalkan" ? "#FEE2E2" : "#F1F5F9", color: p.status === "Selesai" ? "#065F46" : p.status === "Dikirim" ? "#075985" : p.status === "Diproses" ? "#92400E" : p.status === "Dibatalkan" ? "#991B1B" : "#475569" }}>{p.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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