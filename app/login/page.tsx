"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type Role = "pembeli" | "produsen" | "admin_toko" | "admin_platform";

interface RoleConfig {
  title: string;
  description: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  email: string;
  redirectUrl: string;
}

const roleConfigs: Record<Role, RoleConfig> = {
  pembeli: {
    title: "Pembeli",
    description: "Belanja komoditas & pantau rantai pasok lokal B2B/B2C",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    ),
    color: "var(--color-primary)",
    bgColor: "var(--color-primary-light)",
    email: "arif.pembeli@lural.com",
    redirectUrl: "/pembeli",
  },
  produsen: {
    title: "Produsen / UMKM",
    description: "Kelola hasil bumi, stok gudang & distribusi rantai pasok",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    color: "var(--color-secondary)",
    bgColor: "var(--color-secondary-light)",
    email: "budi.produsen@lural.com",
    redirectUrl: "/produsen",
  },
  admin_toko: {
    title: "Admin Toko",
    description: "Atur katalog produk, proses pesanan & layanan pelanggan",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
        <path d="m3 9 2.44-4A2 2 0 0 1 7.18 4h9.64a2 2 0 0 1 1.74 1L21 9" />
        <path d="M9 14h6" />
      </svg>
    ),
    color: "var(--color-warning)",
    bgColor: "var(--color-warning-light)",
    email: "citra.toko@lural.com",
    redirectUrl: "/admin-toko",
  },
  admin_platform: {
    title: "Admin Platform",
    description: "Monitor metrik ekosistem, kelola role & konfigurasi sistem",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
    ),
    color: "var(--color-text)",
    bgColor: "#F1F5F9",
    email: "dharma.admin@lural.com",
    redirectUrl: "/admin-platform",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("pembeli");
  const [email, setEmail] = useState(roleConfigs.pembeli.email);
  const [password, setPassword] = useState("••••••••");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].email);
    setPassword("12345678"); // Mock password
    setError("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);
      const config = roleConfigs[selectedRole];
      router.push(config.redirectUrl);
    }, 1200);
  };

  const activeConfig = roleConfigs[selectedRole];

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #F8FAFC 0%, #E2E8F0 100%)",
        padding: "2rem",
      }}
    >
      {/* Decorative Blur Orbs */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "300px",
          height: "300px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "350px",
          height: "350px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(50px)",
          zIndex: 0,
        }}
      />

      <div
        style={{
          width: "100%",
          maxWidth: "1000px",
          display: "grid",
          gridTemplateColumns: "1.1fr 0.9fr",
          background: "var(--color-card-bg)",
          borderRadius: "var(--radius-lg)",
          boxShadow: "var(--shadow-lg)",
          overflow: "hidden",
          border: "1px solid var(--color-border)",
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Left Side: Role Selector & Branding */}
        <div style={{ padding: "3rem", borderRight: "1px solid var(--color-border)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#2563EB" />
              <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
            </svg>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary)" }}>
              Pasar<span style={{ color: "var(--color-secondary)" }}>Nusa</span>
            </span>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--color-text)", marginBottom: "0.5rem" }}>
            Selamat Datang Kembali
          </h2>
          <p style={{ color: "var(--color-text-muted)", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Pilih jenis akun Anda untuk masuk ke sistem PasarNusa & Supply Chain.
          </p>

          {/* Role Grid */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {(Object.keys(roleConfigs) as Role[]).map((roleKey) => {
              const config = roleConfigs[roleKey];
              const isSelected = selectedRole === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => handleRoleSelect(roleKey)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "1.25rem",
                    padding: "1.25rem",
                    borderRadius: "var(--radius-md)",
                    border: isSelected ? `2.5px solid ${config.color}` : "1.5px solid var(--color-border)",
                    background: isSelected ? config.bgColor : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
                    boxShadow: isSelected ? "var(--shadow-md)" : "none",
                  }}
                  id={`role-btn-${roleKey}`}
                >
                  <span
                    style={{
                      width: "50px",
                      height: "50px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: isSelected ? "#FFFFFF" : "var(--color-border-light)",
                      borderRadius: "50%",
                      boxShadow: "var(--shadow-sm)",
                      color: isSelected ? config.color : "var(--color-text-muted)",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {config.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "var(--color-text)" }}>
                      {config.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.15rem" }}>
                      {config.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div
          style={{
            padding: "3rem",
            background: "var(--color-border-light)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                background: "var(--color-primary-light)",
                color: "var(--color-primary)",
                marginBottom: "1rem",
              }}
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)" }}>
              Autentikasi {activeConfig.title}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              Akses cepat telah dikonfigurasi secara otomatis
            </p>
          </div>

          <form onSubmit={handleLogin}>
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <label className="form-label">Alamat Email</label>
              <input
                type="email"
                className="form-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{ background: "#FFFFFF" }}
                id="login-email-input"
              />
            </div>

            <div className="form-group" style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                <label className="form-label" style={{ margin: 0 }}>
                  Kata Sandi
                </label>
                <a
                  href="#"
                  style={{ fontSize: "0.75rem", color: "var(--color-primary)", textDecoration: "none" }}
                >
                  Lupa Sandi?
                </a>
              </div>
              <input
                type="password"
                className="form-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ background: "#FFFFFF" }}
                id="login-password-input"
              />
            </div>

            {error && (
              <div
                className="badge badge-danger"
                style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)" }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={isLoading}
              style={{
                width: "100%",
                padding: "0.75rem",
                justifyContent: "center",
                background: activeConfig.color,
                fontSize: "0.95rem",
                boxShadow: "var(--shadow-md)",
              }}
              id="btn-login-submit"
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <svg
                    style={{ animation: "spin 1s linear infinite" }}
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  >
                    <circle cx="12" cy="12" r="10" strokeOpacity="0.25" />
                    <path d="M4 12a8 8 0 0 1 8-8" />
                  </svg>
                  Menghubungkan...
                </span>
              ) : (
                `Masuk sebagai ${activeConfig.title}`
              )}
            </button>
          </form>

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <span style={{ fontSize: "0.8rem", color: "var(--color-text-subtle)" }}>
              Belum terdaftar sebagai mitra?{" "}
              <a href="#" style={{ color: "var(--color-secondary)", fontWeight: 600, textDecoration: "none" }}>
                Hubungi Kami
              </a>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
