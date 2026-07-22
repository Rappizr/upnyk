"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { FormEvent } from "react";

type Grade = "A" | "B" | "C" | "Belum Dinilai";

interface StokToko {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  grade: Grade;
  asalProdusen: string;
  live: boolean;
}

interface Pembelian {
  id: string;
  produsenId: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  total: number;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan";
  tanggal: string;
  noResi?: string;
  fotoProduk?: string;
  rating?: number;
  fotoUlasan?: string;
  keteranganUlasan?: string;
  lokasiProdusen?: string;
}

interface Produsen {
  id: string;
  nama: string;
  lokasi: string;
  komoditas: string;
  estimasiPanenHari: number;
}

interface LeafletLayer {
  addTo: (map: LeafletMapInstance) => LeafletLayer;
  bindPopup: (html: string) => LeafletLayer;
  getBounds: () => unknown;
}
interface LeafletMapInstance {
  setView: (center: [number, number], zoom: number) => LeafletMapInstance;
  remove: () => void;
  fitBounds: (bounds: unknown, options?: { padding?: [number, number] }) => void;
}
interface LeafletStatic {
  map: (el: HTMLElement, opts?: { scrollWheelZoom?: boolean }) => LeafletMapInstance;
  tileLayer: (url: string, opts?: { attribution?: string }) => LeafletLayer;
  circleMarker: (latlng: [number, number], opts?: Record<string, unknown>) => LeafletLayer;
  polyline: (points: [number, number][], opts?: Record<string, unknown>) => LeafletLayer;
}
declare const window: Window & { L?: LeafletStatic };

const cityCoords: Record<string, [number, number]> = {
  Malang: [-7.9666, 112.6326],
  Jombang: [-7.5460, 112.2384],
  Surabaya: [-7.2575, 112.7521],
  Sidoarjo: [-7.4478, 112.7183],
  Sumbawa: [-8.4869, 117.4256],
};
const gudangToko: [number, number] = cityCoords.Malang;

function coordFromLokasi(lokasi: string): [number, number] {
  const known = Object.keys(cityCoords);
  const found = known.find((c) => lokasi.toLowerCase().includes(c.toLowerCase()));
  return cityCoords[found || "Malang"];
}

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

function MiniMap({ markers, height = 200 }: { markers: { lat: number; lng: number; label: string; color?: string }[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    function init() {
      const L = window.L;
      if (!ref.current || !L || markers.length === 0) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(ref.current, { scrollWheelZoom: false }).setView([markers[0].lat, markers[0].lng], 7);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
      markers.forEach((m) => {
        L.circleMarker([m.lat, m.lng], { radius: 9, color: m.color || "#F59E0B", fillColor: m.color || "#F59E0B", fillOpacity: 0.9, weight: 2 }).addTo(map).bindPopup(m.label);
      });
      if (markers.length > 1) {
        const line = L.polyline(markers.map((m) => [m.lat, m.lng] as [number, number]), { color: "#94A3B8", weight: 2, dashArray: "6 6" }).addTo(map);
        map.fitBounds(line.getBounds(), { padding: [30, 30] });
      }
      mapRef.current = map;
    }
    if (window.L) {
      init();
    } else {
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      let script = document.getElementById("leaflet-js") as HTMLScriptElement | null;
      if (!script) {
        script = document.createElement("script");
        script.id = "leaflet-js";
        script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
        document.body.appendChild(script);
      }
      script.addEventListener("load", init);
      return () => script?.removeEventListener("load", init);
    }
    return () => {
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
    };
  }, [markers]);

  return <div ref={ref} style={{ height, borderRadius: "10px", overflow: "hidden", background: "#F1F5F9" }} />;
}

interface Props {
  stokList: StokToko[];
  pembelianList: Pembelian[];
  produsenList: Produsen[];
  terimaPembelian: (id: string, grade: Grade) => void;
  updateStok: (id: string, patch: Partial<StokToko>) => void;
}


const IconBox = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconTruckIn = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

export default function InventarisGrading({ stokList, pembelianList, produsenList, terimaPembelian, updateStok }: Props) {
  const [search, setSearch] = useState("");
  const [editItem, setEditItem] = useState<StokToko | null>(null);
  const [editJumlah, setEditJumlah] = useState(0);
  const [lacakId, setLacakId] = useState<string | null>(null);

  const menungguGrading = pembelianList.filter((p) => p.status === "Menunggu" || p.status === "Dikirim" || p.status === "Diproses");

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return stokList.filter((s) => !q || s.nama.toLowerCase().includes(q) || s.asalProdusen.toLowerCase().includes(q));
  }, [stokList, search]);

  const totalNilaiStok = stokList.reduce((s, x) => s + x.jumlah * x.hargaBeli, 0);

  function handleEditSubmit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;
    updateStok(editItem.id, { jumlah: editJumlah });
    setEditItem(null);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          main h1 { font-size: 1.15rem !important; }
          main p { font-size: 0.62rem !important; line-height: 1.2 !important; }
          .grading-stats-grid { grid-template-columns: repeat(3, 1fr) !important; gap: 0.25rem !important; margin-bottom: 1rem !important; }
          .grading-stat-card { padding: 0.4rem !important; border-radius: 6px !important; gap: 0.4rem !important; }
          .grading-stat-card > div:first-child { padding: 0.3rem !important; border-radius: 6px !important; }
          .grading-stat-card > div:first-child svg { width: 14px !important; height: 14px !important; }
          .grading-stat-card > div:last-child > div:first-child { font-size: 0.65rem !important; line-height: 1.1 !important; }
          .grading-stat-card > div:last-child > div:last-child { font-size: 0.5rem !important; line-height: 1.1 !important; margin-top: 0.1rem !important; }
          .grading-warn-box { padding: 0.6rem !important; border-radius: 8px !important; margin-bottom: 1rem !important; }
          .grading-warn-item > div:first-child { font-size: 0.65rem !important; }
          .grading-warn-item > div:first-child div:last-child { font-size: 0.55rem !important; }
          .grading-warn-item button { padding: 0.25rem 0.45rem !important; font-size: 0.55rem !important; border-radius: 4px !important; }
          .search-wrapper-mobile { max-width: 100% !important; margin-bottom: 1rem !important; }
          .search-wrapper-mobile input { padding: 0.35rem 0.5rem !important; font-size: 0.7rem !important; border-radius: 6px !important; }
          .grading-table-container th, .grading-table-container td { padding: 0.5rem 0.4rem !important; font-size: 0.58rem !important; }
          .grading-table-container table { min-width: auto !important; width: 100% !important; }
          .grading-table-container button { padding: 0.25rem 0.4rem !important; font-size: 0.52rem !important; border-radius: 4px !important; }
          .grading-table-container span { padding: 0.1rem 0.3rem !important; font-size: 0.52rem !important; border-radius: 4px !important; }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Inventaris</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Kelola stok gudang barang masuk dari produsen.</p>
      </div>

      <div className="grading-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="grading-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconBox /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{stokList.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Jenis Produk</div></div>
        </div>
        <div className="grading-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(totalNilaiStok)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Nilai Stok</div></div>
        </div>
        <div className="grading-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconTruckIn /></div>
          <div><div style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{menungguGrading.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Perlu Diterima</div></div>
        </div>
      </div>

      {menungguGrading.length > 0 && (
        <div className="grading-warn-box" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1.1rem", marginBottom: "1.5rem" }}>
          <h3 style={{ margin: "0 0 0.9rem 0", fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Barang Masuk — Perlu Diterima</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {menungguGrading.map((p) => {
              const produsen = produsenList.find((pr) => pr.id === p.produsenId);
              const asal = produsen ? coordFromLokasi(produsen.lokasi) : gudangToko;
              return (
                <div key={p.id} className="grading-warn-item" style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.7rem 0.9rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                    <div><div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#1E293B" }}>{p.item} — {p.jumlah} {p.satuan}</div><div style={{ fontSize: "0.72rem", color: "#94A3B8" }}>Dari {p.produsen} • {p.tanggal}</div></div>
                    <div style={{ display: "flex", gap: "0.4rem" }}>
                      <button onClick={() => setLacakId(lacakId === p.id ? null : p.id)} style={{ background: "white", border: "1px solid #CBD5E1", color: "#334155", fontSize: "0.76rem", fontWeight: 600, padding: "0.45rem 0.7rem", borderRadius: "6px", cursor: "pointer" }}>{lacakId === p.id ? "Tutup Peta" : "Lacak Kiriman"}</button>
                      <button onClick={() => terimaPembelian(p.id, "Belum Dinilai")} style={{ background: "#F59E0B", color: "#fff", border: "none", fontSize: "0.78rem", fontWeight: 600, padding: "0.45rem 0.8rem", borderRadius: "6px", cursor: "pointer" }}>Terima Barang</button>
                    </div>
                  </div>
                  {lacakId === p.id && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <MiniMap
                        markers={[
                          { lat: asal[0], lng: asal[1], label: `Asal: ${p.produsen}`, color: "#10B981" },
                          { lat: gudangToko[0], lng: gudangToko[1], label: "Tujuan: Gudang Toko", color: "#F59E0B" },
                        ]}
                      />
                      <p style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "0.5rem" }}>Titik hijau = lokasi produsen • Titik oranye = gudang tokomu</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="search-wrapper-mobile" style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produk atau produsen..." style={{ width: "100%", padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
      </div>

      <div className="grading-table-container" style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem", minWidth: "700px" }}>
            <thead>
              <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                <th style={{ padding: "1rem", color: "#475569" }}>Nama Produk</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Asal Produsen</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Jumlah</th>
                <th style={{ padding: "1rem", color: "#475569" }}>Harga Beli</th>
                <th style={{ padding: "1rem", color: "#475569", textAlign: "center" }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 && (
                <tr><td colSpan={5} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Belum ada stok yang cocok.</td></tr>
              )}
              {filtered.map((s) => {
                return (
                  <tr key={s.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{s.nama}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{s.asalProdusen}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{s.jumlah} {s.satuan}</td>
                    <td style={{ padding: "1rem", color: "#475569" }}>{formatRupiah(s.hargaBeli)}</td>
                    <td style={{ padding: "1rem", textAlign: "center" }}>
                      <button onClick={() => { setEditItem(s); setEditJumlah(s.jumlah); }} style={{ background: "#F1F5F9", border: "none", padding: "0.35rem 0.75rem", borderRadius: "6px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>Sesuaikan Stok</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editItem && (
        <div onClick={() => setEditItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1E293B" }}>Sesuaikan Stok {editItem.nama}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", margin: "1rem 0 0.3rem" }}>Jumlah Stok Saat Ini ({editItem.satuan})</label>
              <input required type="number" min="0" value={editJumlah} onChange={(e) => setEditJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", marginBottom: "1rem" }} />
              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}