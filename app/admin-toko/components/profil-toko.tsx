"use client";

import { useRef, useState, useEffect } from "react";
import type { FormEvent, ChangeEvent, CSSProperties } from "react";
import { supabase } from "@/lib/db";
import { getCoordsFromAddress } from "@/lib/geocoding";

const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconCheckCircle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconCamera = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// Tema warna disamakan dengan Admin Toko Dashboard (amber)
const WARNA_UTAMA = "#F59E0B";       // amber - aksi utama / bagian toko
const WARNA_UTAMA_GELAP = "#D97706"; // amber tua - bagian pemilik / hover

type Mode = "view" | "editToko" | "editPemilik";

interface ProfilTokoPageProps {
  /** Dikontrol dari luar — true kalau admin klik avatar/profil di header untuk membuka popup */
  open: boolean;
  /** Dipanggil saat popup ditutup (klik X atau klik area luar) */
  onClose: () => void;
  onProfileUpdate?: () => void;
}

export default function ProfilTokoPage({ open, onClose, onProfileUpdate }: ProfilTokoPageProps) {
  const [loading, setLoading] = useState(true);
  const [mode, setMode] = useState<Mode>("view");
  const [subHalaman, setSubHalaman] = useState<"toko" | "pemilik">("toko");
  const [isDataLengkap, setIsDataLengkap] = useState(false);

  const [passwordBaru, setPasswordBaru] = useState("");
  const [konfirmasiPassword, setKonfirmasiPassword] = useState("");

  const [toast, setToast] = useState<{ tampil: boolean; pesan: string; tipe: "sukses" | "gagal" }>({
    tampil: false, pesan: "", tipe: "sukses"
  });

  const fileTokoRef = useRef<HTMLInputElement>(null);
  const fileAvatarRef = useRef<HTMLInputElement>(null);
  const [fileFotoToko, setFileFotoToko] = useState<File | null>(null);
  const [fileAvatar, setFileAvatar] = useState<File | null>(null);

  const [form, setForm] = useState({
    nama_pemilik: "",
    email_user: "",
    phone_user: "",
    fotoAvatarPemilik: "",
    nama_toko: "",
    alamat: "",
    desa: "",
    kecamatan: "",
    kabupaten: "",
    provinsi: "",
    fotoTokoUrl: "",
    status: "aktif"
  });

  function pemicuToast(pesan: string, tipe: "sukses" | "gagal" = "sukses") {
    setToast({ tampil: true, pesan, tipe });
    setTimeout(() => setToast((t) => ({ ...t, tampil: false })), 3000);
  }

  async function ambilProfilAdmin() {
    setLoading(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    const { data: profileData } = await supabase
      .from("profiles")
      .select("nama, email, phone, avatar_url")
      .eq("id", user.id)
      .maybeSingle();

    const { data: adminData } = await supabase
      .from("admin_toko")
      .select("*")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (profileData || adminData) {
      const lengkap = !!(adminData && adminData.nama_toko && adminData.alamat);
      setIsDataLengkap(lengkap);

      setForm({
        nama_pemilik: profileData?.nama || "Admin Toko",
        email_user: profileData?.email || user.email || "-",
        phone_user: profileData?.phone || "-",
        fotoAvatarPemilik: profileData?.avatar_url || "",
        nama_toko: adminData?.nama_toko || "",
        alamat: adminData?.alamat || "",
        desa: adminData?.desa || "",
        kecamatan: adminData?.kecamatan || "",
        kabupaten: adminData?.kabupaten || "",
        provinsi: adminData?.provinsi || "",
        fotoTokoUrl: adminData?.foto || "",
        status: adminData?.status || "aktif"
      });
    }
    setLoading(false);
  }

  useEffect(() => {
    ambilProfilAdmin();
  }, []);

  function handleFotoTokoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileFotoToko(file);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, fotoTokoUrl: reader.result as string }));
    reader.readAsDataURL(file);
  }

  function handleAvatarChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileAvatar(file);
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, fotoAvatarPemilik: reader.result as string }));
    reader.readAsDataURL(file);
  }

  async function handleTokoSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }

    let finalFotoUrl = form.fotoTokoUrl;
    if (fileFotoToko) {
      const fileExt = fileFotoToko.name.split('.').pop();
      const fileName = `admin-toko-${user.id}-${Math.floor(Date.now() / 1000)}.${fileExt}`;
      const { error: uploadError } = await supabase.storage.from("produk").upload(fileName, fileFotoToko, { upsert: true });
      if (!uploadError) {
        const { data } = supabase.storage.from("produk").getPublicUrl(fileName);
        finalFotoUrl = data.publicUrl;
      }
    }

    // 🌐 AUTOMATIC GEOCODING: Mencari koordinat latitude & longitude dari alamat toko
    const coords = await getCoordsFromAddress({
      alamat: form.alamat,
      desa: form.desa,
      kecamatan: form.kecamatan,
      kabupaten: form.kabupaten,
      provinsi: form.provinsi,
    });

    const payload = {
      nama_toko: form.nama_toko,
      alamat: form.alamat,
      desa: form.desa,
      kecamatan: form.kecamatan,
      kabupaten: form.kabupaten,
      provinsi: form.provinsi,
      foto: finalFotoUrl,
      status: "aktif",
      latitude: coords ? coords.lat : null,
      longitude: coords ? coords.lng : null,
    };

    const { data: cekExist } = await supabase.from("admin_toko").select("id").eq("profile_id", user.id).maybeSingle();
    const { error: adminError } = cekExist
      ? await supabase.from("admin_toko").update(payload).eq("profile_id", user.id)
      : await supabase.from("admin_toko").insert({ profile_id: user.id, ...payload });

    if (adminError) {
      pemicuToast("Gagal menyimpan data toko!", "gagal");
    } else {
      pemicuToast("Profil Toko & Koordinat Peta Berhasil Diperbarui!", "sukses");
      setIsDataLengkap(true);
      if (onProfileUpdate) onProfileUpdate();
      await ambilProfilAdmin();
      setMode("view");
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
      setMode("view");
    }
    setLoading(false);
  }

  const wajibLengkapi = !loading && !isDataLengkap;
  const tampilkanPopup = open || wajibLengkapi;

  if (loading || !tampilkanPopup) return null;

  const effectiveMode: Mode = wajibLengkapi ? "editToko" : mode;
  const bisaDitutup = !wajibLengkapi;

  function tutupPopup() {
    if (!bisaDitutup) return;
    setPasswordBaru("");
    setKonfirmasiPassword("");
    setMode("view");
    onClose();
  }

  const inisialToko = form.nama_toko ? form.nama_toko.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase() : "AT";

  const overlayStyle: CSSProperties = {
    position: "fixed",
    inset: 0,
    background: "rgba(15, 23, 42, 0.55)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    zIndex: 1000,
  };

  const modalCardStyle: CSSProperties = {
    background: "white",
    borderRadius: "14px",
    border: "1px solid #E2E8F0",
    width: "100%",
    maxWidth: "480px",
    maxHeight: "90vh",
    overflowY: "auto",
    position: "relative",
    boxShadow: "0 20px 25px -5px rgba(0,0,0,0.25)",
  };

  const closeButtonStyle: CSSProperties = {
    position: "absolute",
    top: "0.9rem",
    right: "0.9rem",
    background: "rgba(255,255,255,0.92)",
    border: "none",
    borderRadius: "50%",
    width: "28px",
    height: "28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    color: "#334155",
    zIndex: 3,
    boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
  };

  return (
    <div style={overlayStyle} onClick={tutupPopup}>
      <div style={modalCardStyle} onClick={(e) => e.stopPropagation()}>
        {bisaDitutup && (
          <button type="button" onClick={tutupPopup} style={closeButtonStyle}><IconX /></button>
        )}

        {toast.tampil && (
          <div style={{ position: "absolute", top: "0.9rem", left: "0.9rem", right: bisaDitutup ? "3.2rem" : "0.9rem", background: toast.tipe === "sukses" ? WARNA_UTAMA : "#EF4444", color: "white", padding: "0.55rem 0.9rem", borderRadius: "8px", fontWeight: 600, fontSize: "0.78rem", boxShadow: "0 6px 16px -4px rgba(0,0,0,0.25)", zIndex: 4, display: "flex", alignItems: "center", gap: "6px" }}>
            <IconCheckCircle /> {toast.pesan}
          </div>
        )}

        {effectiveMode === "view" && (
          <div>
            <div style={{ background: `linear-gradient(135deg, ${WARNA_UTAMA}, ${WARNA_UTAMA_GELAP})`, height: "130px", position: "relative", borderRadius: "14px 14px 0 0" }} />

            <div style={{ padding: "0 1.5rem 0.5rem", marginTop: "-45px", textAlign: "center", position: "relative", zIndex: 2 }}>
              <div style={{ display: "inline-block", marginBottom: "0.5rem" }}>
                <div style={{ width: "90px", height: "90px", borderRadius: "50%", background: "#FEF3C7", color: WARNA_UTAMA, display: "flex", alignItems: "center", justifyContent: "center", border: "4px solid white", overflow: "hidden", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  {subHalaman === "toko" ? (
                    form.fotoTokoUrl ? <img src={form.fotoTokoUrl} alt="Logo Toko" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{inisialToko}</span>
                  ) : (
                    form.fotoAvatarPemilik ? <img src={form.fotoAvatarPemilik} alt="Avatar Pemilik" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "1.5rem", fontWeight: 700 }}>{form.nama_pemilik.slice(0, 2).toUpperCase()}</span>
                  )}
                </div>
              </div>

              <div style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{form.nama_toko || "Nama Toko Belum Diisi"}</div>
              <div style={{ fontSize: "0.85rem", color: "#64748B", marginBottom: "0.5rem" }}>Pemilik Resmi: <span style={{ color: "#1E293B", fontWeight: 600 }}>{form.nama_pemilik}</span></div>
              <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", background: "#FEF3C7", color: "#92400E", fontSize: "0.7rem", fontWeight: 600, padding: "0.2rem 0.6rem", borderRadius: "999px" }}><IconCheckCircle /> Admin Toko Aktif</span>
            </div>

            <div style={{ display: "flex", borderBottom: "1px solid #F1F5F9", background: "#F8FAFC", padding: "4px" }}>
              <button onClick={() => setSubHalaman("toko")} style={{ flex: 1, padding: "0.5rem", border: "none", borderRadius: "6px", background: subHalaman === "toko" ? "white" : "transparent", color: subHalaman === "toko" ? WARNA_UTAMA : "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>Pindah ke Profil Toko</button>
              <button onClick={() => setSubHalaman("pemilik")} style={{ flex: 1, padding: "0.5rem", border: "none", borderRadius: "6px", background: subHalaman === "pemilik" ? "white" : "transparent", color: subHalaman === "pemilik" ? WARNA_UTAMA_GELAP : "#64748B", fontWeight: 600, cursor: "pointer", fontSize: "0.8rem" }}>Pindah ke Profil Pemilik</button>
            </div>

            <div style={{ padding: "1.25rem 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.85rem", textAlign: "left" }}>
              {subHalaman === "toko" ? (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <span style={{ color: WARNA_UTAMA, background: "#FEF3C7", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMapPin /></span>
                    <div>
                      <div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Alamat Operasional Toko</div>
                      <div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.alamat || "Belum melengkapi lokasi fisik"} {form.desa && `, Des. ${form.desa}`} {form.kecamatan && `, Kec. ${form.kecamatan}`} {form.kabupaten && `, ${form.kabupaten}`} {form.provinsi && `, ${form.provinsi}`}</div>
                    </div>
                  </div>
                  <button onClick={() => setMode("editToko")} style={{ marginTop: "0.5rem", padding: "0.6rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>Edit Profil Toko</button>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <span style={{ color: WARNA_UTAMA_GELAP, background: "#FEF3C7", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconPhone /></span>
                    <div><div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Nomor WhatsApp Hubungan</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.phone_user}</div></div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
                    <span style={{ color: WARNA_UTAMA_GELAP, background: "#FEF3C7", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></span>
                    <div><div style={{ fontSize: "0.65rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Korespondensi Email Akun</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{form.email_user}</div></div>
                  </div>
                  <button onClick={() => setMode("editPemilik")} style={{ marginTop: "0.5rem", padding: "0.6rem", borderRadius: "8px", border: "none", background: WARNA_UTAMA_GELAP, color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.88rem" }}>Edit Kontak & KTP Pemilik</button>
                </>
              )}
            </div>
          </div>
        )}

        {effectiveMode === "editToko" && (
          <form onSubmit={handleTokoSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem", padding: "1.25rem" }}>
            <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.5rem" }}>
              {wajibLengkapi ? "Lengkapi Profil Toko Anda" : "Edit Pengaturan Profil Toko"}
            </div>
            {wajibLengkapi && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", color: "#92400E", padding: "0.7rem 0.85rem", borderRadius: "8px", fontSize: "0.78rem", fontWeight: 600 }}>
                Isi data toko di bawah ini agar fitur operasional toko anda aktif.
              </div>
            )}
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, color: "#94A3B8", marginBottom: "0.4rem" }}>UPLOAD FOTO PROFIL TOKO / LOGO</label>
              <div onClick={() => fileTokoRef.current?.click()} style={{ border: `1.5px dashed ${WARNA_UTAMA}`, background: "#FFFBEB", borderRadius: "10px", height: "100px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden" }}>
                {form.fotoTokoUrl ? <img src={form.fotoTokoUrl} alt="Toko" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ fontSize: "0.75rem", color: WARNA_UTAMA_GELAP }}>Pilih foto profil toko anda</span>}
              </div>
              <input ref={fileTokoRef} type="file" accept="image/*" onChange={handleFotoTokoChange} style={{ display: "none" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Nama Toko *</label>
              <input required value={form.nama_toko} onChange={(e) => setForm({ ...form, nama_toko: e.target.value })} placeholder="Contoh: Toko Sembako Berkah" style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.25rem" }}>Alamat Jalan Toko *</label>
              <input required value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} placeholder="Nama Jalan, Blok, dan Nomor" style={{ width: "100%", padding: "0.5rem 0.7rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.85rem", boxSizing: "border-box" }} />
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
              {!wajibLengkapi && (
                <button type="button" onClick={() => setMode("view")} style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", fontSize: "0.85rem" }}>Batal</button>
              )}
              <button type="submit" style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "none", background: WARNA_UTAMA, color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Simpan Data Toko</button>
            </div>
          </form>
        )}

        {effectiveMode === "editPemilik" && (
          <form onSubmit={handlePemilikSubmit} style={{ display: "flex", flexDirection: "column", gap: "0.8rem", padding: "1.25rem" }}>
            <div style={{ fontWeight: 700, color: "#1E293B", fontSize: "1rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.5rem" }}>Edit Pengaturan Akun Pemilik</div>
            <div style={{ textAlign: "center" }}>
              <div onClick={() => fileAvatarRef.current?.click()} style={{ display: "inline-block", position: "relative", cursor: "pointer" }}>
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", background: "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", border: `2px dashed ${WARNA_UTAMA_GELAP}` }}>
                  {form.fotoAvatarPemilik ? <img src={form.fotoAvatarPemilik} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <span style={{ color: WARNA_UTAMA_GELAP, fontSize: "0.75rem" }}>Pilih Foto</span>}
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, background: WARNA_UTAMA_GELAP, padding: "4px", borderRadius: "50%", color: "white" }}><IconCamera /></div>
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
              <button type="button" onClick={() => { setPasswordBaru(""); setKonfirmasiPassword(""); setMode("view"); }} style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "1px solid #E2E8F0", background: "white", fontSize: "0.85rem" }}>Batal</button>
              <button type="submit" style={{ flex: 1, padding: "0.55rem", borderRadius: "6px", border: "none", background: WARNA_UTAMA_GELAP, color: "white", fontWeight: 600, fontSize: "0.85rem" }}>Simpan Data Diri</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}