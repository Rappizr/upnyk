"use client";

<<<<<<< Updated upstream
import { useMemo, useState, FormEvent } from "react";

// ============================================================================
// TIPE DATA — sama persis dengan yang ada di page.tsx (ditulis manual di sini juga)
// ============================================================================
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
  addUmkm: (entry: Omit<UmkmEntry, "id" | "tanggal">) => void;
  setUmkmStatus: (id: string, status: UmkmStatus) => void;
}

const PAGE_SIZE = 5;

const kategoriMap: Record<string, string> = {
  kuliner: "Makanan & Minuman",
  kriya: "Kerajinan Kriya",
  tani: "Pertanian",
};

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconFilter = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"></polygon></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function DataUMKM({ umkmList, addUmkm, setUmkmStatus }: Props) {
  const [search, setSearch] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);

  const [showAddModal, setShowAddModal] = useState(false);
  const [detailRow, setDetailRow] = useState<UmkmEntry | null>(null);
  const [form, setForm] = useState({ nama: "", pemilik: "", kategori: "", wilayah: "", status: "Pending" as UmkmStatus });

  const filtered = useMemo(() => {
    return umkmList.filter((row) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || row.nama.toLowerCase().includes(q) || row.pemilik.toLowerCase().includes(q) || row.id.toLowerCase().includes(q);
      const matchKategori = !kategoriFilter || row.kategori.toLowerCase().includes(kategoriMap[kategoriFilter].toLowerCase());
      const matchStatus = !statusFilter || row.status.toLowerCase() === statusFilter;
      return matchSearch && matchKategori && matchStatus;
    });
  }, [umkmList, search, kategoriFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.nama || !form.pemilik) return;
    addUmkm({
      nama: form.nama,
      pemilik: form.pemilik,
      kategori: form.kategori || "Belum Dikategorikan",
      wilayah: form.wilayah || "-",
      status: form.status,
    });
    setForm({ nama: "", pemilik: "", kategori: "", wilayah: "", status: "Pending" });
    setShowAddModal(false);
    setPage(1);
  }

  return (
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Data UMKM</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Manajemen data seluruh pelaku UMKM yang terdaftar di platform PasarNusa. Data ini otomatis tersambung ke Verifikasi & Dashboard.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Tambah Data UMKM</button>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input type="text" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama UMKM, pemilik, atau ID..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ color: "#64748B", display: "flex" }}><IconFilter /></span>
          <select value={kategoriFilter} onChange={(e) => { setKategoriFilter(e.target.value); setPage(1); }} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
            <option value="">Semua Kategori</option>
            <option value="kuliner">Makanan & Minuman</option>
            <option value="kriya">Kerajinan Kriya</option>
            <option value="tani">Pertanian</option>
          </select>
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
=======
import { Badge, Button, Pagination, Select, SearchInput, statusVariant, Table, TableCard, Td, Th, THead, Toolbar, Tr, PageHeader } from "./ui/AdminUI";
import { Icon } from "./ui/icons";

const umkmData = [
  { id: "UMKM-001", nama: "Keripik Tempe Sanan", pemilik: "Pak Baihaqi", kategori: "Makanan & Minuman", wilayah: "Malang", status: "Aktif", tanggal: "12 Feb 2026" },
  { id: "UMKM-002", nama: "Kopi Arabika Gayo", pemilik: "Ibu Citra", kategori: "Pertanian / Komoditas", wilayah: "Aceh", status: "Pending", tanggal: "05 Jul 2026" },
  { id: "UMKM-003", nama: "Kerajinan Bambu Jaya", pemilik: "Dedi Kurniawan", kategori: "Kerajinan Kriya", wilayah: "Yogyakarta", status: "Aktif", tanggal: "20 Jan 2025" },
  { id: "UMKM-004", nama: "Toko Curang (Minyak Kita)", pemilik: "Rian", kategori: "Bahan Pokok", wilayah: "Jakarta", status: "Suspended", tanggal: "14 Mar 2026" },
  { id: "UMKM-005", nama: "Tenun Ikat Sasak", pemilik: "Ibu Nur", kategori: "Fashion & Tekstil", wilayah: "Lombok", status: "Aktif", tanggal: "09 Mei 2026" },
];

export default function DataUMKM() {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Data UMKM"
        subtitle="Manajemen data seluruh pelaku UMKM yang terdaftar di platform PasarNusa."
        action={<Button icon={<Icon.Plus size={16} />}>Tambah Data UMKM</Button>}
      />

      <Toolbar>
        <SearchInput placeholder="Cari nama UMKM, pemilik, atau ID..." />
        <Select>
          <option value="">Semua Kategori</option>
          <option value="kuliner">Makanan & Minuman</option>
          <option value="kriya">Kerajinan Kriya</option>
          <option value="tani">Pertanian</option>
        </Select>
        <Select icon={false}>
>>>>>>> Stashed changes
          <option value="">Semua Status</option>
          <option value="aktif">Aktif</option>
          <option value="pending">Pending</option>
          <option value="suspended">Suspended</option>
<<<<<<< Updated upstream
          <option value="ditolak">Ditolak</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
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
            {paginated.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada data yang cocok.</td></tr>
            )}
            {paginated.map((row) => {
              let badgeBg = "#D1FAE5", badgeColor = "#065F46";
              if (row.status === "Pending") { badgeBg = "#FEF3C7"; badgeColor = "#92400E"; }
              if (row.status === "Suspended") { badgeBg = "#FEE2E2"; badgeColor = "#991B1B"; }
              if (row.status === "Ditolak") { badgeBg = "#F1F5F9"; badgeColor = "#475569"; }
              return (
                <tr key={row.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{row.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{row.nama}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{row.pemilik}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{row.kategori}</td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{row.wilayah}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: badgeBg, color: badgeColor, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{row.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center", display: "flex", gap: "0.5rem", justifyContent: "center", flexWrap: "wrap" }}>
                    <button onClick={() => setDetailRow(row)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#334155", fontWeight: 500, cursor: "pointer" }}>Detail</button>
                    {row.status === "Pending" && <button onClick={() => setUmkmStatus(row.id, "Aktif")} style={{ background: "#D1FAE5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Verifikasi</button>}
                    {row.status === "Aktif" && <button onClick={() => setUmkmStatus(row.id, "Suspended")} style={{ background: "#FEE2E2", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#991B1B", fontWeight: 500, cursor: "pointer" }}>Suspend</button>}
                    {(row.status === "Suspended" || row.status === "Ditolak") && <button onClick={() => setUmkmStatus(row.id, "Aktif")} style={{ background: "#D1FAE5", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "#065F46", fontWeight: 600, cursor: "pointer" }}>Pulihkan</button>}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>

        <div style={{ padding: "1rem", display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid #E2E8F0", fontSize: "0.85rem", color: "#64748B", flexWrap: "wrap", gap: "0.5rem" }}>
          <span>Menampilkan {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, filtered.length)} dari {filtered.length} data UMKM</span>
          <div style={{ display: "flex", gap: "0.25rem" }}>
            <button disabled={currentPage === 1} onClick={() => setPage((p) => Math.max(1, p - 1))} style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #E2E8F0", background: "white", cursor: currentPage === 1 ? "not-allowed" : "pointer", opacity: currentPage === 1 ? 0.5 : 1 }}>Sebelumnya</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)} style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: `1px solid ${p === currentPage ? "#2563EB" : "#E2E8F0"}`, background: p === currentPage ? "#2563EB" : "white", color: p === currentPage ? "white" : "#334155", cursor: "pointer" }}>{p}</button>
            ))}
            <button disabled={currentPage === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))} style={{ padding: "0.25rem 0.5rem", borderRadius: "4px", border: "1px solid #E2E8F0", background: "white", cursor: currentPage === totalPages ? "not-allowed" : "pointer", opacity: currentPage === totalPages ? 0.5 : 1 }}>Selanjutnya</button>
          </div>
        </div>
      </div>

      {showAddModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>Tambah Data UMKM</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Usaha *</label>
                <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} placeholder="Contoh: Keripik Singkong Renyah" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Pemilik *</label>
                <input required value={form.pemilik} onChange={(e) => setForm({ ...form, pemilik: e.target.value })} placeholder="Contoh: Ibu Siti" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Kategori</label>
                <input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="Contoh: Makanan & Minuman" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Wilayah</label>
                <input value={form.wilayah} onChange={(e) => setForm({ ...form, wilayah: e.target.value })} placeholder="Contoh: Bandung" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as UmkmStatus })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="Pending">Pending</option>
                  <option value="Aktif">Aktif</option>
                </select>
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailRow && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>Detail UMKM</h2>
              <button onClick={() => setDetailRow(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", fontSize: "0.9rem" }}>
              <div><strong style={{ color: "#64748B" }}>ID:</strong> <span style={{ color: "#1E293B" }}>{detailRow.id}</span></div>
              <div><strong style={{ color: "#64748B" }}>Nama Usaha:</strong> <span style={{ color: "#1E293B" }}>{detailRow.nama}</span></div>
              <div><strong style={{ color: "#64748B" }}>Pemilik:</strong> <span style={{ color: "#1E293B" }}>{detailRow.pemilik}</span></div>
              <div><strong style={{ color: "#64748B" }}>Kategori:</strong> <span style={{ color: "#1E293B" }}>{detailRow.kategori}</span></div>
              <div><strong style={{ color: "#64748B" }}>Wilayah:</strong> <span style={{ color: "#1E293B" }}>{detailRow.wilayah}</span></div>
              <div><strong style={{ color: "#64748B" }}>Status:</strong> <span style={{ color: "#1E293B" }}>{detailRow.status}</span></div>
              <div><strong style={{ color: "#64748B" }}>Terdaftar:</strong> <span style={{ color: "#1E293B" }}>{detailRow.tanggal}</span></div>
            </div>
            <button onClick={() => setDetailRow(null)} style={{ marginTop: "1.25rem", width: "100%", padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
=======
        </Select>
      </Toolbar>

      <TableCard>
        <Table>
          <THead>
            <Th>ID UMKM</Th>
            <Th>Nama Usaha</Th>
            <Th>Pemilik</Th>
            <Th>Kategori</Th>
            <Th>Wilayah</Th>
            <Th>Status</Th>
            <Th center>Aksi</Th>
          </THead>
          <tbody>
            {umkmData.map((row) => (
              <Tr key={row.id}>
                <Td className="font-semibold text-[var(--color-text-muted)]">{row.id}</Td>
                <Td className="font-semibold">{row.nama}</Td>
                <Td className="text-[var(--color-text-muted)]">{row.pemilik}</Td>
                <Td className="text-[var(--color-text-muted)]">{row.kategori}</Td>
                <Td className="text-[var(--color-text-muted)]">{row.wilayah}</Td>
                <Td>
                  <Badge variant={statusVariant(row.status)}>{row.status}</Badge>
                </Td>
                <Td center>
                  <div className="flex items-center justify-center gap-2">
                    <Button variant="subtle" className="px-3 py-1.5 text-xs">Detail</Button>
                    {row.status === "Pending" && <Button variant="successSubtle" className="px-3 py-1.5 text-xs">Verifikasi</Button>}
                    {row.status === "Aktif" && <Button variant="dangerSubtle" className="px-3 py-1.5 text-xs">Suspend</Button>}
                  </div>
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
        <Pagination showing="1-5" total="2.410 data UMKM" />
      </TableCard>
    </div>
>>>>>>> Stashed changes
  );
}
