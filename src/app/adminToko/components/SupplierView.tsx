'use client';

import React from 'react';
import { Star, MapPin, Phone, Heart } from 'lucide-react';

export default function SupplierPage() {
  const suppliers = [
    { id: 1, nama: "Kelompok Tani Lestari", lokasi: "Kecamatan Sukamaju (0.4 Km)", rating: 4.9, tipe: "Lokal & Favorit" },
    { id: 2, nama: "Peternakan Unggul Desa", lokasi: "Desa Sejahtera (3.2 Km)", rating: 4.7, tipe: "Lokal" }
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {suppliers.map((sup) => (
          <div key={sup.id} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs bg-emerald-50 text-[#10B981] px-2.5 py-1 rounded-lg font-bold border border-emerald-100">
                  {sup.tipe}
                </span>
                <Heart className="w-4 h-4 text-[#EF4444] fill-current" />
              </div>
              <h3 className="font-bold text-base text-[#1E293B]">{sup.nama}</h3>
              <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {sup.lokasi}
              </p>
            </div>
            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-500 font-bold text-sm">
                <Star className="w-4 h-4 fill-current" /> {sup.rating}
              </span>
              <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors">
                <Phone className="w-3.5 h-3.5" /> Hubungi Supplier
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}