'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Eye, Code} from "lucide-react";
import { FaInstagram, FaGithub } from "react-icons/fa";

export default function TentangKamiPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>
      
      {/* INJEKSI CSS */}
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
        }
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px -10px rgba(0,0,0,0.08);
          border-color: rgba(56, 189, 248, 0.3);
        }
        .social-icon {
          color: #94A3B8;
          transition: all 0.3s ease;
        }
        .social-icon.ig:hover { color: #E1306C; transform: scale(1.1); }
        .social-icon.git:hover { color: #181717; transform: scale(1.1); }
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
            backgroundColor: isScrolled ? "#F1F5F9" : "rgba(255,255,255,0.1)", color: isScrolled ? "#1E293B" : "#FFFFFF", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* HERO SECTION TENTANG KAMI */}
      <section style={{ 
        padding: "12rem 2rem 6rem", 
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.7), rgba(15, 23, 42, 0.9)), url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed"
      }}>
        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <h1 style={{ fontSize: "4rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.02em" }}>
            Mengenal Lebih Dekat <br /><span className="gradient-text">PasarNusa</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#CBD5E1", lineHeight: 1.6, fontWeight: 400 }}>
            Kami hadir sebagai jembatan digital yang menghubungkan potensi luar biasa dari pedesaan Indonesia langsung ke rantai pasok modern.
          </p>
        </div>
      </section>

      {/* KONTEN VISI MISI */}
      <section style={{ padding: "6rem 3rem", maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ color: "#2563EB", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Tujuan Utama Kami</span>
          <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem" }}>Visi & Misi PasarNusa</h2>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2rem" }}>
          <div className="modern-card" style={{ padding: "3rem", borderRadius: "1.5rem" }}>
            <div style={{ background: "#EFF6FF", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#2563EB", marginBottom: "1.5rem" }}>
              <Eye size={32} />
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>Visi Kami</h3>
            <p style={{ color: "#64748B", lineHeight: 1.7, fontSize: "1.05rem" }}>
              Menjadi ekosistem digitalisasi rantai pasok nomor satu di Indonesia yang mampu mengentaskan kesenjangan teknologi di daerah rural, serta memberdayakan UMKM lokal untuk bersaing di pasar global.
            </p>
          </div>

          <div className="modern-card" style={{ padding: "3rem", borderRadius: "1.5rem" }}>
            <div style={{ background: "#ECFDF5", width: "64px", height: "64px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", color: "#10B981", marginBottom: "1.5rem" }}>
              <Target size={32} />
            </div>
            <h3 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem" }}>Misi Kami</h3>
            <ul style={{ color: "#64748B", lineHeight: 1.7, fontSize: "1.05rem", paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              <li>Memotong rantai perantara yang merugikan petani dan produsen.</li>
              <li>Menyediakan platform manajemen stok dan inventaris yang cerdas.</li>
              <li>Memberikan transparansi penuh dalam proses transaksi B2B dan B2C.</li>
            </ul>
          </div>
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section style={{ padding: "6rem 3rem", background: "#FFFFFF", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ color: "#38BDF8", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Di Balik Layar</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem" }}>Tim Pengembang Kami</h2>
            <p style={{ color: "#64748B", marginTop: "1rem" }}>Sistem cerdas ini dikembangkan oleh tim berdedikasi tinggi.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "2rem" }}>
            
            <div className="modern-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
<img
  src="/raffi.jpeg"
  alt="Mukhammad Raffi Zabra"
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #E2E8F0",
    marginBottom: "1.5rem",
  }}
/>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>Mukhammad Raffi Zabra</h3>
              <p style={{ color: "#38BDF8", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.25rem" }}>Lead Developer</p>
              
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
                <a href="https://www.instagram.com/rappizr/" target="_blank" rel="noopener noreferrer" className="social-icon ig">
                  <FaInstagram size={20} />
                </a>
                <a href="https://github.com/Rappizr" target="_blank" rel="noopener noreferrer" className="social-icon git">
                  <FaGithub size={20} />
                </a>
              </div>
            </div>

            <div className="modern-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
<img
  src="/ringga.jpg"
  alt="Ringga"
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #E2E8F0",
    marginBottom: "1.5rem",
  }}
/>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>Ringga Budi Utama</h3>
              <p style={{ color: "#38BDF8", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.25rem" }}>Frontend Developer</p>

              <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
                <a href="https://www.instagram.com/ringgabdy.___" target="_blank" rel="noopener noreferrer" className="social-icon ig">
                  <FaInstagram size={20} />
                </a>
                <a href="https://github.com/ringgabudiutama" target="_blank" rel="noopener noreferrer" className="social-icon git">
                  <FaGithub size={20} />
                </a>
              </div>
            </div>

            <div className="modern-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
<img
  src="/rizal.jpeg"
  alt="Rizal"
  style={{
    width: "90px",
    height: "90px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "4px solid #E2E8F0",
    marginBottom: "1.5rem",
  }}
/>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, color: "#0F172A" }}>Rizal</h3>
              <p style={{ color: "#38BDF8", fontWeight: 600, fontSize: "0.85rem", marginTop: "0.25rem" }}>Full Stack Developer</p>

              {/* Social Icons */}
              <div style={{ display: "flex", gap: "1rem", marginTop: "1.25rem" }}>
                <a href="https://www.instagram.com/afrzalrfli" target="_blank" rel="noopener noreferrer" className="social-icon ig">
                  <FaInstagram size={20} />
                </a>
                <a href="https://github.com/rizalrfli" target="_blank" rel="noopener noreferrer" className="social-icon git">
                  <FaGithub size={20} />
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* FOOTER SEDERHANA */}
      <footer style={{ padding: "2rem 4rem", background: "#0B1120", color: "#94A3B8", textAlign: "center" }}>
        <div style={{ fontSize: "0.85rem", color: "#475569" }}>
          © 2026 PasarNusa & Supply Chain Platform. Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.
        </div>
      </footer>
    </div>
  );
}