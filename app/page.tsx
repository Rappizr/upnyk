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
    "/logo1.png",
    "/logo2.png",
    "/logo3.png",
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [statsVisible, setStatsVisible] = useState(false);
  const statsRef = useRef<HTMLDivElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  const mitraCount = useCountUp(2400, 1800, statsVisible);
  const indeksCount = useCountUp(82, 1800, statsVisible);
  const desaCount = useCountUp(140, 1800, statsVisible);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = 0.4;

    const tryPlay = () => { audio.play().catch(() => {}); };
    tryPlay();

    const onFirstInteraction = () => {
      tryPlay();
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
    window.addEventListener("click", onFirstInteraction);
    window.addEventListener("scroll", onFirstInteraction);
    window.addEventListener("keydown", onFirstInteraction);
    window.addEventListener("touchstart", onFirstInteraction);
    return () => {
      window.removeEventListener("click", onFirstInteraction);
      window.removeEventListener("scroll", onFirstInteraction);
      window.removeEventListener("keydown", onFirstInteraction);
      window.removeEventListener("touchstart", onFirstInteraction);
    };
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
      { threshold: 0.4 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const fitur = [
    {
      layer: "Hulu",
      accent: "#12864E",
      soft: "#E7F3EC",
      title: "Wallet & Kendali Produsen",
      desc: "Petani, peternak, dan pengrajin memantau Indeks Harga Adil harian, mengelola stok dari lahan sendiri, dan menarik saldo Wallet kapan pun dibutuhkan.",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20h10"/><path d="M10 20c5.5-2.5.8-6.4 3-10"/><path d="M9.5 9.4c1.1.8 1.8 2.2 2.3 3.7-2 .4-3.5.4-4.8-.3-1.2-.6-2.3-1.9-3-4.2 2.8-.5 4.4 0 5.5.8z"/><path d="M14.1 6a7 7 0 0 0-1.1 4c1.9-.1 3.3-.6 4.3-1.4 1-1 1.6-2.3 1.7-4.6-2.7.1-4 1-4.9 2z"/></svg>
      )
    },
    {
      layer: "Tengah",
      accent: "#D98A2B",
      soft: "#FBF0DF",
      title: "Dashboard Admin Toko",
      desc: "Smart Restock mengingatkan jadwal panen sebelum tengkulak datang, buku kas digital tercatat otomatis, dan katalog harga tersinkron langsung ke pembeli.",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9"/><path d="M9 14h6"/></svg>
      )
    },
    {
      layer: "Hilir",
      accent: "#0E7490",
      soft: "#E1F1F4",
      title: "Portal Pembeli Cerdas",
      desc: "Jelajahi komoditas pelosok lengkap dengan kisah asli produsennya, pelacakan pengiriman real-time di peta, dan dana yang aman lewat sistem Escrow.",
      icon: (
        <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
      )
    }
  ];

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-sans), system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden", scrollBehavior: "smooth" }}>

      <audio ref={audioRef} src="/bgm.mp3" loop autoPlay style={{ display: "none" }} />

      <style dangerouslySetInnerHTML={{__html: `
        .pn-root {
          --ink: #0C1F17;
          --paper: #F6F7F4;
          --card: #FFFFFF;
          --line: #E6E8E2;
          --muted: #5B6B60;
          --forest-1: #0A2018;
          --forest-2: #103726;
          --emerald: #12864E;
          --emerald-bright: #34D399;
          --harvest: #E1A140;
          --teal: #0E7490;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(246, 247, 244, 0.85)' : 'rgba(10, 32, 24, 0.12)'};
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(12,31,23,0.06)' : 'rgba(255,255,255,0.08)'};
          box-shadow: ${isScrolled ? '0 6px 34px rgba(10,32,24,0.06)' : 'none'};
        }
        .nav-link {
          color: ${isScrolled ? 'var(--ink)' : 'rgba(231, 239, 233, 0.82)'};
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-link:hover { color: ${isScrolled ? 'var(--emerald)' : '#FFFFFF'}; transform: translateY(-1px); }

        .footer-link {
          color: #8D9C91;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
          font-weight: 600;
        }
        .footer-link:hover { color: #FFFFFF; }

        .grad-text {
          background: linear-gradient(120deg, #6EE7B7 0%, #34D399 55%, #E1A140 130%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
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
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 26px 50px -24px rgba(10,32,24,0.26);
          border-color: rgba(18,134,78,0.28);
        }

        .glass-stat {
          background: var(--card);
          border: 1px solid var(--line);
          transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
        }
        .glass-stat:hover { transform: translateY(-6px); box-shadow: 0 22px 40px -22px rgba(10,32,24,0.28); }

        .btn-glow {
          transition: all 0.3s ease;
          box-shadow: 0 12px 28px -8px rgba(18, 134, 78, 0.5);
        }
        .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 18px 38px -8px rgba(18, 134, 78, 0.65); }

        .fade-in { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

        @keyframes pulseGlow { 0%,100% { opacity: 0.32; transform: scale(1); } 50% { opacity: 0.55; transform: scale(1.08); } }
        .glow-orb-1 { animation: pulseGlow 6s ease-in-out infinite; }
        .glow-orb-2 { animation: pulseGlow 7s ease-in-out infinite 1s; }

        @media (prefers-reduced-motion: reduce) {
          .glow-orb-1,.glow-orb-2 { animation: none !important; }
        }

        /* LAYOUT PC TERJAGA PRESISI DI LAYAR HP */
        @media (max-width: 768px) {
          .header-container { padding: 0.5rem 0.8rem !important; }
          .nav-logo-text { font-size: 0.85rem !important; }
          .nav-logo-img { height: 20px !important; }
          .nav-container { gap: 0.5rem !important; }
          .nav-link-desktop { display: inline-block !important; font-size: 0.65rem !important; }
          .btn-masuk-portal { padding: 0.3rem 0.6rem !important; font-size: 0.62rem !important; gap: 0.2rem !important; }
          .btn-masuk-portal svg { width: 10px !important; height: 10px !important; }

          .hero-section { padding: 5rem 0.8rem 3rem !important; min-height: auto !important; }
          .hero-badge { font-size: 0.55rem !important; padding: 0.3rem 0.6rem !important; margin-bottom: 0.8rem !important; }
          .hero-title { font-size: 1.4rem !important; line-height: 1.2 !important; }
          .hero-desc { font-size: 0.72rem !important; margin-bottom: 1.2rem !important; }
          .hero-btn-group { flex-direction: row !important; gap: 0.4rem !important; }
          .hero-btn-group a { padding: 0.45rem 0.8rem !important; font-size: 0.7rem !important; }

          .stats-section { padding: 0 0.8rem !important; margin-top: -2.5rem !important; }
          .stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }
          .glass-stat { padding: 0.6rem 0.4rem !important; border-radius: 0.6rem !important; gap: 0.4rem !important; }
          .glass-stat .icon-box { padding: 0.4rem !important; border-radius: 0.4rem !important; }
          .glass-stat .icon-box svg { width: 16px !important; height: 16px !important; }
          .glass-stat .stat-number { font-size: 0.85rem !important; }
          .glass-stat .stat-label { font-size: 0.52rem !important; line-height: 1.1 !important; }

          .features-section { padding: 3rem 0.8rem !important; }
          .features-section h2 { font-size: 1.3rem !important; }
          .features-section .sec-sub { font-size: 0.7rem !important; margin-top: 0.4rem !important; margin-bottom: 1.5rem !important; }
          .features-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; }
          .modern-card { padding: 0.8rem 0.6rem !important; border-radius: 0.8rem !important; }
          .modern-card h3 { font-size: 0.75rem !important; margin-bottom: 0.3rem !important; }
          .modern-card p { font-size: 0.58rem !important; line-height: 1.3 !important; }

          .cta-section { padding: 3rem 0.8rem !important; }
          .cta-section h2 { font-size: 1.3rem !important; }
          .cta-section p { font-size: 0.72rem !important; margin-bottom: 1.2rem !important; }
          .cta-section a { padding: 0.5rem 1rem !important; font-size: 0.75rem !important; }

          .footer-container { padding: 1.5rem 0.8rem !important; }
          .footer-top { flex-direction: row !important; align-items: center !important; justify-content: space-between !important; gap: 0.5rem !important; margin-bottom: 1rem !important; }
          .footer-grid-links { grid-template-columns: repeat(3, auto) !important; column-gap: 0.6rem !important; margin-left: auto !important; }
          .footer-link { font-size: 0.6rem !important; }
          .footer-bottom { flex-direction: row !important; justify-content: space-between !important; gap: 0.3rem !important; }
          .footer-bottom span { font-size: 0.55rem !important; }
        }
      `}} />

      {/* NAVBAR */}
      <header className="glass-nav header-container" style={{ padding: "0.9rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", flexShrink: 0 }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "34px", width: "auto", objectFit: "contain", borderRadius: "6px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.35rem", fontWeight: 800, letterSpacing: "-0.02em", color: isScrolled ? "var(--ink)" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "var(--emerald)" : "var(--emerald-bright)" }}>Nusa</span>
          </span>
        </div>

        <nav className="nav-container" style={{ display: "flex", alignItems: "center", gap: "2.4rem" }}>
          <a href="#fitur" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.92rem", fontWeight: 600 }}>Fitur Utama</a>
          <a href="/rantai-pasok" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.92rem", fontWeight: 600 }}>Rantai Pasok</a>
          <a href="/mitra-umkm" className="nav-link nav-link-desktop" style={{ textDecoration: "none", fontSize: "0.92rem", fontWeight: 600 }}>Mitra UMKM</a>

          <Link href="/login" className="btn-masuk-portal" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.45rem", padding: "0.55rem 1.3rem", borderRadius: "99px", backgroundColor: isScrolled ? "var(--emerald)" : "var(--emerald)", color: "#FFFFFF", fontSize: "0.85rem", fontWeight: 600, transition: "all 0.3s ease" }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Portal
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section" style={{ minHeight: "96vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden", padding: "6rem 2rem 4rem" }}>
        {bgImages.map((img, index) => (
          <div key={index} style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: `linear-gradient(180deg, rgba(10,32,24,0.55), rgba(10,32,24,0.92)), url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
            opacity: currentBg === index ? 1 : 0,
            transform: currentBg === index ? "scale(1.03)" : "scale(1.08)",
            transition: "opacity 2s ease-in-out, transform 6s ease",
          }} />
        ))}

        {/* Glow orbs */}
        <div className="glow-orb-1" style={{ position: "absolute", top: "12%", left: "8%", width: "230px", height: "230px", borderRadius: "50%", background: "radial-gradient(circle, rgba(52,211,153,0.35), transparent 70%)", filter: "blur(12px)", zIndex: 1 }} />
        <div className="glow-orb-2" style={{ position: "absolute", bottom: "10%", right: "10%", width: "270px", height: "270px", borderRadius: "50%", background: "radial-gradient(circle, rgba(225,161,64,0.28), transparent 70%)", filter: "blur(12px)", zIndex: 1 }} />

        <div className="hero-wrapper fade-in" style={{ maxWidth: "920px", margin: "2rem auto 0", position: "relative", zIndex: 2 }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "0.5rem 1.25rem", borderRadius: "99px", background: "rgba(52,211,153,0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(52,211,153,0.28)", color: "#D1FAE5", fontSize: "0.82rem", fontWeight: 700, marginBottom: "2rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "var(--emerald-bright)", boxShadow: "0 0 10px var(--emerald-bright)" }} />
            Rural Commerce &amp; Supply Chain
          </div>

          <h1 className="hero-title" style={{ fontSize: "4.25rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.12, marginBottom: "1.5rem", letterSpacing: "-0.035em" }}>
            Harga Adil untuk Produsen,<br /><span className="grad-text">Terukur Sampai ke Angka</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#C7D6CC", maxWidth: "700px", margin: "0 auto 3rem", lineHeight: 1.65, fontWeight: 400 }}>
            PasarNusa memutus rantai tengkulak dan mengubah perantara informal menjadi koperasi digital yang transparan — setiap harga, transaksi, dan margin bisa diaudit sistem, bukan sekadar dijanjikan.
          </p>

          <div className="hero-btn-group" style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            <Link href="/login" className="btn-glow" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.85rem 2.25rem", borderRadius: "99px", backgroundColor: "var(--emerald)", color: "#FFFFFF", fontSize: "1rem", fontWeight: 700 }}>
              Mulai Akses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a href="#fitur" style={{ padding: "0.85rem 2.25rem", fontSize: "1rem", fontWeight: 600, borderRadius: "99px", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.28)", backgroundColor: "rgba(255,255,255,0.06)", backdropFilter: "blur(10px)", textDecoration: "none", transition: "all 0.3s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.06)"}>
              Pelajari Fitur
            </a>
          </div>
        </div>
      </section>

      {/* STATISTIK */}
      <section className="stats-section" ref={statsRef} style={{ padding: "0 3rem", marginTop: "-5rem", position: "relative", zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.5rem" }}>

          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#E7F3EC", padding: "0.85rem", borderRadius: "0.85rem", color: "var(--emerald)", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>{mitraCount.toLocaleString("id-ID")}+</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>Mitra Produsen Terverifikasi</div>
            </div>
          </div>

          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#FBF0DF", padding: "0.85rem", borderRadius: "0.85rem", color: "var(--harvest)", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>{indeksCount}/100</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>Rata-rata Indeks Harga Adil</div>
            </div>
          </div>

          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#E1F1F4", padding: "0.85rem", borderRadius: "0.85rem", color: "var(--teal)", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.2 }}>{desaCount}+ Desa</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "var(--muted)", fontWeight: 500 }}>Terjangkau Escrow Aman</div>
            </div>
          </div>

        </div>
      </section>

      {/* FITUR */}
      <section id="fitur" className="features-section" style={{ padding: "8rem 3rem", background: "var(--paper)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <span style={{ color: "var(--emerald)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Satu Ekosistem</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.03em", marginTop: "0.6rem" }}>Tiga Peran, Satu Rantai Pasok</h2>
            <p className="sec-sub" style={{ color: "var(--muted)", fontSize: "1.08rem", marginTop: "1rem", maxWidth: "620px", margin: "1rem auto 0", lineHeight: 1.65 }}>
              Setiap portal dirancang untuk perannya masing-masing, tapi datanya mengalir satu sama lain — dari lahan produsen sampai ke tangan pembeli.
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "2rem" }}>
            {fitur.map((f, i) => (
              <div key={i} className="modern-card" style={{ padding: "2.4rem 2.1rem", borderRadius: "1.5rem", ["--card-accent" as any]: f.accent }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.4rem" }}>
                  <div style={{ background: f.soft, width: "60px", height: "60px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: f.accent }}>
                    {f.icon}
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 800, letterSpacing: "0.16em", textTransform: "uppercase", color: f.accent, background: f.soft, padding: "0.3rem 0.7rem", borderRadius: "999px" }}>{f.layer}</span>
                </div>
                <h3 style={{ fontSize: "1.28rem", fontWeight: 800, color: "var(--ink)", marginBottom: "0.7rem", letterSpacing: "-0.02em" }}>{f.title}</h3>
                <p style={{ color: "var(--muted)", lineHeight: 1.7, fontSize: "0.95rem", margin: 0 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" style={{ padding: "6.5rem 3rem", position: "relative", overflow: "hidden", backgroundImage: `linear-gradient(rgba(10,32,24,.82), rgba(10,32,24,.95)), url("https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", color: "#fff", textAlign: "center" }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", width: "520px", height: "520px", background: "radial-gradient(circle, rgba(52,211,153,0.16), transparent 65%)", filter: "blur(30px)", pointerEvents: "none" }} />
        <div style={{ maxWidth: "660px", margin: "0 auto", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1.4rem", letterSpacing: "-0.035em", lineHeight: 1.1 }}>Jadi Bagian dari Rantai Pasok yang Adil</h2>
          <p style={{ color: "#C7D6CC", marginBottom: "2.8rem", fontSize: "1.14rem", lineHeight: 1.65 }}>
            Bergabung dengan ekosistem digitalisasi rantai pasok paling transparan untuk pelaku UMKM dan produsen pelosok di Indonesia. Pilih peran Anda dan mulai berdampak hari ini.
          </p>
          <Link href="/login" className="btn-glow" style={{ textDecoration: "none", border: "none", display: "inline-flex", alignItems: "center", gap: "0.55rem", padding: "1rem 2.5rem", borderRadius: "99px", background: "var(--emerald)", color: "#FFFFFF", fontSize: "1.1rem", fontWeight: 700 }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
              <polyline points="10 17 15 12 10 7"/>
              <line x1="15" y1="12" x2="3" y2="12"/>
            </svg>
            Akses Platform Sekarang
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-container" style={{ padding: "4rem", background: "var(--forest-1)", color: "#8D9C91" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>

          <div className="footer-top" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "2rem", marginBottom: "3rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img className="footer-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "34px", width: "auto", objectFit: "contain" }} />
              <span className="footer-logo-text" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>Pasar<span style={{ color: "var(--emerald-bright)" }}>Nusa</span></span>
            </div>

            <div className="footer-grid-links" style={{ display: "grid", gridTemplateColumns: "repeat(3, auto)", columnGap: "4rem", marginLeft: "auto", alignItems: "center" }}>
              <a href="/tentang-kami" className="footer-link">Tentang Kami</a>
              <a href="/pusat-bantuan" className="footer-link">Pusat Bantuan</a>
              <a href="/privasi" className="footer-link">Privasi</a>
            </div>
          </div>

          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "2rem", fontSize: "0.85rem", color: "#6B7A70", display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "0.5rem" }}>
            <span>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
            <span>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}