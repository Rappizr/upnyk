'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  const bgImages = [
    "/logo1.png",
    "/logo2.png", 
    "/logo3.png", 
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden", scrollBehavior: "smooth" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .glass-nav {
          background: ${isScrolled ? 'rgba(15, 23, 42, 0.85)' : 'rgba(15, 23, 42, 0.15)'};
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.05)'};
          box-shadow: ${isScrolled ? '0 4px 30px rgba(0, 0, 0, 0.2)' : 'none'};
        }
        .nav-link {
          color: rgba(255, 255, 255, 0.8);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .nav-link:hover { color: #FFFFFF; transform: translateY(-1px); }
        
        .footer-link {
          color: #94A3B8;
          text-decoration: none;
          transition: color 0.3s ease;
          cursor: pointer;
        }
        .footer-link:hover { color: #FFFFFF; }
        
        .gradient-text {
          background: linear-gradient(135deg, #38BDF8 0%, #818CF8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .modern-card {
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(226, 232, 240, 0.8);
        }
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
          border-color: rgba(56, 189, 248, 0.3);
        }
        .glass-stat {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }
        .glass-stat:hover { transform: translateY(-5px); box-shadow: 0 15px 30px -5px rgba(0,0,0,0.1); }
        
        .btn-glow {
          transition: all 0.3s ease;
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
        }
        .btn-glow:hover { transform: translateY(-2px); box-shadow: 0 15px 35px -5px rgba(37, 99, 235, 0.6); }

        @media (max-width: 768px) {
          .header-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 0.5rem !important;
            padding-bottom: 0.5rem !important;
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0px !important;
          }
          .nav-logo-text {
            font-size: 0.85rem !important;
          }
          .nav-logo-img {
            height: 20px !important;
          }
          .nav-container {
            display: flex !important;
            flex-direction: row !important;
            align-items: center !important;
            gap: 0.3rem !important;
          }
          .nav-link {
            font-size: 0.5rem !important;
            font-weight: 700 !important;
          }
          .btn-masuk-portal {
            padding-top: 0.2rem !important;
            padding-bottom: 0.2rem !important;
            padding-left: 0.4rem !important;
            padding-right: 0.4rem !important;
            font-size: 0.5rem !important;
            gap: 0.2rem !important;
          }
          .btn-masuk-portal svg {
            width: 8px !important;
            height: 8px !important;
          }
          .hero-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 6rem !important;
            padding-bottom: 5rem !important;
            min-height: auto !important;
          }
          .hero-wrapper {
            margin-top: 0px !important;
          }
          .hero-badge {
            font-size: 0.65rem !important;
            padding: 0.35rem 0.85rem !important;
            margin-bottom: 1rem !important;
          }
          .hero-title {
            font-size: 1.85rem !important;
            line-height: 1.2 !important;
          }
          .hero-desc {
            font-size: 0.85rem !important;
            margin-bottom: 1.75rem !important;
          }
          .hero-btn-group {
            flex-direction: row !important;
            justify-content: center !important;
            gap: 8px !important;
          }
          .hero-btn-group a {
            padding: 0.6rem 1rem !important;
            font-size: 0.8rem !important;
            flex: none !important;
            width: auto !important;
          }
          
          .stats-section {
            padding-left: 0.35rem !important;
            padding-right: 0.35rem !important;
            margin-top: -2.5rem !important;
          }
          .stats-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .glass-stat {
            padding: 0.35rem 0.25rem !important;
            gap: 0.2rem !important;
            flex-direction: column !important;
            text-align: center !important;
            border-radius: 0.6rem !important;
          }
          .glass-stat .icon-box {
            padding: 0.3rem !important;
            border-radius: 0.4rem !important;
          }
          .glass-stat svg {
            width: 12px !important;
            height: 12px !important;
          }
          .glass-stat .stat-number {
            font-size: 0.65rem !important;
            line-height: 1.1 !important;
          }
          .glass-stat .stat-label {
            font-size: 0.42rem !important;
            line-height: 1.1 !important;
            white-space: nowrap !important;
          }

          .features-section {
            padding-left: 0.25rem !important;
            padding-right: 0.25rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
          .features-section h2 {
            font-size: 1.35rem !important;
          }
          .features-section p {
            font-size: 0.7rem !important;
            margin-top: 0.4rem !important;
            margin-bottom: 1.75rem !important;
          }
          .features-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .modern-card {
            padding: 0.4rem 0.3rem !important;
            border-radius: 0.5rem !important;
          }
          .modern-card div {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px !important;
            margin-bottom: 0.4rem !important;
          }
          .modern-card div svg {
            width: 14px !important;
            height: 14px !important;
          }
          .modern-card h3 {
            font-size: 0.52rem !important;
            line-height: 1.1 !important;
            margin-bottom: 0.25rem !important;
          }
          .modern-card p {
            font-size: 0.42rem !important;
            line-height: 1.3 !important;
          }

          .cta-section {
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }
          .cta-section h2 {
            font-size: 1.45rem !important;
            line-height: 1.2 !important;
          }
          .cta-section p {
            font-size: 0.8rem !important;
            margin-bottom: 2rem !important;
          }
          .cta-section a {
            padding: 0.65rem 1.5rem !important;
            font-size: 0.85rem !important;
          }

          /* --- REPLIKA FOOTER DESKTOP PERFECT HORIZONTAL DI MOBILE --- */
          .footer-container {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 2rem !important;
            padding-bottom: 2rem !important;
          }
          .footer-top {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0px !important;
            margin-bottom: 1.5rem !important;
          }
          .footer-logo-img {
            height: 22px !important;
          }
          .footer-logo-text {
            font-size: 0.85rem !important;
          }
          .footer-grid-links {
            grid-template-columns: repeat(3, auto) !important;
            column-gap: 0.45rem !important;
            margin-left: auto !important;
            align-items: center !important;
          }
          .footer-link {
            font-size: 0.52rem !important;
            font-weight: 700 !important;
          }
          .footer-bottom {
            flex-direction: row !important;
            justify-content: space-between !important;
            align-items: center !important;
            gap: 0px !important;
            padding-top: 1.25rem !important;
          }
          .footer-bottom span {
            font-size: 0.42rem !important;
            line-height: 1.2 !important;
          }
        }
      `}} />

      <header className="glass-nav header-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexShrink: 0 }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo" style={{ height: "36px", width: "auto", objectFit: "contain", borderRadius: "6px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.35rem", fontWeight: 800, color: "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: "#38BDF8" }}>Nusa</span>
          </span>
        </div>
        
        <nav className="nav-container" style={{ display: "flex", alignItems: "center", gap: "2.5rem" }}>
          <a href="#fitur" className="nav-link" style={{ textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Fitur Utama</a>
          <a href="/rantai-pasok" className="nav-link" style={{ textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Rantai Pasok</a>
          <a href="/mitra" className="nav-link" style={{ textDecoration: "none", fontSize: "0.95rem", fontWeight: 600 }}>Mitra UMKM</a>
          
          <Link href="/login" className="btn-glow btn-masuk-portal" style={{ 
            paddingTop: "0.55rem", paddingBottom: "0.55rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", fontSize: "0.85rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.4rem",
            backgroundColor: "#FFFFFF", color: "#0F172A", borderRadius: "99px", textDecoration: "none"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
              <polyline points="10 17 15 12 10 7" />
              <line x1="15" y1="12" x2="3" y2="12" />
            </svg>
            Masuk Portal
          </Link>
        </nav>
      </header>

      <section className="hero-section" style={{ minHeight: "95vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", position: "relative", overflow: "hidden", paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "6rem", paddingBottom: "4rem" }}>
        {bgImages.map((img, index) => (
          <div key={index} style={{
            position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
            backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.45), rgba(15, 23, 42, 0.85)), url('${img}')`,
            backgroundSize: "cover",
            backgroundPosition: "center", 
            backgroundRepeat: "no-repeat",
            backgroundAttachment: "scroll",
            opacity: currentBg === index ? 1 : 0,
            transform: currentBg === index ? "scale(1.03)" : "scale(1.08)",
            transition: "opacity 2s ease-in-out, transform 6s ease",
          }} />
        ))}
   
        <div className="hero-wrapper" style={{ maxWidth: "900px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1, marginTop: "2rem", marginBottom: "0px" }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(255, 255, 255, 0.12)", backdropFilter: "blur(10px)", border: "1px solid rgba(255, 255, 255, 0.2)", color: "#E0F2FE", fontSize: "0.85rem", fontWeight: 600, marginBottom: "2rem", letterSpacing: "0.05em" }}>
            <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#38BDF8", boxShadow: "0 0 10px #38BDF8" }} />
            DIGITALISASI UMKM & PERDAGANGAN 
          </div>
          
          <h1 className="hero-title" style={{ fontSize: "4.25rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.15, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Modernisasi Komoditas dengan <br /><span className="gradient-text">Rantai Pasok Cerdas</span>
          </h1>
          
          <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#E2E8F0", maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "3rem", lineHeight: 1.6, fontWeight: 400 }}>
            PasarNusa mentransformasi jalur distribusi perdagangan lokal. Memastikan transparansi, memotong rantai perantara, dan membawa produk pedesaan langsung ke pasar global.
          </p>
          
          <div className="hero-btn-group" style={{ display: "flex", justifyContent: "center", gap: "14px" }}>
            <Link href="/login" className="btn-glow" style={{ paddingLeft: "2.25rem", paddingRight: "2.25rem", paddingTop: "0.85rem", paddingBottom: "0.85rem", fontSize: "1rem", fontWeight: 600, borderRadius: "99px", backgroundColor: "#38BDF8", color: "#0F172A", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
              Mulai Akses
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>
            </Link>
            <a href="#fitur" style={{ paddingLeft: "2.25rem", paddingRight: "2.25rem", paddingTop: "0.85rem", paddingBottom: "0.85rem", fontSize: "1rem", fontWeight: 600, borderRadius: "99px", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.05)", backdropFilter: "blur(10px)", textDecoration: "none", transition: "all 0.3s ease" }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.15)"} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "rgba(255,255,255,0.05)"}>
              Pelajari Fitur
            </a>
          </div>
        </div>
      </section>

      <section className="stats-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "0px", paddingBottom: "0px", marginTop: "-5rem", position: "relative", zIndex: 10 }}>
        <div className="stats-grid" style={{ maxWidth: "1100px", marginLeft: "auto", marginRight: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.5rem" }}>
          
          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#EFF6FF", padding: "0.85rem", borderRadius: "0.85rem", color: "#2563EB", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>2.400+</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>Mitra Produsen</div>
            </div>
          </div>
          
          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#ECFDF5", padding: "0.85rem", borderRadius: "0.85rem", color: "#10B981", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="2" ry="2"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>Live System</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>Pelacakan Pasok</div>
            </div>
          </div>
          
          <div className="glass-stat" style={{ padding: "1.75rem", borderRadius: "1.25rem", display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div className="icon-box" style={{ background: "#FEF2F2", padding: "0.85rem", borderRadius: "0.85rem", color: "#EF4444", flexShrink: 0 }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div>
              <div className="stat-number" style={{ fontSize: "1.6rem", fontWeight: 800, color: "#0F172A", lineHeight: 1.2 }}>100% Aman</div>
              <div className="stat-label" style={{ fontSize: "0.85rem", color: "#64748B", fontWeight: 500 }}>Transaksi B2B</div>
            </div>
          </div>

        </div>
      </section>

      <section id="fitur" className="features-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "8rem", paddingBottom: "8rem", background: "#F8FAFC" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", letterSpacing: "-0.02em" }}>Ekosistem Terintegrasi Penuh</h2>
            <p style={{ color: "#64748B", fontSize: "1.1rem", marginTop: "1rem", maxWidth: "600px", marginLeft: "auto", marginRight: "auto" }}>
              Satu platform cerdas dengan portal khusus untuk memaksimalkan potensi dan mempermudah operasional bisnis setiap pihak.
            </p>
          </div>

          <div className="features-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(350px, 1fr))", gap: "2rem" }}>
            
            <div className="modern-card" style={{ padding: "2.5rem", borderRadius: "1.5rem" }}>
              <div style={{ background: "#EFF6FF", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", marginBottom: "1.5rem" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>Portal Pembeli Cerdas</h3>
              <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "0.95rem" }}>Pencarian komoditas hasil bumi yang difilter dengan AI, transparansi pelacakan pengiriman kurir *real-time*, dan rekam jejak invoice digital otomatis.</p>
            </div>

            <div className="modern-card" style={{ padding: "2.5rem", borderRadius: "1.5rem" }}>
              <div style={{ background: "#ECFDF5", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: "1.5rem" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>Manajemen Produsen UMKM</h3>
              <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "0.95rem" }}>Sistem kontrol stok berbasis prediksi (*smart restock*), penjadwalan logistik antar-desa, dan pemantauan arus kas B2B secara terpusat.</p>
            </div>

            <div className="modern-card" style={{ padding: "2.5rem", borderRadius: "1.5rem" }}>
              <div style={{ background: "#FFFBEB", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#D97706", marginBottom: "1.5rem" }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"/><path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9"/><path d="M9 14h6"/></svg>
              </div>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.75rem" }}>Dashboard Admin Toko</h3>
              <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "0.95rem" }}>Otomatisasi persetujuan pesanan masuk, sinkronisasi katalog harga langsung ke pasar pembeli, dan penanganan analitik limbah atau cacat produk.</p>
            </div>

          </div>
        </div>
      </section>

      <section className="cta-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "6rem", paddingBottom: "6rem", position: "relative", overflow: "hidden", backgroundImage: `linear-gradient(rgba(15,23,42,.85), rgba(15,23,42,.95)), url("https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1920&q=80")`, backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll", color: "#fff", textAlign: "center" }}>
        <div style={{ maxWidth: "650px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 2 }}>
          <h2 style={{ fontSize: "3rem", fontWeight: 800, marginBottom: "1.5rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>Revolusi Bisnis Anda Bersama PasarNusa</h2>
          <p style={{ color: "#CBD5E1", marginBottom: "3rem", fontSize: "1.15rem", lineHeight: 1.6 }}>
            Bergabunglah dengan ekosistem digitalisasi rantai pasok paling transparan di Indonesia. Pilih peran Anda dan mulailah berdampak.
          </p>
          <Link href="/login" className="btn-glow" style={{ background: "#38BDF8", color: "#0F172A", paddingLeft: "2.5rem", paddingRight: "2.5rem", paddingTop: "1rem", paddingBottom: "1rem", fontSize: "1.1rem", fontWeight: 700, borderRadius: "99px", border: "none", display: "inline-flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/></svg>
            Akses Platform Sekarang
          </Link>
        </div>
      </section>

      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "4rem", paddingBottom: "4rem", background: "#0B1120", color: "#94A3B8" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          
          <div className="footer-top" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            flexWrap: "wrap", 
            gap: "2rem", 
            marginBottom: "3rem" 
          }}>
            
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <img className="footer-logo-img" src="/logo.png" alt="Logo" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
              <span className="footer-logo-text" style={{ fontSize: "1.3rem", fontWeight: 800, color: "#FFFFFF" }}>Pasar<span style={{ color: "#38BDF8" }}>Nusa</span></span>
            </div>

            <div className="footer-grid-links"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, auto)",
                columnGap: "4rem",
                marginLeft: "auto",
                alignItems: "center",
              }}
            >
              <div>
                <a href="/tentang-kami" className="footer-link">Tentang Kami</a>
              </div>
              <div>
                <a href="/pusat-bantuan" className="footer-link">Pusat Bantuan</a>
              </div>
              <div>
                <a href="/privasi" className="footer-link">Privasi</a>
              </div>
            </div>
          </div>
          
          <div className="footer-bottom" style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "2rem", fontSize: "0.85rem", color: "#475569", display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
            <span>© 2026 PasarNusa & Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
            <span>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
          </div>
        </div>
      </footer>
    </div>
  );
}