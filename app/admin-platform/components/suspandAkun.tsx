"use client";

<<<<<<< Updated upstream
import { useMemo, useState, FormEvent } from "react";

type UmkmStatus = "Aktif" | "Pending" | "Suspended" | "Ditolak";

interface UmkmEntry {
  id: string;
  nama: string;
  pemilik: string;
  kategori: string;
  wilayah: string;
  status: UmkmStatus;
  tanggal: string;
  dokumen?: string;
}

interface PelanggaranEntry {
  id: string;
  nama: string;
  jenis: string;
  pelanggaran: string;
  status: string;
  tanggal: string;
}

interface Props {
  umkmList: UmkmEntry[];
  pelanggaranList: PelanggaranEntry[];
  addPelanggaran: (entry: { nama: string; jenis: string; pelanggaran: string; targetUmkmId?: string }) => void;
  pulihkanPelanggaran: (id: string) => void;
}

const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconAlert = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;

// ---- Pendeteksi otomatis tingkat keparahan pelanggaran berdasarkan kata kunci ----
const KATA_KUNCI_TINGGI = ["manipulasi", "curang", "palsu", "penipuan", "subsidi"];
const KATA_KUNCI_SEDANG = ["tidak sesuai", "kualitas", "aduan", "keterlambatan"];

function deteksiTingkat(teks: string): "Tinggi" | "Sedang" | "Rendah" {
  const t = teks.toLowerCase();
  if (KATA_KUNCI_TINGGI.some((k) => t.includes(k))) return "Tinggi";
  if (KATA_KUNCI_SEDANG.some((k) => t.includes(k))) return "Sedang";
  return "Rendah";
}

function rekomendasiUntuk(tingkat: string): string {
  if (tingkat === "Tinggi") return "Bekukan seluruh transaksi akun, audit stok/dokumen fisik, dan minta klarifikasi tertulis dalam 2x24 jam sebelum pemulihan dipertimbangkan.";
  if (tingkat === "Sedang") return "Kirim peringatan resmi ke akun terkait, minta bukti perbaikan kualitas/layanan dalam 7 hari, pantau transaksi berikutnya.";
  return "Catat sebagai laporan ringan, pantau perilaku akun untuk 30 hari ke depan.";
}

const tingkatStyle: Record<string, { bg: string; color: string }> = {
  Tinggi: { bg: "#FEE2E2", color: "#991B1B" },
  Sedang: { bg: "#FEF3C7", color: "#92400E" },
  Rendah: { bg: "#F1F5F9", color: "#475569" },
};

export default function SuspendAkun({ umkmList, pelanggaranList, addPelanggaran, pulihkanPelanggaran }: Props) {
  const [investigasiRow, setInvestigasiRow] = useState<PelanggaranEntry | null>(null);
  const [showManualModal, setShowManualModal] = useState(false);
  const [form, setForm] = useState({ nama: "", jenis: "UMKM", pelanggaran: "", targetUmkmId: "" });

  const peringatanAktif = useMemo(() => {
    return pelanggaranList
      .filter((p) => p.status !== "Dipulihkan")
      .map((p) => ({ ...p, tingkat: deteksiTingkat(p.pelanggaran) }))
      .sort((a, b) => (a.tingkat === "Tinggi" ? -1 : 1) - (b.tingkat === "Tinggi" ? -1 : 1));
  }, [pelanggaranList]);

  function handleManualSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.pelanggaran) return;
    addPelanggaran({
      nama: form.nama,
      jenis: form.jenis,
      pelanggaran: form.pelanggaran,
      targetUmkmId: form.targetUmkmId || undefined,
    });
    setForm({ nama: "", jenis: "UMKM", pelanggaran: "", targetUmkmId: "" });
    setShowManualModal(false);
  }
=======
import { Badge, Button, PageHeader, statusVariant, Table, TableCard, Td, Th, THead, Tr } from "./ui/AdminUI";
import { Icon } from "./ui/icons";

const akunBermasalah = [
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", jenis: "UMKM", pelanggaran: "Manipulasi Stok & Harga Subsidi", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "SUP-012", nama: "Supplier Pupuk Palsu", jenis: "Supplier", pelanggaran: "Aduan Kualitas Tidak Sesuai Deskripsi", status: "Review Internal", tanggal: "02 Jul 2026" },
];
>>>>>>> Stashed changes

  return (
<<<<<<< Updated upstream
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Pelanggaran & Suspend Akun</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Tindak lanjuti pelaporan user atau bekukan akun yang melanggar aturan platform.</p>
        </div>
        <button onClick={() => setShowManualModal(true)} style={{ background: "#EF4444", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Suspend Akun Manual</button>
      </div>

      {peringatanAktif.length > 0 && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "12px", padding: "1rem 1.25rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
            <span style={{ color: "#F59E0B" }}><IconAlert /></span>
            <strong style={{ color: "#92400E", fontSize: "0.95rem" }}>Pendeteksi Otomatis: {peringatanAktif.length} akun terindikasi melanggar aturan platform</strong>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {peringatanAktif.map((p) => {
              const s = tingkatStyle[p.tingkat];
              return (
                <div key={p.id} style={{ background: "white", borderRadius: "8px", padding: "0.75rem 0.9rem", border: "1px solid #F1F5F9" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "0.85rem" }}>{p.nama} <span style={{ fontWeight: 400, color: "#94A3B8" }}>({p.jenis})</span></div>
                    <span style={{ background: s.bg, color: s.color, fontSize: "0.7rem", fontWeight: 700, padding: "0.15rem 0.55rem", borderRadius: "999px" }}>Risiko {p.tingkat}</span>
                  </div>
                  <div style={{ fontSize: "0.8rem", color: "#64748B", margin: "0.3rem 0" }}>{p.pelanggaran}</div>
                  <div style={{ fontSize: "0.78rem", color: "#334155", background: "#F8FAFC", padding: "0.5rem 0.65rem", borderRadius: "6px" }}>
                    <strong>Rekomendasi:</strong> {rekomendasiUntuk(p.tingkat)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID Pengguna</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Akun / Entitas</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Peran</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Alasan Pelanggaran</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pelanggaranList.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{row.nama}</td>
                <td style={{ padding: "1rem", color: "#475569" }}>{row.jenis}</td>
                <td style={{ padding: "1rem", color: "#991B1B", fontWeight: 500 }}>{row.pelanggaran}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ background: row.status === "Suspended" ? "#FEE2E2" : row.status === "Dipulihkan" ? "#D1FAE5" : "#FEF3C7", color: row.status === "Suspended" ? "#991B1B" : row.status === "Dipulihkan" ? "#065F46" : "#92400E", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <button onClick={() => setInvestigasiRow(row)} style={{ background: "#F1F5F9", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#334155", fontWeight: 500, cursor: "pointer" }}>Investigasi</button>
                  {row.status !== "Dipulihkan" && (
                    <button onClick={() => pulihkanPelanggaran(row.id)} style={{ background: "#D1FAE5", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Pulihkan Akun</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {investigasiRow && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "440px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Detail Investigasi</h2>
              <button onClick={() => setInvestigasiRow(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem", marginBottom: "1rem" }}>
              <div><strong style={{ color: "#64748B" }}>ID:</strong> <span style={{ color: "#1E293B" }}>{investigasiRow.id}</span></div>
              <div><strong style={{ color: "#64748B" }}>Nama:</strong> <span style={{ color: "#1E293B" }}>{investigasiRow.nama}</span></div>
              <div><strong style={{ color: "#64748B" }}>Jenis:</strong> <span style={{ color: "#1E293B" }}>{investigasiRow.jenis}</span></div>
              <div><strong style={{ color: "#64748B" }}>Pelanggaran:</strong> <span style={{ color: "#1E293B" }}>{investigasiRow.pelanggaran}</span></div>
              <div><strong style={{ color: "#64748B" }}>Tanggal Laporan:</strong> <span style={{ color: "#1E293B" }}>{investigasiRow.tanggal}</span></div>
              <div><strong style={{ color: "#64748B" }}>Tingkat Risiko:</strong> <span style={{ color: "#1E293B" }}>{deteksiTingkat(investigasiRow.pelanggaran)}</span></div>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#334155", background: "#F8FAFC", padding: "0.65rem 0.85rem", borderRadius: "8px", marginBottom: "1.1rem" }}>
              <strong>Rekomendasi tindakan:</strong> {rekomendasiUntuk(deteksiTingkat(investigasiRow.pelanggaran))}
            </div>
            <button onClick={() => setInvestigasiRow(null)} style={{ width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}

      {showManualModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "440px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Suspend Akun Manual</h2>
              <button onClick={() => setShowManualModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleManualSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jenis Akun</label>
                <select value={form.jenis} onChange={(e) => setForm({ ...form, jenis: e.target.value, targetUmkmId: "" })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="UMKM">UMKM</option>
                  <option value="Supplier">Supplier</option>
                </select>
              </div>
              {form.jenis === "UMKM" ? (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Pilih UMKM Terdaftar *</label>
                  <select required value={form.targetUmkmId} onChange={(e) => { const u = umkmList.find((x) => x.id === e.target.value); setForm({ ...form, targetUmkmId: e.target.value, nama: u ? u.nama : "" }); }} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                    <option value="">Pilih UMKM...</option>
                    {umkmList.filter((u) => u.status !== "Suspended").map((u) => <option key={u.id} value={u.id}>{u.id} — {u.nama}</option>)}
                  </select>
                </div>
              ) : (
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Supplier *</label>
                  <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Supplier Bahan Baku Palsu" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
                </div>
              )}
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Alasan Pelanggaran *</label>
                <textarea required value={form.pelanggaran} onChange={(e) => setForm({ ...form, pelanggaran: e.target.value })} placeholder="Contoh: Manipulasi data stok barang" rows={3} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", fontFamily: "inherit", resize: "vertical" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowManualModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#EF4444", color: "white", fontWeight: 600, cursor: "pointer" }}>Suspend Sekarang</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
=======
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Pelanggaran & Suspend Akun"
        subtitle="Tindak lanjuti pelaporan pengguna atau bekukan akun yang melanggar aturan platform."
        action={<Button variant="danger" icon={<Icon.UserX size={16} />}>Suspend Akun Manual</Button>}
      />

      <TableCard>
        <Table>
          <THead>
            <Th>ID Pengguna</Th>
            <Th>Nama Akun / Entitas</Th>
            <Th>Peran</Th>
            <Th>Alasan Pelanggaran</Th>
            <Th>Status</Th>
            <Th center>Aksi</Th>
          </THead>
          <tbody>
            {akunBermasalah.map((row) => (
              <Tr key={row.id}>
                <Td className="font-semibold text-[var(--color-text-muted)]">{row.id}</Td>
                <Td className="font-semibold">{row.nama}</Td>
                <Td className="text-[var(--color-text-muted)]">{row.jenis}</Td>
                <Td className="text-[#991B1B]">{row.pelanggaran}</Td>
                <Td>
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                </Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="subtle" className="px-3 py-1.5 text-xs">Investigasi</Button>
                    {row.status === "Suspended" && <Button variant="successSubtle" className="px-3 py-1.5 text-xs">Pulihkan Akun</Button>}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </div>
>>>>>>> Stashed changes
  );
}
