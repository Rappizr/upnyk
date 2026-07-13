"use client";

import { useState } from "react";

interface Komoditas {
  nama: string;
  hargaPlatform: number;
  hargaTengkulak: number;
  volumeTon: number;
}
interface DaerahProduktif { lokasi: string; jumlah: number }
interface Entitas { id: string; nama: string; tipe: "Toko" | "Produsen"; lokasi: string; status: string }

interface Props {
  komoditasList: Komoditas[];
  daerahProduktif: DaerahProduktif[];
  indeksHargaAdil: number;
  totalGMV: number;
  entitasList: Entitas[];
}

const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconTrend = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline></svg>;
const IconMapPin = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatRupiahRingkas(n: number) {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(1)}M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return formatRupiah(n);
}

export default function LaporanDampak({ komoditasList, daerahProduktif, indeksHargaAdil, totalGMV }: Props) {
  const [detail, setDetail] = useState<Komoditas | null>(null);
  const maxVolume = Math.max(...komoditasList.map((k) => k.volumeTon), 1);
  const maxDaerah = Math.max(...daerahProduktif.map((d) => d.jumlah), 1);

  function unduhPDF() {
    window.print();
  }

  function unduhWord() {
    const baris = (label: string, value: string) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:bold;">${label}</td><td style="padding:6px 10px;border:1px solid #ddd;">${value}</td></tr>`;
    const komoditasRows = komoditasList.map((k) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${k.nama}</td><td style="padding:6px 10px;border:1px solid #ddd;">${k.volumeTon} ton</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(k.hargaPlatform)}</td><td style="padding:6px 10px;border:1px solid #ddd;">${formatRupiah(k.hargaTengkulak)}</td></tr>`).join("");
    const daerahRows = daerahProduktif.map((d) => `<tr><td style="padding:6px 10px;border:1px solid #ddd;">${d.lokasi}</td><td style="padding:6px 10px;border:1px solid #ddd;">${d.jumlah} mitra</td></tr>`).join("");
    const html = `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Laporan Dampak PasarNusa</title></head><body style="font-family:Calibri,Arial,sans-serif;">
      <h1>Laporan Dampak PasarNusa</h1>
      <table style="border-collapse:collapse;margin-bottom:20px;">
        ${baris("Indeks Harga Adil", `${indeksHargaAdil}/100`)}
        ${baris("Total Perputaran Dana", formatRupiahRingkas(totalGMV))}
        ${baris("Wilayah Terjangkau", `${daerahProduktif.length} wilayah`)}
      </table>
      <h2>Komoditas Terlaris Nasional</h2>
      <table style="border-collapse:collapse;margin-bottom:20px;">
        <tr><th style="padding:6px 10px;border:1px solid #ddd;">Komoditas</th><th style="padding:6px 10px;border:1px solid #ddd;">Volume</th><th style="padding:6px 10px;border:1px solid #ddd;">Harga PasarNusa</th><th style="padding:6px 10px;border:1px solid #ddd;">Estimasi Tengkulak</th></tr>
        ${komoditasRows}
      </table>
      <h2>Daerah Paling Produktif</h2>
      <table style="border-collapse:collapse;">
        <tr><th style="padding:6px 10px;border:1px solid #ddd;">Wilayah</th><th style="padding:6px 10px;border:1px solid #ddd;">Jumlah Mitra</th></tr>
        ${daerahRows}
      </table>
    </body></html>`;
    const blob = new Blob(["\ufeff", html], { type: "application/msword" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Laporan-Dampak-PasarNusa.doc";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Laporan Dampak</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Bukti kuantitatif dampak platform — indeks harga adil, komoditas terlaris, dan daerah paling produktif.</p>
        </div>
        <div style={{ display: "flex", gap: "0.5rem" }}>
          <button onClick={unduhPDF} style={{ background: "#FEE2E2", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#991B1B", cursor: "pointer" }}>Unduh PDF</button>
          <button onClick={unduhWord} style={{ background: "#EFF6FF", border: "none", padding: "0.55rem 1rem", borderRadius: "8px", fontSize: "0.82rem", fontWeight: 600, color: "#2563EB", cursor: "pointer" }}>Unduh Word</button>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#ECFDF5", border: "1px solid #A7F3D0", padding: "1.1rem", borderRadius: "12px" }}>
          <div style={{ fontSize: "0.72rem", fontWeight: 700, color: "#065F46", letterSpacing: ".03em", marginBottom: "0.4rem" }}>INDEKS HARGA ADIL</div>
          <div style={{ fontSize: "1.6rem", fontWeight: 700, color: "#065F46" }}>{indeksHargaAdil} <span style={{ fontSize: "0.85rem", fontWeight: 400 }}>/100</span></div>
          <div style={{ fontSize: "0.75rem", color: "#059669", marginTop: "0.2rem" }}>Dibanding estimasi harga tengkulak</div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalGMV)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Perputaran Dana</div></div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconMapPin /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{daerahProduktif.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Wilayah Terjangkau</div></div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.25rem" }}>
        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "0.2rem" }}>
            <span style={{ color: "#2563EB" }}><IconTrend /></span>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Komoditas Terlaris Nasional</h3>
          </div>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "#94A3B8" }}>Klik komoditas untuk lihat perbandingan harga vs tengkulak</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {komoditasList.map((k) => (
              <div key={k.nama} onClick={() => setDetail(k)} style={{ cursor: "pointer" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#334155", fontWeight: 500 }}>{k.nama}</span>
                  <strong style={{ color: "#1E293B" }}>{k.volumeTon} ton</strong>
                </div>
                <div style={{ width: "100%", background: "#F1F5F9", height: "10px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${(k.volumeTon / maxVolume) * 100}%`, height: "100%", background: "#2563EB" }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{ background: "white", padding: "1.25rem", borderRadius: "12px", border: "1px solid #E2E8F0" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "7px", marginBottom: "0.2rem" }}>
            <span style={{ color: "#D97706" }}><IconMapPin /></span>
            <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: "#1E293B" }}>Daerah Paling Produktif</h3>
          </div>
          <p style={{ margin: "0 0 1rem 0", fontSize: "0.78rem", color: "#94A3B8" }}>Dihitung otomatis dari jumlah mitra terverifikasi per wilayah</p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {daerahProduktif.map((d) => (
              <div key={d.lokasi}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: "0.3rem" }}>
                  <span style={{ color: "#334155", fontWeight: 500 }}>{d.lokasi}</span>
                  <strong style={{ color: "#1E293B" }}>{d.jumlah} mitra</strong>
                </div>
                <div style={{ width: "100%", background: "#F1F5F9", height: "10px", borderRadius: "999px", overflow: "hidden" }}>
                  <div style={{ width: `${(d.jumlah / maxDaerah) * 100}%`, height: "100%", background: "#F59E0B" }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {detail && (
        <div onClick={() => setDetail(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "400px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: "#1E293B" }}>{detail.nama}</h2>
              <button onClick={() => setDetail(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#ECFDF5", borderRadius: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "#065F46" }}>Harga di PasarNusa</span>
                <strong style={{ color: "#065F46" }}>{formatRupiah(detail.hargaPlatform)}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.8rem", background: "#FEF2F2", borderRadius: "8px", fontSize: "0.85rem" }}>
                <span style={{ color: "#991B1B" }}>Estimasi harga tengkulak</span>
                <strong style={{ color: "#991B1B" }}>{formatRupiah(detail.hargaTengkulak)}</strong>
              </div>
            </div>
            <div style={{ textAlign: "center", fontSize: "0.85rem", color: "#334155", background: "#F8FAFC", borderRadius: "8px", padding: "0.7rem" }}>
              Petani/pengrajin untung <strong style={{ color: "#059669" }}>{Math.round(((detail.hargaPlatform - detail.hargaTengkulak) / detail.hargaTengkulak) * 100)}% lebih tinggi</strong> lewat PasarNusa
            </div>
            <button onClick={() => setDetail(null)} style={{ marginTop: "1.1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
          </div>
        </div>
      )}
    </main>
  );
}