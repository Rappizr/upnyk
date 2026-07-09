const akunBermasalah = [
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", jenis: "UMKM", pelanggaran: "Manipulasi Stok & Harga Subsidi", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "SUP-012", nama: "Supplier Pupuk Palsu", jenis: "Supplier", pelanggaran: "Aduan Kualitas Tidak Sesuai Deskripsi", status: "Review Internal", tanggal: "02 Jul 2026" },
];

export default function SuspendAkun() {
  return (
    // LANGSUNG MASUK KE KONTEN UTAMA (HAPUS SIDEBAR ASIDE)
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Pelanggaran & Suspend Akun</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Tindak lanjuti pelaporan user atau bekukan akun yang melanggar aturan platform.</p>
        </div>
        <button style={{ background: "#EF4444", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Suspend Akun Manual</button>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
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
            {akunBermasalah.map((row) => (
              <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{row.nama}</td>
                <td style={{ padding: "1rem", color: "#475569" }}>{row.jenis}</td>
                <td style={{ padding: "1rem", color: "#991B1B", fontWeight: 500 }}>{row.pelanggaran}</td>
                <td style={{ padding: "1rem" }}>
                  <span style={{ background: row.status === "Suspended" ? "#FEE2E2" : "#FEF3C7", color: row.status === "Suspended" ? "#991B1B" : "#92400E", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>
                    {row.status}
                  </span>
                </td>
                <td style={{ padding: "1rem", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                  <button style={{ background: "#F1F5F9", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#334155", fontWeight: 500, cursor: "pointer" }}>Investigasi</button>
                  {row.status === "Suspended" && (
                    <button style={{ background: "#D1FAE5", border: "none", padding: "0.4rem 0.8rem", borderRadius: "4px", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Pulihkan Akun</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}