'use client';

import React from 'react';
import { Trash2, AlertTriangle, Sparkles, TrendingDown } from 'lucide-react';

export default function AnalisisLimbahPage() {
  const dataLimbah = [
    {
      id: 1,
      produk: "Gula Aren Cair Lokal",
      kondisi: "Hampir Kedaluwarsa",
      jumlah: "2 Botol",
      kerugian: 70000,
      solusi: "Rekomendasi Flash Sale / Bundling Paket Hemat"
    },
    {
      id: 2,
      produk: "Keripik Singkong Balado",
      kondisi: "Rusak (Kemasan Bocor)",
      jumlah: "4 Pcs",
      kerugian: 48000,
      solusi: "Klaim Retur Retribusi Distribusi Logistik"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Pantau kebocoran keuntungan bisnis dengan manajemen penyusutan produk rusak dan kedaluwarsa.</p>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase">Produk Rusak Total</span>
          <p className="text-xl font-bold text-[#1E293B] mt-1">4 <span className="text-xs font-normal text-slate-400">Pcs</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200">
          <span className="text-xs font-semibold text-slate-400 uppercase">Produk Kedaluwarsa</span>
          <p className="text-xl font-bold text-[#1E293B] mt-1">2 <span className="text-xs font-normal text-slate-400">Botol</span></p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 bg-red-50/20 border-l-4 border-l-[#EF4444]">
          <span className="text-xs font-semibold text-red-500 uppercase flex items-center gap-1">
            <TrendingDown className="w-3.5 h-3.5" /> Total Estimasi Kerugian
          </span>
          <p className="text-xl font-bold text-[#EF4444] mt-1">Rp 118.000</p>
        </div>
      </div>

      {/* WASTE ANALYSIS LIST */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-base text-[#1E293B]">Daftar Kebocoran Stok & Estimasi Rugi</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Produk Terimbas</th>
                <th className="p-4">Kondisi / Status</th>
                <th className="p-4">Jumlah Jurnal</th>
                <th className="p-4">Potensi Kerugian</th>
                <th className="p-4 pl-6">Rekomendasi Tindakan Promo</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataLimbah.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-[#1E293B]">{item.produk}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                      item.kondisi.includes('Kedaluwarsa') ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-[#EF4444]'
                    }`}>
                      {item.kondisi}
                    </span>
                  </td>
                  <td className="p-4 font-medium text-slate-700">{item.jumlah}</td>
                  <td className="p-4 font-bold text-[#EF4444]">Rp {item.kerugian.toLocaleString('id-ID')}</td>
                  <td className="p-4 pl-6 text-xs text-slate-600 font-medium">
                    <span className="flex items-center gap-1.5 text-[#2563EB]">
                      <Sparkles className="w-3.5 h-3.5" /> {item.solusi}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shadow-sm">
                      Terapkan Promo
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}