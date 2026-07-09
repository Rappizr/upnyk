'use client';

import React from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Box, Calendar, Layers } from 'lucide-react';

export default function InventarisPage() {
  const dataStokProduk = [
    {
      id: 1,
      produk: "Beras Mentik Wangi",
      batch: "BTW-002-B",
      stok: "350 Kg",
      barangMasuk: "500 Kg",
      barangKeluar: "150 Kg",
      tglMasuk: "01 Juli 2026",
      expired: "01 Jan 2027",
      status: "Aman"
    },
    {
      id: 2,
      produk: "Gula Aren Cair Lokal",
      batch: "GAC-L04",
      stok: "3 Botol",
      barangMasuk: "50 Botol",
      barangKeluar: "47 Botol",
      tglMasuk: "14 April 2026",
      expired: "14 Juli 2026",
      status: "Kritis"
    },
    {
      id: 3,
      produk: "Madu Hutan Klanceng",
      batch: "MHK-V09",
      stok: "14 Botol",
      barangMasuk: "30 Botol",
      barangKeluar: "16 Botol",
      tglMasuk: "20 Mei 2026",
      expired: "20 Mei 2028",
      status: "Aman"
    }
  ];

  return (
    <div className="space-y-6">
      {/* TOP BAR ACTION */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <p className="text-sm text-slate-500">Manajemen pelacakan batch komoditas, mutasi barang masuk-keluar, dan kontrol tanggal kedaluwarsa.</p>
        </div>
        <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors flex items-center gap-2 shadow-sm shrink-0">
          <Plus className="w-4 h-4" /> Tambah Stok / Batch Baru
        </button>
      </div>

      {/* METRICS SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Barang Masuk (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1">1.450 <span className="text-sm font-normal text-slate-400">Kg/Pcs</span></p>
          </div>
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl">
            <ArrowDownLeft className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Barang Keluar (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1">980 <span className="text-sm font-normal text-slate-400">Kg/Pcs</span></p>
          </div>
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl">
            <ArrowUpRight className="w-5 h-5" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Kontrol Batch Aktif</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1">14 <span className="text-sm font-normal text-slate-400">Batch</span></p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100">
            <Layers className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* INVENTORY TABLE CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/30">
          <h3 className="font-bold text-base text-[#1E293B]">Data Produk & Buku Mutasi Logistik</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-4 pl-6">Data Produk</th>
                <th className="p-4">Kode Batch</th>
                <th className="p-4">Barang Masuk</th>
                <th className="p-4">Barang Keluar</th>
                <th className="p-4">Sisa Stok</th>
                <th className="p-4">Tanggal Masuk</th>
                <th className="p-4 pl-6">Expired Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dataStokProduk.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-[#1E293B]">
                    <div className="flex items-center gap-2">
                      <Box className="w-4 h-4 text-slate-400" />
                      {item.produk}
                    </div>
                  </td>
                  <td className="p-4 text-slate-500 font-mono text-xs">{item.batch}</td>
                  <td className="p-4 text-[#10B981] font-medium">+{item.barangMasuk}</td>
                  <td className="p-4 text-[#2563EB] font-medium">-{item.barangKeluar}</td>
                  <td className="p-4 font-bold text-[#1E293B]">{item.stok}</td>
                  <td className="p-4 text-slate-500">
                    <span className="flex items-center gap-1.5 text-xs">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" /> {item.tglMasuk}
                    </span>
                  </td>
                  <td className="p-4 pl-6">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${
                      item.status === 'Kritis' 
                        ? 'bg-red-50 text-[#EF4444] border border-red-100 animate-pulse' 
                        : 'bg-slate-50 text-slate-600'
                    }`}>
                      {item.expired} {item.status === 'Kritis' && '(Hampir Expired!)'}
                    </span>
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