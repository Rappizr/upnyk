"use client";

<<<<<<< Updated upstream
import { useMemo, useState, FormEvent } from "react";

interface Kolaborasi {
  id: string;
  inisiator: string;
  mitra: string;
  proyek: string;
  durasi: string;
  status: "Menunggu TTD" | "Berjalan" | "Aktif" | "Selesai";
  deskripsi?: string;
}

const initialData: Kolaborasi[] = [
  { id: "COL-7701", inisiator: "UMKM Tahu Sumedang", mitra: "Petani Budidaya Jamur", proyek: "Pemanfaatan Ampas Tahu untuk Media Tanam", durasi: "6 Bulan", status: "Berjalan", deskripsi: "Ampas tahu dari produksi harian dipasok ke petani jamur sebagai media tanam alternatif, mengurangi limbah sekaligus menambah pendapatan kedua pihak." },
  { id: "COL-7702", inisiator: "Gabungan Kelompok Tani", mitra: "UMKM Keripik Buah", proyek: "Sharing Session & Sharing Alat Vacuum Frying", durasi: "12 Bulan", status: "Aktif", deskripsi: "Penggunaan bersama mesin vacuum frying untuk menekan biaya investasi alat produksi bagi UMKM skala kecil." },
  { id: "COL-7703", inisiator: "Kopi Gayo Kolektif", mitra: "Pabrik Plastik Biodegradable", proyek: "Suplai Limbah Kulit Ceri Kopi", durasi: "3 Bulan", status: "Selesai", deskripsi: "Kulit ceri kopi diolah menjadi bahan baku plastik biodegradable, kontrak percobaan 3 bulan telah selesai dengan hasil baik." },
  { id: "COL-7704", inisiator: "Tenun Ikat Lombok", mitra: "Supplier Pewarna Alami", proyek: "Kontrak Eksklusif Suplai Indigofera", durasi: "24 Bulan", status: "Menunggu TTD", deskripsi: "Kontrak jangka panjang suplai pewarna alami indigofera, menunggu tanda tangan dari pihak supplier." },
=======
import { Badge, Button, PageHeader, Select, SearchInput, statusVariant, Table, TableCard, Td, Th, THead, Toolbar, Tr } from "./ui/AdminUI";
import { Icon } from "./ui/icons";

const dataKolaborasi = [
  { id: "COL-7701", inisiator: "UMKM Tahu Sumedang", mitra: "Petani Budidaya Jamur", proyek: "Pemanfaatan Ampas Tahu untuk Media Tanam", durasi: "6 Bulan", status: "Berjalan" },
  { id: "COL-7702", inisiator: "Gabungan Kelompok Tani", mitra: "UMKM Keripik Buah", proyek: "Sharing Session & Alat Vacuum Frying", durasi: "12 Bulan", status: "Aktif" },
  { id: "COL-7703", inisiator: "Kopi Gayo Kolektif", mitra: "Pabrik Plastik Biodegradable", proyek: "Suplai Limbah Kulit Ceri Kopi", durasi: "3 Bulan", status: "Selesai" },
  { id: "COL-7704", inisiator: "Tenun Ikat Lombok", mitra: "Supplier Pewarna Alami", proyek: "Kontrak Eksklusif Suplai Indigofera", durasi: "24 Bulan", status: "Menunggu TTD" },
>>>>>>> Stashed changes
];

const statusStyle: Record<string, { bg: string; color: string }> = {
  "Menunggu TTD": { bg: "#FEF3C7", color: "#92400E" },
  Berjalan: { bg: "#E0F2FE", color: "#075985" },
  Aktif: { bg: "#D1FAE5", color: "#065F46" },
  Selesai: { bg: "#E2E8F0", color: "#475569" },
};

const stepOrder = ["Menunggu TTD", "Berjalan", "Selesai"];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconHandshake = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 17 9 15"></path><circle cx="9" cy="9" r="6"></circle><path d="m8 13 4 4"></path><path d="M3 8 8 3l4.5 4.5"></path><path d="M21 8 16 3l-1.5 1.5"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconFile = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline></svg>;

export default function SemuaKolaborasiPage() {
  const [data, setData] = useState<Kolaborasi[]>(initialData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Kolaborasi | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ inisiator: "", mitra: "", proyek: "", durasi: "" });

  const filtered = useMemo(() => {
    return data.filter((k) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || k.inisiator.toLowerCase().includes(q) || k.mitra.toLowerCase().includes(q) || k.proyek.toLowerCase().includes(q) || k.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || k.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [data, search, statusFilter]);

  const totalAktifBerjalan = data.filter((k) => k.status === "Aktif" || k.status === "Berjalan").length;
  const totalSelesai = data.filter((k) => k.status === "Selesai").length;
  const totalMenunggu = data.filter((k) => k.status === "Menunggu TTD").length;

  function tandaTangan(id: string) {
    setData((prev) => prev.map((k) => (k.id === id ? { ...k, status: "Berjalan" } : k)));
    setDetail((d) => (d && d.id === id ? { ...d, status: "Berjalan" } : d));
  }
  function tandaiSelesai(id: string) {
    setData((prev) => prev.map((k) => (k.id === id ? { ...k, status: "Selesai" } : k)));
    setDetail((d) => (d && d.id === id ? { ...d, status: "Selesai" } : d));
  }

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.inisiator || !form.mitra || !form.proyek) return;
    const nextNumber = data.length + 1;
    const id = `COL-77${String(nextNumber).padStart(2, "0")}`;
    setData((prev) => [{ id, inisiator: form.inisiator, mitra: form.mitra, proyek: form.proyek, durasi: form.durasi || "-", status: "Menunggu TTD" }, ...prev]);
    setForm({ inisiator: "", mitra: "", proyek: "", durasi: "" });
    setShowAddModal(false);
  }

  return (
<<<<<<< Updated upstream
    <main style={{ flex: 1, padding: "2rem", overflowY: "auto", height: "100vh", width: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Semua Kolaborasi</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau kontrak kemitraan sirkular dan gotong royong infrastruktur antar pelaku usaha.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Buka Hub Kolaborasi Baru</button>
      </div>

      {/* Ringkasan Megah */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconHandshake /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{data.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Kolaborasi</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAktifBerjalan}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Sedang Berjalan</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#F59E0B", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalMenunggu}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Menunggu TTD</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#F1F5F9", color: "#475569", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconFile /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalSelesai}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Kontrak Selesai</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "220px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari inisiator, mitra, atau proyek..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Menunggu TTD">Menunggu TTD</option>
          <option value="Berjalan">Berjalan</option>
          <option value="Aktif">Aktif</option>
          <option value="Selesai">Selesai</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "750px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID Kontrak</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Inisiator Utama</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Mitra Kolaborasi</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Nama Proyek</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Durasi</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada kolaborasi yang cocok.</td></tr>
            )}
            {filtered.map((col) => {
              const s = statusStyle[col.status];
              return (
                <tr key={col.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>{col.id}</td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{col.inisiator}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{col.mitra}</td>
                  <td style={{ padding: "1rem", color: "#1E293B", fontWeight: 500 }}>
                    <span onClick={() => setDetail(col)} style={{ cursor: "pointer", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{col.proyek}</span>
                  </td>
                  <td style={{ padding: "1rem", color: "#475569" }}>{col.durasi}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{col.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button onClick={() => setDetail(col)} style={{ background: "#2563EB", border: "none", padding: "0.35rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem", color: "white", cursor: "pointer" }}>Tinjau MOU</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {/* Modal Tinjau MOU */}
      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "520px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detail.proyek}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.id} • Durasi kontrak {detail.durasi}</p>

            <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
              {stepOrder.map((step, i) => {
                const effectiveStatus = detail.status === "Aktif" ? "Berjalan" : detail.status;
                const currentIdx = stepOrder.indexOf(effectiveStatus);
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Inisiator Utama</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detail.inisiator}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Mitra Kolaborasi</div>
                <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detail.mitra}</div>
              </div>
            </div>

            {detail.deskripsi && (
              <div style={{ fontSize: "0.85rem", color: "#334155", background: "#F8FAFC", padding: "0.8rem 1rem", borderRadius: "10px", marginBottom: "1.25rem", lineHeight: 1.6 }}>
                {detail.deskripsi}
              </div>
            )}

            <div style={{ display: "flex", gap: "0.5rem" }}>
              {detail.status === "Menunggu TTD" && <button onClick={() => tandaTangan(detail.id)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>✓ Setujui & Tanda Tangan</button>}
              {(detail.status === "Berjalan" || detail.status === "Aktif") && <button onClick={() => tandaiSelesai(detail.id)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Kontrak Selesai</button>}
              {detail.status === "Selesai" && <div style={{ flex: 1, textAlign: "center", padding: "0.6rem", background: "#F1F5F9", borderRadius: "6px", color: "#64748B", fontWeight: 600, fontSize: "0.85rem" }}>Kontrak telah selesai</div>}
            </div>
          </div>
        </div>
      )}

      {/* Modal Buka Hub Kolaborasi Baru */}
      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "12px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Buka Hub Kolaborasi Baru</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Inisiator Utama *</label>
                <input required value={form.inisiator} onChange={(e) => setForm({ ...form, inisiator: e.target.value })} placeholder="Contoh: UMKM Tahu Sumedang" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Mitra Kolaborasi *</label>
                <input required value={form.mitra} onChange={(e) => setForm({ ...form, mitra: e.target.value })} placeholder="Contoh: Petani Budidaya Jamur" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Proyek *</label>
                <input required value={form.proyek} onChange={(e) => setForm({ ...form, proyek: e.target.value })} placeholder="Contoh: Sharing Alat Produksi" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Durasi Kontrak</label>
                <input value={form.durasi} onChange={(e) => setForm({ ...form, durasi: e.target.value })} placeholder="Contoh: 12 Bulan" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "6px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Buka Kontrak (Menunggu TTD)</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
=======
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader
        title="Semua Kolaborasi"
        subtitle="Pantau kontrak kemitraan sirkular dan gotong royong infrastruktur antar pelaku usaha."
        action={<Button icon={<Icon.Plus size={16} />}>Buka Hub Kolaborasi Baru</Button>}
      />

      <Toolbar>
        <SearchInput placeholder="Cari inisiator, mitra, atau proyek..." />
        <Select icon={false}>
          <option value="">Semua Status</option>
          <option value="berjalan">Berjalan</option>
          <option value="aktif">Aktif</option>
          <option value="selesai">Selesai</option>
          <option value="ttd">Menunggu TTD</option>
        </Select>
      </Toolbar>

      <TableCard>
        <Table>
          <THead>
            <Th>ID Kontrak</Th>
            <Th>Inisiator Utama</Th>
            <Th>Mitra Kolaborasi</Th>
            <Th>Nama Proyek</Th>
            <Th>Durasi</Th>
            <Th>Status</Th>
            <Th center>Aksi</Th>
          </THead>
          <tbody>
            {dataKolaborasi.map((col) => (
              <Tr key={col.id}>
                <Td className="font-semibold text-[var(--color-text-muted)]">{col.id}</Td>
                <Td className="font-semibold">{col.inisiator}</Td>
                <Td className="text-[var(--color-text-muted)]">{col.mitra}</Td>
                <Td className="font-medium">{col.proyek}</Td>
                <Td className="text-[var(--color-text-muted)]">{col.durasi}</Td>
                <Td>
                  <Badge variant={statusVariant(col.status)}>{col.status}</Badge>
                </Td>
                <Td center>
                  <Button className="px-3 py-1.5 text-xs" icon={<Icon.Eye size={14} />}>Tinjau MOU</Button>
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
