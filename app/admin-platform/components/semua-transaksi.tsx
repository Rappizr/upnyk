"use client";

import { useMemo, useState } from "react";

interface Transaksi {
  id: string;
  tanggal: string;
  umkm: string;
  supplier: string;
  nominal: number;
  jenis: string;
  status: "Selesai" | "Diproses" | "Dikirim" | "Dibatalkan";
  catatan?: string;
}

const initialData: Transaksi[] = [
  { id: "TX-90211", tanggal: "09 Jul 2026", umkm: "Keripik Tempe Sanan", supplier: "Pengepul Kedelai Lokal", nominal: 12500000, jenis: "Bahan Baku", status: "Selesai", catatan: "Pembayaran diterima penuh, barang sudah diterima UMKM." },
  { id: "TX-90212", tanggal: "08 Jul 2026", umkm: "Kopi Arabika Gayo", supplier: "Pabrik Pupuk Kompos", nominal: 3200000, jenis: "Penjualan Limbah", status: "Diproses", catatan: "Menunggu konfirmasi pembayaran dari pembeli." },
  { id: "TX-90213", tanggal: "07 Jul 2026", umkm: "Tenun Ikat Sasak", supplier: "Supplier Benang Sutra", nominal: 45000000, jenis: "Bahan Baku", status: "Dikirim", catatan: "Barang dalam perjalanan, estimasi tiba 2 hari lagi." },
  { id: "TX-90214", tanggal: "05 Jul 2026", umkm: "Sambal Bu Rudy", supplier: "Petani Cabai Makmur", nominal: 8750000, jenis: "Bahan Baku", status: "Dibatalkan", catatan: "Dibatalkan karena stok cabai supplier habis mendadak." },
  { id: "TX-90215", tanggal: "04 Jul 2026", umkm: "Batik Pekalongan Asli", supplier: "Distributor Pewarna Alami", nominal: 15400000, jenis: "Bahan Baku", status: "Selesai", catatan: "Transaksi rutin bulanan, tidak ada kendala." },
  { id: "TX-90216", tanggal: "02 Jul 2026", umkm: "Anyaman Rotan Kalimantan", supplier: "Koperasi Rotan Sejahtera", nominal: 6200000, jenis: "Bahan Baku", status: "Selesai" },
];

const jenisOptions = ["Bahan Baku", "Penjualan Limbah"];
const statusStyle: Record<string, { bg: string; color: string }> = {
  Selesai: { bg: "#D1FAE5", color: "#065F46" },
  Diproses: { bg: "#FEF3C7", color: "#92400E" },
  Dikirim: { bg: "#E0F2FE", color: "#075985" },
  Dibatalkan: { bg: "#FEE2E2", color: "#991B1B" },
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path><path d="M16 3H6a2 2 0 0 0-2 2v2"></path></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

const stepOrder = ["Diproses", "Dikirim", "Selesai"];

export default function SemuaTransaksiPage() {
  const [data, setData] = useState<Transaksi[]>(initialData);
  const [search, setSearch] = useState("");
  const [jenisFilter, setJenisFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Transaksi | null>(null);

  const filtered = useMemo(() => {
    return data.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || t.id.toLowerCase().includes(q) || t.umkm.toLowerCase().includes(q) || t.supplier.toLowerCase().includes(q);
      const matchJenis = !jenisFilter || t.jenis === jenisFilter;
      const matchStatus = !statusFilter || t.status === statusFilter;
      return matchSearch && matchJenis && matchStatus;
    });
  }, [data, search, jenisFilter, statusFilter]);

  const totalNominal = useMemo(() => data.reduce((s, t) => s + t.nominal, 0), [data]);
  const totalSelesai = data.filter((t) => t.status === "Selesai").length;
  const totalBermasalah = data.filter((t) => t.status === "Dibatalkan").length;

  function ubahStatus(id: string, status: Transaksi["status"]) {
    setData((prev) => prev.map((t) => (t.id === id ? { ...t, status } : t)));
    setDetail((d) => (d && d.id === id ? { ...d, status } : d));
  }

  function exportCSV() {
    const header = "ID,Tanggal,UMKM,Supplier,Jenis,Nominal,Status\n";
    const rows = data.map((t) => `${t.id},${t.tanggal},${t.umkm},${t.supplier},${t.jenis},${t.nominal},${t.status}`).join("\n");
    const blob = new Blob([header + rows], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "laporan-transaksi-pasarnusa.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Semua Transaksi</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Monitor dan audit seluruh aktivitas pembayaran komoditas di dalam platform secara real-time.</p>
        </div>
        <button onClick={exportCSV} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>⬇ Ekspor Laporan (CSV)</button>
      </div>

      {/* Ringkasan Megah */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconWallet /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Total Nilai Transaksi</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalNominal)}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconCheck /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Transaksi Selesai</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalSelesai} <span style={{ fontSize: "0.85rem", color: "#94A3B8", fontWeight: 500 }}>/ {data.length}</span></div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#FEF3C7", color: "#F59E0B", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconClock /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Sedang Berjalan</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{data.filter((t) => t.status === "Diproses" || t.status === "Dikirim").length}</div>
        </div>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.7rem", marginBottom: "0.6rem" }}>
            <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.5rem", borderRadius: "8px", display: "flex" }}><IconAlert /></div>
            <span style={{ fontSize: "0.8rem", color: "#64748B", fontWeight: 600 }}>Dibatalkan</span>
          </div>
          <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalBermasalah}</div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari ID, UMKM, atau supplier..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={jenisFilter} onChange={(e) => setJenisFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Jenis</option>
          {jenisOptions.map((j) => <option key={j} value={j}>{j}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Selesai">Selesai</option>
          <option value="Diproses">Diproses</option>
          <option value="Dikirim">Dikirim</option>
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "750px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID Transaksi</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Tanggal</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Pihak UMKM</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Pihak Supplier</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Jenis</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nominal</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={8} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada transaksi yang cocok.</td></tr>
            )}
            {filtered.map((tx) => {
              const s = statusStyle[tx.status];
              return (
                <tr key={tx.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#2563EB" }}>
                    <span onClick={() => setDetail(tx)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{tx.id}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "#64748B" }}>{tx.tanggal}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{tx.umkm}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{tx.supplier}</td>
                  <td style={{ padding: "1rem" }}><span style={{ fontSize: "0.85rem", background: "#F1F5F9", padding: "2px 6px", borderRadius: "4px" }}>{tx.jenis}</span></td>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(tx.nominal)}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{tx.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button onClick={() => setDetail(tx)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", cursor: "pointer" }}>Detail Kelola</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal Detail Kelola Transaksi */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "500px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.tanggal} • {detail.jenis}</p>

            {/* Progres Transaksi (stepper) */}
            {detail.status !== "Dibatalkan" ? (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                {stepOrder.map((step, i) => {
                  const currentIdx = stepOrder.indexOf(detail.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                        <div style={{ width: "26px", height: "26px", borderRadius: "50%", background: done ? "#2563EB" : "#E2E8F0", color: done ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.7rem", fontWeight: 700 }}>{i + 1}</div>
                        <span style={{ fontSize: "0.7rem", color: done ? "#1E293B" : "#94A3B8", marginTop: "0.3rem", fontWeight: done ? 600 : 400 }}>{step}</span>
                      </div>
                      {i < stepOrder.length - 1 && <div style={{ flex: 1, height: "2px", background: i < currentIdx ? "#2563EB" : "#E2E8F0", margin: "0 0.4rem 1.2rem" }} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.75rem 1rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>⚠ Transaksi ini dibatalkan</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pihak UMKM</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detail.umkm}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pihak Supplier</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detail.supplier}</div>
              </div>
            </div>
            <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "0.9rem", marginBottom: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600 }}>Nominal Transaksi</span>
              <span style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(detail.nominal)}</span>
            </div>
            {detail.catatan && (
              <div style={{ fontSize: "0.85rem", color: "#334155", background: "#F8FAFC", padding: "0.7rem 0.9rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
                <strong>Catatan:</strong> {detail.catatan}
              </div>
            )}

            {detail.status !== "Selesai" && detail.status !== "Dibatalkan" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => ubahStatus(detail.id, "Dibatalkan")} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Batalkan</button>
                {detail.status === "Diproses" && <button onClick={() => ubahStatus(detail.id, "Dikirim")} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Dikirim</button>}
                {detail.status === "Dikirim" && <button onClick={() => ubahStatus(detail.id, "Selesai")} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Selesai</button>}
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}
