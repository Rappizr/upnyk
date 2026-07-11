"use client";

// ============================================================================
// AdminUI.tsx — Kit komponen bersama untuk seluruh halaman Admin Platform.
// Tujuan: satu sumber kebenaran untuk tampilan (warna, jarak, tipografi)
// supaya semua halaman terasa satu keluarga & gampang dirawat.
//
// Palet warna (mengikuti CSS variable di globals.css):
//   bg        #F8FAFC   primary  #2563EB   secondary #10B981
//   alert     #EF4444   text     #1E293B
// ============================================================================
import React from "react";
import { Icon } from "./icons";

/* ---------------------------------------------------------------------- */
/*  Badge status                                                          */
/* ---------------------------------------------------------------------- */
export type BadgeVariant = "success" | "warning" | "danger" | "info" | "neutral";

const badgeStyles: Record<BadgeVariant, string> = {
  success: "bg-[var(--color-secondary-light)] text-[#047857]",
  warning: "bg-[var(--color-warning-light)] text-[#92400E]",
  danger: "bg-[var(--color-alert-light)] text-[#991B1B]",
  info: "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)]",
  neutral: "bg-slate-100 text-slate-600",
};

export function Badge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: BadgeVariant }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${badgeStyles[variant]}`}>
      {children}
    </span>
  );
}

/** Menerjemahkan teks status bebas (Bahasa Indonesia) menjadi varian badge yang konsisten. */
export function statusVariant(status: string): BadgeVariant {
  const s = status.toLowerCase();
  if (["aktif", "selesai", "berjalan", "disetujui", "setuju"].some((k) => s.includes(k))) return "success";
  if (["pending", "diproses", "review", "menunggu"].some((k) => s.includes(k))) return "warning";
  if (["suspend", "batal", "tolak", "curang"].some((k) => s.includes(k))) return "danger";
  if (["dikirim", "kirim"].some((k) => s.includes(k))) return "info";
  return "neutral";
}

/* ---------------------------------------------------------------------- */
/*  Card & layout containers                                              */
/* ---------------------------------------------------------------------- */
export function Card({ children, className = "", noPad = false }: { children: React.ReactNode; className?: string; noPad?: boolean }) {
  return (
    <div className={`bg-white border border-[var(--color-border)] rounded-2xl shadow-[var(--shadow-sm)] hover:shadow-[var(--shadow-md)] transition-shadow duration-200 ${noPad ? "" : "p-5"} ${className}`}>
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6 flex-wrap">
      <div>
        <h1 className="text-[1.6rem] font-bold text-[var(--color-text)] tracking-tight">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-[var(--color-text-muted)] max-w-2xl">{subtitle}</p>}
      </div>
      {action && <div className="flex items-center gap-2">{action}</div>}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Buttons                                                                */
/* ---------------------------------------------------------------------- */
type ButtonVariant = "primary" | "secondary" | "danger" | "ghost" | "subtle" | "dangerSubtle" | "successSubtle" | "infoSubtle";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-dark)]",
  secondary: "bg-[var(--color-secondary)] text-white hover:bg-[#0ea271]",
  danger: "bg-[var(--color-alert)] text-white hover:bg-[#dc2626]",
  ghost: "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]",
  subtle: "bg-slate-100 text-[var(--color-text)] hover:bg-slate-200",
  dangerSubtle: "bg-[var(--color-alert-light)] text-[#991B1B] hover:bg-[#fecaca]",
  successSubtle: "bg-[var(--color-secondary-light)] text-[#047857] hover:bg-[#a7f3d0]",
  infoSubtle: "bg-[var(--color-primary-light)] text-[var(--color-primary-dark)] hover:bg-[#dbeafe]",
};

export function Button({
  children,
  variant = "primary",
  icon,
  className = "",
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant; icon?: React.ReactNode }) {
  return (
    <button
      className={`inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors cursor-pointer whitespace-nowrap ${buttonStyles[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

export function IconButton({ children, className = "", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={`inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-light)] transition-colors cursor-pointer ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/* ---------------------------------------------------------------------- */
/*  Stat card                                                              */
/* ---------------------------------------------------------------------- */
type Tone = "blue" | "green" | "red" | "amber" | "sky" | "violet";

const toneStyles: Record<Tone, string> = {
  blue: "bg-[var(--color-primary-light)] text-[var(--color-primary)]",
  green: "bg-[var(--color-secondary-light)] text-[var(--color-secondary)]",
  red: "bg-[var(--color-alert-light)] text-[var(--color-alert)]",
  amber: "bg-[var(--color-warning-light)] text-[#B45309]",
  sky: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
};

export function StatCard({
  icon,
  value,
  label,
  tone = "blue",
  trend,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  tone?: Tone;
  trend?: string;
}) {
  return (
    <Card>
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${toneStyles[tone]}`}>{icon}</div>
      <div className="text-2xl font-bold text-[var(--color-text)] leading-tight">{value}</div>
      <div className="text-xs text-[var(--color-text-muted)] mt-1">{label}</div>
      {trend && <div className="text-[11px] text-[var(--color-secondary)] font-semibold mt-1.5">{trend}</div>}
    </Card>
  );
}

/* ---------------------------------------------------------------------- */
/*  Toolbar: search + filters                                             */
/* ---------------------------------------------------------------------- */
export function Toolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-3 bg-white border border-[var(--color-border)] rounded-2xl p-3 mb-4">
      {children}
    </div>
  );
}

export function SearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div className="relative flex-1 min-w-[200px]">
      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-subtle)]">
        <Icon.Search size={16} />
      </span>
      <input
        type="text"
        placeholder={placeholder}
        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-[var(--color-border)] text-sm outline-none focus:border-[var(--color-primary)] transition-colors bg-[var(--color-bg)]"
      />
    </div>
  );
}

export function Select({ children, icon = true }: { children: React.ReactNode; icon?: boolean }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-xl px-3 py-2.5">
      {icon && <span className="text-[var(--color-text-muted)]"><Icon.Filter size={14} /></span>}
      <select className="bg-transparent text-sm text-[var(--color-text)] outline-none cursor-pointer pr-1">{children}</select>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Table                                                                  */
/* ---------------------------------------------------------------------- */
/** Kartu pembungkus tabel. Taruh <Table> di dalamnya, lalu opsional <Pagination> setelahnya — keduanya akan berada dalam satu kartu yang sama. */
export function TableCard({ children }: { children: React.ReactNode }) {
  return <Card noPad className="overflow-hidden">{children}</Card>;
}

export function Table({ children }: { children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm min-w-[720px]">{children}</table>
    </div>
  );
}

export function THead({ children }: { children: React.ReactNode }) {
  return (
    <thead>
      <tr className="bg-[var(--color-bg)] border-b border-[var(--color-border)]">{children}</tr>
    </thead>
  );
}

export function Th({ children, center = false }: { children: React.ReactNode; center?: boolean }) {
  return (
    <th className={`px-5 py-3.5 font-semibold text-[var(--color-text-muted)] text-xs uppercase tracking-wide ${center ? "text-center" : ""}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "", center = false }: { children: React.ReactNode; className?: string; center?: boolean }) {
  return <td className={`px-5 py-4 text-[var(--color-text)] align-middle ${center ? "text-center" : ""} ${className}`}>{children}</td>;
}

export function Tr({ children }: { children: React.ReactNode }) {
  return <tr className="border-b border-[var(--color-border-light)] last:border-0 hover:bg-[var(--color-bg)]/60 transition-colors">{children}</tr>;
}

export function Pagination({ showing, total }: { showing: string; total: string }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 border-t border-[var(--color-border)] text-sm text-[var(--color-text-muted)]">
      <span>
        Menampilkan <strong className="text-[var(--color-text)]">{showing}</strong> dari {total}
      </span>
      <div className="flex items-center gap-1">
        <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] text-[var(--color-text-subtle)] cursor-not-allowed" disabled>
          Sebelumnya
        </button>
        <button className="px-3 py-1.5 rounded-lg bg-[var(--color-primary)] text-white font-semibold">1</button>
        <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">2</button>
        <button className="px-3 py-1.5 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]">Selanjutnya</button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/*  Misc                                                                   */
/* ---------------------------------------------------------------------- */
export function ActionLink({ children, ...props }: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span className="text-[var(--color-primary)] font-medium underline decoration-dotted underline-offset-2 cursor-pointer hover:text-[var(--color-primary-dark)]" {...props}>
      {children}
    </span>
  );
}

export function ProgressBar({ label, value, color = "#10B981" }: { label: string; value: number; color?: string }) {
  return (
    <div>
      <div className="flex justify-between text-sm mb-1.5">
        <span className="text-[var(--color-text)]">{label}</span>
        <strong className="text-[var(--color-text)]">{value}%</strong>
      </div>
      <div className="w-full h-2.5 rounded-full bg-[var(--color-border-light)] overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
    </div>
  );
}
