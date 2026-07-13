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

  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSuccess, setRegSuccess] = useState("");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Helper to read localStorage users
  const getRegisteredUsers = () => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("registered_users");
    return stored ? JSON.parse(stored) : [];
  };

  // Helper to register a user
  const registerUser = (user: { name: string; phone: string; email: string; passwordHash: string; role: Role }) => {
    if (typeof window === "undefined") return;
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem("registered_users", JSON.stringify(users));
  };

  const isEmailRegistered = (emailToCheck: string): boolean => {
    const isPreseeded = Object.values(roleConfigs).some(
      (config) => config.email.toLowerCase() === emailToCheck.toLowerCase()
    );
    if (isPreseeded) return true;

    const users = getRegisteredUsers();
    return users.some((u: any) => u.email.toLowerCase() === emailToCheck.toLowerCase());
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].email);
    setPassword("12345678"); // Mock password
    setError("");
    setRegSuccess("");
    setRegName("");
    setRegPhone("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setIsForgotPassword(false);
    setResetEmail("");
    setResetSuccess("");
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    setTimeout(() => {
      setIsLoading(false);

      // Check preseeded first
      const preseededRole = (Object.keys(roleConfigs) as Role[]).find(
        (r) => roleConfigs[r].email.toLowerCase() === email.toLowerCase()
      );

      if (preseededRole) {
        if (preseededRole === selectedRole) {
          router.push(roleConfigs[selectedRole].redirectUrl);
        } else {
          setError(`Email terdaftar sebagai ${roleConfigs[preseededRole].title}. Silakan pilih peran yang sesuai.`);
        }
        return;
      }

      // Check registered users
      const users = getRegisteredUsers();
      const matchedUser = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());

      if (matchedUser) {
        if (matchedUser.role === selectedRole) {
          router.push(roleConfigs[selectedRole].redirectUrl);
        } else {
          setError(`Email terdaftar sebagai ${roleConfigs[matchedUser.role].title}. Silakan pilih peran yang sesuai.`);
        }
      } else {
        setError("Alamat email belum terdaftar?. Silakan klik 'Daftar disini'.");
      }
    }, 1200);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setRegSuccess("");

    if (!regName.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setError("Semua field wajib diisi.");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setError("Konfirmasi kata sandi tidak cocok.");
      return;
    }

    if (isEmailRegistered(regEmail)) {
      setError("Email sudah terdaftar. Silakan gunakan email lain atau langsung login.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      registerUser({
        name: regName,
        phone: regPhone,
        email: regEmail,
        passwordHash: regPassword, // mock
        role: selectedRole
      });

      setRegSuccess(`Registrasi sebagai ${activeConfig.title} berhasil! Silakan masuk.`);

      // Auto-prefill the login credentials
      setEmail(regEmail);
      setPassword(regPassword);

      // Clear registration form
      setRegName("");
      setRegPhone("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");

      // Switch back to login mode after 2 seconds
      setTimeout(() => {
        setIsRegistering(false);
        setRegSuccess("");
      }, 2000);

    }, 1500);
  };

  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSuccess("");

    if (!resetEmail.trim()) {
      setError("Masukkan alamat email Anda.");
      return;
    }

    if (!isEmailRegistered(resetEmail)) {
      setError("Alamat email tidak terdaftar di server.");
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setResetSuccess("Instruksi atur ulang kata sandi telah dikirim ke email Anda.");
      setResetEmail("");
    }, 1500);
  };

  const activeConfig = roleConfigs[selectedRole];

  return (
    <div className="login-page-wrapper">
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

      {/* Back to Home Link */}
      <div style={{ width: "100%", maxWidth: "1000px", marginBottom: "1rem", zIndex: 2 }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "var(--color-text-muted)",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "var(--color-primary)"}
          onMouseLeave={(e) => e.currentTarget.style.color = "var(--color-text-muted)"}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Beranda
        </a>
      </div>

      <div className="login-container">
        {/* Left Side: Role Selector & Branding */}
        <div className="login-left-panel">
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

        {/* Right Side: Login/Register Form */}
        <div className="login-right-panel">
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
              {isForgotPassword ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              ) : isRegistering ? (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              ) : (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "var(--color-text)" }}>
              {isForgotPassword ? "Atur Ulang Kata Sandi" : isRegistering ? `Registrasi ${activeConfig.title}` : `Autentikasi ${activeConfig.title}`}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
              {isForgotPassword ? "Masukkan email terdaftar Anda untuk instruksi pemulihan" : isRegistering ? "Buat akun baru untuk mengakses platform" : "Akses cepat telah dikonfigurasi secara otomatis"}
            </p>
          </div>

          {isForgotPassword ? (
            <>
              <form onSubmit={handleForgotPassword}>
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Alamat Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reset-email-input"
                    placeholder="nama@email.com"
                  />
                </div>

                {resetSuccess && (
                  <div
                    className="badge badge-success"
                    style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "center" }}
                  >
                    {resetSuccess}
                  </div>
                )}

                {error && (
                  <div
                    className="badge badge-danger"
                    style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "center" }}
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
                  id="btn-reset-submit"
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
                      Mengirim instruksi...
                    </span>
                  ) : (
                    "Kirim Instruksi Reset"
                  )}
                </button>
              </form>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setError("");
                    setResetSuccess("");
                  }}
                  style={{
                    background: "none",
                    border: "none",
                    padding: 0,
                    color: activeConfig.color,
                    fontWeight: 600,
                    cursor: "pointer",
                    textDecoration: "underline",
                    fontSize: "0.8rem"
                  }}
                  id="btn-back-to-login"
                >
                  Kembali ke Login
                </button>
              </div>
            </>
          ) : !isRegistering ? (
            <>
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
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError("");
                      }}
                      style={{
                        background: "none",
                        border: "none",
                        padding: 0,
                        fontSize: "0.75rem",
                        color: "var(--color-primary)",
                        textDecoration: "underline",
                        cursor: "pointer",
                        fontWeight: 600
                      }}
                      id="btn-goto-forgot"
                    >
                      Lupa Sandi?
                    </button>
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
                    style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "center" }}
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
                  Belum terdaftar di server?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(true);
                      setError("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: "var(--color-primary)",
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "0.8rem"
                    }}
                    id="btn-goto-register"
                  >
                    Daftar disini
                  </button>
                </span>
              </div>
            </>
          ) : (
            <>
              <form onSubmit={handleRegister}>
                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reg-name-input"
                    placeholder="Masukkan nama lengkap Anda"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Nomor Telepon</label>
                  <input
                    type="tel"
                    className="form-input"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reg-phone-input"
                    placeholder="Contoh: 081234567890"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Alamat Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reg-email-input"
                    placeholder="nama@email.com"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Kata Sandi</label>
                  <input
                    type="password"
                    className="form-input"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reg-password-input"
                    placeholder="Minimal 8 karakter"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Konfirmasi Kata Sandi</label>
                  <input
                    type="password"
                    className="form-input"
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    style={{ background: "#FFFFFF" }}
                    id="reg-confirm-password-input"
                    placeholder="Ulangi kata sandi"
                  />
                </div>

                {regSuccess && (
                  <div
                    className="badge badge-success"
                    style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "center" }}
                  >
                    {regSuccess}
                  </div>
                )}

                {error && (
                  <div
                    className="badge badge-danger"
                    style={{ width: "100%", padding: "0.625rem", marginBottom: "1rem", borderRadius: "var(--radius-sm)", display: "flex", justifyContent: "center" }}
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
                  id="btn-register-submit"
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
                      Mendaftarkan ke server...
                    </span>
                  ) : (
                    `Daftar sebagai ${activeConfig.title}`
                  )}
                </button>
              </form>

              <div style={{ marginTop: "2rem", textAlign: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--color-text-subtle)" }}>
                  Sudah memiliki akun?{" "}
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegistering(false);
                      setError("");
                    }}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      color: activeConfig.color,
                      fontWeight: 600,
                      cursor: "pointer",
                      textDecoration: "underline",
                      fontSize: "0.8rem"
                    }}
                    id="btn-goto-login"
                  >
                    Masuk disini
                  </button>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
