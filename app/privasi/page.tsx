'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2, FileText, Scale } from "lucide-react";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function PrivasiPage() {
  const [isScrolled, setIsScrolled] = useState(false);

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
          background: linear-gradient(135deg, #34D399 0%, #059669 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(20px,-16px) scale(1.07); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; animation: floatBlob 15s ease-in-out infinite; }
        .policy-card {
          background: #ffffff; padding: 2.5rem; border-radius: 1.5rem; border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02); margin-bottom: 2rem; transition: box-shadow .3s ease, transform .3s ease;
        }
        .policy-card:hover { box-shadow: 0 20px 40px -20px rgba(5,150,105,0.15); transform: translateY(-3px); }
        .list-item { display: flex; gap: 0.75rem; align-items: flex-start; color: #475569; font-size: 1rem; line-height: 1.6; margin-bottom: 0.75rem; }

        @media (max-width: 768px) {
          .header-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .nav-logo-text { font-size: 0.85rem !important; }
          .nav-logo-img { height: 20px !important; }
          .btn-back { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; padding-left: 0.5rem !important; padding-right: 0.5rem !important; font-size: 0.55rem !important; gap: 0.2rem !important; }
          .btn-back svg { width: 10px !important; height: 10px !important; }
          .hero-section { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 6rem !important; padding-bottom: 3rem !important; }
          .hero-badge { font-size: 0.65rem !important; padding: 0.35rem 0.85rem !important; margin-bottom: 1rem !important; }
          .hero-title { font-size: 1.85rem !important; line-height: 1.25 !important; }
          .hero-desc { font-size: 0.85rem !important; }
          .main-content { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 3rem !important; padding-bottom: 3rem !important; }
          .intro-block h3 { font-size: 1.25rem !important; }
          .intro-block p { font-size: 0.85rem !important; line-height: 1.6 !important; }
          .policy-card { padding: 1rem !important; border-radius: 0.75rem !important; margin-bottom: 1rem !important; }
          .policy-card div:first-child { gap: 0.5rem !important; margin-bottom: 1rem !important; }
          .policy-card div:first-child div { padding: 0.4rem !important; border-radius: 0.5rem !important; }
          .policy-card div:first-child div svg { width: 18px !important; height: 18px !important; }
          .policy-card h2 { font-size: 0.95rem !important; }
          .policy-card p { font-size: 0.8rem !important; line-height: 1.5 !important; }
          .list-item { gap: 0.4rem !important; font-size: 0.75rem !important; line-height: 1.5 !important; margin-bottom: 0.6rem !important; }
          .list-item svg { width: 12px !important; height: 12px !important; margin-top: 0.15rem !important; }
          .meta-update-row { margin-top: 2.5rem !important; padding-top: 1.5rem !important; flex-direction: row !important; justify-content: space-between !important; align-items: center !important; }
          .meta-update-row div, .meta-update-row a { font-size: 0.65rem !important; }
          .meta-update-row div svg { width: 12px !important; height: 12px !important; }
          .footer-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .footer-wrapper { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; gap: 0px !important; }
          .footer-wrapper span { font-size: 0.42rem !important; line-height: 1.2 !important; }
        }
      `}} />

      <header className="glass-nav header-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.5rem", fontWeight: 800, color: isScrolled ? "#1E293B" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "#059669" : "#34D399" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back" style={{
            paddingTop: "0.6rem", paddingBottom: "0.6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? "#059669" : "#FFFFFF", color: isScrolled ? "#FFFFFF" : "#059669", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      <section className="hero-section" style={{
        paddingTop: "13rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: `linear-gradient(to bottom, rgba(6, 30, 24, 0.82), rgba(4, 15, 12, 0.97)), url('https://images.unsplash.com/photo-1574105079631-4f915922b61b?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll"
      }}>
        <div className="blob" style={{ width: 420, height: 420, background: "#34D399", opacity: 0.2, top: -120, left: -100 }} />
        <div className="blob" style={{ width: 360, height: 360, background: "#059669", opacity: 0.18, bottom: -140, right: -80, animationDelay: "4s" }} />
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-block", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Perlindungan Data, Bukan Sekadar Formalitas
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Kebijakan Privasi <br /><span className="gradient-text">Ekosistem PasarNusa</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "0px" }}>
            Data koordinat lahan, riwayat transaksi, dan saldo Wallet adalah aset paling sensitif bagi produsen pelosok — dan aset itu paling mudah disalahgunakan kalau kebijakannya cuma basa-basi. Berikut yang kami kumpulkan, kami pakai, dan kami lindungi, secara eksplisit tanpa istilah kabur.
          </p>
        </div>
      </section>

      <main className="main-content" style={{ paddingTop: "6rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>

        <Reveal>
          <div className="intro-block" style={{ marginBottom: "3.5rem", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem", letterSpacing: "-0.02em" }}>Komitmen Privasi Kami</h3>
            <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
              PasarNusa mengoperasikan platform manajemen rantai pasok rural yang menghubungkan produsen pelosok, Admin Toko/koperasi, dan pembeli kota. Karena data yang kami kumpulkan langsung dari lapangan — koordinat lahan, riwayat panen, saldo digital — kebijakan ini menjelaskan secara spesifik apa yang kami kumpulkan, untuk apa, dan siapa yang bisa mengaksesnya. Tidak ada klausul yang sengaja dibuat kabur.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="policy-card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#F0FDFA", padding: "0.5rem", borderRadius: "0.75rem", color: "#0D9488" }}><FileText size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>1. Data yang Kami Kumpulkan</h2>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Untuk menjalankan siklus transaksi hulu ke hilir secara valid, kami mengumpulkan jenis informasi berikut sesuai peran (role) akunmu:
            </p>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0D9488" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Profil Produsen:</strong> nama lengkap, nomor kontak, riwayat kelompok tani/peternak, koordinat GPS lahan produksi, serta jenis hasil bumi yang diinput melalui menu Produk/Stok.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0D9488" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Admin Toko/Koperasi:</strong> laporan Buku Kas digital, verifikasi legalitas usaha, margin keuntungan toko, dan hasil Quality Grading komoditas.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0D9488" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Pembeli &amp; Finansial:</strong> alamat pengiriman, riwayat transaksi Marketplace, serta mutasi dana yang diproses melalui sistem Escrow.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="policy-card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#ECFDF5", padding: "0.5rem", borderRadius: "0.75rem", color: "#10B981" }}><Eye size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>2. Bagaimana Kami Menggunakan Data Anda</h2>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Informasi yang dikumpulkan dipakai untuk menggerakkan efisiensi rantai pasok secara proaktif — bukan untuk tujuan lain, dan bukan untuk dijual ke pihak ketiga mana pun:
            </p>
            <div className="list-item">
              <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Otomatisasi Smart Restock:</strong> menganalisis jadwal panen produsen untuk memberi pengingat borongan proaktif kepada Admin Toko binaan.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Kalkulasi Indeks Harga Adil:</strong> memproses data agregat selisih harga platform vs estimasi tengkulak untuk menyajikan metrik dampak sosial di Dashboard Super Admin.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Pelacakan Logistik Terintegrasi:</strong> memetakan rute titik jemput produsen menuju gudang Admin Toko di Peta Rantai Pasok secara real-time.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="policy-card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#FEF2F2", padding: "0.5rem", borderRadius: "0.75rem", color: "#EF4444" }}><Lock size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>3. Perlindungan &amp; Keamanan Data</h2>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Seluruh jejak transaksi digital, laporan audit keuangan, dan saldo Wallet Produsen dilindungi dengan enkripsi tingkat server. Dana dari pembeli dikunci oleh sistem Escrow dan baru didepositkan ke Wallet pihak yang berhak setelah status pengiriman dikonfirmasi selesai — bukan begitu transaksi dibuat, dan bukan berdasarkan kepercayaan sepihak.
            </p>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="policy-card">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "#FFFBEB", padding: "0.5rem", borderRadius: "0.75rem", color: "#D97706" }}><Scale size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>4. Keterbukaan Data Pihak Ketiga &amp; Lembaga</h2>
            </div>
            <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
              Sebagai bentuk dukungan pada inklusi keuangan, riwayat kredit dan buku kas digital produsen hulu dapat dibagikan kepada lembaga keuangan mitra (seperti penyedia kredit mikro) <strong>hanya jika</strong> pengguna yang bersangkutan memberi persetujuan eksplisit. Kami tidak menjual data pribadi kepada broker iklan komersial mana pun — titik, tanpa pengecualian tersembunyi di baris kecil.
            </p>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="meta-update-row" style={{ borderTop: "1px solid #E2E8F0", paddingTop: "2rem", marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748B", fontSize: "0.9rem" }}>
              <Shield size={16} />
              <span>Terakhir diperbarui: 11 Juli 2026</span>
            </div>
            <Link href="/tentang-kami" style={{ color: "#059669", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Pelajari Konsep Platform &rarr;</Link>
          </div>
        </Reveal>

      </main>

      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "3rem", paddingBottom: "3rem", background: "#0B1120", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#64748B" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#475569" }}>Membangun Rantai Pasok yang Adil, Bukan Sekadar yang Ada.</span>
        </div>
      </footer>
    </div>
  );
}