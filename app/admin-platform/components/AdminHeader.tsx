"use client";

// ============================================================================
// AdminHeader.tsx — Header atas Admin Platform.
// Sengaja pakai class CSS yang sama dengan Header pembeli (header-nav,
// header-logo, header-search, icon-btn, avatar-btn — semua sudah ada di
// globals.css) supaya identitas visual platform tetap konsisten di semua
// role, bukan cuma di halaman pembeli.
// ============================================================================
import { Icon } from "./ui/icons";

export default function AdminHeader({ onMenuClick, pendingCount = 0 }: { onMenuClick: () => void; pendingCount?: number }) {
  return (
    <header className="header-nav">
      {/* Kiri: hamburger (mobile) + logo */}
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={onMenuClick} className="icon-btn lg:hidden" aria-label="Buka menu">
          <Icon.Menu size={20} />
        </button>

        <a href="/admin-platform" className="header-logo">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="currentColor" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" fillOpacity="0.9" />
          </svg>
          Pasar<span>Nusa</span>
          <span className="hidden sm:inline text-[11px] font-semibold text-[var(--color-text-subtle)] tracking-wide uppercase ml-1 border-l border-[var(--color-border)] pl-2">
            Admin Platform
          </span>
        </a>
      </div>

      {/* Search — pencarian cepat lintas data admin */}
      <div className="header-search hidden md:block">
        <Icon.Search size={16} />
        <input type="text" placeholder="Cari UMKM, transaksi, atau pengguna..." />
      </div>

      {/* Actions */}
      <div className="header-actions">
        <button className="icon-btn" title="Notifikasi" aria-label="Notifikasi">
          <Icon.Bell size={20} />
          {pendingCount > 0 && <span className="badge-dot" />}
        </button>
        <div className="avatar-btn" title="Super Admin">
          SA
        </div>
      </div>
    </header>
  );
}
