"use client";

import { useRef, useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/db";

const IconCamera = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconTag = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"></path><line x1="7" y1="7" x2="7.01" y2="7"></line></svg>;
const IconCheckCircle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;

interface Props {
  onProfileUpdate?: () => void;
}

export default function ProfilTokoPage({ onProfileUpdate }: Props) {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [isDataLengkap, setIsDataLengkap] = useState(false);

  const [toast, setToast] = useState<{ tampil: boolean; pesan: string; tipe: "sukses" | "gagal" }>({
    tampil: false, pesan: "", tipe: "sukses"
  });

  const fileRef = useRef<HTMLInputElement>(null);
  const [fileFoto, setFileFoto] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama_pemilik: "",
    nama_toko: "",
    alamat: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    fotoUrl: ""
  });

  function pemicuToast(pesan: string, tipe: "sukses" | "gagal" = "sukses") {
    setToast({ tampil: true, pesan, tipe });
    setTimeout(() => setToast((t) => ({ ...t, tampil: false })), 3000);
  }

  async function ambilProfilAdmin() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // 1. Ambil nama dari profiles pusat
    const { data: profileData } = await supabase
      .from("profiles")
      .select("nama")
      .eq("id", user.id)
      .maybeSingle();

    // 2. Ambil data legalitas fisik dari tabel admin_toko
    const { data: adminData } = await supabase
      .from("admin_toko")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (profileData || adminData) {
      // Data dianggap lengkap jika nama_toko dan alamat terisi valid di database
      const lengkap = !!(adminData && adminData.nama_toko && adminData.alamat);
      setIsDataLengkap(lengkap);

      // Proteksi awal: Jika belum lengkap, kunci komponen pada mode Edit
      if (!lengkap) {
        setEditing(true);
      }

      setForm({
        nama_pemilik: profileData?.nama || "Admin Toko",
        nama_toko: adminData?.nama_toko || "",
        alamat: adminData?.alamat || "",
        desa: adminData?.desa || "",
        kecamatan: adminData?.kecamatan || "",
        kabupaten: adminData?.kabupaten || "",
        provinsi: adminData?.provinsi || "",
        fotoUrl: adminData?.foto || ""
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    ambilProfilAdmin();
  }, []);

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileFoto(file);
    const reader = new FileReader();
    reader.onload = () => setForm((prev) => ({ ...prev, fotoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let finalFotoUrl = form.fotoUrl;

    if (fileFoto) {
      const fileExt = fileFoto.name.split('.').pop();
      const fileName = `admin-toko-${user.id}-${Math.floor(Date.now() / 1000)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("produk").upload(fileName, fileFoto, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("produk").getPublicUrl(fileName);
        finalFotoUrl = data.publicUrl;
      }
    }

    const payload = {
      nama_toko: form.nama_toko,
      alamat: form.alamat,
      desa: form.desa,
      kecamatan: form.kecamatan,
      kabupaten: form.kabupaten,
      provinsi: form.provinsi,
      foto: finalFotoUrl,
      status: "aktif"
    };

    const { data: cekExist } = await supabase.from("admin_toko").select("id").eq("profile_id", user.id).maybeSingle();
    
    // Melakukan Insert / Update data ke tabel admin_toko dengan relasi profile_id yang sesuai
    const { error: adminError } = cekExist
      ? await supabase.from("admin_toko").update(payload).eq("profile_id", user.id)
      : await supabase.from("admin_toko").insert({ profile_id: user.id, ...payload });

if (adminError) {
  console.log(adminError);
  alert(adminError.message);
} else {
      pemicuToast("Profil Toko Berhasil Diperbarui!", "sukses");
      setEditing(false);
      setIsDataLengkap(true);
      if (onProfileUpdate) onProfileUpdate();
      ambilProfilAdmin();
    }
    setLoading(false);
  }

  if (loading) return <div style={{ padding: "3rem", textAlign: "center", color: "#64748B", fontFamily: "sans-serif" }}>Memuat Berkas Profil Toko...</div>;

  const inisialToko = form.nama_toko ? form.nama_toko.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "PM";

  return (
    <div style={{ width: "100%", padding: "1rem", boxSizing: "border-box", fontFamily: "sans-serif" }}>
      
      {toast.tampil && (
        <div style={{ position: "fixed", top: "24px", right: "24px", background: toast.tipe === "sukses" ? "#10B981" : "#EF4444", color: "white", padding: "0.8rem 1.5rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)", zIndex: 9999, display: "flex", alignItems: "center", gap: "8px" }}>
          <IconCheckCircle /> {toast.pesan}
        </div>
      )}

      {/* BANNER PERINGATAN MERAH JIKA DATA BELUM LENGKAP */}
      {!isDataLengkap && (
        <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", color: "#991B1B", padding: "1.1rem", borderRadius: "8px", fontSize: "0.88rem", maxWidth: "600px", margin: "0 auto 1.5rem auto", textAlign: "center", lineHeight: "1.5" }}>
          ⚠️ Akun anda mendeteksi data data legalitas UMKM belum terdaftar lengkap. Silakan isi formulir di bawah ini dengan nama usaha, kategori hulu, dan alamat asli agar fitur operasional penayangan produk dapat diaktifkan kembali.
        </div>
      )}

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", width: "100%", maxWidth: "420px", margin: "0 auto", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        {!editing ? (
          <>
            <div style={{ background: "#059669", height: "100px", position: "relative" }} />
            <div style={{ padding: "0 1.25rem 1.25rem", marginTop: "-45px", textAlign: "center" }}>
              
              <div style={{ display: "inline-block", position: "relative", marginBottom: "0.75rem" }}>
                <div style={{ width: "86px", height: "86px", borderRadius: "50%", background: "#E6F4EA", color: "#059669", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 700, border: "4px solid white", overflow: "hidden", boxShadow: "0 4px 10px rgba(0,0,0,0.1)" }}>
                  {form.fotoUrl ? <img src={form.fotoUrl} alt="Logo Toko" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : inisialToko}
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: "26px", height: "22px", borderRadius: "50%", background: "#059669", color: "white", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }}>
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{form.nama_toko || "Nama Usaha Belum Diisi"}</div>
              <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>Pemilik Resmi: <span style={{ fontWeight: 600, color: "#1E293B" }}>{form.nama_pemilik}</span></div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#E6F4EA", color: "#137333", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}><IconCheckCircle /> Mitra UMKM Aktif</span>

              <div style={{ marginTop: "1.5rem", display: "flex", flexDirection: "column", gap: "0.8rem", textAlign: "left", borderTop: "1px solid #F1F5F9", paddingTop: "1.25rem" }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem" }}>
                  <span style={{ color: "#059669", background: "#E6F4EA", width: "28px", height: "28px", borderRadius: "6px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMapPin /></span>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Alamat Operasional Toko</div>
                    <div style={{ fontSize: "0.82rem", color: "#1E293B", lineHeight: "1.4" }}>{form.alamat || "Belum melengkapi lokasi fisik"} {form.desa && `, Des. ${form.desa}`} {form.kecamatan && `, Kec. ${form.kecamatan}`} {form.kabupaten && `, ${form.kabupaten}`}</div>
                  </div>
                </div>
              </div>

              <button onClick={() => setEditing(true)} style={{ marginTop: "1.5rem", width: "100%", padding: "0.65rem", borderRadius: "8px", border: "none", background: "#059669", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.85rem" }}>Lengkapi & Atur Profil Usaha</button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.8rem" }}>
            <div style={{ textAlign: "center", fontWeight: 700, color: "#1E293B", fontSize: "0.95rem", paddingBottom: "0.3rem" }}>Edit Pengaturan Profil Usaha</div>
            
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#64748B", textTransform: "uppercase", marginBottom: "0.4rem", textAlign: "center" }}>UPLOAD FOTO PROFIL USAHA / LOGO UMKM</label>
              <div onClick={() => fileRef.current?.click()} style={{ border: "1.5px dashed #A7F3D0", background: "#F0FDF9", borderRadius: "8px", height: "100px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                {form.fotoUrl ? (
                  <img src={form.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: "0.82rem", color: "#059669", fontWeight: 600 }}>Pilih foto profil usaha anda</span>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>Nama Usaha / UMKM *</label>
              <input required value={form.nama_toko} onChange={(e) => setForm({ ...form, nama_toko: e.target.value })} placeholder="Contoh: Kripik Tempe Sanan Malang" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>Kategori Komoditas</label>
              <select style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white", boxSizing: "border-box", color: "#64748B" }}>
                <option value="Makanan Olahan">Makanan Olahan</option>
              </select>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#1E293B", marginBottom: "0.25rem" }}>Alamat Jalan Usaha *</label>
              <input required value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Nama Jalan, Blok, dan Nomor Rumah" style={{ width: "100%", padding: "0.5rem 0.75rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input placeholder="Desa" required value={form.desa} onChange={(e) => setForm({ ...form, desa: e.target.value })} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
              <input placeholder="Kecamatan" required value={form.kecamatan} onChange={(e) => setForm({ ...form, kecamatan: e.target.value })} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <input placeholder="Kabupaten" required value={form.kabupaten} onChange={(e) => setForm({ ...form, kabupaten: e.target.value })} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
              <input placeholder="Provinsi" required value={form.provinsi} onChange={(e) => setForm({ ...form, provinsi: e.target.value })} style={{ flex: 1, padding: "0.5rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>

            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
              {/* Tombol batal hanya akan muncul jika data toko sebelumnya sudah lengkap */}
              {isDataLengkap && (
                <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontSize: "0.85rem" }}>Batal</button>
              )}
              <button type="submit" style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "none", background: "#059669", color: "white", fontWeight: 600, fontSize: "0.85rem", cursor: "pointer" }}>Simpan Data Toko</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}