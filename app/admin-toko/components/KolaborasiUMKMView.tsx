'use client';

import React from 'react';
import { Users, Share2, ShoppingBag } from 'lucide-react';

export default function KolaborasiUmkmPage() {
  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* 3 COLUMNS COOPERATION GRID - Dikunci menggunakan CSS Grid eksplisit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card 1 */}
        <div 
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}
        >
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl w-fit mb-4" style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB', width: 'max-content', marginBottom: '1rem' }}>
            <Users className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Pembelian Bersama (Joint Order)</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
            Gabung kuota pengadaan bahan baku gabah dengan UMKM tetangga untuk memotong biaya ongkos kirim logistik.
          </p>
        </div>

        {/* Card 2 */}
        <div 
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}
        >
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl w-fit mb-4" style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981', width: 'max-content', marginBottom: '1rem' }}>
            <Share2 className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Berbagi Bahan Baku & Alat</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
            Surplus stok gula atau butuh mesin giling ekstra? Pinjam atau sewa berbayar jangka pendek dengan aman di klaster desa.
          </p>
        </div>

        {/* Card 3 */}
        <div 
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-colors cursor-pointer"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}
        >
          <div className="p-3 bg-purple-50 text-purple-600 rounded-xl w-fit mb-4" style={{ backgroundColor: '#F3E8FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#9333EA', width: 'max-content', marginBottom: '1rem' }}>
            <ShoppingBag className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Kolaborasi Pesanan Besar</h4>
          <p className="text-xs text-slate-500 mt-2 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
            Terima permintaan katering korporat atau instansi pemerintah dalam skala besar dengan membagi beban produksi bersama.
          </p>
        </div>

      </div>
    </div>
  );
}