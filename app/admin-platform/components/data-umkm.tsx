"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";

interface TokoUmkm {
  id: string;
  nama: string;
  pemilik: string;
  lokasi: string;
  status: "Aktif" | "Suspended" | "Menunggu";
  telepon: string;
  email: string;
}

interface TransaksiRelasi {
  id: string;
  produsen: string;
  total: number;
  tanggal: string;
}

const statusStyle: Record<string, { bg: string; color: string }> = {
  Aktif: { bg: "#D1FAE5", color: "#065F46" },
  Suspended: { bg: "#FEE2E2", color: "#991B1B" },
  Menunggu: { bg: "#FEF3C7", color: "#92400E" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconBan = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

export default function DataUMKM() {
  const [umkmList, setUmkmList] = useState<TokoUmkm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<TokoUmkm | null>(null);
  const [transaksiRelasi, setTransaksiRelasi] = useState<TransaksiRelasi[]>([]);
  const [loadingRelasi, setLoadingRelasi] = useState(false);

  // FETCH DATA UMKM / ADMIN TOKO DARI SUPABASE
  const muatDataUmkm = useCallback(async () => {
    setLoading(true);
    try {
      // 1. Coba kueri terelasi langsung
      const { data: adminRelasi, error: errRelasi } = await supabase
        .from("admin_toko")
        .select(`
          id, profile_id, nama_toko, alamat, desa, kecamatan, kabupaten, status,
          profiles ( nama, phone, email )
        `)
        .order("created_at", { ascending: false });

      if (!errRelasi && adminRelasi) {
        const mapped: TokoUmkm[] = adminRelasi.map((a: any) => {
          const lokasiFormatted = [a.alamat, a.kecamatan, a.kabupaten].filter(Boolean).join(", ") || "Lokasi belum disetel";
          let statusNormalized: TokoUmkm["status"] = "Aktif";
          if (a.status === "suspended") statusNormalized = "Suspended";
          else if (a.status === "menunggu") statusNormalized = "Menunggu";

          return {
            id: a.id,
            nama: a.nama_toko || "Admin Toko UMKM",
            pemilik: a.profiles?.nama || "Pemilik Toko",
            lokasi: lokasiFormatted,
            status: statusNormalized,
            telepon: a.profiles?.phone || "-",
            email: a.profiles?.email || "-",
          };
        });
        setUmkmList(mapped);
        setLoading(false);
        return;
      }

      // 2. Fallback jika Foreign Key belum terpasang di Supabase
      const { data: adminTokoData } = await supabase
        .from("admin_toko")
        .select("id, profile_id, nama_toko, alamat, desa, kecamatan, kabupaten, status");

      const profileIds = (adminTokoData || []).map((a) => a.profile_id).filter(Boolean);
      let profileMap = new Map();

      if (profileIds.length > 0) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("id, nama, phone, email")
          .in("id", profileIds);

        if (profileData) {
          profileMap = new Map(profileData.map((p) => [p.id, p]));
        }
      }

      const mappedFallback: TokoUmkm[] = (adminTokoData || []).map((a) => {
        const prof = profileMap.get(a.profile_id);
        const lokasiFormatted = [a.alamat, a.kecamatan, a.kabupaten].filter(Boolean).join(", ") || "Lokasi belum disetel";
        
        let statusNormalized: TokoUmkm["status"] = "Aktif";
        if (a.status === "suspended") statusNormalized = "Suspended";
        else if (a.status === "menunggu") statusNormalized = "Menunggu";

        return {
          id: a.id,
          nama: a.nama_toko || "Admin Toko UMKM",
          pemilik: prof?.nama || "Pemilik Toko",
          lokasi: lokasiFormatted,
          status: statusNormalized,
          telepon: prof?.phone || "-",
          email: prof?.email || "-",
        };
      });

      setUmkmList(mappedFallback);
    } catch (err) {
      console.error("Error muatDataUmkm:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatDataUmkm();
  }, [muatDataUmkm]);

  // TOGGLE SUSPEND / AKTIFKAN AKUN DI SUPABASE
  async function toggleSuspendEntitas(id: string, statusSaatIni: string) {
    const statusBaru = statusSaatIni === "Aktif" ? "suspended" : "aktif";
    const statusLabel = statusSaatIni === "Aktif" ? "Suspended" : "Aktif";

    const { error } = await supabase
      .from("admin_toko")
      .update({ status: statusBaru })
      .eq("id", id);

    if (error) {
      alert(`Gagal mengubah status toko: ${error.message}`);
    } else {
      setUmkmList((prev) =>
        prev.map((u) => (u.id === id ? { ...u, status: statusLabel } : u))
      );
      if (detail && detail.id === id) {
        setDetail((prev) => (prev ? { ...prev, status: statusLabel } : null));
      }
    }
  }

  // KELOLA & BUKA DETAIL TOKO UMKM
  async function bukaKelolaDetail(toko: TokoUmkm) {
    setDetail(toko);
    setLoadingRelasi(true);
    setTransaksiRelasi([]);

    try {
      const { data: pesananData } = await supabase
        .from("pesanan")
        .select("id, produsen_id, total_harga, created_at")
        .eq("admin_toko_id", toko.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (pesananData && pesananData.length > 0) {
        const produsenIds = pesananData.map((p) => p.produsen_id).filter(Boolean);
        let produsenMap = new Map();

        if (produsenIds.length > 0) {
          const { data: prodData } = await supabase
            .from("produsen")
            .select("id, nama_usaha")
            .in("id", produsenIds);

          if (prodData) {
            produsenMap = new Map(prodData.map((pr) => [pr.id, pr.nama_usaha]));
          }
        }

        const mappedTx: TransaksiRelasi[] = pesananData.map((p) => ({
          id: p.id.slice(0, 8).toUpperCase(),
          produsen: produsenMap.get(p.produsen_id) || "Produsen Binaan",
          total: Number(p.total_harga) || 0,
          tanggal: new Date(p.created_at).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" }),
        }));
        setTransaksiRelasi(mappedTx);
      }
    } catch (err) {
      console.error("Gagal muat transaksi toko:", err);
    } finally {
      setLoadingRelasi(false);
    }
  }

  const filtered = useMemo(() => {
    return umkmList.filter((b) => {
      const q = search.trim().toLowerCase();
      const matchSearch =
        !q ||
        b.nama.toLowerCase().includes(q) ||
        b.pemilik.toLowerCase().includes(q) ||
        b.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || b.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [umkmList, search, statusFilter]);

  const totalMenunggu = useMemo(() => umkmList.filter((b) => b.status === "Menunggu").length, [umkmList]);
  const totalAktif = useMemo(() => umkmList.filter((b) => b.status === "Aktif").length, [umkmList]);
  const totalSuspended = useMemo(() => umkmList.filter((b) => b.status === "Suspended").length, [umkmList]);

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontFamily: "sans-serif" }}>
        Memuat Data UMKM Terdaftar...
      </div>
    );
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif" }}>
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          main h1 { font-size: 1.15rem !important; }
          main p { font-size: 0.62rem !important; line-height: 1.2 !important; }
          .umkm-stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.25rem !important; margin-bottom: 1rem !important; }
          .umkm-stat-card { padding: 0.4rem !important; border-radius: 6px !important; gap: 0.4rem !important; }
          .umkm-stat-card > div:first-child { padding: 0.3rem !important; border-radius: 6px !important; }
          .umkm-stat-card > div:first-child svg { width: 14px !important; height: 14px !important; }
          .umkm-filter-wrapper { padding: 0.6rem !important; border-radius: 8px !important; gap: 0.5rem !important; margin-bottom: 1rem !important; }
          .umkm-table-container th, .umkm-table-container td { padding: 0.5rem 0.4rem !important; font-size: 0.58rem !important; }
          .umkm-table-container table { min-width: auto !important; width: 100% !important; }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Data UMKM</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
          Daftar Admin Toko/UMKM terdaftar — kelola status operasional dan suspend akun.
        </p>
      </div>

      <div className="umkm-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="umkm-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconStore /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Toko Aktif</div></div>
        </div>
        <div className="umkm-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalMenunggu}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Belum Lengkap</div></div>
        </div>
        <div className="umkm-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBan /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalSuspended}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Suspended</div></div>
        </div>
      </div>

      <div className="umkm-filter-wrapper" style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama toko, pemilik, atau ID..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Aktif">Aktif</option>
          <option value="Menunggu">Belum Lengkap</option>
          <option value="Suspended">Suspended</option>
        </select>
      </div>

      <div className="umkm-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>ID Toko</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Toko/UMKM</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Pemilik</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Lokasi Operasional</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada data toko UMKM yang cocok.</td></tr>
              )}
              {filtered.map((b) => {
                const s = statusStyle[b.status] || statusStyle["Aktif"];
                return (
                  <tr key={b.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>#{b.id.slice(0, 8).toUpperCase()}</td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{b.nama}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{b.pemilik}</td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{b.lokasi}</td>
                    <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{b.status}</span></td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <div style={{ display: "flex", gap: "0.4rem", justifyContent: "center", flexWrap: "wrap" }}>
                        <button onClick={() => bukaKelolaDetail(b)} style={{ background: "#EFF6FF", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Kelola</button>
                        <button onClick={() => toggleSuspendEntitas(b.id, b.status)} style={{ background: b.status === "Aktif" ? "#FEE2E2" : "#ECFDF5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: b.status === "Aktif" ? "#991B1B" : "#059669", fontWeight: 600, cursor: "pointer" }}>{b.status === "Aktif" ? "Suspend" : "Aktifkan"}</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL KELOLA & DETAIL TOKO */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "440px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>#{detail.id.slice(0, 8).toUpperCase()} • {detail.lokasi}</p>
            
            <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.85rem", display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem", marginBottom: "1.2rem" }}>
              <div><strong style={{ color: "#64748B" }}>Pemilik Toko:</strong> <span style={{ color: "#1E293B", fontWeight: 600 }}>{detail.pemilik}</span></div>
              <div><strong style={{ color: "#64748B" }}>Telepon/WA:</strong> <span style={{ color: "#1E293B" }}>{detail.telepon}</span></div>
              <div><strong style={{ color: "#64748B" }}>Email:</strong> <span style={{ color: "#1E293B" }}>{detail.email}</span></div>
              <div><strong style={{ color: "#64748B" }}>Status Akun:</strong> <span style={{ color: "#1E293B", fontWeight: 700 }}>{detail.status}</span></div>
            </div>

            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>5 Transaksi Terakhir Toko</div>
            {loadingRelasi ? (
              <p style={{ fontSize: "0.8rem", color: "#64748B" }}>Memuat riwayat transaksi...</p>
            ) : transaksiRelasi.length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Belum ada riwayat transaksi tercatat.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {transaksiRelasi.map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.8rem" }}>
                    <div>
                      <div style={{ color: "#1E293B", fontWeight: 600 }}>#{t.id}</div>
                      <div style={{ fontSize: "0.7rem", color: "#64748B" }}>{t.produsen} • {t.tanggal}</div>
                    </div>
                    <strong style={{ color: "#059669" }}>{formatRupiah(t.total)}</strong>
                  </div>
                ))}
              </div>
            )}

            <button onClick={() => setDetail(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </main>
  );
}