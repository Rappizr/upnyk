"use client";

import { useRef, useState } from "react";
import type { ChangeEvent } from "react";
import type { Grade, Pembelian } from "../page";

const WARNA_UTAMA = "#F59E0B";
const WARNA_UTAMA_GELAP = "#D97706";

const IconTruck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>;
const IconClock = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconCheck = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconStar = ({ filled }: { filled: boolean }) => <svg width="26" height="26" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#CBD5E1"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconStarSmall = ({ filled }: { filled: boolean }) => <svg width="13" height="13" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke={filled ? "#F59E0B" : "#CBD5E1"} strokeWidth="1.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconCamera = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPackage = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconRoute = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="6" cy="19" r="3"></circle><circle cx="18" cy="5" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path></svg>;
const IconChevronDown = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>;

const LANGKAH = [
  { key: "Menunggu", label: "Menunggu", icon: IconClock },
  { key: "Dikirim", label: "Dikirim", icon: IconTruck },
  { key: "Diterima", label: "Diterima", icon: IconCheck },
] as const;

function indeksLangkah(status: Pembelian["status"]) {
  return LANGKAH.findIndex((l) => l.key === status);
}

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}

interface Props {
  pembelianList: Pembelian[];
  tandaiDikirim: (id: string, noResi: string) => void;
  terimaPesanan: (id: string, grade: Grade, rating?: number, fotoUlasan?: string, keteranganUlasan?: string) => void;
  /** Alamat toko (titik tujuan) untuk peta rute pengiriman */
  alamatToko?: string;
}

export default function PelacakanPesanan({ pembelianList, tandaiDikirim, terimaPesanan, alamatToko }: Props) {
  const [petaTerbukaId, setPetaTerbukaId] = useState<string | null>(null);
  const [modalKirimId, setModalKirimId] = useState<string | null>(null);
  const [noResiInput, setNoResiInput] = useState("");

  const [modalTerimaId, setModalTerimaId] = useState<string | null>(null);
  const [gradeInput, setGradeInput] = useState<Grade>("Belum Dinilai");
  const [ratingInput, setRatingInput] = useState(0);
  const [keteranganInput, setKeteranganInput] = useState("");
  const [fotoUlasanInput, setFotoUlasanInput] = useState("");
  const fileUlasanRef = useRef<HTMLInputElement>(null);

  function bukaModalKirim(id: string) {
    setNoResiInput("");
    setModalKirimId(id);
  }

  function kirimTandaiDikirim() {
    if (!modalKirimId) return;
    tandaiDikirim(modalKirimId, noResiInput);
    setModalKirimId(null);
  }

  function bukaModalTerima(id: string) {
    setGradeInput("Belum Dinilai");
    setRatingInput(0);
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

  function kirimTerimaPesanan() {
    if (!modalTerimaId) return;
    if (gradeInput === "Belum Dinilai") {
      alert("Pilih grade kualitas barang terlebih dahulu.");
      return;
    }
    terimaPesanan(modalTerimaId, gradeInput, ratingInput || undefined, fotoUlasanInput || undefined, keteranganInput || undefined);
    setModalTerimaId(null);
  }

  const overlayStyle: React.CSSProperties = {
    position: "fixed", inset: 0, background: "rgba(15,23,42,0.55)", zIndex: 1000,
    display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem",
  };
  const modalCardStyle: React.CSSProperties = {
    background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", width: "100%",
    maxWidth: "440px", maxHeight: "90vh", overflowY: "auto", position: "relative",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)", padding: "1.25rem",
  };
  const closeBtnStyle: React.CSSProperties = {
    position: "absolute", top: "0.9rem", right: "0.9rem", background: "#F1F5F9", border: "none",
    borderRadius: "50%", width: "26px", height: "26px", display: "flex", alignItems: "center",
    justifyContent: "center", cursor: "pointer", color: "#64748B",
  };

  return (
    <div style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      {pembelianList.length === 0 ? (
        <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "3rem 1.5rem", textAlign: "center", color: "#64748B" }}>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: "0.75rem", color: "#CBD5E1" }}><IconPackage /></div>
          Belum ada pesanan bahan baku yang dilacak. Belanja dulu di Marketplace Produsen.
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {pembelianList.map((p) => {
            const langkahAktif = indeksLangkah(p.status);
            return (
              <div key={p.id} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.85rem 1.1rem", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", flexWrap: "wrap", gap: "0.4rem" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#1E293B" }}>{p.id}</span>
                    <span style={{ fontSize: "0.7rem", color: "#94A3B8" }}>• {p.tanggal}</span>
                  </div>
                  <span style={{ fontSize: "0.68rem", fontWeight: 700, color: WARNA_UTAMA_GELAP, background: "#FEF3C7", padding: "0.2rem 0.6rem", borderRadius: "999px" }}>{p.produsen}</span>
                </div>

                {/* Item info */}
                <div style={{ display: "flex", gap: "0.85rem", padding: "1rem 1.1rem", alignItems: "center" }}>
                  <div style={{ width: "56px", height: "56px", borderRadius: "8px", background: "#FEF3C7", color: WARNA_UTAMA_GELAP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, overflow: "hidden" }}>
                    {p.fotoProduk ? <img src={p.fotoProduk} alt={p.item} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconPackage />}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{p.item}</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{p.jumlah} {p.satuan} × {formatRupiah(p.hargaSatuan)}</div>
                  </div>
                  <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap" }}>{formatRupiah(p.total)}</div>
                </div>

                {/* Stepper ala Shopee */}
                <div style={{ padding: "0.5rem 1.5rem 1.1rem" }}>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    {LANGKAH.map((l, i) => {
                      const Icon = l.icon;
                      const selesai = i <= langkahAktif;
                      return (
                        <div key={l.key} style={{ display: "flex", alignItems: "center", flex: i < LANGKAH.length - 1 ? 1 : "unset" }}>
                          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem" }}>
                            <div style={{ width: "30px", height: "30px", borderRadius: "50%", background: selesai ? WARNA_UTAMA : "#E2E8F0", color: selesai ? "white" : "#94A3B8", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              <Icon />
                            </div>
                            <span style={{ fontSize: "0.65rem", fontWeight: 600, color: selesai ? "#1E293B" : "#94A3B8", whiteSpace: "nowrap" }}>{l.label}</span>
                          </div>
                          {i < LANGKAH.length - 1 && (
                            <div style={{ flex: 1, height: "3px", background: i < langkahAktif ? WARNA_UTAMA : "#E2E8F0", margin: "0 4px", marginBottom: "1.1rem", borderRadius: "2px" }} />
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {p.noResi && <div style={{ marginTop: "0.6rem", fontSize: "0.72rem", color: "#64748B" }}>No. Resi: <span style={{ fontWeight: 700, color: "#1E293B" }}>{p.noResi}</span></div>}

                  {p.status !== "Menunggu" && (
                    <div style={{ marginTop: "0.75rem" }}>
                      <button
                        onClick={() => setPetaTerbukaId(petaTerbukaId === p.id ? null : p.id)}
                        style={{ display: "flex", alignItems: "center", gap: "0.35rem", background: "none", border: "none", padding: 0, cursor: "pointer", color: WARNA_UTAMA_GELAP, fontSize: "0.75rem", fontWeight: 700 }}
                      >
                        <IconRoute /> Lihat Rute Pengiriman
                        <span style={{ display: "flex", transform: petaTerbukaId === p.id ? "rotate(180deg)" : "none", transition: "transform .15s ease" }}><IconChevronDown /></span>
                      </button>

                      {petaTerbukaId === p.id && (
                        <div style={{ marginTop: "0.6rem" }}>
                          {p.lokasiProdusen && alamatToko ? (
                            <>
                              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: "#64748B", marginBottom: "0.4rem", flexWrap: "wrap", gap: "0.3rem" }}>
                                <span>📍 Asal: <strong style={{ color: "#1E293B" }}>{p.lokasiProdusen}</strong></span>
                                <span>🏁 Tujuan: <strong style={{ color: "#1E293B" }}>{alamatToko}</strong></span>
                              </div>
                              <iframe
                                title={`Rute pengiriman dari ${p.produsen}`}
                                src={`https://maps.google.com/maps?saddr=${encodeURIComponent(p.lokasiProdusen)}&daddr=${encodeURIComponent(alamatToko)}&output=embed`}
                                style={{ width: "100%", height: "220px", border: "1px solid #E2E8F0", borderRadius: "8px" }}
                                loading="lazy"
                              />
                            </>
                          ) : (
                            <div style={{ fontSize: "0.75rem", color: "#94A3B8", fontStyle: "italic", padding: "0.75rem", background: "#F8FAFC", borderRadius: "8px" }}>
                              Alamat produsen atau toko belum lengkap untuk menampilkan rute.
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Area aksi / hasil ulasan */}
                <div style={{ padding: "0 1.1rem 1.1rem" }}>
                  {p.status === "Menunggu" && (
                    <button onClick={() => bukaModalKirim(p.id)} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "1px solid #FDE68A", background: "#FFFBEB", color: WARNA_UTAMA_GELAP, fontWeight: 700, fontSize: "0.82rem", cursor: "pointer" }}>Tandai Sudah Dikirim</button>
                  )}
                  {p.status === "Dikirim" && (
                    <button onClick={() => bukaModalTerima(p.id)} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Pesanan Diterima</button>
                  )}
                  {p.status === "Diterima" && (
                    <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.75rem 0.9rem" }}>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.35rem" }}>
                        <span style={{ fontSize: "0.72rem", fontWeight: 700, color: "#1E293B" }}>Ulasan Anda</span>
                        {typeof p.rating === "number" && p.rating > 0 && (
                          <div style={{ display: "flex", gap: "1px" }}>
                            {[1, 2, 3, 4, 5].map((n) => <IconStarSmall key={n} filled={n <= (p.rating || 0)} />)}
                          </div>
                        )}
                      </div>
                      {p.keteranganUlasan ? (
                        <p style={{ fontSize: "0.78rem", color: "#475569", margin: 0 }}>{p.keteranganUlasan}</p>
                      ) : (
                        <p style={{ fontSize: "0.78rem", color: "#94A3B8", margin: 0, fontStyle: "italic" }}>Belum ada keterangan ulasan.</p>
                      )}
                      {p.fotoUlasan && (
                        <img src={p.fotoUlasan} alt="Foto ulasan" style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "6px", marginTop: "0.5rem" }} />
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODAL: Tandai Sudah Dikirim */}
      {modalKirimId && (
        <div style={overlayStyle} onClick={() => setModalKirimId(null)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalKirimId(null)} style={closeBtnStyle}><IconX /></button>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1E293B", marginBottom: "0.9rem" }}>Tandai Pesanan Sudah Dikirim</div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nomor Resi (opsional)</label>
            <input value={noResiInput} onChange={(e) => setNoResiInput(e.target.value)} placeholder="Contoh: JNE0012345678" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box", marginBottom: "1rem" }} />
            <button onClick={kirimTandaiDikirim} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Konfirmasi Dikirim</button>
          </div>
        </div>
      )}

      {/* MODAL: Pesanan Diterima → grading + rating/ulasan */}
      {modalTerimaId && (
        <div style={overlayStyle} onClick={() => setModalTerimaId(null)}>
          <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setModalTerimaId(null)} style={closeBtnStyle}><IconX /></button>
            <div style={{ fontWeight: 700, fontSize: "1rem", color: "#1E293B", marginBottom: "0.2rem" }}>Konfirmasi Pesanan Diterima</div>
            <p style={{ fontSize: "0.78rem", color: "#64748B", marginTop: 0, marginBottom: "1rem" }}>Nilai kualitas barang & beri ulasan untuk produsen.</p>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Grade Kualitas Barang *</label>
            <div style={{ display: "flex", gap: "0.5rem", marginBottom: "1.1rem" }}>
              {(["A", "B", "C"] as Grade[]).map((g) => (
                <button key={g} type="button" onClick={() => setGradeInput(g)} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: gradeInput === g ? `2px solid ${WARNA_UTAMA}` : "1px solid #E2E8F0", background: gradeInput === g ? "#FFFBEB" : "white", color: gradeInput === g ? WARNA_UTAMA_GELAP : "#64748B", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>{g}</button>
              ))}
            </div>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Rating Produk</label>
            <div style={{ display: "flex", gap: "0.3rem", marginBottom: "1rem" }}>
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRatingInput(n)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0 }}>
                  <IconStar filled={n <= ratingInput} />
                </button>
              ))}
            </div>

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Foto Produk (opsional)</label>
            <div onClick={() => fileUlasanRef.current?.click()} style={{ border: `1.5px dashed ${WARNA_UTAMA}`, background: "#FFFBEB", borderRadius: "10px", height: "90px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", marginBottom: "1rem" }}>
              {fotoUlasanInput ? (
                <img src={fotoUlasanInput} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.3rem", color: WARNA_UTAMA_GELAP }}>
                  <IconCamera />
                  <span style={{ fontSize: "0.72rem" }}>Unggah foto produk diterima</span>
                </div>
              )}
            </div>
            <input ref={fileUlasanRef} type="file" accept="image/*" onChange={handleFotoUlasanChange} style={{ display: "none" }} />

            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.4rem" }}>Keterangan</label>
            <textarea value={keteranganInput} onChange={(e) => setKeteranganInput(e.target.value)} placeholder="Ceritakan kualitas & kesesuaian barang yang diterima..." rows={3} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box", marginBottom: "1.1rem", resize: "vertical", fontFamily: "inherit" }} />

            <button onClick={kirimTerimaPesanan} style={{ width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 700, fontSize: "0.85rem", cursor: "pointer" }}>Konfirmasi Pesanan Diterima</button>
          </div>
        </div>
      )}
    </div>
  );
}