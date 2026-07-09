// Data Dummy UMKM untuk Tabel
const umkmData = [
  { id: "UMKM-001", nama: "Keripik Tempe Sanan", pemilik: "Pak Baihaqi", kategori: "Makanan & Minuman", wilayah: "Malang", status: "Aktif", tanggal: "12 Feb 2026" },
  { id: "UMKM-002", nama: "Kopi Arabika Gayo", pemilik: "Ibu Citra", kategori: "Pertanian / Komoditas", wilayah: "Aceh", status: "Pending", tanggal: "05 Jul 2026" },
  { id: "UMKM-003", nama: "Kerajinan Bambu Jaya", pemilik: "Dedi Kurniawan", kategori: "Kerajinan Kriya", wilayah: "Yogyakarta", status: "Aktif", tanggal: "20 Jan 2025" },
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", pemilik: "Rian", kategori: "Bahan Pokok", wilayah: "Jakarta", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "UMKM-005", nama: "Tenun Ikat Sasak", pemilik: "Ibu Nur", kategori: "Fashion & Tekstil", wilayah: "Lombok", status: "Aktif", tanggal: "09 Mei 2026" },
];

// Ikon Fitur Halaman
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;

export default function DataUMKM() {
  return (
    // LANGSUNG RENDERING KONTEN (TANPA TAMBAHAN ASIDE/SIDEBAR APAPUN)
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      
      {/* Header Halaman */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Data UMKM</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Manajemen data seluruh pelaku UMKM yang terdaftar di platform PasarNusa.</p>
        </div>
        <button style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Tambah Data UMKM</button>
      </div>

      {/* Filter & Toolbar Pencarian */}
      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem" }}>
        {/* Input Search */}
        <div style={{ position: "relative", flex: 1 }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input type="text" placeholder="Cari nama UMKM, pemilik, atau ID..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>

        {/* Dropdown Kategori */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#64748B", display: "flex" }}><IconFilter /></span>
          <select style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
            <option value="">Semua Kategori</option>
            <option value="kuliner">Makanan & Minuman</option>
            <option value="kriya">Kerajinan Kriya</option>
            <option value="tani">Pertanian</option>
          </select>
        </div>

        {/* Dropdown Status */}
        <select style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      {/* Tabel Data UMKM */}
      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>ID UMKM</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>Nama Usaha</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>Pemilik</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>Kategori</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>Wilayah</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600 }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", fontWeight: 600, textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {umkmData.map((row) => {
              let badgeBg = "#D1FAE5", badgeColor = "#065F46";
              if (row.status === "Pending") { badgeBg = "#FEF3C7"; badgeColor = "#92400E"; }
              if (row.status === "Suspended") { badgeBg = "#FEE2E2"; badgeColor = "#991B1B"; }

              return (
                <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9", transition: "background 0.2s" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{row.nama}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{row.pemilik}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{row.kategori}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{row.wilayah}</td>
                  <td style={{ padding: "1rem" }}>
                    <span style={{ background: badgeBg, color: badgeColor, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>
                      {row.status}
                    </span>
                  </td>
                  <td style={{ padding: "1rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center" }}>
                    <button style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", fontWeight: 500, cursor: "pointer" }}>Detail</button>
                    {row.status === "Pending" && (
                      <button style={{ background: "#D1FAE5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Verifikasi</button>
                    )}
                    {row.status === "Aktif" && (
                      <button style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#991B1B", fontWeight: 500, cursor: "pointer" }}>Suspend</button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        
        {/* Pagination Terbawah */}
        <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", fontSize: "0.85rem", color: "#64748B" }}>
          <span>Menampilkan 1-5 dari 2.410 data UMKM</span>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button disabled style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #E2E8F0", background: "white", cursor: "not-allowed" }}>Sebelumnya</button>
            <button style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #2563EB", background: "#2563EB", color: "white" }}>1</button>
            <button style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #E2E8F0", background: "white" }}>2</button>
            <button style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #E2E8F0", background: "white" }}>Selanjutnya</button>
          </div>
        </div>
      </div>

    </main>
  );
}