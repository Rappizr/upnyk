"use client";

import { useMemo, useState } from "react";

type StatusPengaduan = "Baru" | "Diproses" | "Selesai";
type KategoriPengaduan = "Manipulasi Harga" | "Kendala Teknis" | "Sengketa Transaksi" | "Lainnya";

interface Pengaduan {
  id: string;
  pelapor: string;
  role: string;
  kontak: string;
  kategori: KategoriPengaduan;
  deskripsi: string;
  status: StatusPengaduan;
  tanggal: string;
}

interface Props {
  pengaduanList: Pengaduan[];
  updateStatusPengaduan: (id: string, status: StatusPengaduan) => void;
}

type FilterStatus = "Semua" | StatusPengaduan;

const IconFlag = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconLoader = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12a9 9 0 1 1-9-9"></path></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconShieldAlert = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"></path><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>;
const IconTool = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.77z"></path></svg>;
const IconScale = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="3" x2="12" y2="21"></line><path d="M5 7h14"></path><path d="m5 7 3 8a3 3 0 0 1-6 0l3-8Z"></path><path d="m19 7 3 8a3 3 0 0 1-6 0l3-8Z"></path></svg>;
const IconDots = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="1"></circle><circle cx="19" cy="12" r="1"></circle><circle cx="5" cy="12" r="1"></circle></svg>;
const IconPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;

const statusStyle: Record<StatusPengaduan, { bg: string; color: string }> = {
  Baru: { bg: "#DBEAFE", color: "#1D4ED8" },
  Diproses: { bg: "#FEF3C7", color: "#92400E" },
  Selesai: { bg: "#D1FAE5", color: "#065F46" },
};

const kategoriStyle: Record<KategoriPengaduan, { bg: string; color: string; icon: () => JSX.Element }> = {
  "Manipulasi Harga": { bg: "#FEE2E2", color: "#991B1B", icon: IconShieldAlert },
  "Kendala Teknis": { bg: "#DBEAFE", color: "#1D4ED8", icon: IconTool },
  "Sengketa Transaksi": { bg: "#FEF3C7", color: "#92400E", icon: IconScale },
  Lainnya: { bg: "#F1F5F9", color: "#475569", icon: IconDots },
};

export default function Pengaduan({ pengaduanList, updateStatusPengaduan }: Props) {
  const [filterStatus, setFilterStatus] = useState<FilterStatus>("Semua");
  const [filterKategori, setFilterKategori] = useState<"Semua" | KategoriPengaduan>("Semua");
  const [search, setSearch] = useState("");

  const jumlahBaru = pengaduanList.filter((p) => p.status === "Baru").length;
  const jumlahDiproses = pengaduanList.filter((p) => p.status === "Diproses").length;
  const jumlahSelesai = pengaduanList.filter((p) => p.status === "Selesai").length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return pengaduanList
      .filter((p) => filterStatus === "Semua" || p.status === filterStatus)
      .filter((p) => filterKategori === "Semua" || p.kategori === filterKategori)
      .filter((p) => !q || p.pelapor.toLowerCase().includes(q) || p.deskripsi.toLowerCase().includes(q) || p.kontak.toLowerCase().includes(q))
      .sort((a, b) => {
        const urutanStatus: Record<StatusPengaduan, number> = { Baru: 0, Diproses: 1, Selesai: 2 };
        return urutanStatus[a.status] - urutanStatus[b.status];
      });
  }, [pengaduanList, filterStatus, filterKategori, search]);

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Pengaduan</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Tiket aduan yang masuk lewat halaman Pusat Bantuan — dari Admin Toko, Produsen, maupun Pembeli.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#fff", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#F1F5F9", color: "#475569", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconFlag /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{pengaduanList.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Tiket</div></div>
        </div>
        <div style={{ background: "#DBEAFE", border: "1px solid #BFDBFE", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#1D4ED8", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1D4ED8" }}>{jumlahBaru}</div><div style={{ fontSize: "0.78rem", color: "#1D4ED8" }}>Tiket Baru</div></div>
        </div>
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconLoader /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#92400E" }}>{jumlahDiproses}</div><div style={{ fontSize: "0.78rem", color: "#92400E" }}>Sedang Diproses</div></div>
        </div>
        <div style={{ background: "#fff", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{jumlahSelesai}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Selesai Ditangani</div></div>
        </div>
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
        <div style={{ display: "flex", background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "3px" }}>
          {(["Semua", "Baru", "Diproses", "Selesai"] as FilterStatus[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                border: "none",
                background: filterStatus === s ? "#1E293B" : "transparent",
                color: filterStatus === s ? "white" : "#64748B",
                fontWeight: 600,
                fontSize: "0.8rem",
                padding: "0.4rem 0.8rem",
                borderRadius: "6px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <select
          value={filterKategori}
          onChange={(e) => setFilterKategori(e.target.value as "Semua" | KategoriPengaduan)}
          style={{ padding: "0.5rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.82rem", background: "white", color: "#334155" }}
        >
          <option value="Semua">Semua Kategori</option>
          <option value="Manipulasi Harga">Manipulasi Harga</option>
          <option value="Kendala Teknis">Kendala Teknis</option>
          <option value="Sengketa Transaksi">Sengketa Transaksi</option>
          <option value="Lainnya">Lainnya</option>
        </select>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama pelapor, kontak, atau isi aduan..."
          style={{ flex: "1 1 240px", maxWidth: "340px", padding: "0.5rem 0.9rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none" }}
        />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada tiket aduan yang cocok.</div>
        )}
        {filtered.map((p) => {
          const st = statusStyle[p.status];
          const kat = kategoriStyle[p.kategori];
          const KatIcon = kat.icon;
          return (
            <div key={p.id} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem 1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "0.6rem", marginBottom: "0.7rem" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", flexWrap: "wrap" }}>
                  <span style={{ fontSize: "0.72rem", color: "#94A3B8", fontWeight: 600 }}>{p.id}</span>
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: kat.bg, color: kat.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>
                    <KatIcon /> {p.kategori}
                  </span>
                  <span style={{ background: st.bg, color: st.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.2rem 0.55rem", borderRadius: "999px" }}>{p.status}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "#94A3B8", whiteSpace: "nowrap" }}>{p.tanggal}</span>
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.3rem 1rem", marginBottom: "0.6rem" }}>
                <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1E293B" }}>{p.pelapor}</span>
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>{p.role}</span>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "0.8rem", color: "#64748B" }}><IconPhone /> {p.kontak}</span>
              </div>

              <p style={{ margin: "0 0 1rem 0", fontSize: "0.85rem", color: "#334155", lineHeight: 1.55, background: "#F8FAFC", borderRadius: "8px", padding: "0.7rem 0.9rem" }}>{p.deskripsi}</p>

              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {p.status === "Baru" && (
                  <button onClick={() => updateStatusPengaduan(p.id, "Diproses")} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.5rem 0.9rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Mulai Proses</button>
                )}
                {p.status === "Diproses" && (
                  <>
                    <button onClick={() => updateStatusPengaduan(p.id, "Selesai")} style={{ background: "#10B981", color: "white", border: "none", padding: "0.5rem 0.9rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Tandai Selesai</button>
                    <button onClick={() => updateStatusPengaduan(p.id, "Baru")} style={{ background: "white", color: "#64748B", border: "1px solid #E2E8F0", padding: "0.5rem 0.9rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Kembalikan ke Baru</button>
                  </>
                )}
                {p.status === "Selesai" && (
                  <button onClick={() => updateStatusPengaduan(p.id, "Diproses")} style={{ background: "white", color: "#64748B", border: "1px solid #E2E8F0", padding: "0.5rem 0.9rem", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Buka Kembali</button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}