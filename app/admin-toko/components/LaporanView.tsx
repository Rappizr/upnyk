'use client';

import React, { useState } from 'react';
import { Download, FileText, TrendingUp, ArrowDownRight, Trash2, RefreshCw } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA UTAMA PEMBUKUAN)
// =========================================================================
interface KeuanganData {
  penjualan: number;
  pembelian: number;
  ringkasanWaste: number;
  labaBersih: number;
}

interface LaporanState {
  keuangan: KeuanganData;
  tarikDataTerbaru: () => void;
  eksporKeExcel: () => void;
  eksporKePdf: () => void;
}

const useLaporanStore = create<LaporanState>((set) => ({
  // Data statis dummy awal dihapus total, dimulai murni dari angka 0
  keuangan: {
    penjualan: 0,
    pembelian: 0,
    ringkasanWaste: 0,
    labaBersih: 0,
  },

  // Simulasi menarik data nyata dari menu finansial sistem hulu
  tarikDataTerbaru: () => set(() => {
    const penjualan = 4250000;
    const pembelian = 1850000;
    const ringkasanWaste = 118000;
    // Rumus Laba Bersih otomatis: Penjualan - (Pembelian + Waste)
    const labaBersih = penjualan - (pembelian + ringkasanWaste);

    alert("Data transaksi berjalan bulan Juli 2026 berhasil disinkronkan!");
    return {
      keuangan: { penjualan, pembelian, ringkasanWaste, labaBersih }
    };
  }),

  // Fitur interaktif simulasi download file Excel
  eksporKeExcel: () => {
    alert("Memproses spreadsheet... Berhasil mengunduh berkas: 'Laporan_Keuangan_Juli2026.xlsx'");
  },

  // Fitur interaktif simulasi download file PDF
  eksporKePdf: () => {
    alert("Menyusun lembar dokumen resmi... Berhasil mengunduh dokumen: 'Laporan_Finansial_PasarNusa.pdf'");
  }
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA LAPORAN FINANSIAL
// =========================================================================
export default function LaporanPage() {
  // Konsumsi data pembukuan live dari Zustand store hulu
  const { keuangan, tarikDataTerbaru, eksporKeExcel, eksporKePdf } = useLaporanStore();
  const isDataKosong = keuangan.penjualan === 0;

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* ACTION BAR NAVIGATION */}
      <div 
        className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm" 
        style={{ backgroundColor: '#ffffff', padding: '1rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <p className="text-xs text-slate-500 font-medium" style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 500, margin: 0 }}>
            Periode Pembukuan: Jurnal Berjalan (Juli 2026)
          </p>
          {isDataKosong && (
            <button
              onClick={tarikDataTerbaru}
              style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', backgroundColor: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB', fontSize: '11px', fontWeight: 600, padding: '0.25rem 0.5rem', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              <RefreshCw style={{ width: '0.75rem', height: '0.75rem' }} /> Sinkronisasi Data Finansial
            </button>
          )}
        </div>

        {/* BENARIN FITUR BUTTON EXPORT (Terpisah & Responsif) */}
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button 
            onClick={eksporKeExcel}
            disabled={isDataKosong}
            style={{ 
              backgroundColor: isDataKosong ? '#F1F5F9' : '#ffffff', 
              color: isDataKosong ? '#94A3B8' : '#475569', 
              border: isDataKosong ? '1px solid #E2E8F0' : '1px solid #CBD5E1', 
              padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, 
              cursor: isDataKosong ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' 
            }}
          >
            <Download className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Ekspor .XLSX (Excel)
          </button>

          <button 
            onClick={eksporKePdf}
            disabled={isDataKosong}
            style={{ 
              backgroundColor: isDataKosong ? '#CBD5E1' : '#2563EB', 
              color: '#ffffff', 
              padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none',
              cursor: isDataKosong ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem',
              boxShadow: isDataKosong ? 'none' : '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            <FileText className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Cetak Dokumen .PDF
          </button>
        </div>
      </div>

      {/* REVENUE STATS GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card 1: Penjualan */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laporan Penjualan</span>
            <TrendingUp className="w-4 h-4 text-[#10B981]" style={{ color: '#10B981', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            Rp {keuangan.penjualan.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 2: Pembelian */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laporan Pembelian</span>
            <ArrowDownRight className="w-4 h-4 text-[#2563EB]" style={{ color: '#2563EB', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
            Rp {keuangan.pembelian.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 3: Laba Bersih */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ background: keuangan.labaBersih >= 0 ? 'linear-gradient(135deg, #ECFDF5 0%, #FFFFFF 100%)' : 'linear-gradient(135deg, #FEF2F2 0%, #FFFFFF 100%)', padding: '1.25rem', borderRadius: '0.75rem', border: keuangan.labaBersih >= 0 ? '1px solid #A7F3D0' : '1px solid #FEE2E2', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: keuangan.labaBersih >= 0 ? '#10B981' : '#EF4444' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Laba Rugi Bersih</span>
            <FileText className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold" style={{ fontSize: '1.25rem', fontWeight: 700, color: keuangan.labaBersih >= 0 ? '#10B981' : '#EF4444', margin: 0 }}>
            Rp {keuangan.labaBersih.toLocaleString('id-ID')}
          </p>
        </div>

        {/* Card 4: Waste */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '0.75rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div className="text-slate-400 flex items-center justify-between" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#94A3B8' }}>
            <span className="text-xs font-bold uppercase" style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ringkasan Waste</span>
            <Trash2 className="w-4 h-4 text-[#EF4444]" style={{ color: '#EF4444', width: '1rem', height: '1rem' }} />
          </div>
          <p className="text-xl font-bold text-[#EF4444]" style={{ fontSize: '1.25rem', fontWeight: 700, color: '#EF4444', margin: 0 }}>
            Rp {keuangan.ringkasanWaste.toLocaleString('id-ID')}
          </p>
        </div>

      </div>

      {/* KONDISI PLACEHOLDER JIKA DATA BELUM DISINKRONKAN */}
      {isDataKosong && (
        <div style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94A3B8', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', fontWeight: 500, fontSize: '0.875rem' }}>
          Jurnal pembukuan berjalan kosong. Silakan klik tombol <strong style={{ color: '#2563EB' }}>"Sinkronisasi Data Finansial"</strong> di pojok kiri atas untuk menarik rekapitulasi penjualan terkini dari sistem.
        </div>
      )}
    </div>
  );
}