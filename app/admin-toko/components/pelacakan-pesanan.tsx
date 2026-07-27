"use client";

import { useState, useRef, useEffect } from "react";
import type { ChangeEvent } from "react";
import { supabase } from "@/lib/db";

export type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface Pembelian {
  id: string;
  produsenId?: string;
  produsen: string;
  item: string;
  jumlah: number;
  satuan?: string;
  hargaSatuan?: number;
  total: number;
  status: "Menunggu" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan" | "Baru";
  tanggal: string;
  noResi?: string;
  fotoProduk?: string;
  rating?: number;
  fotoUlasan?: string;
  keteranganUlasan?: string;
  lokasiProdusen?: string;
}

export interface Penjualan {
  id: string;
  pembeli: string;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
  status?: "Menunggu" | "Diproses" | "Dikirim" | "Diterima" | "Selesai" | "Dibatalkan";
  alamatPembeli?: string;
  noResi?: string;
}

const WARNA_UTAMA = "#F59E0B";
const WARNA_UTAMA_GELAP = "#D97706";

const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14 14"></polyline></svg>;
const IconBox = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconStar = ({ filled }: { filled: boolean }) => <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#CBD5E1"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconStarSmall = ({ filled }: { filled: boolean }) => <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#CBD5E1"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconCamera = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPackage = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconRoute = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"></circle><circle cx="18" cy="5" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path></svg>;
const IconChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;

const LANGKAH = [
  { key: "Baru", label: "Menunggu", icon: IconClock },
  { key: "Diproses", label: "Diproses", icon: IconBox },
  { key: "Dikirim", label: "Dikirim", icon: IconTruck },
  { key: "Selesai", label: "Diterima", icon: IconCheck },
] as const;

function indeksLangkah(status?: string) {
  if (status === "Menunggu" || status === "Baru") return 0;
  if (status === "Diproses") return 1;
  if (status === "Dikirim") return 2;
  if (status === "Diterima" || status === "Selesai") return 3;
  return 0;
}

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

interface Props {
  pembelianList: Pembelian[];
  penjualanList?: Penjualan[];
  terimaPesanan: (id: string, grade: Grade, rating?: number, fotoUlasan?: string, keteranganUlasan?: string) => void;
  alamatToko?: string;
  tabDefault?: "produsen-toko" | "toko-pembeli";
}

export default function PelacakanPesanan({
  pembelianList,
  penjualanList = [],
  terimaPesanan,
  alamatToko,
  tabDefault = "produsen-toko",
}: Props) {
  const [activeTab, setActiveTab] = useState<"produsen-toko" | "toko-pembeli">(tabDefault);
  const [petaTerbukaId, setPetaTerbukaId] = useState<string | null>(null);
  const [modalTerimaId, setModalTerimaId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<Grade>("A");
  const [ratingInput, setRatingInput] = useState(5);
  const [keteranganInput, setKeteranganInput] = useState("");
  const [fotoUlasanInput, setFotoUlasanInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const fileUlasanRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setActiveTab(tabDefault);
  }, [tabDefault]);

  function bukaModalTerima(id: string) {
    setGradeInput("A");
    setRatingInput(5);
    setKeteranganInput("");
    setFotoUlasanInput("");
    setModalTerimaId(id);
  }

  function handleFotoUlasanChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setFotoUlasanInput(reader.result as string);
    reader.readAsDataURL(file);
  }

  async function kirimTerimaPesanan() {
    if (!modalTerimaId || submitting) return;
    setSubmitting(true);

    try {
      terimaPesanan(modalTerimaId, gradeInput, ratingInput, fotoUlasanInput || undefined, keteranganInput || undefined);
      setModalTerimaId(null);
    } catch (err) {
      console.error("Gagal mengirim ulasan:", err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      {/* TABS SUBNAVIGATION */}
      <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.25rem", borderBottom: "1px solid #E2E8F0", paddingBottom: "0.5rem" }}>
        <button
          onClick={() => setActiveTab("produsen-toko")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "produsen-toko" ? WARNA_UTAMA : "#F1F5F9",
            color: activeTab === "produsen-toko" ? "#fff" : "#64748B",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          📦 Produsen ke Toko
        </button>
        <button
          onClick={() => setActiveTab("toko-pembeli")}
          style={{
            padding: "0.6rem 1.2rem",
            borderRadius: "8px",
            border: "none",
            background: activeTab === "toko-pembeli" ? WARNA_UTAMA : "#F1F5F9",
            color: activeTab === "toko-pembeli" ? "#fff" : "#64748B",
            fontWeight: 700,
            fontSize: "0.85rem",
            cursor: "pointer",
          }}
        >
          🛍️ Toko ke Pembeli
        </button>
      </div>

      {/* TAB 1: PRODUSEN KE TOKO */}
      {activeTab === "produsen-toko" && (
        pembelianList.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
            Belum ada pesanan bahan baku yang dilacak dari produsen.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {pembelianList.map((p) => {
              const langkahAktif = indeksLangkah(p.status);
              const isSelesai = p.status === "Diterima" || p.status === "Selesai";

              return (
                <div key={p.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1E293B" }}>#{p.id} • {p.tanggal}</span>
                    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: WARNA_UTAMA_GELAP, background: "#FEF3C7", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>{p.produsen}</span>
                  </div>

                  <div style={{ display: "flex", gap: "0.85rem", padding: "1rem 1.1rem", alignItems: "center" }}>
                    <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "#FEF3C7", color: WARNA_UTAMA_GELAP, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <IconPackage />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{p.item}</div>
                      <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{p.jumlah} {p.satuan || "pcs"} × {formatRupiah(p.hargaSatuan || 0)}</div>
                    </div>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiah(p.total)}</div>
                  </div>

                  <div style={{ padding: "0.5rem 1.5rem 1.1rem" }}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      {LANGKAH.map((l, i) => {
                        const Icon = l.icon;
                        const selesai = i <= langkahAktif;
                        return (
                          <div key={l.key} style={{ display: "flex", alignItems: "center", flex: i < LANGKAH.length - 1 ? 1 : "unset" }}>
                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                              <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: selesai ? WARNA_UTAMA : "#E2E8F0", color: selesai ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                <Icon />
                              </div>
                              <span style={{ fontSize: "0.65rem", fontWeight: 600, color: selesai ? "#1E293B" : "#94A3B8" }}>{l.label}</span>
                            </div>
                            {i < LANGKAH.length - 1 && <div style={{ flex: 1, height: "3px", background: i < langkahAktif ? WARNA_UTAMA : "#E2E8F0" }} />}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div style={{ padding: "0 1.1rem 1.1rem" }}>
                    {p.status === "Dikirim" && (
                      <button onClick={() => bukaModalTerima(p.id)} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, cursor: "pointer" }}>
                        Pesanan Diterima & Beri Ulasan
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: TOKO KE PEMBELI */}
      {activeTab === "toko-pembeli" && (
        penjualanList.length === 0 ? (
          <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
            Belum ada pesanan masuk dari pembeli akhir.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {penjualanList.map((pj) => (
              <div key={pj.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", padding: "1rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700 }}>Pembeli: {pj.pembeli}</span>
                  <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#10B981" }}>{formatRupiah(pj.total)}</span>
                </div>
                <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
                  Item: {pj.produk} ({pj.jumlah} pcs)
                </div>
                <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginTop: "0.4rem" }}>
                  Status Kirim: <strong style={{ color: WARNA_UTAMA_GELAP }}>{pj.status || "Diproses"}</strong>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* MODAL TERIMA PESANAN */}
      {modalTerimaId && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.25rem", width: "100%", maxWidth: "440px" }}>
            <div style={{ fontWeight: 700, fontSize: "1.05rem", marginBottom: "1rem" }}>Konfirmasi Pesanan Diterima</div>
            <button onClick={kirimTerimaPesanan} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, cursor: "pointer" }}>
              Konfirmasi & Selesaikan
            </button>
          </div>
        </div>
      )}
    </div>
  );
}