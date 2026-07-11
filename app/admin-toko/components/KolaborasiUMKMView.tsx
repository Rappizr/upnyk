'use client';

import React from 'react';
import { Users, Share2, ShoppingBag, ArrowRight } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA UTAMA HUB KOLABORASI)
// =========================================================================
interface KolaborasiHub {
  pembelianBersamaTerisi: number; // Persentase kuota kontainer truk bersama
  totalMitraAktif: number;
  surplusBahanBakuCount: number;
}

interface KolaborasiState {
  hubData: KolaborasiHub;
  gabungJointOrder: () => void;
  tawarkanSurplus: () => void;
  terimaProjectBesar: () => void;
}

const useKolaborasiStore = create<KolaborasiState>((set) => ({
  hubData: {
    pembelianBersamaTerisi: 65, // Kontainer truk logistik terisi 65%
    totalMitraAktif: 12,
    surplusBahanBakuCount: 4
  },

  gabungJointOrder: () => 
    set((state) => {
      if (state.hubData.pembelianBersamaTerisi >= 100) {
        alert("Kuota muatan logistik truk minggu ini sudah penuh!");
        return {};
      }
      alert("Sukses bergabung ke Joint Order! Slot muatan logistik Anda berhasil dikunci.");
      return {
        hubData: {
          ...state.hubData,
          pembelianBersamaTerisi: Math.min(100, state.hubData.pembelianBersamaTerisi + 15), // Naikkan isi kontainer
          totalMitraAktif: state.hubData.totalMitraAktif + 1
        }
      };
    }),

  tawarkanSurplus: () => {
    alert("Formulir penawaran surplus bahan baku berhasil diterbitkan ke sirkuit komunitas UMKM terdekat.");
    set((state) => ({
      hubData: {
        ...state.hubData,
        surplusBahanBakuCount: state.hubData.surplusBahanBakuCount + 1
      }
    }));
  },

  terimaProjectBesar: () => {
    alert("Project konsorsium produksi berhasil dibuka! Undangan delegasi otomatis terkirim ke vendor klaster.");
  }
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA
// =========================================================================
export default function KolaborasiUmkmPage() {
  // Konsumsi data kolaborasi langsung dari Zustand Store global tunggal
  const { hubData, gabungJointOrder, tawarkanSurplus, terimaProjectBesar } = useKolaborasiStore();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      <div>
        <p className="text-sm text-slate-500" style={{ margin: 0 }}>
          Hubungkan kapasitas produksi toko Anda dengan ekosistem klaster UMKM untuk efisiensi logistik dan perluasan pasar.
        </p>
      </div>

      {/* 3 COLUMNS COOPERATION GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card 1: Pembelian Bersama */}
        <div 
          onClick={gabungJointOrder}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-blue-300 transition-all cursor-pointer group"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB', width: 'max-content', marginBottom: '1rem' }}>
              <Users className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Pembelian Bersama (Joint Order)</h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
              Gabung kuota pengadaan bahan baku gabah dengan UMKM tetangga untuk memotong biaya ongkos kirim logistik.
            </p>
          </div>

          {/* Indikator Kuota Truk Live dari Zustand */}
          <div style={{ marginTop: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontWeight: 600, color: '#475569', marginBottom: '0.25rem' }}>
              <span>Muatan Truk Bersama</span>
              <span>{hubData.pembelianBersamaTerisi}%</span>
            </div>
            <div style={{ width: '100%', height: '6px', backgroundColor: '#E2E8F0', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ width: `${hubData.pembelianBersamaTerisi}%`, height: '100%', backgroundColor: '#2563EB', transition: 'width 0.4s ease' }} />
            </div>
            <span style={{ fontSize: '10px', color: '#2563EB', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.75rem' }}>
              Gabung Konsolidasi <ArrowRight style={{ width: '0.75rem', height: '0.75rem' }} />
            </span>
          </div>
        </div>

        {/* Card 2: Berbagi Bahan Baku */}
        <div 
          onClick={tawarkanSurplus}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition-all cursor-pointer group"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981', width: 'max-content', marginBottom: '1rem' }}>
              <Share2 className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Berbagi Bahan Baku & Alat</h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
              Surplus stok gula atau butuh mesin giling ekstra? Pinjam atau sewa berbayar jangka pendek dengan aman di klaster desa.
            </p>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, backgroundColor: '#E6F4EA', padding: '0.25rem 0.5rem', borderRadius: '0.375rem' }}>
              {hubData.surplusBahanBakuCount} Tawaran Aktif Sekitar Anda
            </span>
          </div>
        </div>

        {/* Card 3: Kolaborasi Pesanan Besar */}
        <div 
          onClick={terimaProjectBesar}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-purple-300 transition-all cursor-pointer group"
          style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
        >
          <div>
            <div style={{ backgroundColor: '#F3E8FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#9333EA', width: 'max-content', marginBottom: '1rem' }}>
              <ShoppingBag className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
            </div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Kolaborasi Pesanan Besar</h4>
            <p style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', lineHeight: 1.6, margin: 0 }}>
              Terima permintaan katering korporat atau instansi pemerintah dalam skala besar dengan membagi beban produksi bersama.
            </p>
          </div>

          <div style={{ marginTop: '1.25rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9' }}>
            <span style={{ fontSize: '10px', color: '#9333EA', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
              Buka Konsorsium Produksi <ArrowRight style={{ width: '0.75rem', height: '0.75rem' }} />
            </span>
          </div>
        </div>

      </div>
    </div>
  );
}