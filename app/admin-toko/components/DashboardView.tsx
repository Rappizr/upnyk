'use client';

import React from 'react';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', width: '100%' }}>
      
      {/* METRICS GRID - Dikunci menggunakan CSS Grid murni */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Penjualan Hari Ini</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>Rp 4.250.000</p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem' }}>↑ 12% vs kemarin</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Produk Terjual</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>142 <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>pcs</span></p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem' }}>Susu & Keripik dominan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Pesanan Baru</p>
          <p className="text-2xl font-bold mt-2 text-[#2563EB]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>18 <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>order</span></p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Perlu diproses segera</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Pengeluaran (Bahan Baku)</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>Rp 1.850.000</p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Restock Gabah & Madu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #A7F3D0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#10B981' }}>Laba Bersih</p>
          <p className="text-2xl font-bold mt-2 text-[#10B981]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>Rp 2.400.000</p>
          <span className="text-xs text-[#10B981] font-bold mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: 700 }}>Margin Sehat (56%)</span>
        </div>

      </div>

      {/* MIDDLE SECTION - Membagi ruang bawah menjadi 2 bagian secara proporsional */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
        
        {/* Alert Smart Restock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="flex justify-between items-start mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Smart Restock Alert</h3>
                <p className="text-xs text-slate-400 mt-0.5" style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, marginTop: '0.25rem' }}>Analisis prediktif berbasis sisa stok harian desa</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#FEF3C7', color: '#D97706', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: '1px solid #FDE68A' }}>
                Butuh Tindakan
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #FEE2E2' }}>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Beras Mentik Wangi (Batch B)</p>
                  <p className="text-xs text-[#EF4444] font-medium mt-0.5" style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>Hampir Habis (Sisa 3 Kg) • Prediksi Habis: 1 Hari Lagi</p>
                </div>
                <button className="bg-[#10B981] hover:bg-emerald-600 text-white font-semibold shadow-sm" style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>
                  Restock Otomatis
                </button>
              </div>

              <div className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #FEE2E2' }}>
                <div>
                  <p className="text-sm font-semibold text-[#1E293B]" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>Gula Aren Cair Lokal</p>
                  <p className="text-xs text-[#EF4444] font-medium mt-0.5" style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>Hampir Kedaluwarsa (Exp: 14 Juli 2026)</p>
                </div>
                <button className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-sm" style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}>
                  Buat Promo Flasdsale
                </button>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-slate-400" style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', fontSize: '0.75rem', color: '#94A3B8' }}>
            <span>Rekomendasi Supplier Terbaik saat ini: <strong style={{ color: '#475569' }}>Kelompok Tani Lestari (0.4 Km)</strong></span>
          </div>
        </div>

        {/* Waste Analysis Widget */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Analisis Limbah & Rusak</h3>
            <p className="text-xs text-slate-400 mt-0.5" style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, marginTop: '0.25rem' }}>Estimasi kerugian dan kebocoran supply chain</p>

            <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Produk Rusak (Logistik)</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>4 Pcs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Produk Expired</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>2 Pcs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontWeight: 500 }}>Estimasi Kerugian</span>
                <span style={{ fontWeight: 700, color: '#EF4444' }}>Rp 340.000</span>
              </div>
            </div>
          </div>

          <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', marginTop: '1rem' }}>
            <p style={{ margin: 0, fontSize: '11px', fontWeight: 700, color: '#2563EB', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Rekomendasi Solusi</p>
            <p style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.75rem', color: '#334155', lineHeight: 1.6 }}>Gunakan fitur <strong style={{ color: '#2563EB' }}>Berbagi Bahan Baku</strong> di Kolaborasi UMKM.</p>
          </div>
        </div>

      </div>

    </div>
  );
}