"use client";

// ============================================================================
// SimpleStatsPage.tsx — Template generik untuk halaman statistik ringkas
// yang hanya menampilkan beberapa angka kunci (tanpa grafik/tabel khusus).
// Dipakai oleh: Statistik Bahan Baku & Statistik Produsen/Supplier.
// ============================================================================
import type { ReactNode } from "react";
import { PageHeader, StatCard } from "./AdminUI";

export interface StatItem {
  icon: ReactNode;
  value: string;
  label: string;
  tone: "blue" | "green" | "red" | "amber" | "sky" | "violet";
}

export default function SimpleStatsPage({
  title,
  subtitle,
  stats,
  children,
}: {
  title: string;
  subtitle: string;
  stats: StatItem[];
  children?: ReactNode;
}) {
  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s, i) => (
          <StatCard key={i} {...s} />
        ))}
      </div>
      {children}
    </div>
  );
}
