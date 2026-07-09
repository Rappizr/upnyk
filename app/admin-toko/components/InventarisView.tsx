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
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TOP BAR ACTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="text-sm text-slate-500" style={{ margin: 0 }}>Manajemen pelacakan batch komoditas, mutasi barang masuk-keluar, dan kontrol tanggal kedaluwarsa.</p>
        </div>
        <button 
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm shrink-0"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} /> Tambah Stok / Batch Baru
        </button>
      </div>

      {/* METRICS SUMMARY GRID - Dikunci menggunakan CSS Grid eksplisit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card Barang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Barang Masuk (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>1.450 <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Kg/Pcs</span></p>
          </div>
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl" style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981' }}>
            <ArrowDownLeft className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

        {/* Card Barang Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Barang Keluar (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>980 <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Kg/Pcs</span></p>
          </div>
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl" style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB' }}>
            <ArrowUpRight className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

        {/* Card Total Batch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase' }}>Total Kontrol Batch Aktif</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>14 <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Batch</span></p>
          </div>
          <div className="p-3 bg-slate-50 text-slate-500 rounded-xl border border-slate-100" style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.75rem', color: '#64748B', border: '1px solid #E2E8F0' }}>
            <Layers className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

      </div>

      {/* INVENTORY TABLE CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/30" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Data Produk & Buku Mutasi Logistik</h3>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Data Produk</th>
                <th style={{ padding: '1rem' }}>Kode Batch</th>
                <th style={{ padding: '1rem' }}>Barang Masuk</th>
                <th style={{ padding: '1rem' }}>Barang Keluar</th>
                <th style={{ padding: '1rem' }}>Sisa Stok</th>
                <th style={{ padding: '1rem' }}>Tanggal Masuk</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', paddingLeft: '1.5rem' }}>Expired Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {dataStokProduk.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontWeight: 600, color: '#1E293B' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Box className="w-4 h-4 text-slate-400" style={{ width: '1rem', height: '1rem', color: '#94A3B8' }} />
                      {item.produk}
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: '#64748B', fontFamily: 'monospace', fontSize: '0.75rem' }}>{item.batch}</td>
                  <td style={{ padding: '1rem', color: '#10B981', fontWeight: 500 }}>+{item.barangMasuk}</td>
                  <td style={{ padding: '1rem', color: '#2563EB', fontWeight: 500 }}>-{item.barangKeluar}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1E293B' }}>{item.stok}</td>
                  <td style={{ padding: '1rem', color: '#64748B' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" style={{ width: '0.875rem', height: '0.875rem' }} /> {item.tglMasuk}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', paddingRight: '1.5rem', paddingLeft: '1.5rem' }}>
                    <span 
                      style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        backgroundColor: item.status === 'Kritis' ? '#FEE2E2' : '#F1F5F9',
                        color: item.status === 'Kritis' ? '#EF4444' : '#475569',
                        border: item.status === 'Kritis' ? '1px solid #FEE2E2' : 'none'
                      }}
                      className={item.status === 'Kritis' ? 'animate-pulse' : ''}
                    >
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