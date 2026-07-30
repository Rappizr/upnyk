'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";


function useCountUp(target: number, durationMs: number, start: boolean) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setValue(target);
      return;
    }
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
  
  const bgImages = [
    "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1615811361523-6bd03d7748e7?auto=format&fit=crop&w=1920&q=80"
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const [jsReady, setJsReady] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);


  const produsenCount = useCountUp(1250, 1800, statsVisible);
  const tokoCount = useCountUp(480, 1800, statsVisible);

  useEffect(() => setJsReady(true), []);


  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timer: ReturnType<typeof setInterval>;
    const run = () => {
      clearInterval(timer);
      if (document.visibilityState === "visible") {
        timer = setInterval(() => {
          setCurrentBg((prev) => (prev + 1) % bgImages.length);
        }, 6000);
      }
    };
    run();
    document.addEventListener("visibilitychange", run);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", run);
    };
  }, [bgImages.length]);


  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

 
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

 
  useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"));
    if (!nodes.length) return;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("is-in"); io.unobserve(e.target); }
      }),
      { threshold: 0.15, rootMargin: "0px 0px -30px 0px" }
    );
    nodes.forEach((n) => io.observe(n));
    return () => io.disconnect();
  }, []);


  const fitur = [
    {
      layer: "Hulu",
      accent: "#0A4D2E", 
      soft: "rgba(10, 77, 46, 0.09)",
      title: "Portal Konsolidasi Produsen",
      desc: "Fitur pencatatan hasil panen, monitor indeks harga komoditas secara objektif, serta manajemen klaim pencairan dana otomatis.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
      )
    },
    {
      layer: "Logistik",
      accent: "#B45309", 
      soft: "rgba(180, 83, 9, 0.09)",
      title: "Sistem Manajemen Distribusi",
      desc: "Modul pengawasan inventoris toko, optimasi rute armada pengiriman, dan rekomendasi restock otomatis berbasis histori permintaan.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9"/><path d="M9 14h6"/></svg>
      )
    },
    {
      layer: "Hilir",
      accent: "#0E6E80", 
      soft: "rgba(14, 110, 128, 0.09)",
      title: "Katalog B2B & Transaksi",
      desc: "Kemudahan pengadaan komoditas langsung dari daerah asal dengan kepastian ketersediaan barang dan sistem jaminan pembayaran.",
      icon: (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      )
    }
  ];

  return (
    <div className={`pn-root${jsReady ? " js-ready" : ""}`} style={{ minHeight: "100vh", background: "#F6F8F5", fontFamily: "var(--font-sans), system-ui, -apple-system, sans-serif", color: "#101C16", overflowX: "hidden", scrollBehavior: "smooth" }}>

    
      <style>{`
        .pn-root {
          --brand-green: #0A4D2E;
          --brand-green-hover: #06301C;
          --brand-green-lift: #0F6337;
          --ink: #101C16;
          --ink-body: #47554C;
          --ink-muted: #6B7A70;
          --surface: #F6F8F5;
          --hairline: #E3EAE3;
        }

        /* Navbar Glassmorphism */
        .glass-nav {
          background: ${isScrolled ? 'rgba(252, 253, 252, 0.9)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          border-bottom: ${isScrolled ? '1px solid rgba(16, 28, 22, 0.07)' : '1px solid transparent'};
          box-shadow: ${isScrolled ? '0 6px 24px rgba(6, 40, 24, 0.06)' : 'none'};
          transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }

        .nav-link {
          color: var(--ink);
          transition: color 0.25s ease;
          cursor: pointer;
          position: relative;
        }
        .nav-link::after {
          content: "";
          position: absolute;
          left: 0; bottom: -3px;
          height: 2px; width: 0;
          background: var(--brand-green);
          border-radius: 2px;
          transition: width 0.28s cubic-bezier(0.16,1,0.3,1);
        }
        .nav-link:hover { color: var(--brand-green); }
        .nav-link:hover::after { width: 100%; }

        /* Footer Link */
        .footer-link {
          color: #A3BDB0;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        .footer-link:hover { color: #4ADE80; }

        /* Highlight Warna Hijau */
        .green-highlight {
          color: var(--brand-green);
          font-style: normal;
          font-weight: 800;
        }

        /* Kartu Fitur — putih bersih, identitas layer lewat garis aksen atas */
        .green-translucent-card {
          position: relative;
          overflow: hidden;
          background: #FFFFFF;
          border: 1px solid var(--hairline);
          border-radius: 12px;
          padding: 1.25rem 1rem;
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), box-shadow 0.32s ease, border-color 0.32s ease;
          box-shadow: 0 1px 2px rgba(6, 40, 24, 0.04), 0 8px 20px rgba(6, 40, 24, 0.04);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        .green-translucent-card::before {
          content: "";
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 3px;
          background: var(--accent, var(--brand-green));
          opacity: 0.85;
          transition: opacity 0.3s ease, height 0.3s ease;
        }
        .green-translucent-card:hover {
          transform: translateY(-3px);
          border-color: rgba(10, 77, 46, 0.22);
          box-shadow: 0 2px 4px rgba(6, 40, 24, 0.05), 0 16px 34px rgba(6, 40, 24, 0.10);
        }
        .green-translucent-card:hover::before { opacity: 1; height: 4px; }
        .green-translucent-card h3 { color: var(--ink); }
        .green-translucent-card p { color: var(--ink-body); }

        /* Kartu Statistik Putih */
        .glass-stat {
          background: #FFFFFF;
          border: 1px solid var(--hairline);
          box-shadow: 0 1px 2px rgba(6, 40, 24, 0.04), 0 10px 26px rgba(6, 40, 24, 0.05);
          transition: transform 0.32s cubic-bezier(0.16,1,0.3,1), box-shadow 0.32s ease;
        }
        .glass-stat:hover {
          transform: translateY(-3px);
          box-shadow: 0 2px 4px rgba(6, 40, 24, 0.05), 0 18px 34px rgba(6, 40, 24, 0.09);
        }
        .glass-stat .icon-box {
          background: linear-gradient(160deg, var(--brand-green-lift) 0%, var(--brand-green) 100%);
          box-shadow: 0 4px 12px rgba(10, 77, 46, 0.22);
        }
        .glass-stat .stat-number {
          color: var(--ink);
          font-variant-numeric: tabular-nums;
          letter-spacing: -0.02em;
        }
        .glass-stat .stat-label { color: var(--ink-muted); }

        /* Tombol Utama Hijau */
        .btn-green {
          background: linear-gradient(180deg, var(--brand-green-lift) 0%, var(--brand-green) 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255, 255, 255, 0.14);
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
          box-shadow: 0 6px 18px rgba(10, 77, 46, 0.26), inset 0 1px 0 rgba(255, 255, 255, 0.12);
        }
        .btn-green:hover {
          filter: brightness(1.08);
          transform: translateY(-1px);
          box-shadow: 0 10px 24px rgba(10, 77, 46, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.14);
        }
        .btn-green:active { transform: translateY(0) scale(0.985); }

        .btn-emerald {
          background: linear-gradient(180deg, #22C55E 0%, #16A34A 100%);
          border: 1px solid rgba(255, 255, 255, 0.18);
          box-shadow: 0 8px 22px rgba(22, 163, 74, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.18);
          transition: transform 0.22s ease, box-shadow 0.22s ease, filter 0.22s ease;
        }
        .btn-emerald:hover { filter: brightness(1.07); transform: translateY(-1px); }
        .btn-emerald:active { transform: translateY(0) scale(0.985); }

        /* Fokus keyboard terlihat di semua elemen interaktif */
        .pn-root a:focus-visible,
        .pn-root button:focus-visible {
          outline: 2px solid #16A34A;
          outline-offset: 3px;
          border-radius: 6px;
        }

        /* Lapisan foto hero — tiga foto stok disatukan jadi satu nada warna */
        .hero-photo {
          position: absolute;
          inset: 0;
          background-size: cover;
          background-repeat: no-repeat;
          background-position: center right;
          filter: saturate(0.72) contrast(1.06) brightness(1.02);
          transition: opacity 2s ease-in-out, transform 6s ease;
        }
        /* Kerudung kontras — menjamin teks selalu duduk di bidang terang */
        .hero-section::before {
          content: "";
          position: absolute;
          inset: 0;
          z-index: 1;
          pointer-events: none;
          background:
            linear-gradient(96deg,
              #F6F8F5 0%,
              rgba(246, 248, 245, 0.97) 42%,
              rgba(246, 248, 245, 0.70) 66%,
              rgba(246, 248, 245, 0.18) 88%,
              rgba(10, 77, 46, 0.10) 100%),
            linear-gradient(180deg, rgba(246, 248, 245, 0.55) 0%, transparent 22%);
        }
        .hero-section::after {
          content: "";
          position: absolute;
          left: 0; right: 0; bottom: 0;
          height: 120px;
          z-index: 1;
          pointer-events: none;
          background: linear-gradient(180deg, transparent 0%, var(--surface) 92%);
        }

        .hero-badge { backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px); }

        /* Titik indikator slide */
        .hero-dots { display: flex; gap: 0.4rem; }
        .hero-dots button {
          height: 3px; width: 18px; padding: 0; border: 0;
          border-radius: 99px; cursor: pointer;
          background: rgba(16, 28, 22, 0.18);
          transition: width 0.3s ease, background 0.3s ease;
        }
        .hero-dots button.is-active { width: 34px; background: var(--brand-green); }

        /* Animasi Fade In Up */
        .fade-in { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        /* Reveal saat scroll — baru aktif kalau JS hidup */
        .js-ready [data-reveal] { opacity: 0; transform: translateY(12px); }
        .js-ready [data-reveal].is-in {
          opacity: 1;
          transform: none;
          transition: opacity 0.6s cubic-bezier(0.16,1,0.3,1), transform 0.6s cubic-bezier(0.16,1,0.3,1);
          transition-delay: var(--d, 0ms);
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

          /* ====== TAMBAHAN VISUAL SAJA — ukuran & susunan di atas tidak diubah ====== */

          /* Di HP teks memenuhi lebar layar, jadi kerudungnya vertikal.
             Ini yang bikin paragraf hero tidak lagi tenggelam di foto gudang. */
          .hero-section::before {
            background:
              linear-gradient(180deg,
                #F6F8F5 0%,
                rgba(246, 248, 245, 0.98) 46%,
                rgba(246, 248, 245, 0.88) 72%,
                rgba(246, 248, 245, 0.62) 100%) !important;
          }
          .hero-section::after { height: 70px !important; }

          /* Label nav 0.55rem sekarang duduk di atas bidang putih pekat
             (lihat gradient di atas), jadi tidak perlu alas tambahan —
             cukup dinaikkan ketegasannya lewat warna, bukan lewat ukuran. */
          .nav-link-desktop { color: #14261C !important; }

          /* Jarak sebelum "ARSITEKTUR SISTEM" dirapatkan — marginTop 3rem
             dari inline style ditimpa di sini, jadi kartu fitur naik ±60px
             dan tidak terpotong batas layar. */
          .features-section {
            background: var(--surface) !important;
            margin-top: 0.75rem !important;
            padding-top: 1.5rem !important;
          }
          .features-section > div > div:first-child {
            margin-bottom: 1.4rem !important;
          }
          .green-translucent-card::before { height: 2px; }
          .green-translucent-card:hover::before { height: 3px; }
          .green-translucent-card p { color: #3F4D45 !important; }
          .glass-stat .stat-label { color: #5C6B62 !important; }
          .hero-dots button { height: 2px; width: 14px; }
          .hero-dots button.is-active { width: 26px; }
        }

        /* Hormati preferensi kurangi animasi */
        @media (prefers-reduced-motion: reduce) {
          .pn-root *, .pn-root *::before, .pn-root *::after {
            animation-duration: 0.001ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001ms !important;
          }
          .js-ready [data-reveal] { opacity: 1; transform: none; }
          .hero-photo { transform: none !important; }
        }
      `}</style>

     
      <header className={`glass-nav header-container${isScrolled ? " is-scrolled" : ""}`} style={{ padding: "0.8rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div className="nav-brand-group" style={{ display: "flex", alignItems: "center", gap: "0.5rem", flexShrink: 0 }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "32px", width: "auto", objectFit: "contain", borderRadius: "4px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.25rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            Pasar<span style={{ color: "var(--brand-green)" }}>Nusa</span>
          </span>
        </div>

        <nav className="nav-container" style={{ display: "flex", alignItems: "center", gap: "1.8rem" }}>
          <a href="#fitur" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}>Fitur Utama</a>
          <a href="/rantai-pasok" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}>Rantai Pasok</a>
          <a href="/mitra-umkm" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}>Mitra Ekosistem</a>

          <Link href="/login" className="btn-masuk-portal btn-green" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.35rem", padding: "0.5rem 1.15rem", borderRadius: "99px", fontSize: "0.82rem", fontWeight: 600, whiteSpace: "nowrap" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Portal
          </Link>
        </nav>
      </header>

     
      <section className="hero-section" style={{ minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", padding: "7.5rem 3rem 4rem" }}>
        {bgImages.map((img, index) => (
          <div key={index} className="hero-photo" style={{
            backgroundImage: `url('${img}')`,
            opacity: currentBg === index ? 1 : 0,
            transform: currentBg === index ? "scale(1.01)" : "scale(1.05)",
          }} />
        ))}

        <div style={{ maxWidth: "1280px", width: "100%", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <div className="hero-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 0.9fr", gap: "2rem", alignItems: "center" }}>
            <div className="fade-in" style={{ paddingRight: "0.5rem" }}>
              <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.41rem", padding: "0.25rem 0.8rem", borderRadius: "99px", background: "rgba(10, 77, 46, 0.07)", border: "1px solid rgba(10, 77, 46, 0.22)", color: "var(--brand-green)", fontSize: "0.7rem", fontWeight: 700, marginBottom: "0.9rem", letterSpacing: "0.08em", textTransform: "uppercase" }}>
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--brand-green)" }} />
                PLATFORM EKONOMI DIGITAL B2B
              </div>

              <h1 className="hero-title" style={{ fontSize: "clamp(1.8rem, 3.8vw, 3rem)", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2, marginBottom: "0.85rem", letterSpacing: "-0.03em" }}>
                Optimasi Rantai Pasok Pangan Terpadu dengan <br />
                <span className="green-highlight">Smart Supply Tracking</span>
              </h1>

              <p className="hero-desc" style={{ fontSize: "clamp(0.85rem, 1.3vw, 0.95rem)", color: "var(--ink-body)", marginBottom: "1.75rem", lineHeight: 1.65, fontWeight: 400, maxWidth: "540px" }}>
                PasarNusa menghubungkan sentra produksi komoditas langsung dengan jaringan distributor dan retail. Mewujudkan transparansi alur komoditas serta efisiensi harga secara real-time.
              </p>

              <div className="hero-btn-group" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                <Link href="/login" className="btn-green btn-green-hero" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.7rem 1.4rem", borderRadius: "10px", fontSize: "0.88rem", fontWeight: 600, whiteSpace: "nowrap" }}>
                  Bergabung Sebagai Mitra
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
                </Link>
              </div>

              <div className="hero-dots" role="tablist" aria-label="Ganti latar" style={{ marginTop: "1.6rem" }}>
                {bgImages.map((img, index) => (
                  <button
                    key={index}
                    role="tab"
                    aria-selected={currentBg === index}
                    aria-label={`Latar ${index + 1}`}
                    className={currentBg === index ? "is-active" : ""}
                    onClick={() => setCurrentBg(index)}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: "block" }} />
          </div>
        </div>
      </section>

   
      <section className="stats-section" ref={statsRef} style={{ padding: "0 2rem", marginTop: "-2.5rem", position: "relative", zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: "800px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1.25rem" }}>

      
          <div className="glass-stat" data-reveal style={{ padding: "1.1rem 1.35rem", borderRadius: "0.85rem", display: "flex", alignItems: "center", gap: "1rem" }}>
            <div className="icon-box" style={{ padding: "0.65rem", borderRadius: "0.6rem", color: "#FFFFFF", flexShrink: 0, display: "flex" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.35rem", fontWeight: 800, lineHeight: 1.1 }}>
                {produsenCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 500, marginTop: "0.2rem" }}>
                Produsen Terverifikasi
              </div>
            </div>
          </div>

    
          <div className="glass-stat" data-reveal style={{ padding: "1.1rem 1.35rem", borderRadius: "0.85rem", display: "flex", alignItems: "center", gap: "1rem", "--d": "90ms" } as React.CSSProperties}>
            <div className="icon-box" style={{ padding: "0.65rem", borderRadius: "0.6rem", color: "#FFFFFF", flexShrink: 0, display: "flex" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m2 7 4.41-4.41A2 2 0 0 1 7.83 2h8.34a2 2 0 0 1 1.42.59L22 7" />
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                <path d="M15 22v-4a2 2 0 0 0-2-2h-2a2 2 0 0 0-2 2v4" />
                <path d="M2 7h20" />
              </svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.35rem", fontWeight: 800, lineHeight: 1.1 }}>
                {tokoCount.toLocaleString("id-ID")}+
              </div>
              <div className="stat-label" style={{ fontSize: "0.75rem", fontWeight: 500, marginTop: "0.2rem" }}>
                Jaringan Toko &amp; Mitra Terintegrasi
              </div>
            </div>
          </div>

        </div>
      </section>

     
      <section id="fitur" className="features-section" style={{ padding: "4.5rem 2rem", background: "var(--surface)", borderTop: "1px solid var(--hairline)", borderBottom: "1px solid var(--hairline)", marginTop: "3rem" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "2.2rem" }} data-reveal>
            <span style={{ color: "var(--brand-green)", fontWeight: 800, fontSize: "0.75rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Arsitektur Sistem</span>
            <h2 style={{ fontSize: "clamp(1.2rem, 2.8vw, 2rem)", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "0.35rem" }}>Integrasi Rantai Pasok Dari Hulu ke Hilir</h2>
            <p style={{ color: "var(--ink-muted)", fontSize: "0.85rem", maxWidth: "580px", margin: "0.45rem auto 0", lineHeight: 1.6, fontWeight: 400 }}>
              Menghubungkan setiap entitas ekosistem dalam satu alur data terpadu untuk efisiensi maksimal.
            </p>
          </div>

          <div className="features-grid no-scrollbar" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem" }}>
            {fitur.map((f, i) => (
              <div
                key={i}
                className="green-translucent-card"
                data-reveal
                style={{ "--accent": f.accent, "--d": `${i * 90}ms` } as React.CSSProperties}
              >
                <div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                    <div className="icon-wrapper" style={{ background: f.soft, padding: "0.4rem", borderRadius: "8px", color: f.accent, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      {f.icon}
                    </div>
                    <span className="layer-badge" style={{ fontSize: "0.6rem", fontWeight: 800, letterSpacing: "0.07em", textTransform: "uppercase", color: f.accent, background: f.soft, padding: "0.15rem 0.5rem", borderRadius: "99px" }}>
                      {f.layer}
                    </span>
                  </div>

                  <h3 style={{ fontSize: "1rem", fontWeight: 700, marginBottom: "0.4rem", letterSpacing: "-0.015em" }}>{f.title}</h3>
                </div>

                <p style={{ lineHeight: 1.55, fontSize: "0.82rem", margin: 0, fontWeight: 400 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-section" style={{ padding: "3.5rem 1rem 4rem", background: "var(--surface)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div data-reveal style={{
            position: "relative",
            borderRadius: "1.15rem",
            overflow: "hidden",
            background: "radial-gradient(125% 125% at 12% 0%, #12633B 0%, #0A3A22 46%, #051B11 100%)",
            padding: "2.5rem 1.5rem",
            boxShadow: "0 20px 44px rgba(6, 40, 24, 0.24)",
            border: "1px solid rgba(74, 222, 128, 0.18)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center"
          }}>
            <span aria-hidden="true" style={{
              position: "absolute", right: "-14%", bottom: "-44%",
              width: "68%", aspectRatio: "1",
              background: "radial-gradient(circle, rgba(74,222,128,0.18), transparent 66%)",
              pointerEvents: "none"
            }} />

            <span style={{
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              gap: "0.4rem",
              padding: "0.25rem 0.8rem",
              borderRadius: "99px",
              background: "rgba(255, 255, 255, 0.08)",
              backdropFilter: "blur(4px)",
              color: "#4ADE80",
              fontSize: "0.7rem",
              fontWeight: 700,
              letterSpacing: "0.09em",
              textTransform: "uppercase",
              marginBottom: "0.85rem",
              border: "1px solid rgba(255, 255, 255, 0.14)"
            }}>
              <span style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#4ADE80" }} />
              Bergabung Bersama Kami
            </span>

            <h2 style={{ position: "relative", fontSize: "clamp(1.25rem, 3vw, 2.2rem)", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em", lineHeight: 1.25, maxWidth: "700px", marginBottom: "0.6rem" }}>
              Tingkatkan Efisiensi Distribusi Komoditas Pangan Nasional
            </h2>

            <p style={{ position: "relative", color: "#C7D6CC", fontSize: "clamp(0.75rem, 1.2vw, 0.95rem)", maxWidth: "580px", lineHeight: 1.6, marginBottom: "1.5rem", fontWeight: 400 }}>
              Daftarkan usaha Anda dan menjadi bagian dari rantai pasok digital yang transparan dan terukur.
            </p>

            <div style={{ position: "relative", display: "flex", gap: "1rem", flexWrap: "wrap", justifyContent: "center", alignItems: "center" }}>
              <Link href="/login" className="btn-emerald" style={{
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.5rem",
                padding: "0.6rem 1.35rem",
                borderRadius: "10px",
                color: "#FFFFFF",
                fontSize: "0.82rem",
                fontWeight: 600
              }}>
                Akses Platform
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-section" style={{ background: "#051B11", color: "#A3BDB0", paddingTop: "2.5rem", paddingBottom: "2rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 1.25rem" }}>
          <div className="footer-main-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "nowrap", gap: "1.5rem", marginBottom: "2rem" }}>
            <div className="footer-brand-area" style={{ display: "flex", flexDirection: "column", gap: "0.35rem", maxWidth: "420px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <img src="/logo.png" alt="PasarNusa" style={{ height: "24px", width: "auto", borderRadius: "4px" }} />
                <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF", letterSpacing: "-0.03em" }}>
                  Pasar<span style={{ color: "#4ADE80" }}>Nusa</span>
                </span>
              </div>
              <p style={{ fontSize: "0.78rem", lineHeight: 1.55, color: "#A3BDB0", margin: 0, fontWeight: 400 }}>
                Platform ekosistem rantai pasok digital komoditas pangan untuk efisiensi distribusi nasional.
              </p>
            </div>

            <div className="footer-nav-links" style={{ display: "flex", alignItems: "center", gap: "1.8rem", fontSize: "0.82rem", fontWeight: 500, flexShrink: 0 }}>
              <a href="/tentang-kami" className="footer-link">Tentang Kami</a>
              <a href="/pusat-bantuan" className="footer-link">Pusat Bantuan</a>
              <a href="/privasi" className="footer-link">Kebijakan Privasi</a>
            </div>
          </div>

          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255, 255, 255, 0.08)", paddingTop: "1.25rem", display: "flex", justifyContent: "center", alignItems: "center", fontSize: "0.72rem", color: "#7C9187", textTransform: "none" }}>
            <span>© 2026 <strong style={{ color: "#CBD5E1", fontWeight: 600 }}>PasarNusa Indonesia</strong>. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}