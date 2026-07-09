'use client';

import React from 'react';
import { Eye, CheckCircle2, Clock } from 'lucide-react';

export default function PenjualanPage() {
  const pesanan = [
    { id: "INV-2026-001", pelanggan: "Resto Rasa Desa", tgl: "09 Juli 2026", total: 1250000, status: "Diproses" },
    { id: "INV-2026-002", pelanggan: "Toko Kelontong Bu Sri", tgl: "08 Juli 2026", total: 450000, status: "Selesai" }
  ];

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TABLE CONTAINER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Daftar Pesanan & Status Invoice</h3>
        </div>
        
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>No. Invoice</th>
                <th style={{ padding: '1rem' }}>Pelanggan</th>
                <th style={{ padding: '1rem' }}>Tanggal Pesan</th>
                <th style={{ padding: '1rem' }}>Total Penjualan</th>
                <th style={{ padding: '1rem' }}>Status Pesanan</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {pesanan.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>{item.id}</td>
                  <td style={{ padding: '1rem', fontWeight: 600, color: '#1E293B' }}>{item.pelanggan}</td>
                  <td style={{ padding: '1rem', color: '#64748B' }}>{item.tgl}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1E293B' }}>Rp {item.total.toLocaleString('id-ID')}</td>
                  <td style={{ padding: '1rem' }}>
                    <span 
                      className="inline-flex items-center gap-1 font-semibold"
                      style={{ 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '0.5rem', 
                        fontSize: '0.75rem',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        backgroundColor: item.status === 'Selesai' ? '#ECFDF5' : '#EFF6FF',
                        color: item.status === 'Selesai' ? '#10B981' : '#2563EB'
                      }}
                    >
                      {item.status === 'Selesai' ? <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> : <Clock style={{ width: '0.75rem', height: '0.75rem' }} />}
                      {item.status}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button 
                        className="border border-slate-200 hover:bg-slate-50 text-slate-600" 
                        style={{ padding: '0.5rem', borderRadius: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <Eye className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
                      </button>
                      <button 
                        className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-sm"
                        style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                      >
                        Proses
                      </button>
                    </div>
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