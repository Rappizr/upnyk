"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/db";

type Grade = "A" | "B" | "C" | "Belum Dinilai";

export interface StokToko {
  id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  berat?: number; 
  grade: Grade;
  asalProdusen: string;
  live: boolean;
  foto?: string | null;
  deskripsi?: string;
  rating?: number;       
  totalUlasan?: number; 
  produk_id?: string;
}

interface Props {
  stokList?: StokToko[];
  updateStok?: (id: string, patch: Partial<StokToko>) => void;
  onTambahProdukBaru?: (itemBaru: StokToko) => void;
}

const IconEye = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);
const IconTag = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M20.59 13.41 11 3.83A2 2 0 0 0 9.5 3H4a1 1 0 0 0-1 1v5.5a2 2 0 0 0 .83 1.5l9.58 9.59a2 2 0 0 0 2.83 0l4.35-4.35a2 2 0 0 0 0-2.83Z"></path>
  </svg>
);
const IconX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);
const IconPlus = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <line x1="5" y1="12" x2="19" y2="12"></line>
  </svg>
);
const IconCamera = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path>
    <circle cx="12" cy="13" r="4"></circle>
  </svg>
);
const IconStar = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B" stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
  </svg>
);
const IconCheckCircle = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

function formatRupiah(n: number) {
  return "Rp " + (isNaN(n) ? 0 : n).toLocaleString("id-ID");
}

function hargaSetelahDiskon(harga: number, diskon: number) {
  return Math.round(harga * (1 - diskon / 100));
}

function formatInputRupiah(value: string) {
  const angka = value.replace(/\D/g, "");
  return angka ? Number(angka).toLocaleString("id-ID") : "";
}

function unformatInputRupiah(value: string) {
  return value.replace(/\./g, "");
}

async function kompresGambar(base64Data: string, maxDimensi = 600, kualitas = 0.7): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Data;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > maxDimensi) {
        height = Math.round((height * maxDimensi) / width);
        width = maxDimensi;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx?.drawImage(img, 0, 0, width, height);

      resolve(canvas.toDataURL("image/jpeg", kualitas));
    };
    img.onerror = () => resolve(base64Data);
  });
}

function parseBeratFromEtalase(e: any): number {
  if (typeof e?.berat === "number" && e.berat > 0) return e.berat;
  if (typeof e?.berat_kg === "number" && e.berat_kg > 0) return e.berat_kg;
  if (e?.deskripsi) {
    const match = String(e.deskripsi).match(/\[BERAT:([\d.]+)(?:kg)?\]/i);
    if (match && match[1]) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 1.0;
}

function formatDeskripsiWithBerat(rawDeskripsi: string, beratVal: number): string {
  const clean = (rawDeskripsi || "").replace(/\[BERAT:[\d.]+(?:kg)?\]/gi, "").trim();
  return `[BERAT:${beratVal}kg] ${clean}`.trim();
}

function getCleanDeskripsiText(rawDeskripsi?: string): string {
  if (!rawDeskripsi) return "";
  return rawDeskripsi.replace(/\[BERAT:[\d.]+(?:kg)?\]/gi, "").trim();
}

async function safeInsertEtalase(payload: any) {
  const copy = { ...payload };
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from("etalase").insert(copy);
    if (!error) return null;

    const match1 = error.message?.match(/Could not find the '([^']+)' column/i);
    const match2 = error.message?.match(/column "?(?:[a-zA-Z0-9_]+\.)?([^"' ]+)"? does not exist/i);
    const missingCol = match1?.[1] || match2?.[1];

    if (missingCol && copy.hasOwnProperty(missingCol)) {
      delete copy[missingCol];
    } else {
      return error;
    }
  }
  const { error: finalErr } = await supabase.from("etalase").insert(copy);
  return finalErr;
}

async function safeUpdateEtalase(id: string, payload: any) {
  const copy = { ...payload };
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from("etalase").update(copy).eq("id", id);
    if (!error) return null;

    const match1 = error.message?.match(/Could not find the '([^']+)' column/i);
    const match2 = error.message?.match(/column "?(?:[a-zA-Z0-9_]+\.)?([^"' ]+)"? does not exist/i);
    const missingCol = match1?.[1] || match2?.[1];

    if (missingCol && copy.hasOwnProperty(missingCol)) {
      delete copy[missingCol];
    } else {
      return error;
    }
  }
  const { error: finalErr } = await supabase.from("etalase").update(copy).eq("id", id);
  return finalErr;
}

async function safeInsertInventaris(payload: any) {
  const copy = { ...payload };
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from("inventaris").insert(copy);
    if (!error) return null;

    const match1 = error.message?.match(/Could not find the '([^']+)' column/i);
    const match2 = error.message?.match(/column "?(?:[a-zA-Z0-9_]+\.)?([^"' ]+)"? does not exist/i);
    const missingCol = match1?.[1] || match2?.[1];

    if (missingCol && copy.hasOwnProperty(missingCol)) {
      delete copy[missingCol];
    } else {
      return error;
    }
  }
  const { error: finalErr } = await supabase.from("inventaris").insert(copy);
  return finalErr;
}

async function safeUpdateInventaris(id: string, payload: any) {
  const copy = { ...payload };
  for (let i = 0; i < 5; i++) {
    const { error } = await supabase.from("inventaris").update(copy).eq("id", id);
    if (!error) return null;

    const match1 = error.message?.match(/Could not find the '([^']+)' column/i);
    const match2 = error.message?.match(/column "?(?:[a-zA-Z0-9_]+\.)?([^"' ]+)"? does not exist/i);
    const missingCol = match1?.[1] || match2?.[1];

    if (missingCol && copy.hasOwnProperty(missingCol)) {
      delete copy[missingCol];
    } else {
      return error;
    }
  }
  const { error: finalErr } = await supabase.from("inventaris").update(copy).eq("id", id);
  return finalErr;
}

export default function EtalasePenjualan({ stokList = [], updateStok, onTambahProdukBaru }: Props) {
  const [itemsEtalase, setItemsEtalase] = useState<StokToko[]>([]);
  const [loading, setLoading] = useState(true);

  const [editItem, setEditItem] = useState<StokToko | null>(null);
  const [editForm, setEditForm] = useState({ hargaJual: "", diskonPersen: "", berat: "1.0", deskripsi: "" });

  const [showAddModal, setShowAddModal] = useState(false);
  const [modeTambah, setModeTambah] = useState<"gudang" | "baru">("baru");
  const [submitting, setSubmitting] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  function showToast(msg: string) {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  }

  const [selectedStokId, setSelectedStokId] = useState("");
  const [addGudangForm, setAddGudangForm] = useState({ hargaJual: "", diskonPersen: "0", berat: "1.0", deskripsi: "" });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const [formBaru, setFormBaru] = useState({
    nama: "",
    jumlah: "",
    satuan: "pcs",
    hargaBeli: "",
    hargaJual: "",
    diskonPersen: "0",
    berat: "1.0",
    deskripsi: "",
  });

  const muatDataEtalase = useCallback(async () => {
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      let adminTokoId: string | null = null;
      if (user) {
        const { data: adminToko } = await supabase
          .from("admin_toko")
          .select("id")
          .eq("profile_id", user.id)
          .maybeSingle();
        if (adminToko) adminTokoId = adminToko.id;
      }

      if (!adminTokoId && typeof window !== "undefined") {
        const localUserId = localStorage.getItem("supabase_user_id");
        if (localUserId) {
          const { data: adminToko } = await supabase
            .from("admin_toko")
            .select("id")
            .or(`id.eq.${localUserId},profile_id.eq.${localUserId}`)
            .maybeSingle();
          if (adminToko) adminTokoId = adminToko.id;
        }
      }

      let etalaseQuery = supabase.from("etalase").select("*").order("created_at", { ascending: false });
      if (adminTokoId) {
        etalaseQuery = etalaseQuery.eq("admin_toko_id", adminTokoId);
      }

      const { data: etalaseData, error } = await etalaseQuery;
      if (error) throw error;

      let invMap = new Map();
      if (adminTokoId) {
        const { data: invData } = await supabase
          .from("inventaris")
          .select("id, produk_id, nama_produk, stok")
          .eq("admin_toko_id", adminTokoId);

        if (invData) {
          invData.forEach((inv) => {
            if (inv.produk_id) invMap.set(inv.produk_id, Number(inv.stok));
            if (inv.nama_produk) invMap.set(inv.nama_produk.toLowerCase().trim(), Number(inv.stok));
          });
        }
      }

      if (etalaseData && etalaseData.length > 0) {
        const mapped: StokToko[] = etalaseData.map((e: any) => {
          const namaKey = (e.nama_produk || "").toLowerCase().trim();
          const stokRiil = invMap.has(e.produk_id) 
            ? invMap.get(e.produk_id) 
            : invMap.has(namaKey) 
              ? invMap.get(namaKey) 
              : (Number(e.stok) || 0);

          return {
            id: e.id,
            produk_id: e.produk_id,
            nama: e.nama_produk || "Produk Etalase",
            jumlah: stokRiil,
            satuan: e.satuan || "pcs",
            hargaBeli: 0,
            hargaJual: Number(e.harga_jual) || 0,
            diskonPersen: Number(e.diskon_persen) || 0,
            berat: parseBeratFromEtalase(e),
            grade: "A",
            asalProdusen: "Gudang Toko",
            live: e.status === "tayang" || Boolean(e.status),
            foto: e.foto || null,
            deskripsi: getCleanDeskripsiText(e.deskripsi),
            rating: Number(e.rating) || 0,
            totalUlasan: Number(e.total_ulasan) || Number(e.total_review) || 0,
          };
        });

        setItemsEtalase(mapped);
      } else {
        setItemsEtalase([]);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    muatDataEtalase();

    const channel = supabase
      .channel("realtime-etalase-sync")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "inventaris" },
        () => {
          muatDataEtalase();
        }
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "etalase" },
        () => {
          muatDataEtalase();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [muatDataEtalase]);

  const live = useMemo(() => itemsEtalase.filter((s) => s.live), [itemsEtalase]);
  const belumLive = useMemo(() => itemsEtalase.filter((s) => !s.live), [itemsEtalase]);

  async function toggleStatusLive(id: string, currentLive: boolean) {
    const nextStatus = currentLive ? "draft" : "tayang";

    setItemsEtalase((prev) => prev.map((i) => (i.id === id ? { ...i, live: !currentLive } : i)));

    await supabase.from("etalase").update({ status: nextStatus }).eq("id", id);

    showToast(`Status produk diubah menjadi ${nextStatus === "tayang" ? "Tayang Live" : "Draft"}`);
  }

  function openEdit(item: StokToko) {
    setEditItem(item);
    setEditForm({
      hargaJual: String(item.hargaJual),
      diskonPersen: String(item.diskonPersen),
      berat: String(item.berat ?? 1.0),
      deskripsi: getCleanDeskripsiText(item.deskripsi),
    });
  }

  async function handleSubmitEdit(e: FormEvent) {
    e.preventDefault();
    if (!editItem) return;

    const hargaJualVal = Number(editForm.hargaJual) || editItem.hargaJual;
    const diskonVal = Math.min(90, Math.max(0, Number(editForm.diskonPersen) || 0));
    const beratVal = Math.max(0.01, Number(editForm.berat) || editItem.berat || 1);
    const formattedDeskripsi = formatDeskripsiWithBerat(editForm.deskripsi, beratVal);

    const err = await safeUpdateEtalase(editItem.id, {
      harga_jual: hargaJualVal,
      diskon_persen: diskonVal,
      berat: beratVal,
      deskripsi: formattedDeskripsi,
    });

    if (err) {
      showToast(`Gagal memperbarui etalase: ${err.message}`);
      return;
    }

    setItemsEtalase((prev) =>
      prev.map((item) =>
        item.id === editItem.id
          ? { ...item, hargaJual: hargaJualVal, diskonPersen: diskonVal, berat: beratVal, deskripsi: editForm.deskripsi }
          : item
      )
    );

    showToast(`Harga & informasi ${editItem.nama} berhasil diperbarui!`);
    setEditItem(null);
  }

  function handleFotoSelect(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async () => {
      const rawBase64 = reader.result as string;
      const compressed = await kompresGambar(rawBase64);
      setFotoPreview(compressed);
    };
    reader.readAsDataURL(file);
  }

  async function handleTayangkanDariGudang(e: FormEvent) {
    e.preventDefault();
    if (!selectedStokId || submitting) return;

    setSubmitting(true);
    try {
      const item = stokList.find((s) => s.id === selectedStokId);
      if (!item) {
        setSubmitting(false);
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (!adminToko) throw new Error("Admin toko tidak ditemukan.");

      const hargaJualVal = Number(addGudangForm.hargaJual) || item.hargaJual;
      const diskonVal = Math.min(90, Math.max(0, Number(addGudangForm.diskonPersen) || 0));
      const beratVal = Math.max(0.01, Number(addGudangForm.berat) || item.berat || 1);
      const rawDesk = addGudangForm.deskripsi || item.deskripsi || "Produk bahan baku segar dan terjamin.";
      const formattedDesk = formatDeskripsiWithBerat(rawDesk, beratVal);

      const { data: existingEtalase } = await supabase
        .from("etalase")
        .select("id")
        .eq("admin_toko_id", adminToko.id)
        .ilike("nama_produk", item.nama)
        .maybeSingle();

      if (existingEtalase) {
        const errUpdate = await safeUpdateEtalase(existingEtalase.id, {
          stok: item.jumlah,
          harga_jual: hargaJualVal > 0 ? hargaJualVal : undefined,
          diskon_persen: diskonVal,
          berat: beratVal,
          deskripsi: formattedDesk,
          status: "tayang",
        });

        if (errUpdate) throw errUpdate;
        showToast(`Stok "${item.nama}" di Etalase berhasil diperbarui menjadi ${item.jumlah} pcs!`);
      } else {
        const errInsert = await safeInsertEtalase({
          admin_toko_id: adminToko.id,
          produk_id: item.produk_id || null,
          nama_produk: item.nama,
          stok: item.jumlah,
          satuan: "pcs",
          harga_jual: hargaJualVal,
          diskon_persen: diskonVal,
          berat: beratVal,
          deskripsi: formattedDesk,
          foto: item.foto || null,
          status: "tayang",
        });

        if (errInsert) throw errInsert;
        showToast(`Produk "${item.nama}" berhasil diterbitkan ke Etalase!`);
      }

      closeModalTambah();
      await muatDataEtalase();
    } catch (err: any) {
      showToast(`Gagal menerbitkan etalase: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleBuatProdukBaru(e: FormEvent) {
    e.preventDefault();
    if (!formBaru.nama.trim() || submitting) return;

    setSubmitting(true);
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      const { data: adminToko } = await supabase
        .from("admin_toko")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();

      if (!adminToko) {
        showToast("⚠️ Data Admin Toko belum terdaftar!");
        setSubmitting(false);
        return;
      }

      const hargaJualVal = Number(formBaru.hargaJual) || 0;
      const hargaBeliVal = Number(formBaru.hargaBeli) || 0;
      const stokVal = Number(formBaru.jumlah) || 1;
      const diskonVal = Math.min(90, Math.max(0, Number(formBaru.diskonPersen) || 0));
      const beratVal = Math.max(0.01, Number(formBaru.berat) || 1);
      const formattedDesk = formatDeskripsiWithBerat(formBaru.deskripsi.trim() || "Produk berkualitas tinggi.", beratVal);

      let finalFoto = fotoPreview;
      if (finalFoto && finalFoto.length > 300000) {
        finalFoto = await kompresGambar(finalFoto);
      }

      const { data: existingInv } = await supabase
        .from("inventaris")
        .select("id, stok")
        .eq("admin_toko_id", adminToko.id)
        .ilike("nama_produk", formBaru.nama.trim())
        .maybeSingle();

      if (existingInv) {
        const errUpdate = await safeUpdateInventaris(existingInv.id, {
          stok: (Number(existingInv.stok) || 0) + stokVal,
          harga_beli: hargaBeliVal > 0 ? hargaBeliVal : undefined,
          berat: beratVal,
          updated_at: new Date().toISOString(),
        });

        if (errUpdate) throw errUpdate;
      } else {
        const errInv = await safeInsertInventaris({
          admin_toko_id: adminToko.id,
          nama_produk: formBaru.nama.trim(),
          stok: stokVal,
          harga_beli: hargaBeliVal,
          satuan: "pcs",
          berat: beratVal,
          stok_minimum: 5,
          stok_maksimum: 100,
          lokasi_rak: "Gudang Utama",
          grade: "A",
          updated_at: new Date().toISOString(),
        });

        if (errInv) throw new Error(`Gagal simpan ke inventaris: ${errInv.message}`);
      }

      const errEtalase = await safeInsertEtalase({
        admin_toko_id: adminToko.id,
        produk_id: null,
        nama_produk: formBaru.nama.trim(),
        harga_jual: hargaJualVal,
        stok: stokVal,
        satuan: "pcs",
        diskon_persen: diskonVal,
        berat: beratVal,
        deskripsi: formattedDesk,
        foto: finalFoto || null,
        status: "tayang",
        rating: 0,
        total_ulasan: 0,
      });

      if (errEtalase) throw new Error(`Gagal simpan ke etalase: ${errEtalase.message}`);

      showToast(`Produk "${formBaru.nama}" berhasil disimpan ke Inventaris & Etalase!`);
      closeModalTambah();
      await muatDataEtalase();
    } catch (err: any) {
      showToast(`Gagal menyimpan produk: ${err.message || "Terjadi kesalahan"}`);
    } finally {
      setSubmitting(false);
    }
  }

  function closeModalTambah() {
    setShowAddModal(false);
    setSelectedStokId("");
    setFotoPreview(null);
    setAddGudangForm({ hargaJual: "", diskonPersen: "0", berat: "1.0", deskripsi: "" });
    setFormBaru({
      nama: "",
      jumlah: "",
      satuan: "pcs",
      hargaBeli: "",
      hargaJual: "",
      diskonPersen: "0",
      berat: "1.0",
      deskripsi: "",
    });
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", fontFamily: "sans-serif", position: "relative" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        /* STYLES RESPONSIP KHUSUS HP & TABLET */
        .showcase-stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(190px, 1fr));
          gap: 1rem;
        }
        .showcase-cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 1rem;
        }

        @media (max-width: 768px) {
          main {
            padding: 0.5rem 0.25rem !important;
          }
          .header-title-container h1 {
            font-size: 1.15rem !important;
          }
          .header-title-container p {
            font-size: 0.62rem !important;
            line-height: 1.2 !important;
          }
          .btn-tambah-etalase {
            padding: 0.45rem 0.75rem !important;
            font-size: 0.72rem !important;
            border-radius: 6px !important;
          }

          /* GRID STATISTIK RESPONSIP 2 KOLOM */
          .showcase-stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.4rem !important;
            margin-bottom: 0.85rem !important;
          }
          .showcase-stats-grid > div {
            padding: 0.6rem !important;
            border-radius: 8px !important;
            gap: 0.5rem !important;
          }

          /* GRID KARTU ETALASE PRODUK 2 KOLOM */
          .showcase-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.5rem !important;
          }
          .showcase-cards-grid > div {
            border-radius: 10px !important;
          }
          .showcase-cards-grid .card-image-box {
            height: 90px !important;
          }
          .showcase-cards-grid .card-body {
            padding: 0.5rem !important;
          }
          .showcase-cards-grid .card-title {
            font-size: 0.78rem !important;
            line-height: 1.15 !important;
          }
          .showcase-cards-grid .card-desc {
            font-size: 0.62rem !important;
            margin-bottom: 0.3rem !important;
          }
          .showcase-cards-grid .card-price {
            font-size: 0.88rem !important;
          }
          .showcase-cards-grid .card-action-btn {
            padding: 0.3rem !important;
            font-size: 0.62rem !important;
          }

          /* MODAL RESPONSIP MOBILE */
          .modal-box {
            padding: 1rem !important;
            width: 100% !important;
            max-height: 92vh !important;
            border-radius: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .showcase-cards-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 0.4rem !important;
          }
        }
      `
      }} />

      {toastMessage && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            zIndex: 9999,
            background: "#1E293B",
            color: "white",
            padding: "0.85rem 1.25rem",
            borderRadius: "10px",
            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.2)",
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            fontSize: "0.88rem",
            fontWeight: 600,
          }}
        >
          <span style={{ color: "#10B981", display: "flex" }}>
            <IconCheckCircle />
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem", flexWrap: "wrap", gap: "0.75rem" }}>
        <div className="header-title-container">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 800, color: "#1E293B" }}>Etalase Penjualan</h1>
          <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>
            Kelola harga, diskon, dan produk yang tampil di toko online pembeli.
          </p>
        </div>

        <button
          className="btn-tambah-etalase"
          onClick={() => setShowAddModal(true)}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            padding: "0.65rem 1.25rem",
            borderRadius: "8px",
            background: "#F59E0B",
            color: "white",
            fontWeight: 800,
            fontSize: "0.88rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(245, 158, 11, 0.25)",
          }}
        >
          <IconPlus /> Tambah Produk ke Etalase
        </button>
      </div>

      <div className="showcase-stats-grid" style={{ marginBottom: "1.25rem" }}>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px" }}>
            <IconEye />
          </div>
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{live.length}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Produk Tayang</div>
          </div>
        </div>
        <div style={{ background: "white", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#FEF3C7", color: "#D97706", padding: "0.6rem", borderRadius: "10px" }}>
            <IconTag />
          </div>
          <div>
            <div style={{ fontSize: "1.3rem", fontWeight: 800, color: "#1E293B" }}>{belumLive.length}</div>
            <div style={{ fontSize: "0.78rem", color: "#64748B" }}>Draft Belum Tayang</div>
          </div>
        </div>
      </div>

      <div className="showcase-cards-grid">
        {loading ? (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2.5rem", textAlign: "center", color: "#64748B", gridColumn: "1 / -1" }}>
            Memuat produk etalase...
          </div>
        ) : itemsEtalase.length === 0 ? (
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "12px", padding: "2.5rem", textAlign: "center", color: "#94A3B8", gridColumn: "1 / -1" }}>
            Belum ada produk di etalase. Klik tombol <strong>"Tambah Produk ke Etalase"</strong> di atas.
          </div>
        ) : (
          itemsEtalase.map((s) => {
            const hargaFinal = hargaSetelahDiskon(s.hargaJual, s.diskonPersen);

            return (
              <div key={s.id} style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>
                <div className="card-image-box" style={{ height: "130px", background: "#F1F5F9", position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {s.foto ? (
                    <img src={s.foto} alt={s.nama} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    <span style={{ fontSize: "0.8rem", color: "#94A3B8", fontWeight: 600 }}>Foto Belum Ada</span>
                  )}
                  <span
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      background: s.live ? "#D1FAE5" : "#F1F5F9",
                      color: s.live ? "#065F46" : "#64748B",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "0.2rem 0.6rem",
                      borderRadius: "99px",
                    }}
                  >
                    {s.live ? "Tayang Live" : "Draft"}
                  </span>
                </div>

                <div className="card-body" style={{ padding: "0.9rem", flex: 1, display: "flex", flexDirection: "column" }}>
                  <div className="card-title" style={{ fontSize: "0.95rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.2rem" }}>{s.nama}</div>

                  <div style={{ display: "flex", alignItems: "center", gap: "4px", marginBottom: "0.4rem" }}>
                    <IconStar />
                    <span style={{ fontSize: "0.78rem", fontWeight: 800, color: "#1E293B" }}>
                      {(s.totalUlasan ?? 0) > 0 ? (s.rating ? s.rating.toFixed(1) : "0.0") : "0"}
                    </span>
                    <span style={{ fontSize: "0.72rem", color: "#94A3B8" }}>
                      ({s.totalUlasan ?? 0} ulasan)
                    </span>
                  </div>

                  <p
                    className="card-desc"
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748B",
                      margin: "0 0 0.6rem 0",
                      lineHeight: 1.3,
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {s.deskripsi || "Produk bahan baku segar dan terjamin."}
                  </p>

                  <div style={{ fontSize: "0.72rem", color: "#94A3B8", marginBottom: "0.5rem" }}>
                    Stok: <strong style={{ color: "#1E293B" }}>{s.jumlah} pcs</strong>
                  </div>

                  <div style={{ marginTop: "auto", paddingTop: "0.5rem", borderTop: "1px dashed #F1F5F9", marginBottom: "0.8rem" }}>
                    {s.diskonPersen > 0 ? (
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.75rem", color: "#94A3B8", textDecoration: "line-through" }}>
                            {formatRupiah(s.hargaJual)}
                          </span>
                          <span style={{ fontSize: "0.68rem", fontWeight: 800, background: "#FEE2E2", color: "#991B1B", padding: "0.1rem 0.35rem", borderRadius: "4px" }}>
                            -{s.diskonPersen}%
                          </span>
                        </div>
                        <div className="card-price" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F59E0B" }}>{formatRupiah(hargaFinal)}</div>
                      </div>
                    ) : (
                      <div className="card-price" style={{ fontSize: "1.1rem", fontWeight: 800, color: "#1E293B" }}>{formatRupiah(s.hargaJual)}</div>
                    )}
                  </div>

                  <div style={{ display: "flex", gap: "0.4rem" }}>
                    <button className="card-action-btn" onClick={() => openEdit(s)} style={{ flex: 1, background: "#FFFBEB", border: "1px solid #FDE68A", padding: "0.45rem", borderRadius: "6px", fontSize: "0.76rem", color: "#92400E", fontWeight: 700, cursor: "pointer" }}>
                      Ubah Harga
                    </button>
                    <button
                      className="card-action-btn"
                      onClick={() => toggleStatusLive(s.id, s.live)}
                      style={{
                        flex: 1,
                        background: s.live ? "#F1F5F9" : "#10B981",
                        border: "none",
                        padding: "0.45rem",
                        borderRadius: "6px",
                        fontSize: "0.76rem",
                        color: s.live ? "#475569" : "white",
                        fontWeight: 700,
                        cursor: "pointer",
                      }}
                    >
                      {s.live ? "Sembunyikan" : "Tayangkan"}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {showAddModal && (
        <div
          onClick={closeModalTambah}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15,23,42,0.45)",
            backdropFilter: "blur(2px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 2000,
            padding: "0.5rem",
          }}
        >
          <div
            className="modal-box"
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              width: "450px",
              maxWidth: "100%",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              maxHeight: "90vh",
              overflowY: "auto",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 800, color: "#1E293B" }}>Tambah Produk ke Etalase</h2>
              <button onClick={closeModalTambah} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                <IconX />
              </button>
            </div>

            <div style={{ display: "flex", background: "#F1F5F9", padding: "4px", borderRadius: "10px", marginBottom: "1.25rem" }}>
              <button
                type="button"
                onClick={() => setModeTambah("gudang")}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: modeTambah === "gudang" ? "white" : "transparent",
                  color: modeTambah === "gudang" ? "#1E293B" : "#64748B",
                }}
              >
                Pilih dari Stok Gudang
              </button>
              <button
                type="button"
                onClick={() => setModeTambah("baru")}
                style={{
                  flex: 1,
                  padding: "0.55rem",
                  borderRadius: "8px",
                  border: "none",
                  fontSize: "0.78rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  background: modeTambah === "baru" ? "white" : "transparent",
                  color: modeTambah === "baru" ? "#1E293B" : "#64748B",
                }}
              >
                Tambah Produk Baru
              </button>
            </div>

            {modeTambah === "gudang" ? (
              <form onSubmit={handleTayangkanDariGudang} style={{ display: "flex", flexDirection: "column", gap: "0.85rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                    Pilih Produk Gudang *
                  </label>
                  <select
                    required
                    value={selectedStokId}
                    onChange={(e) => setSelectedStokId(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.6rem 0.85rem",
                      borderRadius: "8px",
                      border: "1px solid #CBD5E1",
                      fontSize: "0.85rem",
                      background: "white",
                      color: "#1E293B",
                      outline: "none",
                    }}
                  >
                    <option value="">-- Pilih Barang dari Gudang --</option>
                    {stokList
                      .filter((s) => s.nama && s.nama.trim() !== "")
                      .map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.nama} (Sisa Stok: {s.jumlah} pcs)
                        </option>
                      ))}
                  </select>
                </div>

                {selectedStokId && (
                  <>
                    <div>
                      <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                        Harga Jual ke Pembeli (Rp) *
                      </label>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        value={formatInputRupiah(addGudangForm.hargaJual)}
                        onChange={(e) =>
                          setAddGudangForm({
                            ...addGudangForm,
                            hargaJual: unformatInputRupiah(e.target.value),
                          })
                        }
                        style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                      />
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                          Diskon Toko (%)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="90"
                          value={addGudangForm.diskonPersen}
                          onChange={(e) => setAddGudangForm({ ...addGudangForm, diskonPersen: e.target.value })}
                          style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                      <div>
                        <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.35rem" }}>
                          Berat / Item (kg) *
                        </label>
                        <input
                          required
                          type="number"
                          step="0.01"
                          min="0.01"
                          placeholder="1.0"
                          value={addGudangForm.berat}
                          onChange={(e) => setAddGudangForm({ ...addGudangForm, berat: e.target.value })}
                          style={{ width: "100%", padding: "0.6rem 0.85rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button
                    type="button"
                    onClick={closeModalTambah}
                    style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={!selectedStokId || submitting}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "none",
                      background: selectedStokId ? "#10B981" : "#CBD5E1",
                      color: "white",
                      fontWeight: 800,
                      cursor: selectedStokId ? "pointer" : "not-allowed",
                      fontSize: "0.82rem"
                    }}
                  >
                    {submitting ? "Memproses..." : "Tayangkan Sekarang"}
                  </button>
                </div>
              </form>
            ) : (
              <form onSubmit={handleBuatProdukBaru} style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Foto Produk
                  </label>
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      border: "2px dashed #CBD5E1",
                      background: "#F8FAFC",
                      borderRadius: "10px",
                      padding: "0.75rem",
                      textAlign: "center",
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "0.5rem",
                    }}
                  >
                    {fotoPreview ? (
                      <img src={fotoPreview} alt="Preview" style={{ height: "45px", borderRadius: "6px", objectFit: "cover" }} />
                    ) : (
                      <span style={{ fontSize: "0.78rem", color: "#64748B", display: "flex", alignItems: "center", gap: "6px" }}>
                        <IconCamera /> Pilih / Unggah Foto Produk
                      </span>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFotoSelect} style={{ display: "none" }} />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Nama Produk *
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="Contoh: Kripik Tempe Premium"
                    value={formBaru.nama}
                    onChange={(e) => setFormBaru({ ...formBaru, nama: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Jumlah Stok *
                    </label>
                    <input
                      required
                      type="number"
                      min="1"
                      placeholder="10"
                      value={formBaru.jumlah}
                      onChange={(e) => setFormBaru({ ...formBaru, jumlah: e.target.value })}
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Satuan
                    </label>
                    <select
                      disabled
                      value="pcs"
                      style={{
                        width: "100%",
                        padding: "0.55rem 0.75rem",
                        borderRadius: "8px",
                        border: "1px solid #CBD5E1",
                        fontSize: "0.85rem",
                        background: "#F1F5F9",
                        color: "#334155",
                        outline: "none",
                        boxSizing: "border-box",
                        cursor: "not-allowed",
                      }}
                    >
                      <option value="pcs">pcs</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Harga Beli/Modal (Rp)
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={formatInputRupiah(formBaru.hargaBeli)}
                      onChange={(e) =>
                        setFormBaru({
                          ...formBaru,
                          hargaBeli: unformatInputRupiah(e.target.value),
                        })
                      }
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Harga Jual (Rp) *
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="0"
                      value={formatInputRupiah(formBaru.hargaJual)}
                      onChange={(e) =>
                        setFormBaru({
                          ...formBaru,
                          hargaJual: unformatInputRupiah(e.target.value),
                        })
                      }
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Diskon Toko (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="90"
                      placeholder="0"
                      value={formBaru.diskonPersen}
                      onChange={(e) => setFormBaru({ ...formBaru, diskonPersen: e.target.value })}
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                      Berat Per Item (kg) *
                    </label>
                    <input
                      required
                      type="number"
                      step="0.01"
                      min="0.01"
                      placeholder="1.0"
                      value={formBaru.berat}
                      onChange={(e) => setFormBaru({ ...formBaru, berat: e.target.value })}
                      style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Deskripsi Produk
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Penjelasan detail komoditas..."
                    value={formBaru.deskripsi}
                    onChange={(e) => setFormBaru({ ...formBaru, deskripsi: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
                  />
                </div>

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
                  <button
                    type="button"
                    onClick={closeModalTambah}
                    style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    style={{
                      flex: 1,
                      padding: "0.6rem",
                      borderRadius: "8px",
                      border: "none",
                      background: "#F59E0B",
                      color: "white",
                      fontWeight: 800,
                      cursor: "pointer",
                      fontSize: "0.82rem",
                      opacity: submitting ? 0.7 : 1,
                    }}
                  >
                    {submitting ? "Menyimpan..." : "Simpan & Tayangkan"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {editItem && (
        <div
          onClick={() => setEditItem(null)}
          style={{ position: "fixed", inset: 0, background: "rgba(15,23,42,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: "0.5rem" }}
        >
          <div className="modal-box" onClick={(e) => e.stopPropagation()} style={{ background: "white", borderRadius: "14px", padding: "1.25rem", width: "380px", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.25rem" }}>
              <h2 style={{ margin: 0, fontSize: "0.95rem", fontWeight: 800, color: "#1E293B" }}>Ubah Harga — {editItem.nama}</h2>
              <button onClick={() => setEditItem(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}>
                <IconX />
              </button>
            </div>

            <form onSubmit={handleSubmitEdit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem", marginTop: "0.85rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Harga Jual (Rp)
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatInputRupiah(editForm.hargaJual)}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      hargaJual: unformatInputRupiah(e.target.value),
                    })
                  }
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Diskon (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="90"
                    value={editForm.diskonPersen}
                    onChange={(e) => setEditForm({ ...editForm, diskonPersen: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                    Berat Per Item (kg) *
                  </label>
                  <input
                    required
                    type="number"
                    step="0.01"
                    min="0.01"
                    placeholder="1.0"
                    value={editForm.berat}
                    onChange={(e) => setEditForm({ ...editForm, berat: e.target.value })}
                    style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, color: "#334155", marginBottom: "0.3rem" }}>
                  Deskripsi Produk
                </label>
                <textarea
                  rows={2}
                  value={editForm.deskripsi}
                  onChange={(e) => setEditForm({ ...editForm, deskripsi: e.target.value })}
                  style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", fontFamily: "sans-serif" }}
                />
              </div>

              <button type="submit" style={{ width: "100%", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#F59E0B", color: "white", fontWeight: 800, fontSize: "0.82rem", cursor: "pointer" }}>
                Simpan Perubahan
              </button>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}