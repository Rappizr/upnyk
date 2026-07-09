import type { Metadata } from "next";

const pengajuanVerifikasi = [
  { id: "REQ-091", namaUsaha: "Kopi Arabika Gayo", pemilik: "Ibu Citra", dokumen: "NIB & Sertifikat Halal", tanggal: "05 Jul 2026", wilayah: "Aceh" },
  { id: "REQ-092", namaUsaha: "Madu Hutan Sumbawa", pemilik: "Pak Ahmad", dokumen: "P-IRT & KTP Pemilik", tanggal: "07 Jul 2026", wilayah: "NTB" },
  { id: "REQ-093", namaUsaha: "Kripik Singkong Renyah", pemilik: "Siti Aminah", dokumen: "Bandung", wilayah: "Bandung" },
];

export default function VerifikasiAkun() {
  return (
    // LANGSUNG MASUK KE KONTEN UTAMA (HAPUS SIDEBAR ASIDE)
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Verifikasi Pendaftaran UMKM</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Tinjau dokumen legalitas dan setujui kemitraan UMKM baru.</p>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID Pengajuan</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Usaha</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Pemilik</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Wilayah</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Dokumen Kelengkapan</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {pengajuanVerifikasi.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{row.namaUsaha}</td>
                <td style={{ padding: "1rem", color: "#334155" }}>{row.pemilik}</td>
                <td style={{ padding: "1rem", color: "#475569" }}>{row.wilayah}</td>
                <td style={{ padding: "1rem", color: "#2563EB", fontWeight: 500 }}><span style={{ cursor: "pointer", textDecoration: "underline" }}>Lihat {row.dokumen}</span></td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button style={{ background: "#D1FAE5", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Setujui</button>
                  <button style={{ background: "#FEE2E2", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Tolak</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}