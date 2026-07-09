"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  badge?: boolean;
  icon: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    href: "/pembeli",
    label: "Beranda",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    )
  },
  {
    href: "/pembeli/marketplace",
    label: "Marketplace",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="8" cy="21" r="1" />
        <circle cx="19" cy="21" r="1" />
        <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
      </svg>
    )
  },
  {
    href: "/pembeli/wishlist",
    label: "Wishlist",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
      </svg>
    )
  },
  {
    href: "/pembeli/pesanan",
    label: "Pesanan",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="m7.5 4.27 9 5.15" />
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
      </svg>
    )
  },
  {
    href: "/pembeli/notifikasi",
    label: "Notifikasi",
    badge: true,
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
        <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
      </svg>
    )
  },
  {
    href: "/pembeli/profil",
    label: "Profil",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    )
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sidebar">
      <div className="nav-section-title">Menu Utama</div>
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={`nav-item${pathname === item.href ? " active" : ""}`}
        >
          <span style={{ display: "inline-flex", alignItems: "center" }}>{item.icon}</span>
          <span>{item.label}</span>
          {item.badge && (
            <span
              style={{
                marginLeft: "auto",
                background: "var(--color-primary)",
                color: "white",
                borderRadius: "999px",
                padding: "1px 7px",
                fontSize: "0.7rem",
                fontWeight: 700,
              }}
            >
              3
            </span>
          )}
        </Link>
      ))}
      <div style={{ marginTop: "auto", padding: "0.875rem", borderTop: "1px solid var(--color-border)" }}>
        <Link
          href="/login"
          className="nav-item"
          style={{
            color: "var(--color-alert)",
            background: "var(--color-alert-light)",
            fontWeight: 600,
            borderRadius: "var(--radius-sm)",
            padding: "0.5rem 0.875rem",
            marginBottom: "0.75rem",
          }}
          id="btn-logout"
        >
          <span style={{ display: "inline-flex", alignItems: "center" }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </span>
          <span>Keluar Akun</span>
        </Link>
        <div style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>
          © 2025 Lural Commerce
        </div>
        <div style={{ fontSize: "0.7rem", color: "var(--color-text-subtle)", marginTop: "2px" }}>
          v1.0.0 — UMKM Edition
        </div>
      </div>
    </aside>
  );
}
