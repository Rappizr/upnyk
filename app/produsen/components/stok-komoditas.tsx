"use client";

import { useMemo, useState, useRef, useEffect, useCallback } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase, supabaseAdmin } from "@/lib/db";

type StokStatus = "Aman" | "Menipis" | "Habis";

interface Ulasan {
  pembeli: string;
  rating: number;
  komentar: string;
}

interface StokItem {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaSatuan: number;
  status: StokStatus;
  kategori: string;
  fotoUrl?: string;
  rating: number;
  totalUlasan: number;
  ulasan: Ulasan[];
}

const statusStyle: Record<StokStatus, { bg: string; color: string }> = {
  Aman: { bg: "#D1FAE5", color: "#065F46" },
  Menipis: { bg: "#FEF3C7", color: "#92400E" },
  Habis: { bg: "#FEE2E2", color: "#991B1B" },
};

const kategoriOptions = ["Makanan & Minuman", "Kerajinan & Kriya", "Fashion & Tekstil", "Bahan Baku", "Kemasan", "Lainnya"];

const IconSearch = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>;
const IconX = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconPackage = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 3 6.92 12 12 21 6.92 12 2"></polygon><line x1="12" y1="22.08" x2="12" y2="12"></line></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconWallet = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconCamera = () => <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconStar = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>;
const IconPlus = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>;
const IconCheckCircle = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}


function formatRupiahRingkas(n: number) {
  const a = isNaN(n) ? 0 : n;
  if (a >= 1000000000) return `Rp ${(a / 1000000000).toFixed(1)}M`;
  if (a >= 1000000) return `Rp ${(a / 1000000).toFixed(1)}jt`;
  if (a >= 1000) return `Rp ${Math.round(a / 1000)}rb`;
  return "Rp " + a.toLocaleString("id-ID");
}

function formatNumber(value: string) {
  const number = value.replace(/\D/g, "");
  return number.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

export default function StokKomoditas() {
  const [stokList, setStokList] = useState<StokItem[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const [prosesLoading, setProsesLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [detailItem, setDetailItem] = useState<StokItem | null>(null);
  const [detailUlasan, setDetailUlasan] = useState<Ulasan[]>([]);
  const [detailLoading, setDetailLoading] = useState(false);
  const [restockItem, setRestockItem] = useState<StokItem | null>(null);
  const [restockJumlah, setRestockJumlah] = useState(0);
  const [deleteItem, setDeleteItem] = useState<{ id: string; nama: string } | null>(null);

  const [addForm, setAddForm] = useState({ nama: "", jumlah: "", satuan: "pcs", hargaSatuan: "", kategori: kategoriOptions[0], deskripsi: "", fotoUrl: "" });
  const [fileFoto, setFileFoto] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [toast, setToast] = useState<{ tampil: boolean; pesan: string; tipe: "sukses" | "gagal" }>({
    tampil: false, pesan: "", tipe: "sukses"
  });

  const pemicuToast = useCallback((pesan: string, tipe: "sukses" | "gagal" = "sukses") => {
    setToast({ tampil: true, pesan, tipe });
  }, []);

  useEffect(() => {
    if (!toast.tampil) return;
    const timer = setTimeout(() => setToast((t) => ({ ...t, tampil: false })), 3500);
    return () => clearTimeout(timer);
  }, [toast.tampil]);

  const muatStok = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: produsen } = await supabase
      .from("produsen")
      .select("id")
      .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
      .maybeSingle();

    if (!produsen) return;

    const dbClient = supabaseAdmin || supabase;


    const { data: produkData, error: prodError } = await dbClient
      .from("produk")
      .select("*, kategori(nama)")
      .eq("produsen_id", produsen.id);

    if (prodError || !produkData || produkData.length === 0) {
      setStokList([]);
      return;
    }

    const produkIds = produkData.map((p) => p.id);

  
    const { data: pesananData } = await dbClient
      .from("pesanan")
      .select("id, produk_id, rating, ulasan, admin_toko ( nama_toko )")
      .in("produk_id", produkIds)
      .not("rating", "is", null);

 
    const ratingMap = new Map<string, { total: number; count: number; ulasan: Ulasan[] }>();

    (pesananData || []).forEach((ps: any) => {
      const pId = ps.produk_id;
      if (!pId) return;

      if (!ratingMap.has(pId)) {
        ratingMap.set(pId, { total: 0, count: 0, ulasan: [] });
      }

      const data = ratingMap.get(pId)!;
      const ratingVal = Number(ps.rating) || 0;
      data.total += ratingVal;
      data.count += 1;

      const tokoObj = Array.isArray(ps.admin_toko) ? ps.admin_toko[0] : ps.admin_toko;
      data.ulasan.push({
        pembeli: tokoObj?.nama_toko || "Admin Toko Mitra",
        rating: ratingVal,
        komentar: ps.ulasan || "Produk dalam kondisi baik dan sesuai pesanan."
      });
    });

   
    const mapped: StokItem[] = produkData.map((p: any) => {
      const stokMurni = Number(p.stok) || 0;
      const ratingData = ratingMap.get(p.id);

      let ratingAvg = 0;
      let totalUlasan = 0;
      let ulasanList: Ulasan[] = [];

      if (ratingData && ratingData.count > 0) {
        ratingAvg = ratingData.total / ratingData.count;
        totalUlasan = ratingData.count;
        ulasanList = ratingData.ulasan;
      }

      let status: StokStatus = "Aman";
      if (stokMurni <= 0) status = "Habis";
      else if (stokMurni <= 10) status = "Menipis";

      return {
        id: p.id,
        nama: p.nama,
        jumlah: stokMurni,
        satuan: p.satuan ?? "pcs",
        hargaSatuan: Number(p.harga) || 0,
        status,
        kategori: p.kategori?.nama ?? "Lainnya",
        fotoUrl: p.foto ?? undefined,
        rating: ratingAvg,
        totalUlasan: totalUlasan,
        ulasan: ulasanList
      };
    });

    setStokList(mapped);
  }, []);

  useEffect(() => {
    muatStok();

    const channel = supabase
      .channel("realtime-rating-stok")
      .on("postgres_changes", { event: "*", schema: "public", table: "pesanan" }, () => muatStok())
      .on("postgres_changes", { event: "*", schema: "public", table: "produk" }, () => muatStok())
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [muatStok]);

  const filtered = useMemo(() => {
    return stokList.filter((s) => {
      const q = search.trim().toLowerCase();
      const matchSearch = !q || s.nama.toLowerCase().includes(q) || s.id.toLowerCase().includes(q);
      const matchStatus = !statusFilter || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [stokList, search, statusFilter]);

  const totalNilaiStok = useMemo(() => stokList.reduce((s, x) => s + x.jumlah * x.hargaSatuan, 0), [stokList]);
  const totalMenipis = useMemo(() => stokList.filter((s) => s.status !== "Aman").length, [stokList]);

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileFoto(file);
    const reader = new FileReader();
    reader.onload = () => setAddForm((prev) => ({ ...prev, fotoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleAddSubmit(e: FormEvent) {
    e.preventDefault();
    if (!addForm.nama || !addForm.jumlah || prosesLoading) return;

    setProsesLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setProsesLoading(false); return; }

    const { data: produsen } = await supabase
      .from("produsen")
      .select("id")
      .or(`profile_id.eq.${user.id},id.eq.${user.id}`)
      .maybeSingle();

    if (!produsen) {
      pemicuToast("Gagal mengidentifikasi data toko produsen!", "gagal");
      setProsesLoading(false);
      return;
    }

    let finalFotoUrl = "";
    if (fileFoto) {
      const fileExt = fileFoto.name.split('.').pop();
      const fileName = `produk-${user.id}-${Math.floor(Date.now() / 1000)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("produk").upload(fileName, fileFoto, { cacheControl: '3600', upsert: true });
      if (uploadError) { pemicuToast("Gagal unggah foto produk!", "gagal"); setProsesLoading(false); return; }
      const { data: publicUrlData } = supabase.storage.from("produk").getPublicUrl(fileName);
      finalFotoUrl = publicUrlData.publicUrl;
    }

    const kataKunciKategori = addForm.kategori ? addForm.kategori.split(" ")[0] : "Lainnya";
    let { data: katData } = await supabase.from("kategori").select("id").ilike("nama", `%${kataKunciKategori}%`).limit(1).maybeSingle();
    if (!katData) {
      const { data: ambilKategoriSembarang } = await supabase.from("kategori").select("id").limit(1);
      if (ambilKategoriSembarang && ambilKategoriSembarang.length > 0) katData = ambilKategoriSembarang[0];
    }

    const hargaMurni = Number(addForm.hargaSatuan.replace(/\D/g, "")) || 0;

    const { error: prodError } = await supabase.from("produk").insert({
      produsen_id: produsen.id,
      nama: addForm.nama,
      satuan: addForm.satuan,
      harga: hargaMurni,
      stok: Number(addForm.jumlah),
      kategori_id: katData?.id ?? null,
      foto: finalFotoUrl || null,
      deskripsi: addForm.deskripsi || null
    });

    if (prodError) {
      console.error("Gagal tambah produk:", prodError);
      pemicuToast(`Gagal menayangkan produk: ${prodError.message}`, "gagal");
      setProsesLoading(false);
      return;
    }

    pemicuToast("Produk baru berhasil ditayangkan live!", "sukses");
    setAddForm({ nama: "", jumlah: "", satuan: "pcs", hargaSatuan: "", kategori: kategoriOptions[0], deskripsi: "", fotoUrl: "" });
    setFileFoto(null);
    setShowAddModal(false);
    setProsesLoading(false);
    muatStok();
  }

  async function handleRestockSubmit(e: FormEvent) {
    e.preventDefault();
    if (!restockItem || restockJumlah <= 0 || prosesLoading) return;

    setProsesLoading(true);

    const { error } = await supabase
      .from("produk")
      .update({ stok: restockItem.jumlah + restockJumlah })
      .eq("id", restockItem.id);

    if (error) {
      pemicuToast("Gagal memperbarui stok!", "gagal");
    } else {
      pemicuToast("Stok komoditas berhasil ditambahkan!", "sukses");
      setRestockItem(null);
      setRestockJumlah(0);
      muatStok();
    }
    setProsesLoading(false);
  }

  async function eksekusiHapusProduk() {
    if (!deleteItem || prosesLoading) return;
    setProsesLoading(true);

    const { error: produkError } = await supabase.from("produk").delete().eq("id", deleteItem.id);

    if (produkError) {
      pemicuToast("Gagal menghapus produk!", "gagal");
    } else {
      pemicuToast("Produk komoditas berhasil dihapus total!", "sukses");
      setDeleteItem(null);
      muatStok();
    }
    setProsesLoading(false);
  }

  return (
    <main className="stok-page" style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", position: "relative" }}>

      <style dangerouslySetInnerHTML={{__html: `
     
        .stok-page * { min-width: 0; }

        @media (max-width: 900px) {
          .stok-page { padding: 1rem 1.1rem !important; }
        }

        @media (max-width: 768px) {
          .stok-page { padding: 0.85rem 0.7rem !important; }


          .stok-header-row { gap: 0.5rem !important; margin-bottom: 1rem !important; flex-wrap: nowrap !important; align-items: flex-start !important; }
          .stok-header-text { min-width: 0 !important; flex: 1 !important; }
          .stok-header-text h1 { font-size: 1.08rem !important; }
          .stok-header-text p { font-size: 0.66rem !important; line-height: 1.3 !important; }
          .stok-btn-add { padding: 0.45rem 0.6rem !important; font-size: 0.68rem !important; border-radius: 8px !important; white-space: nowrap !important; flex-shrink: 0 !important; }
          .stok-btn-add svg { width: 10px !important; height: 10px !important; }

        
          .stok-stats-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 0.45rem !important; margin-bottom: 1rem !important; }
          .stok-stat-card { flex-direction: column !important; align-items: flex-start !important; gap: 0.4rem !important; padding: 0.6rem 0.5rem !important; border-radius: 10px !important; }
          .stok-stat-icon { padding: 0.32rem !important; border-radius: 8px !important; }
          .stok-stat-icon svg { width: 15px !important; height: 15px !important; }
          .stok-stat-value { font-size: clamp(0.8rem, 3.8vw, 1.05rem) !important; line-height: 1.15 !important; letter-spacing: -0.02em !important; overflow-wrap: anywhere !important; }
          .stok-stat-label { font-size: 0.58rem !important; line-height: 1.2 !important; }

        
          .stok-filter-bar { padding: 0.6rem !important; border-radius: 10px !important; gap: 0.45rem !important; margin-bottom: 1rem !important; }
          .stok-filter-bar input, .stok-filter-bar select { font-size: 0.78rem !important; padding: 0.5rem 0.6rem !important; border-radius: 8px !important; }
          .stok-filter-bar input { padding-left: 2.1rem !important; }
          .stok-filter-bar select { flex: 1 1 0 !important; }

         
          .stok-cards-grid { grid-template-columns: repeat(3, minmax(0,1fr)) !important; gap: 0.45rem !important; }
          .stok-main-card { border-radius: 10px !important; }
          .stok-card-photo { height: 72px !important; }
          .stok-card-photo svg { width: 20px !important; height: 20px !important; }
          .stok-card-body { padding: 0.5rem 0.45rem !important; }
          .stok-title-container { flex-direction: column !important; align-items: flex-start !important; gap: 0.2rem !important; margin-bottom: 0.25rem !important; }
          .stok-card-name { font-size: 0.68rem !important; line-height: 1.25 !important; overflow-wrap: anywhere !important; }
          .stok-card-badge { font-size: 0.55rem !important; padding: 0.1rem 0.35rem !important; border-radius: 4px !important; }
          .stok-meta-text { font-size: 0.55rem !important; margin-bottom: 0.25rem !important; overflow-wrap: anywhere !important; }
          .stok-data-text { font-size: 0.6rem !important; line-height: 1.3 !important; margin-bottom: 0.25rem !important; overflow-wrap: anywhere !important; }
          .stok-rating-container { font-size: 0.58rem !important; gap: 2px !important; margin-bottom: 0.45rem !important; }
          .stok-rating-container svg { width: 10px !important; height: 10px !important; }
          .stok-actions-row { flex-direction: column !important; gap: 0.25rem !important; }
          .stok-actions-row button { width: 100% !important; flex: none !important; padding: 0.3rem 0.2rem !important; font-size: 0.6rem !important; border-radius: 5px !important; }

        
          .stok-modal { border-radius: 14px !important; max-height: 88vh !important; overflow-y: auto !important; }
          .stok-modal-pad { padding: 1rem 0.9rem !important; }
          .stok-modal h2 { font-size: 0.98rem !important; }
          .stok-modal input, .stok-modal select, .stok-modal textarea { font-size: 0.82rem !important; padding: 0.5rem 0.65rem !important; }
        }

        @media (max-width: 380px) {
          .stok-stats-grid { gap: 0.3rem !important; }
          .stok-stat-card { padding: 0.5rem 0.4rem !important; }
          .stok-cards-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
        }
      `}} />

      {toast.tampil && (
        <div style={{ position: "fixed", top: "24px", right: "24px", background: toast.tipe === "sukses" ? "#10B981" : "#EF4444", color: "white", padding: "0.8rem 1.5rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)", zIndex: 9999, display: "flex", alignItems: "center", gap: "8px" }}>
          <IconCheckCircle /> {toast.pesan}
        </div>
      )}

      <div className="stok-header-row" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", width: "100%", gap: "1rem" }}>
        <div className="stok-header-text">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Stok Komoditas</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Kelola persediaan produk dan bahan baku produksi kamu.</p>
        </div>
        <button className="stok-btn-add" onClick={() => setShowAddModal(true)} style={{ background: "#10B981", color: "white", border: "none", padding: "0.6rem 1.15rem", borderRadius: "8px", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem", display: "flex", alignItems: "center", gap: "4px" }}><IconPlus /> Tambah Produk Baru</button>
      </div>

      <div className="stok-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div className="stok-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div className="stok-stat-icon" style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconPackage /></div>
          <div><div className="stok-stat-value" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{stokList.length}</div><div className="stok-stat-label" style={{ fontSize: "0.78rem", color: "#64748B" }}>Jenis Produk</div></div>
        </div>
        <div className="stok-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div className="stok-stat-icon" style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWallet /></div>
          <div><div className="stok-stat-value" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalNilaiStok)}</div><div className="stok-stat-label" style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Nilai Stok</div></div>
        </div>
        <div className="stok-stat-card" style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div className="stok-stat-icon" style={{ background: "#FEE2E2", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div className="stok-stat-value" style={{ fontSize: "1.3rem", fontWeight: 700, color: "#1E293B" }}>{totalMenipis}</div><div className="stok-stat-label" style={{ fontSize: "0.78rem", color: "#64748B" }}>Perlu Restock</div></div>
        </div>
      </div>

      <div className="stok-filter-bar" style={{ background: "white", padding: "1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", gap: "1rem", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap" }}>
        <div style={{ position: "relative", flex: 1, minWidth: "200px" }}>
          <span style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8", display: "flex" }}><IconSearch /></span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Cari nama produk atau kode..." style={{ width: "100%", padding: "0.5rem 1rem 0.5rem 2.25rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white", color: "#334155" }}>
          <option value="">Semua Status</option>
          <option value="Aman">Aman</option>
          <option value="Menipis">Menipis</option>
          <option value="Habis">Habis</option>
        </select>
      </div>

      <div className="stok-cards-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(230px, 1fr))", gap: "1rem" }}>
        {filtered.length === 0 && (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>Tidak ada stok yang cocok.</div>
        )}
        {filtered.map((item) => {
          const s = statusStyle[item.status];
          return (
            <div key={item.id} className="stok-main-card" style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", overflow: "hidden" }}>
              <div className="stok-card-photo" style={{ height: "110px", background: item.fotoUrl ? undefined : "#F0FDF9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
                {item.fotoUrl ? <img src={item.fotoUrl} alt={item.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <IconPackage />}
              </div>
              <div className="stok-card-body" style={{ padding: "0.9rem" }}>
                <div className="stok-title-container" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem", marginBottom: "0.3rem" }}>
                  <div className="stok-card-name" style={{ fontSize: "0.92rem", fontWeight: 700, color: "#1E293B" }}>{item.nama}</div>
                  <span className="stok-card-badge" style={{ background: s.bg, color: s.color, padding: "0.15rem 0.5rem", borderRadius: "6px", fontSize: "0.68rem", fontWeight: 600, whiteSpace: "nowrap" }}>{item.status}</span>
                </div>
                <div className="stok-meta-text" style={{ fontSize: "0.75rem", color: "#94A3B8", marginBottom: "0.4rem" }}>{item.id.slice(0, 8)}... • {item.kategori}</div>
                <div className="stok-data-text" style={{ fontSize: "0.85rem", color: "#334155", marginBottom: "0.3rem" }}>{item.jumlah} {item.satuan} · {formatRupiah(item.hargaSatuan)}/{item.satuan}</div>

                <div className="stok-rating-container" style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "0.75rem", color: "#D97706", marginBottom: "0.75rem" }}>
                  <IconStar />
                  {item.rating > 0 ? item.rating.toFixed(1) : "0.0"}
                  <span style={{ color: "#94A3B8" }}>({item.totalUlasan} ulasan)</span>
                </div>

                <div className="stok-actions-row" style={{ display: "flex", gap: "0.4rem" }}>
                  <button onClick={async () => {
                    setDetailItem(item);
                    setDetailUlasan(item.ulasan);
                    setDetailLoading(true);
                    try {
                      const dbC = supabaseAdmin || supabase;
                      const { data: pes1 } = await dbC.from("pesanan")
                        .select("id, produk_id, rating, ulasan, admin_toko(nama_toko)")
                        .eq("produk_id", item.id).not("rating", "is", null);

                      const freshUlasan: Ulasan[] = (pes1 || []).map((ps: any) => {
                        const tokoObj = Array.isArray(ps.admin_toko) ? ps.admin_toko[0] : ps.admin_toko;
                        return {
                          pembeli: tokoObj?.nama_toko || "Admin Toko Mitra",
                          rating: Number(ps.rating) || 5,
                          komentar: ps.ulasan || "Produk dalam kondisi baik."
                        };
                      });
                      if (freshUlasan.length > 0) setDetailUlasan(freshUlasan);
                    } finally {
                      setDetailLoading(false);
                    }
                  }} style={{ flex: 1, background: "#ECFDF5", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: "#059669", fontWeight: 600, cursor: "pointer" }}>Detail</button>
                  <button onClick={() => { setRestockItem(item); setRestockJumlah(0); }} style={{ flex: 1, background: "#EFF6FF", border: "none", padding: "0.4rem", borderRadius: "6px", fontSize: "0.76rem", color: "#2563EB", fontWeight: 600, cursor: "pointer" }}>Restock</button>
                  <button onClick={() => setDeleteItem({ id: item.id, nama: item.nama })} style={{ background: "#FEE2E2", border: "none", padding: "0.4rem 0.6rem", borderRadius: "6px", fontSize: "0.76rem", color: "#991B1B", cursor: "pointer" }}>Hapus</button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div onClick={() => !prosesLoading && setShowAddModal(false)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="stok-modal" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", width: "440px", maxWidth: "100%", maxHeight: "88vh", overflowY: "auto" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "1rem 1.25rem", borderBottom: "1px solid #F1F5F9" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}><IconPackage /> Form Tambah Produk Baru</div>
              <button disabled={prosesLoading} onClick={() => setShowAddModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>
            <form onSubmit={handleAddSubmit} className="stok-modal-pad" style={{ padding: "1.1rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>FOTO PRODUK</label>
                <div onClick={() => !prosesLoading && fileRef.current?.click()} style={{ border: "1.5px dashed #A7F3D0", background: "#F0FDF9", borderRadius: "10px", height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                  {addForm.fotoUrl ? (
                    <img src={addForm.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <>
                      <span style={{ color: "#10B981" }}><IconCamera /></span>
                      <span style={{ fontSize: "0.75rem", fontWeight: 600, color: "#059669", marginTop: "0.3rem" }}>Klik untuk unggah foto utama</span>
                    </>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>NAMA PRODUK *</label>
                <input required disabled={prosesLoading} value={addForm.nama} onChange={(e) => setAddForm({ ...addForm, nama: e.target.value })} placeholder="Contoh: Keripik Tempe Original" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "0.6rem" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>HARGA JUAL (RP) *</label>
                  <input required disabled={prosesLoading} type="text" inputMode="numeric" value={formatNumber(addForm.hargaSatuan)} onChange={(e) => setAddForm({ ...addForm, hargaSatuan: e.target.value.replace(/\D/g, "") })} placeholder="45.000" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>KUANTITAS STOK *</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <input required disabled={prosesLoading} type="number" min="0" value={addForm.jumlah} onChange={(e) => setAddForm({ ...addForm, jumlah: e.target.value })} placeholder="100" style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", boxSizing: "border-box" }} />
                    <select disabled={prosesLoading} value={addForm.satuan} onChange={(e) => setAddForm({ ...addForm, satuan: e.target.value })} style={{ padding: "0.55rem 0.4rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white" }}>
                      <option value="kg">kg</option>
                      <option value="pcs">pcs</option>
                      <option value="liter">liter</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>KATEGORI KOMODITAS</label>
                <select disabled={prosesLoading} value={addForm.kategori} onChange={(e) => setAddForm({ ...addForm, kategori: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", background: "white", boxSizing: "border-box" }}>
                  {kategoriOptions.map((k) => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", letterSpacing: ".03em", marginBottom: "0.4rem" }}>DESKRIPSI &amp; CATATAN</label>
                <textarea disabled={prosesLoading} value={addForm.deskripsi} onChange={(e) => setAddForm({ ...addForm, deskripsi: e.target.value })} placeholder="Tuliskan spesifikasi produk di sini..." rows={3} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", fontFamily: "inherit", resize: "vertical", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.3rem" }}>
                <button type="button" disabled={prosesLoading} onClick={() => setShowAddModal(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
                <button type="submit" disabled={prosesLoading} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: prosesLoading ? "#A7F3D0" : "#10B981", color: "white", fontWeight: 600, cursor: prosesLoading ? "not-allowed" : "pointer" }}>
                  {prosesLoading ? "Memproses..." : "Tayangkan Produk (Live)"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {detailItem && (
        <div onClick={() => setDetailItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="stok-modal" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", width: "420px", maxWidth: "100%", maxHeight: "85vh", overflowY: "auto" }}>
            <div style={{ height: "140px", background: detailItem.fotoUrl ? undefined : "#F0FDF9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", borderRadius: "14px 14px 0 0" }}>
              {detailItem.fotoUrl ? <img src={detailItem.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#A7F3D0" }}><IconPackage /></span>}
            </div>
            <div className="stok-modal-pad" style={{ padding: "1.1rem 1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "0.5rem" }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: "1.05rem", fontWeight: 700, color: "#1E293B", overflowWrap: "anywhere" }}>{detailItem.nama}</div>
                  <div style={{ fontSize: "0.78rem", color: "#94A3B8" }}>{detailItem.id.slice(0, 8)} • {detailItem.kategori}</div>
                </div>
                <button onClick={() => setDetailItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", flexShrink: 0 }}><IconX /></button>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem", margin: "1rem 0" }}>
                <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>STOK</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B" }}>{detailItem.jumlah} {detailItem.satuan}</div>
                </div>
                <div style={{ background: "#F8FAFC", borderRadius: "8px", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.65rem", color: "#94A3B8", fontWeight: 700 }}>HARGA</div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: "#1E293B", overflowWrap: "anywhere" }}>{formatRupiah(detailItem.hargaSatuan)}</div>
                </div>
              </div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.5rem" }}>Ulasan Pembeli ({detailLoading ? "..." : detailUlasan.length})</div>
              {detailLoading ? (
                <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Memuat ulasan...</p>
              ) : detailUlasan.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "#94A3B8" }}>Belum ada ulasan untuk produk ini.</p>
              ) : (
                detailUlasan.map((u, i) => (
                  <div key={i} style={{ padding: "0.5rem 0", borderBottom: i < detailUlasan.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: "0.4rem" }}>
                      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: "#1E293B", overflowWrap: "anywhere" }}>{u.pembeli}</span>
                      <span style={{ color: "#D97706", fontSize: "0.75rem", whiteSpace: "nowrap" }}>{"★".repeat(Math.round(u.rating))}{"☆".repeat(5 - Math.round(u.rating))}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748B" }}>{u.komentar}</div>
                  </div>
                ))
              )}
              <button onClick={() => { setDetailItem(null); setDetailUlasan([]); }} style={{ marginTop: "1.1rem", width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Tutup</button>
            </div>
          </div>
        </div>
      )}

      {restockItem && (
        <div onClick={() => !prosesLoading && setRestockItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "1rem" }}>
          <div className="stok-modal stok-modal-pad" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem", gap: "0.5rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.02rem", fontWeight: 700, color: "#1E293B", overflowWrap: "anywhere" }}>Restock {restockItem.nama}</h2>
              <button disabled={prosesLoading} onClick={() => setRestockItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8", flexShrink: 0 }}><IconX /></button>
            </div>
            <p style={{ margin: "0 0 1rem 0", fontSize: "0.8rem", color: "#94A3B8" }}>Stok saat ini: {restockItem.jumlah} {restockItem.satuan}</p>
            <form onSubmit={handleRestockSubmit}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jumlah tambahan ({restockItem.satuan})</label>
              <input required disabled={prosesLoading} type="number" min="1" value={restockJumlah || ""} onChange={(e) => setRestockJumlah(Number(e.target.value))} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.88rem", outline: "none", marginBottom: "1rem", boxSizing: "border-box" }} />
              <button type="submit" disabled={prosesLoading} style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: prosesLoading ? "#A7F3D0" : "#10B981", color: "white", fontWeight: 600, cursor: prosesLoading ? "not-allowed" : "pointer" }}>
                {prosesLoading ? "Memproses..." : "Tambahkan ke Stok"}
              </button>
            </form>
          </div>
        </div>
      )}

      {deleteItem && (
        <div onClick={() => !prosesLoading && setDeleteItem(null)} style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1100, padding: "1rem" }}>
          <div className="stok-modal stok-modal-pad" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.5rem", width: "360px", maxWidth: "100%", textAlign: "center" }}>
            <div style={{ color: "#EF4444", marginBottom: "0.5rem" }}><IconAlert /></div>
            <h2 style={{ margin: "0 0 0.5rem 0", fontSize: "1.05rem", fontWeight: 700, color: "#1E293B" }}>Konfirmasi Hapus Produk</h2>
            <p style={{ margin: "0 0 1.25rem 0", fontSize: "0.85rem", color: "#64748B", lineHeight: "1.4" }}>Apakah Anda yakin ingin menghapus stok produk <strong style={{ color: "#1E293B" }}>&quot;{deleteItem.nama}&quot;</strong>? Aksi ini akan menghapus data permanen dari database PasarNusa.</p>
            <div style={{ display: "flex", gap: "0.5rem" }}>
              <button type="button" disabled={prosesLoading} onClick={() => setDeleteItem(null)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Batal</button>
              <button type="button" disabled={prosesLoading} onClick={eksekusiHapusProduk} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: prosesLoading ? "#FCA5A5" : "#EF4444", color: "white", fontWeight: 600, cursor: prosesLoading ? "not-allowed" : "pointer", fontSize: "0.85rem" }}>
                {prosesLoading ? "Menghapus..." : "Ya, Hapus"}
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}