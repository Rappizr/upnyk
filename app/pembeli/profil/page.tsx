"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  UserIcon, LocationIcon, StarIcon, CameraIcon, SaveIcon, DollarIcon
} from "@/components/ProductIcons";

export default function ProfilPage() {
  const [tab, setTab] = useState("biodata");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("");
  const [addresses, setAddresses] = useState<any[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const res = await fetch("/api/profile");
        const data = await res.json();
        setName(data.name || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setBio(data.bio || "");
        setAddresses(data.addresses || []);
        setPaymentMethods(data.payment_methods || []);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, bio })
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const stats = [
    { label: "Total Pesanan", value: "32" },
    { label: "Pengeluaran", value: "Rp 4,2 Jt" },
    { label: "Poin Loyalitas", value: "1.840" },
    { label: "Level", value: "Gold" },
  ];

  return (
    <AppLayout>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <UserIcon size={28} className="text-primary" /> Profil Saya
      </h1>
      <p className="page-subtitle">Kelola data diri, alamat, dan metode pembayaran Anda</p>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat profil...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "280px 1fr", gap: "1.25rem" }}>
          {/* Left Panel */}
          <div>
            <div className="card" style={{ textAlign: "center", marginBottom: "1rem" }}>
              <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg, var(--color-primary), var(--color-secondary))", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 0.875rem", fontSize: "2rem", color: "white", fontWeight: 800 }}>
                {name ? name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "U"}
              </div>
              <div className="font-bold text-lg">{name}</div>
              <div className="text-sm text-muted">{email}</div>
              <div className="badge badge-warning" style={{ marginTop: "0.625rem", display: "inline-flex", alignItems: "center", gap: "0.25rem" }}>
                <StarIcon size={12} fill="currentColor" /> Gold Member
              </div>
              <button className="btn-ghost" style={{ width: "100%", marginTop: "1rem", fontSize: "0.8rem", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: "0.35rem" }} id="btn-ubah-foto">
                <CameraIcon size={14} /> Ubah Foto
              </button>
            </div>

            {/* Stats */}
            <div className="card">
              <div className="text-sm font-semibold" style={{ marginBottom: "0.875rem" }}>📊 Statistik Saya</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
                {stats.map((s, i) => (
                  <div key={i} style={{ background: "var(--color-bg)", borderRadius: "var(--radius-sm)", padding: "0.75rem", textAlign: "center" }}>
                    <div className="font-bold" style={{ fontSize: "1.1rem", color: "var(--color-primary)" }}>{s.value}</div>
                    <div className="text-xs text-muted">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Panel */}
          <div>
            {/* Inner Tabs */}
            <div className="tabs" style={{ marginBottom: "1.25rem" }}>
              {[
                ["biodata", "Biodata", <UserIcon size={16} key="bio" />], 
                ["alamat", "Alamat", <LocationIcon size={16} key="addr" />], 
                ["pembayaran", "Pembayaran", <DollarIcon size={16} key="pay" />]
              ].map(([key, label, icon]) => (
                <button key={key as string} className={`tab-btn${tab === key ? " active" : ""}`} onClick={() => setTab(key as string)} id={`profil-tab-${key}`} style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
                  {icon} {label as string}
                </button>
              ))}
            </div>

            {/* Biodata */}
            {tab === "biodata" && (
              <div className="card">
                <div className="text-sm font-semibold" style={{ marginBottom: "1rem" }}>Informasi Pribadi</div>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Nama Lengkap</label>
                    <input className="form-input" value={name} onChange={(e) => setName(e.target.value)} id="input-name" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input className="form-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} id="input-email" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor Telepon</label>
                    <input className="form-input" value={phone} onChange={(e) => setPhone(e.target.value)} id="input-phone" />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Lahir</label>
                    <input className="form-input" type="date" defaultValue="1995-08-17" id="input-dob" />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Tentang Saya</label>
                  <textarea className="form-input" rows={3} value={bio} onChange={(e) => setBio(e.target.value)} id="input-bio" style={{ resize: "vertical" }} />
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                  <button className="btn-primary" onClick={handleSave} id="btn-simpan-biodata" style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <SaveIcon size={14} /> Simpan Perubahan
                  </button>
                  {saved && <span className="badge badge-success">✓ Berhasil disimpan!</span>}
                </div>
              </div>
            )}

            {/* Alamat */}
            {tab === "alamat" && (
              <div>
                {addresses.map((addr) => (
                  <div key={addr.id} className="card" style={{ marginBottom: "0.875rem", borderLeft: addr.default ? "3px solid var(--color-primary)" : undefined }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.375rem" }}>
                          <span className="font-semibold text-sm">{addr.label}</span>
                          {addr.default && <span className="badge badge-info">Utama</span>}
                        </div>
                        <div className="text-sm">{addr.address}</div>
                        <div className="text-sm text-muted">{addr.city}</div>
                      </div>
                      <div style={{ display: "flex", gap: "0.5rem" }}>
                        <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.625rem" }} id={`btn-edit-addr-${addr.id}`}>Edit</button>
                        {!addr.default && <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.625rem", color: "var(--color-alert)" }} id={`btn-del-addr-${addr.id}`}>Hapus</button>}
                      </div>
                    </div>
                  </div>
                ))}
                <button className="btn-ghost" style={{ width: "100%" }} id="btn-tambah-alamat">
                  + Tambah Alamat Baru
                </button>
              </div>
            )}

            {/* Pembayaran */}
            {tab === "pembayaran" && (
              <div>
                {paymentMethods.map((pm, i) => (
                  <div key={i} className="card" style={{ marginBottom: "0.875rem", display: "flex", alignItems: "center", gap: "1rem", borderLeft: pm.default ? "3px solid var(--color-secondary)" : undefined }}>
                    <div style={{ width: 44, height: 44, borderRadius: "var(--radius-sm)", background: "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--color-primary)" }}>
                      <DollarIcon size={20} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                        <span className="font-semibold text-sm">{pm.name}</span>
                        {pm.default && <span className="badge badge-success">Utama</span>}
                      </div>
                      <div className="text-sm text-muted">{pm.detail}</div>
                    </div>
                    <button className="btn-ghost" style={{ fontSize: "0.75rem", padding: "0.3rem 0.625rem" }} id={`btn-edit-pm-${i}`}>Kelola</button>
                  </div>
                ))}
                <button className="btn-ghost" style={{ width: "100%" }} id="btn-tambah-pembayaran">
                  + Tambah Metode Pembayaran
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </AppLayout>
  );
}

