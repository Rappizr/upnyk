'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function LandingPage() {
  // 1. Array URL Gambar Latar Belakang Baru (Stabil & Beresolusi Tinggi)
  const bgImages = [
    "https://images.unsplash.com/photo-1621274403997-37aae184f494?auto=format&fit=crop&q=80&w=1920", // Petani / Padi Nusantara
    "https://images.unsplash.com/photo-1617696618050-b0fef0c666af?auto=format&fit=crop&q=80&w=1920", // Pengrajin Batik Indonesia
    "https://images.unsplash.com/photo-1563770660941-20978e870e26?auto=format&fit=crop&q=80&w=1920", // Perakitan Elektronik UMKM
    "https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&q=80&w=1920"  // Pasar Tradisional Nusantara
  ];

  const [currentBg, setCurrentBg] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 50);
  };

  window.addEventListener("scroll", handleScroll);

  return () => window.removeEventListener("scroll", handleScroll);
}, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBg((prev) => (prev + 1) % bgImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [bgImages.length]);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans)", overflowX: "hidden" }}>
      
      {/* Navbar */}
<header
  style={{
    background: isScrolled
      ? "rgba(255,255,255,0.95)"
      : "transparent",
    backdropFilter: isScrolled ? "blur(15px)" : "none",
    borderBottom: isScrolled
      ? "1px solid rgba(0,0,0,0.08)"
      : "none",
    boxShadow: isScrolled
      ? "0 4px 20px rgba(0,0,0,0.08)"
      : "none",
    transition: "all .35s ease",
    padding: "1rem 3rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    zIndex: 999,
  }}
>
        {/* === BAGIAN LOGO HEADER === */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
    
<img
  src="/logo.png"
  alt="Logo Icon"
  style={{
    height: "50px",
    width: "auto",
    objectFit: "contain",
    borderRadius: "8px"
  }}
/>
          <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--color-primary)" }}>
            Pasar<span style={{ color: "var(--color-secondary)" }}>Nusa</span>
          </span>
        </div>
        
        <nav style={{ display: "flex", alignItems: "center", gap: "2rem" }}>
          <a href="#fitur" style={{ textDecoration: "none", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>Fitur Utama</a>
          <a href="#ekosistem" style={{ textDecoration: "none", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>Rantai Pasok</a>
          <a href="#mitra" style={{ textDecoration: "none", color: "var(--color-text-muted)", fontSize: "0.9rem", fontWeight: 500 }}>Mitra UMKM</a>
          <Link href="/login" className="btn-primary" style={{ padding: "0.5rem 1.25rem", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id="btn-nav-login">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Masuk ke Portal
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
<section
  style={{
    minHeight: "89vh",
    padding: "8rem 3rem 7rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  }}
>
        
        {bgImages.map((img, index) => (
          <div
            key={index}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.85)), url('${img}')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
              opacity: currentBg === index ? 1 : 0,
              transition: "opacity 1.5s ease-in-out",
              zIndex: 0
            }}
          />
        ))}
   
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <span className="badge badge-info" style={{ 
            marginBottom: "1.5rem", 
            padding: "0.5rem 1rem", 
            fontSize: "0.85rem", 
            display: "inline-flex", 
            alignItems: "center", 
            gap: "0.4rem",
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            color: "#60A5FA",
            border: "1px solid rgba(59, 130, 246, 0.3)",
            backdropFilter: "blur(4px)"
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            Digitalisasi Perdagangan Rural & UMKM Lokal
          </span>
          
          <h1 style={{
            fontSize: "3.5rem",
            fontWeight: 800,
            color: "#FFFFFF",
            lineHeight: 1.2,
            marginBottom: "1.25rem",
            letterSpacing: "-0.02em"
          }}>
            Hubungkan Komoditas Daerah dengan <span style={{ color: "#38BDF8" }}>Rantai Pasok Cerdas</span>
          </h1>
          
          <p style={{
            fontSize: "1.15rem",
            color: "#E2E8F0",
            maxWidth: "640px",
            margin: "0 auto 2.5rem",
            lineHeight: 1.6
          }}>
            PasarNusa memodernisasi jalur distribusi perdagangan lokal, memastikan transparansi rantai pasok dari produsen pedesaan langsung ke tangan pembeli.
          </p>
          
          <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
            <Link href="/login" className="btn-primary" style={{ padding: "0.875rem 2rem", fontSize: "1rem", borderRadius: "var(--radius-md)", backgroundColor: "#2563EB", color: "#FFFFFF", border: "none" }} id="btn-hero-login">
              🚀 Masuk ke Platform
            </Link>
            <a href="#fitur" className="btn-ghost" style={{ padding: "0.875rem 2rem", fontSize: "1rem", borderRadius: "var(--radius-md)", color: "#FFFFFF", border: "1px solid rgba(255,255,255,0.3)", backgroundColor: "rgba(255,255,255,0.1)", backdropFilter: "blur(4px)" }} id="btn-hero-learn">
              Pelajari Fitur →
            </a>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: "0.5rem", marginTop: "3rem" }}>
            {bgImages.map((_, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentBg(idx)}
                style={{
                  width: "8px", 
                  height: "8px", 
                  borderRadius: "50%", 
                  backgroundColor: currentBg === idx ? "#38BDF8" : "rgba(255,255,255,0.3)",
                  cursor: "pointer",
                  transition: "background-color 0.3s ease"
                }} 
              />
            ))}
          </div>
        </div>
      </section>

      {/* Quick Stats Grid View */}
      <section style={{ padding: "0 3rem 4rem", marginTop: "-3rem", position: "relative", zIndex: 2 }}>
        <div className="stats-grid" style={{ maxWidth: "1000px", margin: "0 auto", gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", backgroundColor: "#FFFFFF" }}>
            <div style={{ color: "var(--color-primary)", marginBottom: "0.75rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </div>
            <div>
              <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E293B" }}>2.400+</div>
              <div className="stat-label" style={{ fontSize: "0.875rem", color: "#64748B", fontWeight: 500 }}>Produsen & UMKM Lokal</div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", backgroundColor: "#FFFFFF" }}>
            <div style={{ color: "var(--color-secondary)", marginBottom: "0.75rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
                <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
                <circle cx="5.5" cy="18.5" r="2.5" />
                <circle cx="18.5" cy="18.5" r="2.5" />
              </svg>
            </div>
            <div>
              <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E293B" }}>Real-Time</div>
              <div className="stat-label" style={{ fontSize: "0.875rem", color: "#64748B", fontWeight: 500 }}>Pelacakan Rantai Pasok</div>
            </div>
          </div>
          <div className="stat-card" style={{ padding: "1.75rem", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", backgroundColor: "#FFFFFF" }}>
            <div style={{ color: "var(--color-alert)", marginBottom: "0.75rem" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>
            <div>
              <div className="stat-value" style={{ fontSize: "1.5rem", fontWeight: 800, color: "#1E293B" }}>100% Aman</div>
              <div className="stat-label" style={{ fontSize: "0.875rem", color: "#64748B", fontWeight: 500 }}>Verifikasi & Transaksi B2B/B2C</div>
            </div>
          </div>
        </div>
      </section>

      <section id="fitur" style={{ padding: "5rem 3rem", background: "#FFFFFF", borderTop: "1px solid var(--color-border)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-text)" }}>Sistem Rantai Pasok Modern</h2>
            <p style={{ color: "var(--color-text-muted)", marginTop: "0.5rem" }}>
              Kami menyediakan portal terintegrasi khusus untuk setiap stakeholder di ekosistem perdagangan.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
            <div className="card" style={{ padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--color-primary)", background: "var(--color-primary-light)", padding: "0.75rem", borderRadius: "var(--radius-md)", display: "inline-flex" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="8" cy="21" r="1" /><circle cx="19" cy="21" r="1" />
                  <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-primary)" }}>Portal Pembeli</h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Didesain untuk kemudahan pencarian hasil tani, komoditas unggulan daerah, transparansi pelacakan pengiriman kurir, dan riwayat digital invoice yang rapi.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--color-secondary)", background: "var(--color-secondary-light)", padding: "0.75rem", borderRadius: "var(--radius-md)", display: "inline-flex" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-secondary)" }}>Portal Produsen / UMKM</h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Membantu petani dan produsen lokal mengelola stok komoditas gudang, melacak status logistik B2B, dan memantau estimasi omset bulanan secara real-time.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--color-warning)", background: "var(--color-warning-light)", padding: "0.75rem", borderRadius: "var(--radius-md)", display: "inline-flex" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
                  <path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9" />
                  <path d="M9 14h6" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "#D97706" }}>Portal Admin Toko</h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Memudahkan pengelolaan katalog produk B2C, melacak pesanan baru pelanggan dari marketplace, menyetujui invoice, serta memantau tingkat kepuasan ulasan pembeli.
                </p>
              </div>
            </div>

            <div className="card" style={{ padding: "2rem", display: "flex", gap: "1.25rem", alignItems: "flex-start" }}>
              <span style={{ color: "var(--color-text)", background: "#F1F5F9", padding: "0.75rem", borderRadius: "var(--radius-md)", display: "inline-flex" }}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </span>
              <div>
                <h3 className="font-semibold text-lg mb-2" style={{ color: "var(--color-text)" }}>Portal Admin Platform</h3>
                <p className="text-sm text-muted" style={{ lineHeight: 1.6 }}>
                  Pusat kendali ekosistem digital untuk mengawasi total volume transaksi (GMV), memverifikasi pendaftaran mitra UMKM baru, dan melakukan audit keamanan logs aktivitas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

<section
  style={{
    padding: "6rem 3rem",
    position: "relative",
    overflow: "hidden",

backgroundImage: `
linear-gradient(
rgba(15,23,42,.75),
rgba(15,23,42,.75)
),
url("https://images.unsplash.com/photo-1606857521015-7f9fcf423740?auto=format&fit=crop&w=1920&q=80")
`,

    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
    backgroundAttachment: "fixed",

    color: "#fff",
    textAlign: "center",
  }}
>
        <div style={{ maxWidth: "600px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "2.25rem", fontWeight: 800, marginBottom: "1rem" }}>Siap Bergabung dengan PasarNusa?</h2>
          <p style={{ opacity: 0.9, marginBottom: "2rem", fontSize: "1.05rem" }}>
            Akses portal sistem sesuai dengan hak akses peran (role) Anda sekarang dan mulai berkontribusi dalam digitalisasi rantai pasok rural.
          </p>
          <Link href="/login" className="btn-secondary" style={{
            background: "#FFFFFF",
            color: "var(--color-primary)",
            padding: "0.875rem 2.25rem",
            fontSize: "1.05rem",
            borderRadius: "var(--radius-md)",
            border: "none",
            boxShadow: "var(--shadow-md)",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "0.5rem",
            margin: "0 auto"
          }} id="btn-cta-login">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
            Masuk ke Akun Anda
          </Link>
        </div>
      </section>

      <footer style={{
        padding: "3rem",
        background: "#0F172A",
        color: "#94A3B8",
        borderTop: "1px solid #1E293B",
        textAlign: "center"
      }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.5rem", marginBottom: "2rem" }}>
            
            {/* === BAGIAN LOGO FOOTER === */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <img 
                src="/logo.png" 
                alt="Logo Icon" 
                style={{ height: "24px", width: "auto", objectFit: "contain", borderRadius: "4px" }} 
                onError={(e) => { e.currentTarget.style.display = 'none'; }}
              />
              <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#FFFFFF" }}>
                Pasar<span style={{ color: "#10B981" }}>Nusa</span>
              </span>
            </div>

            <div style={{ display: "flex", gap: "2rem" }}>
              <a href="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Pengembang</a>
              <a href="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Tentang Kami</a>
              <a href="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Kontak Mitra</a>
              <a href="#" style={{ color: "#94A3B8", textDecoration: "none", fontSize: "0.85rem" }}>Kebijakan Privasi</a>
            </div>
          </div>
          <div style={{ borderTop: "1px solid #1E293B", paddingTop: "1.5rem", fontSize: "0.8rem", color: "#64748B" }}>
            © 2026 PasarNusa & Supply Chain Platform. Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.
          </div>
        </div>
      </footer>
    </div>
  );
}