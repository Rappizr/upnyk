'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Eye, Code, Scale, Layers, AlertCircle, MapPin, BarChart3, Globe2, Zap } from "lucide-react";
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
          padding: 0 0 4rem 0; 
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
      `}} />

      {/* NAVBAR */}
      <header className="glass-nav" style={{ padding: "1rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img src="/logo.png" alt="Logo" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span style={{ fontSize: "1.5rem", fontWeight: 800, color: isScrolled ? "#1E293B" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "#2563EB" : "#38BDF8" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" style={{ 
            padding: "0.6rem 1.5rem", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? "#2563EB" : "#FFFFFF", color: isScrolled ? "#FFFFFF" : "#2563EB", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* HERO SECTION - SEKARANG MENAMPUNG KARTU BERJALAN DI DALAMNYA */}
      <section style={{ 
        padding: "20rem 2rem 0rem", 
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.55), rgba(15, 23, 42, 0.95)), url('/logoTentangKami.png')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"
      }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: "99px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Konsep &amp; Infrastruktur Kepercayaan
          </div>
          <h1 style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Menyambungkan Potensi Rural <br />Lewat <span className="gradient-text">Rantai Pasok Adil</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "720px", margin: "0 auto 4rem" }}>
            PasarNusa mentransformasi peran perantara informal konvensional menjadi entitas koperasi digital transparan yang margin keuntungan dan sistem transaksinya dapat diaudit penuh oleh sistem.
          </p>
        </div>

        {/* FOTO BERJALAN BERADA DI ATAS BACKGROUND HERO UTAMA */}
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

      {/* SEKSI 1: MASALAH YANG DIANGKAT */}
      <section style={{ padding: "7rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div>
            <span style={{ color: "#EF4444", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Akar Permasalahan</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em", lineHeight: 1.2 }}>Mengapa PasarNusa Harus Ada?</h2>
            <p style={{ color: "#64748B", fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem" }}>
              Tata niaga komoditas hulu di daerah pelosok masih terjebak dalam lingkaran rantai pasok informal yang merugikan para pelaku usaha lokal.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <AlertCircle size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Monopoli Tengkulak</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>Produsen pelosok bergantung penuh pada tengkulak dengan harga sepihak yang tidak transparan.</p>
            </div>
            <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <Layers size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Buta Rantai Pasok</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>Pembeli akhir di kota tidak memiliki visibilitas asal-usul komoditas dan kondisi asli produsen.</p>
            </div>
            <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <BarChart3 size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Nir-Jejak Transaksi</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>Ketiadaan riwayat digital membuat produsen hulu kesulitan mengakses lembaga permodalan resmi.</p>
            </div>
            <div style={{ padding: "1.5rem", background: "#ffffff", borderRadius: "1rem", border: "1px solid #F1F5F9" }}>
              <MapPin size={24} color="#EF4444" style={{ marginBottom: "0.75rem" }} />
              <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.35rem" }}>Isolasi Geografis</h4>
              <p style={{ color: "#64748B", fontSize: "0.85rem", lineHeight: 1.5, margin: 0 }}>Keterbatasan informasi logistik menghambat intervensi kebijakan publik yang produktif.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SEKSI 2: VISI MISI */}
      <section style={{ padding: "6rem 3rem", backgroundColor: "#FFFFFF", borderTop: "1px solid #E2E8F0", borderBottom: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>
          <div className="modern-card" style={{ padding: "3.5rem", borderRadius: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #EFF6FF, #DBEAFE)", width: "64px", height: "64px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", marginBottom: "2rem", boxShadow: "0 10px 20px -5px rgba(37,99,235,0.15)" }}>
              <Eye size={32} />
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>Visi Kami</h3>
            <p style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.1rem" }}>
              Menjadi pionir utama arsitektur digital rantai pasok rural di Indonesia yang andal, mewujudkan pemerataan ekonomi daerah, dan mempercepat kedaulatan digital komoditas lokal.
            </p>
          </div>

          <div className="modern-card" style={{ padding: "3.5rem", borderRadius: "2rem" }}>
            <div style={{ background: "linear-gradient(135deg, #ECFDF5, #D1FAE5)", width: "64px", height: "64px", borderRadius: "20px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: "2rem", boxShadow: "0 10px 20px -5px rgba(16,185,129,0.15)" }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1.25rem", letterSpacing: "-0.02em" }}>Misi Kami</h3>
            <ul style={{ color: "#475569", lineHeight: 1.8, fontSize: "1.05rem", paddingLeft: "1.25rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <li>Memangkas rantai distribusi panjang demi mendongkrak margin pendapatan produsen hulu.</li>
              <li>Menyediakan pengolahan data inventaris cerdas (*intelligent automated restocking*).</li>
              <li>Membangun jalur logistik terintegrasi berbiaya rendah antar-klaster pedesaan.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SEKSI 3: CORE VALUES */}
      <section style={{ padding: "7rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "5rem" }}>
          <span style={{ color: "#2563EB", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Prinsip Kerja Produk</span>
          <h2 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Pilar Nilai Tambah PasarNusa</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem" }}>
          <div style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#2563EB", marginBottom: "1.25rem" }}><Scale size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Indeks Harga Adil</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>Indikator kuantitatif sistem penilai selisih harga platform terhadap tengkulak konvensional guna menjamin transparansi absolut.</p>
          </div>
          <div style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#10B981", marginBottom: "1.25rem" }}><Zap size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Smart Restock Proaktif</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>Sistem otomasi pengingat berkala berbasis siklus panen riil, memicu Admin Toko menjemput komoditas tepat waktu.</p>
          </div>
          <div style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", border: "1px solid #E2E8F0", background: "#ffffff" }}>
            <div style={{ color: "#818CF8", marginBottom: "1.25rem" }}><Globe2 size={32} /></div>
            <h4 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#0F172A", marginBottom: "0.5rem" }}>Escrow System Terbagi</h4>
            <p style={{ color: "#64748B", fontSize: "0.95rem", lineHeight: 1.6, margin: 0 }}>Sistem penahanan dana aman yang membagi hasil penjualan secara otomatis ke wallet dompet digital produsen hulu.</p>
          </div>
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section style={{ padding: "8rem 3rem", background: "#F8FAFC", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "5rem" }}>
            <span style={{ color: "#38BDF8", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Di Balik Sistem</span>
            <h2 style={{ fontSize: "2.75rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Arsitek Platform</h2>
            <p style={{ color: "#64748B", marginTop: "0.75rem", fontSize: "1.1rem" }}>Dikembangkan secara solid oleh tim berdedikasi tinggi demi kemajuan ekonomi digital nasional.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.5rem", padding: "0 1rem" }}>
            
            {/* Developer 1: Raffi */}
            <div className="modern-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/raffi.jpeg" alt="Mukhammad Raffi Zabra" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #38BDF8, #2563EB)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>Mukhammad Raffi Zabra</h3>
              <p style={{ color: "#2563EB", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", margin: 0 }}>Lead Developer &amp; Full Stack Developer</p>
              
              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/rappizr/" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/Rappizr" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

            {/* Developer 2: Ringga */}
            <div className="modern-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/ringga.jpg" alt="Ringga Budi Utama" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #10B981, #059669)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>Ringga Budi Utama</h3>
              <p style={{ color: "#10B981", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", margin: 0 }}>Frontend Engineer &amp; System Analysis</p>

              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/ringgabdy.___" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/ringgabudiutama" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

            {/* Developer 3: Rizal */}
            <div className="modern-card" style={{ padding: "3rem 2rem", borderRadius: "2rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                <img src="/rizal.jpeg" alt="Afrizal Rafli Kusuma Wardana" style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", objectPosition: "center top", border: "4px solid #F1F5F9", zIndex: 2, position: "relative" }} />
                <div style={{ position: "absolute", inset: "-4px", borderRadius: "50%", background: "linear-gradient(135deg, #F59E0B, #D97706)", zIndex: 1, opacity: 0.3, filter: "blur(8px)" }} />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>Afrizal Rafli Kusuma Wardana</h3>
              <p style={{ color: "#F59E0B", fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", margin: 0 }}>Full Stack Developer</p>

              <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                <a href="https://www.instagram.com/afrzalrfli" target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                <a href="https://github.com/rizalrfli" target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER PREMIUM */}
      <footer style={{ padding: "3rem 4rem", background: "#0B1120", color: "#475569", textAlign: "center", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#64748B" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#475569" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}