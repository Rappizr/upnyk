'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, MapPin, Send, CheckCircle2, ShieldAlert, HelpCircle } from "lucide-react";

export default function KontakMitraPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    namaPelapor: '',
    rolePengguna: 'produsen',
    kontak: '',
    jenisLaporan: 'bantuan_sistem',
    pesan: ''
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
    setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ namaPelapor: '', rolePengguna: 'produsen', kontak: '', jenisLaporan: 'bantuan_sistem', pesan: '' });
    }, 5000);
  };

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
        .contact-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.3s ease;
        }
        .contact-card:hover {
          border-color: rgba(56, 189, 248, 0.4);
          box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.05);
        }
        .form-input {
          width: 100%;
          padding: 0.85rem 1rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.75rem;
          font-size: 0.95rem;
          background: #F8FAFC;
          outline: none;
          transition: all 0.3s ease;
          box-sizing: border-box;
        }
        .form-input:focus {
          border-color: #2563EB;
          background: #ffffff;
          box-shadow: 0 0 0 4px rgba(37, 99, 235, 0.1);
        }
        .submit-btn {
          width: 100%;
          padding: 1rem;
          background: #2563EB;
          color: #ffffff;
          border: none;
          border-radius: 0.75rem;
          font-size: 1rem;
          font-weight: 700;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all 0.3s ease;
        }
        .submit-btn:hover {
          background: #1D4ED8;
          transform: translateY(-2px);
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

      {/* HERO SECTION KONTAK */}
      <section style={{ 
        padding: "13rem 2rem 6rem", 
        textAlign: "center", 
        position: "relative", 
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.75), rgba(15, 23, 42, 0.98)), url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "fixed"
      }}>
        <div style={{ maxWidth: "850px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: "99px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Pusat Bantuan &amp; Pengaduan
          </div>
          <h1 style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Layanan Pengaduan &amp; <br /><span className="gradient-text">Integritas PasarNusa</span>
          </h1>
          <p style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", margin: "0 auto" }}>
            Gunakan halaman ini untuk melaporkan indikasi kecurangan harga di lapangan, kendala teknis penarikan saldo wallet, atau klaim bantuan operasional langsung ke Super Admin.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA: PANEL FORM & HUBUNGI KAMI */}
      <main style={{ padding: "5rem 2rem 7rem", maxWidth: "1200px", margin: "0 auto" }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "flex-start" }}>
          
          {/* SISI KIRI: INFORMASI KONTAK DIREKTORI & FAQ MINI */}
          <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
            <div>
              <span style={{ color: "#2563EB", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Saluran Kendali</span>
              <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", marginTop: "0.25rem", marginBottom: "1.5rem" }}>Kontak Bantuan</h2>
            </div>

            <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", padding: "0.75rem", borderRadius: "0.85rem" }}><ShieldAlert size={24} /></div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Laporan Manipulasi Harga</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem" }}>lapor@pasarnusa.id</div>
              </div>
            </div>

            <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", padding: "0.75rem", borderRadius: "0.85rem" }}><Phone size={24} /></div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Hotline Operasional</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem" }}>+62 (812) 3456-7890</div>
              </div>
            </div>

            <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
              <div style={{ background: "rgba(37,99,235,0.08)", color: "#2563EB", padding: "0.75rem", borderRadius: "0.85rem" }}><Mail size={24} /></div>
              <div>
                <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Kantor Pusat Admin</div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem", lineHeight: 1.4 }}>Gedung Inovasi Digital Lt.3, Blimbing, Kota Malang, Jawa Timur</div>
              </div>
            </div>

            {/* BOX EDUKASI TAMBAHAN */}
            <div style={{ background: "#EDF2F7", padding: "1.75rem", borderRadius: "1.5rem", marginTop: "1rem", border: "1px dashed #CBD5E1" }}>
              <div style={{ display: "flex", gap: "0.5rem", color: "#475569", marginBottom: "0.5rem" }}>
                <HelpCircle size={18} style={{ flexShrink: 0 }} />
                <h4 style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>Kebijakan Perlindungan Korban</h4>
              </div>
              <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
                PasarNusa menjamin kerahasiaan identitas akun produsen/petani yang melaporkan indikasi kecurangan tengkulak atau Admin Toko nakal yang memanipulasi *Indeks Harga Adil* platform.
              </p>
            </div>
          </div>

          {/* SISI KANAN: FORM ADUAN INTERAKTIF */}
          <div style={{ background: "#ffffff", padding: "2.5rem", borderRadius: "2rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.03)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#EF4444", marginBottom: "1.5rem" }}>
              <ShieldAlert size={20} />
              <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Pusat Tiket Aduan &amp; Bantuan</span>
            </div>

            {formSubmitted ? (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", textAlign: "center", padding: "3rem 1rem", animation: "fadeIn 0.5s ease" }}>
                <div style={{ color: "#10B981", marginBottom: "1rem" }}><CheckCircle2 size={56} /></div>
                <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", margin: "0 0 0.5rem 0" }}>Laporan Berhasil Terkirim</h3>
                <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                  Tiket aduan telah masuk ke enkripsi server Super Admin. Kami akan segera melakukan audit log transaksi dalam waktu dekat.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Nama Pengguna / Pelapor</label>
                  <input type="text" required placeholder="Masukkan nama akun Anda" className="form-input" value={formData.namaPelapor} onChange={(e) => setFormData({...formData, namaPelapor: e.target.value})} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Role Akun Anda</label>
                    <select className="form-input" value={formData.rolePengguna} onChange={(e) => setFormData({...formData, rolePengguna: e.target.value})}>
                      <option value="produsen">Produsen Hulu</option>
                      <option value="admin_toko">Admin Toko / Koperasi</option>
                      <option value="pembeli">Pembeli (B2B/B2C)</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>No. HP / Kontak Terikat</label>
                    <input type="tel" required placeholder="Contoh: 0812345..." className="form-input" value={formData.kontak} onChange={(e) => setFormData({...formData, kontak: e.target.value})} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Kategori Masalah / Aduan</label>
                  <select className="form-input" value={formData.jenisLaporan} onChange={(e) => setFormData({...formData, jenisLaporan: e.target.value})}>
                    <option value="bantuan_sistem">Kendala Teknis Aplikasi &amp; Sistem</option>
                    <option value="manipulasi_harga">Pelanggaran Indeks Harga Adil (Kecurangan Toko)</option>
                    <option value="kendala_wallet">Masalah Pencairan Saldo Dana / Wallet</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Deskripsi Masalah Kronologis</label>
                  <textarea rows={4} required placeholder="Tuliskan detail keluhan, nomor invoice transaksi, atau nama toko koperasi yang ingin dilaporkan..." className="form-input" style={{ resize: "none" }} value={formData.pesan} onChange={(e) => setFormData({...formData, pesan: e.target.value})}></textarea>
                </div>

                <button type="submit" className="submit-btn" style={{ marginTop: "0.5rem", background: formData.jenisLaporan === 'manipulasi_harga' ? '#EF4444' : '#2563EB' }}>
                  <Send size={16} /> Kirim Tiket Aduan Ke Admin
                </button>
              </form>
            )}
          </div>

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