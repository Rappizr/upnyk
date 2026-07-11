"use client";

// ============================================================================
// AdminSidebar.tsx — Navigasi utama Admin Platform.
// Tema terang, senada dengan sidebar di halaman pembeli — supaya identitas
// visual platform konsisten lintas role (bukan gelap sendiri).
// Dibuat sebagai satu komponen konfigurasi supaya menambah/menghapus menu
// cukup dilakukan di satu tempat (array `NAV_GROUPS` di bawah).
// ============================================================================
import type { ReactNode } from "react";
import { Icon } from "./ui/icons";

export type MenuKey =
  | "ringkasan"
  | "data-umkm"
  | "verifikasi-umkm"
  | "suspend-akun"
  | "kat-usaha"
  | "kat-supplier"
  | "kat-bahan"
  | "kat-limbah"
  | "semua-transaksi"
  | "semua-kolaborasi"
  | "stat-umkm"
  | "stat-limbah"
  | "stat-bahan"
  | "stat-supplier";

interface NavEntry {
  key: MenuKey;
  label: string;
  icon: ReactNode;
  badge?: number;
}

interface NavGroup {
  title: string;
  items: NavEntry[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    title: "Sistem Utama",
    items: [{ key: "ringkasan", label: "Dashboard Ringkasan", icon: <Icon.Dashboard size={18} /> }],
  },
  {
    title: "Manajemen User",
    items: [
      { key: "data-umkm", label: "Data UMKM", icon: <Icon.Users size={18} /> },
      { key: "verifikasi-umkm", label: "Verifikasi UMKM", icon: <Icon.UserCheck size={18} />, badge: 4 },
      { key: "suspend-akun", label: "Suspend Akun", icon: <Icon.UserX size={18} /> },
    ],
  },
  {
    title: "Manajemen Kategori",
    items: [
      { key: "kat-usaha", label: "Kategori Usaha", icon: <Icon.Layers size={18} /> },
      { key: "kat-supplier", label: "Kategori Produsen & Supplier", icon: <Icon.Layers size={18} /> },
      { key: "kat-bahan", label: "Kategori Bahan Baku", icon: <Icon.Layers size={18} /> },
      { key: "kat-limbah", label: "Kategori Limbah", icon: <Icon.Layers size={18} /> },
    ],
  },
  {
    title: "Monitoring",
    items: [
      { key: "semua-transaksi", label: "Semua Transaksi", icon: <Icon.Wallet size={18} /> },
      { key: "semua-kolaborasi", label: "Semua Kolaborasi", icon: <Icon.Handshake size={18} /> },
    ],
  },
  {
    title: "Laporan",
    items: [
      { key: "stat-umkm", label: "Statistik UMKM", icon: <Icon.FileText size={18} /> },
      { key: "stat-limbah", label: "Statistik Limbah", icon: <Icon.Recycle size={18} /> },
      { key: "stat-bahan", label: "Statistik Bahan Baku", icon: <Icon.Layers size={18} /> },
      { key: "stat-supplier", label: "Statistik Produsen & Supplier", icon: <Icon.Truck size={18} /> },
    ],
  },
];

export default function AdminSidebar({
  active,
  onSelect,
  open,
  onClose,
}: {
  active: MenuKey;
  onSelect: (key: MenuKey) => void;
  open: boolean;
  onClose: () => void;
}) {
  return (
    <>
      {/* Backdrop — hanya muncul di layar kecil saat sidebar dibuka */}
      {open && <div className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed lg:static left-0 top-16 lg:top-auto bottom-0 lg:bottom-auto z-50 w-[248px] shrink-0 h-[calc(100vh-4rem)] lg:h-full bg-white border-r border-[var(--color-border)] flex flex-col transform transition-transform duration-200 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        <div className="lg:hidden flex items-center justify-between px-4 h-14 border-b border-[var(--color-border)] shrink-0">
          <span className="font-bold text-[var(--color-text)] text-sm">Menu Navigasi</span>
          <button onClick={onClose} className="icon-btn" aria-label="Tutup menu">
            <Icon.X size={18} />
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto px-3 py-5 space-y-6">
          {NAV_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="px-3 mb-1.5 text-[10.5px] font-bold uppercase tracking-wider text-[var(--color-text-subtle)]">{group.title}</div>
              <div className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive = active === item.key;
                  return (
                    <button
                      key={item.key}
                      onClick={() => {
                        onSelect(item.key);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-left transition-colors cursor-pointer ${
                        isActive
                          ? "bg-[var(--color-primary-light)] text-[var(--color-primary)] font-semibold"
                          : "text-[var(--color-text-muted)] hover:bg-[var(--color-bg)] hover:text-[var(--color-text)]"
                      }`}
                    >
                      <span className={isActive ? "text-[var(--color-primary)] shrink-0" : "text-[var(--color-text-subtle)] shrink-0"}>{item.icon}</span>
                      <span className="flex-1 truncate">{item.label}</span>
                      {!!item.badge && (
                        <span className="text-[10px] font-bold bg-[var(--color-primary)] text-white px-1.5 py-0.5 rounded-full shrink-0">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-3 border-t border-[var(--color-border-light)] shrink-0">
          <a
            href="/login"
            className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl bg-[var(--color-alert-light)] text-[#991B1B] text-sm font-semibold hover:bg-[#fecaca] transition-colors"
          >
            <Icon.LogOut size={16} />
            Keluar Akun
          </a>
          <p className="text-[11px] text-[var(--color-text-subtle)] text-center mt-3">© 2026 PasarNusa — Admin Edition</p>
        </div>
      </aside>
    </>
  );
}
