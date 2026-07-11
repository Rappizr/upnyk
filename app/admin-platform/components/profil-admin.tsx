"use client";

import { useRef, useState, FormEvent, ChangeEvent } from "react";

export interface ProfilAdmin {
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
}

const jabatanStyle: Record<ProfilAdmin["jabatan"], { bg: string; color: string }> = {
  "Super Admin": { bg: "#EFF6FF", color: "#2563EB" },
  "Admin Operasional": { bg: "#ECFDF5", color: "#059669" },
  "Admin Teknis": { bg: "#FEF3C7", color: "#92400E" },
};

const IconCamera = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconCalendar = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>;
const IconBadge = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="6"></circle><path d="M15.5 13.5 17 22l-5-3-5 3 1.5-8.5"></path></svg>;

export default function ProfilAdminPage({ profil, setProfil }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profil);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfil({ ...profil, fotoUrl: reader.result as string });
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const inisial = form.nama.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    setProfil({ ...form, inisial: inisial || profil.inisial });
    setEditing(false);
  }

  const j = jabatanStyle[profil.jabatan];

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", maxWidth: "640px" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Profil Admin</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Data identitas kamu sebagai pengelola platform — tampil di header dan log aktivitas sistem.</p>
      </div>

      {!editing ? (
        <div style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
          <div style={{ background: "linear-gradient(135deg, #1E293B, #0F172A)", height: "100px" }} />
          <div style={{ padding: "0 1.5rem 1.5rem", marginTop: "-48px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div style={{ width: "92px", height: "92px", borderRadius: "50%", background: "#1E293B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.7rem", fontWeight: 700, border: "4px solid white", overflow: "hidden" }}>
                  {profil.fotoUrl ? <img src={profil.fotoUrl} alt="Foto profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
                </div>
                <button onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: "28px", height: "28px", borderRadius: "50%", background: "#2563EB", color: "white", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Ubah foto profil">
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>
              <div style={{ paddingBottom: "0.5rem" }}>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{profil.nama}</div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: j.bg, color: j.color, fontSize: "0.72rem", fontWeight: 700, padding: "0.25rem 0.6rem", borderRadius: "999px", marginTop: "0.35rem" }}><IconBadge /> {profil.jabatan}</span>
              </div>
            </div>
          </div>
          <div style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span style={{ color: "#2563EB", background: "#EFF6FF", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></span>
              <div><div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Email</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{profil.email}</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span style={{ color: "#2563EB", background: "#EFF6FF", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconPhone /></span>
              <div><div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Telepon</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{profil.telepon}</div></div>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span style={{ color: "#2563EB", background: "#EFF6FF", width: "32px", height: "32px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconCalendar /></span>
              <div><div style={{ fontSize: "0.68rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Bergabung Sejak</div><div style={{ fontSize: "0.88rem", color: "#1E293B" }}>{profil.bergabung}</div></div>
            </div>
            <button onClick={() => { setForm(profil); setEditing(true); }} style={{ marginTop: "0.4rem", padding: "0.65rem", borderRadius: "8px", border: "none", background: "#1E293B", color: "white", fontWeight: 600, cursor: "pointer" }}>Edit Profil</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Lengkap</label>
            <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Jabatan</label>
            <select value={form.jabatan} onChange={(e) => setForm({ ...form, jabatan: e.target.value as ProfilAdmin["jabatan"] })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", background: "white" }}>
              <option value="Super Admin">Super Admin</option>
              <option value="Admin Operasional">Admin Operasional</option>
              <option value="Admin Teknis">Admin Teknis</option>
            </select>
          </div>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Telepon</label>
              <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none" }} />
            </div>
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
            <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#1E293B", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Perubahan</button>
          </div>
        </form>
      )}
    </main>
  );
}