"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { supabase } from "@/lib/db";

type TipeEntitas = "Toko" | "Produsen";

interface Entitas {
  id: string;
  nama: string;
  tipe: TipeEntitas;
  lokasi: string;
  status: "Aktif" | "Nonaktif";
  latitude?: number | null;
  longitude?: number | null;
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

// Titik tengah default jika data koordinat kosong
const cityCoords: Record<string, [number, number]> = {
  Malang: [-7.9666, 112.6326],
  Jombang: [-7.5460, 112.2384],
  Surabaya: [-7.2575, 112.7521],
  Sidoarjo: [-7.4478, 112.7183],
  Mojokerto: [-7.4726, 112.4381],
};

// HELPER: Mengambil koordinat dari DB atau melempar offset halus jika DB null
function getCoordinates(e: Entitas): [number, number] {
  if (e.latitude && e.longitude) {
    return [e.latitude, e.longitude];
  }

  const known = Object.keys(cityCoords);
  const found = known.find((c) => e.lokasi.toLowerCase().includes(c.toLowerCase()));
  const baseCoord = cityCoords[found || "Malang"];

  // Pergeseran acak berbasis hash ID agar data bertumpuk di 1 kota terpisah rapi
  const hash = (e.id || e.nama).split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const latOffset = ((hash % 87) - 43) * 0.0003;
  const lngOffset = (((hash * 3) % 87) - 43) * 0.0003;

  return [baseCoord[0] + latOffset, baseCoord[1] + lngOffset];
}

const tipeColor: Record<TipeEntitas, string> = { Toko: "#2563EB", Produsen: "#10B981" };
const tipeBg: Record<TipeEntitas, { bg: string; color: string }> = {
  Toko: { bg: "#EFF6FF", color: "#2563EB" },
  Produsen: { bg: "#ECFDF5", color: "#059669" },
};

function MiniMap({ entitasList, selectedDetail }: { entitasList: Entitas[]; selectedDetail: Entitas | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMapInstance | null>(null);

  useEffect(() => {
    function init() {
      const L = window.L;
      if (!ref.current || !L || entitasList.length === 0) return;
      if (mapRef.current) { mapRef.current.remove(); mapRef.current = null; }

      const firstCoord = getCoordinates(entitasList[0]);
      const map = L.map(ref.current, { scrollWheelZoom: false }).setView(firstCoord, 9);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", { attribution: "&copy; OpenStreetMap" }).addTo(map);

      const layers = entitasList.map((e) => {
        const coord = getCoordinates(e);
        const isSelected = selectedDetail?.id === e.id;

        const marker = L.circleMarker(coord, { 
          radius: isSelected ? 11 : 8, 
          color: isSelected ? "#DC2626" : tipeColor[e.tipe], 
          fillColor: tipeColor[e.tipe], 
          fillOpacity: 0.85, 
          weight: isSelected ? 3 : 2 
        });

        marker.addTo(map).bindPopup(`
          <div style="font-family: sans-serif; font-size: 12px; padding: 2px;">
            <strong style="color: #1E293B;">${e.nama}</strong><br/>
            <span style="color: #64748B;">${e.tipe} • ${e.lokasi}</span>
          </div>
        `);
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
  }, [entitasList, selectedDetail]);

  return <div ref={ref} className="map-height-mobile" style={{ height: 320, borderRadius: "10px", overflow: "hidden", background: "#F1F5F9" }} />;
}

const IconBuilding = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="4" y="2" width="16" height="20" rx="1"></rect><line x1="9" y1="7" x2="9" y2="7.01"></line><line x1="15" y1="7" x2="15" y2="7.01"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

export default function PetaRantaiPasok({ transaksiList = [] }: { transaksiList?: EscrowTx[] }) {
  const [entitasList, setEntitasList] = useState<Entitas[]>([]);
  const [loading, setLoading] = useState(true);
  const [tipeFilter, setTipeFilter] = useState<TipeEntitas | "">("");
  const [detail, setDetail] = useState<Entitas | null>(null);

  // LOAD REALTIME DATA FROM SUPABASE
  const loadEntitasData = useCallback(async () => {
    setLoading(true);
    try {
      const { data: tokoData } = await supabase.from("admin_toko").select("*");
      const { data: produsenData } = await supabase.from("produsen").select("*");

      const mappedToko: Entitas[] = (tokoData || []).map((t: any) => ({
        id: t.id,
        nama: t.nama_toko || "Admin Toko",
        tipe: "Toko",
        lokasi: [t.desa, t.kabupaten].filter(Boolean).join(", ") || t.alamat || "Lokal",
        status: t.status === "aktif" ? "Aktif" : "Nonaktif",
        latitude: t.latitude,
        longitude: t.longitude,
      }));

      const mappedProdusen: Entitas[] = (produsenData || []).map((p: any) => ({
        id: p.id,
        nama: p.nama_usaha || "Produsen",
        tipe: "Produsen",
        lokasi: [p.desa, p.kabupaten].filter(Boolean).join(", ") || p.alamat || "Lokal",
        status: p.status === "aktif" ? "Aktif" : "Nonaktif",
        latitude: p.latitude,
        longitude: p.longitude,
      }));

      setEntitasList([...mappedToko, ...mappedProdusen]);
    } catch (err) {
      console.error("Gagal load entitas:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEntitasData();
  }, [loadEntitasData]);

  const filtered = useMemo(() => {
    return entitasList.filter((e) => !tipeFilter || e.tipe === tipeFilter);
  }, [entitasList, tipeFilter]);

  const relasiUntuk = (nama: string) => (transaksiList || []).filter((t) => t.toko === nama || t.produsen === nama);

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <style dangerouslySetInnerHTML={{__html: `
        .map-wrapper-contain { position: relative !important; z-index: 1 !important; }
        .map-wrapper-contain .leaflet-container,
        .map-wrapper-contain .leaflet-pane,
        .map-wrapper-contain .leaflet-top,
        .map-wrapper-contain .leaflet-bottom { z-index: 1 !important; }
        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          main h1 { font-size: 1.15rem !important; }
          .map-height-mobile { height: 220px !important; }
          .supply-cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
        }
      `}} />

      <div style={{ marginBottom: "1.25rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.4rem", fontWeight: 700, color: "#1E293B" }}>Peta Rantai Pasok</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.85rem" }}>Visualisasi lokasi & sebaran jaringan Admin Toko dan Produsen di ekosistem.</p>
      </div>

      <div className="map-filter-buttons" style={{ display: "flex", gap: "0.5rem", marginBottom: "1rem", flexWrap: "wrap" }}>
        <button onClick={() => setTipeFilter("")} style={{ background: tipeFilter === "" ? "#1E293B" : "white", color: tipeFilter === "" ? "#fff" : "#334155", border: "1px solid #E2E8F0", padding: "0.45rem 0.85rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
          Semua ({entitasList.length})
        </button>
        {(["Toko", "Produsen"] as TipeEntitas[]).map((t) => (
          <button key={t} onClick={() => setTipeFilter(t)} style={{ background: tipeFilter === t ? tipeColor[t] : "white", color: tipeFilter === t ? "#fff" : tipeColor[t], border: `1px solid ${tipeColor[t]}`, padding: "0.45rem 0.85rem", borderRadius: "999px", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>
            {t} ({entitasList.filter((e) => e.tipe === t).length})
          </button>
        ))}
      </div>

      <div className="map-wrapper-contain" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "0.75rem", marginBottom: "1.25rem" }}>
        {loading ? (
          <div style={{ height: 320, display: "flex", alignItems: "center", justifyContent: "center", color: "#64748B", fontSize: "0.85rem" }}>Memuat Peta Entitas...</div>
        ) : (
          <MiniMap entitasList={filtered} selectedDetail={detail} />
        )}
        <div className="map-legend-row" style={{ display: "flex", gap: "1rem", marginTop: "0.6rem", fontSize: "0.75rem", color: "#64748B", flexWrap: "wrap" }}>
          <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "50%", background: tipeColor.Toko, marginRight: "5px" }} />Admin Toko</span>
          <span><span style={{ display: "inline-block", width: "9px", height: "9px", borderRadius: "50%", background: tipeColor.Produsen, marginRight: "5px" }} />Produsen</span>
        </div>
      </div>

      <div className="supply-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
        {filtered.length === 0 && !loading && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Belum ada entitas untuk filter ini.</div>
        )}
        {filtered.map((e) => {
          const c = tipeBg[e.tipe];
          const jumlahRelasi = relasiUntuk(e.nama).length;
          return (
            <div key={e.id} onClick={() => setDetail(e)} className="supply-main-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "0.85rem", cursor: "pointer" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.4rem" }}>
                <div style={{ background: c.bg, color: c.color, width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconBuilding /></div>
                <span style={{ background: c.bg, color: c.color, fontSize: "0.65rem", fontWeight: 600, padding: "0.15rem 0.45rem", borderRadius: "999px" }}>{e.tipe}</span>
              </div>
              <div style={{ fontSize: "0.88rem", fontWeight: 700, color: "#1E293B" }}>{e.nama}</div>
              <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.4rem" }}>{e.lokasi}</div>
              <div style={{ fontSize: "0.72rem", color: "#2563EB", fontWeight: 600 }}>{jumlahRelasi} transaksi terhubung</div>
            </div>
          );
        })}
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.25rem", width: "400px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 0.85rem 0", fontSize: "0.78rem", color: "#94A3B8" }}>{detail.id} • {detail.tipe} • {detail.lokasi}</p>
            <div style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.4rem" }}>Transaksi terhubung ({relasiUntuk(detail.nama).length})</div>
            {relasiUntuk(detail.nama).length === 0 ? (
              <p style={{ fontSize: "0.78rem", color: "#94A3B8" }}>Belum ada transaksi yang melibatkan entitas ini.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                {relasiUntuk(detail.nama).map((t) => (
                  <div key={t.id} style={{ display: "flex", justifyContent: "space-between", padding: "0.5rem 0.65rem", background: "#F8FAFC", borderRadius: "6px", fontSize: "0.78rem" }}>
                    <span style={{ color: "#334155" }}>{t.id} • {t.toko} ↔ {t.produsen}</span>
                    <strong style={{ color: "#1E293B" }}>{formatRupiah(t.nominal)}</strong>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setDetail(null)} style={{ marginTop: "1rem", width: "100%", padding: "0.55rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}