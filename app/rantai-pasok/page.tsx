'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Layers, User, Store, ShieldAlert, ArrowRight, Map, Activity, RefreshCw, Wallet } from "lucide-react";

export default function EkosistemPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'alur' | 'roles'>('alur');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const alurLangkah = [
    { no: "01", judul: "Input Komoditas", sub: "Produsen (Hulu)", desc: "Petani/Peternak memasukkan data kuantitas stok hasil panen dan patokan harga harian langsung dari lahan melalui aplikasi." },
    { no: "02", judul: "Smart Restock & Borongan", sub: "Admin Toko / Koperasi", desc: "Sistem AI mengingatkan jadwal panen, memicu Admin Toko membuat pesanan borongan secara proaktif sebelum tengkulak konvensional datang." },
    { no: "03", judul: "Quality Grading & Etalase", sub: "Standardisasi Mutu", desc: "Komoditas disetor ke gudang digital, diperiksa kualitasnya (Grade A/B/C) oleh Admin Toko, dan otomatis masuk ke etalase publik." },
    { no: "04", judul: "Transaksi & Escrow System", sub: "Pembeli (Hilir)", desc: "Pembeli memesan produk melalui marketplace. Dana ditahan dengan aman oleh sistem Escrow PasarNusa demi proteksi transaksi." },
    { no: "05", judul: "Otomatisasi Split Wallet", sub: "Pencarian & Inklusi", desc: "Ketika pesanan dikonfirmasi sampai, Escrow membagi dana secara otomatis: persentase keuntungan ke Admin Toko, dan margin utama langsung masuk ke Wallet Produsen." }
  ];

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
        .node-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .node-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.1);
          border-color: rgba(56, 189, 248, 0.4);
        }
        .tab-btn {
          padding: 0.75rem 2rem;
          font-size: 0.95rem;
          font-weight: 700;
          border-radius: 99px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
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

      {/* HERO SECTION EKOSISTEM */}
      <section style={{ 
        padding: "13rem 2rem 6rem", 
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"
      }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: "99px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#10B981", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Ecosystem Architecture
          </div>
          <h1 style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Infrastruktur Rantai Pasok <br /><span className="gradient-text">End-to-End</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", margin: "0 auto 3rem" }}>
            Visualisasi pemetaan jaringan logistik hulu, tata kelola koperasi digital, transparansi distribusi, hingga audit Indeks Harga Adil nasional PasarNusa.
          </p>

          {/* TOGGLE TABS INTERAKTIF UNTUK DEMO JURI */}
          <div style={{ display: "inline-flex", background: "rgba(255,255,255,0.08)", padding: "0.35rem", borderRadius: "99px", backdropFilter: "blur(8px)", border: "1px solid rgba(255,255,255,0.15)" }}>
            <button onClick={() => setActiveTab('alur')} className="tab-btn" style={{ background: activeTab === 'alur' ? '#38BDF8' : 'transparent', color: activeTab === 'alur' ? '#0F172A' : '#FFFFFF' }}>
              Alur Bisnis Utama
            </button>
            <button onClick={() => setActiveTab('roles')} className="tab-btn" style={{ background: activeTab === 'roles' ? '#38BDF8' : 'transparent', color: activeTab === 'roles' ? '#0F172A' : '#FFFFFF' }}>
              Peran 4 Role Inti
            </button>
          </div>
        </div>
      </section>

      {/* KONTEN DINAMIS BERDASARKAN SELEKSI TAB */}
      <main style={{ padding: "6rem 2rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        {activeTab === 'alur' && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "4rem" }}>
              <span style={{ color: "#2563EB", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Siklus Transaksi</span>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Aliran Komoditas &amp; Finansial</h2>
            </div>

            {/* TIMELINE ALUR VERTIKAL DENGAN INFO SOLID */}
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem", maxWidth: "850px", margin: "0 auto" }}>
              {alurLangkah.map((langkah, index) => (
                <div key={index} className="node-card" style={{ padding: "2rem", borderRadius: "1.5rem", display: "flex", gap: "2rem", alignItems: "center" }}>
                  <div style={{ fontSize: "2.5rem", fontWeight: 900, color: "#E2E8F0", fontFamily: "monospace", minWidth: "60px" }}>
                    {langkah.no}
                  </div>
                  <div style={{ flexGrow: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", flexWrap: "wrap" }}>
                      <h4 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800, color: "#0F172A" }}>{langkah.judul}</h4>
                      <span style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.2rem 0.75rem", borderRadius: "99px", fontSize: "0.75rem", fontWeight: 700 }}>{langkah.sub}</span>
                    </div>
                    <p style={{ color: "#64748B", margin: "0.5rem 0 0", fontSize: "0.95rem", lineHeight: 1.6 }}>{langkah.desc}</p>
                  </div>
                  {index < alurLangkah.length - 1 && (
                    <div style={{ color: "#94A3B8", display: "none" }}><ArrowRight size={24} /></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "5rem" }}>
              <span style={{ color: "#10B981", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Hak Akses</span>
              <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#0F172A", marginTop: "0.5rem", letterSpacing: "-0.02em" }}>Matriks Hak Akses &amp; Fitur Sistem</h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "2rem" }}>
              
              {/* Role 1: Super Admin */}
              <div className="node-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.75rem" }}>
                <div style={{ color: "#38BDF8", background: "rgba(56,189,248,0.1)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}><ShieldAlert size={28} /></div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>Super Admin</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>Memegang kendali pengawasan ekosistem pasar, audit, dan intervensi data makro perdagangan.</p>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                  <span>• Monitor GMV &amp; Perutaran Dana</span>
                  <span>• Analitik Peta Rantai Pasok</span>
                  <span>• Kontrol Laporan Dampak Sosial</span>
                </div>
              </div>

              {/* Role 2: Produsen */}
              <div className="node-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.75rem" }}>
                <div style={{ color: "#2563EB", background: "rgba(37,99,235,0.1)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}><User size={28} /></div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>Produsen Hulu</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>Pelaku utama (petani, peternak, pengrajin) yang mengelola pasokan hasil panen mentah asli.</p>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                  <span>• Pemantauan Indeks Harga Adil</span>
                  <span>• Input Komoditas Lahan (Stok)</span>
                  <span>• Manajemen Pencairan Saldo Wallet</span>
                </div>
              </div>

              {/* Role 3: Admin Toko */}
              <div className="node-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.75rem" }}>
                <div style={{ color: "#10B981", background: "rgba(16,185,129,0.1)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}><Store size={28} /></div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>Admin Toko / Koperasi</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>Entitas perantara transparan penanggung jawab logistik gudang desa dan kontrol standarisasi kualitas.</p>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                  <span>• Fitur Proaktif Smart Restock</span>
                  <span>• Buku Kas Digital &amp; Audit Margin</span>
                  <span>• Penilaian Kualitas (Grading A/B/C)</span>
                </div>
              </div>

              {/* Role 4: Pembeli */}
              <div className="node-card" style={{ padding: "2.5rem 2rem", borderRadius: "1.75rem" }}>
                <div style={{ color: "#F59E0B", background: "rgba(245,158,11,0.1)", width: "50px", height: "50px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "1.5rem" }}><Activity size={28} /></div>
                <h3 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0F172A", marginBottom: "0.5rem" }}>Pembeli (B2B / B2C)</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>Konsumen akhir/korporasi yang membeli produk hulu pelosok dengan visibilitas asal usul cerita yang jelas.</p>
                <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", color: "#475569", fontWeight: 500 }}>
                  <span>• Modul Kisah Produsen Asli</span>
                  <span>• Proteksi Keamanan Sistem Escrow</span>
                  <span>• Pelacakan Kurir Real-time Map</span>
                </div>
              </div>

            </div>
          </div>
        )}

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