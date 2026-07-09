'use client';

import React from 'react';
import { Trash2, Sparkles, TrendingDown } from 'lucide-react';

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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <p className="text-sm text-slate-500" style={{ margin: 0 }}>Pantau kebocoran keuntungan bisnis dengan manajemen penyusutan produk rusak dan kedaluwarsa.</p>
      </div>

      {/* METRICS SUMMARY GRID - Dikunci menggunakan CSS Grid eksplisit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        <div className="bg-white p-5 rounded-xl border border-slate-200" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="text-xs font-semibold text-slate-400 uppercase" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Produk Rusak Total</span>
          <p className="text-xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>4 <span className="text-xs font-normal text-slate-400" style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94A3B8' }}>Pcs</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="text-xs font-semibold text-slate-400 uppercase" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Produk Kedaluwarsa</span>
          <p className="text-xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>2 <span className="text-xs font-normal text-slate-400" style={{ fontSize: '0.75rem', fontWeight: 400, color: '#94A3B8' }}>Botol</span></p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#FEF2F2', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #FEE2E2', borderLeft: '4px solid #EF4444', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <span className="text-xs font-semibold text-red-500 uppercase flex items-center gap-1" style={{ fontSize: '11px', fontWeight: 700, color: '#EF4444', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
            <TrendingDown className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Total Estimasi Kerugian
          </span>
          <p className="text-xl font-bold text-[#EF4444] mt-1" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444', margin: 0 }}>Rp 118.000</p>
        </div>

      </div>

      {/* WASTE ANALYSIS LIST CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Daftar Kebocoran Stok & Estimasi Rugi</h3>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Produk Terimbas</th>
                <th style={{ padding: '1rem' }}>Kondisi / Status</th>
                <th style={{ padding: '1rem' }}>Jumlah Jurnal</th>
                <th style={{ padding: '1rem' }}>Potensi Kerugian</th>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Rekomendasi Tindakan Promo</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {dataLimbah.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontWeight: 600, color: '#1E293B' }}>{item.produk}</td>
                  <td style={{ padding: '1rem' }}>
                    <span 
                      style={{ 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 500,
                        backgroundColor: item.kondisi.includes('Kedaluwarsa') ? '#FEF3C7' : '#FEE2E2',
                        color: item.kondisi.includes('Kedaluwarsa') ? '#D97706' : '#EF4444'
                      }}
                    >
                      {item.kondisi}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontWeight: 500 }}>{item.jumlah}</td>
                  <td style={{ padding: '1rem', color: '#EF4444', fontWeight: 700 }}>Rp {item.kerugian.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontSize: '0.75rem', color: '#475569', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', color: '#2563EB' }}>
                      <Sparkles className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> {item.solusi}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>
                    <button 
                      className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm"
                      style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                    >
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