'use client';

import React from 'react';
import { Download, FileText, TrendingUp, ArrowDownRight, Layers, Trash2 } from 'lucide-react';

export default function LaporanPage() {
  return (
    <div className="space-y-6">
      {/* ACTION BAR */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <p className="text-xs text-slate-500 font-medium">Periode Pembukuan: Jurnal Berjalan (Juli 2026)</p>
        <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
          <Download className="w-3.5 h-3.5" /> Ekspor Excel/PDF
        </button>
      </div>

      {/* REVENUE STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-1 flex items-center justify-between"><span className="text-xs font-bold uppercase">Laporan Penjualan</span><TrendingUp className="w-4 h-4 text-[#10B981]" /></div>
          <p className="text-xl font-bold text-[#1E293B]">Rp 4.250.000</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-1 flex items-center justify-between"><span className="text-xs font-bold uppercase">Laporan Pembelian</span><ArrowDownRight className="w-4 h-4 text-[#2563EB]" /></div>
          <p className="text-xl font-bold text-[#1E293B]">Rp 1.850.000</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm bg-gradient-to-br from-emerald-50/20 to-white">
          <div className="text-[#10B981] mb-1 flex items-center justify-between"><span className="text-xs font-bold uppercase">Laba Rugi Bersih</span><FileText className="w-4 h-4" /></div>
          <p className="text-xl font-bold text-[#10B981]">Rp 2.400.000</p>
        </div>
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="text-slate-400 mb-1 flex items-center justify-between"><span className="text-xs font-bold uppercase">Ringkasan Waste</span><Trash2 className="w-4 h-4 text-[#EF4444]" /></div>
          <p className="text-xl font-bold text-[#EF4444]">Rp 118.000</p>
        </div>
      </div>
    </div>
  );
}