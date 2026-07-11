"use client";
<<<<<<< Updated upstream

import { useMemo, useState } from "react";

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

interface Props {
  umkmList: UmkmEntry[];
  setUmkmStatus: (id: string, status: UmkmStatus) => void;
}

function bulanFromTanggal(tanggal: string) {
  const parts = tanggal.split(" ");
  return parts.length >= 2 ? parts[1] : tanggal;
}

// Grafik batang kecil — ditulis manual di file ini juga (tidak import dari mana-mana)
function MiniBarChart({ data, labelKey, valueKey, color = "#2563EB" }: { data: any[]; labelKey: string; valueKey: string; color?: string }) {
  const max = Math.max(...data.map((d) => d[valueKey]), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "0.75rem", height: "160px", padding: "0.5rem 0" }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", height: "100%", justifyContent: "flex-end" }}>
          <div style={{ fontSize: "0.7rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>{d[valueKey]}</div>
          <div style={{ width: "100%", maxWidth: "36px", height: `${(d[valueKey] / max) * 100}%`, background: color, borderRadius: "6px 6px 0 0", minHeight: "4px" }} />
          <div style={{ fontSize: "0.7rem", color: "#64748B", marginTop: "0.4rem" }}>{d[labelKey]}</div>
        </div>
      ))}
    </div>
  );
}

const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconX2 = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconFile = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;

export default function VerifikasiAkun({ umkmList, setUmkmStatus }: Props) {
  const [docModal, setDocModal] = useState<UmkmEntry | null>(null);

  const pengajuan = useMemo(() => umkmList.filter((u) => u.status === "Pending"), [umkmList]);

  const stats = useMemo(() => {
    const disetujui = umkmList.filter((u) => u.status === "Aktif").length;
    const menunggu = umkmList.filter((u) => u.status === "Pending").length;
    const ditolak = umkmList.filter((u) => u.status === "Ditolak").length;
    return { total: umkmList.length, disetujui, menunggu, ditolak };
  }, [umkmList]);

  const perBulan = useMemo(() => {
    const map: Record<string, number> = {};
    umkmList.forEach((u) => {
      const b = bulanFromTanggal(u.tanggal);
      map[b] = (map[b] || 0) + 1;
    });
    return Object.entries(map).map(([bulan, jumlah]) => ({ bulan, jumlah }));
  }, [umkmList]);
=======

import { ActionLink, Button, Card, PageHeader, Table, TableCard, Td, Th, THead, Tr } from "./ui/AdminUI";
import { Icon } from "./ui/icons";

const pengajuanVerifikasi = [
  { id: "REQ-091", namaUsaha: "Kopi Arabika Gayo", pemilik: "Ibu Citra", dokumen: "NIB & Sertifikat Halal", tanggal: "05 Jul 2026", wilayah: "Aceh" },
  { id: "REQ-092", namaUsaha: "Madu Hutan Sumbawa", pemilik: "Pak Ahmad", dokumen: "P-IRT & KTP Pemilik", tanggal: "07 Jul 2026", wilayah: "NTB" },
  { id: "REQ-093", namaUsaha: "Kripik Singkong Renyah", pemilik: "Siti Aminah", dokumen: "NIB & KTP Pemilik", tanggal: "07 Jul 2026", wilayah: "Bandung" },
];
>>>>>>> Stashed changes

  return (
<<<<<<< Updated upstream
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Verifikasi Pendaftaran UMKM</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Tinjau dokumen legalitas dan setujui kemitraan UMKM baru. Data ini sama dengan Data UMKM & Dashboard.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconFile /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{stats.total}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total UMKM Terdaftar</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{stats.disetujui}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Sudah Terverifikasi</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#F59E0B", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{stats.menunggu}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Menunggu Tinjauan</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconX2 /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{stats.ditolak}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Ditolak</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0", marginBottom: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.25rem", fontSize: "1rem", fontWeight: 600, color: "#1E293B" }}>Pengajuan UMKM per Bulan</h3>
        <p style={{ margin: "0 0 0.5rem", fontSize: "0.8rem", color: "#64748B" }}>Total seluruh pendaftaran (semua status) dikelompokkan per bulan pengajuan</p>
        <MiniBarChart data={perBulan} labelKey="bulan" valueKey="jumlah" color="#2563EB" />
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <h3 style={{ margin: 0, padding: "1.25rem 1.25rem 0", fontSize: "1rem", fontWeight: 600, color: "#1E293B" }}>Menunggu Tinjauan ({pengajuan.length})</h3>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "650px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID Pengajuan</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Usaha</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Pemilik</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Wilayah</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Dokumen</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengajuan.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada pengajuan yang menunggu tinjauan saat ini.</td></tr>
            )}
            {pengajuan.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{row.nama}</td>
                <td style={{ padding: "1rem", color: "#334155" }}>{row.pemilik}</td>
                <td style={{ padding: "1rem", color: "#475569" }}>{row.wilayah}</td>
                <td style={{ padding: "1rem", color: "#2563EB", fontWeight: 500 }}>
                  <span onClick={() => setDocModal(row)} style={{ cursor: "pointer", textDecoration: "underline" }}>Lihat {row.dokumen || "Dokumen"}</span>
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button onClick={() => setUmkmStatus(row.id, "Aktif")} style={{ background: "#D1FAE5", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Setujui</button>
                  <button onClick={() => setUmkmStatus(row.id, "Ditolak")} style={{ background: "#FEE2E2", border: "none", padding: "0.4rem 0.8rem", borderRadius: "6px", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
      </div>

      {docModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Kelengkapan Dokumen</h2>
              <button onClick={() => setDocModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.9rem" }}>
              <div><strong style={{ color: "#64748B" }}>Usaha:</strong> <span style={{ color: "#1E293B" }}>{docModal.nama}</span></div>
              <div><strong style={{ color: "#64748B" }}>Pemilik:</strong> <span style={{ color: "#1E293B" }}>{docModal.pemilik}</span></div>
              <div><strong style={{ color: "#64748B" }}>Dokumen:</strong> <span style={{ color: "#1E293B" }}>{docModal.dokumen || "Belum dilampirkan"}</span></div>
              <div><strong style={{ color: "#64748B" }}>Diajukan:</strong> <span style={{ color: "#1E293B" }}>{docModal.tanggal}</span></div>
            </div>
            <button onClick={() => setDocModal(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
=======
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Verifikasi Pendaftaran UMKM"
        subtitle="Tinjau dokumen legalitas dan setujui kemitraan UMKM baru sebelum tampil di marketplace."
        action={
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[var(--color-primary)] bg-[var(--color-primary-light)] px-3 py-2 rounded-lg">
            <Icon.UserCheck size={16} /> {pengajuanVerifikasi.length} menunggu tinjauan
          </span>
        }
      />

      {pengajuanVerifikasi.length === 0 ? (
        <Card className="text-center text-sm text-[var(--color-text-muted)] py-10">Tidak ada pengajuan verifikasi baru saat ini.</Card>
      ) : (
        <TableCard>
          <Table>
            <THead>
              <Th>ID Pengajuan</Th>
              <Th>Nama Usaha</Th>
              <Th>Pemilik</Th>
              <Th>Wilayah</Th>
              <Th>Dokumen Kelengkapan</Th>
              <Th center>Aksi</Th>
            </THead>
            <tbody>
              {pengajuanVerifikasi.map((row) => (
                <Tr key={row.id}>
                  <Td className="font-semibold text-[var(--color-text-muted)]">{row.id}</Td>
                  <Td className="font-semibold">{row.namaUsaha}</Td>
                  <Td className="text-[var(--color-text-muted)]">{row.pemilik}</Td>
                  <Td className="text-[var(--color-text-muted)]">{row.wilayah}</Td>
                  <Td>
                    <ActionLink>Lihat {row.dokumen}</ActionLink>
                  </Td>
                  <Td center>
                    <div className="flex items-center justify-center gap-2">
                      <Button variant="successSubtle" className="px-3 py-1.5 text-xs" icon={<Icon.Check size={14} />}>Setujui</Button>
                      <Button variant="dangerSubtle" className="px-3 py-1.5 text-xs" icon={<Icon.X size={14} />}>Tolak</Button>
                    </div>
                  </Td>
                </Tr>
              ))}
            </tbody>
          </Table>
        </TableCard>
      )}
    </div>
>>>>>>> Stashed changes
  );
}
