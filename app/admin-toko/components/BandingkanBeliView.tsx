'use client';

import React from 'react';
import { Star, MapPin, ArrowRight, ShoppingCart } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA PASOKAN BAHAN BAKU)
// =========================================================================
interface KomparasiItem {
  id: number;
  komoditas: string;
  produsen: string;
  harga: number;
  jarak: string;
  rating: number;
  stokValue: number; // Nilai angka asli untuk kalkulasi potongan stok
  stokUnit: string;  // Satuan berat/jumlah (Ton/Kg)
  rekomendasi: string | null;
}

interface KomparasiState {
  komparasiBahanBaku: KomparasiItem[];
  beliKomoditas: (id: number) => void;
}

const useKomparasiStore = create<KomparasiState>((set) => ({
  komparasiBahanBaku: [
    {
      id: 1,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Kelompok Tani Lestari",
      harga: 13200,
      jarak: "0.4 Km",
      rating: 4.9,
      stokValue: 1.2,
      stokUnit: "Ton",
      rekomendasi: "Harga & Jarak Terbaik"
    },
    {
      id: 2,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Tani Makmur Sejahtera",
      harga: 13500,
      jarak: "1.8 Km",
      rating: 4.7,
      stokValue: 800,
      stokUnit: "Kg",
      rekomendasi: null
    },
    {
      id: 3,
      komoditas: "Beras Mentik Wangi (Per Kg)",
      produsen: "Sawah Berkah Rahayu",
      harga: 12900,
      jarak: "4.5 Km",
      rating: 4.5,
      stokValue: 2.5,
      stokUnit: "Ton",
      rekomendasi: "Termurah (Ongkir Menyesuaikan)"
    }
  ],

  // Aksi interaktif pembelian langsung (Mengurangi stok secara real-time)
  beliKomoditas: (id) =>
    set((state) => {
      const itemTerpilih = state.komparasiBahanBaku.find((item) => item.id === id);
      if (!itemTerpilih) return {};

      if (itemTerpilih.stokValue <= 0) {
        alert(`Maaf, pasokan dari ${itemTerpilih.produsen} sedang habis!`);
        return {};
      }

      alert(`Pesanan pembelian pasokan ke "${itemTerpilih.produsen}" berhasil dibuat! Invoice otomatis terbit di menu penjualan.`);

      // Simulasi pengurangan stok harian mitra sebanyak 50 unit (Kg) atau 0.05 (Ton)
      return {
        komparasiBahanBaku: state.komparasiBahanBaku.map((item) => {
          if (item.id === id) {
            const pengurangan = item.stokUnit === 'Ton' ? 0.05 : 50;
            const stokBaru = Math.max(0, item.stokValue - pengurangan);
            return {
              ...item,
              stokValue: parseFloat(stokBaru.toFixed(2))
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
export default function BandingkanBeliPage() {
  // Konsumsi memori state global dari store hulu
  const { komparasiBahanBaku, beliKomoditas } = useKomparasiStore();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div>
        <p className="text-sm text-slate-500" style={{ margin: 0 }}>Analisis komparatif harga, kedekatan logistik desa, dan performa rating mitra.</p>
      </div>

      {/* COMPARISON TABLE CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Analisis Komparasi Pasokan: Beras Mentik Wangi</h3>
          <span className="text-xs bg-blue-50 text-[#2563EB] font-semibold px-2.5 py-1 rounded-lg border border-blue-100" style={{ fontSize: '0.75rem', fontWeight: 600, backgroundColor: '#EFF6FF', color: '#2563EB', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', border: '1px solid #BFDBFE' }}>
            {komparasiBahanBaku.length} Produsen Ditemukan
          </span>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Produsen / Petani</th>
                <th style={{ padding: '1rem' }}>Bandingkan Harga</th>
                <th style={{ padding: '1rem' }}>Bandingkan Jarak</th>
                <th style={{ padding: '1rem' }}>Bandingkan Rating</th>
                <th style={{ padding: '1rem' }}>Tersedia</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {komparasiBahanBaku.map((item) => (
                <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                  <td style={{ padding: '1rem', paddingLeft: '1.5rem' }}>
                    <p style={{ fontWeight: 600, color: '#1E293B', margin: 0 }}>{item.produsen}</p>
                    {item.rekomendasi && (
                      <span 
                        style={{ fontSize: '10px', fontWeight: 700, backgroundColor: '#ECFDF5', color: '#10B981', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', border: '1px solid #D1FAE5', marginTop: '0.25rem', display: 'inline-block' }}
                      >
                        {item.rekomendasi}
                      </span>
                    )}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: '#1E293B' }}>
                    Rp {item.harga.toLocaleString('id-ID')}
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontWeight: 500 }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin className="w-3.5 h-3.5 text-slate-400" style={{ width: '0.875rem', height: '0.875rem', color: '#94A3B8' }} /> {item.jarak}
                    </span>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 700, color: '#F59E0B' }}>
                      <Star className="w-3.5 h-3.5 fill-current" style={{ width: '0.875rem', height: '0.875rem' }} /> {item.rating}
                    </span>
                  </td>
                  <td style={{ padding: '1rem', color: '#475569', fontWeight: 700 }}>
                    {item.stokValue === 0 ? (
                      <span style={{ color: '#EF4444' }}>Habis</span>
                    ) : (
                      `${item.stokValue.toLocaleString('id-ID')} ${item.stokUnit}`
                    )}
                  </td>
                  <td style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>
                    <button 
                      onClick={() => beliKomoditas(item.id)}
                      disabled={item.stokValue <= 0}
                      className="bg-[#10B981] hover:bg-emerald-600 text-white font-semibold transition-colors shadow-sm"
                      style={{ 
                        backgroundColor: item.stokValue <= 0 ? '#CBD5E1' : '#10B981', 
                        color: '#ffffff', 
                        padding: '0.5rem 1rem', 
                        borderRadius: '0.75rem', 
                        fontSize: '0.75rem', 
                        fontWeight: 600, 
                        border: 'none', 
                        cursor: item.stokValue <= 0 ? 'not-allowed' : 'pointer', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        gap: '0.375rem' 
                      }}
                    >
                      <ShoppingCart className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} /> Beli Langsung
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* VALUE PROP WIDGET */}
      <div 
        className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
        style={{ background: 'linear-gradient(90deg, #EFF6FF 0%, #EEF2F6 100%)', border: '1px solid #BFDBFE', padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}
      >
        <div>
          <h4 className="font-bold text-sm text-[#2563EB]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#2563EB', margin: 0 }}>Ingin hemat biaya pengiriman logistik?</h4>
          <p className="text-xs text-slate-600 mt-1" style={{ fontSize: '0.75rem', color: '#475569', margin: 0, marginTop: '0.25rem', lineHeight: 1.5 }}>Gunakan fitur <strong>Pembelian Bersama</strong> di menu Kolaborasi UMKM untuk menggabungkan kuota muatan truk dengan toko sekitar.</p>
        </div>
        <button 
          className="text-xs font-bold text-[#2563EB] bg-white border border-blue-200 shadow-sm hover:bg-blue-50 transition-all"
          style={{ backgroundColor: '#ffffff', color: '#2563EB', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 700, border: '1px solid #BFDBFE', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}
        >
          Buka Kolaborasi <ArrowRight className="w-3.5 h-3.5" style={{ width: '0.875rem', height: '0.875rem' }} />
        </button>
      </div>
    </div>
  );
}