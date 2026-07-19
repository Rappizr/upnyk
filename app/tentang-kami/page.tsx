'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Eye, Layers, AlertCircle, MapPin, BarChart3, Scale, Globe2, Zap } from "lucide-react";
import { FaInstagram, FaGithub } from "react-icons/fa";

export default function TentangKamiPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  const marqueeImages = [
    "/1.png",
    "/2.png",
    "/3.png",
    "/4.png",
    "/5.png",
    "/6.png"
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>
      
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
        .modern-card {
          background: #ffffff;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 10px 30px -10px rgba(0,0,0,0.03);
        }
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 60px -15px rgba(37, 99, 235, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
        }
        .social-icon {
          color: #94A3B8;
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .social-icon.ig:hover { color: #E1306C; transform: scale(1.15) translateY(-2px); }
        .social-icon.git:hover { color: #181717; transform: scale(1.15) translateY(-2px); }
        
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(calc(-50% - 1rem)); }
        }
        .marquee-wrapper {
          display: flex;
          overflow: hidden;
          padding-top: 0px;
          padding-bottom: 4rem;
          width: 100vw;
          position: relative;
          left: 50%;
          right: 50%;
          margin-left: -50vw;
          margin-right: -50vw;
          -webkit-mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
          mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
        }
        .marquee-content {
          display: flex;
          gap: 2rem;
          width: max-content;
          animation: scroll 35s linear infinite;
        }
        .marquee-content:hover { animation-play-state: paused; }
        .marquee-img-card {
          width: 320px;
          height: 200px;
          border-radius: 1.25rem;
          overflow: hidden;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border: 1px solid rgba(255, 255, 255, 0.15);
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(4px);
        }
        .marquee-img-card img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transform: scale(1.18); 
          transition: transform .4s ease;
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
            padding-bottom: 0px !important;
          }
          .hero-badge {
            font-size: 0.65rem !important;
            padding-left: 1rem !important;
            padding-right: 1rem !important;
            padding-top: 0.35rem !important;
            padding-bottom: 0.35rem !important;
            margin-bottom: 1rem !important;
          }
          .hero-title {
            font-size: 1.85rem !important;
            line-height: 1.25 !important;
          }
          .hero-desc {
            font-size: 0.85rem !important;
            margin-bottom: 2rem !important;
          }
          .marquee-wrapper {
            padding-bottom: 2rem !important;
          }
          .marquee-img-card {
            width: 160px !important;
            height: 100px !important;
            border-radius: 0.6rem !important;
          }

          .problem-section {
            padding-left: 0.5rem !important;
            padding-right: 0.5rem !important;
            padding-top: 3.5rem !important;
            padding-bottom: 3.5rem !important;
          }
          .problem-grid-main {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
          }
          .problem-left-heading h2 {
            font-size: 1.6rem !important;
          }
          .problem-left-heading p {
            font-size: 0.85rem !important;
          }
          .problem-grid-cards {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.4rem !important;
          }
          .problem-mini-card {
            padding: 0.6rem !important;
            border-radius: 0.6rem !important;
          }
          .problem-mini-card svg {
            width: 18px !important;
            height: 18px !important;
            margin-bottom: 0.4rem !important;
          }
          .problem-mini-card h4 {
            font-size: 0.65rem !important;
            margin-bottom: 0.25rem !important;
          }
          .problem-mini-card p {
            font-size: 0.5rem !important;
            line-height: 1.3 !important;
          }

          .vision-section {
            padding-left: 0.35rem !important;
            padding-right: 0.35rem !important;
            padding-top: 2.5rem !important;
            padding-bottom: 2.5rem !important;
          }
          .vision-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.35rem !important;
          }
          .vision-grid .modern-card {
            padding: 0.5rem !important;
            border-radius: 0.5rem !important;
          }
          .vision-grid .modern-card div {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px !important;
            margin-bottom: 0.4rem !important;
          }
          .vision-grid .modern-card div svg {
            width: 14px !important;
            height: 14px !important;
          }
          .vision-grid .modern-card h3 {
            font-size: 0.65rem !important;
            margin-bottom: 0.3rem !important;
          }
          .vision-grid .modern-card p, .vision-grid .modern-card ul {
            font-size: 0.45rem !important;
            line-height: 1.3 !important;
          }
          .vision-grid .modern-card ul {
            padding-left: 0.6rem !important;
            gap: 0.25rem !important;
          }

          .values-section {
            padding-left: 0.35rem !important;
            padding-right: 0.35rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
          .values-header {
            margin-bottom: 2rem !important;
          }
          .values-header h2 {
            font-size: 1.35rem !important;
          }
          .values-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
          }
          .values-card {
            padding: 0.4rem 0.25rem !important;
            border-radius: 0.6rem !important;
          }
          .values-card div {
            margin-bottom: 0.4rem !important;
          }
          .values-card div svg {
            width: 16px !important;
            height: 16px !important;
          }
          .values-card h4 {
            font-size: 0.6rem !important;
            line-height: 1.1 !important;
            margin-bottom: 0.25rem !important;
          }
          .values-card p {
            font-size: 0.42rem !important;
            line-height: 1.2 !important;
          }

          .team-section {
            padding-left: 0.35rem !important;
            padding-right: 0.35rem !important;
            padding-top: 3rem !important;
            padding-bottom: 3rem !important;
          }
          .team-header {
            margin-bottom: 2rem !important;
          }
          .team-header h2 {
            font-size: 1.35rem !important;
          }
          .team-header p {
            font-size: 0.7rem !important;
          }
          .team-grid {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 0.25rem !important;
            padding-left: 0px !important;
            padding-right: 0px !important;
          }
          .team-card {
            padding: 0.8rem 0.25rem !important;
            border-radius: 0.6rem !important;
          }
          .team-card div:first-child {
            margin-bottom: 0.6rem !important;
          }
          .team-card img {
            width: 44px !important;
            height: 44px !important;
            border-width: 2px !important;
          }
          .team-card h3 {
            font-size: 0.52rem !important;
            line-height: 1.1 !important;
          }
          .team-card p {
            font-size: 0.42rem !important;
            line-height: 1.1 !important;
            margin-top: 0.2rem !important;
          }
          .team-card div:last-child {
            gap: 0.5rem !important;
            margin-top: 0.5rem !important;
          }
          .team-card div:last-child svg {
            width: 12px !important;
            height: 12px !important;
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
        paddingLeft: "2rem", paddingRight: "2rem", paddingTop: "20rem", paddingBottom: "0px",
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.95)), url('/logoTentangKami.png')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll"
      }}>
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-block", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Infrastruktur Kepercayaan Rantai Pasok
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Memutus Rantai Tengkulak, <br />Membangun <span className="gradient-text">Harga yang Adil</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "720px", marginLeft: "auto", marginRight: "auto", marginBottom: "4rem" }}>
            PasarNusa mengubah peran perantara informal yang selama ini tidak transparan menjadi koperasi digital yang setiap margin, harga, dan transaksinya tercatat sistem dan dapat diaudit — dibuktikan lewat Indeks Harga Adil yang terukur, bukan sekadar janji.
          </p>
        </div>

        <div className="marquee-wrapper" style={{ zIndex: 2 }}>
          <div className="marquee-content">
            {[...marqueeImages, ...marqueeImages].map((img, index) => (
              <div key={index} className="marquee-img-card">
                <img src={img} alt={`Dokumentasi Komoditas Hulu ${index}`} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEKSI 1: AKAR PERMASALAHAN */}
      <section className="problem-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "7rem", paddingBottom: "7rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="problem-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div className="problem-left-heading">
            <span style={{ color: "#EF4444", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Akar Permasalahan</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Mengapa PasarNusa Harus Ada?</h2>
            <p style={{ color: "#64748B", fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem" }}>
              Empat kesenjangan berikut saling mengunci satu sama lain di lapangan — menjebak produsen pelosok dalam siklus ketergantungan pada tengkulak selama puluhan tahun.
            </p>
          </div>
          <div className="problem-grid-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div className="problem-mini-card" style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <AlertCircle size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Monopoli Harga Sepihak</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0px", marginBottom: "0px" }}>Produsen pelosok tidak tahu harga wajar komoditasnya, sehingga harga jual ditentukan sepihak oleh pembeli pertama yang datang ke lahan.</p>
            </div>
            <div className="problem-mini-card" style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <Layers size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Buta Rantai Pasok</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0px", marginBottom: "0px" }}>Pembeli di kota tidak memiliki visibilitas terhadap asal-usul komoditas dan kondisi nyata produsen di baliknya.</p>
            </div>
            <div className="problem-mini-card" style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <BarChart3 size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Nir-Jejak Transaksi</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0px", marginBottom: "0px" }}>Transaksi tunai tanpa catatan membuat produsen hulu tidak memiliki riwayat kredit untuk mengakses permodalan resmi.</p>
            </div>
            <div className="problem-mini-card" style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <MapPin size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Isolasi Geografis</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, marginTop: "0px", marginBottom: "0px" }}>Jarak ke pasar besar membuat biaya distribusi mandiri sering lebih mahal daripada selisih harga yang bisa diperoleh.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI 2: VISI MISI */}
      <section className="vision-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "6rem", paddingBottom: "6rem", backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div className="vision-grid" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
          
          <div className="modern-card" style={{ padding: "3.5rem", borderRadius: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", width: "64px", height: "64px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", marginBottom: "2rem", boxShadow: "0 10px 20px -5px rgba(37,99,235,0.15)" }}>
              <Eye size={32} />
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>Visi Kami</h3>
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.1rem", marginTop: "0px", marginBottom: "0px" }}>
              Menjadi infrastruktur rantai pasok rural paling dipercaya di Indonesia — tempat harga yang adil bukan lagi janji pemasaran, melainkan angka yang bisa dibuktikan setiap hari oleh sistemnya sendiri.
            </p>
          </div>

          <div className="modern-card" style={{ padding: "3.5rem", borderRadius: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", width: "64px", height: "64px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: "2rem", boxShadow: "0 10px 20px -5px rgba(16,185,129,0.15)" }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>Misi Kami</h3>
            <ul style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem", paddingLeft: "1.25rem", marginTop: "0px", marginBottom: "0px", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>Memangkas rantai distribusi tengkulak agar margin keuntungan kembali ke tangan produsen hulu, bukan perantara.</li>
              <li>Menjadikan setiap transaksi sebagai jejak digital yang membuka akses produsen ke layanan keuangan formal.</li>
              <li>Membangun jaringan logistik desa yang terpetakan dan dapat dilacak, memangkas biaya distribusi yang selama ini membebani produsen kecil.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* SEKSI 3: CORE VALUES */}
      <section className="values-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "7rem", paddingBottom: "7rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="values-header" style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span style={{ color: "#2563EB", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Bukan Klaim, Tapi Sistem</span>
          <h2 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Tiga Pilar yang Membuat Dampak Ini Nyata</h2>
        </div>

        <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div className="values-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#2563EB", marginBottom: "1.25rem" }}><Scale size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Indeks Harga Adil</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "0px", marginBottom: "0px" }}>Metrik kuantitatif yang membandingkan harga platform terhadap estimasi harga tengkulak — mengubah "harga adil" dari slogan menjadi angka yang bisa diverifikasi siapa pun.</p>
          </div>
          <div className="values-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#10B981", marginBottom: "1.25rem" }}><Zap size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Smart Restock Proaktif</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "0px", marginBottom: "0px" }}>Sistem pengingat otomatis berbasis jadwal panen riil, memungkinkan koperasi digital menjemput hasil panen lebih dulu daripada tengkulak konvensional.</p>
          </div>
          <div className="values-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#818CF8", marginBottom: "1.25rem" }}><Globe2 size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Escrow System Terjamin</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, marginTop: "0px", marginBottom: "0px" }}>Dana pembeli ditahan aman hingga barang diterima, baru dibagi otomatis ke dompet digital produsen dan toko — menghilangkan risiko gagal bayar sepenuhnya.</p>
          </div>
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section className="team-section" style={{ paddingLeft: "3rem", paddingRight: "3rem", paddingTop: "8rem", paddingBottom: "8rem", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
          <div className="team-header" style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{ color: "#38BDF8", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Di Balik Sistem</span>
            <h2 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Arsitek Platform</h2>
            <p style={{ color: "#64748B", marginTop: "0.75rem", fontSize: "1.1rem" }}>Tim kecil dengan target besar: membuktikan bahwa teknologi bisa memihak produsen kecil, bukan hanya pemain besar.</p>
          </div>

          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", paddingLeft: "1rem", paddingRight: "1rem" }}>
            
            <div className="modern-card team-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/raffi.png" alt="Mukhammad Raffi Zabra" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #38BDF8, #2563EB)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginTop: "0px", marginBottom: "0px" }}>Mukhammad Raffi Zabra</h3>
              <p style={{ color: "#2563EB", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", marginBottom: "0px" }}>Lead Developer &amp; Full Stack Developer</p>
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/rappizr/" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/Rappizr" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

            <div className="modern-card team-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/ringga.png" alt="Ringga Budi Utama" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginTop: "0px", marginBottom: "0px" }}>Ringga Budi Utama</h3>
              <p style={{ color: "#10B981", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", marginBottom: "0px" }}>Frontend Engineer &amp; System Analysis</p>
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/ringgabdy.___" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/ringgabudiutama" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

            <div className="modern-card team-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/rizal.png" alt="Afrizal Rafli Kusuma Wardana" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #D97706)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginTop: "0px", marginBottom: "0px" }}>Afrizal Rafli Kusuma Wardana</h3>
              <p style={{ color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", marginBottom: "0px" }}>Full Stack Developer</p>
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/afrzalrfli" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/rizalrfli" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

          </div>
        </div>
      </section>

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