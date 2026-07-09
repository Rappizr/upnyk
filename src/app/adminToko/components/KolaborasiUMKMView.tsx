'use client';

import React from 'react';
import { Users, Share2, ShoppingBag } from 'lucide-react';

export default function KolaborasiUmkmPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#2563EB] transition-colors cursor-pointer">
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl w-fit mb-4">
            <Users className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]">Pembelian Bersama (Joint Order)</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Gabung kuota pengadaan bahan baku gabah dengan UMKM tetangga untuk memotong biaya ongkos kirim logistik.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#2563EB] transition-colors cursor-pointer">
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl w-fit mb-4">
            <Share2 className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]">Berbagi Bahan Baku & Alat</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Surplus stok gula atau butuh mesin giling ekstra? Pinjam atau sewa berbayar jangka pendek dengan aman di klaster desa.</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#2563EB] transition-colors cursor-pointer">
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]">Kolaborasi Pesanan Besar</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed">Terima permintaan katering korporat atau instansi pemerintah dalam skala besar dengan membagi beban produksi bersama.</p>
        </div>
      </div>
    </div>
  );
}