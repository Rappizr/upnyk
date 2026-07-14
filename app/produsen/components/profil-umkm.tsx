"use client";

import { useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

interface Profil {
  nama: string;
  usaha: string;
  alamat: string;
  telepon: string;
  email: string;
  kategori: string;
  terverifikasi: boolean;
  inisial: string;
  fotoUrl?: string;
}

interface Props {
  profil: Profil;
  onUpdateProfil: (p: Profil) => void;
}

const IconUser = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>;
const IconMapPin = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;
const IconPhone = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconMail = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconCheckCircle = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const IconCamera = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;

export default function ProfilUMKM({ profil, onUpdateProfil }: Props) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profil);
  const fileRef = useRef<HTMLInputElement>(null);

  function handleFotoChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const fotoUrl = reader.result as string;
      onUpdateProfil({ ...profil, fotoUrl });
    };
    reader.readAsDataURL(file);
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const inisial = form.nama
      .replace(/^(Pak|Bu|Ibu)\s+/i, "")
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
    onUpdateProfil({ ...form, inisial: inisial || profil.inisial });
    setEditing(false);
  }

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)", maxWidth: "640px", boxSizing: "border-box", width: "100%" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          main {
            padding: 0.5rem 0.25rem !important;
          }
          main h1 {
            font-size: 1.15rem !important;
          }
          main p {
            font-size: 0.62rem !important;
            line-height: 1.2 !important;
          }
          .profile-cover {
            height: 70px !important;
          }
          .profile-avatar-wrapper {
            width: 70px !important;
            height: 70px !important;
            font-size: 1.35rem !important;
            margin-top: -35px !important;
          }
          .profile-cam-btn {
            width: 24px !important;
            height: 24px !important;
            border-width: 2px !important;
          }
          .profile-cam-btn svg {
            width: 10px !important;
            height: 10px !important;
          }
          .profile-info-block {
            padding: 0px 0.75rem 1rem !important;
          }
          .profile-name-title {
            font-size: 0.95rem !important;
          }
          .profile-usaha-subtitle {
            font-size: 0.72rem !important;
          }
          .verified-badge {
            padding: 0.15rem 0.4rem !important;
            font-size: 0.55rem !important;
            gap: 3px !important;
            margin-top: 0.25rem !important;
          }
          .profile-details-list {
            padding: 0px 0.75rem 1rem !important;
            gap: 0.6rem !important;
          }
          .profile-detail-item {
            gap: 0.5rem !important;
          }
          .profile-icon-box {
            width: 26px !important;
            height: 26px !important;
            border-radius: 6px !important;
          }
          .profile-icon-box svg {
            width: 12px !important;
            height: 12px !important;
          }
          .profile-detail-label {
            font-size: 0.52rem !important;
          }
          .profile-detail-value {
            font-size: 0.72rem !important;
          }
          .form-row-mobile {
            flex-direction: column !important;
            gap: 0px !important;
          }
          main button, main input, main select {
            padding: 0.45rem 0.65rem !important;
            font-size: 0.75rem !important;
            border-radius: 6px !important;
          }
        }
      `}} />

      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.75rem", fontWeight: 700, color: "#1E293B" }}>Profil UMKM</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.95rem" }}>Data ini tampil di kartu sambutan dashboard dan dokumen resmi pesanan.</p>
      </div>

      {!editing ? (
        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: "14px", overflow: "hidden" }}>
          <div className="profile-cover" style={{ background: "linear-gradient(135deg, #10B981, #059669)", height: "110px", position: "relative" }} />
          <div className="profile-info-block" style={{ padding: "0 1.5rem 1rem", marginTop: "-52px" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: "1rem", flexWrap: "wrap" }}>
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div className="profile-avatar-wrapper" style={{ width: "100px", height: "100px", borderRadius: "50%", background: "#ECFDF5", color: "#10B981", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", fontWeight: 700, border: "4px solid white", overflow: "hidden" }}>
                  {profil.fotoUrl ? <img src={profil.fotoUrl} alt="Foto profil" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
                </div>
                <button className="profile-cam-btn" onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: "30px", height: "30px", borderRadius: "50%", background: "#10B981", color: "white", border: "3px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Ubah foto profil">
                  <IconCamera />
                </button>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </div>
              <div style={{ paddingBottom: "0.25rem" }}>
                <div className="profile-name-title" style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>{profil.nama}</div>
                <div className="profile-usaha-subtitle" style={{ fontSize: "0.9rem", color: "#64748B" }}>{profil.usaha}</div>
                {profil.terverifikasi && (
                  <span className="verified-badge" style={{ display: "inline-flex", alignItems: "center", gap: "5px", background: "#D1FAE5", color: "#065F46", fontSize: "0.72rem", fontWeight: 600, padding: "0.25rem 0.6rem", borderRadius: "999px", marginTop: "0.4rem" }}><IconCheckCircle /> Terverifikasi</span>
                )}
              </div>
            </div>
          </div>
          <div className="profile-details-list" style={{ padding: "0 1.5rem 1.5rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <div className="profile-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span className="profile-icon-box" style={{ color: "#10B981", background: "#ECFDF5", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconMapPin /></span>
              <div><div className="profile-detail-label" style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Alamat Usaha</div><div className="profile-detail-value" style={{ fontSize: "0.9rem", color: "#1E293B" }}>{profil.alamat}</div></div>
            </div>
            <div className="profile-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span className="profile-icon-box" style={{ color: "#10B981", background: "#ECFDF5", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconPhone /></span>
              <div><div className="profile-detail-label" style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Telepon</div><div className="profile-detail-value" style={{ fontSize: "0.9rem", color: "#1E293B" }}>{profil.telepon}</div></div>
            </div>
            <div className="profile-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span className="profile-icon-box" style={{ color: "#10B981", background: "#ECFDF5", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconMail /></span>
              <div><div className="profile-detail-label" style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Email</div><div className="profile-detail-value" style={{ fontSize: "0.9rem", color: "#1E293B" }}>{profil.email}</div></div>
            </div>
            <div className="profile-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.7rem" }}>
              <span className="profile-icon-box" style={{ color: "#10B981", background: "#ECFDF5", width: "34px", height: "34px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}><IconUser /></span>
              <div><div className="profile-detail-label" style={{ fontSize: "0.7rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Kategori Usaha</div><div className="profile-detail-value" style={{ fontSize: "0.9rem", color: "#1E293B" }}>{profil.kategori}</div></div>
            </div>
            <button onClick={() => { setForm(profil); setEditing(true); }} style={{ marginTop: "0.5rem", padding: "0.65rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Edit Profil</button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ background: "white", borderRadius: "14px", border: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column", gap: "0.9rem" }}>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Pemilik</label>
            <input required value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Nama Usaha</label>
            <input required value={form.usaha} onChange={(e) => setForm({ ...form, usaha: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Alamat Usaha</label>
            <input required value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div className="form-row-mobile" style={{ display: "flex", gap: "0.6rem" }}>
            <div style={{ flex: 1, width: "100%" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Telepon</label>
              <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div style={{ flex: 1, width: "100%" }}>
              <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 600, color: "#334155", marginBottom: "0.3rem" }}>Kategori Usaha</label>
            <input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} style={{ width: "100%", padding: "0.55rem 0.75rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.9rem", outline: "none", boxSizing: "border-box" }} />
          </div>
          <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
            <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
            <button type="submit" style={{ flex: 1, padding: "0.6rem", borderRadius: "8px", border: "none", background: "#10B981", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan Perubahan</button>
          </div>
        </form>
      )}
    </main>
  );
}