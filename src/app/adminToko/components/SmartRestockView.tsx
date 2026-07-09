'use client';

import React from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Truck, CheckCircle } from 'lucide-react';

export default function SmartRestockPage() {
  const prediksiStok = [
    {
      id: 1,
      produk: "Beras Mentik Wangi",
      sisaStok: "3 Kg",
      prediksiHabis: "1 Hari Lagi",
      kebutuhanRestok: "500 Kg",
      supplierTerbaik: "Kelompok Tani Lestari (0.4 Km)",
      status: "Kritis",
      ratingSupplier: "4.9"
    },
    {
      id: 2,
      produk: "Madu Hutan Klanceng",
      sisaStok: "14 Botol",
      prediksiHabis: "8 Hari Lagi",
      kebutuhanRestok: "50 Botol",
      supplierTerbaik: "UMKM Berkah Alam (2.5 Km)",
      status: "Waspada",
      ratingSupplier: "4.8"
    }
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500">Analisis prediktif otomatis untuk mencegah kekosongan stok komoditas dagang Anda.</p>
      </div>

      {/* INSIGHT CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]">Prediksi Kebutuhan Stok</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Berdasarkan tren penjualan mingguan, permintaan **Beras Mentik** diproyeksikan melonjak 15% menjelang akhir bulan ini.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4">
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]">Integrasi Rantai Pasok Terdekat</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Sistem telah mengunci **Kelompok Tani Lestari** sebagai penyuplai dengan rute logistik terpendek dan harga paling kompetitif saat ini.
            </p>
          </div>
        </div>
      </div>

      {/* PREDICTIVE RESTOCK TABLE */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h3 className="font-bold text-base text-[#1E293B]">Rekomendasi Pengadaan (Smart Restock)</h3>
          <span className="text-xs bg-amber-50 text-amber-600 font-semibold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center gap-1 animate-pulse">
            <AlertTriangle className="w-3.5 h-3.5" /> Butuh Tindakan Cepat
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Nama Produk</th>
                <th className="p-4">Sisa Stok</th>
                <th className="p-4">Prediksi Kehabisan</th>
                <th className="p-4">Rekomendasi Restok</th>
                <th className="p-4">Supplier Terbaik Matched</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {prediksiStok.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-[#1E293B]">{item.produk}</td>
                  <td className="p-4 font-medium text-slate-700">{item.sisaStok}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${
                      item.status === 'Kritis' ? 'bg-red-50 text-[#EF4444]' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {item.prediksiHabis}
                    </span>
                  </td>
                  <td className="p-4 font-bold text-[#2563EB]">{item.kebutuhanRestok}</td>
                  <td className="p-4 text-slate-600">
                    <p className="font-medium text-xs">{item.supplierTerbaik}</p>
                    <p className="text-[10px] text-amber-500 font-bold">★ {item.ratingSupplier}</p>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="bg-[#10B981] hover:bg-emerald-600 text-white px-4 py-2 rounded-xl text-xs font-semibold transition-colors shadow-sm inline-flex items-center gap-1">
                      <RefreshCw className="w-3.5 h-3.5" /> Ambil Stok
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