'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Send, CheckCircle2, ShieldAlert, HelpCircle, Clock } from "lucide-react";

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
          50% { transform: translate(-22px,18px) scale(1.08); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; animation: floatBlob 13s ease-in-out infinite; }
        .contact-card { background: #ffffff; border: 1px solid rgba(226, 232, 240, 0.8); transition: all 0.3s ease; }
        .contact-card:hover { border-color: rgba(16, 185, 129, 0.4); box-shadow: 0 10px 25px -5px rgba(5, 150, 105, 0.08); transform: translateY(-3px); }
        .form-input {
          width: 100%; padding: 0.85rem 1rem; border: 1px solid #E2E8F0; border-radius: 0.75rem; font-size: 0.95rem;
          background: #F8FAFC; outline: none; transition: all 0.3s ease; box-sizing: border-box;
        }
        .form-input:focus { border-color: #059669; background: #ffffff; box-shadow: 0 0 0 4px rgba(5, 150, 105, 0.1); }
        .submit-btn {
          width: 100%; padding: 1rem; background: #059669; color: #ffffff; border: none; border-radius: 0.75rem;
          font-size: 1rem; font-weight: 700; cursor: pointer; display: flex; align-items: center; justify-content: center;
          gap: 0.5rem; transition: all 0.3s ease;
        }
        .submit-btn:hover { background: #047857; transform: translateY(-2px); }

        @media (max-width: 768px) {
          .header-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .nav-logo-text { font-size: 0.85rem !important; }
          .nav-logo-img { height: 20px !important; }
          .btn-back { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; padding-left: 0.5rem !important; padding-right: 0.5rem !important; font-size: 0.55rem !important; gap: 0.2rem !important; }
          .btn-back svg { width: 10px !important; height: 10px !important; }
          .hero-section { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 6rem !important; padding-bottom: 2.5rem !important; }
          .hero-badge { font-size: 0.65rem !important; padding: 0.35rem 0.85rem !important; margin-bottom: 1rem !important; }
          .hero-title { font-size: 1.85rem !important; line-height: 1.25 !important; }
          .hero-desc { font-size: 0.85rem !important; }
          .main-content { padding-left: 0.35rem !important; padding-right: 0.35rem !important; padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }
          .main-grid { grid-template-columns: 1fr 1.1fr !important; gap: 0.4rem !important; }
          .left-pane-header h2 { font-size: 0.85rem !important; margin-top: 0.15rem !important; margin-bottom: 0.75rem !important; }
          .left-pane-header span { font-size: 0.55rem !important; }
          .contact-card { padding: 0.4rem !important; border-radius: 0.5rem !important; gap: 0.4rem !important; }
          .contact-card div:first-child { padding: 0.4rem !important; border-radius: 0.4rem !important; }
          .contact-card div:first-child svg { width: 14px !important; height: 14px !important; }
          .contact-card div:last-child div:first-child { font-size: 0.45rem !important; line-height: 1.1 !important; }
          .contact-card div:last-child div:last-child { font-size: 0.52rem !important; line-height: 1.3 !important; margin-top: 0.1rem !important; }
          .edu-box { padding: 0.5rem !important; border-radius: 0.6rem !important; margin-top: 0px !important; }
          .edu-box h4 { font-size: 0.55rem !important; }
          .edu-box p { font-size: 0.45rem !important; line-height: 1.4 !important; }
          .right-form-panel { padding: 0.6rem !important; border-radius: 0.75rem !important; }
          .right-form-panel div:first-child svg { width: 14px !important; height: 14px !important; }
          .right-form-panel div:first-child span { font-size: 0.65rem !important; }
          .form-label { font-size: 0.52rem !important; margin-bottom: 0.15rem !important; }
          .form-input { padding: 0.4rem 0.5rem !important; font-size: 0.55rem !important; border-radius: 0.35rem !important; }
          .form-row-mobile { grid-template-columns: 1fr !important; gap: 0.75rem !important; }
          .submit-btn { padding: 0.5rem !important; font-size: 0.6rem !important; border-radius: 0.35rem !important; }
          .submit-btn svg { width: 12px !important; height: 12px !important; }
          .footer-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 1.5rem !important; padding-bottom: 1.5rem !important; }
          .footer-wrapper { flex-direction: row !important; justify-content: space-between !important; align-items: center !important; gap: 0px !important; }
          .footer-wrapper span { font-size: 0.42rem !important; line-height: 1.2 !important; }
        }
      `}} />

      {/* NAVBAR */}
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

      {/* HERO SECTION KONTAK */}
      <section className="hero-section" style={{
        paddingTop: "13rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.97)), url('https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center", backgroundAttachment: "scroll"
      }}>
        <div className="blob" style={{ width: 400, height: 400, background: "#EF4444", opacity: 0.14, top: -100, left: -100 }} />
        <div className="blob" style={{ width: 360, height: 360, background: "#34D399", opacity: 0.18, bottom: -140, right: -80, animationDelay: "3.5s" }} />
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-block", paddingLeft: "1.5rem", paddingRight: "1.5rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(239, 68, 68, 0.15)", border: "1px solid rgba(239, 68, 68, 0.3)", color: "#EF4444", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Pusat Bantuan &amp; Pengaduan
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Setiap Laporan Masuk <br />ke <span className="gradient-text">Log Audit Super Admin</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.25rem", color: "#E2E8F0", lineHeight: 1.7, fontWeight: 400, maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "0px" }}>
            Laporkan indikasi manipulasi Indeks Harga Adil di lapangan, kendala pencairan Wallet, atau bantuan operasional lain — tiketmu langsung tercatat untuk ditindaklanjuti Super Admin, bukan hilang di kotak masuk email.
          </p>
        </div>
      </section>

      {/* KONTEN UTAMA */}
      <main className="main-content" style={{ paddingTop: "5rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "flex-start" }}>

          {/* SISI KIRI: DIRECTORY INFO */}
          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
              <div className="left-pane-header">
                <span style={{ color: "#059669", fontWeight: 800, fontSize: "0.9rem", letterSpacing: "0.05em", textTransform: "uppercase" }}>Saluran Kendali</span>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#0F172A", marginTop: "0.25rem", marginBottom: "1.5rem" }}>Kontak Bantuan</h2>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(239,68,68,0.08)", color: "#EF4444", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0 }}><ShieldAlert size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Laporan Manipulasi Harga</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem" }}>lapor@pasarnusa.id</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(16,185,129,0.08)", color: "#10B981", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0 }}><Phone size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Hotline Operasional</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem" }}>+62 (812) 3456-7890</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(5,150,105,0.08)", color: "#059669", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0 }}><Mail size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Kantor Pusat Admin</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem", lineHeight: 1.4 }}>Gedung Inovasi Digital Lt.3, Blimbing, Kota Malang, Jawa Timur</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.25rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(52,211,153,0.12)", color: "#34D399", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0 }}><Clock size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600, textTransform: "uppercase" }}>Target Respons Tiket</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", marginTop: "0.15rem" }}>Ditinjau Super Admin &lt; 1x24 jam</div>
                </div>
              </div>

              <div className="edu-box" style={{ background: "#EDF2F7", padding: "1.75rem", borderRadius: "1.5rem", marginTop: "1rem", border: "1px dashed #CBD5E1" }}>
                <div style={{ display: "flex", gap: "0.5rem", color: "#475569", marginBottom: "0.5rem" }}>
                  <HelpCircle size={18} style={{ flexShrink: 0 }} />
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem" }}>Kebijakan Perlindungan Pelapor</h4>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "#64748B", lineHeight: 1.6 }}>
                  PasarNusa menjamin kerahasiaan identitas akun produsen atau petani yang melaporkan indikasi kecurangan tengkulak maupun Admin Toko yang memanipulasi Indeks Harga Adil platform. Melapor tidak akan membuat akunmu dibungkam, justru itulah cara sistem ini menutup celah kecurangan.
                </p>
              </div>
            </div>
          </Reveal>

          {/* SISI KANAN: FORM INTERAKTIF PANEL */}
          <Reveal delay={120}>
            <div className="right-form-panel" style={{ background: "#ffffff", padding: "2.5rem", borderRadius: "2rem", border: "1px solid rgba(226, 232, 240, 0.8)", boxShadow: "0 20px 40px -20px rgba(0,0,0,0.03)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "#EF4444", marginBottom: "1.5rem" }}>
                <ShieldAlert size={20} />
                <span style={{ fontSize: "0.95rem", fontWeight: 700 }}>Pusat Tiket Aduan &amp; Bantuan</span>
              </div>

              {formSubmitted ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyItems: "center", textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ color: "#10B981", marginBottom: "1rem" }}><CheckCircle2 size={56} /></div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0F172A", marginTop: "0px", marginBottom: "0.5rem" }}>Laporan Berhasil Terkirim</h3>
                  <p style={{ color: "#64748B", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    Tiket aduanmu sudah masuk ke antrean Super Admin. Kami akan mengaudit log transaksi terkait dan menghubungi kontak yang kamu berikan.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Nama Pengguna / Pelapor</label>
                    <input type="text" required placeholder="Masukkan nama akun Anda" className="form-input" value={formData.namaPelapor} onChange={(e) => setFormData({...formData, namaPelapor: e.target.value})} />
                  </div>

                  <div className="form-row-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Role Akun Anda</label>
                      <select className="form-input" value={formData.rolePengguna} onChange={(e) => setFormData({...formData, rolePengguna: e.target.value})}>
                        <option value="produsen">Produsen Hulu</option>
                        <option value="admin_toko">Admin Toko / Koperasi</option>
                        <option value="pembeli">Pembeli (B2B/B2C)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>No. HP / Kontak Terkait</label>
                      <input type="tel" required placeholder="Contoh: 0812345..." className="form-input" value={formData.kontak} onChange={(e) => setFormData({...formData, kontak: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Kategori Masalah / Aduan</label>
                    <select className="form-input" value={formData.jenisLaporan} onChange={(e) => setFormData({...formData, jenisLaporan: e.target.value})}>
                      <option value="bantuan_sistem">Kendala Teknis Aplikasi &amp; Sistem</option>
                      <option value="manipulasi_harga">Pelanggaran Indeks Harga Adil (Kecurangan Toko)</option>
                      <option value="kendala_wallet">Masalah Pencairan Saldo Dana / Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Deskripsi Masalah Kronologis</label>
                    <textarea rows={4} required placeholder="Tuliskan detail keluhan, nomor invoice transaksi, atau nama toko koperasi yang ingin dilaporkan..." className="form-input" style={{ resize: "none" }} value={formData.pesan} onChange={(e) => setFormData({...formData, pesan: e.target.value})}></textarea>
                  </div>

                  <button type="submit" className="submit-btn" style={{ marginTop: "0.5rem", background: formData.jenisLaporan === 'manipulasi_harga' ? '#EF4444' : '#059669' }}>
                    <Send size={16} /> Kirim Tiket Aduan Ke Admin
                  </button>
                </form>
              )}
            </div>
          </Reveal>

        </div>
      </main>

      {/* FOOTER */}
      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "3rem", paddingBottom: "3rem", background: "#0B1120", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#64748B" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#475569" }}>Membangun Rantai Pasok yang Adil, Bukan Sekadar yang Ada.</span>
        </div>
      </footer>
    </div>
  );
}