'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Users, MapPin, CheckCircle2, Sprout, ShoppingBag, Milk } from "lucide-react";

export default function MitraUmkmPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<'semua' | 'pertanian' | 'kerajinan' | 'peternakan'>('semua');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const daftarMitra = [
    {
      nama: "Koperasi Tani Nusa Makmur",
      wilayah: "Sleman, Yogyakarta",
      klaster: "pertanian",
      icon: <Sprout size={24} />,
      produsen: 142,
      komoditas: "Padi Organik, Mentimun, Cabai Rawit",
      badgeColor: "#10B981"
    },
    {
      nama: "Paguyuban Pengrajin Batik Pracimantoro",
      wilayah: "Wonogiri, Jawa Tengah",
      klaster: "kerajinan",
      icon: <ShoppingBag size={24} />,
      produsen: 68,
      komoditas: "Kain Batik Tulis, Tenun Lurik, Anyaman Bambu",
      badgeColor: "#818CF8"
    },
    {
      nama: "Klaster Ternak Mulya Jaya",
      wilayah: "Malang, Jawa Timur",
      klaster: "peternakan",
      icon: <Milk size={24} />,
      produsen: 95,
      komoditas: "Susu Sapi Segar, Daging Sapi Potong, Pupuk",
      badgeColor: "#F59E0B"
    },
    {
      nama: "Koperasi Agro Lestari Kelompok Hulu",
      wilayah: "Garut, Jawa Barat",
      klaster: "pertanian",
      icon: <Sprout size={24} />,
      produsen: 110,
      komoditas: "Kentang Granola, Wortel, Kopi Arabika",
      badgeColor: "#10B981"
    },
    {
      nama: "Sentra Tenun Ikat Ikat Sumba",
      wilayah: "Sumba Timur, NTT",
      klaster: "kerajinan",
      icon: <ShoppingBag size={24} />,
      produsen: 45,
      komoditas: "Kain Tenun Ikat Pewarna Alam",
      badgeColor: "#818CF8"
    }
  ];

  const mitraTersaring = selectedFilter === 'semua' 
    ? daftarMitra 
    : daftarMitra.filter(mitra => mitra.klaster === selectedFilter);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>
      
      {/* INJEKSI CSS MODERN & RESPONSIVE REPLIKA 3 KOLOM GRID DI MOBILE */}
      <style dangerouslySetInnerHTML={{__html: `
        .glass-nav {
          background: ${isScrolled ? 'rgba(255, 255, 255, 0.85)' : 'rgba(255, 255, 255, 0.05)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)'};
          box-shadow: ${isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.03)' : 'none'};
        }
        .gradient-text {
          background: linear-gradient(135deg, #38BDF8 0%, #818CF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .mitra-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mitra-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(37, 99, 235, 0.08);
          border-color: rgba(56, 189, 248, 0.4);
        }
        .filter-btn {
          padding: 0.6rem 1.5rem;
          font-size: 0.9rem;
          font-weight: 600;
          border-radius: 99px;
          border: 1px solid #E2E8F0;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .header-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
          }
          .nav-logo-text {
            font-size: 0.85rem !important;
          }
          .nav-logo-img {
            height: 20px !important;
          }
          .btn-back {
            padding-top: 0.25rem !important;
            padding-bottom: 0.25rem !important;
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            font-size: 0.55rem !important;
            gap: 0.2rem !important;
          }
          .btn-back svg {
            width: 10px !important;
            height: 10px !important;
          }
          .hero-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 6rem !important;
            padding-bottom: 3rem !important;
          }
          .hero-badge {
            font-size: 0.65rem !important;
            padding: 0.35rem 0.85rem !important;
            margin-bottom: 1rem !important;
          }
          .hero-title {
            font-size: 1.85rem !important;
            line-height: 1.25 !important;
          }
          .hero-desc {
            font-size: 0.85rem !important;
          }
          .main-content {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .filter-bar-row {
            gap: 1rem !important;
            margin-bottom: 2rem !important;
            padding-bottom: 1rem !important;
          }
          .filter-group-buttons {
            gap: 0.35rem !important;
            width: 100%;
            overflow-x: auto;
            white-space: nowrap;
            padding-bottom: 6px;
            scrollbar-width: none;
          }
          .filter-group-buttons::-webkit-scrollbar {
            display: none;
          }
          .filter-btn {
            padding: 0.4rem 0.85rem !important;
            font-size: 0.75rem !important;
            gap: 0.3rem !important;
          }
          .filter-btn svg {
            width: 12px !important;
            height: 12px !important;
          }
          .filter-counter-text {
            font-size: 0.8rem !important;
            width: 100%;
            text-align: left;
          }

          /* --- HADIRKAN FIX 3 KOLOM GRID MENYAMPING DI HP --- */
          .cards-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .mitra-card {
            padding: 0.4rem 0.3rem !important;
            border-radius: 0.5rem !important;
          }
          .mitra-card div:first-child {
            margin-bottom: 0.4rem !important;
          }
          .mitra-card div:first-child div:first-child {
            padding: 0.3rem !important;
            border-radius: 0.4rem !important;
          }
          .mitra-card div:first-child div:first-child svg {
            width: 14px !important;
            height: 14px !important;
          }
          .mitra-card div:first-child div:last-child {
            padding: 0.1rem 0.3rem !important;
            font-size: 0.42rem !important;
            gap: 0.15rem !important;
          }
          .mitra-card div:first-child div:last-child svg {
            width: 8px !important;
            height: 8px !important;
          }
          .mitra-card h3 {
            font-size: 0.55rem !important;
            line-height: 1.15 !important;
            margin-bottom: 0.2rem !important;
          }
          .mitra-card div:nth-child(3) {
            margin-bottom: 0.5rem !important;
            gap: 0.15rem !important;
          }
          .mitra-card div:nth-child(3) svg {
            width: 8px !important;
            height: 8px !important;
          }
          .mitra-card div:nth-child(3) span {
            font-size: 0.45rem !important;
          }
          
          /* KOTAK PARAMETER STATS DI HP HARUS DISEDERHANAKAN AGAR COCOK */
          .stat-parameter-box {
            padding: 0.3rem !important;
            border-radius: 0.35rem !important;
            gap: 0.35rem !important;
            margin-bottom: 0.5rem !important;
            flex-direction: column !important;
          }
          .stat-parameter-box div:first-child {
            border-right: none !important;
            border-bottom: 1px solid #E2E8F0 !important;
            padding-right: 0px !important;
            padding-bottom: 0.3rem !important;
          }
          .stat-parameter-box div div:first-child {
            font-size: 0.42rem !important;
            line-height: 1 !important;
          }
          .stat-parameter-box div div:last-child {
            font-size: 0.55rem !important;
            line-height: 1 !important;
            margin-top: 0.1rem !important;
            gap: 0.15rem !important;
          }
          .stat-parameter-box div div:last-child svg {
            width: 10px !important;
            height: 10px !important;
          }
          .stat-parameter-box div div:last-child span {
            font-size: 0.42rem !important;
          }
          .stat-parameter-box div:last-child div:last-child {
            font-size: 0.45rem !important;
            margin-top: 0.1rem !important;
          }

          .mitra-card div:last-child {
            font-size: 0.42rem !important;
            line-height: 1.2 !important;
          }
          .mitra-card div:last-child strong {
            margin-bottom: 0.1rem !important;
          }

          .footer-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 1.5rem !important;
            padding-bottom: 1.5rem !important;
          }
          .footer-wrapper {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0px !important;
          }
          .footer-wrapper span {
            font-size: 0.42rem !important;
            line-height: 1.2 !important;
          }
        }
      `}} />

      {/* NAVBAR */}
      <header className="glass-nav header-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.5rem", fontWeight: 800, color: isScrolled ? "#1E293B" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "#2563EB" : "#38BDF8" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back" style={{ 
            paddingTop: "0.6rem", paddingBottom: "0.6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? "#2563EB" : "#FFFFFF", color: isScrolled ? "#FFFFFF" : "#2563EB", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" style={{ 
        paddingTop: "13rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1595246140625-573b715d11dc?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll"
      }}>
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-block", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Verified Digital Cooperatives
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Direktori Jaringan <br /><span className="gradient-text">Mitra Toko UMKM</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "0px" }}>
            Melihat daftar koperasi digital dan UMKM pelosok nusantara yang bertindak sebagai jangkar perantara jujur—berkomitmen mengutamakan Indeks Harga Adil bagi produsen.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="main-content" style={{ paddingTop: "5rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        
        <div className="filter-bar-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "3.5rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "1.5rem" }}>
          <div className="filter-group-buttons" style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <button onClick={() => setSelectedFilter('semua')} className="filter-btn" style={{ background: selectedFilter === 'semua' ? '#1E293B' : '#ffffff', color: selectedFilter === 'semua' ? '#ffffff' : '#475569' }}>
              All Klaster
            </button>
            <button onClick={() => setSelectedFilter('pertanian')} className="filter-btn" style={{ background: selectedFilter === 'pertanian' ? '#10B981' : '#ffffff', color: selectedFilter === 'pertanian' ? '#ffffff' : '#475569', borderColor: selectedFilter === 'pertanian' ? '#10B981' : '#E2E8F0' }}>
              <Sprout size={16} /> Pertanian
            </button>
            <button onClick={() => setSelectedFilter('kerajinan')} className="filter-btn" style={{ background: selectedFilter === 'kerajinan' ? '#818CF8' : '#ffffff', color: selectedFilter === 'kerajinan' ? '#ffffff' : '#475569', borderColor: selectedFilter === 'kerajinan' ? '#818CF8' : '#E2E8F0' }}>
              <ShoppingBag size={16} /> Kerajinan Batik
            </button>
            <button onClick={() => setSelectedFilter('peternakan')} className="filter-btn" style={{ background: selectedFilter === 'peternakan' ? '#F59E0B' : '#ffffff', color: selectedFilter === 'peternakan' ? '#ffffff' : '#475569', borderColor: selectedFilter === 'peternakan' ? '#F59E0B' : '#E2E8F0' }}>
              <Milk size={16} /> Peternakan
            </button>
          </div>
          
          <div className="filter-counter-text" style={{ color: "#64748B", fontSize: "0.95rem", fontWeight: 600 }}>
            Menampilkan <span style={{ color: "#1E293B", fontWeight: 800 }}>{mitraTersaring.length}</span> Koperasi Terverifikasi
          </div>
        </div>

        <div className="cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
          {mitraTersaring.map((mitra, index) => (
            <div key={index} className="mitra-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.75rem", display: "flex", flexDirection: "column", height: "100%" }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.5rem" }}>
                <div style={{ background: `${mitra.badgeColor}15`, color: mitra.badgeColor, padding: "0.75rem", borderRadius: "1rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {mitra.icon}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#10B981", background: "#ECFDF5", padding: "0.3rem 0.75rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700 }}>
                  <CheckCircle2 size={12} /> Verified Audit
                </div>
              </div>

              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginTop: "0px", marginBottom: "0.5rem", lineHeight: 1.3 }}>{mitra.nama}</h3>
              
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "#64748B", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
                <MapPin size={14} />
                <span>{mitra.wilayah}</span>
              </div>

              <div className="stat-parameter-box" style={{ background: "#F8FAFC", padding: "1.25rem", borderRadius: "1rem", display: "flex", gap: "1.5rem", marginBottom: "1.5rem", border: "1px solid #F1F5F9", marginTop: "auto" }}>
                <div style={{ borderRight: "1px solid #E2E8F0", paddingRight: "1.5rem" }}>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>Binaan hulu</div>
                  <div style={{ fontSize: "1.4rem", fontWeight: 800, color: "#1E293B", display: "flex", alignItems: "center", gap: "0.35rem", marginTop: "0.15rem" }}>
                    <Users size={16} style={{ color: "#64748B" }} /> {mitra.produsen} <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 500 }}>Jiwa</span>
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.02em" }}>Klaster Komoditas</div>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginTop: "0.35rem", textTransform: "capitalize" }}>
                    {mitra.klaster}
                  </div>
                </div>
              </div>

              <div style={{ fontSize: "0.85rem", lineHeight: 1.6, color: "#64748B" }}>
                <strong style={{ color: "#475569", display: "block", marginBottom: "0.15rem" }}>Fokus Pasokan Produk:</strong>
                {mitra.komoditas}
              </div>

            </div>
          ))}
        </div>

      </main>

      {/* FOOTER */}
      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "3rem", paddingBottom: "3rem", background: "#0B1120", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#64748B" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#475569" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}