'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft, MapPin, Filter, TrendingUp, Search, Store, ShieldCheck, Sprout, Leaf
} from "lucide-react";
import { supabase } from "@/lib/db";

interface Mitra {
  id: string;
  nama: string;
  tipe: "Admin Toko / Koperasi" | "Produsen Hulu";
  lokasi: string;
  komoditas: string;
  rating: number;
  sejakTahun: number;
  tag: string;
  fotoUrl?: string;
}

const filterTipe = ["Semua", "Admin Toko / Koperasi", "Produsen Hulu"] as const;

/* ============================================================
   PALET WARNA — Identitas Hijau PasarNusa
   ============================================================ */
const C = {
  deep: "#08170E",       // forest paling gelap (hero / footer)
  forest: "#0E2A1B",     // forest gelap
  forest2: "#123A24",    // forest medium
  green: "#16A34A",      // hijau utama (CTA)
  greenDark: "#15803D",
  emerald: "#22C55E",
  lime: "#A3E635",       // aksen lime terang
  limeSoft: "#BEF264",
  bg: "#F4FAF5",         // latar terang kehijauan
  card: "#FFFFFF",
  border: "#E3EDE7",
  ink: "#0B1F14",        // teks utama
  muted: "#5B7267",      // teks sekunder
};

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) { setInView(true); io.disconnect(); } }, { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}

function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const [ref, inView] = useReveal<HTMLDivElement>();
  return (
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(28px)", transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
      {children}
    </div>
  );
}

export default function MitraUmkmPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [filter, setFilter] = useState<typeof filterTipe[number]>("Semua");
  const [search, setSearch] = useState("");
  const [daftarMitra, setDaftarMitra] = useState<Mitra[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // MEMUAT MITRA DARI SUPABASE DATABASE (PRODUSEN & ADMIN TOKO)
  const muatMitraDatabase = useCallback(async () => {
    setLoading(true);
    try {
      const { data: dataProdusen } = await supabase
        .from("produsen")
        .select("id, nama_usaha, alamat, kabupaten, provinsi, kategori, foto, created_at");

      const { data: dataAdminToko } = await supabase
        .from("admin_toko")
        .select("id, nama_toko, alamat, kabupaten, foto, created_at");

      const daftarDiolah: Mitra[] = [];

      if (dataProdusen) {
        dataProdusen.forEach((p) => {
          const lokasi = [p.kabupaten, p.provinsi].filter(Boolean).join(", ") || p.alamat || "Lokasi belum disetel";
          const tahun = p.created_at ? new Date(p.created_at).getFullYear() : 2026;

          daftarDiolah.push({
            id: p.id,
            nama: p.nama_usaha || "Produsen Binaan",
            tipe: "Produsen Hulu",
            lokasi: lokasi,
            komoditas: p.kategori || "Bahan Baku & Olahan",
            rating: 5.0,
            sejakTahun: tahun,
            tag: "Produsen Binaan",
            fotoUrl: p.foto || undefined
          });
        });
      }

      if (dataAdminToko) {
        dataAdminToko.forEach((a) => {
          const lokasi = [a.alamat, a.kabupaten].filter(Boolean).join(", ") || "Lokasi belum disetel";
          const tahun = a.created_at ? new Date(a.created_at).getFullYear() : 2026;

          daftarDiolah.push({
            id: a.id,
            nama: a.nama_toko || "Admin Toko UMKM",
            tipe: "Admin Toko / Koperasi",
            lokasi: lokasi,
            komoditas: "Koperasi & Komoditas Grosir",
            rating: 4.8,
            sejakTahun: tahun,
            tag: "Koperasi Digital",
            fotoUrl: a.foto || undefined
          });
        });
      }

      setDaftarMitra(daftarDiolah);
    } catch (err) {
      console.error("Gagal memuat data mitra:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatMitraDatabase();
  }, [muatMitraDatabase]);

  const filtered = daftarMitra.filter((m) => {
    const cocokTipe = filter === "Semua" || m.tipe === filter;
    const q = search.trim().toLowerCase();
    const cocokCari = !q || m.nama.toLowerCase().includes(q) || m.komoditas.toLowerCase().includes(q) || m.lokasi.toLowerCase().includes(q);
    return cocokTipe && cocokCari;
  });

  const totalProdusen = daftarMitra.filter((m) => m.tipe === "Produsen Hulu").length;
  const totalKoperasi = daftarMitra.filter((m) => m.tipe === "Admin Toko / Koperasi").length;

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{ __html: `
        .glass-nav {
          background: ${isScrolled ? 'rgba(244, 250, 245, 0.88)' : 'rgba(8, 23, 14, 0.10)'};
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          border-bottom: 1px solid ${isScrolled ? 'rgba(14,42,27,0.08)' : 'rgba(163,230,53,0.14)'};
          box-shadow: ${isScrolled ? '0 6px 30px rgba(8, 23, 14, 0.06)' : 'none'};
        }
        .gradient-lime {
          background: linear-gradient(135deg, ${C.emerald} 0%, ${C.lime} 100%);
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(24px,-18px) scale(1.08); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; animation: floatBlob 14s ease-in-out infinite; }

        .ledger-grid {
          position: absolute; inset: 0; pointer-events: none;
          background-image:
            linear-gradient(rgba(163,230,53,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(163,230,53,0.05) 1px, transparent 1px);
          background-size: 46px 46px;
          mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 78%);
          -webkit-mask-image: radial-gradient(ellipse 80% 70% at 50% 40%, #000 30%, transparent 78%);
        }

        .mitra-card {
          background: ${C.card};
          border: 1px solid ${C.border};
          transition: transform .35s cubic-bezier(.4,0,.2,1), box-shadow .35s ease, border-color .35s ease;
          position: relative;
          overflow: hidden;
        }
        .mitra-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 4px;
          background: linear-gradient(90deg, ${C.green}, ${C.lime});
          opacity: 0; transition: opacity .35s ease;
        }
        .mitra-card:hover { transform: translateY(-6px); box-shadow: 0 24px 46px -20px rgba(14,42,27,0.28); border-color: rgba(34,197,94,0.45); }
        .mitra-card:hover::before { opacity: 1; }

        .filter-chip {
          border: 1px solid ${C.border};
          background: #fff;
          color: ${C.muted};
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.55rem 1.15rem;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .filter-chip:hover { border-color: ${C.emerald}; color: ${C.greenDark}; }
        .filter-chip.active { background: ${C.forest}; color: ${C.limeSoft}; border-color: ${C.forest}; }

        .search-input:focus { border-color: ${C.emerald} !important; box-shadow: 0 0 0 4px rgba(34,197,94,0.12); }

        .cta-btn { transition: transform .25s ease, box-shadow .25s ease; }
        .cta-btn:hover { transform: translateY(-2px); box-shadow: 0 14px 30px -10px rgba(163,230,53,0.5); }

        @media (max-width: 768px) {
          .header-container { padding: 0.5rem !important; }
          .nav-logo-text { font-size: 0.9rem !important; }
          .nav-logo-img { height: 22px !important; }
          .btn-back { padding: 0.3rem 0.7rem !important; font-size: 0.62rem !important; gap: 0.25rem !important; }
          .btn-back svg { width: 12px !important; height: 12px !important; }
          .hero-section { padding: 6.5rem 1rem 3.5rem !important; }
          .hero-eyebrow { font-size: 0.62rem !important; padding: 0.4rem 1rem !important; }
          .hero-title { font-size: 2.1rem !important; line-height: 1.15 !important; }
          .hero-desc { font-size: 0.9rem !important; }
          .stats-row { grid-template-columns: repeat(3,1fr) !important; gap: 0.55rem !important; }
          .stat-value { font-size: 1.1rem !important; }
          .stat-label { font-size: 0.6rem !important; }
          .main-content { padding: 2.75rem 0.75rem 5rem !important; }
          .mitra-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .filters-row { flex-wrap: wrap !important; gap: 0.4rem !important; }
          .toolbar { flex-direction: column !important; align-items: stretch !important; }
          .search-wrap { width: 100% !important; }
          .cta-box { padding: 2.25rem 1.25rem !important; }
          .cta-title { font-size: 1.5rem !important; }
          .footer-container { padding: 2rem 1rem !important; }
          .footer-wrapper { flex-direction: column !important; text-align: center !important; gap: 0.75rem !important; }
          .footer-wrapper span { font-size: 0.72rem !important; line-height: 1.4 !important; }
        }
      `}} />

      {/* ================= NAVBAR ================= */}
      <header className="glass-nav header-container" style={{ padding: "1rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <Image
            className="nav-logo-img"
            src="/logo.png"
            alt="Logo PasarNusa"
            width={40}
            height={40}
            style={{ height: "38px", width: "auto", objectFit: "contain", borderRadius: "8px" }}
          />
          <span className="nav-logo-text" style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.02em", color: isScrolled ? C.ink : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? C.green : C.lime }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back" style={{
            padding: "0.6rem 1.5rem", fontSize: "0.9rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? C.green : "#FFFFFF", color: isScrolled ? "#FFFFFF" : C.greenDark, borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* ================= HERO ================= */}
      <section className="hero-section" style={{
        padding: "13rem 2rem 6rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        background: `radial-gradient(120% 120% at 50% 0%, ${C.forest2} 0%, ${C.forest} 42%, ${C.deep} 100%)`,
      }}>
        <div className="ledger-grid" />
        <div className="blob" style={{ width: 440, height: 440, background: C.emerald, opacity: 0.20, top: -150, left: -110 }} />
        <div className="blob" style={{ width: 380, height: 380, background: C.lime, opacity: 0.16, bottom: -170, right: -90, animationDelay: "3s" }} />

        <div style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.5rem 1.4rem", borderRadius: "99px", background: "rgba(163, 230, 53, 0.12)", border: "1px solid rgba(163, 230, 53, 0.35)", color: C.limeSoft, fontWeight: 700, fontSize: "0.8rem", letterSpacing: "0.14em", marginBottom: "1.75rem", textTransform: "uppercase" }}>
            <ShieldCheck size={15} /> Jaringan Mitra Terverifikasi
          </div>

          <h1 className="hero-title" style={{ fontSize: "4.4rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.08, marginBottom: "1.5rem", letterSpacing: "-0.035em" }}>
            Koperasi &amp; Produsen di Balik <span className="gradient-lime">Setiap Produk</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: "1.18rem", color: "#CFE7D6", lineHeight: 1.7, maxWidth: "680px", marginLeft: "auto", marginRight: "auto", marginBottom: "3rem" }}>
            Setiap mitra di direktori ini adalah toko dan produsen binaan PasarNusa yang terdaftar resmi dan terverifikasi di sistem kami — transparan, terukur, dan bisa diaudit.
          </p>

          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem", maxWidth: "660px", marginLeft: "auto", marginRight: "auto" }}>
            {[
              { icon: Sprout, label: "Produsen Binaan", value: `${totalProdusen}` },
              { icon: Store, label: "Koperasi / Toko", value: `${totalKoperasi}` },
              { icon: TrendingUp, label: "Total Mitra", value: `${daftarMitra.length}` },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(163,230,53,0.16)", borderRadius: "1.1rem", padding: "1.15rem 0.75rem", backdropFilter: "blur(8px)" }}>
                <s.icon size={22} color={C.lime} style={{ marginBottom: "0.5rem" }} />
                <div className="stat-value" style={{ fontSize: "1.55rem", fontWeight: 800, color: "#fff", lineHeight: 1 }}>{s.value}</div>
                <div className="stat-label" style={{ fontSize: "0.72rem", color: "#9DBAA6", fontWeight: 600, marginTop: "0.3rem", letterSpacing: "0.02em" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= MAIN ================= */}
      <main className="main-content" style={{ padding: "5rem 2rem 7rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <Reveal>
          <div className="toolbar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", marginBottom: "2.75rem" }}>
            <div className="filters-row" style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {filterTipe.map((t) => (
                <button key={t} onClick={() => setFilter(t)} className={`filter-chip${filter === t ? " active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
            <div className="search-wrap" style={{ position: "relative", width: "min(340px, 100%)" }}>
              <Search size={16} color={C.muted} style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                className="search-input"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, komoditas, atau lokasi..."
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.6rem", borderRadius: "99px", border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", boxSizing: "border-box", color: C.ink, transition: "border-color .2s ease, box-shadow .2s ease" }}
              />
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: C.muted }}>
            <Leaf size={30} color={C.emerald} style={{ marginBottom: "0.75rem", animation: "floatBlob 3s ease-in-out infinite" }} />
            <p style={{ fontWeight: 600 }}>Memuat daftar mitra terdaftar...</p>
          </div>
        ) : (
          <div className="mitra-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div className="mitra-card" style={{ padding: "1.75rem", borderRadius: "1.5rem", height: "100%", display: "flex", flexDirection: "column", boxSizing: "border-box" }}>
                  
                  {/* HEADER KARTU: FOTO PROFIL & NAMA */}
                  <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
                    <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", background: "#F1F5F9", border: "2px solid #E3EDE7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {m.fotoUrl ? (
                        <img src={m.fotoUrl} alt={m.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Store size={24} color="#64748B" />
                      )}
                    </div>
                    <div>
                      <span style={{ background: m.tipe === "Produsen Hulu" ? "#ECFDF5" : "#EFF6FF", color: m.tipe === "Produsen Hulu" ? "#059669" : "#2563EB", fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "99px", display: "inline-block" }}>
                        {m.tag}
                      </span>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: "0.25rem 0 0 0" }}>{m.nama}</h3>
                    </div>
                  </div>

                  {/* LOKASI */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: C.muted, fontSize: "0.85rem", marginBottom: "0.9rem" }}>
                    <MapPin size={14} color={C.emerald} /> {m.lokasi}
                  </div>

                  {/* KOMODITAS */}
                  <p style={{ color: "#3F5A4C", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.35rem 0", flexGrow: 1 }}>
                    Sektor / Komoditas: <strong style={{ color: C.ink }}>{m.komoditas}</strong>
                  </p>

                  {/* FOOTER KARTU */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: "1rem", fontSize: "0.78rem", color: C.muted, fontWeight: 600 }}>
                    <span>Mitra sejak {m.sejakTahun}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: C.green, fontWeight: 700 }}>
                      <ShieldCheck size={13} /> Terverifikasi
                    </span>
                  </div>

                </div>
              </Reveal>
            ))}

            {filtered.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "4rem 1rem", color: C.muted }}>
                <Filter size={30} color={C.emerald} style={{ marginBottom: "0.6rem" }} />
                <p style={{ fontWeight: 600 }}>Belum ada mitra terdaftar yang cocok dengan pencarianmu.</p>
              </div>
            )}
          </div>
        )}

        {/* ================= CTA ================= */}
        <Reveal delay={100}>
          <div className="cta-box" style={{ marginTop: "5rem", background: `radial-gradient(120% 140% at 0% 0%, ${C.forest2} 0%, ${C.forest} 45%, ${C.deep} 100%)`, borderRadius: "2rem", padding: "3.5rem clamp(1.5rem, 5vw, 4rem)", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(163,230,53,0.14)" }}>
            <div className="blob" style={{ width: 320, height: 320, background: C.lime, opacity: 0.16, top: -110, right: -70 }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: "99px", background: "rgba(163,230,53,0.12)", border: "1px solid rgba(163,230,53,0.3)", color: C.limeSoft, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                <Sprout size={13} /> Gabung Jaringan
              </div>
              <h2 className="cta-title" style={{ fontSize: "2.15rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.02em" }}>
                Punya Usaha atau Kelompok Tani Sendiri?
              </h2>
              <p style={{ color: "#CFE7D6", fontSize: "1.05rem", marginBottom: "2.25rem", maxWidth: "580px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
                Daftarkan diri sebagai Produsen Hulu atau Admin Toko/Koperasi untuk masuk ke jaringan PasarNusa yang transparan dan terukur.
              </p>
              <Link href="/login" className="cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: `linear-gradient(135deg, ${C.emerald}, ${C.lime})`, color: C.deep, padding: "0.95rem 2.4rem", borderRadius: "99px", fontWeight: 800, textDecoration: "none", fontSize: "0.98rem" }}>
                Ajukan Kemitraan Sekarang
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="footer-container" style={{ padding: "3rem 4rem", background: C.deep, color: C.muted, borderTop: "1px solid rgba(163,230,53,0.06)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#7C978A" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#5B7267" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}