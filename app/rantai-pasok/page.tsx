'use client';

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Sprout, Warehouse, ShoppingCart, Check } from "lucide-react";

export default function EkosistemPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState<'alur' | 'roles'>('alur');

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const alurLangkah = [
    { no: "01", judul: "Input Komoditas", sub: "Produsen · Hulu", desc: "Petani dan peternak memasukkan data kuantitas stok hasil panen serta patokan harga harian langsung dari lahan melalui aplikasi." },
    { no: "02", judul: "Smart Restock & Borongan", sub: "Admin Toko · Koperasi", desc: "Sistem AI mengingatkan jadwal panen dan memicu Admin Toko membuat pesanan borongan secara proaktif, sebelum tengkulak konvensional datang." },
    { no: "03", judul: "Inventaris & Etalase", sub: "Manajemen Stok", desc: "Komoditas disetor ke gudang digital, dicatat stoknya oleh Admin Toko, lalu otomatis masuk ke etalase publik." },
    { no: "04", judul: "Transaksi & Escrow System", sub: "Pembeli · Hilir", desc: "Pembeli memesan produk melalui marketplace. Dana ditahan aman oleh sistem Escrow PasarNusa demi proteksi kedua belah pihak." },
    { no: "05", judul: "Otomatisasi Split Wallet", sub: "Distribusi Adil", desc: "Saat pesanan dikonfirmasi sampai, Escrow membagi dana otomatis: persentase keuntungan ke Admin Toko, dan margin utama langsung ke Wallet Produsen." }
  ];

  const roles = [
    {
      layer: "Hulu",
      title: "Produsen",
      icon: Sprout,
      accent: "#0A4D2E",
      soft: "rgba(10,77,46,0.09)",
      desc: "Pelaku utama — petani, peternak, dan pengrajin — yang mengelola pasokan hasil panen mentah asli dari lahan.",
      fitur: ["Input komoditas lahan & stok", "Pemantauan Indeks Harga Adil", "Pencairan saldo Wallet"]
    },
    {
      layer: "Tengah",
      title: "Admin Toko / Koperasi",
      icon: Warehouse,
      accent: "#B45309",
      soft: "rgba(180,83,9,0.09)",
      desc: "Entitas perantara transparan, penanggung jawab logistik gudang desa dan kontrol standardisasi kualitas komoditas.",
      fitur: ["Fitur proaktif Smart Restock", "Pencatatan inventaris gudang", "Buku kas digital & audit margin"]
    },
    {
      layer: "Hilir",
      title: "Pembeli (B2B / B2C)",
      icon: ShoppingCart,
      accent: "#0E6E80",
      soft: "rgba(14,110,128,0.09)",
      desc: "Konsumen akhir maupun korporasi yang membeli produk hulu pelosok dengan visibilitas asal-usul yang jelas.",
      fitur: ["Modul kisah produsen asli", "Proteksi keamanan sistem Escrow", "Pelacakan kurir real-time"]
    }
  ];

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
          --forest-2: #0A3A22;
          --green: #0A4D2E;
          --green-lift: #0F6337;
          --emerald: #16A34A;
          --emerald-bright: #22C55E;
          --mint: #4ADE80;
          --harvest: #B45309;
          --teal: #0E6E80;
          --mono: 'SF Mono', ui-monospace, 'JetBrains Mono', 'Fira Code', monospace;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(252, 253, 252, 0.90)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          border-bottom: 1px solid ${isScrolled ? 'rgba(16,28,22,0.07)' : 'transparent'};
          box-shadow: ${isScrolled ? '0 6px 24px rgba(6,40,24,0.06)' : 'none'};
          transition: background .35s ease, box-shadow .35s ease, border-color .35s ease;
        }

        /* highlight solid, sama seperti .green-highlight di landing */
        .grad-text { color: var(--green); font-weight: 800; }

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

        /* hero: foto tetap, kerudung kontras dipindah ke pseudo-element
           supaya bisa diatur beda antara layar lebar dan HP */
        .hero-section::before {
          content: ""; position: absolute; inset: 0; z-index: 0; pointer-events: none;
          background:
            linear-gradient(96deg, var(--paper) 0%, rgba(246,248,245,0.96) 44%, rgba(246,248,245,0.66) 72%, rgba(246,248,245,0.24) 100%),
            linear-gradient(180deg, rgba(246,248,245,0.6) 0%, transparent 24%);
        }
        .hero-section::after {
          content: ""; position: absolute; left: 0; right: 0; bottom: 0; height: 110px; z-index: 0;
          pointer-events: none; background: linear-gradient(180deg, transparent, var(--paper) 92%);
        }

        .tab-switch {
          display: inline-flex;
          background: rgba(10, 77, 46, 0.06);
          border: 1px solid rgba(10, 77, 46, 0.14);
          padding: 0.3rem;
          border-radius: 999px;
          backdrop-filter: blur(8px);
        }
        .tab-btn {
          padding: 0.7rem 1.9rem;
          font-size: 0.9rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          color: var(--muted);
          background: transparent;
          transition: all 0.28s cubic-bezier(0.4,0,0.2,1);
        }
        .tab-btn:hover { color: var(--green); }
        .tab-btn.active {
          background: #FFFFFF;
          color: var(--green);
          box-shadow: 0 4px 14px rgba(6,40,24,0.12);
        }

        /* TIMELINE ALUR */
        .timeline { position: relative; max-width: 780px; margin: 0 auto; padding-left: 2.4rem; }
        .timeline::before {
          content: ""; position: absolute; left: 11px; top: 12px; bottom: 12px; width: 2px;
          background: linear-gradient(180deg, var(--green), var(--harvest));
          opacity: 0.30;
        }
        .step { position: relative; padding: 0 0 1.4rem 0; }
        .step:last-child { padding-bottom: 0; }
        .step-dot {
          position: absolute; left: -2.4rem; top: 6px; width: 24px; height: 24px; border-radius: 50%;
          background: var(--card); border: 2px solid var(--green);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 0 5px var(--paper);
        }
        .step-dot span { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
        .step-card {
          background: var(--card); border: 1px solid var(--line); border-radius: 1rem;
          padding: 1.35rem 1.5rem;
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 8px 20px rgba(6,40,24,.04);
          transition: transform .32s cubic-bezier(0.16,1,0.3,1), box-shadow .32s ease, border-color .32s ease;
        }
        .step-card:hover { transform: translateX(4px); border-color: rgba(10,77,46,0.28); box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 16px 34px rgba(6,40,24,.10); }
        .step-no { font-family: var(--mono); font-size: 0.75rem; font-weight: 700; color: var(--harvest); letter-spacing: 0.14em; }

        /* ROLE CARDS — garis aksen atas, pola sama dengan kartu fitur landing */
        .roles-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
        .role-card {
          position: relative; background: var(--card); border: 1px solid var(--line);
          border-radius: 1.5rem; padding: 2.2rem 1.9rem; overflow: hidden;
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 8px 20px rgba(6,40,24,.04);
          transition: transform .36s cubic-bezier(0.16,1,0.3,1), box-shadow .36s ease, border-color .36s ease;
        }
        .role-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--role-accent); opacity: .85;
          transition: opacity .3s ease, height .3s ease;
        }
        .role-card:hover { transform: translateY(-5px); border-color: rgba(10,77,46,0.22); box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 22px 44px rgba(6,40,24,.12); }
        .role-card:hover::before { opacity: 1; height: 4px; }

        .fade-in { animation: fadeUp 0.55s cubic-bezier(0.16,1,0.3,1) both; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }

        @media (max-width: 768px) {
          .header-container { padding: 0.55rem 0.9rem !important; }
          .nav-logo-text { font-size: 1.05rem !important; }
          .nav-logo-img { height: 26px !important; }
          .btn-back { padding: 0.45rem 0.9rem !important; font-size: 0.72rem !important; gap: 0.3rem !important; }
          .btn-back svg { width: 14px !important; height: 14px !important; }

          .hero-section { padding: 6.5rem 1.2rem 3.2rem !important; }
          .hero-badge { font-size: 0.66rem !important; padding: 0.35rem 0.9rem !important; margin-bottom: 1.1rem !important; }
          .hero-title { font-size: 2.05rem !important; line-height: 1.15 !important; }
          .hero-desc { font-size: 0.9rem !important; margin-bottom: 2rem !important; }
          .tab-btn { padding: 0.55rem 1.05rem !important; font-size: 0.78rem !important; }

          .main-content { padding: 3rem 1.1rem !important; }
          .section-title span { font-size: 0.72rem !important; }
          .section-title h2 { font-size: 1.55rem !important; }

          .timeline { padding-left: 2.1rem !important; }
          .step-card { padding: 1.05rem 1.1rem !important; border-radius: 0.85rem !important; }
          .step-dot { left: -2.1rem !important; width: 20px !important; height: 20px !important; }

          /* role cards tetap 3 kolom seperti PC, hanya diskalakan kecil */
          .roles-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.55rem !important; }
          .role-card { padding: 0.9rem 0.65rem !important; border-radius: 0.9rem !important; }
          .role-card > div:first-child { margin-bottom: 0.6rem !important; flex-wrap: wrap !important; gap: 0.3rem !important; }
          .role-card > div:first-child > div:first-child { width: 34px !important; height: 34px !important; border-radius: 9px !important; }
          .role-card > div:first-child > div:first-child svg { width: 17px !important; height: 17px !important; }
          .role-card > div:first-child > span { font-size: 0.6rem !important; padding: 0.18rem 0.4rem !important; letter-spacing: 0.04em !important; }
          .role-card h3 { font-size: 0.8rem !important; margin: 0 0 0.35rem !important; line-height: 1.25 !important; }
          .role-card p { font-size: 0.66rem !important; line-height: 1.45 !important; margin: 0 0 0.75rem !important; }
          .role-card > div:last-child { padding-top: 0.6rem !important; gap: 0.4rem !important; }
          .role-card > div:last-child > div { font-size: 0.64rem !important; gap: 0.35rem !important; line-height: 1.35 !important; }
          .role-card > div:last-child svg { width: 11px !important; height: 11px !important; }

          .footer-wrapper { flex-direction: column !important; align-items: flex-start !important; gap: 0.4rem !important; }
          .footer-wrapper span { font-size: 0.7rem !important; }

          /* ---- visual saja ---- */
          .hero-section::before {
            background: linear-gradient(180deg, var(--paper) 0%, rgba(246,248,245,0.98) 48%, rgba(246,248,245,0.86) 76%, rgba(246,248,245,0.6) 100%) !important;
          }
          .hero-section::after { height: 60px !important; }
          .role-card::before { height: 2px; }
          .role-card p { color: #3F4D45 !important; }
          .timeline::before { opacity: .38; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pn-root *, .pn-root *::before, .pn-root *::after {
            animation-duration: .001ms !important; animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}} />

      <header className="glass-nav header-container" style={{ padding: "0.9rem 3.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <img className="nav-logo-img" src="/logo.png" alt="Logo PasarNusa" style={{ height: "36px", width: "auto", objectFit: "contain", borderRadius: "8px" }} />
          <span className="nav-logo-text" style={{ fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--ink)" }}>
            Pasar<span style={{ color: "var(--green)" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back btn-primary" style={{
            padding: "0.6rem 1.35rem", fontSize: "0.88rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            borderRadius: "999px", textDecoration: "none"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      <section className="hero-section" style={{
        padding: "12rem 2rem 5.5rem", textAlign: "center", position: "relative",
        backgroundImage: `url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=1920')`,
        backgroundSize: "cover", backgroundPosition: "center"
      }}>
        <div style={{ position: "absolute", top: "18%", left: "50%", transform: "translateX(-50%)", width: "560px", height: "560px", background: "radial-gradient(circle, rgba(10,77,46,0.07) 0%, transparent 65%)", filter: "blur(30px)", pointerEvents: "none", zIndex: 0 }} />

        <div style={{ maxWidth: "860px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge fade-in" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 1.2rem", borderRadius: "999px", background: "rgba(10,77,46,0.07)", border: "1px solid rgba(10,77,46,0.22)", color: "var(--green)", fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em", marginBottom: "1.6rem", textTransform: "uppercase" }}>
            Arsitektur Ekosistem
          </div>
          <h1 className="hero-title fade-in" style={{ fontSize: "4rem", fontWeight: 800, color: "var(--ink)", lineHeight: 1.08, marginBottom: "1.4rem", letterSpacing: "-0.035em" }}>
            Infrastruktur Rantai Pasok<br /><span className="grad-text">End-to-End</span>
          </h1>
          <p className="hero-desc fade-in" style={{ fontSize: "1.2rem", color: "var(--body)", lineHeight: 1.7, fontWeight: 400, maxWidth: "660px", margin: "0 auto 2.8rem" }}>
            Pemetaan jaringan logistik hulu, tata kelola koperasi digital, transparansi distribusi, hingga audit Indeks Harga Adil nasional PasarNusa.
          </p>

          <div className="tab-switch fade-in">
            <button onClick={() => setActiveTab('alur')} className={`tab-btn ${activeTab === 'alur' ? 'active' : ''}`}>
              Alur Bisnis
            </button>
            <button onClick={() => setActiveTab('roles')} className={`tab-btn ${activeTab === 'roles' ? 'active' : ''}`}>
              3 Peran Inti
            </button>
          </div>
        </div>
      </section>

      <main className="main-content" style={{ padding: "5.5rem 2rem", maxWidth: "1180px", margin: "0 auto" }}>

        {activeTab === 'alur' && (
          <div className="fade-in">
            <div className="section-title" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--green)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Siklus Transaksi</span>
              <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.6rem", letterSpacing: "-0.03em" }}>Aliran Komoditas &amp; Finansial</h2>
            </div>

            <div className="timeline">
              {alurLangkah.map((langkah, index) => (
                <div key={index} className="step">
                  <div className="step-dot"><span /></div>
                  <div className="step-card">
                    <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", flexWrap: "wrap", marginBottom: "0.5rem" }}>
                      <span className="step-no">{langkah.no}</span>
                      <h4 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--ink)", letterSpacing: "-0.015em" }}>{langkah.judul}</h4>
                      <span style={{ background: "rgba(10,77,46,0.07)", color: "var(--green)", padding: "0.2rem 0.7rem", borderRadius: "999px", fontSize: "0.72rem", fontWeight: 700 }}>{langkah.sub}</span>
                    </div>
                    <p style={{ color: "var(--body)", margin: 0, fontSize: "0.94rem", lineHeight: 1.65 }}>{langkah.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'roles' && (
          <div className="fade-in">
            <div className="section-title" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
              <span style={{ color: "var(--harvest)", fontWeight: 800, fontSize: "0.82rem", letterSpacing: "0.14em", textTransform: "uppercase" }}>Hak Akses</span>
              <h2 style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--ink)", marginTop: "0.6rem", letterSpacing: "-0.03em" }}>Tiga Peran, Satu Rantai Pasok</h2>
            </div>

            <div className="roles-grid">
              {roles.map((role, i) => {
                const Icon = role.icon;
                return (
                  <div key={i} className="role-card" style={{ ["--role-accent" as any]: role.accent }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
                      <div style={{ color: role.accent, background: role.soft, width: "54px", height: "54px", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Icon size={28} />
                      </div>
                      <span style={{ fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: role.accent, background: role.soft, padding: "0.3rem 0.7rem", borderRadius: "999px" }}>{role.layer}</span>
                    </div>
                    <h3 style={{ fontSize: "1.35rem", fontWeight: 800, color: "var(--ink)", margin: "0 0 0.6rem", letterSpacing: "-0.025em" }}>{role.title}</h3>
                    <p style={{ color: "var(--body)", fontSize: "0.92rem", lineHeight: 1.65, margin: "0 0 1.6rem" }}>{role.desc}</p>
                    <div style={{ borderTop: "1px solid var(--line)", paddingTop: "1.1rem", display: "flex", flexDirection: "column", gap: "0.7rem" }}>
                      {role.fitur.map((f, j) => (
                        <div key={j} style={{ display: "flex", alignItems: "center", gap: "0.6rem", fontSize: "0.86rem", color: "#334339", fontWeight: 500 }}>
                          <span style={{ color: role.accent, display: "flex", flexShrink: 0 }}><Check size={16} strokeWidth={3} /></span>
                          {f}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </main>

      <footer className="footer-container" style={{ padding: "2.6rem 3.5rem", background: "var(--forest-1)", color: "#A3BDB0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1180px", margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.88rem" }}>
          <span style={{ color: "#A3BDB0" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#7C9187" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}