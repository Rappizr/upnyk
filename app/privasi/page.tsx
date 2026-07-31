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
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    }, { threshold: 0.12 });
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
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-sans), system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{__html: `
     
        .pn-root {
          --ink: #101C16;
          --paper: #F6F8F5;
          --card: #FFFFFF;
          --line: #E3EAE3;
          --muted: #6B7A70;
          --body: #47554C;
          --forest-1: #051B11;
          --green: #0A4D2E;
          --green-lift: #0F6337;
          --emerald: #16A34A;
          --harvest: #B45309;
          --alert: #B3402A;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(252, 253, 252, 0.92)' : 'rgba(252, 253, 252, 0.70)'};
          backdrop-filter: saturate(180%) blur(14px);
          -webkit-backdrop-filter: saturate(180%) blur(14px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(16,28,22,0.07)' : 'transparent'};
          box-shadow: ${isScrolled ? '0 6px 24px rgba(6,40,24,0.06)' : 'none'};
          transition: background .35s ease, box-shadow .35s ease, border-color .35s ease;
        }
        .gradient-text { color: var(--green); font-weight: 800; }

        .btn-primary {
          background: linear-gradient(180deg, var(--green-lift) 0%, var(--green) 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 6px 18px rgba(10,77,46,0.26), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
        }
        .btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0) scale(.985); }

        .pn-root a:focus-visible, .pn-root button:focus-visible {
          outline: 2px solid var(--emerald); outline-offset: 3px; border-radius: 6px;
        }

        .hero-section::before {
          content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            linear-gradient(96deg, var(--paper) 0%, var(--paper) 30%, rgba(246,248,245,0.90) 52%, rgba(246,248,245,0.34) 80%, rgba(246,248,245,0.10) 100%),
            linear-gradient(180deg, rgba(246,248,245,0.6) 0%, transparent 24%);
        }
        .hero-section::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 110px; z-index: 0;
          pointer-events: none; background: linear-gradient(180deg, transparent, var(--paper) 92%);
        }

      
        .policy-card {
          position: relative; overflow: hidden;
          background: var(--card); padding: 2.5rem; border-radius: 1.35rem;
          border: 1px solid var(--line);
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 8px 20px rgba(6,40,24,.04);
          margin-bottom: 2rem;
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease, border-color .32s ease;
        }
        .policy-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--accent, var(--green)); opacity: .85;
          transition: opacity .3s ease, height .3s ease;
        }
        .policy-card:hover {
          border-color: rgba(10,77,46,0.22);
          box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 18px 38px rgba(6,40,24,.10);
          transform: translateY(-3px);
        }
        .policy-card:hover::before { opacity: 1; height: 4px; }

        .list-item { display: flex; gap: 0.75rem; align-items: flex-start; color: var(--body); font-size: 1rem; line-height: 1.65; margin-bottom: 0.75rem; }
        .list-item strong { color: var(--ink); }

    
        @media (max-width: 768px) {
          .header-container { padding: 0.75rem 1rem !important; }
          .nav-logo-text { font-size: 1.15rem !important; }
          .nav-logo-img { height: 28px !important; }

          .btn-back {
            padding: 0.4rem 0.85rem !important;
            font-size: 0.75rem !important;
            gap: 0.35rem !important;
          }
          .btn-back svg { width: 14px !important; height: 14px !important; }

          .hero-section { padding: 6.75rem 1.25rem 3rem 1.25rem !important; }
          .hero-badge { font-size: 0.65rem !important; padding: 0.35rem 0.85rem !important; margin-bottom: 1.1rem !important; }
          .hero-title { font-size: 2.25rem !important; line-height: 1.18 !important; letter-spacing: -0.02em !important; }
          .hero-desc { font-size: 0.9rem !important; line-height: 1.6 !important; }

          .main-content { padding: 2.5rem 1.25rem 3.5rem 1.25rem !important; }
          .intro-block h3 { font-size: 1.3rem !important; }
          .intro-block p { font-size: 0.9rem !important; line-height: 1.65 !important; }

          .policy-card { padding: 1.25rem !important; border-radius: 1rem !important; margin-bottom: 1.1rem !important; }
          .policy-card div:first-child { display: flex !important; flex-wrap: nowrap !important; gap: 0.65rem !important; margin-bottom: 0.9rem !important; }
          .policy-card div:first-child div { padding: 0.4rem !important; border-radius: 0.55rem !important; flex-shrink: 0 !important; }
          .policy-card div:first-child div svg { width: 18px !important; height: 18px !important; }
          .policy-card h2 { font-size: 1.02rem !important; line-height: 1.3 !important; }
          .policy-card p { font-size: 0.85rem !important; line-height: 1.6 !important; }

          .list-item { gap: 0.5rem !important; font-size: 0.82rem !important; line-height: 1.55 !important; margin-bottom: 0.7rem !important; }
          .list-item svg { width: 15px !important; height: 15px !important; margin-top: 0.2rem !important; flex-shrink: 0 !important; }

          .meta-update-row { margin-top: 2rem !important; padding-top: 1.25rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.75rem !important; }
          .meta-update-row div, .meta-update-row a { font-size: 0.8rem !important; }

          .footer-container { padding: 2rem 1.25rem !important; }
          .footer-wrapper { flex-direction: column !important; text-align: center !important; gap: 0.5rem !important; }
          .footer-wrapper span { font-size: 0.75rem !important; line-height: 1.4 !important; }

        
          .hero-section::before {
            background: linear-gradient(180deg, var(--paper) 0%, rgba(246,248,245,0.98) 48%, rgba(246,248,245,0.86) 76%, rgba(246,248,245,0.6) 100%) !important;
          }
          .hero-section::after { height: 60px !important; }
          .policy-card::before { height: 2px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pn-root *, .pn-root *::before, .pn-root *::after {
            animation-duration: .001ms !important; animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}} />

      <header className="glass-nav header-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo" style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.5rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            Pasar<span style={{ color: "var(--green)" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back btn-primary" style={{
            paddingTop: "0.6rem", paddingBottom: "0.6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            borderRadius: "99px", textDecoration: "none"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      <section className="hero-section" style={{
        paddingTop: "12rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundColor: "var(--paper)",
        backgroundImage: `url('https://images.unsplash.com/photo-1574105079631-4f915922b61b?q=80&w=1600&auto=format&fit=crop')`,
        backgroundSize: "cover",
        backgroundPosition: "center right",
        backgroundRepeat: "no-repeat"
      }}>
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.4rem", paddingBottom: "0.4rem", borderRadius: "99px", background: "rgba(10,77,46,0.08)", border: "1px solid rgba(10,77,46,0.24)", color: "var(--green)", fontWeight: 800, fontSize: "0.8rem", letterSpacing: "0.1em", marginBottom: "1.25rem", textTransform: "uppercase" }}>
            <Shield size={16} /> PERLINDUNGAN DATA EKOSISTEM
          </div>

          <h1 className="hero-title" style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-0.035em" }}>
            Kebijakan Privasi <br /><span className="gradient-text">Ekosistem PasarNusa</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: "1.1rem", color: "var(--body)", lineHeight: 1.7, fontWeight: 400, maxWidth: "750px", marginLeft: "auto", marginRight: "auto", marginBottom: "0px" }}>
            Data koordinat lahan, riwayat transaksi, dan saldo Wallet adalah aset paling sensitif bagi produsen pelosok. Berikut yang kami kumpulkan, kami pakai, dan kami lindungi secara transparan.
          </p>
        </div>
      </section>

      <main className="main-content" style={{ paddingTop: "4rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "900px", marginLeft: "auto", marginRight: "auto" }}>

        <Reveal>
          <div className="intro-block" style={{ marginBottom: "3.5rem", textAlign: "left" }}>
            <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--ink)", marginBottom: "1rem", letterSpacing: "-0.03em" }}>Komitmen Privasi Kami</h3>
            <p style={{ color: "var(--body)", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
              PasarNusa mengoperasikan platform manajemen rantai pasok rural yang menghubungkan produsen pelosok, Admin Toko/koperasi, dan pembeli kota. Karena data yang kami kumpulkan langsung dari lapangan, koordinat lahan, riwayat panen, saldo digital, kebijakan ini menjelaskan secara spesifik apa yang kami kumpulkan, untuk apa, dan siapa yang bisa mengaksesnya. Tidak ada klausul yang sengaja dibuat kabur.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="policy-card" style={{ ["--accent" as any]: "var(--green)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(10,77,46,0.09)", padding: "0.75rem", borderRadius: "0.85rem", color: "var(--green)", display: "flex" }}><FileText size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>1. Data yang Kami Kumpulkan</h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Untuk menjalankan siklus transaksi hulu ke hilir secara valid, kami mengumpulkan jenis informasi berikut sesuai peran (role) akunmu:
            </p>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0A4D2E" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Profil Produsen:</strong> nama lengkap, nomor kontak, riwayat kelompok tani/peternak, koordinat GPS lahan produksi, serta jenis hasil bumi yang diinput melalui menu Produk/Stok.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0A4D2E" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Admin Toko/Koperasi:</strong> laporan Buku Kas digital, verifikasi legalitas usaha, margin keuntungan toko, dan hasil Quality Grading komoditas.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#0A4D2E" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Data Pembeli &amp; Finansial:</strong> alamat pengiriman, riwayat transaksi Marketplace, serta mutasi dana yang diproses melalui sistem Escrow.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={140}>
          <div className="policy-card" style={{ ["--accent" as any]: "var(--emerald)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(22,163,74,0.09)", padding: "0.75rem", borderRadius: "0.85rem", color: "var(--emerald)", display: "flex" }}><Eye size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>2. Bagaimana Kami Menggunakan Data Anda</h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, marginBottom: "1.25rem" }}>
              Informasi yang dikumpulkan dipakai untuk menggerakkan efisiensi rantai pasok secara proaktif, bukan untuk tujuan lain, dan bukan untuk dijual ke pihak ketiga mana pun:
            </p>
            <div className="list-item">
              <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Otomatisasi Smart Restock:</strong> menganalisis jadwal panen produsen untuk memberi pengingat borongan proaktif kepada Admin Toko binaan.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Kalkulasi Indeks Harga Adil:</strong> memproses data agregat selisih harga platform vs estimasi tengkulak untuk menyajikan metrik dampak sosial di Dashboard Super Admin.</span>
            </div>
            <div className="list-item">
              <CheckCircle2 size={18} color="#16A34A" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
              <span><strong>Pelacakan Logistik Terintegrasi:</strong> memetakan rute titik jemput produsen menuju gudang Admin Toko di Peta Rantai Pasok secara real-time.</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={200}>
          <div className="policy-card" style={{ ["--accent" as any]: "var(--alert)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(179,64,42,0.09)", padding: "0.75rem", borderRadius: "0.85rem", color: "var(--alert)", display: "flex" }}><Lock size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>3. Perlindungan &amp; Keamanan Data</h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, margin: 0 }}>
              Seluruh jejak transaksi digital, laporan audit keuangan, dan saldo Wallet Produsen dilindungi dengan enkripsi tingkat server. Dana dari pembeli dikunci oleh sistem Escrow dan baru didepositkan ke Wallet pihak yang berhak setelah status pengiriman dikonfirmasi selesai, bukan begitu transaksi dibuat dan bukan berdasarkan kepercayaan sepihak.
            </p>
          </div>
        </Reveal>

        <Reveal delay={260}>
          <div className="policy-card" style={{ ["--accent" as any]: "var(--harvest)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
              <div style={{ background: "rgba(180,83,9,0.09)", padding: "0.75rem", borderRadius: "0.85rem", color: "var(--harvest)", display: "flex" }}><Scale size={24} /></div>
              <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ink)", margin: 0, letterSpacing: "-0.02em" }}>4. Keterbukaan Data Pihak Ketiga &amp; Lembaga</h2>
            </div>
            <p style={{ color: "var(--body)", lineHeight: 1.7, margin: 0 }}>
              Sebagai bentuk dukungan pada inklusi keuangan, riwayat kredit dan buku kas digital produsen hulu dapat dibagikan kepada lembaga keuangan mitra (seperti penyedia kredit mikro) <strong>hanya jika</strong> pengguna yang bersangkutan memberi persetujuan eksplisit. Kami tidak menjual data pribadi kepada broker iklan komersial mana pun. Titik. Tanpa pengecualian tersembunyi di baris kecil.
            </p>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <div className="meta-update-row" style={{ borderTop: "1px solid var(--line)", paddingTop: "2rem", marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--muted)", fontSize: "0.9rem" }}>
              <Shield size={16} />
              <span>Terakhir diperbarui: 11 Juli 2026</span>
            </div>
            <Link href="/tentang-kami" style={{ color: "var(--green)", textDecoration: "none", fontSize: "0.9rem", fontWeight: 700 }}>Pelajari Konsep Platform &rarr;</Link>
          </div>
        </Reveal>

      </main>

      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "3rem", paddingBottom: "3rem", background: "var(--forest-1)", color: "#A3BDB0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#A3BDB0" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#7C9187" }}>Membangun Rantai Pasok yang Adil, Bukan Sekadar yang Ada.</span>
        </div>
      </footer>
    </div>
  );
}