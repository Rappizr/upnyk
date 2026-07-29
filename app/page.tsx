'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

// Custom Hook untuk animasi angka (Count Up)
function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // Cubic Ease-Out
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);
  return value;
}

export default function LandingPage() {
  // Gambar Latar Belakang Slide
  const bgImages = [
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1920&q=80"
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Integrasi Hook useCountUp
  const produsenCount = useCountUp(1250, 1800, statsVisible);
  const tokoCount = useCountUp(480, 1800, statsVisible);

  // Efek Ganti Background Otomatis
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  // Efek Deteksi Scroll untuk Navbar
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Efek Intersection Observer untuk Trigger Animasi Statistik
  useEffect(() => {
    const el = statsRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true); },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Data Fitur Rantai Pasok
  const fitur = [
    {
      layer: "Hulu",
      accent: "#0A4D2E", // Hijau PasarNusa
      soft: "rgba(10, 77, 46, 0.1)",
      title: "Portal Konsolidasi Produsen",
      desc: "Fitur pencatatan hasil panen, monitor indeks harga komoditas secara objektif, serta manajemen klaim pencairan dana otomatis.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
      )
    },
    {
      layer: "Logistik",
      accent: "#D97706", // Orange Harvest
      soft: "rgba(217, 119, 6, 0.1)",
      title: "Sistem Manajemen Distribusi",
      desc: "Modul pengawasan inventoris toko, optimasi rute armada pengiriman, dan rekomendasi restock otomatis berbasis histori permintaan.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9"/><path d="M9 14h6"/></svg>
      )
    },
    {
      layer: "Hilir",
      accent: "#0E7490", // Teal/Cyan
      soft: "rgba(14, 116, 144, 0.1)",
      title: "Katalog B2B & Transaksi",
      desc: "Kemudahan pengadaan komoditas langsung dari daerah asal dengan kepastian ketersediaan barang dan sistem jaminan pembayaran.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      )
    }
  ];

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif", color: "#0F172A", overflowX: "hidden", scrollBehavior: "smooth" }}>

      {/* BLOK CSS IN JSX */}
      <style>{`
        .pn-root {
          --brand-green: #0A4D2E;
          --brand-green-hover: #073822;
        }

        /* Navbar Glassmorphism */
        .glass-nav {
          background: ${isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
          border-bottom: ${isScrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent'};
          box-shadow: ${isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'};
          transition: all 0.3s ease-in-out;
        }

        .nav-link {
          color: #0F172A;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-link:hover { color: var(--brand-green); }

        /* Footer Link */
        .footer-link {
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-link:hover { color: #22C55E; }

        /* Highlight Warna Hijau Transparan */
        .green-highlight {
          color: var(--brand-green);
          font-style: normal;
          font-weight: 800;
        }

        /* Kartu Fitur dengan Hijau Transparansi */
        .green-translucent-card {
          position: relative;
          background: rgba(10, 77, 46, 0.04);
          border: 1px solid rgba(10, 77, 46, 0.18);
          border-radius: 12px;
          padding: 1.25rem 1rem;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 15px rgba(10, 77, 46, 0.03);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .green-translucent-card:hover {
          background: rgba(10, 77, 46, 0.07);
          border-color: rgba(10, 77, 46, 0.3);
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(10, 77, 46, 0.08);
        }

        /* Kartu Statistik Putih */
        .glass-stat {
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        /* Tombol Utama Hijau */
        .btn-green {
          background-color: var(--brand-green);
          color: #FFFFFF;
          transition: all 0.25s ease;
          box-shadow: 0 4px 14px rgba(10, 77, 46, 0.25);
        }
        .btn-green:hover {
          background-color: var(--brand-green-hover);
          transform: translateY(-1px);
        }

        /* Animasi Fade In Up */
        .fade-in { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Utiliti no-scrollbar */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* Media Queries - Penyesuaian Tampilan HP */
        @media (max-width: 768px) {
          .header-container { 
            padding: 0.5rem 0.6rem !important; 
            gap: 0.5rem !important; 
            justify-content: space-between !important;
          }
          .nav-brand-group { 
            margin-right: 0 !important; 
            gap: 0.35rem !important;
            flex-shrink: 0 !important;
          }
          .nav-logo-img { height: 18px !important; }
          .nav-logo-text { font-size: 0.78rem !important; }
          
          .nav-container { 
            gap: 0.35rem !important; 
            margin-left: auto !important; 
            flex-shrink: 1 !important;
            min-width: 0 !important;
          }
          .nav-link-desktop { 
            font-size: 0.55rem !important; 
            padding: 0 0.05rem !important; 
            letter-spacing: -0.02em !important;
          }
          .btn-masuk-portal { 
            padding: 0.28rem 0.45rem !important; 
            font-size: 0.55rem !important; 
            margin-left: 0.15rem !important; 
            border-radius: 99px !important;
            flex-shrink: 0 !important;
          }
          .btn-masuk-portal svg { width: 9px !important; height: 9px !important; }

          .hero-section { padding: 4.2rem 1rem 1.8rem !important; min-height: auto !important; text-align: left !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .hero-badge { font-size: 0.58rem !important; padding: 0.2rem 0.5rem !important; margin: 0 0 0.6rem 0 !important; }
          .hero-title { font-size: 1.45rem !important; line-height: 1.25 !important; margin-bottom: 0.6rem !important; text-align: left !important; }
          .hero-desc { font-size: 0.78rem !important; margin: 0 0 1rem 0 !important; line-height: 1.45 !important; text-align: left !important; }
          .hero-btn-group { justify-content: flex-start !important; margin-bottom: 0 !important; }
          .btn-green-hero { padding: 0.55rem 1rem !important; font-size: 0.75rem !important; }

          .stats-section { padding: 0 0.8rem !important; margin-top: -0.25rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
          .glass-stat { padding: 0.6rem 0.5rem !important; gap: 0.4rem !important; border-radius: 0.5rem !important; }
          .glass-stat .icon-box { padding: 0.4rem !important; border-radius: 0.35rem !important; }
          .glass-stat svg { width: 14px !important; height: 14px !important; }
          .glass-stat .stat-number { font-size: 0.95rem !important; }
          .glass-stat .stat-label { font-size: 0.58rem !important; line-height: 1.15 !important; margin-top: 0.1rem !important; }

          .features-section { padding: 2.2rem 0.6rem !important; background: #F8FAFC !important; }
          .features-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }
          .green-translucent-card { 
            padding: 0.65rem 0.45rem !important; 
            border-radius: 8px !important;
            min-height: 160px !important;
          }
          .green-translucent-card h3 { 
            font-size: 0.68rem !important; 
            line-height: 1.25 !important; 
            margin-bottom: 0.25rem !important;
            font-weight: 700 !important;
          }
          .green-translucent-card p { 
            font-size: 0.55rem !important; 
            line-height: 1.3 !important; 
          }
          .green-translucent-card .layer-badge { 
            font-size: 0.5rem !important; 
            padding: 0.1rem 0.3rem !important; 
          }
          .green-translucent-card .icon-wrapper { 
            width: 22px !important; 
            height: 22px !important; 
          }
          .green-translucent-card .icon-wrapper svg { 
            width: 12px !important; 
            height: 12px !important; 
          }

          /* Penyesuaian Responsif Footer Mobile Agar Sama Seperti Laptop */
          .footer-section { padding-top: 1.5rem !important; padding-bottom: 1rem !important; }
          .footer-main-container {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: flex-start !important;
            gap: 0.8rem !important;
            margin-bottom: 1rem !important;
          }
          .footer-brand-area { 
            max-width: 55% !important; 
          }
          .footer-brand-area img { height: 18px !important; }
          .footer-brand-area span { font-size: 0.85rem !important; }
          .footer-brand-area p { 
            font-size: 0.6rem !important; 
            line-height: 1.35 !important;
            margin-top: 0.25rem !important;
          }
          .footer-nav-links { 
            gap: 0.4rem !important; 
            flex-direction: column !important;
            align-items: flex-end !important;
            font-size: 0.62rem !important;
          }
          .footer-bottom { 
            padding-top: 0.6rem !important; 
            font-size: 0.6rem !important; 
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}</style>

      {/* HEADER / NAVIGATION */}
      <header className="glass-nav header-container" style={{ padding: "0.8rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div className="nav-brand-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "32px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.25rem", fontWeight: 700, letterSpacing: "-0.02em", color: "#0F172A" }}>
            Pasar<span style={{ color: "var(--brand-green)" }}>Nusa</span>
          </span>
        </div>

        <nav className="nav-container" style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          <a href="#fitur" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, whiteSpace: "nowrap" }}>Fitur Utama</a>
          <a href="/rantai-pasok" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, whiteSpace: "nowrap" }}>Rantai Pasok</a>
          <a href="/mitra-umkm" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 500, whiteSpace: "nowrap" }}>Mitra Ekosistem</a>

          <Link href="/login" className="btn-masuk-portal btn-green" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1.15rem", borderRadius: "99px", fontSize: "0.82rem", fontWeight: 500, whiteSpace: "nowrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Portal
          </Link>
        </nav>
      </header>

      {/* HERO SECTION */}
      <section className="hero-section" style={{ minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "7.5rem 3rem 4rem" }}>
        {bgImages.map((img, index) => (
          <div key={index} style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: `linear-gradient(90deg, #FFFFFF 0%, rgba(255,255,255,0.96) 45%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0.05) 100%), url('${img}')`,
            backgroundSize: "cover", backgroundPosition: "center right", backgroundRepeat: "no-repeat",
            opacity: currentBg === index ? 1 : 0,
            transform: currentBg === index ? "scale(1.01)" : "scale(1.04)",
            transition: "opacity 2s ease-in-out, transform 6s ease",
          }} />
        ))}

        <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem", alignItems: "center" }}>
            <div className="fade-in" style={{ paddingRight: "0.5rem" }}>
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.41rem", padding: "0.25rem 0.8rem", borderRadius: "99px", background: "rgba(10, 77, 46, 0.08)", border: "1px solid rgba(10, 77, 46, 0.2)", color: "var(--brand-green)", fontSize: "0.7rem", fontWeight: 600, marginBottom: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-green)" }} />
                PLATFORM EKONOMI DIGITAL B2B
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 3.8vw, 3rem)", fontWeight: 800, color: "#0F172A", lineHeight: 1.2, marginBottom: "0.85rem", letterSpacing: "-0.02em" }}>
                Optimasi Rantai Pasok Pangan Terpadu dengan <br />
                <span className="green-highlight">Smart Supply Tracking</span>
              </h1>

              <p className="hero-desc" style={{ fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)", color: "#475569", marginBottom: "1.75rem", lineHeight: 1.6, fontWeight: 400, maxWidth: "540px" }}>
                PasarNusa menghubungkan sentra produksi komoditas langsung dengan jaringan distributor dan retail. Mewujudkan transparansi alur komoditas serta efisiensi harga secara real-time.
              </p>

              <div className="hero-btn-group" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Link href="/login" className="btn-green btn-green-hero" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.4rem", borderRadius: "8px", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Bergabung Sebagai Mitra
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              </div>
            </div>

            <div style={{ display: "block" }} />
          </div>
        </div>
      </section>

      {/* STATISTIK SECTION */}
      <section className="stats-section" ref={statsRef} style={{ padding: "0 2rem", marginTop: "-2.5rem", position: "relative", zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
          
          {/* Statistik 1 */}
          <div className="glass-stat" style={{ padding: "1.1rem 1.35rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0" }}>
            <div className="icon-box" style={{ background: "var(--brand-green)", padding: "0.65rem", borderRadius: "0.5rem", color: "#FFFFFF", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1 }}>
                {produsenCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 400, marginTop: "0.2rem" }}>
                Produsen Terverifikasi
              </div>
            </div>
          </div>

          {/* Statistik 2 */}
          <div className="glass-stat" style={{ padding: "1.1rem 1.35rem", borderRadius: "0.75rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 4px 20px rgba(0,0,0,0.04)", border: "1px solid #E2E8F0" }}>
            <div className="icon-box" style={{ background: "var(--brand-green)", padding: "0.65rem", borderRadius: "0.5rem", color: "#FFFFFF", flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.35rem", fontWeight: 700, color: "#0F172A", lineHeight: 1.1 }}>
                {tokoCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.75rem", color: "#64748B", fontWeight: 400, marginTop: "0.2rem" }}>
                Jaringan Toko &amp; Mitra Terintegrasi
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* FITUR UTAMA SECTION */}
      <section id="fitur" className="features-section" style={{ padding: "4.5rem 2rem", background: "#F8FAFC", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0", marginTop: "3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.2rem" }}>
            <span style={{ color: "var(--brand-green)", fontWeight: 700, fontSize: "0.75rem", letterSpacing: "0.1em", textTransform: "uppercase" }}>Arsitektur Sistem</span>
            <h2 style={{ fontSize: "clamp(1.2rem, 2.8vw, 2rem)", fontWeight: 700, color: "#0F172A", letterSpacing: "-0.02em", marginTop: "0.3rem" }}>Integrasi Rantai Pasok Dari Hulu ke Hilir</h2>
            <p style={{ color: "#64748B", fontSize: "0.85rem", maxWidth: "580px", margin: "0.3rem auto 0", lineHeight: 1.5, fontWeight: 400 }}>
              Menghubungkan setiap entitas ekosistem dalam satu alur data terpadu untuk efisiensi maksimal.
            </p>
          </div>

          <div className="features-grid no-scrollbar" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {fitur.map((f, i) => (
              <div key={i} className="green-translucent-card">
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div className="icon-wrapper" style={{ background: f.soft, padding: "0.4rem", borderRadius: "8px", color: f.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {f.icon}
                    </div>
                    <span className="layer-badge" style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.05em", textTransform: "uppercase", color: f.accent, background: f.soft, padding: "0.15rem 0.5rem", borderRadius: "99px" }}>
                      {f.layer}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.4rem" }}>{f.title}</h3>
                </div>

                <p style={{ color: "#475569", lineHeight: 1.5, fontSize: "0.82rem", margin: 0, fontWeight: 400 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section" style={{ padding: "3.5rem 1rem 4rem", background: "#F8FAFC" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            position: "relative",
            borderRadius: "1rem",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0A3A22 0%, #062317 60%, #0F172A 100%)",
            padding: "2.5rem 1.5rem",
            boxShadow: "0 15px 30px rgba(10, 77, 46, 0.2)",
            border: "1px solid rgba(22, 163, 74, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.8rem",
              borderRadius: "99px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(4px)",
              color: "#4ADE80",
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
              border: "1px solid rgba(255, 255, 255, 0.12)"
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ADE80" }} />
              Bergabung Bersama Kami
            </span>

            <h2 style={{ fontSize: "clamp(1.25rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.02em", lineHeight: 1.25, maxWidth: "700px", marginBottom: "0.6rem" }}>
              Tingkatkan Efisiensi Distribusi Komoditas Pangan Nasional
            </h2>

            <p style={{ color: "#CBD5E1", fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)", maxWidth: "580px", lineHeight: 1.5, marginBottom: "1.5rem", fontWeight: 400 }}>
              Daftarkan usaha Anda dan menjadi bagian dari rantai pasok digital yang transparan dan terukur.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              <Link href="/login" style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.35rem",
                borderRadius: "8px",
                background: "#16A34A",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontWeight: 600,
                boxShadow: "0 4px 14px rgba(22, 163, 74, 0.3)"
              }}>
                Akses Platform
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-section" style={{ background: "#061F15", color: "#94A3B8", paddingTop: "2.5rem", paddingBottom: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.25rem" }}>
          <div className="footer-main-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="footer-brand-area" style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img src="/logo.png" alt="PasarNusa" style={{ height: "24px", width: "auto", borderRadius: "4px" }} />
                <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                  Pasar<span style={{ color: "#22C55E" }}>Nusa</span>
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.5, color: "#94A3B8", margin: 0, fontWeight: 400 }}>
                Platform ekosistem rantai pasok digital komoditas pangan untuk efisiensi distribusi nasional.
              </p>
            </div>

            <div className="footer-nav-links" style={{ display: "flex", alignItems: "center", gap: "1.8rem", fontSize: "0.82rem", fontWeight: 500, flexShrink: 0 }}>
              <a href="/tentang-kami" className="footer-link">Tentang Kami</a>
              <a href="/pusat-bantuan" className="footer-link">Pusat Bantuan</a>
              <a href="/privasi" className="footer-link">Kebijakan Privasi</a>
            </div>
          </div>

          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.72rem", color: "#64748B", textTransform: "none" }}>
            <span>© 2026 <strong style={{ color: "#CBD5E1", fontWeight: 500 }}>PasarNusa Indonesia</strong>. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}