"use client";

import { useMemo, useState, FormEvent } from "react";

type PesananStatus = "Baru" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";

interface StokItem { id: string; nama: string; jumlah: number; satuan: string; hargaSatuan: number; status: string; }
interface Pesanan {
  id: string;
  pembeli: string;
  itemId: string;
  item: string;
  jumlah: number;
  satuan: string;
  total: number;
  status: PesananStatus;
  tanggal: string;
  alamatKirim: string;
  noResi?: string;
}

interface Props {
  pesananList: Pesanan[];
  stokList: StokItem[];
  addPesanan: (pembeli: string, itemId: string, jumlah: number, alamatKirim: string) => void;
  updatePesananStatus: (id: string, status: PesananStatus) => void;
}

const statusStyle: Record<PesananStatus, { bg: string; color: string }> = {
  Baru: { bg: "#F1F5F9", color: "#475569" },
  Diproses: { bg: "#FEF3C7", color: "#92400E" },
  Dikirim: { bg: "#E0F2FE", color: "#075985" },
  Selesai: { bg: "#D1FAE5", color: "#065F46" },
  Dibatalkan: { bg: "#FEE2E2", color: "#991B1B" },
};

const stepOrder: PesananStatus[] = ["Baru", "Diproses", "Dikirim", "Selesai"];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconStore = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PenjualanB2B({ pesananList, stokList, addPesanan, updatePesananStatus }: Props) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [detail, setDetail] = useState<Pesanan | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ pembeli: "", itemId: "", jumlah: "", alamatKirim: "" });

  const filtered = useMemo(() => {
    return pesananList.filter((p) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || p.pembeli.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.item.toLowerCase().includes(q);
      const matchStatus = !statusFilter || p.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [pesananList, search, statusFilter]);

  const totalPendapatan = pesananList.filter((p) => p.status === "Selesai").reduce((s, p) => s + p.total, 0);
  const totalAktif = pesananList.filter((p) => p.status === "Baru" || p.status === "Diproses").length;

  const selectedItem = stokList.find((s) => s.id === form.itemId);
  const estimasiTotal = selectedItem && form.jumlah ? selectedItem.hargaSatuan * Number(form.jumlah) : 0;

  function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form.pembeli || !form.itemId || !form.jumlah || !form.alamatKirim) return;
    addPesanan(form.pembeli, form.itemId, Number(form.jumlah), form.alamatKirim);
    setForm({ pembeli: "", itemId: "", jumlah: "", alamatKirim: "" });
    setShowAddModal(false);
  }

  function ubahStatus(status: PesananStatus) {
    if (!detail) return;
    updatePesananStatus(detail.id, status);
    setDetail({ ...detail, status });
  }

  return (
    <main style={{ padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Penjualan B2B</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Kelola pesanan grosir dari mitra bisnis, terhubung langsung dengan stok kamu.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.625rem 1.25rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.9rem" }}>+ Catat Pesanan Baru</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconStore /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{pesananList.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Total Pesanan</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalPendapatan)}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Pendapatan Selesai</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconClock /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{totalAktif}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Perlu Ditindaklanjuti</div></div>
        </div>
      </div>

      <div style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari pembeli, ID, atau produk..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          {stepOrder.map((s) => <option key={s} value={s}>{s}</option>)}
          <option value="Dibatalkan">Dibatalkan</option>
        </select>
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
          <thead>
            <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
              <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Pembeli</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Produk</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Total</th>
              <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
              <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada pesanan yang cocok.</td></tr>
            )}
            {filtered.map((p) => {
              const s = statusStyle[p.status];
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#64748B" }}>
                    <span onClick={() => setDetail(p)} style={{ cursor: "pointer", color: "#2563EB", textDecoration: "underline", textDecorationColor: "#BFDBFE" }}>{p.id}</span>
                  </td>
                  <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{p.pembeli}</td>
                  <td style={{ padding: "1rem", color: "#334155" }}>{p.item} ({p.jumlah} {p.satuan})</td>
                  <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(p.total)}</td>
                  <td style={{ padding: "1rem" }}><span style={{ background: s.bg, color: s.color, padding: "0.25rem 0.5rem", borderRadius: "6px", fontSize: "0.75rem", fontWeight: 600 }}>{p.status}</span></td>
                  <td style={{ padding: "1rem", textAlign: "center" }}>
                    <button onClick={() => setDetail(p)} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.8rem", color: "#334155", cursor: "pointer" }}>Kelola</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        </div>
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "480px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.15rem", fontWeight: 700, color: "#1E293B" }}>{detail.id}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.tanggal}</p>

            {detail.status !== "Dibatalkan" ? (
              <div style={{ display: "flex", alignItems: "center", marginBottom: "1.5rem" }}>
                {stepOrder.map((step, i) => {
                  const currentIdx = stepOrder.indexOf(detail.status);
                  const done = i <= currentIdx;
                  return (
                    <div key={step} style={{ flex: 1, display: "flex", alignItems: "center" }}>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: "0 0 auto" }}>
                        <div style={{ width: "24px", height: "24px", borderRadius: "50%", background: done ? "#2563EB" : "#E2E8F0", color: done ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.68rem", fontWeight: 700 }}>{i + 1}</div>
                        <span style={{ fontSize: "0.65rem", color: done ? "#1E293B" : "#94A3B8", marginTop: "0.25rem", fontWeight: done ? 600 : 400 }}>{step}</span>
                      </div>
                      {i < stepOrder.length - 1 && <div style={{ flex: 1, height: "2px", background: i < currentIdx ? "#2563EB" : "#E2E8F0", margin: "0 0.3rem 1.1rem" }} />}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div style={{ background: "#FEE2E2", color: "#991B1B", padding: "0.7rem 0.9rem", borderRadius: "8px", fontSize: "0.85rem", fontWeight: 600, marginBottom: "1.5rem" }}>Pesanan ini dibatalkan</div>
            )}

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "1rem" }}>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Pembeli</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{detail.pembeli}</div>
              </div>
              <div style={{ background: "#F8FAFC", borderRadius: "10px", padding: "0.75rem" }}>
                <div style={{ fontSize: "0.7rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>Produk</div>
                <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{detail.item} ({detail.jumlah} {detail.satuan})</div>
              </div>
            </div>
            <div style={{ background: "#EFF6FF", borderRadius: "10px", padding: "0.85rem", marginBottom: "0.75rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: "0.85rem", color: "#2563EB", fontWeight: 600 }}>Total Pesanan</span>
              <span style={{ fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(detail.total)}</span>
            </div>
            <div style={{ fontSize: "0.8rem", color: "#334155", background: "#F8FAFC", padding: "0.65rem 0.85rem", borderRadius: "8px", marginBottom: "1.25rem" }}>
              <strong>Alamat kirim:</strong> {detail.alamatKirim}
              {detail.noResi && <div style={{ marginTop: "0.3rem" }}><strong>No. resi:</strong> {detail.noResi}</div>}
            </div>

            {detail.status !== "Selesai" && detail.status !== "Dibatalkan" && (
              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button onClick={() => ubahStatus("Dibatalkan")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "white", color: "#991B1B", fontWeight: 600, cursor: "pointer" }}>Batalkan</button>
                {detail.status === "Baru" && <button onClick={() => ubahStatus("Diproses")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Proses Pesanan</button>}
                {detail.status === "Diproses" && <button onClick={() => ubahStatus("Dikirim")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Kirim Pesanan</button>}
                {detail.status === "Dikirim" && <button onClick={() => ubahStatus("Selesai")} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tandai Selesai</button>}
              </div>
            )}
          </div>
        </div>
      )}

      {showAddModal && (
        <div onClick={() => setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "420px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>Catat Pesanan Baru</h2>
              <button onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Pembeli *</label>
                <input required value={form.pembeli} onChange={(e) => setForm({ ...form, pembeli: e.target.value })} placeholder="Contoh: Warung Makmur Jaya" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Produk *</label>
                <select required value={form.itemId} onChange={(e) => setForm({ ...form, itemId: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
                  <option value="">Pilih produk...</option>
                  {stokList.filter((s) => s.jumlah > 0).map((s) => <option key={s.id} value={s.id}>{s.nama} (stok: {s.jumlah} {s.satuan})</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah {selectedItem ? `(maks ${selectedItem.jumlah} ${selectedItem.satuan})` : ""} *</label>
                <input required type="number" min="1" max={selectedItem?.jumlah} value={form.jumlah} onChange={(e) => setForm({ ...form, jumlah: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Alamat Kirim *</label>
                <input required value={form.alamatKirim} onChange={(e) => setForm({ ...form, alamatKirim: e.target.value })} placeholder="Contoh: Jl. Merdeka No. 5, Malang" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
              </div>
              {estimasiTotal > 0 && (
                <div style={{ background: "#EFF6FF", borderRadius: "8px", padding: "0.65rem 0.85rem", display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                  <span style={{ color: "#2563EB", fontWeight: 600 }}>Estimasi Total</span>
                  <strong style={{ color: "#1E293B" }}>{formatRupiah(estimasiTotal)}</strong>
                </div>
              )}
              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                <button type="button" onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Pesanan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}