'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Store, User, Users, ShieldAlert, ArrowRight } from 'lucide-react';

export default function PortalMainPage() {
  const router = useRouter();

  const roles = [
    {
      title: "Admin Toko / UMKM",
      desc: "Kelola stok bahan baku desa, inventaris batch, smart restock, dan analisis limbah.",
      icon: Store,
      color: "#2563EB", // Royal Blue
      bgHover: "hover:border-[#2563EB]/40 hover:bg-blue-50/20",
      path: "/adminToko"
    },
    {
      title: "Produsen / Mitra Lahan",
      desc: "Untuk Petani, Peternak, & Pengrajin. Kelola katalog hasil bumi dan pantau pesanan masuk.",
      icon: User,
      color: "#10B981", // Emerald Green
      bgHover: "hover:border-[#10B981]/40 hover:bg-emerald-50/20",
      path: "/produsen" // Nanti diarahkan ke folder produsen jika sudah dibuat
    },
    {
      title: "Pembeli / Konsumen",
      desc: "E-commerce komoditas rural untuk belanja produk lokal berkualitas tinggi.",
      icon: Users,
      color: "#1E293B", // Dark Slate
      bgHover: "hover:border-[#1E293B]/40 hover:bg-slate-50",
      path: "/pembeli"
    },
    {
      title: "Admin Platform",
      desc: "Super admin untuk mengawasi seluruh aktivitas rantai pasok logistik antar desa.",
      icon: ShieldAlert,
      color: "#EF4444", // Red Alert
      bgHover: "hover:border-[#EF4444]/40 hover:bg-red-50/20",
      path: "/admin-platform"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-[#1E293B] flex flex-col justify-center items-center p-6 font-sans">
      
      {/* HEADER SECTION */}
      <div className="text-center max-w-xl mb-12">
        <span className="text-xs bg-blue-50 text-[#2563EB] px-3 py-1 rounded-full font-bold border border-blue-100 tracking-wider uppercase">
          Rural Supply Chain Platform
        </span>
        <h1 className="text-4xl font-extrabold text-[#1E293B] mt-4 tracking-tight">
          Selamat Datang di <span className="text-[#2563EB]">Stockwise</span>
        </h1>
        <p className="text-sm text-slate-500 mt-2 leading-relaxed">
          Sistem integrasi perdagangan rural komersial terpadu. Silakan pilih gerbang masuk sesuai dengan peran hak akses Anda.
        </p>
      </div>

      {/* ROLE SELECTION GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl w-full">
        {roles.map((role, idx) => {
          const IconComponent = role.icon;
          return (
            <div
              key={idx}
              onClick={() => router.push(role.path)}
              className={`bg-white border border-slate-200 rounded-2xl p-6 shadow-sm cursor-pointer transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between ${role.bgHover}`}
            >
              <div className="flex gap-4 items-start">
                <div 
                  className="p-3 rounded-xl text-white shrink-0 shadow-sm"
                  style={{ backgroundColor: role.color }}
                >
                  <IconComponent className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-[#1E293B]">{role.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">{role.desc}</p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-end text-xs font-bold transition-colors" style={{ color: role.color }}>
                <span className="flex items-center gap-1">
                  Masuk Dashboard <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER */}
      <p className="text-xs text-slate-400 mt-12">
        &copy; 2026 Stockwise Commerce. All rights reserved.
      </p>

    </div>
  );
}