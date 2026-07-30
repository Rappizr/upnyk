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
  tipe: "Toko UMKM" | "Produsen Hulu";
  lokasi: string;
  komoditas: string;
  rating: number;
  sejakTahun: number;
  tag: string;
  fotoUrl?: string;
}

const filterTipe = ["Semua", "Toko UMKM", "Produsen Hulu"] as const;


const C = {
  deep: "#051B11",
  forest: "#0A3A22",
  forest2: "#12633B",
  green: "#0A4D2E",
  greenLift: "#0F6337",
  emerald: "#16A34A",
  emeraldBright: "#22C55E",
  mint: "#4ADE80",
  bg: "#F6F8F5",
  card: "#FFFFFF",
  border: "#E3EAE3",
  ink: "#101C16",
  body: "#47554C",
  muted: "#6B7A70",
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
    <div ref={ref} style={{ opacity: inView ? 1 : 0, transform: inView ? "translateY(0)" : "translateY(24px)", transition: `opacity .7s ease ${delay}ms, transform .7s cubic-bezier(.16,1,.3,1) ${delay}ms` }}>
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
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
            tipe: "Toko UMKM",
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
  const totalKoperasi = daftarMitra.filter((m) => m.tipe === "Toko UMKM").length;

  return (
    <div className="pn-root" style={{ minHeight: "100vh", background: C.bg, fontFamily: "var(--font-sans), system-ui, sans-serif", color: C.ink, overflowX: "hidden" }}>

      <style dangerouslySetInnerHTML={{ __html: `
        /* ===== TOKEN — disamakan dengan landing page ===== */
        .pn-root {
          --ink: #101C16;
          --paper: #F6F8F5;
          --line: #E3EAE3;
          --muted: #6B7A70;
          --body: #47554C;
          --green: #0A4D2E;
          --green-lift: #0F6337;
          --emerald: #16A34A;
          --mint: #4ADE80;
        }

        .glass-nav {
          background: ${isScrolled ? 'rgba(252, 253, 252, 0.90)' : 'transparent'};
          backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          -webkit-backdrop-filter: ${isScrolled ? 'saturate(180%) blur(14px)' : 'none'};
          border-bottom: 1px solid ${isScrolled ? 'rgba(16,28,22,0.07)' : 'transparent'};
          box-shadow: ${isScrolled ? '0 6px 24px rgba(6,40,24,0.06)' : 'none'};
          transition: background .35s ease, box-shadow .35s ease, border-color .35s ease;
        }

        .gradient-lime { color: var(--green); font-weight: 800; }

        .btn-primary {
          background: linear-gradient(180deg, var(--green-lift) 0%, var(--green) 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 6px 18px rgba(10,77,46,0.26), inset 0 1px 0 rgba(255,255,255,0.12);
          transition: transform .22s ease, box-shadow .22s ease, filter .22s ease;
        }
        .btn-primary:hover { filter: brightness(1.08); transform: translateY(-1px); }
        .btn-primary:active { transform: translateY(0) scale(.985); }

        .pn-root a:focus-visible, .pn-root button:focus-visible, .pn-root input:focus-visible {
          outline: 2px solid var(--emerald); outline-offset: 3px; border-radius: 6px;
        }

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

        .stat-box {
          background: #FFFFFF; border: 1px solid var(--line); border-radius: 1.1rem;
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 10px 26px rgba(6,40,24,.05);
          transition: transform .32s cubic-bezier(.16,1,.3,1), box-shadow .32s ease;
        }
        .stat-box:hover { transform: translateY(-3px); box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 18px 34px rgba(6,40,24,.09); }
        .stat-value { font-variant-numeric: tabular-nums; letter-spacing: -0.02em; }

        .mitra-card {
          background: #FFFFFF;
          border: 1px solid var(--line);
          box-shadow: 0 1px 2px rgba(6,40,24,.04), 0 8px 20px rgba(6,40,24,.04);
          transition: transform .35s cubic-bezier(.16,1,.3,1), box-shadow .35s ease, border-color .35s ease;
          position: relative;
          overflow: hidden;
        }
        .mitra-card::before {
          content: ""; position: absolute; top: 0; left: 0; right: 0; height: 3px;
          background: var(--card-accent, var(--green));
          opacity: .85; transition: opacity .35s ease, height .35s ease;
        }
        .mitra-card:hover { transform: translateY(-5px); box-shadow: 0 2px 4px rgba(6,40,24,.05), 0 22px 44px rgba(6,40,24,.12); border-color: rgba(10,77,46,0.22); }
        .mitra-card:hover::before { opacity: 1; height: 4px; }
        .mitra-grid > div { min-width: 0; }

        .filter-chip {
          border: 1px solid var(--line);
          background: #fff;
          color: var(--muted);
          font-weight: 700;
          font-size: 0.85rem;
          padding: 0.55rem 1.15rem;
          border-radius: 99px;
          cursor: pointer;
          transition: all 0.25s ease;
          white-space: nowrap;
        }
        .filter-chip:hover { border-color: var(--emerald); color: var(--green); }
        .filter-chip.active {
          background: linear-gradient(180deg, var(--green-lift), var(--green));
          color: #FFFFFF; border-color: var(--green);
          box-shadow: 0 4px 14px rgba(10,77,46,.24);
        }

        .search-input { color: var(--ink); background: #fff; }
        .search-input::placeholder { color: var(--muted); }
        .search-input:focus { border-color: var(--emerald) !important; box-shadow: 0 0 0 4px rgba(22,163,74,0.12); }

        .cta-btn {
          background: linear-gradient(180deg, #22C55E 0%, #16A34A 100%);
          color: #FFFFFF;
          border: 1px solid rgba(255,255,255,0.18);
          box-shadow: 0 8px 22px rgba(22,163,74,0.32), inset 0 1px 0 rgba(255,255,255,0.18);
          transition: transform .25s ease, box-shadow .25s ease, filter .25s ease;
        }
        .cta-btn:hover { filter: brightness(1.07); transform: translateY(-2px); }

        @media (max-width: 768px) {
          .header-container { padding: 0.5rem !important; }
          .nav-logo-text { font-size: 0.9rem !important; }
          .nav-logo-img { height: 22px !important; }
          .btn-back { padding: 0.3rem 0.7rem !important; font-size: 0.62rem !important; gap: 0.25rem !important; }
          .btn-back svg { width: 12px !important; height: 12px !important; }
          .hero-section { padding: 7rem 1rem 3.5rem !important; }
          .hero-eyebrow { font-size: 0.62rem !important; padding: 0.4rem 1rem !important; }
          .hero-title { font-size: 2.1rem !important; line-height: 1.15 !important; }
          .hero-desc { font-size: 0.9rem !important; }

          .stats-row { grid-template-columns: repeat(3,1fr) !important; gap: 0.4rem !important; }
          .stats-row > div { padding: 0.65rem 0.4rem !important; border-radius: 0.7rem !important; }
          .stats-row svg { width: 16px !important; height: 16px !important; margin-bottom: 0.25rem !important; }
          .stat-value { font-size: 0.95rem !important; }
          .stat-label { font-size: 0.6rem !important; line-height: 1.2 !important; }

          .main-content { padding: 2rem 0.6rem 4rem !important; }

          .toolbar { flex-wrap: nowrap !important; gap: 0.4rem !important; margin-bottom: 1.25rem !important; align-items: center !important; }
          .filters-row { flex-wrap: nowrap !important; gap: 0.3rem !important; overflow-x: auto !important; -webkit-overflow-scrolling: touch !important; scrollbar-width: none !important; flex-shrink: 0 !important; }
          .filters-row::-webkit-scrollbar { display: none !important; }
          .filter-chip { padding: 0.4rem 0.65rem !important; font-size: 0.66rem !important; }

          /* DIPASKAN: kotak cari sebelumnya dipatok 34px dengan placeholder
             transparan — tidak bisa dipakai mengetik. Sekarang mengisi ruang
             sisa di baris yang sama, jadi susunannya tetap satu baris. */
          .search-wrap { flex: 1 1 auto !important; min-width: 0 !important; width: auto !important; }
          .search-input { padding: 0.5rem 0.6rem 0.5rem 2rem !important; font-size: 0.72rem !important; }

          .mitra-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.3rem !important; }
          .mitra-card { padding: 0.5rem 0.45rem !important; border-radius: 0.6rem !important; min-width: 0 !important; }
          .mitra-card-header { gap: 0.3rem !important; margin-bottom: 0.4rem !important; align-items: flex-start !important; flex-direction: column !important; }
          .mitra-avatar { width: 30px !important; height: 30px !important; border-width: 1px !important; }
          .mitra-avatar svg { width: 14px !important; height: 14px !important; }

          /* DIPASKAN: ukuran di bawah 0.58rem (±9px) tidak terbaca di layar HP.
             Kolomnya tetap 3 seperti versi PC, hanya tipografinya dinaikkan
             ke batas layak baca dan kartunya dibiarkan tumbuh lebih tinggi. */
          .mitra-badge { font-size: 0.56rem !important; padding: 0.1rem 0.32rem !important; }
          .mitra-title { font-size: 0.66rem !important; margin-top: 0.2rem !important; line-height: 1.25 !important; word-break: break-word !important; }
          .mitra-location { font-size: 0.58rem !important; gap: 2px !important; margin-bottom: 0.3rem !important; }
          .mitra-location svg { width: 9px !important; height: 9px !important; flex-shrink: 0 !important; }
          .mitra-sector { font-size: 0.58rem !important; margin-bottom: 0.4rem !important; line-height: 1.4 !important; word-break: break-word !important; }
          .mitra-footer { padding-top: 0.4rem !important; font-size: 0.54rem !important; flex-direction: column !important; align-items: flex-start !important; gap: 0.2rem !important; }
          .mitra-footer svg { width: 9px !important; height: 9px !important; flex-shrink: 0 !important; }

          .cta-box { padding: 2.25rem 1.25rem !important; }
          .cta-title { font-size: 1.5rem !important; }
          .footer-container { padding: 2rem 1rem !important; }
          .footer-wrapper { flex-direction: column !important; text-align: center !important; gap: 0.75rem !important; }
          .footer-wrapper span { font-size: 0.72rem !important; line-height: 1.4 !important; }

          /* ---- visual saja ---- */
          .hero-section::before {
            background: linear-gradient(180deg, var(--paper) 0%, rgba(246,248,245,0.98) 48%, rgba(246,248,245,0.86) 76%, rgba(246,248,245,0.6) 100%) !important;
          }
          .hero-section::after { height: 60px !important; }
          .mitra-card::before { height: 2px; }
        }

        @media (max-width: 380px) {
          .mitra-grid { gap: 0.25rem !important; }
          .mitra-card { padding: 0.4rem 0.35rem !important; }
          .mitra-title { font-size: 0.62rem !important; }
          .mitra-badge { font-size: 0.52rem !important; padding: 0.08rem 0.26rem !important; }
          .mitra-avatar { width: 26px !important; height: 26px !important; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pn-root *, .pn-root *::before, .pn-root *::after {
            animation-duration: .001ms !important; animation-iteration-count: 1 !important;
            transition-duration: .001ms !important;
          }
        }
      `}} />

      <header className="glass-nav header-container" style={{ padding: "1rem 4rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "fixed", top: 0, left: 0, width: "100%", zIndex: 999, boxSizing: "border-box" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
          <Image
            className="nav-logo-img"
            src="/logo.png"
            alt="Logo PasarNusa"
            width={40}
            height={40}
            style={{ height: "38px", width: "auto", objectFit: "contain", borderRadius: "8px" }}
          />
          <span className="nav-logo-text" style={{ fontSize: "1.45rem", fontWeight: 800, letterSpacing: "-0.03em", color: C.ink }}>
            Pasar<span style={{ color: C.green }}>Nusa</span>
          </span>
        </div>
        <nav style={{ display: "flex", alignItems: "center" }}>
          <Link href="/" className="btn-back btn-primary" style={{
            padding: "0.6rem 1.5rem", fontSize: "0.9rem", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "0.5rem",
            borderRadius: "99px", textDecoration: "none"
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

        <div style={{ maxWidth: "880px", marginLeft: "auto", marginRight: "auto", position: "relative", zIndex: 1 }}>
          <div className="hero-eyebrow" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.45rem 1.2rem", borderRadius: "99px", background: "rgba(10,77,46,0.07)", border: "1px solid rgba(10,77,46,0.22)", color: C.green, fontWeight: 700, fontSize: "0.78rem", letterSpacing: "0.12em", marginBottom: "1.6rem", textTransform: "uppercase" }}>
            <ShieldCheck size={15} /> Jaringan Mitra Terverifikasi
          </div>

          <h1 className="hero-title" style={{ fontSize: "4.4rem", fontWeight: 800, color: C.ink, lineHeight: 1.08, marginBottom: "1.5rem", letterSpacing: "-0.035em" }}>
            Koperasi &amp; Produsen di Balik <span className="gradient-lime">Setiap Produk</span>
          </h1>

          <p className="hero-desc" style={{ fontSize: "1.18rem", color: C.body, lineHeight: 1.7, maxWidth: "680px", marginLeft: "auto", marginRight: "auto", marginBottom: "3rem" }}>
            Setiap mitra di direktori ini adalah toko dan produsen binaan PasarNusa yang terdaftar resmi dan terverifikasi di sistem kami: transparan, terukur, dan bisa diaudit.
          </p>

          <div className="stats-row" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1.1rem", maxWidth: "660px", marginLeft: "auto", marginRight: "auto" }}>
            {[
              { icon: Sprout, label: "Produsen Binaan", value: `${totalProdusen}` },
              { icon: Store, label: "Toko UMKM", value: `${totalKoperasi}` },
              { icon: TrendingUp, label: "Total Mitra", value: `${daftarMitra.length}` },
            ].map((s, i) => (
              <div key={i} className="stat-box" style={{ padding: "1.15rem 0.75rem" }}>
                <s.icon size={22} color={C.green} style={{ marginBottom: "0.5rem" }} />
                <div className="stat-value" style={{ fontSize: "1.55rem", fontWeight: 800, color: C.ink, lineHeight: 1 }}>{s.value}</div>
                <div className="stat-label" style={{ fontSize: "0.75rem", color: C.muted, fontWeight: 600, marginTop: "0.3rem" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

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
                style={{ width: "100%", padding: "0.75rem 1rem 0.75rem 2.6rem", borderRadius: "99px", border: `1px solid ${C.border}`, fontSize: "0.9rem", outline: "none", boxSizing: "border-box", transition: "border-color .2s ease, box-shadow .2s ease" }}
              />
            </div>
          </div>
        </Reveal>

        {loading ? (
          <div style={{ textAlign: "center", padding: "5rem 1rem", color: C.muted }}>
            <Leaf size={30} color={C.emerald} style={{ marginBottom: "0.75rem" }} />
            <p style={{ fontWeight: 600 }}>Memuat daftar mitra terdaftar...</p>
          </div>
        ) : (
          <div className="mitra-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.75rem" }}>
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={i * 60}>
                <div
                  className="mitra-card"
                  style={{
                    padding: "1.75rem", borderRadius: "1.35rem", height: "100%",
                    display: "flex", flexDirection: "column", boxSizing: "border-box",
                    ["--card-accent" as any]: m.tipe === "Produsen Hulu" ? C.green : C.emerald
                  }}
                >
                  <div className="mitra-card-header" style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "1.25rem" }}>
                    <div className="mitra-avatar" style={{ width: "52px", height: "52px", borderRadius: "50%", overflow: "hidden", background: "#F1F5F2", border: `2px solid ${C.border}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      {m.fotoUrl ? (
                        <img src={m.fotoUrl} alt={m.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <Store size={24} color={C.muted} />
                      )}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <span className="mitra-badge" style={{ background: m.tipe === "Produsen Hulu" ? "rgba(10,77,46,0.09)" : "rgba(14,110,128,0.09)", color: m.tipe === "Produsen Hulu" ? C.green : "#0E6E80", fontSize: "0.68rem", fontWeight: 800, padding: "0.25rem 0.6rem", borderRadius: "99px", display: "inline-block", letterSpacing: "0.04em" }}>
                        {m.tag}
                      </span>
                      <h3 className="mitra-title" style={{ fontSize: "1.15rem", fontWeight: 800, color: C.ink, margin: "0.25rem 0 0 0", letterSpacing: "-0.02em", overflow: "hidden", textOverflow: "ellipsis" }}>{m.nama}</h3>
                    </div>
                  </div>

                  <div className="mitra-location" style={{ display: "flex", alignItems: "center", gap: "5px", color: C.muted, fontSize: "0.85rem", marginBottom: "0.9rem" }}>
                    <MapPin size={14} color={C.emerald} /> <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{m.lokasi}</span>
                  </div>

                  <p className="mitra-sector" style={{ color: C.body, fontSize: "0.9rem", lineHeight: 1.6, margin: "0 0 1.35rem 0", flexGrow: 1 }}>
                    Sektor / Komoditas: <strong style={{ color: C.ink }}>{m.komoditas}</strong>
                  </p>

                  <div className="mitra-footer" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: `1px solid ${C.border}`, paddingTop: "1rem", fontSize: "0.78rem", color: C.muted, fontWeight: 600 }}>
                    <span>Mitra sejak {m.sejakTahun}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", color: C.green, fontWeight: 800 }}>
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

        <Reveal delay={100}>
          <div className="cta-box" style={{ marginTop: "5rem", background: `radial-gradient(125% 125% at 12% 0%, ${C.forest2} 0%, ${C.forest} 46%, ${C.deep} 100%)`, borderRadius: "1.75rem", padding: "3.5rem clamp(1.5rem, 5vw, 4rem)", textAlign: "center", position: "relative", overflow: "hidden", border: "1px solid rgba(74,222,128,0.18)", boxShadow: "0 20px 44px rgba(6,40,24,0.24)" }}>
            <span aria-hidden="true" style={{ position: "absolute", right: "-14%", bottom: "-44%", width: "68%", aspectRatio: "1", background: "radial-gradient(circle, rgba(74,222,128,0.18), transparent 66%)", pointerEvents: "none" }} />
            <div style={{ position: "relative" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.4rem 1.1rem", borderRadius: "99px", background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.14)", color: C.mint, fontWeight: 700, fontSize: "0.72rem", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
                <Sprout size={13} /> Gabung Jaringan
              </div>
              <h2 className="cta-title" style={{ fontSize: "2.15rem", fontWeight: 800, color: "#fff", marginBottom: "1rem", letterSpacing: "-0.03em" }}>
                Punya Usaha atau Kelompok Tani Sendiri?
              </h2>
              <p style={{ color: "#C7D6CC", fontSize: "1.05rem", marginBottom: "2.25rem", maxWidth: "580px", marginLeft: "auto", marginRight: "auto", lineHeight: 1.65 }}>
                Daftarkan diri sebagai Produsen Hulu atau Admin Toko/Koperasi untuk masuk ke jaringan PasarNusa yang transparan dan terukur.
              </p>
              <Link href="/login" className="cta-btn" style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", padding: "0.95rem 2.4rem", borderRadius: "99px", fontWeight: 700, textDecoration: "none", fontSize: "0.98rem" }}>
                Ajukan Kemitraan Sekarang
              </Link>
            </div>
          </div>
        </Reveal>
      </main>

      <footer className="footer-container" style={{ padding: "3rem 4rem", background: C.deep, color: "#A3BDB0", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="footer-wrapper" style={{ maxWidth: "1200px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem", fontSize: "0.9rem" }}>
          <span style={{ color: "#A3BDB0" }}>© 2026 PasarNusa &amp; Supply Chain Platform. Seluruh Hak Cipta Dilindungi.</span>
          <span style={{ color: "#7C9187" }}>Dibuat untuk Kemajuan Ekonomi UMKM Lokal Indonesia.</span>
        </div>
      </footer>
    </div>
  );
}