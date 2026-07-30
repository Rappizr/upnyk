"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/db";

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
    email: "",
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
    email: "",
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
    email: "",
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
    email: "",
    redirectUrl: "/admin-platform",
  },
};

export default function LoginPage() {
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<Role>("pembeli");

  const activeConfig = roleConfigs[selectedRole];

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regSuccess, setRegSuccess] = useState("");
  const [regAvatarUrl, setRegAvatarUrl] = useState("https://api.dicebear.com/7.x/adventurer/svg?seed=Felix");

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetSuccess, setResetSuccess] = useState("");

  // Helper untuk mengecek status terblokir/terpenjara secara aman
  const isSuspendedStatus = (statusStr?: string | null): boolean => {
    const s = String(statusStr || "").toLowerCase().trim();
    return s === "suspended" || s === "nonaktif" || s === "terblokir";
  };

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role);
    setEmail(roleConfigs[role].email.trim());
    setPassword("");
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const preseededRole = (Object.keys(roleConfigs) as Role[]).find(
        (r) => roleConfigs[r].email.trim() !== "" && roleConfigs[r].email.toLowerCase() === email.trim().toLowerCase()
      );

      if (preseededRole && preseededRole !== selectedRole) {
        setError(`Email terdaftar sebagai ${roleConfigs[preseededRole].title}. Silakan pilih peran yang sesuai.`);
        setIsLoading(false);
        return;
      }

      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password.trim()
      });

      if (authError) {
        if (authError.status === 400 || authError.message.toLowerCase().includes("invalid grant")) {
          setError("Email atau kata sandi salah. Silakan periksa kembali.");
        } else {
          setError(authError.message);
        }
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        const userId = authData.user.id;

        // 1. Cek status khusus PRODUSEN (jika memilih login sebagai Produsen)
        if (selectedRole === "produsen") {
          const { data: produsenRows } = await supabase
            .from("produsen")
            .select("status")
            .or(`id.eq.${userId},profile_id.eq.${userId}`)
            .limit(1);

          const prod = produsenRows?.[0];
          if (isSuspendedStatus(prod?.status)) {
            await supabase.auth.signOut();
            setError("Akun Produsen Anda telah ditangguhkan (terblokir) oleh Admin Platform.");
            setIsLoading(false);
            return;
          }
        }

        // 2. Cek status khusus ADMIN TOKO (jika memilih login sebagai Admin Toko)
        if (selectedRole === "admin_toko") {
          const { data: tokoRows } = await supabase
            .from("admin_toko")
            .select("status")
            .or(`id.eq.${userId},profile_id.eq.${userId}`)
            .limit(1);

          const toko = tokoRows?.[0];
          if (isSuspendedStatus(toko?.status)) {
            await supabase.auth.signOut();
            setError("Akun Toko UMKM Anda telah ditangguhkan (terblokir) oleh Admin Platform.");
            setIsLoading(false);
            return;
          }
        }

        // 3. Cek status khusus PEMBELI
        if (selectedRole === "pembeli") {
          const { data: pembeliRows } = await supabase
            .from("pembeli")
            .select("status")
            .or(`id.eq.${userId},profile_id.eq.${userId}`)
            .limit(1);

          const pembeli = pembeliRows?.[0];
          if (isSuspendedStatus(pembeli?.status)) {
            await supabase.auth.signOut();
            setError("Akun Pembeli Anda telah ditangguhkan (terblokir) oleh Admin Platform.");
            setIsLoading(false);
            return;
          }
        }

        // 4. Validasi Role Match pada profiles
        const { data: profile, error: profileErr } = await supabase
          .from('profiles')
          .select('role, status')
          .eq('id', userId)
          .maybeSingle();

        if (profileErr) {
          console.error("Gagal mengambil data profil:", profileErr.message);
        }

        // Cek status global profiles hanya jika role sesuai
        if (profile && profile.role === selectedRole && isSuspendedStatus(profile.status)) {
          await supabase.auth.signOut();
          setError("Akun Anda telah ditangguhkan secara keseluruhan. Silakan hubungi Admin Platform.");
          setIsLoading(false);
          return;
        }

        if (profile && profile.role) {
          if (profile.role !== selectedRole) {
            const roleTitle = roleConfigs[profile.role as Role]?.title || profile.role;
            setError(`Akun Anda terdaftar sebagai ${roleTitle}. Silakan pilih peran yang sesuai.`);
            await supabase.auth.signOut();
            setIsLoading(false);
            return;
          }
        }

        localStorage.setItem('user_role', selectedRole);
        localStorage.setItem('supabase_user_id', userId);
        localStorage.setItem('supabase_user_email', authData.user.email || '');
      }

      router.push(roleConfigs[selectedRole].redirectUrl);
    } catch (e) {
      console.error('Login error:', e);
      setError('Terjadi kesalahan saat masuk. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
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

    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: regEmail.trim(),
        password: regPassword.trim(),
        options: {
          data: {
            name: regName.trim(),
            phone: regPhone.trim(),
            role: selectedRole,
            avatar_url: regAvatarUrl
          }
        }
      });

      if (authError) {
        setError(authError.message);
        setIsLoading(false);
        return;
      }

      if (authData.user) {
        const { error: profileError } = await supabase.from('profiles').upsert({
          id: authData.user.id,
          nama: regName.trim(),
          email: regEmail.trim(),
          phone: regPhone.trim(),
          role: selectedRole,
          avatar_url: regAvatarUrl,
          status: 'aktif'
        }).select();

        if (profileError) {
          console.error('Client-side profiles upsert failed:', profileError.message);
        }

        if (selectedRole === 'pembeli') {
          const { error: roleErr } = await supabase.from('pembeli').upsert({
            id: authData.user.id,
            profile_id: authData.user.id,
            nama: regName.trim(),
            status: 'aktif'
          });
          if (roleErr) console.warn('Client-side pembeli upsert info:', roleErr.message);
        } else if (selectedRole === 'produsen') {
          const { error: roleErr } = await supabase.from('produsen').upsert({
            id: authData.user.id,
            profile_id: authData.user.id,
            nama_usaha: regName.trim(),
            status: 'aktif'
          });
          if (roleErr) console.warn('Client-side produsen upsert info:', roleErr.message);
        } else if (selectedRole === 'admin_toko') {
          const { error: roleErr } = await supabase.from('admin_toko').upsert({
            id: authData.user.id,
            profile_id: authData.user.id,
            nama_toko: regName.trim(),
            status: 'menunggu'
          });
          if (roleErr) console.warn('Client-side admin_toko upsert info:', roleErr.message);
        }

        localStorage.setItem('supabase_user_id', authData.user.id);
        localStorage.setItem('supabase_user_email', authData.user.email || '');
      }

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

    } catch (e) {
      console.error('Register error:', e);
      setError('Terjadi kesalahan saat mendaftar. Silakan coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setResetSuccess("");

    if (!resetEmail.trim()) {
      setError("Masukkan alamat email Anda.");
      return;
    }

    setIsLoading(true);

    try {
      const { error: resetErr } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (resetErr) {
        setError(resetErr.message);
      } else {
        setResetSuccess("Instruksi atur ulang kata sandi telah dikirim ke email Anda.");
        setResetEmail("");
      }
    } catch (err) {
      console.error("Forgot password error:", err);
      setError("Gagal mengirim email reset kata sandi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", padding: "2rem 1rem", boxSizing: "border-box", display: "flex", flexDirection: "column", alignItems: "center", background: "#F8FAFC" }}>
      <style dangerouslySetInnerHTML={{
        __html: `
        .login-back-link {
          display: inline-flex; align-items: center; gap: 0.5rem; color: #64748B;
          text-decoration: none; font-size: 0.9rem; font-weight: 600; transition: color 0.2s ease;
        }
        .login-back-link:hover { color: #334155; }

        .login-card {
          display: grid;
          grid-template-columns: 1.1fr 1fr;
          gap: 2.5rem;
          width: 100%;
          max-width: 1000px;
          background: #ffffff;
          border-radius: 1.5rem;
          border: 1px solid rgba(226,232,240,0.8);
          box-shadow: 0 20px 40px -15px rgba(0,0,0,0.06);
          padding: 2.5rem;
          box-sizing: border-box;
        }

        .role-card {
          display: flex;
          align-items: center;
          gap: 1.1rem;
          padding: 1.1rem 1.25rem;
          border-radius: 0.9rem;
          cursor: pointer;
          text-align: left;
          width: 100%;
          box-sizing: border-box;
          transition: all 0.25s ease;
        }

        .form-group { display: flex; flex-direction: column; }
        .form-label { font-size: 0.85rem; font-weight: 700; color: #475569; margin-bottom: 0.4rem; }
        .form-input {
          width: 100%; padding: 0.75rem 1rem; border-radius: 0.6rem;
          font-size: 0.95rem; outline: none; box-sizing: border-box; color: #1E293B;
          transition: all 0.2s ease;
        }
        .form-input:focus { box-shadow: 0 0 0 4px var(--focus-ring, rgba(37,99,235,0.1)); }
        .btn-primary {
          display: inline-flex; align-items: center; justify-content: center; gap: 0.5rem;
          border: none; color: white; font-weight: 700; border-radius: 0.6rem; cursor: pointer;
          transition: all 0.2s ease;
        }
        .btn-primary:hover:not(:disabled) { filter: brightness(1.06); transform: translateY(-1px); }
        .btn-primary:disabled { opacity: 0.75; cursor: default; }
        .badge {
          padding: 0.65rem; border-radius: 0.5rem; font-size: 0.85rem; font-weight: 600;
          text-align: center; box-sizing: border-box;
        }
        .badge-success { background: #DCFCE7; color: #166534; }
        .badge-danger { background: #FEE2E2; color: #991B1B; }

        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 768px) {
          .login-card {
            grid-template-columns: 1fr !important;
            gap: 2rem !important;
            padding: 1.5rem 1.25rem !important;
            border-radius: 1.1rem !important;
          }
          .login-right-panel { border-left: none !important; padding-left: 0 !important; padding-top: 1.75rem !important; border-top: 1px solid #E2E8F0 !important; border-radius: 1rem !important; }
          .login-left-panel h2 { font-size: 1.4rem !important; }
          .login-left-panel p { font-size: 0.82rem !important; }
          .role-card { padding: 0.9rem 1rem !important; gap: 0.85rem !important; }
          .role-card .role-icon-box { width: 40px !important; height: 40px !important; }
          .role-card .role-icon-box svg { width: 18px !important; height: 18px !important; }
          .role-card .role-title { font-size: 0.88rem !important; }
          .role-card .role-desc { font-size: 0.74rem !important; }
          .login-right-panel .role-icon-box { width: 48px !important; height: 48px !important; }
          .login-right-panel h3 { font-size: 1.1rem !important; }
        }
      `}} />

      <div style={{ width: "100%", maxWidth: "1000px", marginBottom: "1.25rem" }}>
        <a href="/" className="login-back-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Kembali ke Beranda
        </a>
      </div>

      <div className="login-card">
        <div className="login-left-panel">
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "2rem" }}>
            <img src="/logo.png" alt="Logo PasarNusa" style={{ height: "34px", width: "auto", objectFit: "contain", borderRadius: "6px" }} />
            <span style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0C1F17" }}>
              Pasar<span style={{ color: "#12864E" }}>Nusa</span>
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
                  className="role-card"
                  style={{
                    border: isSelected ? `2px solid ${config.color}` : "1.5px solid #E2E8F0",
                    background: isSelected ? config.bgColor : "transparent",
                  }}
                  id={`role-btn-${roleKey}`}
                >
                  <span
                    className="role-icon-box"
                    style={{
                      width: "50px", height: "50px", display: "flex", alignItems: "center", justifyContent: "center",
                      background: isSelected ? "#FFFFFF" : "#F8FAFC", borderRadius: "50%",
                      color: isSelected ? config.color : "#94A3B8", flexShrink: 0, transition: "all 0.2s ease"
                    }}
                  >
                    {config.icon}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="role-title" style={{ fontWeight: 700, fontSize: "0.95rem", color: "#1E293B" }}>{config.title}</div>
                    <div className="role-desc" style={{ fontSize: "0.8rem", color: "#64748B", marginTop: "0.15rem" }}>{config.description}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="login-right-panel" style={{ background: "#F8FAFC", borderRadius: "1.1rem", padding: "2.25rem 2rem", borderLeft: "1px solid #E2E8F0" }}>
          <div style={{ textAlign: "center", marginBottom: "2.25rem" }}>
            <span
              className="role-icon-box"
              style={{
                display: "inline-flex", alignItems: "center", justifyContent: "center",
                width: "56px", height: "56px", borderRadius: "50%",
                background: activeConfig.bgColor, color: activeConfig.color,
                marginBottom: "1rem", transition: "all 0.3s ease",
              }}
            >
              {isForgotPassword ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
                </svg>
              ) : isRegistering ? (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <line x1="19" y1="8" x2="19" y2="14" />
                  <line x1="22" y1="11" x2="16" y2="11" />
                </svg>
              ) : (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              )}
            </span>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#1E293B", margin: 0 }}>
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
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                  style={{ width: "100%", padding: "0.8rem", background: activeConfig.color, fontSize: "0.95rem" }}
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
                  style={{ background: "none", border: "none", padding: 0, color: activeConfig.color, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}
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
                    style={{ background: activeConfig.bgColor, border: "1px solid transparent" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    id="login-email-input"
                  />
                </div>

                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.375rem" }}>
                    <label className="form-label" style={{ margin: "0px" }}>Kata Sandi</label>
                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotPassword(true);
                        setError("");
                      }}
                      style={{ background: "none", border: "none", padding: 0, fontSize: "0.75rem", color: activeConfig.color, textDecoration: "underline", cursor: "pointer", fontWeight: 600 }}
                      id="btn-goto-forgot"
                    >
                      Lupa Sandi?
                    </button>
                  </div>
                  <input
                    type="password"
                    className="form-input"
                    style={{ background: activeConfig.bgColor, border: "1px solid transparent" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "transparent")}
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
                  style={{ width: "100%", padding: "0.8rem", background: activeConfig.color, fontSize: "0.95rem" }}
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
                    style={{ background: "none", border: "none", padding: 0, color: activeConfig.color, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}
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
                <div className="form-group" style={{ marginBottom: "1.25rem", alignItems: "center" }}>
                  <label className="form-label" style={{ width: "100%", textAlign: "left" }}>Foto Profil / Avatar</label>

                  <div style={{ display: "flex", alignItems: "center", gap: "1rem", width: "100%", marginTop: "0.25rem" }}>
                    <div
                      style={{
                        width: "56px", height: "56px", borderRadius: "50%", border: "2px solid #E2E8F0",
                        overflow: "hidden", background: "#F1F5F9", display: "flex", alignItems: "center",
                        justifyContent: "center", flexShrink: 0
                      }}
                    >
                      {regAvatarUrl ? (
                        <img src={regAvatarUrl} alt="Preview Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "1.5rem", fontWeight: 700, color: "#94A3B8" }}>?</span>
                      )}
                    </div>

                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.4rem" }}>
                      <div style={{ display: "flex", gap: "0.35rem" }}>
                        {[
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix",
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka",
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack",
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Bella",
                          "https://api.dicebear.com/7.x/adventurer/svg?seed=Lily"
                        ].map((url, index) => {
                          const isSelected = regAvatarUrl === url;
                          return (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setRegAvatarUrl(url)}
                              style={{
                                width: "28px", height: "28px", borderRadius: "50%", overflow: "hidden",
                                border: isSelected ? `2px solid ${activeConfig.color}` : "1px solid #E2E8F0",
                                padding: 0, cursor: "pointer", transition: "all 0.15s ease",
                                transform: isSelected ? "scale(1.1)" : "scale(1)",
                              }}
                            >
                              <img src={url} alt={`Avatar option ${index + 1}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Nama Lengkap</label>
                  <input
                    type="text"
                    className="form-input"
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                    style={{ background: "#fff", border: "1px solid #E2E8F0" }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = activeConfig.color)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = "#E2E8F0")}
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
                  style={{ width: "100%", padding: "0.8rem", background: activeConfig.color, fontSize: "0.95rem" }}
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
                    style={{ background: "none", border: "none", padding: 0, color: activeConfig.color, fontWeight: 600, cursor: "pointer", textDecoration: "underline", fontSize: "0.8rem" }}
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