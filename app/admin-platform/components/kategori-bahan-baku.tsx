import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kategori Bahan Baku — PasarNusa Super Admin",
};

const dataKategori = [
  { id: "CAT-C01", nama: "Biji Kopi Mentah (Green Bean)", totalItem: "45 Produk", status: "Aktif" },
  { id: "CAT-C02", nama: "Serat Kain Alam", totalItem: "18 Produk", status: "Aktif" },
  { id: "CAT-C03", nama: "Tepung Tapioka Industri", totalItem: "29 Produk", status: "Aktif" },
];

export default function KategoriBahanBakuPage() {
  return (
    <div style={{ display: "flex", height: "100vh", background: "#F8FAFC", fontFamily: "sans-serif", overflow: "hidden" }}>
      <main style={{ flex: 1, padding: "2rem", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <div>
            <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#0F172A" }}>Kategori Bahan Baku</h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola jenis dan komoditas komoditas bahan baku produksi.</p>
          </div>
          <button style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Tambah Kategori Bahan Baku</button>
        </div>

        <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>Kode</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Kategori</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Total Produk</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataKategori.map((item) => (
                <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{item.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#0F172A" }}>{item.nama}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{item.totalItem}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: "#D1FAE5", color: "#065F46", padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{item.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", cursor: "pointer", marginRight: "0.5rem" }}>Edit</button>
                    <button style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#991B1B", cursor: "pointer" }}>Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}