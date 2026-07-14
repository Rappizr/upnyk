"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
    color: "#2563EB",
    bgColor: "#EFF6FF",
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
    color: "#10B981",
    bgColor: "#ECFDF5",
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
    color: "#F59E0B",
    bgColor: "#FEF3C7",
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
    color: "#475569",
    bgColor: "#F1F5F9",
    email: "dharma.admin@lural.com",
    redirectUrl: "/admin-platform",
  },
};

interface UserEntry {
  name: string;
  phone: string;
  email: string;
  passwordHash: string;
  role: Role;
}

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("pembeli");

  const activeConfig = roleConfigs[selectedRole];

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

  const getRegisteredUsers = (): UserEntry[] => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem("registered_users");
    return stored ? JSON.parse(stored) : [];
  };

  const registerUser = (user: UserEntry) => {
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
    return users.some((u) => u.email.toLowerCase() === emailToCheck.toLowerCase());
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].email);
    setPassword("12345678");
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

      const users = getRegisteredUsers();
      const matchedUser = users.find((u) => u.email.toLowerCase() === email.toLowerCase());

      if (matchedUser) {
        if (matchedUser.role === selectedRole) {
          router.push(roleConfigs[selectedRole].redirectUrl);
        } else {
          const userRole = matchedUser.role as Role;
          setError(`Email terdaftar sebagai ${roleConfigs[userRole].title}. Silakan pilih peran yang sesuai.`);
        }
      } else {
        setError("Alamat email belum terdaftar. Silakan klik 'Daftar disini'.");
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
        passwordHash: regPassword,
        role: selectedRole
      });

      setRegSuccess(`Registrasi sebagai ${activeConfig.title} berhasil! Silakan masuk.`);

      setEmail(regEmail);
      setPassword(regPassword);

      setRegName("");
      setRegPhone("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");

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

  return (
    <div className="login-page-wrapper" style={{ minHeight: "100vh", padding: "1.5rem 1rem", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", position: "relative", background: "#F8FAFC" }}>
      
      <style dangerouslySetInnerHTML={{__html: `
        .login-container {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2.5rem;
          width: 100%;
          max-width: 1000px;
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.05);
          padding: 2.5rem;
          box-sizing: border-box;
          z-index: 5;
        }
        .form-group {
          display: flex;
          flex-direction: column;
        }
        .form-label {
          font-size: 0.85rem;
          font-weight: 700;
          color: #475569;
          margin-bottom: 0.4rem;
        }
        .form-input {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid #E2E8F0;
          border-radius: 0.5rem;
          font-size: 0.95rem;
          outline: none;
          box-sizing: border-box;
          transition: all 0.2s;
        }
        .form-input:focus {
          border-color: #2563EB;
          box-shadow: 0 0 0 4px rgba(37,99,235,0.1);
        }
        .btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          border: none;
          color: white;
          font-weight: 700;
          border-radius: 0.5rem;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-primary:hover {
          transform: translateY(-1px);
          opacity: 0.95;
        }
        .badge {
          padding: 0.625rem;
          border-radius: 0.35rem;
          font-size: 0.85rem;
          font-weight: 600;
          text-align: center;
          box-sizing: border-box;
        }
        .badge-success { background: #DCFCE7; color: #166534; }
        .badge-danger { background: #FEE2E2; color: #991B1B; }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 768px) {
          .login-page-wrapper {
            padding: 1rem 0.5rem !important;
          }
          .login-container {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1.25rem 1rem !important;
            border-radius: 1rem !important;
          }
          .login-left-panel h2 {
            font-size: 1.35rem !important;
          }
          .login-left-panel p {
            font-size: 0.8rem !important;
            margin-bottom: 1.5rem !important;
          }
          .login-left-panel button {
            padding: 0.75rem !important;
            gap: 0.75rem !important;
          }
          .login-left-panel button span {
            width: 36px !important;
            height: 36px !important;
          }
          .login-left-panel button span svg {
            width: 18px !important;
            height: 18px !important;
          }
          .login-left-panel button div div:first-child {
            font-size: 0.85rem !important;
          }
          .login-left-panel button div div:last-child {
            font-size: 0.72rem !important;
          }
          .login-right-panel span:first-child {
            width: 44px !important;
            height: 44px !important;
          }
          .login-right-panel span:first-child svg {
            width: 20px !important;
            height: 20px !important;
          }
          .login-right-panel h3 {
            font-size: 1.1rem !important;
          }
          .login-right-panel p {
            font-size: 0.75rem !important;
          }
          .form-input {
            padding: 0.6rem 0.75rem !important;
            font-size: 0.85rem !important;
          }
          .btn-primary {
            padding: 0.65rem !important;
            font-size: 0.85rem !important;
          }
        }
      `}} />

      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "15%",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(37,99,235,0.08) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(30px)",
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          right: "15%",
          width: "250px",
          height: "250px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, rgba(255,255,255,0) 70%)",
          filter: "blur(40px)",
          zIndex: 0,
        }}
      />

      <div style={{ width: "100%", maxWidth: "1000px", marginBottom: "1rem", zIndex: 2, paddingLeft: "0.25rem" }}>
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.5rem",
            color: "#64748B",
            textDecoration: "none",
            fontSize: "0.9rem",
            fontWeight: 600,
            transition: "color 0.15s ease",
          }}
          onMouseEnter={(e) => e.currentTarget.style.color = "#2563EB"}
          onMouseLeave={(e) => e.currentTarget.style.color = "#64748B"}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Beranda
        </a>
      </div>

      <div className="login-container">
        <div className="login-left-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
            <svg width="32" height="32" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="#2563EB" />
              <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
            </svg>
            <span style={{ fontSize: "1.5rem", fontWeight: 800, color: "#2563EB" }}>
              Pasar<span style={{ color: "#10B981" }}>Nusa</span>
            </span>
          </div>

          <h2 style={{ fontSize: "1.75rem", fontWeight: 800, color: "#1E293B", marginBottom: "0.5rem" }}>
            Selamat Datang Kembali
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.9rem", marginBottom: "2rem" }}>
            Pilih jenis akun Anda untuk masuk ke sistem PasarNusa &amp; Supply Chain.
          </p>

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
                    borderRadius: "0.75rem",
                    border: isSelected ? `2.5px solid ${config.color}` : "1.5px solid #E2E8F0",
                    background: isSelected ? config.bgColor : "transparent",
                    cursor: "pointer",
                    textAlign: "left",
                    transition: "all 0.2s ease",
                    transform: isSelected ? "scale(1.02)" : "scale(1)",
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
                      background: isSelected ? "#FFFFFF" : "#F8FAFC",
                      borderRadius: "50%",
                      color: isSelected ? config.color : "#94A3B8",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {config.icon}
                  </span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1E293B" }}>
                      {config.title}
                    </div>
                    <div style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.15rem" }}>
                      {config.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

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
                background: "#EFF6FF",
                color: "#2563EB",
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
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B" }}>
              {isForgotPassword ? "Atur Ulang Kata Sandi" : isRegistering ? `Registrasi ${activeConfig.title}` : `Autentikasi ${activeConfig.title}`}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.25rem" }}>
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
                    id="reset-email-input"
                    placeholder="nama@email.com"
                  />
                </div>

                {resetSuccess && (
                  <div className="badge badge-success" style={{ width: "100%", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                    {resetSuccess}
                  </div>
                )}

                {error && (
                  <div className="badge badge-danger" style={{ width: "100%", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
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
                    fontSize: "0.95rem"
                  }}
                  id="btn-reset-submit"
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
                    id="login-email-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <label className="form-label" style={{ margin: "0px" }}>
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
                        color: "#2563EB",
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
                    id="login-password-input"
                  />
                </div>

                {error && (
                  <div className="badge badge-danger" style={{ width: "100%", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
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
                    fontSize: "0.95rem"
                  }}
                  id="btn-login-submit"
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
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
                      color: "#2563EB",
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
                    id="reg-confirm-password-input"
                    placeholder="Ulangi kata sandi"
                  />
                </div>

                {regSuccess && (
                  <div className="badge badge-success" style={{ width: "100%", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
                    {regSuccess}
                  </div>
                )}

                {error && (
                  <div className="badge badge-danger" style={{ width: "100%", marginBottom: "1rem", display: "flex", justifyContent: "center" }}>
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
                    fontSize: "0.95rem"
                  }}
                  id="btn-register-submit"
                >
                  {isLoading ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                      <svg style={{ animation: "spin 1s linear infinite" }} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
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
                <span style={{ fontSize: "0.8rem", color: "#64748B" }}>
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