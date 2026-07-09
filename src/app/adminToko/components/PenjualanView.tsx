'use client';

import React from 'react';
import { FileText, Eye, CheckCircle2, Clock } from 'lucide-react';

export default function PenjualanPage() {
  const pesanan = [
    { id: "INV-2026-001", pelanggan: "Resto Rasa Desa", tgl: "09 Juli 2026", total: 1250000, status: "Diproses" },
    { id: "INV-2026-002", pelanggan: "Toko Kelontong Bu Sri", tgl: "08 Juli 2026", total: 450000, status: "Selesai" }
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-base text-[#1E293B]">Daftar Pesanan & Status Invoice</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-white border-b border-slate-200 text-slate-400 font-semibold text-[11px] uppercase">
                <th className="p-4 pl-6">No. Invoice</th>
                <th className="p-4">Pelanggan</th>
                <th className="p-4">Tanggal Pesan</th>
                <th className="p-4">Total Penjualan</th>
                <th className="p-4">Status Pesanan</th>
                <th className="p-4 pr-6 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {pesanan.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50">
                  <td className="p-4 pl-6 font-mono font-bold text-[#2563EB]">{item.id}</td>
                  <td className="p-4 font-semibold text-[#1E293B]">{item.pelanggan}</td>
                  <td className="p-4 text-slate-500">{item.tgl}</td>
                  <td className="p-4 font-bold text-[#1E293B]">Rp {item.total.toLocaleString('id-ID')}</td>
                  <td className="p-4">
                    <span className={`px-2 py-0.5 rounded text-xs font-semibold inline-flex items-center gap-1 ${
                      item.status === 'Selesai' ? 'bg-emerald-50 text-[#10B981]' : 'bg-blue-50 text-[#2563EB]'
                    }`}>
                      {item.status === 'Selesai' ? <CheckCircle2 className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                      {item.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right space-x-2">
                    <button className="border border-slate-200 hover:bg-slate-50 text-slate-600 p-2 rounded-xl text-xs font-semibold">
                      <Eye className="w-4 h-4 inline" />
                    </button>
                    <button className="bg-[#2563EB] hover:bg-blue-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold shadow-sm">
                      Proses
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