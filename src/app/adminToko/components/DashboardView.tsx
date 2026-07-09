'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      
      {/* METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Penjualan Hari Ini</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]">Rp 4.250.000</p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block">↑ 12% vs kemarin</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Produk Terjual</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]">142 <span className="text-sm font-normal text-slate-400">pcs</span></p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block">Susu & Keripik dominan</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pesanan Baru</p>
          <p className="text-2xl font-bold mt-2 text-[#2563EB]">18 <span className="text-sm font-normal text-slate-400">order</span></p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Perlu diproses segera</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Pengeluaran (Bahan Baku)</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]">Rp 1.850.000</p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block">Restock Gabah & Madu</span>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/40 to-white">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Laba Bersih</p>
          <p className="text-2xl font-bold mt-2 text-[#10B981]">Rp 2.400.000</p>
          <span className="text-xs text-[#10B981] font-bold mt-1 inline-block">Margin Sehat (56%)</span>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Alert Smart Restock */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-bold text-base text-[#1E293B]">Smart Restock Alert</h3>
                <p className="text-xs text-slate-400 mt-0.5">Analisis prediktif berbasis sisa stok harian desa</p>
              </div>
              <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2.5 py-1 rounded-lg border border-amber-200">
                Butuh Tindakan
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">Beras Mentik Wangi (Batch B)</p>
                  <p className="text-xs text-[#EF4444] font-medium mt-0.5">Hampir Habis (Sisa 3 Kg) • Prediksi Habis: 1 Hari Lagi</p>
                </div>
                <button className="bg-[#10B981] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-emerald-600 transition-colors shadow-sm">
                  Restock Otomatis
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50">
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]">Gula Aren Cair Lokal</p>
                  <p className="text-xs text-[#EF4444] font-medium mt-0.5">Hampir Kedaluwarsa (Exp: 14 Juli 2026)</p>
                </div>
                <button className="bg-[#2563EB] text-white px-3 py-1.5 rounded-lg text-xs font-semibold hover:bg-blue-700 transition-colors shadow-sm">
                  Buat Promo Flasdsale
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Rekomendasi Supplier Terbaik saat ini: <strong>Kelompok Tani Lestari (0.4 Km)</strong></span>
          </div>
        </div>

        {/* Waste Analysis Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-base text-[#1E293B]">Analisis Limbah & Rusak</h3>
            <p className="text-xs text-slate-400 mt-0.5">Estimasi kerugian dan kebocoran supply chain</p>

            <div className="mt-4 space-y-3">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Produk Rusak (Logistik)</span>
                <span className="font-semibold text-[#1E293B]">4 Pcs</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Produk Expired</span>
                <span className="font-semibold text-[#1E293B]">2 Pcs</span>
              </div>
              <div className="flex justify-between items-center text-sm pt-2 border-t border-slate-100">
                <span className="text-slate-500 font-medium">Estimasi Kerugian</span>
                <span className="font-bold text-[#EF4444]">Rp 340.000</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 mt-4">
            <p className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider">Rekomendasi Solusi</p>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">Gunakan fitur <strong>Berbagi Bahan Baku</strong> di Kolaborasi UMKM.</p>
          </div>
        </div>

      </div>

    </div>
  );
}