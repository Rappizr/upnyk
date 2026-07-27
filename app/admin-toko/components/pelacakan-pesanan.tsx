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

export interface PenjualanItem {
  id: string;
  produk_id: string;
  nama: string;
  jumlah: number;
  harga: number;
  subtotal: number;
}

export interface Penjualan {
  id: string;
  kodePesanan?: string;
  pembeli: string;
  noHpPembeli?: string;
  produk: string;
  jumlah: number;
  total: number;
  tanggal: string;
  status: "Belum Dibayar" | "Diproses" | "Dikirim" | "Selesai" | "Dibatalkan";
  alamatPembeli?: string;
  metodePembayaran?: string;
  buktiPembayaran?: string | null;
  noResi?: string;
  items?: PenjualanItem[];
}

const WARNA_UTAMA = "#F59E0B";
const WARNA_UTAMA_GELAP = "#D97706";

const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 16 14 14"></polyline></svg>;
const IconBox = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconPackage = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconUser = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

const LANGKAH = [
  { key: "Baru", label: "Menunggu", icon: IconClock },
  { key: "Diproses", label: "Diproses", icon: IconBox },
  { key: "Dikirim", label: "Dikirim", icon: IconTruck },
  { key: "Selesai", label: "Diterima", icon: IconCheck },
] as const;

function indeksLangkah(status?: string) {
  if (status === "Menunggu" || status === "Baru" || status === "Belum Dibayar") return 0;
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
  updateStatusPenjualan?: (orderId: string, status: string, noResi?: string) => Promise<void>;
  alamatToko?: string;
  tabDefault?: "produsen-toko" | "toko-pembeli";
}

export default function PelacakanPesanan({
  pembelianList,
  penjualanList = [],
  terimaPesanan,
  updateStatusPenjualan,
  alamatToko,
  tabDefault = "produsen-toko",
}: Props) {
  const [activeTab, setActiveTab] = useState<"produsen-toko" | "toko-pembeli">(tabDefault);
  const [modalTerimaId, setModalTerimaId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<Grade>("A");
  const [ratingInput, setRatingInput] = useState(5);
  const [keteranganInput, setKeteranganInput] = useState("");
  const [fotoUlasanInput, setFotoUlasanInput] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // State untuk Tab Toko ke Pembeli
  const [filterPenjualan, setFilterPenjualan] = useState<string>("Semua");
  const [modalResiOrder, setModalResiOrder] = useState<Penjualan | null>(null);
  const [inputNoResi, setInputNoResi] = useState("");
  const [modalBuktiUrl, setModalBuktiUrl] = useState<string | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

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

  async function handleUbahStatusPenjualan(orderId: string, status: string, resi?: string) {
    if (!updateStatusPenjualan) return;
    setActionLoadingId(orderId);
    try {
      await updateStatusPenjualan(orderId, status, resi);
    } catch (e) {
      console.error("Error ubah status:", e);
    } finally {
      setActionLoadingId(null);
    }
  }

  async function handleKirimResi() {
    if (!modalResiOrder || !inputNoResi.trim()) return;
    const targetId = modalResiOrder.kodePesanan || modalResiOrder.id;
    await handleUbahStatusPenjualan(targetId, "Dikirim", inputNoResi.trim());
    setModalResiOrder(null);
    setInputNoResi("");
  }

  const penjualanFiltered = penjualanList.filter((pj) => {
    if (filterPenjualan === "Semua") return true;
    return (pj.status || "Belum Dibayar") === filterPenjualan;
  });

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
            display: "flex",
            alignItems: "center",
            gap: "6px"
          }}
        >
          <span>🛍️ Toko ke Pembeli</span>
          {penjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length > 0 && (
            <span style={{ background: "#EF4444", color: "white", fontSize: "0.7rem", borderRadius: "999px", padding: "1px 6px", fontWeight: 800 }}>
              {penjualanList.filter(p => p.status === "Belum Dibayar" || p.status === "Diproses").length}
            </span>
          )}
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
        <div>
          {/* FILTER STATUS PESANAN PEMBELI */}
          <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1rem", flexWrap: "wrap" }}>
            {["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"].map((st) => {
              const count = st === "Semua" ? penjualanList.length : penjualanList.filter(p => (p.status || "Belum Dibayar") === st).length;
              const isAktif = filterPenjualan === st;
              return (
                <button
                  key={st}
                  onClick={() => setFilterPenjualan(st)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "20px",
                    border: isAktif ? `1px solid ${WARNA_UTAMA}` : "1px solid #E2E8F0",
                    background: isAktif ? "#FFFBEB" : "#fff",
                    color: isAktif ? WARNA_UTAMA_GELAP : "#64748B",
                    fontSize: "0.78rem",
                    fontWeight: isAktif ? 700 : 500,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "4px"
                  }}
                >
                  <span>{st}</span>
                  <span style={{ fontSize: "0.7rem", opacity: 0.8 }}>({count})</span>
                </button>
              );
            })}
          </div>

          {penjualanFiltered.length === 0 ? (
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
              Belum ada pesanan pembeli pada status <strong>{filterPenjualan}</strong>.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {penjualanFiltered.map((pj) => {
                const targetId = pj.kodePesanan || pj.id;
                const isBusy = actionLoadingId === targetId;

                let badgeBg = "#FEF3C7";
                let badgeColor = "#D97706";
                if (pj.status === "Diproses") { badgeBg = "#DBEAFE"; badgeColor = "#1D4ED8"; }
                if (pj.status === "Dikirim") { badgeBg = "#E0E7FF"; badgeColor = "#4338CA"; }
                if (pj.status === "Selesai") { badgeBg = "#D1FAE5"; badgeColor = "#047857"; }
                if (pj.status === "Dibatalkan") { badgeBg = "#FEE2E2"; badgeColor = "#B91C1C"; }

                return (
                  <div key={pj.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                    {/* Header Card */}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", flexWrap: "wrap", gap: "0.5rem" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#1E293B" }}>#{pj.kodePesanan || pj.id}</span>
                        <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>• {pj.tanggal}</span>
                      </div>
                      <span style={{ fontSize: "0.72rem", fontWeight: 700, color: badgeColor, background: badgeBg, padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                        {pj.status || "Belum Dibayar"}
                      </span>
                    </div>

                    {/* Content Detail */}
                    <div style={{ padding: "1.1rem" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "1rem", marginBottom: "1rem" }}>
                        {/* Info Pembeli & Alamat */}
                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.82rem", fontWeight: 700, color: "#334155", marginBottom: "0.4rem" }}>
                            <IconUser /> {pj.pembeli} {pj.noHpPembeli && <span style={{ fontWeight: 400, color: "#64748B", fontSize: "0.75rem" }}>({pj.noHpPembeli})</span>}
                          </div>
                          <div style={{ display: "flex", alignItems: "flex-start", gap: "6px", fontSize: "0.78rem", color: "#64748B", lineHeight: 1.4 }}>
                            <IconMapPin />
                            <span>{pj.alamatPembeli || "Alamat pengiriman belum diisi"}</span>
                          </div>
                        </div>

                        {/* Info Pembayaran & Total */}
                        <div style={{ background: "#F8FAFC", padding: "0.85rem", borderRadius: "8px", border: "1px solid #F1F5F9", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700, letterSpacing: ".02em" }}>METODE PEMBAYARAN</div>
                            <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginTop: "2px" }}>{pj.metodePembayaran || "QRIS"}</div>
                            {pj.buktiPembayaran && (
                              <button
                                onClick={() => setModalBuktiUrl(pj.buktiPembayaran || null)}
                                style={{ marginTop: "0.4rem", border: "none", background: "none", color: "#2563EB", fontSize: "0.75rem", fontWeight: 600, cursor: "pointer", padding: 0, textDecoration: "underline" }}
                              >
                                🖼️ Lihat Bukti Transfer
                              </button>
                            )}
                          </div>
                          <div style={{ marginTop: "0.5rem" }}>
                            <div style={{ fontSize: "0.72rem", color: "#64748B", textTransform: "uppercase", fontWeight: 700 }}>TOTAL BELANJA</div>
                            <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#10B981" }}>{formatRupiah(pj.total)}</div>
                          </div>
                        </div>
                      </div>

                      {/* Rincian Barang */}
                      <div style={{ marginBottom: "1rem" }}>
                        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.4rem" }}>Rincian Barang Dipesan:</div>
                        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "8px", overflow: "hidden" }}>
                          {(pj.items && pj.items.length > 0) ? (
                            pj.items.map((it, idx) => (
                              <div key={idx} style={{ display: "flex", justifyContent: "space-between", padding: "0.6rem 0.85rem", borderBottom: idx < pj.items!.length - 1 ? "1px solid #F1F5F9" : "none", fontSize: "0.8rem" }}>
                                <span style={{ color: "#1E293B", fontWeight: 600 }}>{it.nama} <span style={{ color: "#64748B", fontWeight: 400 }}>× {it.jumlah}</span></span>
                                <span style={{ color: "#475569", fontWeight: 700 }}>{formatRupiah(it.subtotal || (it.harga * it.jumlah))}</span>
                              </div>
                            ))
                          ) : (
                            <div style={{ padding: "0.6rem 0.85rem", fontSize: "0.8rem", color: "#475569" }}>
                              {pj.produk} ({pj.jumlah} pcs)
                            </div>
                          )}
                        </div>
                      </div>

                      {/* No Resi jika ada */}
                      {pj.noResi && (
                        <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "0.6rem 0.85rem", borderRadius: "8px", marginBottom: "1rem", fontSize: "0.8rem", color: "#1E40AF" }}>
                          📦 <strong>No. Resi Pengiriman:</strong> <code style={{ background: "#DBEAFE", padding: "2px 6px", borderRadius: "4px", fontWeight: 700 }}>{pj.noResi}</code>
                        </div>
                      )}

                      {/* TOMBOL AKSI PROSES PESANAN */}
                      <div style={{ display: "flex", gap: "0.6rem", justifyContent: "flex-end", flexWrap: "wrap" }}>
                        {pj.status === "Belum Dibayar" && (
                          <>
                            <button
                              disabled={isBusy}
                              onClick={() => handleUbahStatusPenjualan(targetId, "Dibatalkan")}
                              style={{ padding: "0.55rem 1rem", borderRadius: "8px", border: "1px solid #FCA5A5", background: "#FEF2F2", color: "#991B1B", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                            >
                              Batalkan
                            </button>
                            <button
                              disabled={isBusy}
                              onClick={() => handleUbahStatusPenjualan(targetId, "Diproses")}
                              style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}
                            >
                              {isBusy ? "Memproses..." : "Konfirmasi Pembayaran & Proses"}
                            </button>
                          </>
                        )}

                        {pj.status === "Diproses" && (
                          <button
                            disabled={isBusy}
                            onClick={() => { setModalResiOrder(pj); setInputNoResi(`NUSA-${Date.now().toString().slice(-6)}`); }}
                            style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            <IconTruck />
                            <span>Kirim Pesanan & Input Resi</span>
                          </button>
                        )}

                        {pj.status === "Dikirim" && (
                          <button
                            disabled={isBusy}
                            onClick={() => handleUbahStatusPenjualan(targetId, "Selesai")}
                            style={{ padding: "0.55rem 1.2rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                          >
                            <IconCheck />
                            <span>{isBusy ? "Menyelesaikan..." : "Tandai Pesanan Selesai"}</span>
                          </button>
                        )}

                        {pj.status === "Selesai" && (
                          <span style={{ fontSize: "0.78rem", color: "#047857", fontWeight: 700, background: "#D1FAE5", padding: "0.4rem 0.8rem", borderRadius: "6px" }}>
                            ✓ Transaksi Selesai
                          </span>
                        )}
                        {pj.status === "Dibatalkan" && (
                          <span style={{ fontSize: "0.78rem", color: "#B91C1C", fontWeight: 700, background: "#FEE2E2", padding: "0.4rem 0.8rem", borderRadius: "6px" }}>
                            ✕ Pesanan Dibatalkan
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* MODAL INPUT RESI */}
      {modalResiOrder && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "100%", maxWidth: "420px", boxShadow: "0 10px 25px rgba(0,0,0,0.15)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <div style={{ fontWeight: 800, fontSize: "1rem", color: "#1E293B" }}>Kirim Pesanan #{modalResiOrder.kodePesanan || modalResiOrder.id}</div>
              <button onClick={() => setModalResiOrder(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginBottom: "1rem", lineHeight: 1.4 }}>
              Masukkan nomor resi pengiriman atau nama kurir pengantar untuk pembeli <strong>{modalResiOrder.pembeli}</strong>.
            </p>
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>Nomor Resi / Kurir</label>
              <input
                type="text"
                value={inputNoResi}
                onChange={(e) => setInputNoResi(e.target.value)}
                placeholder="Contoh: NUSA-882199 / Kurir Toko"
                style={{ width: "100%", padding: "0.65rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", gap: "0.5rem", justifyContent: "flex-end" }}>
              <button onClick={() => setModalResiOrder(null)} style={{ padding: "0.6rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontSize: "0.8rem", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button onClick={handleKirimResi} style={{ padding: "0.6rem 1.2rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontSize: "0.8rem", fontWeight: 700, cursor: "pointer" }}>Konfirmasi Kirim</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL TERIMA PESANAN (PRODUSEN KE TOKO) */}
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

      {/* MODAL PREVIEW BUKTI PEMBAYARAN */}
      {modalBuktiUrl && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.75)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div style={{ background: "white", borderRadius: "14px", padding: "1.25rem", width: "100%", maxWidth: "480px", textAlign: "center" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
              <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>Bukti Transfer Pembayaran</div>
              <button onClick={() => setModalBuktiUrl(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}><IconX /></button>
            </div>
            <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E2E8F0", marginBottom: "1rem", maxHeight: "360px", display: "flex", justifyContent: "center", background: "#F8FAFC" }}>
              <img src={modalBuktiUrl} alt="Bukti Transfer" style={{ maxWidth: "100%", maxHeight: "360px", objectFit: "contain" }} />
            </div>
            <button onClick={() => setModalBuktiUrl(null)} style={{ padding: "0.5rem 1.5rem", borderRadius: "6px", border: "none", background: "#64748B", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Tutup</button>
          </div>
        </div>
      )}
    </div>
  );
}