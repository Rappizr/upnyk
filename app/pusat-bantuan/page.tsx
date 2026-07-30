'use client';

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Mail, Phone, Send, CheckCircle2, ShieldAlert, HelpCircle, Clock, ShieldCheck } from "lucide-react";
import { supabase } from "@/lib/db";

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

export default function KontakMitraPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    namaPelapor: '',
    rolePengguna: 'Produsen Hulu',
    kontak: '',
    jenisLaporan: 'Kendala Teknis',
    pesan: ''
  });

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;

    setSubmitting(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      let kategoriMapped = formData.jenisLaporan;
      if (formData.jenisLaporan === "manipulasi_harga") {
        kategoriMapped = "Manipulasi Harga";
      } else if (formData.jenisLaporan === "bantuan_sistem") {
        kategoriMapped = "Kendala Teknis";
      } else if (formData.jenisLaporan === "kendala_wallet") {
        kategoriMapped = "Sengketa Transaksi";
      }

      const { error } = await supabase
        .from("pengaduan")
        .insert({
          profile_id: user?.id || null,
          pelapor: formData.namaPelapor,
          role: formData.rolePengguna,
          kontak: formData.kontak,
          kategori: kategoriMapped,
          deskripsi: formData.pesan,
          status: "Baru"
        });

      if (error) {
        console.error("Gagal mengirim aduan:", error);
        alert(`Gagal mengirim laporan: ${error.message}`);
        setSubmitting(false);
        return;
      }

      setFormSubmitted(true);
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData({
          namaPelapor: '',
          rolePengguna: 'Produsen Hulu',
          kontak: '',
          jenisLaporan: 'Kendala Teknis',
          pesan: ''
        });
      }, 5000);

    } catch (err) {
      console.error("System error submit pengaduan:", err);
      alert("Terjadi kesalahan sistem saat mengirim aduan.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: "var(--paper)", fontFamily: "var(--font-sans), system-ui, sans-serif", color: "var(--ink)", overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{__html: `
        /* ===== TOKEN — disamakan dengan landing page ===== */
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
          --mint: #4ADE80;
          --alert: #B3402A;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(252, 253, 252, 0.92)' : 'rgba(252, 253, 252, 0.62)'};
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
          background: linear-gradient(180deg, rgba(246,248,245,0.90) 0%, rgba(246,248,245,0.97) 100%);
        }

        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(-22px,18px) scale(1.08); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(75px); pointer-events: none; animation: floatBlob 13s ease-in-out infinite; z-index: 0; }

        .contact-card {
          background: var(--card);
          border: 1px solid var(--line);
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 8px 20px rgba(6,40,24,.04);
          transition: transform .3s cubic-bezier(.16,1,.3,1), box-shadow .3s ease, border-color .3s ease;
        }
        .contact-card:hover {
          border-color: rgba(10,77,46,0.22);
          box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 18px 34px rgba(6,40,24,.09);
          transform: translateY(-3px);
        }

        .form-input {
          width: 100%; padding: 0.85rem 1rem; border: 1px solid var(--line); border-radius: 0.75rem;
          font-size: 0.95rem; background: #FBFCFB; outline: none; box-sizing: border-box; color: var(--ink);
          transition: border-color .25s ease, box-shadow .25s ease, background .25s ease;
        }
        .form-input:focus { border-color: var(--emerald); background: #ffffff; box-shadow: 0 0 0 4px rgba(22,163,74,0.12); }
        .form-input::placeholder { color: var(--muted); }

        .submit-btn {
          width: 100%; padding: 1rem; border: 1px solid rgba(255,255,255,0.16); border-radius: 0.75rem;
          color: #ffffff; font-size: 1rem; font-weight: 700; cursor: pointer;
          display: flex; align-items: center; justify-content: center; gap: 0.5rem;
          box-shadow: 0 8px 22px rgba(10,77,46,0.26), inset 0 1px 0 rgba(255,255,255,0.14);
          transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
        }
        .submit-btn:hover { filter: brightness(1.08); transform: translateY(-2px); }
        .submit-btn:active { transform: translateY(0) scale(.99); }

        @media (max-width: 768px) {
          .header-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .nav-logo-text { font-size: 0.85rem !important; }
          .nav-logo-img { height: 20px !important; }
          .btn-back { padding-top: 0.25rem !important; padding-bottom: 0.25rem !important; padding-left: 0.5rem !important; padding-right: 0.5rem !important; font-size: 0.6rem !important; gap: 0.2rem !important; }
          .btn-back svg { width: 10px !important; height: 10px !important; }
          .hero-section { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 6rem !important; padding-bottom: 2.5rem !important; }
          .hero-badge { font-size: 0.65rem !important; padding: 0.35rem 0.85rem !important; margin-bottom: 1rem !important; }
          .hero-title { font-size: 1.85rem !important; line-height: 1.25 !important; }
          .hero-desc { font-size: 0.85rem !important; }
          .main-content { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 2.5rem !important; padding-bottom: 2.5rem !important; }

          /* DIPASKAN: sebelumnya dua kolom berdampingan (1fr 1.1fr) di layar
             375px, membuat form menyusut sampai fontnya 0.5rem — tidak bisa
             diisi. Formulir wajib satu kolom di HP. */
          .main-grid { grid-template-columns: 1fr !important; gap: 2rem !important; }

          .left-pane-header h2 { font-size: 1.35rem !important; margin-top: 0.15rem !important; margin-bottom: 0.75rem !important; }
          .left-pane-header span { font-size: 0.72rem !important; }

          .contact-card { padding: 1rem !important; border-radius: 0.85rem !important; gap: 0.85rem !important; }
          .contact-card div:first-child { padding: 0.6rem !important; border-radius: 0.65rem !important; }
          .contact-card div:first-child svg { width: 20px !important; height: 20px !important; }
          .contact-card div:last-child div:first-child { font-size: 0.66rem !important; line-height: 1.2 !important; }
          .contact-card div:last-child div:last-child { font-size: 0.88rem !important; line-height: 1.4 !important; margin-top: 0.15rem !important; }

          .edu-box { padding: 1.1rem !important; border-radius: 0.9rem !important; margin-top: 0.5rem !important; }
          .edu-box h4 { font-size: 0.88rem !important; }
          .edu-box p { font-size: 0.78rem !important; line-height: 1.55 !important; }

          .right-form-panel { padding: 1.15rem !important; border-radius: 1rem !important; }
          .right-form-panel div:first-child svg { width: 18px !important; height: 18px !important; }
          .right-form-panel div:first-child span { font-size: 0.88rem !important; }

          /* DIPASKAN: input di bawah 1rem memicu auto-zoom Safari iOS setiap
             kali disentuh. 1rem = 16px adalah batas amannya. */
          .form-label { font-size: 0.78rem !important; margin-bottom: 0.3rem !important; }
          .form-input { padding: 0.7rem 0.85rem !important; font-size: 1rem !important; border-radius: 0.6rem !important; }
          .form-row-mobile { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .submit-btn { padding: 0.85rem !important; font-size: 0.95rem !important; border-radius: 0.6rem !important; }
          .submit-btn svg { width: 16px !important; height: 16px !important; }

          .footer-container { padding-left: 1rem !important; padding-right: 1rem !important; padding-top: 1.75rem !important; padding-bottom: 1.75rem !important; }
          .footer-wrapper { flex-direction: column !important; align-items: flex-start !important; gap: 0.4rem !important; }
          .footer-wrapper span { font-size: 0.7rem !important; line-height: 1.4 !important; }
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
        paddingTop: "11rem", paddingBottom: "5rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: `url('https://images.unsplash.com/photo-1560264280-88b68371db39?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center"
      }}>
        <div className="blob" style={{ width: 400, height: 400, background: "#4ADE80", opacity: 0.14, top: -100, left: -100 }} />
        <div className="blob" style={{ width: 360, height: 360, background: "#0A4D2E", opacity: 0.12, bottom: -140, right: -80, animationDelay: "3.5s" }} />

        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", paddingLeft: "1.25rem", paddingRight: "1.25rem", paddingTop: "0.5rem", paddingBottom: "0.5rem", borderRadius: "99px", background: "rgba(10,77,46,0.07)", border: "1px solid rgba(10,77,46,0.24)", color: "var(--green)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            <ShieldCheck size={18} /> PUSAT BANTUAN &amp; PENGADUAN
          </div>

          <h1 className="hero-title" style={{ fontSize: "3.5rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.15, marginBottom: "1.25rem", letterSpacing: "-0.035em" }}>
            Setiap Laporan Masuk <br />ke <span className="gradient-text">Log Audit Super Admin</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: "1.15rem", color: "var(--body)", lineHeight: 1.7, fontWeight: 400, maxWidth: "750px", marginLeft: "auto", marginRight: "auto", marginBottom: "0px" }}>
            Laporkan indikasi manipulasi Indeks Harga Adil di lapangan, kendala pencairan Wallet, atau bantuan operasional lain — tiketmu langsung tercatat untuk ditindaklanjuti Super Admin, bukan hilang di kotak masuk email.
          </p>
        </div>
      </section>

      <main className="main-content" style={{ paddingTop: "4rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <div className="main-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "4rem", alignItems: "flex-start" }}>

          <Reveal>
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              <div className="left-pane-header">
                <span style={{ color: "var(--green)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Saluran Kendali</span>
                <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.35rem", marginBottom: "1.25rem", letterSpacing: "-0.03em" }}>Kontak Bantuan</h2>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.15rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(179,64,42,0.09)", color: "var(--alert)", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0, display: "flex" }}><ShieldAlert size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Laporan Manipulasi Harga</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: "0.15rem" }}>lapor@pasarnusa.id</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.15rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(10,77,46,0.09)", color: "var(--green)", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0, display: "flex" }}><Phone size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Hotline Operasional</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: "0.15rem" }}>+62 (812) 3456-7890</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.15rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(22,163,74,0.09)", color: "var(--emerald)", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0, display: "flex" }}><Mail size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Kantor Pusat Admin</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: "0.15rem", lineHeight: 1.4 }}>Gedung Inovasi Digital Lt.3, Blimbing, Kota Malang, Jawa Timur</div>
                </div>
              </div>

              <div className="contact-card" style={{ padding: "1.5rem", borderRadius: "1.15rem", display: "flex", gap: "1.25rem", alignItems: "center" }}>
                <div style={{ background: "rgba(74,222,128,0.14)", color: "#15803D", padding: "0.75rem", borderRadius: "0.85rem", flexShrink: 0, display: "flex" }}><Clock size={24} /></div>
                <div>
                  <div style={{ fontSize: "0.75rem", color: "var(--muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em" }}>Target Respons Tiket</div>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--ink)", marginTop: "0.15rem" }}>Ditinjau Super Admin &lt; 1x24 jam</div>
                </div>
              </div>

              <div className="edu-box" style={{ background: "#EEF3EE", padding: "1.75rem", borderRadius: "1.25rem", marginTop: "0.5rem", border: "1px dashed #C6D4C9" }}>
                <div style={{ display: "flex", gap: "0.5rem", color: "var(--body)", marginBottom: "0.5rem" }}>
                  <HelpCircle size={18} style={{ flexShrink: 0 }} />
                  <h4 style={{ margin: 0, fontWeight: 800, fontSize: "0.95rem", color: "var(--ink)" }}>Kebijakan Perlindungan Pelapor</h4>
                </div>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--body)", lineHeight: 1.6 }}>
                  PasarNusa menjamin kerahasiaan identitas akun produsen atau petani yang melaporkan indikasi kecurangan tengkulak maupun Admin Toko yang memanipulasi Indeks Harga Adil platform. Melapor tidak akan membuat akunmu dibungkam, justru itulah cara sistem ini menutup celah kecurangan.
                </p>
              </div>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="right-form-panel" style={{ background: "var(--card)", padding: "2.5rem", borderRadius: "1.5rem", border: "1px solid var(--line)", boxShadow: "0 1px 2px rgba(6,40,24,.04), 0 18px 40px rgba(6,40,24,.07)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", color: "var(--alert)", marginBottom: "1.5rem" }}>
                <ShieldAlert size={20} />
                <span style={{ fontSize: "0.95rem", fontWeight: 800 }}>Pusat Tiket Aduan &amp; Bantuan</span>
              </div>

              {formSubmitted ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "3rem 1rem" }}>
                  <div style={{ color: "var(--emerald)", marginBottom: "1rem" }}><CheckCircle2 size={56} /></div>
                  <h3 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--ink)", marginTop: "0px", marginBottom: "0.5rem", letterSpacing: "-0.02em" }}>Laporan Berhasil Terkirim</h3>
                  <p style={{ color: "var(--body)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }}>
                    Tiket aduanmu sudah masuk ke antrean Super Admin. Kami akan mengaudit log transaksi terkait dan menghubungi kontak yang kamu berikan.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--body)", marginBottom: "0.4rem" }}>Nama Pengguna / Pelapor *</label>
                    <input type="text" required placeholder="Masukkan nama akun Anda" className="form-input" value={formData.namaPelapor} onChange={(e) => setFormData({...formData, namaPelapor: e.target.value})} />
                  </div>

                  <div className="form-row-mobile" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                    <div>
                      <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--body)", marginBottom: "0.4rem" }}>Role Akun Anda *</label>
                      <select className="form-input" value={formData.rolePengguna} onChange={(e) => setFormData({...formData, rolePengguna: e.target.value})}>
                        <option value="Produsen Hulu">Produsen Hulu</option>
                        <option value="Admin Toko">Admin Toko / Koperasi</option>
                        <option value="Pembeli">Pembeli (B2B/B2C)</option>
                      </select>
                    </div>
                    <div>
                      <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--body)", marginBottom: "0.4rem" }}>No. HP / Kontak Terkait *</label>
                      <input type="tel" required placeholder="Contoh: 0812345..." className="form-input" value={formData.kontak} onChange={(e) => setFormData({...formData, kontak: e.target.value})} />
                    </div>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--body)", marginBottom: "0.4rem" }}>Kategori Masalah / Aduan *</label>
                    <select className="form-input" value={formData.jenisLaporan} onChange={(e) => setFormData({...formData, jenisLaporan: e.target.value})}>
                      <option value="Kendala Teknis">Kendala Teknis Aplikasi &amp; Sistem</option>
                      <option value="Manipulasi Harga">Pelanggaran Indeks Harga Adil (Kecurangan Toko)</option>
                      <option value="Sengketa Transaksi">Masalah Pencairan Saldo Dana / Wallet</option>
                    </select>
                  </div>

                  <div>
                    <label className="form-label" style={{ display: "block", fontSize: "0.85rem", fontWeight: 700, color: "var(--body)", marginBottom: "0.4rem" }}>Deskripsi Masalah Kronologis *</label>
                    <textarea rows={4} required placeholder="Tuliskan detail keluhan, nomor invoice transaksi, atau nama toko koperasi yang ingin dilaporkan..." className="form-input" style={{ resize: "none" }} value={formData.pesan} onChange={(e) => setFormData({...formData, pesan: e.target.value})}></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="submit-btn"
                    style={{
                      marginTop: "0.5rem",
                      background: formData.jenisLaporan === 'Manipulasi Harga'
                        ? 'linear-gradient(180deg, #C4553C 0%, #B3402A 100%)'
                        : 'linear-gradient(180deg, #0F6337 0%, #0A4D2E 100%)',
                      opacity: submitting ? 0.7 : 1
                    }}
                  >
                    <Send size={16} /> {submitting ? "Mengirim Aduan..." : "Kirim Tiket Aduan Ke Admin"}
                  </button>
                </form>
              )}
            </div>
          </Reveal>

        </div>
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