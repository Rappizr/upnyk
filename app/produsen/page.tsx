"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/db";

import StokKomoditas from "./components/stok-komoditas";
import PenjualanB2B from "./components/penjualan-b2b";
import Pengiriman from "./components/pengiriman";
import Keuangan from "./components/keuangan";
import ProfilUMKM from "./components/profil-umkm";

export interface Profil { nama: string; usaha: string; alamat: string; telepon: string; email: string; kategori: string; terverifikasi: boolean; inisial: string; fotoUrl?: string }
export interface Ulasan { pembeli: string; rating: number; komentar: string }
export interface StokItem { id: string; nama: string; jumlah: number; satuan: string; hargaSatuan: number; status: "Aman" | "Menipis" | "Habis"; kategori: string; fotoUrl?: string; ulasan: Ulasan[] }
export interface Pesanan { id: string; pembeli: string; itemId: string; item: string; jumlah: number; satuan: string; total: number; status: "Baru" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan"; tanggal: string; alamatKirim: string; noResi?: string }
export interface Pengeluaran { id: string; keterangan: string; nominal: number; tanggal: string; kategori: string }

const IconDashboard = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"></rect><rect x="14" y="3" width="7" height="5"></rect><rect x="14" y="12" width="7" height="9"></rect><rect x="3" y="16" width="7" height="5"></rect></svg>;
const IconPackage = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconStore = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconTruck = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconWallet = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconMenu = () => <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>;
const IconX = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconBell = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>;
const IconSparkle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 2v4M12 18v4M4.9 4.9l2.8 2.8M16.3 16.3l2.8 2.8M2 12h4M18 12h4M4.9 19.1l2.8-2.8M16.3 7.7l2.8-2.8"></path></svg>;
const IconArrowRight = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const IconChevronDown = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;

const pageTitles: Record<string, string> = {
  dashboard: "Dashboard Overview",
  stok: "Manajemen Produk & Stok",
  penjualan: "Daftar Pesanan Toko",
  pengiriman: "Pelacakan Pengiriman",
  keuangan: "Arus Kas Keuangan",
  profil: "Profil Usaha UMKM"
};

function formatRupiah(n: number) {
  if (n < 0) return "- Rp " + Math.abs(n).toLocaleString("id-ID");
  return "Rp " + n.toLocaleString("id-ID");
}

export default function ProdusenDashboard() {
  const [activeMenu, setActiveMenu] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const [isProfileComplete, setIsProfileComplete] = useState<boolean | null>(null);
  const [profil, setProfil] = useState<Profil>({
    nama: "Memuat nama...", usaha: "Nama Usaha Belum Diisi", alamat: "",
    telepon: "-", email: "-", kategori: "Belum memilih kategori", terverifikasi: false, inisial: "PM"
  });

  const [stokList, setStokList] = useState<StokItem[]>([]);
  const [pesananList] = useState<Pesanan[]>([]);
  const [pengeluaranList] = useState<Pengeluaran[]>([]);

  async function muatDataDashboard() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: mainProfile } = await supabase.from("profiles").select("nama, email, phone, avatar_url").eq("id", user.id).single();
    const { data: produsen } = await supabase.from("produsen").select("*").eq("profile_id", user.id).maybeSingle();

    const namaPengguna = mainProfile?.nama || "User Produsen";
    const inisialPengguna = namaPengguna.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

    const lengkap = !!(produsen && produsen.alamat && produsen.nama_usaha && produsen.nama_usaha !== "UMKM Maju Bersama");
    setIsProfileComplete(lengkap);

    setProfil({
      nama: namaPengguna,
      usaha: produsen?.nama_usaha || "Nama Usaha Belum Diisi",
      alamat: produsen?.alamat || "",
      telepon: mainProfile?.phone || "-",
      email: mainProfile?.email || "-",
      kategori: produsen?.kategori || "Belum memilih kategori", 
      terverifikasi: produsen?.status === "aktif",
      inisial: inisialPengguna,
      fotoUrl: mainProfile?.avatar_url || undefined // Menyambungkan avatar riil atas kanan dari profiles
    });

    const { data: produk } = await supabase.from("produk").select("*, inventaris(stok, stok_minimum), review(rating, komentar)");
    if (produk) {
      setStokList(produk.map((p: any) => {
        const stok = p.inventaris?.stok ?? 0;
        const min = p.inventaris?.stok_minimum ?? 10;
        return {
          id: p.id, nama: p.nama, jumlah: stok, satuan: p.satuan || "kg", hargaSatuan: Number(p.harga),
          status: stok <= 0 ? "Habis" : stok <= min ? "Menipis" : "Aman", kategori: "Makanan & Minuman",
          ulasan: (p.review || []).map((r: any) => ({ pembeli: "Toko Mitra", rating: r.rating, komentar: r.komentar }))
        };
      }));
    }
  }

  useEffect(() => {
    muatDataDashboard();
  }, [activeMenu]);

  const totalStok = stokList.reduce((s, x) => s + x.jumlah, 0);
  const stokMenipis = stokList.filter((s) => s.status === "Menipis" || s.status === "Habis");
  const totalPendapatan = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0);
  const totalPengeluaran = pengeluaranList.reduce((s, p) => s + p.nominal, 0);
  const saldo = totalPendapatan - totalPengeluaran;
  const pesananAktif = pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses" || p.status === "Dikirim").length;
  const semuaUlasan = stokList.flatMap((s) => s.ulasan.map((u) => ({ ...u, produk: s.nama })));
  const ratingRata = semuaUlasan.length ? semuaUlasan.reduce((s, u) => s + u.rating, 0) / semuaUlasan.length : 0;

  const notifItems = stokMenipis.map((s) => ({ id: `stok-${s.id}`, text: `Stok ${s.nama} ${s.status === "Habis" ? "habis" : "menipis"}`, sub: `Sisa ${s.jumlah} ${s.satuan}`, tujuan: "stok" }));

  if (isProfileComplete === null) {
    return <div style={{ display: "flex", height: "100vh", alignItems: "center", justifyContent: "center", color: "#64748B" }}>Menghubungkan Database PasarNusa...</div>;
  }

  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .pn-sidebar { width: 220px; }
        .pn-hamburger { display: none; }
        .pn-stats-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; }
        .pn-panels-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 12px; }
        .pn-user-name { display: block; }
        @media (max-width: 900px) {
          .pn-sidebar { position: fixed; top: 0; left: 0; bottom: 0; z-index: 50; transform: translateX(-100%); transition: transform .2s ease; box-shadow: 2px 0 16px rgba(0,0,0,.1); }
          .pn-sidebar.open { transform: translateX(0); }
          .pn-hamburger { display: flex; }
          .pn-stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.25rem !important; }
          .pn-panels-grid { grid-template-columns: 1fr !important; }
        }
      `}} />

      <aside className={`pn-sidebar${sidebarOpen ? " open" : ""}`} style={{ background: "#fff", borderRight: "1px solid #E2E8F0", flexShrink: 0, display: "flex", flexDirection: "column", height: "100vh" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px", borderBottom: "1px solid #F1F5F9" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "9px", background: "#10B981", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" /></svg>
            </div>
            <div><div style={{ fontWeight: 700, color: "#1E293B", fontSize: "14px" }}>PasarNusa</div><div style={{ fontSize: "10.5px", color: "#94A3B8" }}>Produsen / UMKM</div></div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="pn-hamburger" style={{ background: "none", border: "none", color: "#94A3B8" }}><IconX /></button>
        </div>
        <nav style={{ padding: "14px 10px", flex: 1, overflowY: "auto" }}>
          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", padding: "0 8px 6px" }}>MAIN</div>
          <div onClick={() => setActiveMenu("dashboard")} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: activeMenu === "dashboard" ? "#10B981" : "transparent", color: activeMenu === "dashboard" ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "14px", fontWeight: activeMenu === "dashboard" ? 600 : 400 }}><IconDashboard /> Dashboard</div>

          <div style={{ fontSize: "10px", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", padding: "0 8px 6px" }}>OPERASIONAL</div>
          <div onClick={() => setActiveMenu("stok")} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: activeMenu === "stok" ? "#10B981" : "transparent", color: activeMenu === "stok" ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "4px" }}><IconPackage /> Produk / Stok</div>
          <div onClick={() => setActiveMenu("penjualan")} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: activeMenu === "penjualan" ? "#10B981" : "transparent", color: activeMenu === "penjualan" ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "4px" }}><IconStore /> Pesanan</div>
          <div onClick={() => setActiveMenu("pengiriman")} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: activeMenu === "pengiriman" ? "#10B981" : "transparent", color: activeMenu === "pengiriman" ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "4px" }}><IconTruck /> Pengiriman</div>
          <div onClick={() => setActiveMenu("keuangan")} style={{ display: "flex", alignItems: "center", gap: "9px", padding: "9px 10px", borderRadius: "8px", background: activeMenu === "keuangan" ? "#10B981" : "transparent", color: activeMenu === "keuangan" ? "#fff" : "#334155", fontSize: "13px", cursor: "pointer", marginBottom: "4px" }}><IconWallet /> Keuangan</div>
        </nav>
        <div style={{ borderTop: "1px solid #F1F5F9", padding: "12px" }}>
          <Link href="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", borderRadius: "8px", background: "#FEE2E2", color: "#EF4444", textDecoration: "none", fontSize: "13px", fontWeight: 600 }}>Keluar</Link>
        </div>
      </aside>

      <div style={{ flex: 1, height: "100vh", overflowY: "auto", minWidth: 0, display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px clamp(1rem, 4vw, 1.75rem)", borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <button onClick={() => setSidebarOpen(true)} className="pn-hamburger" style={{ background: "none", border: "none", color: "#334155" }}><IconMenu /></button>
            <div style={{ fontSize: "19px", fontWeight: 700, color: "#1E293B" }}>{pageTitles[!isProfileComplete ? "profil" : activeMenu]}</div>
          </div>
          
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div onClick={() => isProfileComplete && setNotifOpen((v) => !v)} style={{ position: "relative", width: "32px", height: "32px", borderRadius: "50%", background: "#F8FAFC", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
              <IconBell />
              {notifItems.length > 0 && <span style={{ position: "absolute", top: "6px", right: "7px", width: "6px", height: "6px", borderRadius: "50%", background: "#EF4444" }} />}
            </div>
            
            <div onClick={() => setActiveMenu("profil")} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", border: !isProfileComplete ? "2px dashed #EF4444" : "none", padding: "4px 8px", borderRadius: "8px", background: !isProfileComplete ? "#FEF2F2" : "transparent" }}>
              <div style={{ width: "34px", height: "34px", borderRadius: "50%", background: "#10B981", color: "#fff", fontSize: "12px", fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {profil.fotoUrl ? <img src={profil.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
              </div>
              <div className="pn-user-name">
                <div style={{ fontSize: "12.5px", fontWeight: 600, color: "#1E293B" }}>{profil.nama}</div>
                <div style={{ fontSize: "10.5px", color: !isProfileComplete ? "#DC2626" : "#94A3B8", fontWeight: !isProfileComplete ? 700 : 400 }}>
                  {!isProfileComplete ? "Wajib Isi Profil Usaha!" : "PasarNusa Produsen"}
                </div>
              </div>
              <span className="pn-user-name" style={{ color: "#94A3B8" }}><IconChevronDown /></span>
            </div>
          </div>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: "#F8FAFC" }}>
          {/* MENGIRIM KAN CALLBACK ONPROFILEUPDATE AGAR HEADER SYNC REALTIME */}
          {!isProfileComplete || activeMenu === "profil" ? (
            <div style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", textAlign: "center" }}>
              {!isProfileComplete && (
                <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "1rem", borderRadius: "10px", marginBottom: "1.5rem", fontSize: "0.88rem", fontWeight: 600, maxWidth: "520px", margin: "0 auto 1.5rem auto", textAlign: "left" }}>
                  ⚠️ Akun anda mendeteksi data data legalitas UMKM belum terdaftar lengkap. Silakan isi formulir di bawah ini dengan nama usaha, kategori hulu, dan alamat asli agar fitur operasional penayangan produk dapat diaktifkan kembali.
                </div>
              )}
              <ProfilUMKM onProfileUpdate={muatDataDashboard} />
            </div>
          ) : (
            <>
              {activeMenu === "dashboard" && (
                <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
                  <div className="hero-banner-container" style={{ background: "linear-gradient(135deg, #10B981, #059669)", borderRadius: "16px", padding: "1.5rem 2rem", marginBottom: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
                    <div>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: "rgba(255,255,255,.18)", color: "#fff", fontSize: "0.7rem", fontWeight: 600, padding: "0.3rem 0.7rem", borderRadius: "999px", marginBottom: "0.6rem" }}><IconSparkle /> Mitra Produsen Terpercaya</span>
                      <h2 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#fff", lineHeight: 1.25 }}>Selamat Datang, {profil.nama.split(" ")[0]}!</h2>
                      <p style={{ margin: "0.3rem 0 0 0", fontSize: "0.85rem", color: "rgba(255,255,255,.85)", maxWidth: "420px" }}>Pantau stok panen, pesanan dari Admin Toko, dan saldo hasil penjualanmu di sini.</p>
                    </div>
                    <button onClick={() => setActiveMenu("pengiriman")} style={{ background: "#fff", color: "#059669", border: "none", padding: "0.65rem 1.1rem", borderRadius: "8px", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>Lihat Riwayat Panen <IconArrowRight /></button>
                  </div>

                  <div className="pn-stats-grid" style={{ marginBottom: "1.25rem" }}>
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.4rem" }}>STOK TERSEDIA</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{totalStok} <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748B" }}>unit</span></div>
                      <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem", cursor: "pointer" }} onClick={() => setActiveMenu("stok")}>Kelola stok →</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => setActiveMenu("penjualan")}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.4rem" }}>PESANAN MASUK</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{pesananAktif} <span style={{ fontSize: "0.7rem", fontWeight: 400, color: "#64748B" }}>order</span></div>
                      <div style={{ fontSize: "0.68rem", color: "#D97706", marginTop: "0.15rem" }}>Perlu ditindaklanjuti</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.4rem" }}>PENDAPATAN SELESAI</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div>
                      <div style={{ fontSize: "0.68rem", color: "#10B981", marginTop: "0.15rem" }}>Total transaksi lunas</div>
                    </div>
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }} onClick={() => setActiveMenu("keuangan")}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.4rem" }}>SALDO WALLET</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(saldo)}</div>
                      <div style={{ fontSize: "0.68rem", color: "#64748B", marginTop: "0.15rem" }}>Siap ditarik</div>
                    </div>
                    <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", borderRadius: "10px", padding: "0.85rem" }}>
                      <div style={{ fontSize: "0.65rem", fontWeight: 700, color: "#065F46", textTransform: "uppercase", marginBottom: "0.4rem" }}>RATING PRODUK</div>
                      <div style={{ fontSize: "1.15rem", fontWeight: 700, color: "#065F46" }}>{ratingRata ? ratingRata.toFixed(1) : "0.0"} <span style={{ fontSize: "0.7rem", fontWeight: 400 }}>/5.0</span></div>
                      <div style={{ fontSize: "0.68rem", color: "#059669", marginTop: "0.15rem" }}>Dari {semuaUlasan.length} ulasan pembeli</div>
                    </div>
                  </div>

                  <div className="pn-panels-grid">
                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.2rem" }}>
                        <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>Pengingat panen & stok</div>
                        {stokMenipis.length > 0 && <span style={{ background: "#FEF3C7", color: "#92400E", fontSize: "0.65rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>Butuh tindakan</span>}
                      </div>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Analisis prediktif berbasis sisa stok dan jadwal panen</div>
                      {stokMenipis.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Semua stok dalam kondisi aman.</p>
                      ) : (
                        stokMenipis.map((s) => (
                          <div key={s.id} style={{ background: "#FEF2F2", borderRadius: "8px", padding: "0.6rem 0.7rem", marginBottom: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div><div style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</div><div style={{ fontSize: "0.68rem", color: "#DC2626" }}>{s.status === "Habis" ? "Stok habis" : `Hampir habis (sisa ${s.jumlah} ${s.satuan})`}</div></div>
                            <button onClick={() => setActiveMenu("stok")} style={{ background: "#10B981", color: "#fff", border: "none", fontSize: "0.68rem", fontWeight: 600, padding: "0.4rem 0.7rem", borderRadius: "6px", cursor: "pointer" }}>Kelola stok</button>
                          </div>
                        ))
                      )}
                    </div>

                    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "1rem" }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.2rem" }}>Ulasan terbaru dari pembeli</div>
                      <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.7rem" }}>Otomatis tersinkron dari transaksi pembeli</div>
                      {semuaUlasan.length === 0 ? (
                        <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Belum ada ulasan masuk dari Supabase.</p>
                      ) : (
                        semuaUlasan.slice(0, 3).map((u, i) => (
                          <div key={i} style={{ padding: "0.5rem 0", borderBottom: i < 2 ? "1px solid #F1F5F9" : "none" }}>
                            <div style={{ display: "flex", justifyContent: "space-between" }}>
                              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "#1E293B" }}>{u.pembeli} <span style={{ fontWeight: 400, color: "#94A3B8" }}>({u.produk})</span></span>
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

              {activeMenu === "stok" && <StokKomoditas />}
              {activeMenu === "penjualan" && <PenjualanB2B pesananList={pesananList} deletePesanan={() => {}} updatePesananStatus={() => {}} />}
              {activeMenu === "pengiriman" && <Pengiriman pesananList={pesananList} updatePesananStatus={() => {}} />}
              {activeMenu === "keuangan" && <Keuangan pesananList={pesananList} pengeluaranList={pengeluaranList} addPengeluaran={() => {}} />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}