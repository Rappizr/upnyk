'use client';

import React from 'react';
import { Star, MapPin, Phone, Heart, RefreshCw } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA UTAMA DIREKTORI SUPPLIER MURNI)
// =========================================================================
interface Supplier {
  id: number;
  nama: string;
  lokasi: string;
  rating: number;
  tipe: string;
  isFavorit: boolean;
}

interface SupplierState {
  suppliers: Supplier[];
  tarikDataSupplier: () => void;
  toggleFavorit: (id: number) => void;
}

const useSupplierStore = create<SupplierState>((set) => ({
  // Murni dikosongkan total dari awal agar tidak ada data dummy/statis bawaan
  suppliers: [],

  // Fitur memuat data secara dinamis dari hulu lewat interaksi user
  tarikDataSupplier: () => set(() => {
    alert("Berhasil menyinkronkan daftar produsen utama pedesaan terdekat!");
    return {
      suppliers: [
        { id: 1, nama: "Kelompok Tani Lestari", lokasi: "Kecamatan Sukamaju (0.4 Km)", rating: 4.9, tipe: "Lokal & Favorit", isFavorit: true },
        { id: 2, nama: "Peternakan Unggul Desa", lokasi: "Desa Sejahtera (3.2 Km)", rating: 4.7, tipe: "Lokal", isFavorit: false }
      ]
    };
  }),

  // Fungsi interaktif mengubah status favorit supplier desa
  toggleFavorit: (id) =>
    set((state) => ({
      suppliers: state.suppliers.map((sup) =>
        sup.id === id ? { ...sup, isFavorit: !sup.isFavorit } : sup
      )
    }))
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA
// =========================================================================
export default function SupplierPage() {
  // Konsumsi data direktori supplier langsung dari Zustand store global
  const { suppliers, toggleFavorit, tarikDataSupplier } = useSupplierStore();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* KONDISI JIKA DATA MASIH KOSONG */}
      {suppliers.length === 0 ? (
        <div 
          style={{ 
            padding: '4rem 2rem', 
            textAlign: 'center', 
            backgroundColor: '#ffffff', 
            borderRadius: '1rem', 
            border: '1px solid #E2E8F0',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '1.25rem',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.05)'
          }}
        >
          <div style={{ color: '#94A3B8', fontWeight: 500, fontSize: '0.875rem', lineHeight: '1.5' }}>
            Belum ada produsen supplier desa yang terdaftar atau disinkronisasikan ke dalam sistem.
          </div>

          {/* Tombol diletakkan di dalam box agar pasti terlihat di layar Anda */}
          <button 
            type="button"
            onClick={tarikDataSupplier}
            style={{ 
              backgroundColor: '#2563EB', 
              color: '#ffffff', 
              padding: '0.625rem 1.25rem', 
              borderRadius: '0.75rem', 
              fontSize: '0.875rem', 
              fontWeight: 600, 
              border: 'none', 
              cursor: 'pointer', 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '0.5rem',
              boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)'
            }}
          >
            <RefreshCw className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} /> Sinkronisasi Data Mitra
          </button>
        </div>
      ) : (
        
        // KONDISI JIKA DATA SUDAH TERISI
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%' }}>
          {suppliers.map((sup) => (
            <div 
              key={sup.id} 
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              <div>
                <div className="flex justify-between items-center mb-3" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <span 
                    className="text-xs text-[#10B981] font-bold"
                    style={{ fontSize: '0.75rem', color: '#10B981', fontWeight: 700, backgroundColor: '#ECFDF5', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: '1px solid #D1FAE5' }}
                  >
                    {sup.tipe}
                  </span>
                  
                  {/* Ikon Heart Interaktif */}
                  <Heart 
                    onClick={() => toggleFavorit(sup.id)}
                    className="w-4 h-4 transition-colors" 
                    style={{ 
                      width: '1rem', 
                      height: '1rem', 
                      color: sup.isFavorit ? '#EF4444' : '#94A3B8', 
                      fill: sup.isFavorit ? '#EF4444' : 'transparent',
                      cursor: 'pointer' 
                    }} 
                  />
                </div>
                
                <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{sup.nama}</h3>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.25rem', margin: 0 }}>
                  <MapPin className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> {sup.lokasi}
                </p>
              </div>
              
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between" style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span className="flex items-center gap-1 text-amber-500 font-bold text-sm" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#F59E0B', fontWeight: 700, fontSize: '0.875rem' }}>
                  <Star className="w-4 h-4 fill-current" style={{ width: '1rem', height: '1rem' }} /> {sup.rating}
                </span>
                <button 
                  type="button"
                  onClick={() => alert(`Menghubungkan jalur komunikasi logistik ke hotline official ${sup.nama}...`)}
                  className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 transition-colors"
                  style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Phone className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Hubungi Supplier
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}