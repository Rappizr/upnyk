'use client';

import React from 'react';
import { Download, FileText, TrendingUp, ArrowDownRight, Trash2 } from 'lucide-react';

export default function LaporanPage() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ACTION BAR */}
      <div 
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm" 
        style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <p className="text-xs text-slate-500 font-medium" style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, margin: 0 }}>
          Periode Pembukuan: Jurnal Berjalan (Juli 2026)
        </p>
        <button 
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-colors"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
        >
          <Download className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Ekspor Excel/PDF
        </button>
      </div>

      {/* REVENUE STATS GRID - Dikunci menggunakan CSS Grid eksplisit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card 1 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laporan Penjualan</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" style={{ color: '#10B981', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Rp 4.250.000</p>
        </div>

        {/* Card 2 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laporan Pembelian</span>
            <ArrowDownRight className="w-4 h-4 text-[#2563EB]" style={{ color: '#2563EB', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Rp 1.850.000</p>
        </div>

        {/* Card 3 (Laba Bersih) */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #A7F3D0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-[#10B981] flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#10B981' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laba Rugi Bersih</span>
            <FileText className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#10B981]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#10B981', margin: 0 }}>Rp 2.400.000</p>
        </div>

        {/* Card 4 */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ringkasan Waste</span>
            <Trash2 className="w-4 h-4 text-[#EF4444]" style={{ color: '#EF4444', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#EF4444]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444', margin: 0 }}>Rp 118.000</p>
        </div>

      </div>
    </div>
  );
}