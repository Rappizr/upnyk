'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Target, Eye, Layers, AlertCircle, MapPin, BarChart3, Scale, Globe2, Zap } from "lucide-react";
import { FaInstagram, FaGithub } from "react-icons/fa";

export default function TentangKamiPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  const galleryImages = ["/1.png", "/2.png", "/3.png", "/4.png", "/5.png", "/6.png"];

  const masalah = [
    { icon: AlertCircle, title: "Monopoli Harga Sepihak", desc: "Produsen pelosok tidak tahu harga wajar komoditasnya, sehingga harga jual ditentukan sepihak oleh pembeli pertama yang datang ke lahan." },
    { icon: Layers, title: "Buta Rantai Pasok", desc: "Pembeli di kota tidak memiliki visibilitas terhadap asal-usul komoditas dan kondisi nyata produsen di baliknya." },
    { icon: BarChart3, title: "Nir-Jejak Transaksi", desc: "Transaksi tunai tanpa catatan membuat produsen hulu tidak memiliki riwayat kredit untuk mengakses permodalan resmi." },
    { icon: MapPin, title: "Isolasi Geografis", desc: "Jarak ke pasar besar membuat biaya distribusi mandiri sering lebih mahal daripada selisih harga yang bisa diperoleh." }
  ];

  const pilar = [
    { icon: Scale, accent: "#12864E", soft: "#E7F3EC", title: "Indeks Harga Adil", desc: "Metrik kuantitatif yang membandingkan harga platform terhadap estimasi harga tengkulak — mengubah \u201charga adil\u201d dari slogan menjadi angka yang bisa diverifikasi siapa pun." },
    { icon: Zap, accent: "#D98A2B", soft: "#FBF0DF", title: "Smart Restock Proaktif", desc: "Sistem pengingat otomatis berbasis jadwal panen riil, memungkinkan koperasi digital menjemput hasil panen lebih dulu daripada tengkulak konvensional." },
    { icon: Globe2, accent: "#0E7490", soft: "#E1F1F4", title: "Escrow System Terjamin", desc: "Dana pembeli ditahan aman hingga barang diterima, baru dibagi otomatis ke dompet digital produsen dan toko — menghilangkan risiko gagal bayar sepenuhnya." }
  ];

  const tim = [
    { img: "/raffi.png", nama: "Mukhammad Raffi Zabra", peran: "Lead Developer & Full Stack Developer", warna: "#12864E", ig: "https://www.instagram.com/rappizr/", git: "https://github.com/Rappizr", pos: "center" },
    { img: "/ringga.png", nama: "Ringga Budi Utama", peran: "Frontend Engineer & System Analysis", warna: "#0E7490", ig: "https://www.instagram.com/ringgabdy.___", git: "https://github.com/ringgabudiutama", pos: "center top" },
    { img: "/rizal.png", nama: "Afrizal Rafli Kusuma Wardana", peran: "Full Stack Developer", warna: "#D98A2B", ig: "https://www.instagram.com/afrzalrfli", git: "https://github.com/rizalrfli", pos: "center top" }
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-sans), system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{__html: `
        .pn-root {
          --ink: #0C1F17;
          --paper: #F6F7F4;
          --card: #FFFFFF;
          --line: #E6E8E2;
          --muted: #5B6B60;
          --forest-1: #0A2018;
          --emerald: #12864E;
          --emerald-bright: #34D399;
          --harvest: #E1A140;
          --teal: #0E7490;
          --rust: #C0492F;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(246, 247, 244, 0.85)' : 'rgba(10, 32, 24, 0.12)'};
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(12,31,23,0.06)' : 'rgba(255,255,255,0.10)'};
          box-shadow: ${isScrolled ? '0 6px 34px rgba(10,32,24,0.06)' : 'none'};
        }
        .grad-text {
          background: linear-gradient(120deg, #6EE7B7 0%, #34D399 55%, #E1A140 130%);
          -webkit-background-clip: text; background-clip: text; -webkit-text-fill-color: transparent;
        }
        .modern-card {
          background: var(--card); border: 1px solid var(--line);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 10px 30px -14px rgba(10,32,24,0.06);
        }
        .modern-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 30px 56px -22px rgba(10,32,24,0.24);
          border-color: rgba(18,134,78,0.3);
        }
        .social-icon { color: #94A3B8; transition: all 0.3s ease; cursor: pointer; }
        .social-icon.ig:hover { color: #E1306C; transform: scale(1.15) translateY(-2px); }
        .social-icon.git:hover { color: #181717; transform: scale(1.15) translateY(-2px); }

        .gallery-grid {
          display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.25rem;
          max-width: 1200px; margin: 0 auto;
        }
        .gallery-card {
          position: relative; border-radius: 1.25rem; overflow: hidden; aspect-ratio: 16 / 10;
          border: 1px solid rgba(255,255,255,0.12); box-shadow: 0 18px 40px -22px rgba(0,0,0,0.5);
          transition: transform 0.4s cubic-bezier(0.4,0,0.2,1), box-shadow 0.4s ease;
        }
        .gallery-card::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(180deg, transparent 55%, rgba(10,32,24,0.55));
          opacity: 0; transition: opacity 0.4s ease;
        }
        .gallery-card img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s cubic-bezier(0.4,0,0.2,1); }
        .gallery-card:hover { transform: translateY(-6px); box-shadow: 0 30px 60px -24px rgba(0,0,0,0.6); }
        .gallery-card:hover img { transform: scale(1.06); }
        .gallery-card:hover::after { opacity: 1; }
        .gallery-tag {
          position: absolute; left: 0.9rem; bottom: 0.9rem; z-index: 2;
          color: #fff; font-size: 0.72rem; font-weight: 700; letter-spacing: 0.04em;
          opacity: 0; transform: translateY(6px); transition: all 0.4s ease;
        }
        .gallery-card:hover .gallery-tag { opacity: 1; transform: translateY(0); }

        .fade-in { animation: fadeUp 0.65s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }

       @media (max-width: 768px) {
  .header-container { padding: 0.5rem 0.7rem !important; }
  .nav-logo-text { font-size: 0.85rem !important; }
  .nav-logo-img { height: 20px !important; }
  .btn-back { padding: 0.3rem 0.6rem !important; font-size: 0.62rem !important; gap: 0.2rem !important; }
  .btn-back svg { width: 10px !important; height: 10px !important; }

  .hero-section { padding: 5rem 0.9rem 2.5rem !important; }
  .hero-badge { font-size: 0.55rem !important; padding: 0.3rem 0.7rem !important; margin-bottom: 0.8rem !important; }
  .hero-title { font-size: 1.4rem !important; line-height: 1.2 !important; }
  .hero-desc { font-size: 0.72rem !important; margin-bottom: 0 !important; }

  .gallery-section { padding: 2rem 0.9rem 2rem !important; }
  .gallery-section > div:first-child span { font-size: 0.6rem !important; }
  .gallery-section h2 { font-size: 1.15rem !important; }
  .gallery-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.4rem !important; }
  .gallery-card { border-radius: 0.5rem !important; }
  .gallery-tag { font-size: 0.5rem !important; left: 0.4rem !important; bottom: 0.4rem !important; }

  .problem-section { padding: 2.5rem 0.9rem !important; }
  .problem-grid-main { grid-template-columns: 1fr !important; gap: 1.2rem !important; }
  .problem-left-heading span { font-size: 0.62rem !important; }
  .problem-left-heading h2 { font-size: 1.3rem !important; }
  .problem-left-heading p { font-size: 0.72rem !important; margin-top: 0.5rem !important; }
  .problem-grid-cards { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
  .problem-mini-card { padding: 0.8rem !important; border-radius: 0.6rem !important; }
  .problem-mini-card > div { width: 30px !important; height: 30px !important; border-radius: 8px !important; margin-bottom: 0.5rem !important; }
  .problem-mini-card h4 { font-size: 0.78rem !important; margin-bottom: 0.25rem !important; }
  .problem-mini-card p { font-size: 0.64rem !important; line-height: 1.4 !important; }

  .vision-section { padding: 2.5rem 0.9rem !important; }
  .vision-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.6rem !important; }
  .vision-grid .modern-card { padding: 1rem 0.9rem !important; border-radius: 0.9rem !important; }
  .vision-grid .modern-card > div { width: 40px !important; height: 40px !important; border-radius: 12px !important; margin-bottom: 0.7rem !important; }
  .vision-grid .modern-card h3 { font-size: 0.95rem !important; margin-bottom: 0.5rem !important; }
  .vision-grid .modern-card p, .vision-grid .modern-card ul { font-size: 0.66rem !important; line-height: 1.5 !important; padding-left: 0.9rem !important; }
  .vision-grid .modern-card ul { gap: 0.4rem !important; }

  .values-section { padding: 2.5rem 0.9rem !important; }
  .values-header { margin-bottom: 1.5rem !important; }
  .values-header span { font-size: 0.6rem !important; }
  .values-header h2 { font-size: 1.25rem !important; }
  .values-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; }
  .values-card { padding: 0.85rem 0.6rem !important; border-radius: 0.7rem !important; }
  .values-card > div { width: 34px !important; height: 34px !important; border-radius: 9px !important; margin-bottom: 0.6rem !important; }
  .values-card h4 { font-size: 0.72rem !important; margin-bottom: 0.3rem !important; }
  .values-card p { font-size: 0.6rem !important; line-height: 1.35 !important; }

  .team-section { padding: 2.5rem 0.9rem !important; }
  .team-header { margin-bottom: 1.5rem !important; }
  .team-header span { font-size: 0.6rem !important; }
  .team-header h2 { font-size: 1.25rem !important; }
  .team-header p { font-size: 0.7rem !important; }
  .team-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.5rem !important; padding: 0 !important; }
  .team-card { padding: 0.9rem 0.5rem !important; border-radius: 0.8rem !important; }
  .team-card img { width: 60px !important; height: 60px !important; border: 2px solid var(--paper) !important; }
  .team-card h3 { font-size: 0.68rem !important; }
  .team-card p { font-size: 0.56rem !important; margin-top: 0.2rem !important; }
  .team-card > div:last-child { gap: 0.6rem !important; margin-top: 0.6rem !important; }
  .team-card svg { width: 14px !important; height: 14px !important; }

  .footer-container { padding: 1.5rem 0.9rem !important; }
  .footer-wrapper { flex-direction: column !important; align-items: flex-start !important; gap: 0.3rem !important; }
  .footer-wrapper span { font-size: 0.6rem !important; }
}
      `}} />

      {/* NAVBAR */}
      <header className="glass-nav header-container" style={{ padding: "0.9rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "36px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.02em", color: isScrolled ? "var(--ink)" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "var(--emerald)" : "var(--emerald-bright)" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back" style={{
            padding: "0.6rem 1.35rem", fontSize: "0.88rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? "var(--emerald)" : "#FFFFFF", color: isScrolled ? "#FFFFFF" : "var(--emerald)", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section" style={{
        padding: "13rem 2rem 5rem", textAlign: "center", position: "relative",
        backgroundImage: `linear-gradient(180deg, rgba(10,32,24,0.62), rgba(10,32,24,0.95)), url('/logoTentangKami.png')`,
        backgroundSize: "cover", backgroundPosition: "center"
      }}>
        <div className="fade-in" style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 1.2rem", borderRadius: "99px", background: "rgba(52,211,153,0.12)", border: "1px solid rgba(52,211,153,0.28)", color: "var(--emerald-bright)", fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.12em", marginBottom: "1.6rem", textTransform: "uppercase" }}>
            Infrastruktur Kepercayaan Rantai Pasok
          </div>
          <h1 className="hero-title" style={{ fontSize: "4rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.4rem", letterSpacing: "-0.035em" }}>
            Memutus Rantai Tengkulak,<br />Membangun <span className="grad-text">Harga yang Adil</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#C7D6CC", lineHeight: 1.7, fontWeight: 400, maxWidth: "720px", margin: "0 auto" }}>
            PasarNusa mengubah peran perantara informal yang tidak transparan menjadi koperasi digital yang setiap margin, harga, dan transaksinya tercatat sistem dan dapat diaudit — dibuktikan lewat Indeks Harga Adil yang terukur, bukan sekadar janji.
          </p>
        </div>
      </section>

      {/* GALERI DOKUMENTASI (pengganti marquee) */}
      <section className="gallery-section" style={{ padding: "5rem 3rem 6rem", maxWidth: "1280px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "2.6rem" }}>
          <span style={{ color: "var(--emerald)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Dari Lapangan</span>
          <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Dokumentasi Komoditas Hulu</h2>
        </div>
        <div className="gallery-grid">
          {galleryImages.map((img, i) => (
            <div key={i} className="gallery-card">
              <img src={img} alt={`Dokumentasi komoditas hulu ${i + 1}`} />
              <span className="gallery-tag">Komoditas Hulu · 0{i + 1}</span>
            </div>
          ))}
        </div>
      </section>

      {/* SEKSI 1: AKAR PERMASALAHAN */}
      <section className="problem-section" style={{ padding: "6rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="problem-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: "4rem", alignItems: "center" }}>
          <div className="problem-left-heading">
            <span style={{ color: "var(--rust)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.12em", textTransform: "uppercase" }}>Akar Permasalahan</span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.5rem", letterSpacing: "-0.03em", lineHeight: 1.18 }}>Mengapa PasarNusa Harus Ada?</h2>
            <p style={{ color: "var(--muted)", fontSize: "1.05rem", lineHeight: 1.7, marginTop: "1rem" }}>
              Empat kesenjangan berikut saling mengunci satu sama lain di lapangan — menjebak produsen pelosok dalam siklus ketergantungan pada tengkulak selama puluhan tahun.
            </p>
          </div>
          <div className="problem-grid-cards" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
            {masalah.map((m, i) => {
              const Icon = m.icon;
              return (
                <div key={i} className="problem-mini-card" style={{ padding: "1.5rem", background: "var(--card)", borderRadius: "1rem", border: "1px solid var(--line)", transition: "all 0.3s ease" }}>
                  <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: "rgba(192,73,47,0.10)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.9rem" }}>
                    <Icon size={20} color="var(--rust)" />
                  </div>
                  <h4 style={{ fontSize: "1.05rem", fontWeight: 700, color: "var(--ink)", marginBottom: "0.35rem" }}>{m.title}</h4>
                  <p style={{ color: "var(--muted)", fontSize: "0.85rem", lineHeight: 1.55, margin: 0 }}>{m.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* SEKSI 2: VISI MISI */}
      <section className="vision-section" style={{ padding: "6rem 3rem", backgroundColor: "var(--card)", borderTop: "1px solid var(--line)", borderBottom: "1px solid var(--line)" }}>
        <div className="vision-grid" style={{ maxWidth: "1200px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "2.5rem" }}>

          <div className="modern-card" style={{ padding: "3.2rem", borderRadius: "1.75rem" }}>
            <div style={{ background: "#E7F3EC", width: "64px", height: "64px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--emerald)", marginBottom: "1.75rem" }}>
              <Eye size={30} />
            </div>
            <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--ink)", marginBottom: "1.1rem", letterSpacing: "-0.02em" }}>Visi Kami</h3>
            <p style={{ color: "var(--muted)", lineHeight: 1.8, fontSize: "1.08rem", margin: 0 }}>
              Menjadi infrastruktur rantai pasok rural paling dipercaya di Indonesia — tempat harga yang adil bukan lagi janji pemasaran, melainkan angka yang bisa dibuktikan setiap hari oleh sistemnya sendiri.
            </p>
          </div>

          <div className="modern-card" style={{ padding: "3.2rem", borderRadius: "1.75rem" }}>
            <div style={{ background: "#E1F1F4", width: "64px", height: "64px", borderRadius: "18px", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--teal)", marginBottom: "1.75rem" }}>
              <Target size={30} />
            </div>
            <h3 style={{ fontSize: "1.7rem", fontWeight: 800, color: "var(--ink)", marginBottom: "1.1rem", letterSpacing: "-0.02em" }}>Misi Kami</h3>
            <ul style={{ color: "var(--muted)", lineHeight: 1.75, fontSize: "1.02rem", paddingLeft: "1.2rem", margin: 0, display: "flex", flexDirection: "column", gap: "0.7rem" }}>
              <li>Memangkas rantai distribusi tengkulak agar margin keuntungan kembali ke tangan produsen hulu, bukan perantara.</li>
              <li>Menjadikan setiap transaksi sebagai jejak digital yang membuka akses produsen ke layanan keuangan formal.</li>
              <li>Membangun jaringan logistik desa yang terpetakan dan dapat dilacak, memangkas biaya distribusi yang membebani produsen kecil.</li>
            </ul>
          </div>

        </div>
      </section>

      {/* SEKSI 3: TIGA PILAR */}
      <section className="values-section" style={{ padding: "7rem 3rem", maxWidth: "1200px", margin: "0 auto" }}>
        <div className="values-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
          <span style={{ color: "var(--emerald)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Bukan Klaim, Tapi Sistem</span>
          <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.5rem", letterSpacing: "-0.03em" }}>Tiga Pilar yang Membuat Dampak Ini Nyata</h2>
        </div>

        <div className="values-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.75rem" }}>
          {pilar.map((p, i) => {
            const Icon = p.icon;
            return (
              <div key={i} className="modern-card values-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.5rem" }}>
                <div style={{ color: p.accent, background: p.soft, width: "58px", height: "58px", borderRadius: "15px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.4rem" }}>
                  <Icon size={28} />
                </div>
                <h4 style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--ink)", marginBottom: "0.6rem", letterSpacing: "-0.02em" }}>{p.title}</h4>
                <p style={{ color: "var(--muted)", fontSize: "0.95rem", lineHeight: 1.65, margin: 0 }}>{p.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* TIM PENGEMBANG */}
      <section className="team-section" style={{ padding: "7rem 3rem", background: "var(--paper)", borderTop: "1px solid var(--line)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div className="team-header" style={{ textAlign: "center", marginBottom: "4rem" }}>
            <span style={{ color: "var(--harvest)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Di Balik Sistem</span>
            <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.5rem", letterSpacing: "-0.03em" }}>Arsitek Platform</h2>
            <p style={{ color: "var(--muted)", marginTop: "0.75rem", fontSize: "1.08rem", maxWidth: "620px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.6 }}>Tim kecil dengan target besar: membuktikan bahwa teknologi bisa memihak produsen kecil, bukan hanya pemain besar.</p>
          </div>

          <div className="team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2.2rem" }}>
            {tim.map((t, i) => (
              <div key={i} className="modern-card team-card" style={{ padding: "3rem 2rem", borderRadius: "1.75rem", textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{ position: "relative", marginBottom: "1.5rem" }}>
                  <img src={t.img} alt={t.nama} style={{ width: "110px", height: "110px", borderRadius: "50%", objectFit: "cover", objectPosition: t.pos, border: "4px solid var(--paper)", zIndex: 2, position: "relative" }} />
                  <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", background: t.warna, zIndex: 1, opacity: 0.35, filter: "blur(10px)" }} />
                </div>
                <h3 style={{ fontSize: "1.28rem", fontWeight: 800, color: "var(--ink)", margin: 0 }}>{t.nama}</h3>
                <p style={{ color: t.warna, fontWeight: 700, fontSize: "0.9rem", marginTop: "0.35rem", marginBottom: 0 }}>{t.peran}</p>
                <div style={{ display: "flex", gap: "1.25rem", marginTop: "1.5rem" }}>
                  <a href={t.ig} target="_blank" rel="noopener noreferrer" className="social-icon ig"><FaInstagram size={22} /></a>
                  <a href={t.git} target="_blank" rel="noopener noreferrer" className="social-icon git"><FaGithub size={22} /></a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer-container" style={{ padding: "3rem 4rem", background: "var(--forest-1)", color: "#8D9C91", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.88rem" }}>
          <span style={{ color: "#9AA99F" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}