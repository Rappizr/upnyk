'use client';

import React from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Truck } from 'lucide-react';

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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div>
        <p className="text-sm text-slate-500" style={{ margin: 0 }}>Analisis prediktif otomatis untuk mencegah kekosongan stok komoditas dagang Anda.</p>
      </div>

      {/* INSIGHT CARDS - Menggunakan CSS Grid eksplisit */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl" style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB' }}>
            <TrendingUp className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Prediksi Kebutuhan Stok</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', lineHeight: 1.6, margin: 0 }}>
              Berdasarkan tren penjualan mingguan, permintaan **Beras Mentik** diproyeksikan melonjak 15% menjelang akhir bulan ini.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div className="p-3 bg-emerald-50 text-[#10B981] rounded-xl" style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981' }}>
            <Truck className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Integrasi Rantai Pasok Terdekat</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', lineHeight: 1.6, margin: 0 }}>
              Sistem telah mengunci **Kelompok Tani Lestari** sebagai penyuplai dengan rute logistik terpendek dan harga paling kompetitif saat ini.
            </p>
          </div>
        </div>
      </div>

      {/* PREDICTIVE RESTOCK TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Rekomendasi Pengadaan (Smart Restock)</h3>
          <span 
            className="text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 animate-pulse" 
            style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: '1px solid #FDE68A', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
          >
            <AlertTriangle className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Butuh Tindakan Cepat
          </span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Nama Produk</th>
                <th style={{ padding: '1rem' }}>Sisa Stok</th>
                <th style={{ padding: '1rem' }}>Prediksi Kehabisan</th>
                <th style={{ padding: '1rem' }}>Rekomendasi Restok</th>
                <th style={{ padding: '1rem' }}>Supplier Terbaik Matched</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {prediksiStok.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }}>
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontWeight: 600, color: '#1E293B' }}>{item.produk}</td>
                  <td style={{ padding: '1rem', fontWeight: 500, color: '#334155' }}>{item.sisaStok}</td>
                  <td style={{ padding: '1rem' }}>
                    <span 
                      style={{ 
                        padding: '0.125rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 700,
                        backgroundColor: item.status === 'Kritis' ? '#FEE2E2' : '#FEF3C7',
                        color: item.status === 'Kritis' ? '#EF4444' : '#D97706'
                      }}
                    >
                      {item.prediksiHabis}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#2563EB' }}>{item.kebutuhanRestok}</td>
                  <td style={{ padding: '1rem', color: '#475569' }}>
                    <p style={{ fontWeight: 500, fontSize: '0.75rem', margin: 0 }}>{item.supplierTerbaik}</p>
                    <p style={{ fontSize: '10px', color: '#F59E0B', fontWeight: 700, margin: 0, marginTop: '0.125rem' }}>★ {item.ratingSupplier}</p>
                  </td>
                  <td style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>
                    <button 
                      className="bg-[#10B981] hover:bg-emerald-600 text-white font-semibold transition-colors shadow-sm"
                      style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                    >
                      <RefreshCw className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Ambil Stok
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