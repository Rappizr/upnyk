'use client';

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, Star, Filter, TrendingUp, Users, Package, Search, Store } from "lucide-react";
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
      // 1. Ambil data Produsen Hulu (beserta foto)
      const { data: dataProdusen } = await supabase
        .from("produsen")
        .select("id, nama_usaha, alamat, kabupaten, provinsi, kategori, foto, created_at");

      // 2. Ambil data Admin Toko / Koperasi UMKM (beserta foto)
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
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "var(--font-sans), system-ui, sans-serif", overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{ __html: `
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
        @keyframes floatBlob {
          0%, 100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(24px,-18px) scale(1.08); }
        }
        .blob { position: absolute; border-radius: 50%; filter: blur(70px); pointer-events: none; animation: floatBlob 13s ease-in-out infinite; }
        .mitra-card {
          background: #ffffff;
          border: 1px solid rgba(226, 232, 240, 0.8);
          transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .mitra-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 40px -15px rgba(37, 99, 235, 0.12);
          border-color: rgba(56, 189, 248, 0.4);
        }
        .filter-chip {
          border: 1px solid #E2E8F0;
          background: #fff;
          color: #475569;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.55rem 1.1rem;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.25s ease;
        }
        .filter-chip.active { background: #0F172A; color: #fff; border-color: #0F172A; }

        @media (max-width: 768px) {
          .header-container { padding-left: 0.5rem !important; padding-right: 0.5rem !important; padding-top: 0.5rem !important; padding-bottom: 0.5rem !important; }
          .nav-logo-text { font-size: 0.85rem !important; }
          .nav-logo-img { height: 20px !important; }
          .btn-back { padding: 0.25rem 0.5rem !important; font-size: 0.55rem !important; gap: 0.2rem !important; }
          .btn-back svg { width: 10px !important; height: 10px !important; }
          .hero-section { padding: 6rem 1rem 3rem !important; }
          .hero-title { font-size: 1.85rem !important; line-height: 1.25 !important; }
          .hero-desc { font-size: 0.85rem !important; }
          .stats-row { grid-template-columns: repeat(3,1fr) !important; gap: 0.5rem !important; }
          .main-content { padding: 2.5rem 0.5rem !important; }
          .mitra-grid { grid-template-columns: 1fr !important; gap: 1rem !important; }
          .filters-row { flex-wrap: wrap !important; gap: 0.4rem !important; }
          .footer-container { padding: 1.5rem 0.5rem !important; }
          .footer-wrapper { flex-direction: row !important; justify-content: space-between !important; gap: 0px !important; }
          .footer-wrapper span { font-size: 0.42rem !important; line-height: 1.2 !important; }
        }
      `}} />

      {/* NAVBAR */}
      <header className="glass-nav header-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "1rem", paddingBottom: "1rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, transition: "all 0.4s ease", boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <Image
            className="nav-logo-img"
            src="/logo.png"
            alt="Logo"
            width={40}
            height={40}
            style={{ height: "40px", width: "auto", objectFit: "contain", borderRadius: "8px" }}
          />
          <span className="nav-logo-text" style={{ fontSize: "1.5rem", fontWeight: 800, color: isScrolled ? "#1E293B" : "#FFFFFF", transition: "color 0.3s" }}>
            Pasar<span style={{ color: isScrolled ? "#2563EB" : "#38BDF8" }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back" style={{
            paddingTop: "0.6rem", paddingBottom: "0.6rem", paddingLeft: "1.5rem", paddingRight: "1.5rem", fontSize: "0.9rem", fontWeight: 600, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            backgroundColor: isScrolled ? "#2563EB" : "#FFFFFF", color: isScrolled ? "#FFFFFF" : "#2563EB", borderRadius: "99px", textDecoration: "none", transition: "all 0.3s ease"
          }}>
            <ArrowLeft size={16} />
            Kembali ke Beranda
          </Link>
        </nav>
      </header>

      {/* HERO */}
      <section className="hero-section" style={{
        paddingTop: "13rem", paddingBottom: "6rem", paddingLeft: "2rem", paddingRight: "2rem",
        textAlign: "center", position: "relative", overflow: "hidden",
        backgroundImage: `linear-gradient(to bottom, rgba(15, 23, 42, 0.82), rgba(15, 23, 42, 0.98))`,
        background: "#0B1120",
      }}>
        <div className="blob" style={{ width: 420, height: 420, background: "#38BDF8", opacity: 0.22, top: -140, left: -100 }} />
        <div className="blob" style={{ width: 380, height: 380, background: "#818CF8", opacity: 0.18, bottom: -160, right: -80, animationDelay: "3s" }} />
        <div style={{ maxWidth: "850px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-badge" style={{ display: "inline-block", padding: "0.5rem 1.5rem", borderRadius: "99px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", color: "#34D399", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: "1.5rem", textTransform: "uppercase" }}>
            Jaringan Mitra Terverifikasi
          </div>
          <h1 className="hero-title" style={{ fontSize: "4.2rem", fontWeight: 800, color: "#FFFFFF", lineHeight: 1.1, marginBottom: "1.5rem", letterSpacing: "-0.03em" }}>
            Koperasi &amp; Produsen di Balik <span className="gradient-text">Setiap Produk</span>
          </h1>
          <p className="hero-desc" style={{ fontSize: "1.2rem", color: "#E2E8F0", lineHeight: 1.7, maxWidth: "700px", marginLeft: "auto", marginRight: "auto", marginBottom: "3rem" }}>
            Setiap mitra di direktori ini merupakan toko dan produsen binaan PasarNusa yang terdaftar secara resmi dan terverifikasi di sistem kami.
          </p>

          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.25rem", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
            {[
              { icon: Users, label: "Produsen Binaan", value: `${totalProdusen}` },
              { icon: Package, label: "Koperasi / Toko", value: `${totalKoperasi}` },
              { icon: TrendingUp, label: "Mitra Terdaftar", value: `${daftarMitra.length}` },
            ].map((s, i) => (
              <div key={i} style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: "1rem", padding: "1rem", backdropFilter: "blur(8px)" }}>
                <s.icon size={20} color="#38BDF8" style={{ marginBottom: "0.4rem" }} />
                <div style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>{s.value}</div>
                <div style={{ fontSize: "0.7rem", color: "#94A3B8", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MAIN */}
      <main className="main-content" style={{ paddingTop: "5rem", paddingBottom: "7rem", paddingLeft: "2rem", paddingRight: "2rem", maxWidth: "1200px", marginLeft: "auto", marginRight: "auto" }}>
        <Reveal>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1.25rem", marginBottom: "2.5rem" }}>
            <div className="filters-row" style={{ display: "flex", gap: "0.6rem", flexWrap: "wrap" }}>
              {filterTipe.map((t) => (
                <button key={t} onClick={() => setFilter(t)} className={`filter-chip${filter === t ? " active" : ""}`}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ position: "relative", width: "min(320px, 100%)" }}>
              <Search size={16} color="#94A3B8" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, komoditas, atau lokasi..."
                style={{ width: "100%", padding: "0.7rem 1rem 0.7rem 2.5rem", borderRadius: "99px", border: "1px solid #E2E8F0", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ textAlign: "center", padding: "4rem", color: "#64748B" }}>
            Memuat daftar mitra terdaftar...
          </div>
        ) : (
          <div className="mitra-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div className="mitra-card" style={{ padding: "1.75rem", borderRadius: "1.5rem", height: "100%", display: "flex", flexDirection: "column" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1.25rem" }}>
                    {/* AVATAR / FOTO PROFIL TOKO */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
                      <div style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", background: "#F1F5F9", border: "2px solid #E2E8F0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        {m.fotoUrl ? (
                          <img src={m.fotoUrl} alt={m.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <Store size={24} color="#64748B" />
                        )}
                      </div>
                      <div>
                        <span style={{ background: m.tipe === "Produsen Hulu" ? "#ECFDF5" : "#EFF6FF", color: m.tipe === "Produsen Hulu" ? "#059669" : "#2563EB", fontSize: "0.68rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "99px" }}>{m.tag}</span>
                        <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#0F172A", margin: "0.25rem 0 0 0" }}>{m.nama}</h3>
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "4px", color: "#F59E0B", fontWeight: 700, fontSize: "0.85rem" }}>
                      <Star size={14} fill="#F59E0B" /> {m.rating.toFixed(1)}
                    </div>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "5px", color: "#64748B", fontSize: "0.85rem", marginBottom: "0.75rem" }}>
                    <MapPin size={14} /> {m.lokasi}
                  </div>
                  <p style={{ color: "#475569", fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.25rem 0", flexGrow: 1 }}>
                    Sektor / Komoditas: <strong>{m.komoditas}</strong>
                  </p>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #F1F5F9", paddingTop: "1rem", fontSize: "0.78rem", color: "#94A3B8", fontWeight: 600 }}>
                    <span>Mitra sejak {m.sejakTahun}</span>
                    <span style={{ color: "#10B981" }}>● Terverifikasi</span>
                  </div>
                </div>
              </Reveal>
            ))}
            {filtered.length === 0 && (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "3rem", color: "#94A3B8" }}>
                <Filter size={28} style={{ marginBottom: "0.5rem" }} />
                <p>Belum ada mitra terdaftar yang cocok dengan pencarianmu.</p>
              </div>
            )}
          </div>
        )}

        <Reveal delay={100}>
          <div style={{ marginTop: "5rem", background: "linear-gradient(135deg, #0F172A, #1E293B)", borderRadius: "2rem", padding: "3rem clamp(1.5rem, 5vw, 4rem)", textAlign: "center", position: "relative", overflow: "hidden" }}>
            <div className="blob" style={{ width: 300, height: 300, background: "#38BDF8", opacity: 0.18, top: -100, right: -60 }} />
            <h2 style={{ fontSize: "2rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", position: "relative" }}>Punya Usaha atau Kelompok Tani Sendiri?</h2>
            <p style={{ color: "#CBD5E1", fontSize: "1.05rem", marginBottom: "2rem", maxWidth: "560px", marginLeft: "auto", marginRight: "auto", position: "relative" }}>
              Daftarkan diri sebagai Produsen Hulu atau Admin Toko/Koperasi untuk masuk ke dalam jaringan PasarNusa.
            </p>
            <Link href="/login" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "#38BDF8", color: "#0F172A", padding: "0.9rem 2.2rem", borderRadius: "99px", fontWeight: 700, textDecoration: "none", position: "relative" }}>
              Ajukan Kemitraan Sekarang
            </Link>
          </div>
        </Reveal>
      </main>

      {/* FOOTER */}
      <footer className="footer-container" style={{ paddingLeft: "4rem", paddingRight: "4rem", paddingTop: "3rem", paddingBottom: "3rem", background: "#0B1120", color: "#475569", borderTop: "1px solid rgba(255,255,255,0.03)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#64748B" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#475569" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}