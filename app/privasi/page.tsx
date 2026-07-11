'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye, CheckCircle2, UserCheck, Scale, FileText } from "lucide-react";

export default function PrivasiPage() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>
      
      {/* INJEKSI CSS MODERN */}
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
        .policy-card {
          background: #ffffff;
          padding: 2.5rem;
          border-radius: 1.5rem;
          border: 1px solid rgba(226, 232, 240, 0.8);
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.02);
          margin-bottom: 2rem;
        }
        .list-item {
          display: flex;
          gap: 0.75rem;
          align-items: flex-start;
          color: #475569;
          font-size: 1rem;
          line-height: 1.6;
          margin-bottom: 0.75rem;
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

      {/* HERO SECTION PRIVASI */}
      <section style={{ 
        padding: "13rem 2rem 6rem", 
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"
      }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: "99px", background: "rgba(56, 189, 248, 0.15)", border: "1px solid rgba(56, 189, 248, 0.3)", color: "#38BDF8", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Data Protection &amp; Security
          </div>
          <h1 style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Kebijakan Privasi <br /><span className="gradient-text">Ekosistem PasarNusa</span>
          </h1>
          <p style={{ fontSize: "1.2rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", margin: "0 auto" }}>
            Komitmen kami untuk melindungi riwayat digital, data transaksi, dan koordinat aset seluruh Produsen, Admin Toko, serta Pembeli secara aman dan transparan.
          </p>
        </div>
      </section>

      {/* ISI DOKUMEN KEBIJAKAN PRIVASI */}
      <main style={{ padding: "6rem 2rem", maxWidth: "900px", margin: "0 auto" }}>
        
        {/* PENGANTAR */}
        <div style={{ marginBottom: "3.5rem", textAlign: "left" }}>
          <h3 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#0F172A", marginBottom: "1rem", letterSpacing: "-0.02em" }}>Komitmen Privasi Kami</h3>
          <p style={{ color: "#475569", fontSize: "1.05rem", lineHeight: 1.7, margin: 0 }}>
            PasarNusa ("kami") mengoperasikan platform digital manajemen rantai pasok rural komoditas. Kami memahami bahwa pengumpulan data riil di daerah pelosok membutuhkan infrastruktur kepercayaan tingkat tinggi. Kebijakan Privasi ini menjelaskan bagaimana kami mengumpulkan, menggunakan, menjaga, dan membagikan data Anda ketika menggunakan ekosistem PasarNusa.
          </p>
        </div>

        {/* 1. DATA YANG KAMI KUMPULKAN */}
        <div className="policy-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#EFF6FF", padding: "0.5rem", borderRadius: "0.75rem", color: "#2563EB" }}><FileText size={24} /></div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>1. Data yang Kami Kumpulkan</h2>
          </div>
          <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Untuk menjalankan siklus transaksi hulu ke hilir secara valid, kami mengumpulkan jenis informasi berikut sesuai dengan peran (*role*) Anda:
          </p>
          <div className="list-item">
            <CheckCircle2 size={18} color="#2563EB" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Data Profil Produsen:</strong> Nama lengkap, nomor kontak, riwayat kelompok tani/peternak, koordinat GPS lahan produksi, serta jenis hasil bumi yang diinput melalui menu Produk/Stok.</span>
          </div>
          <div className="list-item">
            <CheckCircle2 size={18} color="#2563EB" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Data Admin Toko/Koperasi:</strong> Laporan Buku Kas digital, verifikasi legalitas usaha, margin keuntungan toko, dan data Quality Grading komoditas.</span>
          </div>
          <div className="list-item">
            <CheckCircle2 size={18} color="#2563EB" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Data Pembeli &amp; Finansial:</strong> Alamat pengiriman kota, riwayat transaksi Marketplace, serta mutasi dana yang terproses melalui sistem penahanan aman (*Escrow System*).</span>
          </div>
        </div>

        {/* 2. PENGGUNAAN DATA */}
        <div className="policy-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#ECFDF5", padding: "0.5rem", borderRadius: "0.75rem", color: "#10B981" }}><Eye size={24} /></div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>2. Bagaimana Kami Menggunakan Data Anda</h2>
          </div>
          <p style={{ color: "#475569", lineHeight: 1.7, marginBottom: "1.25rem" }}>
            Informasi yang dikumpulkan digunakan semata-mata untuk menggerakkan efisiensi rantai pasok komoditas secara proaktif, dengan rincian:
          </p>
          <div className="list-item">
            <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Otomatisasi Smart Restock:</strong> Menganalisis jadwal panen produsen untuk memberikan pengingat borongan proaktif kepada Admin Toko binaan.</span>
          </div>
          <div className="list-item">
            <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Kalkulasi Indeks Harga Adil:</strong> Memproses data agregat selisih harga platform vs estimasi tengkulak untuk menyajikan metrik dampak sosial kuantitatif pada Dashboard Super Admin.</span>
          </div>
          <div className="list-item">
            <CheckCircle2 size={18} color="#10B981" style={{ marginTop: "0.25rem", flexShrink: 0 }} />
            <span><strong>Pelacakan Logistik Terintegrasi:</strong> Memetakan rute titik jemput produsen menuju gudang penyimpanan Admin Toko pada Peta Rantai Pasok secara *real-time*.</span>
          </div>
        </div>

        {/* 3. KEAMANAN DATA */}
        <div className="policy-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#FEF2F2", padding: "0.5rem", borderRadius: "0.75rem", color: "#EF4444" }}><Lock size={24} /></div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>3. Perlindungan &amp; Keamanan Data</h2>
          </div>
          <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
            Seluruh jejak transaksi digital, laporan audit keuangan, dan saldo dompet digital (*Wallet Produsen*) dilindungi menggunakan enkripsi server tingkat tinggi. Penyaluran dana otomatis dari pembeli kota dikunci oleh sistem *Escrow* dan hanya didepositkan ke Wallet masing-masing pihak yang berhak setelah konfirmasi status pengiriman dinyatakan selesai.
          </p>
        </div>

        {/* 4. KETERBUKAAN DATA AUDIT */}
        <div className="policy-card">
          <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.5rem" }}>
            <div style={{ background: "#FFFBEB", padding: "0.5rem", borderRadius: "0.75rem", color: "#D97706" }}><Scale size={24} /></div>
            <h2 style={{ fontSize: "1.35rem", fontWeight: 800, color: "#0F172A", margin: 0 }}>4. Keterbukaan Data Pihak Ketiga &amp; Lembaga</h2>
          </div>
          <p style={{ color: "#475569", lineHeight: 1.7, margin: 0 }}>
            Sebagai bentuk dukungan nyata terhadap inklusi keuangan, riwayat kredit dan buku kas digital produsen hulu yang terekam dapat dibagikan kepada lembaga keuangan mitra (seperti penyedia kredit mikro) **hanya jika** mendapatkan persetujuan eksplisit dari pengguna yang bersangkutan. Kami tidak menjual data pribadi Anda kepada pihak broker iklan komersial mana pun.
          </p>
        </div>

        {/* TANGGAL UPDATE */}
        <div style={{ borderTop: "1px solid #E2E8F0", paddingTop: "2rem", marginTop: "4rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#64748B", fontSize: "0.9rem" }}>
            <Shield size={16} />
            <span>Terakhir diperbarui: 11 Juli 2026</span>
          </div>
          <Link href="/tentang-kami" style={{ color: "#2563EB", textDecoration: "none", fontSize: "0.9rem", fontWeight: 600 }}>Pelajari Konsep Platform &rarr;</Link>
        </div>

      </main>

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