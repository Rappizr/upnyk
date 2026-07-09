'use client';

import React from 'react';
import { Star, MapPin, ArrowRight, ShoppingCart } from 'lucide-react';

export default function BandingkanBeliPage() {
  const komparasiBahanBaku = [
    {
      id: 1,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Kelompok Tani Lestari",
      harga: 13200,
      jarak: "0.4 Km",
      rating: 4.9,
      stok: "1.2 Ton",
      rekomendasi: "Harga & Jarak Terbaik"
    },
    {
      id: 2,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Tani Makmur Sejahtera",
      harga: 13500,
      jarak: "1.8 Km",
      rating: 4.7,
      stok: "800 Kg",
      rekomendasi: null
    },
    {
      id: 3,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Sawah Berkah Rahayu",
      harga: 12900,
      jarak: "4.5 Km",
      rating: 4.5,
      stok: "2.5 Ton",
      rekomendasi: "Termurah (Ongkir Menyesuaikan)"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Analisis komparatif harga, kedekatan logistik desa, dan performa rating mitra.</p>
      </div>

      {/* COMPARISON TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <h3 className="font-bold text-base text-[#1E293B]">Analisis Komparasi Pasokan: Beras Mentik Wangi</h3>
          <span className="text-xs bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded-lg border border-blue-100">
            3 Produsen Ditemukan
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Produsen / Petani</th>
                <th className="p-4">Bandingkan Harga</th>
                <th className="p-4">Bandingkan Jarak</th>
                <th className="p-4">Bandingkan Rating</th>
                <th className="p-4">Tersedia</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {komparasiBahanBaku.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6">
                    <p className="font-semibold text-[#1E293B]">{item.produsen}</p>
                    {item.rekomendasi && (
                      <span className="text-[10px] bg-emerald-50 text-[#10B981] px-1.5 py-0.5 rounded font-bold border border-emerald-100 inline-block mt-1">
                        {item.rekomendasi}
                      </span>
                    )}
                  </td>
                  <td className="p-4 font-bold text-[#1E293B]">
                    Rp {item.harga.toLocaleString('id-ID')}
                  </td>
                  <td className="p-4 text-slate-600 font-medium">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400" /> {item.jarak}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current" /> {item.rating}
                    </span>
                  </td>
                  <td className="p-4 text-slate-500 font-medium">{item.stok}</td>
                  <td className="p-4 pr-6 text-right">
                    <button className="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm inline-flex items-center gap-1.5">
                      <ShoppingCart className="w-3.5 h-3.5" /> Beli Langsung
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VALUE PROP WIDGET */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h4 className="font-bold text-sm text-[#2563EB]">Ingin hemat biaya pengiriman logistik?</h4>
          <p className="text-xs text-slate-600 mt-1">Gunakan fitur <strong>Pembelian Bersama</strong> di menu Kolaborasi UMKM untuk menggabungkan kuota muatan truk dengan toko sekitar.</p>
        </div>
        <button className="text-xs font-bold text-[#2563EB] bg-white border border-blue-200 px-4 py-2 rounded-xl shadow-sm hover:bg-blue-50 transition-all flex items-center gap-1">
          Buka Kolaborasi <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}