"use client";

import { useEffect, useRef, useState } from "react";

type PesananStatus = "Baru" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";

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
  updatePesananStatus: (id: string, status: PesananStatus) => void;
}

const IconTruck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconPackage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconCopy = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>;
const IconRoute = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"></circle><circle cx="18" cy="5" r="3"></circle><path d="M9 19h8a2 2 0 0 0 2-2v-1a2 2 0 0 0-2-2H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1"></path></svg>;

// ---- Lokasi kota untuk peta pelacakan (tanpa perlu API key — pakai OpenStreetMap) ----
const cityCoords: Record<string, [number, number]> = {
  Malang: [-7.9666, 112.6326],
  Jombang: [-7.5460, 112.2384],
  Surabaya: [-7.2575, 112.7521],
  Sidoarjo: [-7.4478, 112.7183],
};
const gudangAsal: [number, number] = cityCoords.Malang;

function extractCity(alamat: string): string {
  const known = Object.keys(cityCoords);
  const found = known.find((c) => alamat.toLowerCase().includes(c.toLowerCase()));
  return found || "Malang";
}
function coordFromAlamat(alamat: string): [number, number] {
  return cityCoords[extractCity(alamat)];
}

// ---- Tipe minimal untuk Leaflet (dimuat dari CDN, bukan lewat npm, jadi tidak ada @types) ----
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

function MiniMap({ markers, height = 200 }: { markers: { lat: number; lng: number; label: string; color?: string }[]; height?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    function init() {
      const L = window.L;
      if (!ref.current || !L || markers.length === 0) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(ref.current, { scrollWheelZoom: false }).setView([markers[0].lat, markers[0].lng], 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
      markers.forEach((m) => {
        L.circleMarker([m.lat, m.lng], { radius: 9, color: m.color || "#10B981", fillColor: m.color || "#10B981", fillOpacity: 0.9, weight: 2 }).addTo(map).bindPopup(m.label);
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

export default function Pengiriman({ pesananList, updatePesananStatus }: Props) {
  const [tab, setTab] = useState<"Diproses" | "Dikirim" | "Selesai">("Diproses");
  const [petaId, setPetaId] = useState<string | null>(null);

  const diproses = pesananList.filter((p) => p.status === "Diproses");
  const dikirim = pesananList.filter((p) => p.status === "Dikirim");
  const selesai = pesananList.filter((p) => p.status === "Selesai");

  const activeList = tab === "Diproses" ? diproses : tab === "Dikirim" ? dikirim : selesai;

  function copyResi(resi: string) {
    navigator.clipboard?.writeText(resi);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Pengiriman</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Pantau status pengemasan dan pengantaran pesanan ke pembeli.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div onClick={() => setTab("Diproses")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: tab === "Diproses" ? "2px solid #10B981" : "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem", cursor: "pointer" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconPackage /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{diproses.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Siap Dikemas</div></div>
        </div>
        <div onClick={() => setTab("Dikirim")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: tab === "Dikirim" ? "2px solid #10B981" : "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem", cursor: "pointer" }}>
          <div style={{ background: "#E0F2FE", color: "#0284C7", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconTruck /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{dikirim.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Dalam Perjalanan</div></div>
        </div>
        <div onClick={() => setTab("Selesai")} style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: tab === "Selesai" ? "2px solid #10B981" : "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem", cursor: "pointer" }}>
          <div style={{ background: "#D1FAE5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>{selesai.length}</div><div style={{ fontSize: "0.8rem", color: "#64748B" }}>Terkirim Sampai</div></div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
        {activeList.length === 0 && (
          <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", textAlign: "center", color: "#94A3B8" }}>Tidak ada pesanan di tahap ini.</div>
        )}
        {activeList.map((p) => (
          <div key={p.id} style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", padding: "1.1rem 1.25rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
                  <span style={{ fontWeight: 700, color: "#1E293B" }}>{p.id}</span>
                  <span style={{ fontSize: "0.8rem", color: "#64748B" }}>• {p.pembeli}</span>
                </div>
                <div style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.3rem" }}>{p.item} — {p.jumlah} {p.satuan}</div>
                <div style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "0.78rem", color: "#94A3B8" }}><IconMapPin /> {p.alamatKirim}</div>
                {p.noResi && (
                  <div onClick={() => copyResi(p.noResi!)} style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginTop: "0.5rem", background: "#ECFDF5", color: "#10B981", fontSize: "0.78rem", fontWeight: 600, padding: "0.3rem 0.6rem", borderRadius: "6px", cursor: "pointer" }}>
                    <IconCopy /> {p.noResi}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-end" }}>
                {p.status === "Diproses" && <button onClick={() => updatePesananStatus(p.id, "Dikirim")} style={{ background: "#10B981", color: "white", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Kirim Sekarang</button>}
                {p.status === "Dikirim" && <button onClick={() => updatePesananStatus(p.id, "Selesai")} style={{ background: "#10B981", color: "white", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Tandai Sampai</button>}
                {p.status === "Selesai" && <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#10B981" }}>✓ Sudah sampai</span>}
                <button onClick={() => setPetaId(petaId === p.id ? null : p.id)} style={{ display: "flex", alignItems: "center", gap: "5px", background: "none", border: "1px solid #CBD5E1", padding: "0.4rem 0.7rem", borderRadius: "8px", fontSize: "0.78rem", color: "#334155", cursor: "pointer" }}>
                  <IconRoute /> {petaId === p.id ? "Tutup peta" : "Lacak di peta"}
                </button>
              </div>
            </div>
            {petaId === p.id && (
              <div style={{ marginTop: "1rem" }}>
                <MiniMap
                  markers={[
                    { lat: gudangAsal[0], lng: gudangAsal[1], label: "Titik penjemputan (JNT terdekat)", color: "#10B981" },
                    { lat: coordFromAlamat(p.alamatKirim)[0], lng: coordFromAlamat(p.alamatKirim)[1], label: `Tujuan: ${p.alamatKirim}`, color: "#2563EB" },
                  ]}
                />
                <p style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.5rem" }}>Titik hijau = penjemputan dari gudang kamu • Titik biru = tujuan pengiriman ({extractCity(p.alamatKirim)})</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}