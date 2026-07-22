"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { FormEvent, ChangeEvent, ReactElement } from "react";
import { supabase } from "@/lib/db";

export interface ProfilAdmin {
  id?: string;
  profile_id?: string;
  nama: string;
  jabatan: "Super Admin" | "Admin Operasional" | "Admin Teknis";
  email: string;
  telepon: string;
  bergabung: string;
  inisial: string;
  fotoUrl?: string;
}

interface Props {
  profil: ProfilAdmin;
  setProfil: (p: ProfilAdmin) => void;
  onClose?: () => void;
}

type TabKey = "jabatan" | "kontak";

const jabatanStyle: Record<ProfilAdmin["jabatan"], { bg: string; color: string }> = {
  "Super Admin": { bg: "#EFF6FF", color: "#2563EB" },
  "Admin Operasional": { bg: "#ECFDF5", color: "#059669" },
  "Admin Teknis": { bg: "#FEF3C7", color: "#D97706" },
};

const IconCamera = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconBadge = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"></path></svg>;
const IconX = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const IconLock = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>;

function DetailItem({ icon, label, value }: { icon: () => ReactElement; label: string; value: string }) {
  const Icon = icon;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.75rem 0.9rem", background: "#F8FAFC", borderRadius: "10px", border: "1px solid #F1F5F9" }}>
      <div style={{ color: "#2563EB", background: "#EFF6FF", width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <Icon />
      </div>
      <div style={{ minWidth: 0, flex: 1 }}>
        <div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700, letterSpacing: "0.04em" }}>{label}</div>
        <div style={{ fontSize: "0.88rem", color: "#1E293B", fontWeight: 600, marginTop: "0.1rem", wordBreak: "break-word" }}>{value}</div>
      </div>
    </div>
  );
}

export default function ProfilAdminPage({ profil, setProfil, onClose }: Props) {
  const [editing, setEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState<TabKey>("jabatan");
  const [form, setForm] = useState(profil);
  const [passwordBaru, setPasswordBaru] = useState("");
  const [passwordKonfirmasi, setPasswordKonfirmasi] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);
  const fileRefEdit = useRef<HTMLInputElement>(null);

  const muatProfilLive = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: adminData } = await supabase
        .from("admin_platform")
        .select("id, profile_id, nama_lengkap, jabatan, no_hp, foto, created_at")
        .eq("profile_id", user.id)
        .maybeSingle();

      const { data: profileData } = await supabase
        .from("profiles")
        .select("nama, phone, email")
        .eq("id", user.id)
        .maybeSingle();

      const namaLengkap = adminData?.nama_lengkap || profileData?.nama || user.email?.split("@")[0] || profil.nama;
      const inisial = namaLengkap.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "AD";
      const tanggalBergabung = adminData?.created_at ? new Date(adminData.created_at).toLocaleDateString("id-ID", { month: "short", year: "numeric" }) : profil.bergabung;

      const profilBaru: ProfilAdmin = {
        id: adminData?.id,
        profile_id: user.id,
        nama: namaLengkap,
        jabatan: (adminData?.jabatan as ProfilAdmin["jabatan"]) || "Super Admin",
        email: user.email || profil.email,
        telepon: adminData?.no_hp || profileData?.phone || profil.telepon,
        bergabung: tanggalBergabung,
        inisial,
        fotoUrl: adminData?.foto || profil.fotoUrl,
      };

      setProfil(profilBaru);
      setForm(profilBaru);
    } catch (err) {
      console.error("Gagal muat data profil admin:", err);
    }
  }, [profil, setProfil]);

  useEffect(() => {
    muatProfilLive();
  }, [muatProfilLive]);

  async function prosesUnggahFoto(file: File) {
    try {
      setSubmitting(true);
      const reader = new FileReader();
      reader.onload = async () => {
        const base64Photo = reader.result as string;
        if (profil.profile_id) {
          await supabase
            .from("admin_platform")
            .update({ foto: base64Photo })
            .eq("profile_id", profil.profile_id);
        }
        const profilUpdated = { ...profil, fotoUrl: base64Photo };
        setProfil(profilUpdated);
        setForm(profilUpdated);
        setSubmitting(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error("Gagal menyimpan foto:", err);
      setSubmitting(false);
    }
  }

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) prosesUnggahFoto(file);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (submitting) return;

    if (passwordBaru && passwordBaru !== passwordKonfirmasi) {
      alert("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    setSubmitting(true);
    try {
      const inisial = form.nama.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase() || "AD";

      if (profil.profile_id) {
        await supabase
          .from("admin_platform")
          .update({
            nama_lengkap: form.nama,
            jabatan: form.jabatan,
            no_hp: form.telepon,
          })
          .eq("profile_id", profil.profile_id);

        await supabase
          .from("profiles")
          .update({
            nama: form.nama,
            phone: form.telepon,
          })
          .eq("id", profil.profile_id);
      }

      if (passwordBaru && passwordBaru.length >= 6) {
        const { error: errPass } = await supabase.auth.updateUser({ password: passwordBaru });
        if (errPass) {
          alert(`Gagal mengubah kata sandi: ${errPass.message}`);
        } else {
          alert("Kata sandi berhasil diperbarui!");
        }
      }

      const updatedProfil: ProfilAdmin = {
        ...form,
        inisial,
      };

      setProfil(updatedProfil);
      setPasswordBaru("");
      setPasswordKonfirmasi("");
      setEditing(false);
    } catch (err) {
      console.error("Gagal simpan profil admin:", err);
      alert("Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  }

  const j = jabatanStyle[profil.jabatan] || jabatanStyle["Super Admin"];

  return (
    <div style={{ width: "100%", maxWidth: "440px", margin: "0 auto", fontFamily: "sans-serif" }}>
      <div style={{ background: "white", borderRadius: "16px", border: "1px solid #E2E8F0", boxShadow: "0 20px 40px -15px rgba(15,23,42,0.12)", overflow: "hidden" }}>
        
        {!editing ? (
          <div>
            {/* COVER HEADER */}
            <div style={{ background: "linear-gradient(135deg, #0F172A 0%, #1E293B 100%)", height: "90px", position: "relative" }}>
              {onClose && (
                <button
                  onClick={onClose}
                  aria-label="Tutup Modal"
                  style={{ position: "absolute", top: "12px", right: "12px", width: "30px", height: "30px", borderRadius: "50%", background: "rgba(255,255,255,0.15)", color: "#fff", border: "none", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", backdropFilter: "blur(4px)" }}
                >
                  <IconX />
                </button>
              )}
            </div>

            {/* AVATAR & INFO HEADER */}
            <div style={{ padding: "0 1.5rem 1.25rem", marginTop: "-42px", textAlign: "center", position: "relative" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ width: "84px", height: "84px", borderRadius: "50%", background: "#1E293B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", fontWeight: 800, border: "4px solid #ffffff", boxShadow: "0 8px 16px -2px rgba(15,23,42,0.15)", overflow: "hidden", margin: "0 auto" }}>
                  {profil.fotoUrl ? <img src={profil.fotoUrl} alt="Foto profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: "2px", right: "2px", width: "26px", height: "26px", borderRadius: "50%", background: "#2563EB", color: "white", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", boxShadow: "0 2px 6px rgba(0,0,0,0.15)" }} aria-label="Ubah foto profil">
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>

              <h2 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#1E293B", margin: "0.6rem 0 0 0" }}>{profil.nama}</h2>
              <p style={{ fontSize: "0.8rem", color: "#64748B", margin: "0.15rem 0 0.6rem 0" }}>Administrator Platform PasarNusa</p>
              
              <span style={{ display: "inline-flex", alignItems: "center", gap: "6px", background: j.bg, color: j.color, fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.75rem", borderRadius: "999px" }}>
                <IconBadge /> {profil.jabatan}
              </span>
            </div>

            {/* TAB NAVIGASI PILLS */}
            <div style={{ padding: "0 1.25rem", marginBottom: "1rem" }}>
              <div style={{ display: "flex", background: "#F1F5F9", padding: "4px", borderRadius: "10px" }}>
                <button
                  onClick={() => setActiveTab("jabatan")}
                  style={{
                    flex: 1, padding: "0.5rem", borderRadius: "8px", border: "none", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    background: activeTab === "jabatan" ? "white" : "transparent",
                    color: activeTab === "jabatan" ? "#1E293B" : "#64748B",
                    boxShadow: activeTab === "jabatan" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  Informasi Jabatan
                </button>
                <button
                  onClick={() => setActiveTab("kontak")}
                  style={{
                    flex: 1, padding: "0.5rem", borderRadius: "8px", border: "none", fontSize: "0.78rem", fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                    background: activeTab === "kontak" ? "white" : "transparent",
                    color: activeTab === "kontak" ? "#1E293B" : "#64748B",
                    boxShadow: activeTab === "kontak" ? "0 2px 6px rgba(0,0,0,0.06)" : "none",
                  }}
                >
                  Kontak &amp; Akun
                </button>
              </div>
            </div>

            {/* KONTEN DETAIL */}
            <div style={{ padding: "0 1.25rem 1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              {activeTab === "jabatan" ? (
                <>
                  <DetailItem icon={IconBadge} label="Role / Jabatan Akses" value={profil.jabatan} />
                  <DetailItem icon={IconCalendar} label="Tanggal Bergabung" value={profil.bergabung} />
                </>
              ) : (
                <>
                  <DetailItem icon={IconPhone} label="Nomor WhatsApp" value={profil.telepon} />
                  <DetailItem icon={IconMail} label="Alamat Email Utama" value={profil.email} />
                </>
              )}

              <button
                onClick={() => { setForm(profil); setEditing(true); }}
                style={{ marginTop: "0.5rem", width: "100%", padding: "0.7rem", borderRadius: "10px", border: "none", background: "#1E293B", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", transition: "background 0.2s" }}
              >
                Edit Profil &amp; Pengaturan Akun
              </button>
            </div>
          </div>
        ) : (
          /* FORM EDIT MODAL */
          <form onSubmit={handleSubmit} style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.75rem" }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 800, color: "#1E293B" }}>Edit Profil Admin</h3>
              <button type="button" onClick={() => setEditing(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94A3B8" }}><IconX /></button>
            </div>

            {/* EDIT AVATAR */}
            <div style={{ textAlign: "center", margin: "0.25rem 0" }}>
              <div style={{ position: "relative", display: "inline-block" }}>
                <div style={{ width: "70px", height: "70px", borderRadius: "50%", background: "#1E293B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.3rem", fontWeight: 800, overflow: "hidden", margin: "0 auto" }}>
                  {form.fotoUrl ? <img src={form.fotoUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : form.inisial}
                </div>
                <button type="button" onClick={() => fileRefEdit.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: "24px", height: "24px", borderRadius: "50%", background: "#2563EB", color: "white", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Ubah foto profil">
                  <IconCamera />
                </button>
                <input ref={fileRefEdit} type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && prosesUnggahFoto(e.target.files[0])} style={{ display: "none" }} />
              </div>
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>Nama Lengkap *</label>
              <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", color: "#1E293B" }} />
            </div>

            <div>
              <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>Jabatan Admin *</label>
              <select value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value as ProfilAdmin["jabatan"] })} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", background: "white", color: "#1E293B", boxSizing: "border-box" }}>
                <option value="Super Admin">Super Admin</option>
                <option value="Admin Operasional">Admin Operasional</option>
                <option value="Admin Teknis">Admin Teknis</option>
              </select>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>No. WhatsApp *</label>
                <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none", boxSizing: "border-box", color: "#1E293B" }} />
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.75rem", fontWeight: 700, color: "#475569", marginBottom: "0.3rem" }}>Email (Sistem)</label>
                <input type="email" disabled value={form.email} style={{ width: "100%", padding: "0.6rem 0.8rem", borderRadius: "8px", border: "1px solid #E2E8F0", fontSize: "0.85rem", background: "#F8FAFC", color: "#64748B", boxSizing: "border-box" }} />
              </div>
            </div>

            {/* UPDATE PASSWORD */}
            <div style={{ paddingTop: "0.6rem", borderTop: "1px dashed #E2E8F0" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "0.72rem", fontWeight: 700, color: "#64748B", marginBottom: "0.5rem" }}>
                <IconLock /> UBAH KATA SANDI (OPSIONAL)
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                <div>
                  <input type="password" placeholder="Sandi baru" value={passwordBaru} onChange={(e) => setPasswordBaru(e.target.value)} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <input type="password" placeholder="Ulangi sandi" value={passwordKonfirmasi} onChange={(e) => setPasswordKonfirmasi(e.target.value)} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
                </div>
              </div>
            </div>

            {/* BUTTONS */}
            <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.4rem" }}>
              <button type="button" onClick={() => { setEditing(false); setPasswordBaru(""); setPasswordKonfirmasi(""); }} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "1px solid #CBD5E1", background: "white", color: "#475569", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem" }}>
                Batal
              </button>
              <button type="submit" disabled={submitting} style={{ flex: 1, padding: "0.65rem", borderRadius: "8px", border: "none", background: "#2563EB", color: "white", fontWeight: 700, cursor: "pointer", fontSize: "0.82rem", opacity: submitting ? 0.7 : 1 }}>
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}