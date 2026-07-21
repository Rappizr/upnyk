"use client";

import { useMemo, useState, useEffect, useCallback } from "react";
import type { FormEvent } from "react";
import { supabase } from "@/lib/db";

interface ProdusenToko {
  id: string;
  namaUsaha: string;
  alamat: string;
  kabupaten: string;
  provinsi: string;
  kategori: string;
  fotoUrl?: string;
  jumlahProduk: number;
}

interface ProdukKomoditas {
  id: string;
  nama: string;
  harga: number;
  stok: number;
  satuan: string;
  fotoUrl?: string;
  deskripsi?: string;
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

interface Props {
  pembelianList: Pembelian[];
  belanjaProdusen: (
    produsenId: string,
    item: string,
    jumlah: number,
    hargaSatuan: number,
    satuan: string
  ) => void;
}

// Sub-komponen Icon
const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconMapPin = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconStore = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 9V6a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v3"></path><path d="M3 9h18l-1 4H4L3 9Z"></path><path d="M5 13v7a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-7"></path></svg>;
const IconPackage = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconClock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>;
const IconArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const IconCheckCircle = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

export default function MarketplaceProdusen({
  pembelianList,
  belanjaProdusen,
}: Props) {
  const [produsenList, setProdusenList] = useState<ProdusenToko[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [selectedProdusen, setSelectedProdusen] = useState<ProdusenToko | null>(null);
  const [katalogProduk, setKatalogProduk] = useState<ProdukKomoditas[]>([]);
  const [loadingKatalog, setLoadingKatalog] = useState(false);

  const [selectedBarang, setSelectedBarang] = useState<ProdukKomoditas | null>(null);
  const [jumlahOrder, setJumlahOrder] = useState<string>("1");
  const [submittingOrder, setSubmittingOrder] = useState(false);

  const [toast, setToast] = useState<{
    tampil: boolean;
    pesan: string;
    tipe: "sukses" | "gagal";
  }>({ tampil: false, pesan: "", tipe: "sukses" });

  const pemicuToast = useCallback((pesan: string, tipe: "sukses" | "gagal" = "sukses") => {
    setToast({ tampil: true, pesan, tipe });
  }, []);

  useEffect(() => {
    if (!toast.tampil) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, tampil: false })), 3500);
    return () => clearTimeout(timer);
  }, [toast.tampil]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProdusen(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const muatProdusen = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("produsen")
      .select(`
        id, nama_usaha, alamat, kabupaten, provinsi, kategori, foto,
        produk ( id )
      `);

    if (error) {
      console.error("Gagal memuat produsen:", error);
      pemicuToast("Gagal memuat daftar produsen", "gagal");
      setLoading(false);
      return;
    }

    const mapped: ProdusenToko[] = (data || []).map((p: any) => ({
      id: p.id,
      namaUsaha: p.nama_usaha || "UMKM Produsen",
      alamat: p.alamat || "",
      kabupaten: p.kabupaten || "",
      provinsi: p.provinsi || "",
      kategori: p.kategori || "Sektor Komoditas",
      fotoUrl: p.foto ?? undefined,
      jumlahProduk: Array.isArray(p.produk) ? p.produk.length : 0,
    }));

    setProdusenList(mapped);
    setLoading(false);
  }, [pemicuToast]);

  useEffect(() => {
    muatProdusen();
  }, [muatProdusen]);

  async function bukaModalProdusen(produsen: ProdusenToko) {
    setSelectedProdusen(produsen);
    setLoadingKatalog(true);
    setSelectedBarang(null);

    const { data, error } = await supabase
      .from("produk")
      .select("id, nama, harga, stok, satuan, foto, deskripsi")
      .eq("produsen_id", produsen.id);

    if (error) {
      console.error("Gagal memuat katalog toko:", error);
      pemicuToast("Gagal memuat katalog produk toko", "gagal");
    } else {
      const mapped: ProdukKomoditas[] = (data || []).map((p: any) => ({
        id: p.id,
        nama: p.nama,
        harga: Number(p.harga) || 0,
        stok: Number(p.stok) || 0,
        satuan: p.satuan || "pcs",
        fotoUrl: p.foto ?? undefined,
        deskripsi: p.deskripsi ?? "",
      }));
      setKatalogProduk(mapped);
    }
    setLoadingKatalog(false);
  }

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return produsenList;
    return produsenList.filter(
      (p) =>
        p.namaUsaha.toLowerCase().includes(q) ||
        p.kategori.toLowerCase().includes(q) ||
        p.kabupaten.toLowerCase().includes(q)
    );
  }, [produsenList, search]);

  const pesananMenunggu = useMemo(
    () => pembelianList.filter((p) => p.status === "Menunggu").length,
    [pembelianList]
  );

  async function handleOrderSubmit(e: FormEvent) {
    e.preventDefault();
    const qty = Number(jumlahOrder);

    if (!selectedProdusen || !selectedBarang || isNaN(qty) || qty <= 0) {
      pemicuToast("Jumlah pesanan tidak valid!", "gagal");
      return;
    }

    setSubmittingOrder(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        pemicuToast("Anda belum login!", "gagal");
        setSubmittingOrder(false);
        return;
      }

      // 1. Cari ID Admin Toko
      const { data: adminData } = await supabase
        .from("admin_toko")
        .select("id")
        .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
        .maybeSingle();

      const totalTagihan = qty * selectedBarang.harga;

      // 2. Buat Payload Pesanan
      const payloadPesanan: Record<string, any> = {
        produk_id: selectedBarang.id,
        produsen_id: selectedProdusen.id,
        jumlah: qty,
        total_harga: totalTagihan,
        total: totalTagihan,
        status: "Menunggu"
      };

      if (adminData?.id) {
        payloadPesanan.admin_toko_id = adminData.id;
        payloadPesanan.pembeli_id = adminData.id;
      }

      const { data: pesananData, error: pesananError } = await supabase
        .from("pesanan")
        .insert([payloadPesanan])
        .select("id");

      if (pesananError) {
        console.error("Gagal insert ke pesanan:", pesananError);
        pemicuToast(`Gagal: ${pesananError.message}`, "gagal");
        setSubmittingOrder(false);
        return;
      }

      const pesananBaru = pesananData?.[0];

      if (!pesananBaru?.id) {
        pemicuToast("Pesanan tersimpan, tetapi ID gagal didapatkan.", "gagal");
        setSubmittingOrder(false);
        return;
      }

      // 3. Insert ke tabel `transaksi`
      const { error: txError } = await supabase
        .from("transaksi")
        .insert({
          pesanan_id: pesananBaru.id,
          metode: "Transfer",
          total: totalTagihan,
          status: "Pending"
        });

      if (txError) {
        console.error("Gagal insert ke transaksi:", txError);
        pemicuToast("Pesanan dibuat, tetapi transaksi gagal dicatat!", "gagal");
        setSubmittingOrder(false);
        return;
      }

      // 4. Update UI lokal & Reset Modal
      belanjaProdusen(
        selectedProdusen.id,
        selectedBarang.nama,
        qty,
        selectedBarang.harga,
        selectedBarang.satuan
      );

      const namaBarang = selectedBarang.nama;
      const namaToko = selectedProdusen.namaUsaha;

      setSelectedBarang(null);
      setJumlahOrder("1");
      setSelectedProdusen(null);

      pemicuToast(`Berhasil memesan ${namaBarang} dari ${namaToko}!`, "sukses");

    } catch (err) {
      console.error("System error:", err);
      pemicuToast("Terjadi kesalahan sistem", "gagal");
    } finally {
      setSubmittingOrder(false);
    }
  }

  if (loading) {
    return (
      <div style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontFamily: "sans-serif" }}>
        Memuat Toko Produsen Binaan...
      </div>
    );
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif", position: "relative" }}>
      {toast.tampil && (
        <div
          role="alert"
          style={{
            position: "fixed",
            top: "24px",
            right: "24px",
            background: toast.tipe === "sukses" ? "#10B981" : "#EF4444",
            color: "white",
            padding: "0.85rem 1.5rem",
            borderRadius: "10px",
            fontWeight: 600,
            fontSize: "0.88rem",
            boxShadow: "0 10px 25px -5px rgba(0,0,0,0.2)",
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <IconCheckCircle /> {toast.pesan}
        </div>
      )}

      <style dangerouslySetInnerHTML={{
        __html: `
        @media (max-width: 768px) {
          main { padding: 0.5rem 0.25rem !important; }
          main h1 { font-size: 1.15rem !important; }
          main p { font-size: 0.62rem !important; line-height: 1.2 !important; }
          .marketplace-cards-grid { grid-template-columns: repeat(2, 1fr) !important; gap: 0.5rem !important; }
          .store-card { padding: 0.75rem !important; }
        }
      `
      }} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>
          Marketplace Produsen
        </h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
          Pilih mitra toko produsen binaan untuk melihat katalog komoditas yang mereka jual.
        </p>
      </div>

      {pesananMenunggu > 0 && (
        <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: "10px", padding: "0.8rem 1rem", marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "0.6rem" }}>
          <span style={{ color: "#D97706" }}><IconClock /></span>
          <span style={{ fontSize: "0.85rem", color: "#92400E" }}>
            <strong>{pesananMenunggu} pembelian</strong> menunggu konfirmasi penerimaan barang. Cek di menu Inventaris & Grading.
          </span>
        </div>
      )}

      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "420px" }}>
        <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}>
          <IconSearch />
        </span>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama toko produsen, daerah, atau kategori..."
          style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }}
        />
      </div>

      <div className="marketplace-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.25rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>
            Belum ada toko produsen yang terdaftar.
          </div>
        )}

        {filtered.map((p) => (
          <div
            key={p.id}
            className="store-card"
            onClick={() => bukaModalProdusen(p)}
            style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", padding: "1.1rem", cursor: "pointer", transition: "transform 0.2s, box-shadow 0.2s", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.06)")}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}
          >
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.8rem", marginBottom: "0.8rem" }}>
                <div style={{ width: "54px", height: "54px", borderRadius: "50%", background: "#FEF3C7", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px solid #FDE68A", flexShrink: 0 }}>
                  {p.fotoUrl ? <img src={p.fotoUrl} alt={p.namaUsaha} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconStore />}
                </div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", textOverflow: "ellipsis", overflow: "hidden", whiteSpace: "nowrap" }}>
                    {p.namaUsaha}
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "#059669", background: "#ECFDF5", padding: "0.1rem 0.4rem", borderRadius: "4px", fontWeight: 600 }}>
                    {p.kategori}
                  </span>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.78rem", color: "#64748B", marginBottom: "0.4rem" }}>
                <IconMapPin /> {[p.kabupaten, p.provinsi].filter(Boolean).join(", ") || "Lokasi fisik belum diisi"}
              </div>

              <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>
                Menyediakan <strong>{p.jumlahProduk} jenis</strong> komoditas/bahan baku
              </div>
            </div>

            <button style={{ marginTop: "1rem", width: "100%", background: "#F59E0B", color: "white", border: "none", padding: "0.55rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              Lihat Katalog Barang <IconArrowRight />
            </button>
          </div>
        ))}
      </div>

      {selectedProdusen && (
        <div onClick={() => setSelectedProdusen(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.6)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "1rem" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "16px", width: "560px", maxWidth: "100%", maxHeight: "88vh", overflowY: "auto", display: "flex", flexDirection: "column" }}>
            
            <div style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", padding: "1.25rem", color: "white", borderRadius: "16px 16px 0 0", position: "relative" }}>
              <button onClick={() => setSelectedProdusen(null)} aria-label="Tutup Modal" style={{ position: "absolute", top: "1rem", right: "1rem", background: "rgba(255,255,255,0.2)", border: "none", color: "white", borderRadius: "50%", width: "30px", height: "30px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                <IconX />
              </button>

              <div style={{ display: "flex", alignItems: "center", gap: "0.9rem" }}>
                <div style={{ width: "60px", height: "60px", borderRadius: "50%", background: "white", color: "#D97706", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "3px solid white", flexShrink: 0 }}>
                  {selectedProdusen.fotoUrl ? <img src={selectedProdusen.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconStore />}
                </div>
                <div>
                  <div style={{ fontSize: "1.15rem", fontWeight: 700 }}>{selectedProdusen.namaUsaha}</div>
                  <div style={{ fontSize: "0.8rem", opacity: 0.9 }}>📍 {[selectedProdusen.alamat, selectedProdusen.kabupaten].filter(Boolean).join(", ")}</div>
                  <span style={{ fontSize: "0.68rem", background: "rgba(255,255,255,0.25)", padding: "0.1rem 0.5rem", borderRadius: "999px", marginTop: "0.2rem", display: "inline-block" }}>
                    Sektor: {selectedProdusen.kategori}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ padding: "1.25rem", flex: 1 }}>
              <div style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.75rem" }}>
                Pilih Komoditas / Bahan Baku yang Dijual ({katalogProduk.length})
              </div>

              {loadingKatalog ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>Memuat daftar barang...</div>
              ) : katalogProduk.length === 0 ? (
                <div style={{ textAlign: "center", padding: "2rem", color: "#94A3B8" }}>Toko produsen ini belum menayangkan barang komoditas.</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
                  {katalogProduk.map((barang) => (
                    <div
                      key={barang.id}
                      style={{ border: selectedBarang?.id === barang.id ? "2px solid #F59E0B" : "1px solid #E2E8F0", background: selectedBarang?.id === barang.id ? "#FFFBEB" : "white", borderRadius: "10px", padding: "0.85rem", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "0.75rem" }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <div style={{ width: "50px", height: "50px", borderRadius: "8px", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                          {barang.fotoUrl ? <img src={barang.fotoUrl} alt={barang.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconPackage />}
                        </div>
                        <div>
                          <div style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1E293B" }}>{barang.nama}</div>
                          <div style={{ fontSize: "0.78rem", color: "#059669", fontWeight: 700 }}>
                            {formatRupiah(barang.harga)} <span style={{ color: "#64748B", fontWeight: 400 }}>/ {barang.satuan}</span>
                          </div>
                          <div style={{ fontSize: "0.7rem", color: "#94A3B8" }}>Stok Tersedia: {barang.stok} {barang.satuan}</div>
                        </div>
                      </div>

                      <button
                        onClick={() => { setSelectedBarang(barang); setJumlahOrder("1"); }}
                        style={{ background: selectedBarang?.id === barang.id ? "#D97706" : "#F59E0B", color: "white", border: "none", padding: "0.45rem 0.85rem", borderRadius: "6px", fontWeight: 600, cursor: "pointer", fontSize: "0.78rem", whiteSpace: "nowrap" }}
                      >
                        {selectedBarang?.id === barang.id ? "Dipilih" : "Beli"}
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {selectedBarang && (
                <form onSubmit={handleOrderSubmit} style={{ borderTop: "1px solid #E2E8F0", marginTop: "1rem", paddingTop: "1rem" }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>
                    Form Pemesanan: <span style={{ color: "#D97706" }}>{selectedBarang.nama}</span>
                  </div>

                  <div style={{ display: "flex", gap: "0.75rem", alignItems: "flex-end" }}>
                    <div style={{ flex: 1 }}>
                      <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 600, color: "#64748B", marginBottom: "0.25rem" }}>
                        JUMLAH ORDER ({selectedBarang.satuan.toUpperCase()}) *
                      </label>
                      <input
                        required
                        type="number"
                        min="1"
                        max={selectedBarang.stok || 9999}
                        value={jumlahOrder}
                        onChange={(e) => setJumlahOrder(e.target.value)}
                        style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>

                    <div style={{ flex: 1, background: "#F8FAFC", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #E2E8F0" }}>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>TOTAL TAGIHAN</div>
                      <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>
                        {formatRupiah((Number(jumlahOrder) || 0) * selectedBarang.harga)}
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={submittingOrder}
                      style={{
                        background: submittingOrder ? "#9CA3AF" : "#10B981",
                        color: "white",
                        border: "none",
                        padding: "0.55rem 1.1rem",
                        borderRadius: "6px",
                        fontWeight: 700,
                        cursor: submittingOrder ? "not-allowed" : "pointer",
                        fontSize: "0.85rem",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {submittingOrder ? "Mengirim..." : "Kirim Pesanan"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}