'use client';

import React from 'react';
import { Sparkles, ArrowRight, ArrowDownLeft, ArrowUpRight, Layers } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA UTAMA RINGKASAN DASHBOARD)
// =========================================================================
interface RestockAlert {
  id: number;
  produk: string;
  detail: string;
  tipe: 'stok' | 'expired';
  actionLabel: string;
  btnColor: string;
}

interface DashboardState {
  penjualanHariIni: number;
  produkTerterjual: number;
  pesananBaru: number;
  pengeluaran: number;
  labaBersih: number;
  produkRusakTotal: number;
  produkKedaluwarsa: number;
  estimasiKerugian: number;
  alerts: RestockAlert[];
  prosesAlert: (id: number) => void;
}

const useDashboardStore = create<DashboardState>((set) => ({
  penjualanHariIni: 4250000,
  produkTerterjual: 142,
  pesananBaru: 18,
  pengeluaran: 1850000,
  labaBersih: 2400000,
  produkRusakTotal: 4,
  produkKedaluwarsa: 2,
  estimasiKerugian: 3400000,
  alerts: [
    {
      id: 1,
      produk: "Beras Mentik Wangi (Batch B)",
      detail: "Hampir Habis (Sisa 3 Kg) • Prediksi Habis: 1 Hari Lagi",
      tipe: 'stok',
      actionLabel: "Restock Otomatis",
      btnColor: "#10B981"
    },
    {
      id: 2,
      produk: "Gula Aren Cair Lokal",
      detail: "Hampir Kedaluwarsa (Exp: 14 Juli 2026)",
      tipe: 'expired',
      actionLabel: "Buat Promo Flashdale",
      btnColor: "#2563EB"
    }
  ],

  // Aksi interaktif pemrosesan alert penugasan logistik harian
  prosesAlert: (id) =>
    set((state) => {
      const alertTerpilih = state.alerts.find(a => a.id === id);
      if (!alertTerpilih) return {};

      alert(`Sukses menjalankan aksi "${alertTerpilih.actionLabel}" untuk komoditas ${alertTerpilih.produk}!`);
      
      const sisaAlerts = state.alerts.filter(a => a.id !== id);

      // Simulasi pembaruan data metrik keuangan ketika tindakan mitigasi diambil
      return {
        alerts: sisaAlerts,
        pesananBaru: alertTerpilih.tipe === 'stok' ? state.pesananBaru + 1 : state.pesananBaru,
        estimasiKerugian: alertTerpilih.tipe === 'expired' ? Math.max(0, state.estimasiKerugian - 70000) : state.estimasiKerugian
      };
    })
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA DASHBOARD PORTAL
// =========================================================================
interface DashboardViewProps {
  setActiveMenu?: (menu: string) => void;
}

export default function DashboardPage({ setActiveMenu }: DashboardViewProps) {
  // Konsumsi memori data ringkasan harian dari Zustand Store global
  const { 
    penjualanHariIni, produkTerterjual, pesananBaru, pengeluaran, labaBersih,
    produkRusakTotal, produkKedaluwarsa, estimasiKerugian, alerts, prosesAlert 
  } = useDashboardStore();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      
      {/* WELCOME HERO BANNER */}
      <div 
        style={{ 
          background: 'linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)', 
          padding: '1.5rem 2rem', 
          borderRadius: '1.25rem', 
          color: '#FFFFFF',
          boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.12)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div 
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.375rem', 
              backgroundColor: 'rgba(255, 255, 255, 0.15)', 
              padding: '0.25rem 0.625rem', 
              borderRadius: '9999px',
              width: 'max-content',
              fontSize: '11px',
              fontWeight: 600,
              backdropFilter: 'blur(4px)'
            }}
          >
            <Sparkles style={{ width: '0.75rem', height: '0.75rem' }} /> Platform UMKM #1 Indonesia
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '1.5rem', fontWeight: 800, margin: 0, letterSpacing: '-0.025em' }}>Selamat Datang, Arif!</h1>
              <p style={{ fontSize: '0.8rem', opacity: 0.85, marginTop: '0.25rem', margin: 0, maxWidth: '580px', lineHeight: 1.5 }}>
                Pantau arus kas masuk, analisis prediktif restock komoditas, dan nikmati integrasi rantai pasok desa dari hulu ke hilir.
              </p>
            </div>

            <button 
              onClick={() => setActiveMenu && setActiveMenu('Laporan')}
              style={{ 
                backgroundColor: '#FFFFFF', 
                color: '#2563EB', 
                padding: '0.5rem 1rem', 
                borderRadius: '0.625rem', 
                fontSize: '0.8rem', 
                fontWeight: 700, 
                border: 'none', 
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.375rem',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
                height: 'max-content'
              }}
            >
              Lihat Laporan Buku <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
            </button>
          </div>
        </div>
        <div style={{ position: 'absolute', right: '-5%', bottom: '-50%', width: '200px', height: '200px', borderRadius: '50%', background: 'rgba(255, 255, 255, 0.04)', zIndex: 1 }} />
      </div>

      {/* METRICS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', width: '100%' }}>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Penjualan Hari Ini</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>Rp {penjualanHariIni.toLocaleString('id-ID')}</p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem' }}>↑ 12% vs kemarin</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Produk Terjual</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>{produkTerterjual} <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>pcs</span></p>
          <span className="text-xs text-[#10B981] font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem' }}>Susu & Keripik dominan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Pesanan Baru</p>
          <p className="text-2xl font-bold mt-2 text-[#2563EB]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#2563EB' }}>{pesananBaru} <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>order</span></p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Perlu diproses segera</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#64748B' }}>Pengeluaran (Bahan Baku)</p>
          <p className="text-2xl font-bold mt-2 text-[#1E293B]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 700, color: '#1E293B' }}>Rp {pengeluaran.toLocaleString('id-ID')}</p>
          <span className="text-xs text-slate-400 font-medium mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem' }}>Restock Gabah & Madu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ background: 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #A7F3D0' }}>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider" style={{ margin: 0, fontSize: '11px', color: '#10B981' }}>Laba Bersih</p>
          <p className="text-2xl font-bold mt-2 text-[#10B981]" style={{ margin: 0, marginTop: '0.5rem', fontSize: '1.5rem', fontWeight: 800, color: '#10B981' }}>Rp {labaBersih.toLocaleString('id-ID')}</p>
          <span className="text-xs text-[#10B981] font-bold mt-1 inline-block" style={{ fontSize: '0.75rem', color: '#10B981', marginTop: '0.25rem', fontWeight: 700 }}>Margin Sehat (56%)</span>
        </div>
      </div>

      {/* MIDDLE SECTION */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', width: '100%' }}>
        
        {/* Alert Smart Restock */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="flex justify-between items-start mb-4" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
              <div>
                <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Smart Restock Alert</h3>
                <p className="text-xs text-slate-400 mt-0.5" style={{ fontSize: '0.75rem', color: '#94A3B8', margin: 0, marginTop: '0.25rem' }}>Analisis prediktif berbasis sisa stok harian desa</p>
              </div>
              <span style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: alerts.length > 0 ? '#FEF3C7' : '#F1F5F9', color: alerts.length > 0 ? '#D97706' : '#94A3B8', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: alerts.length > 0 ? '1px solid #FDE68A' : '1px solid #E2E8F0' }}>
                {alerts.length > 0 ? 'Butuh Tindakan' : 'Semua Aman'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {alerts.length === 0 ? (
                <div style={{ padding: '2rem 1rem', textAlign: 'center', color: '#94A3B8', fontSize: '0.85rem', fontWeight: 500 }}>
                  Semua inventaris dan status kedalwarsa aman terkendali.
                </div>
              ) : (
                alerts.map((alertItem) => (
                  <div key={alertItem.id} className="flex items-center justify-between p-3 bg-red-50/50 rounded-xl border border-red-100/50" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#FEF2F2', padding: '0.75rem', borderRadius: '0.75rem', border: '1px solid #FEE2E2' }}>
                    <div>
                      <p className="text-sm font-semibold text-[#1E293B]" style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{alertItem.produk}</p>
                      <p className="text-xs font-medium mt-0.5" style={{ margin: 0, marginTop: '0.25rem', fontSize: '0.75rem', color: '#EF4444', fontWeight: 500 }}>{alertItem.detail}</p>
                    </div>
                    <button 
                      onClick={() => prosesAlert(alertItem.id)}
                      className="text-white font-semibold shadow-sm" 
                      style={{ backgroundColor: alertItem.btnColor, color: '#ffffff', padding: '0.375rem 0.75rem', borderRadius: '0.5rem', fontSize: '0.75rem', border: 'none', cursor: 'pointer' }}
                    >
                      {alertItem.actionLabel}
                    </button>
                  </div>
                ))
              )}
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
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{produkRusakTotal} Pcs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem' }}>
                <span style={{ color: '#64748B' }}>Produk Expired</span>
                <span style={{ fontWeight: 600, color: '#1E293B' }}>{produkKedaluwarsa} Pcs</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.875rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9' }}>
                <span style={{ color: '#64748B', fontWeight: 500 }}>Estimasi Kerugian</span>
                <span style={{ fontWeight: 700, color: '#EF4444' }}>Rp {estimasiKerugian.toLocaleString('id-ID')}</span>
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