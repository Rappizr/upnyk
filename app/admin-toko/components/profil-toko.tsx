"use client";

import { useRef, useState } from "react";
import type { FormEvent, ChangeEvent } from "react";

export interface ProfilToko {
  namaToko: string;
  namaPemilik: string;
  alamat: string;
  telepon: string;
  email: string;
  inisial: string;
  fotoUrl?: string;
}

interface Props {
  profil: ProfilToko;
  setProfil: (p: ProfilToko) => void;
}

const IconCamera = () => <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3Z"></path><circle cx="12" cy="13" r="4"></circle></svg>;
const IconMail = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2Z"></path><polyline points="22 6 12 13 2 6"></polyline></svg>;
const IconPhone = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92Z"></path></svg>;
const IconMapPin = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path><circle cx="12" cy="10" r="3"></circle></svg>;

export default function ProfilTokoPage({ profil, setProfil }: Props) {
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
    const inisial = form.namaPemilik.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
    setProfil({ ...form, inisial: inisial || profil.inisial });
    setEditing(false);
  }

  return (
    <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden", width: "100%", maxWidth: "340px", margin: "0 auto" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .store-responsive-scroll-box {
          max-height: 70vh !important;
          overflow-y: auto !important;
          scrollbar-width: thin;
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 768px) {
          .store-cover {
            height: 55px !important;
          }
          .store-avatar-wrapper {
            width: 60px !important;
            height: 60px !important;
            font-size: 1.05rem !important;
            margin-top: -30px !important;
            border-width: 3px !important;
          }
          .store-cam-btn {
            width: 18px !important;
            height: 18px !important;
            border-width: 1.5px !important;
          }
          .store-cam-btn svg {
            width: 8px !important;
            height: 8px !important;
          }
          .store-info-header {
            padding: 0 0.75rem 0.4rem !important;
          }
          .store-name-title {
            font-size: 0.85rem !important;
          }
          .store-owner-subtitle {
            font-size: 0.68rem !important;
          }
          .store-details-list {
            padding: 0 0.75rem 0.75rem !important;
            gap: 0.45rem !important;
          }
          .store-detail-item {
            gap: 0.4rem !important;
          }
          .store-icon-box {
            width: 22px !important;
            height: 22px !important;
            border-radius: 4px !important;
          }
          .store-icon-box svg {
            width: 10px !important;
            height: 10px !important;
          }
          .store-detail-label {
            font-size: 0.5rem !important;
          }
          .store-detail-value {
            font-size: 0.68rem !important;
            line-height: 1.15 !important;
          }
          .store-form-padding {
            padding: 0.75rem !important;
          }
          .form-row-mobile {
            flex-direction: column !important;
            gap: 0.5rem !important;
          }
          form label {
            font-size: 0.65rem !important;
          }
          form button, form input {
            padding: 0.35rem 0.5rem !important;
            font-size: 0.7rem !important;
            border-radius: 4px !important;
          }
          .store-details-list button {
            padding: 0.4rem !important;
            font-size: 0.7rem !important;
            border-radius: 5px !important;
            margin-top: 0.2rem !important;
          }
        }
      `}} />

      <div className="store-responsive-scroll-box">
        {!editing ? (
          <>
            <div className="store-cover" style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)", height: "75px" }} />
            <div className="store-info-header" style={{ padding: "0 1rem 0.75rem", marginTop: "-35px" }}>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "0.6rem", flexWrap: "wrap" }}>
                <div style={{ position: "relative", flexShrink: 0 }}>
                  <div className="store-avatar-wrapper" style={{ width: "72px", height: "72px", borderRadius: "50%", background: "#F59E0B", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.35rem", fontWeight: 700, border: "4px solid white", overflow: "hidden" }}>
                    {profil.fotoUrl ? <img src={profil.fotoUrl} alt="Foto toko" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : profil.inisial}
                  </div>
                  <button className="store-cam-btn" onClick={() => fileRef.current?.click()} style={{ position: "absolute", bottom: 0, right: 0, width: "22px", height: "22px", borderRadius: "50%", background: "#F59E0B", color: "white", border: "2px solid white", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer" }} aria-label="Ubah foto toko">
                    <IconCamera />
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
                </div>
                <div style={{ paddingBottom: "0.1rem", minWidth: 0, flex: 1 }}>
                  <div className="store-name-title" style={{ fontSize: "1rem", fontWeight: 700, color: "#1E293B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profil.namaToko}</div>
                  <div className="store-owner-subtitle" style={{ fontSize: "0.75rem", color: "#64748B", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{profil.namaPemilik}</div>
                </div>
              </div>
            </div>
            
            <div className="store-details-list" style={{ padding: "0 1rem 1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
              <div className="store-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="store-icon-box" style={{ color: "#D97706", background: "#FEF3C7", width: "26px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMapPin /></span>
                <div><div className="store-detail-label" style={{ fontSize: "0.6rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Alamat Toko</div><div className="store-detail-value" style={{ fontSize: "0.75rem", color: "#1E293B" }}>{profil.alamat}</div></div>
              </div>
              <div className="store-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="store-icon-box" style={{ color: "#D97706", background: "#FEF3C7", width: "26px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconPhone /></span>
                <div><div className="store-detail-label" style={{ fontSize: "0.6rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Telepon</div><div className="store-detail-value" style={{ fontSize: "0.75rem", color: "#1E293B" }}>{profil.telepon}</div></div>
              </div>
              <div className="store-detail-item" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                <span className="store-icon-box" style={{ color: "#D97706", background: "#FEF3C7", width: "26px", height: "24px", borderRadius: "5px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}><IconMail /></span>
                <div><div className="store-detail-label" style={{ fontSize: "0.6rem", color: "#94A3B8", textTransform: "uppercase", fontWeight: 700 }}>Email</div><div className="store-detail-value" style={{ fontSize: "0.75rem", color: "#1E293B" }}>{profil.email}</div></div>
              </div>
              <button onClick={() => { setForm(profil); setEditing(true); }} style={{ marginTop: "0.2rem", padding: "0.5rem", borderRadius: "6px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer", fontSize: "0.75rem" }}>Edit Profil Toko</button>
            </div>
          </>
        ) : (
          <form className="store-form-padding" onSubmit={handleSubmit} style={{ padding: "1rem", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "#334155", marginBottom: "0.2rem" }}>Nama Toko/UMKM</label>
              <input required value={form.namaToko} onChange={(e) => setForm({ ...form, namaToko: e.target.value })} style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "5px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "#334155", marginBottom: "0.2rem" }}>Nama Pemilik</label>
              <input required value={form.namaPemilik} onChange={(e) => setForm({ ...form, namaPemilik: e.target.value })} style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "5px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "#334155", marginBottom: "0.2rem" }}>Alamat Toko</label>
              <input required value={form.alamat} onChange={(e) => setForm({ ...form, alamat: e.target.value })} style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "5px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
            </div>
            <div className="form-row-mobile" style={{ display: "flex", gap: "0.4rem" }}>
              <div style={{ flex: 1, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "#334155", marginBottom: "0.2rem" }}>Telepon</label>
                <input value={form.telepon} onChange={(e) => setForm({ ...form, telepon: e.target.value })} style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "5px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
              </div>
              <div style={{ flex: 1, width: "100%" }}>
                <label style={{ display: "block", fontSize: "0.7rem", fontWeight: 600, color: "#334155", marginBottom: "0.2rem" }}>Email</label>
                <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ width: "100%", padding: "0.4rem 0.6rem", borderRadius: "5px", border: "1px solid #CBD5E1", fontSize: "0.8rem", outline: "none", boxSizing: "border-box" }} />
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.4rem", marginTop: "0.3rem" }}>
              <button type="button" onClick={() => setEditing(false)} style={{ flex: 1, padding: "0.45rem", borderRadius: "5px", border: "1px solid #E2E8F0", background: "white", color: "#334155", fontWeight: 600, cursor: "pointer" }}>Batal</button>
              <button type="submit" style={{ flex: 1, padding: "0.45rem", borderRadius: "5px", border: "none", background: "#F59E0B", color: "white", fontWeight: 600, cursor: "pointer" }}>Simpan</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}