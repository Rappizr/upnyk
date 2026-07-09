"use client";
import Link from "next/link";

export default function Header() {
  return (
    <header className="header-nav">
      {/* Logo */}
      <Link href="/pembeli" className="header-logo">
        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
          <rect width="28" height="28" rx="8" fill="currentColor" />
          <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" fillOpacity="0.9" />
        </svg>
        Pasar<span>Nusa</span>
      </Link>

      {/* Search */}
      <div className="header-search">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
        </svg>
        <input type="text" placeholder="Cari produk, supplier, atau kategori…" id="header-search-input" />
      </div>

      {/* Actions */}
      <div className="header-actions">
        {/* Cart */}
        <Link href="/pembeli/marketplace" className="icon-btn" id="btn-cart" title="Keranjang">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
            <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
          </svg>
          <span className="badge-dot" style={{ background: "var(--color-secondary)" }} />
        </Link>

        {/* Notifications */}
        <Link href="/pembeli/notifikasi" className="icon-btn" id="btn-notif" title="Notifikasi">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
          </svg>
          <span className="badge-dot" />
        </Link>

        {/* Avatar */}
        <Link href="/pembeli/profil" className="avatar-btn" id="btn-profile" title="Profil Saya">
          AK
        </Link>
      </div>
    </header>
  );
}
