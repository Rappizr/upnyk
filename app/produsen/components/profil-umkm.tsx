"use client";

import { useRef, useState, useEffect } from "react";
import type { FormEvent, ChangeEvent } from "react";
import { supabase } from "@/lib/db";

const IconUser = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconCheckCircle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconCamera = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;

export default function ProfilUMKM({ onProfileUpdate }: { onProfileUpdate?: () => void }) {
  const [loading, setLoading] = useState(true);
  const [editingUsaha, setEditingUsaha] = useState(false);
  const [editingPemilik, setEditingPemilik] = useState(false);
  
  const [subHalaman, setSubHalaman] = useState<"toko" | "pemilik">("toko");
  const [isDataLengkap, setIsDataLengkap] = useState(false);

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [toast, setToast] = useState<{ tampil: boolean; pesan: string; tipe: "sukses" | "gagal" }>({
    tampil: false, pesan: "", tipe: "sukses"
  });

  const fileUsahaRef = useRef<HTMLInputElement>(null);
  const fileAvatarRef = useRef<HTMLInputElement>(null);
  const [fileFotoUsaha, setFileFotoUsaha] = useState<File | null>(null);
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama_pemilik: "",
    email_user: "",
    phone_user: "",
    fotoAvatarPemilik: "", 
    nama_usaha: "",
    kategori: "Belum memilih kategori",
    alamat: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    fotoUsahaUrl: "", 
    status: "aktif"
  });

  function pemicuToast(pesan: string, tipe: "sukses" | "gagal" = "sukses") {
    setToast({ tampil: true, pesan, tipe });
    setTimeout(() => {
      setToast((t) => ({ ...t, tampil: false }));
    }, 3000);
  }

  async function ambilDataProfil() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: profilePusat } = await supabase
      .from("profiles")
      .select("nama, email, phone, avatar_url") 
      .eq("id", user.id)
      .maybeSingle();

    const { data: produsen } = await supabase
      .from("produsen")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (profilePusat || produsen) {
      const lengkap = !!(produsen && produsen.alamat && produsen.nama_usaha && produsen.nama_usaha !== "UMKM Maju Bersama");
      setIsDataLengkap(lengkap);

      setForm({
        nama_pemilik: profilePusat?.nama || "Pemilik PasarNusa",
        email_user: profilePusat?.email || user.email || "-",
        phone_user: profilePusat?.phone || "-",
        fotoAvatarPemilik: profilePusat?.avatar_url || "", 
        nama_usaha: produsen?.nama_usaha || "",
        kategori: produsen?.kategori || "Belum memilih kategori",
        alamat: produsen?.alamat || "",
        desa: produsen?.desa || "",
        kecamatan: produsen?.kecamatan || "",
        kabupaten: produsen?.kabupaten || "",
        provinsi: produsen?.provinsi || "",
        fotoUsahaUrl: produsen?.foto || "", 
        status: produsen?.status || "aktif"
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    ambilDataProfil();
  }, []);

  async function handleFotoUsahaChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileFotoUsaha(file);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, fotoUsahaUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAvatar(file);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, fotoAvatarPemilik: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleUsahaSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let finalFotoUsahaUrl = form.fotoUsahaUrl;
    if (fileFotoUsaha) {
      const fileExt = fileFotoUsaha.name.split('.').pop();
      const fileName = `usaha-${user.id}-${Math.floor(Date.now() / 1000)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("produk").upload(fileName, fileFotoUsaha, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("produk").getPublicUrl(fileName);
        finalFotoUsahaUrl = data.publicUrl;
      }
    }

    const payload = {
      nama_usaha: form.nama_usaha,
      kategori: form.kategori === "Belum memilih kategori" ? "Makanan Olahan" : form.kategori,
      alamat: form.alamat,
      desa: form.desa,
      kecamatan: form.kecamatan,
      kabupaten: form.kabupaten,
      provinsi: form.provinsi,
      foto: finalFotoUsahaUrl, 
      status: "aktif"
    };

    const { data: cekExist } = await supabase.from("produsen").select("id").eq("profile_id", user.id).maybeSingle();
    const { error } = cekExist ? await supabase.from("produsen").update(payload).eq("profile_id", user.id) : await supabase.from("produsen").insert({ profile_id: user.id, ...payload });

    if (error) {
      pemicuToast("Gagal menyimpan data usaha!", "gagal");
    } else {
      pemicuToast("Data Toko Sukses Diperbarui!", "sukses");
      
      const { data: freshProdusen } = await supabase.from("produsen").select("*").eq("profile_id", user.id).maybeSingle();
      if (freshProdusen) {
        setForm((f) => ({
          ...f,
          nama_usaha: freshProdusen.nama_usaha || "",
          kategori: freshProdusen.kategori || "Belum memilih kategori",
          alamat: freshProdusen.alamat || "",
          desa: freshProdusen.desa || "",
          kecamatan: freshProdusen.kecamatan || "",
          kabupaten: freshProdusen.kabupaten || "",
          provinsi: freshProdusen.provinsi || "",
          fotoUsahaUrl: freshProdusen.foto || "",
        }));
        setIsDataLengkap(true);
      }
      if (onProfileUpdate) onProfileUpdate();
      setEditingUsaha(false);
    }
    setLoading(false);
  }

  async function handlePemilikSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    if (passwordBaru || konfirmasiPassword) {
      if (passwordBaru !== konfirmasiPassword) {
        pemicuToast("Konfirmasi kata sandi tidak cocok!", "gagal");
        setLoading(false);
        return;
      }
      if (passwordBaru.length < 6) {
        pemicuToast("Kata sandi minimal 6 karakter!", "gagal");
        setLoading(false);
        return;
      }
      
      const { error: authError } = await supabase.auth.updateUser({ password: passwordBaru });
      if (authError) {
        pemicuToast("Gagal memperbarui kata sandi auth!", "gagal");
        setLoading(false);
        return;
      }
    }

    let finalAvatarUrl = form.fotoAvatarPemilik;
    if (fileAvatar) {
      const fileExt = fileAvatar.name.split('.').pop();
      const fileName = `avatar-${user.id}-${Math.floor(Date.now() / 1000)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("produk").upload(fileName, fileAvatar, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("produk").getPublicUrl(fileName);
        finalAvatarUrl = data.publicUrl;
      }
    }

    const { error } = await supabase.from("profiles").update({ nama: form.nama_pemilik, phone: form.phone_user, avatar_url: finalAvatarUrl }).eq("id", user.id);
    if (error) {
      pemicuToast("Gagal mengupdate profiles diri!", "gagal");
    } else {
      pemicuToast("Data Akun Pemilik Sukses Diperbarui!", "sukses");
      setForm((f) => ({ ...f, fotoAvatarPemilik: finalAvatarUrl }));
      setPasswordBaru("");
      setKonfirmasiPassword("");
      if (onProfileUpdate) onProfileUpdate();
      setEditingPemilik(false);
    }
    setLoading(false);
  }

  if (loading) return <div style={{ padding: "2rem", textAlign: "center", color: "#64748B" }}>Sinkronisasi Data PasarNusa...</div>;

  const inisialUsaha = form.nama_usaha ? form.nama_usaha.split(" ").map(w => w[0]).join("").slice(0,2).toUpperCase() : "PM";

  return (
    <div style={{ width: "100%", maxWidth: "520px", margin: "0 auto", boxSizing: "border-box", position: "relative" }}>
      
      {toast.tampil && (
        <div style={{ position: "fixed", top: "24px", right: "24px", background: toast.tipe === "sukses" ? "#10B981" : "#EF4444", color: "white", padding: "0.8rem 1.5rem", borderRadius: "10px", fontWeight: 600, fontSize: "0.88rem", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)", zIndex: 9999, display: "flex", alignItems: "center", gap: "8px" }}>
          <IconCheckCircle /> {toast.pesan}
        </div>
      )}

      {!editingUsaha && !editingPemilik && (
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ background: "linear-gradient(135deg, #10B981, #059669)", height: "130px", position: "relative" }} />
          
          <div style={{ padding: "0 1.5rem 0.5rem", marginTop: "-45px", textAlign: "center", position: "relative", zIndex: 2 }}>
            <div style={{ display: "inline-block", marginBottom: "0.5rem" }}>
              <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid white", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                {subHalaman === "toko" ? (
                  form.fotoUsahaUrl ? <img src={form.fotoUsahaUrl} alt="Logo Toko" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{inisialUsaha}</span>
                ) : (
                  form.fotoAvatarPemilik ? <img src={form.fotoAvatarPemilik} alt="Avatar Pemilik" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{form.nama_pemilik.slice(0,2).toUpperCase()}</span>
                )}
              </div>
            </div>
            
            <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{form.nama_usaha || "Nama Usaha Belum Diisi"}</div>
            <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>Pemilik Resmi: <span style={{ color: "#1E293B", fontWeight: 600 }}>{form.nama_pemilik}</span></div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#D1FAE5", color: "#065F46", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}><IconCheckCircle /> Mitra UMKM Aktif</span>
          </div>

          {isDataLengkap && (
            <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", padding: "4px" }}>
              <button onClick={() => setSubHalaman("toko")} style={{ flex: 1, padding: "0.5rem", border: "none", borderRadius: "6px", background: subHalaman === "toko" ? "white" : "transparent", color: subHalaman === "toko" ? "#10B981" : "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>Pindah ke Profil Toko</button>
              <button onClick={() => setSubHalaman("pemilik")} style={{ flex: 1, padding: "0.5rem", border: "none", borderRadius: "6px", background: subHalaman === "pemilik" ? "white" : "transparent", color: subHalaman === "pemilik" ? "#10B981" : "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>Pindah ke Profil Pemilik</button>
            </div>
          )}

          <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", textAlign: "left" }}>
            {subHalaman === "toko" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ color: "#10B981", background: "#ECFDF5", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMapPin /></span>
                  <div>
                    <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Alamat Operasional Toko</div>
                    <div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.alamat || "Belum melengkapi lokasi fisik"} {form.desa && `, Des. ${form.desa}`} {form.kecamatan && `, Kec. ${form.kecamatan}`} {form.kabupaten && `, ${form.kabupaten}`} {form.provinsi && `, ${form.provinsi}`}</div>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ color: "#10B981", background: "#ECFDF5", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconUser /></span>
                  <div><div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Sektor Komoditas hulu</div><div style={{ fontSize: "0.88rem", color: "#1E293B", fontWeight: 600 }}>{form.kategori}</div></div>
                </div>
                <button onClick={() => setEditingUsaha(true)} style={{ marginTop: "0.5rem", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>Lengkapi & Atur Profil Usaha</button>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ color: "#10B981", background: "#ECFDF5", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconPhone /></span>
                  <div><div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Nomor WhatsApp Hubungan</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.phone_user}</div></div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                  <span style={{ color: "#10B981", background: "#ECFDF5", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></span>
                  <div><div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Korespondensi Email Akun</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.email_user}</div></div>
                </div>
                <button onClick={() => setEditingPemilik(true)} style={{ marginTop: "0.5rem", padding: "0.6rem", borderRadius: "8px", border: "none", background: "#3B82F6", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>Edit Kontak & KTP Pemilik</button>
              </>
            )}
          </div>
        </div>
      )}

      {editingUsaha && (
        <form onSubmit={handleUsahaSubmit} style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.8rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.5rem" }}>Edit Pengaturan Profil Usaha</div>
          <div>
            <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.4rem" }}>UPLOAD FOTO PROFIL USAHA / LOGO UMKM</label>
            <div onClick={() => fileUsahaRef.current?.click()} style={{ border: "1.5px dashed #10B981", background: "#F0FDF9", borderRadius: "10px", height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
              {form.fotoUsahaUrl ? <img src={form.fotoUsahaUrl} alt="Usaha" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.75rem", color: "#059669" }}>Pilih foto profil usaha anda</span>}
            </div>
            <input ref={fileUsahaRef} type="file" accept="image/*" onChange={handleFotoUsahaChange} style={{ display: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Nama Usaha / UMKM *</label>
            <input required value={form.nama_usaha} onChange={(e) => setForm({ ...form, nama_usaha: e.target.value })} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Kategori Komoditas</label>
            <select value={form.kategori === "Belum memilih kategori" ? "Makanan Olahan" : form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white" }}>
              <option value="Makanan Olahan">Makanan Olahan</option>
              <option value="Bahan Baku Mentah">Bahan Baku Mentah</option>
              <option value="Perkebunan & Sayur">Perkebunan & Sayur</option>
              <option value="Kerajinan Tangan">Kerajinan Tangan</option>
            </select>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Alamat Jalan Usaha *</label>
            <input required value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input placeholder="Desa" value={form.desa} onChange={(e) => setForm({ ...form, desa: e.target.value })} style={{ flex: 1, padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
            <input placeholder="Kecamatan" value={form.kecamatan} onChange={(e) => setForm({ ...form, kecamatan: e.target.value })} style={{ flex: 1, padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <input placeholder="Kabupaten" value={form.kabupaten} onChange={(e) => setForm({ ...form, kabupaten: e.target.value })} style={{ flex: 1, padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
            <input placeholder="Provinsi" value={form.provinsi} onChange={(e) => setForm({ ...form, provinsi: e.target.value })} style={{ flex: 1, padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="button" onClick={() => setEditingUsaha(false)} style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", fontSize: "0.85rem" }}>Batal</button>
            <button type="submit" style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "none", background: "#10B981", color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Simpan Data Toko</button>
          </div>
        </form>
      )}

      {editingPemilik && (
        <form onSubmit={handlePemilikSubmit} style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.8rem", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
          <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.5rem" }}>Edit Pengaturan Akun Pemilik</div>
          <div style={{ textAlign: "center" }}>
            <div onClick={() => fileAvatarRef.current?.click()} style={{ display: "inline-block", position: "relative", cursor: "pointer" }}>
              <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: "2px dashed #10B981" }}>
                {form.fotoAvatarPemilik ? <img src={form.fotoAvatarPemilik} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: "#10B981", fontSize: "0.75rem" }}>Pilih Foto</span>}
              </div>
              <div style={{ position: "absolute", bottom: 0, right: 0, background: "#10B981", padding: "4px", borderRadius: "50%", color: "white" }}><IconCamera /></div>
            </div>
            <input ref={fileAvatarRef} type="file" accept="image/*" onChange={handleAvatarChange} style={{ display: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Nama Lengkap Sesuai KTP *</label>
            <input required value={form.nama_pemilik} onChange={(e) => setForm({ ...form, nama_pemilik: e.target.value })} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Nomor WhatsApp Aktif *</label>
            <input required value={form.phone_user} onChange={(e) => setForm({ ...form, phone_user: e.target.value })} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
          </div>

          <div style={{ borderTop: "1px solid #F1F5F9", marginTop: "0.5rem", paddingTop: "0.75rem" }}>
            <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "#64748B", display: "block", marginBottom: "0.5rem" }}>PENGATURAN KATA SANDI (Kosongkan jika tidak ingin diubah)</span>
            <div style={{ marginBottom: "0.5rem" }}>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.2rem" }}>Kata Sandi Baru</label>
              <input type="password" placeholder="Minimal 6 karakter" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 600, color: "#475569", marginBottom: "0.2rem" }}>Konfirmasi Kata Sandi Baru</label>
              <input type="password" placeholder="Ulangi kata sandi baru" value={konfirmasiPassword} onChange={(e) => setKonfirmasiPassword(e.target.value)} style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
          </div>

          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
            <button type="button" onClick={() => { setPasswordBaru(""); setKonfirmasiPassword(""); setEditingPemilik(false); }} style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", fontSize: "0.85rem" }}>Batal</button>
            <button type="submit" style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "none", background: "#3B82F6", color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Simpan Data Diri</button>
          </div>
        </form>
      )}

    </div>
  );
}