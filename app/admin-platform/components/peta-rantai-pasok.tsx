"use client";

import { useEffect, useMemo, useRef, useState } from "react";

type TipeEntitas = "Toko" | "Produsen";

interface Entitas {
  id: string;
  nama: string;
  tipe: TipeEntitas;
  lokasi: string;
  status: "Aktif" | "Nonaktif";
}
interface EscrowTx {
  id: string;
  pembeli: string;
  toko: string;
  produsen: string;
  nominal: number;
  status: string;
  tanggal: string;
}

interface Props {
  entitasList: Entitas[];
  transaksiList: EscrowTx[];
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
  featureGroup: (layers: LeafletLayer[]) => LeafletLayer;
}
declare const window: Window & { L?: LeafletStatic };

const cityCoords: Record<string, [number, number]> = {
  Malang: [-7.9666, 112.6326],
  Jombang: [-7.5460, 112.2384],
  Surabaya: [-7.2575, 112.7521],
  Sidoarjo: [-7.4478, 112.7183],
};
function coordFromLokasi(lokasi: string): [number, number] {
  const known = Object.keys(cityCoords);
  const found = known.find((c) => lokasi.toLowerCase().includes(c.toLowerCase()));
  return cityCoords[found || "Malang"];
}

const tipeColor: Record<TipeEntitas, string> = { Toko: "#2563EB", Produsen: "#10B981" };
const tipeBg: Record<TipeEntitas, { bg: string; color: string }> = {
  Toko: { bg: "#EFF6FF", color: "#2563EB" },
  Produsen: { bg: "#ECFDF5", color: "#059669" },
};

function MiniMap({ entitasList }: { entitasList: Entitas[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    function init() {
      const L = window.L;
      if (!ref.current || !L || entitasList.length === 0) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }
      const map = L.map(ref.current, { scrollWheelZoom: false }).setView(coordFromLokasi(entitasList[0].lokasi), 8);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);
      const layers = entitasList.map((e) => {
        const [lat, lng] = coordFromLokasi(e.lokasi);
        const marker = L.circleMarker([lat, lng], { radius: 9, color: tipeColor[e.tipe], fillColor: tipeColor[e.tipe], fillOpacity: 0.85, weight: 2 });
        marker.addTo(map).bindPopup(`${e.nama} (${e.tipe})`);
        return marker;
      });
      if (layers.length > 1) {
        map.fitBounds(L.featureGroup(layers).getBounds(), { padding: [30, 30] });
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
  }, [entitasList]);

  return <div ref={ref} style={{ height: 320, borderRadius: "10px", overflow: "hidden", background: "#F1F5F9" }} />;
}

const IconBuilding = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="1"></rect><line x1="9" y1="7" x2="9" y2="7.01"></line><line x1="15" y1="7" x2="15" y2="7.01"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PetaRantaiPasok({ entitasList, transaksiList }: Props) {
  const [tipeFilter, setTipeFilter] = useState<TipeEntitas | "">("");
  const [detail, setDetail] = useState<Entitas | null>(null);

  const filtered = useMemo(() => entitasList.filter((e) => !tipeFilter || e.tipe === tipeFilter), [entitasList, tipeFilter]);

  const relasiUntuk = (nama: string) => transaksiList.filter((t) => t.toko === nama || t.produsen === nama);

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Peta Rantai Pasok</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Visualisasi jaringan Admin Toko dan Produsen yang sudah terverifikasi di ekosistem.</p>
      </div>

      <div style={{ display: "flex", gap: "0.6rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => setTipeFilter("")} style={{ background: tipeFilter === "" ? "#1E293B" : "white", color: tipeFilter === "" ? "#fff" : "#334155", border: "1px solid #E2E8F0", padding: "0.5rem 0.9rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>Semua ({entitasList.length})</button>
        {(["Toko", "Produsen"] as TipeEntitas[]).map((t) => (
          <button key={t} onClick={() => setTipeFilter(t)} style={{ background: tipeFilter === t ? tipeColor[t] : "white", color: tipeFilter === t ? "#fff" : tipeColor[t], border: `1px solid ${tipeColor[t]}`, padding: "0.5rem 0.9rem", borderRadius: "999px", fontSize: "0.82rem", fontWeight: 600, cursor: "pointer" }}>
            {t} ({entitasList.filter((e) => e.tipe === t).length})
          </button>
        ))}
      </div>

      <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", marginBottom: "1.25rem" }}>
        <MiniMap entitasList={filtered} />
        <div style={{ display: "flex", gap: "1rem", marginTop: "0.75rem", fontSize: "0.75rem", color: "#64748B", flexWrap: "wrap" }}>
          <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "50%", background: tipeColor.Toko, marginRight: "5px" }} />Admin Toko</span>
          <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "50%", background: tipeColor.Produsen, marginRight: "5px" }} />Produsen</span>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: "1rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Belum ada entitas untuk filter ini.</div>
        )}
        {filtered.map((e) => {
          const c = tipeBg[e.tipe];
          const jumlahRelasi = relasiUntuk(e.nama).length;
          return (
            <div key={e.id} onClick={() => setDetail(e)} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "1rem", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.5rem" }}>
                <div style={{ background: c.bg, color: c.color, width: "36px", height: "36px", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconBuilding /></div>
                <span style={{ background: c.bg, color: c.color, fontSize: "0.68rem", fontWeight: 600, padding: "0.2rem 0.5rem", borderRadius: "999px" }}>{e.tipe}</span>
              </div>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B" }}>{e.nama}</div>
              <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.5rem" }}>{e.lokasi}</div>
              <div style={{ fontSize: "0.75rem", color: "#2563EB", fontWeight: 600 }}>{jumlahRelasi} transaksi terhubung</div>
            </div>
          );
        })}
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "420px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>{detail.id} • {detail.tipe} • {detail.lokasi}</p>
            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Transaksi terhubung ({relasiUntuk(detail.nama).length})</div>
            {relasiUntuk(detail.nama).length === 0 ? (
              <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Belum ada transaksi yang melibatkan entitas ini.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                {relasiUntuk(detail.nama).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.55rem 0.75rem", background: "#F8FAFC", borderRadius: "8px", fontSize: "0.8rem" }}>
                    <span style={{ color: "#334155" }}>{t.id} • {t.toko} ↔ {t.produsen}</span>
                    <strong style={{ color: "#1E293B" }}>{formatRupiah(t.nominal)}</strong>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetail(null)} style={{ marginTop: "1.1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}