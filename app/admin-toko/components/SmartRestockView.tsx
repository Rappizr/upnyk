'use client';

import React from 'react';
import { RefreshCw, TrendingUp, AlertTriangle, Truck } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA PREDIKTIF SMART RESTOCK MURNI)
// =========================================================================
interface RestockItem {
  id: number;
  produk: string;
  sisaStokValue: number; 
  sisaStokUnit: string;  
  prediksiHabis: string;
  kebutuhanRestok: string;
  supplierTerbaik: string;
  status: 'Kritis' | 'Waspada' | 'Aman';
  ratingSupplier: string;
}

interface SmartRestockState {
  prediksiStok: RestockItem[];
  eksekusiRestok: (id: number) => void;
}

const useSmartRestockStore = create<SmartRestockState>((set) => ({
  // Murni kosong total dari awal tanpa data inisial bawaan
  prediksiStok: [],

  eksekusiRestok: (id) =>
    set((state) => {
      const itemTerpilih = state.prediksiStok.find((item) => item.id === id);
      if (!itemTerpilih) return {};

      alert(`PO Otomatis dikirim ke "${itemTerpilih.supplierTerbaik}" untuk pengadaan ${itemTerpilih.kebutuhanRestok} ${itemTerpilih.produk}!`);

      return {
        prediksiStok: state.prediksiStok.map((item) => {
          if (item.id === id) {
            const jumlahTambahan = parseInt(item.kebutuhanRestok);
            return {
              ...item,
              sisaStokValue: item.sisaStokValue + jumlahTambahan,
              prediksiHabis: "Aman (Stok Baru Terpesan)",
              status: "Aman"
            };
          }
          return item;
        })
      };
    })
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA
// =========================================================================
export default function SmartRestockPage() {
  // Konsumsi state global terintegrasi dari Zustand Store
  const { prediksiStok, eksekusiRestok } = useSmartRestockStore();

  // Cek apakah masih ada produk berstatus kritis/waspada untuk mengontrol badge header
  const butuhTindakanCepat = prediksiStok.some(item => item.status === 'Kritis' || item.status === 'Waspada');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      <div>
        <p className="text-sm text-slate-500" style={{ margin: 0 }}>Analisis prediktif otomatis untuk mencegah kekosongan stok komoditas dagang Anda.</p>
      </div>

      {/* INSIGHT CARDS */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB' }}>
            <TrendingUp className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Prediksi Kebutuhan Stok</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', lineHeight: 1.6, margin: 0 }}>
              Berdasarkan tren penjualan mingguan, permintaan komoditas utama diproyeksikan berfluktuasi menjelang akhir bulan ini.
            </p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-start gap-4" style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'start', gap: '1rem' }}>
          <div style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981' }}>
            <Truck className="w-6 h-6" style={{ width: '1.5rem', height: '1.5rem' }} />
          </div>
          <div>
            <h4 className="font-bold text-sm text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Integrasi Rantai Pasok Terdekat</h4>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', lineHeight: 1.6, margin: 0 }}>
              Sistem akan otomatis mencocokkan produsen terdekat dengan rute logistik terpendek dan harga paling kompetitif saat parameter kritis aktif.
            </p>
          </div>
        </div>
      </div>

      {/* PREDICTIVE RESTOCK TABLE CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Rekomendasi Pengadaan (Smart Restock)</h3>
          
          <span 
            className={`text-xs font-semibold px-2.5 py-1 rounded-lg flex items-center gap-1 ${butuhTindakanCepat ? 'animate-pulse' : ''}`} 
            style={{ 
              fontSize: '0.75rem', 
              fontWeight: 600, 
              backgroundColor: butuhTindakanCepat ? '#FEF3C7' : '#ECFDF5', 
              color: butuhTindakanCepat ? '#D97706' : '#10B981', 
              padding: '0.25rem 0.625rem', 
              borderRadius: '0.5rem', 
              border: butuhTindakanCepat ? '1px solid #FDE68A' : '1px solid #A7F3D0', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.25rem' 
            }}
          >
            <AlertTriangle className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> 
            {butuhTindakanCepat ? 'Butuh Tindakan Cepat' : 'Gudang Aman'}
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
              {prediksiStok.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94A3B8', fontWeight: 500 }}>
                    Tidak ada parameter produk menipis atau kritis harian terdeteksi. Ekosistem stok aman.
                  </td>
                </tr>
              ) : (
                prediksiStok.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                    <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontWeight: 600, color: '#1E293B' }}>{item.produk}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#334155' }}>
                      {item.sisaStokValue.toLocaleString('id-ID')} {item.sisaStokUnit}
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <span 
                        style={{ 
                          padding: '0.125rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          backgroundColor: item.status === 'Kritis' ? '#FEE2E2' : item.status === 'Waspada' ? '#FEF3C7' : '#E6F4EA',
                          color: item.status === 'Kritis' ? '#EF4444' : item.status === 'Waspada' ? '#D97706' : '#10B981'
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
                      {item.status !== 'Aman' && (
                        <button 
                          type="button"
                          onClick={() => eksekusiRestok(item.id)}
                          className="bg-[#10B981] hover:bg-emerald-600 text-white font-semibold transition-colors shadow-sm"
                          style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}
                        >
                          <RefreshCw className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Ambil Stok
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}