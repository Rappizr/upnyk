import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "PasarNusa & Supply Chain",
  description: "Platform perdagangan lokal UMKM dengan rantai pasok cerdas — menghubungkan produsen daerah dengan pembeli seluruh Indonesia.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={inter.className}>
      <body>{children}</body>
    </html>
  );
}