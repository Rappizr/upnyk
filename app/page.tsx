'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";

function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf: number;
    const startTime = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.round(eased * target));
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, target, durationMs]);
  return value;
}

export default function LandingPage() {
  const bgImages = [
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1920&q=80"
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);

  // Top-level hooks
  const produsenCount = useCountUp(1250, 1800, statsVisible);
  const tokoCount = useCountUp(480, 1800, statsVisible);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

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

  const fitur = [
    {
      layer: "Hulu / Supply",
      accent: "#0A4D2E",
      soft: "#E8F5E9",
      title: "Portal Konsolidasi Produsen",
      desc: "Fitur pencatatan hasil panen, monitor indeks harga komoditas secara objektif, serta manajemen klaim pencairan dana otomatis.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
      )
    },
    {
      layer: "Logistik / Hub",
      accent: "#D98A2B",
      soft: "#FBF0DF",
      title: "Sistem Manajemen Distribusi",
      desc: "Modul pengawasan inventoris toko, optimasi rute armada pengiriman, dan rekomendasi restock otomatis berbasis histori permintaan.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9"/><path d="M9 14h6"/></svg>
      )
    },
    {
      layer: "Hilir / Demand",
      accent: "#0E7490",
      soft: "#E1F1F4",
      title: "Katalog B2B & Transaksi Terproteksi",
      desc: "Kemudahan pengadaan komoditas langsung dari daerah asal dengan kepastian ketersediaan barang dan sistem jaminan pembayaran.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      )
    }
  ];

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-sans), system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden", scrollBehavior: "smooth" }}>

      <style dangerouslySetInnerHTML={{__html: `
        .pn-root {
          --ink: #0F172A;
          --paper: #F8FAFC;
          --card: #FFFFFF;
          --line: #E2E8F0;
          --muted: #475569;
          --forest-dark: #062317;
          --brand-green: #0A4D2E;
          --brand-green-hover: #073822;
          --accent-green: #16A34A;
          --harvest: #D97706;
          --teal: #0E7490;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(255, 255, 255, 0.95)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'blur(12px)' : 'none'};
          border-bottom: ${isScrolled ? '1px solid rgba(15, 23, 42, 0.08)' : '1px solid transparent'};
          box-shadow: ${isScrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none'};
          transition: all 0.3s ease-in-out;
        }

        .nav-link {
          color: var(--ink);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-link:hover { color: var(--brand-green); }

        .footer-link {
          color: #94A3B8;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .footer-link:hover {
          color: #22C55E;
        }

        .green-highlight {
          color: var(--brand-green);
          font-style: italic;
          font-weight: 800;
        }

        .modern-card {
          position: relative;
          background: var(--card);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid var(--line);
          overflow: hidden;
        }
        .modern-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: var(--card-accent);
        }

        .glass-stat {
          background: var(--card);
          border: 1px solid var(--line);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }

        .btn-green {
          background-color: var(--brand-green);
          color: #FFFFFF;
          transition: all 0.25s ease;
          box-shadow: 0 8px 20px -4px rgba(10, 77, 46, 0.4);
        }
        .btn-green:hover {
          background-color: var(--brand-green-hover);
          transform: translateY(-1px);
        }

        .fade-in { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        /* Hide scrollbar */
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        /* PENYESUAIAN TAMPILAN HP (RESPONSIVE) */
        @media (max-width: 768px) {
          /* HEADER DI HP */
          .header-container { padding: 0.35rem 0.5rem !important; }
          .nav-brand-group { gap: 0.25rem !important; }
          .nav-logo-img { height: 18px !important; }
          .nav-logo-text { font-size: 0.72rem !important; }
          .nav-container { gap: 0.2rem !important; }
          .nav-link-desktop { font-size: 0.55rem !important; }
          .btn-masuk-portal { padding: 0.25rem 0.45rem !important; font-size: 0.55rem !important; border-radius: 99px !important; }
          .btn-masuk-portal svg { width: 10px !important; height: 10px !important; }

          .hero-section { padding: 3.5rem 0.6rem 1.5rem !important; min-height: auto !important; text-align: center !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .hero-badge { font-size: 0.52rem !important; padding: 0.15rem 0.4rem !important; margin: 0 auto 0.4rem auto !important; }
          .hero-title { font-size: 1.25rem !important; line-height: 1.2 !important; margin-bottom: 0.5rem !important; }
          .hero-desc { font-size: 0.68rem !important; margin: 0 auto 0.85rem auto !important; line-height: 1.35 !important; }
          .hero-btn-group { justify-content: center !important; margin-bottom: 0 !important; }
          .btn-green-hero { padding: 0.45rem 0.85rem !important; font-size: 0.7rem !important; }

          /* STATISTIK HP */
          .stats-section { padding: 0 0.5rem !important; margin-top: -0.25rem !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.4rem !important; }
          .glass-stat { padding: 0.45rem 0.35rem !important; gap: 0.3rem !important; border-radius: 0.5rem !important; }
          .glass-stat .icon-box { padding: 0.3rem !important; border-radius: 0.35rem !important; }
          .glass-stat svg { width: 13px !important; height: 13px !important; }
          .glass-stat .stat-number { font-size: 0.85rem !important; }
          .glass-stat .stat-label { font-size: 0.52rem !important; line-height: 1.1 !important; margin-top: 0.1rem !important; }

          /* FITUR HP */
          .features-section { padding: 1.8rem 0.4rem !important; }
          .features-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.35rem !important; }
          .modern-card { padding: 0.55rem 0.35rem !important; border-radius: 0.45rem !important; }
          .modern-card h3 { font-size: 0.65rem !important; margin-bottom: 0.2rem !important; line-height: 1.2 !important; }
          .modern-card p { font-size: 0.55rem !important; line-height: 1.2 !important; }
          .modern-card .layer-tag { font-size: 0.45rem !important; padding: 0.08rem 0.25rem !important; }
          .modern-card .icon-fitur { width: 22px !important; height: 22px !important; border-radius: 5px !important; }
          .modern-card .icon-fitur svg { width: 11px !important; height: 11px !important; }

          /* FOOTER PRO HP */
          .footer-section { padding-top: 1.5rem !important; padding-bottom: 1.2rem !important; }
          .footer-main-container {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 1.25rem !important;
          }
          .footer-brand-area {
            align-items: center !important;
          }
          .footer-brand-area p {
            margin: 0.4rem auto 0 auto !important;
          }
          .footer-nav-links {
            gap: 1.25rem !important;
          }
          .footer-bottom { 
            padding-top: 0.8rem !important; 
            font-size: 0.65rem !important; 
            justify-content: center !important;
            text-align: center !important;
          }
        }
      `}} />

   
      <header className="glass-nav header-container" style={{ padding: "0.9rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div className="nav-brand-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "34px", width: "auto", objectFit: "contain", borderRadius: "6px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink)" }}>
            Pasar<span style={{ color: "var(--brand-green)" }}>Nusa</span>
          </span>
        </div>

        <nav className="nav-container" style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          <a href="#fitur" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap" }}>Fitur Utama</a>
          <a href="/rantai-pasok" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap" }}>Rantai Pasok</a>
          <a href="/mitra-umkm" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.9rem", fontWeight: 600, whiteSpace: "nowrap" }}>Mitra Ekosistem</a>

          <Link href="/login" className="btn-masuk-portal btn-green" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.55rem 1.25rem", borderRadius: "99px", fontSize: "0.85rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Portal
          </Link>
        </nav>
      </header>

    
      <section className="hero-section" style={{ minHeight: "90vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "7.5rem 3rem 4rem" }}>
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
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.41rem", padding: "0.28rem 0.9rem", borderRadius: "99px", background: "rgba(10, 77, 46, 0.09)", border: "1px solid rgba(10, 77, 46, 0.3)", color: "var(--brand-green)", fontSize: "0.72rem", fontWeight: 800, marginBottom: "1rem", letterSpacing: "0.06em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-green)" }} />
                PLATFORM EKONOMI DIGITAL B2B
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 900, color: "#0F172A", lineHeight: 1.15, marginBottom: "1rem", letterSpacing: "-0.03em" }}>
                Optimasi Rantai Pasok Pangan Terpadu dengan <br />
                <span className="green-highlight">Smart Supply Tracking</span>
              </h1>

              <p className="hero-desc" style={{ fontSize: "clamp(0.85rem, 1.4vw, 0.98rem)", color: "#334155", marginBottom: "1.75rem", lineHeight: 1.6, fontWeight: 500, maxWidth: "540px" }}>
                PasarNusa menghubungkan sentra produksi komoditas langsung dengan jaringan distributor dan retail. Mewujudkan transparansi alur komoditas serta efisiensi harga secara real-time.
              </p>

              <div className="hero-btn-group" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Link href="/login" className="btn-green btn-green-hero" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.75rem 1.6rem", borderRadius: "8px", fontSize: "0.9rem", fontWeight: 700, whiteSpace: "nowrap" }}>
                  Bergabung Sebagai Mitra
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              </div>
            </div>

            <div style={{ display: "block" }} />
          </div>
        </div>
      </section>

      
      <section className="stats-section" ref={statsRef} style={{ padding: "0 2rem", marginTop: "-2.5rem", position: "relative", zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>
          
          <div className="glass-stat" style={{ padding: "1.25rem 1.5rem", borderRadius: "0.85rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06)", border: "1px solid #CBD5E1", background: "#FFFFFF" }}>
            <div className="icon-box" style={{ background: "#E8F5E9", padding: "0.75rem", borderRadius: "0.6rem", color: "var(--brand-green)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
                {produsenCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 600, marginTop: "0.25rem" }}>
                Produsen Terverifikasi
              </div>
            </div>
          </div>

          <div className="glass-stat" style={{ padding: "1.25rem 1.5rem", borderRadius: "0.85rem", display: "flex", alignItems: "center", gap: "1rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.06)", border: "1px solid #CBD5E1", background: "#FFFFFF" }}>
            <div className="icon-box" style={{ background: "#FBF0DF", padding: "0.75rem", borderRadius: "0.6rem", color: "var(--harvest)", flexShrink: 0 }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.45rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.1 }}>
                {tokoCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.78rem", color: "#475569", fontWeight: 600, marginTop: "0.25rem" }}>
                Jaringan Toko &amp; Mitra Terintegrasi
              </div>
            </div>
          </div>

        </div>
      </section>

   
      <section id="fitur" className="features-section" style={{ padding: "5rem 2rem", background: "var(--paper)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <span style={{ color: "var(--brand-green)", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Arsitektur Sistem</span>
            <h2 style={{ fontSize: "clamp(1.2rem, 3vw, 2.2rem)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "0.4rem" }}>Integrasi Rantai Pasok Dari Hulu ke Hilir</h2>
            <p style={{ color: "var(--muted)", fontSize: "0.85rem", maxWidth: "600px", margin: "0.4rem auto 0", lineHeight: 1.5 }}>
              Menghubungkan setiap entitas ekosistem dalam satu alur data terpadu untuk efisiensi maksimal.
            </p>
          </div>

          <div className="features-grid no-scrollbar" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {fitur.map((f, i) => (
              <div key={i} className="modern-card" style={{ padding: "1.75rem 1.25rem", borderRadius: "0.85rem", ["--card-accent" as any]: f.accent }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                  <div className="icon-fitur" style={{ background: f.soft, width: "44px", height: "44px", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", color: f.accent, flexShrink: 0 }}>
                    {f.icon}
                  </div>
                  <span className="layer-tag" style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.05em", textTransform: "uppercase", color: f.accent, background: f.soft, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>{f.layer}</span>
                </div>
                <h3 style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--ink)", marginBottom: "0.5rem" }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.5, fontSize: "0.85rem", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ padding: "3rem 1rem 4rem", background: "var(--paper)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            position: "relative",
            borderRadius: "1.25rem",
            overflow: "hidden",
            background: "linear-gradient(135deg, #0A3A22 0%, #062317 60%, #0F172A 100%)",
            padding: "2.5rem 1.5rem",
            boxShadow: "0 20px 40px -15px rgba(10, 77, 46, 0.3)",
            border: "1px solid rgba(22, 163, 74, 0.2)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <span style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "0.5rem",
              padding: "0.3rem 0.9rem",
              borderRadius: "99px",
              background: "rgba(255, 255, 255, 0.1)",
              backdropFilter: "blur(4px)",
              color: "#4ADE80",
              fontSize: "0.75rem",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "1rem",
              border: "1px solid rgba(255, 255, 255, 0.15)"
            }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80" }} />
              Bergabung Bersama Kami
            </span>

            <h2 style={{ fontSize: "clamp(1.3rem, 3.5vw, 2.6rem)", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.25, maxWidth: "720px", marginBottom: "0.75rem" }}>
              Tingkatkan Efisiensi Distribusi Komoditas Pangan Nasional
            </h2>

            <p style={{ color: "#CBD5E1", fontSize: "clamp(0.75rem, 1.3vw, 1.05rem)", maxWidth: "600px", lineHeight: 1.5, marginBottom: "1.75rem", fontWeight: 400 }}>
              Daftarkan usaha Anda dan menjadi bagian dari rantai pasok digital yang transparan dan terukur.
            </p>

            <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              <Link href="/login" style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.65rem 1.5rem",
                borderRadius: "10px",
                background: "#16A34A",
                color: "#FFFFFF",
                fontSize: "0.85rem",
                fontWeight: 800,
                boxShadow: "0 8px 20px rgba(22, 163, 74, 0.4)"
              }}>
                Akses Platform
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

    
      <footer className="footer-section" style={{ background: "#061F15", color: "#94A3B8", paddingTop: "2.5rem", paddingBottom: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.25rem" }}>
          
          <div className="footer-main-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            
          
            <div className="footer-brand-area" style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                <img src="/logo.png" alt="PasarNusa" style={{ height: "26px", width: "auto", borderRadius: "4px" }} />
                <span style={{ fontSize: "1.15rem", fontWeight: 900, color: "#FFFFFF", letterSpacing: "-0.02em" }}>
                  Pasar<span style={{ color: "#22C55E" }}>Nusa</span>
                </span>
              </div>
              <p style={{ fontSize: "0.8rem", lineHeight: 1.5, color: "#94A3B8", margin: 0 }}>
                Platform ekosistem rantai pasok digital komoditas pangan untuk efisiensi distribusi nasional.
              </p>
            </div>

            <div className="footer-nav-links" style={{ display: "flex", alignItems: "center", gap: "2rem", fontSize: "0.85rem", fontWeight: 600 }}>
              <a href="/tentang-kami" className="footer-link">Tentang Kami</a>
              <a href="/pusat-bantuan" className="footer-link">Pusat Bantuan</a>
              <a href="/privasi" className="footer-link">Kebijakan Privasi</a>
            </div>

          </div>

      
          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.75rem", color: "#64748B", textTransform: "none" }}>
            <span>© 2026 <strong style={{ color: "#CBD5E1", fontWeight: 600 }}>PasarNusa Indonesia</strong>. All rights reserved.</span>
          </div>

        </div>
      </footer>
    </div>
  );
}