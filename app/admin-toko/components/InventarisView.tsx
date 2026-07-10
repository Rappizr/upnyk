'use client';

import React, { useState } from 'react';
import { Plus, ArrowDownLeft, ArrowUpRight, Box, Calendar, Layers, X, Save, ShoppingBag } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA MUTASI LOGISTIK)
// =========================================================================
interface Inventaris {
  id: number;
  produk: string;
  batch: string;
  stok: string;
  barangMasuk: string;
  barangKeluar: string;
  tglMasuk: string;
  expired: string;
  status: 'Aman' | 'Kritis';
  numericMasuk: number;   
  numericKeluar: number;  
}

interface InventarisState {
  dataStokProduk: Inventaris[];
  tambahInventaris: (item: Inventaris) => void;
}

const useInventarisStore = create<InventarisState>((set) => ({
  // Murni kosong total dari awal
  dataStokProduk: [],

  tambahInventaris: (item) => 
    set((state) => ({
      dataStokProduk: [item, ...state.dataStokProduk]
    })),
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA
// =========================================================================
export default function InventarisPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Konsumsi data logistik langsung dari Zustand Store global
  const { dataStokProduk, tambahInventaris } = useInventarisStore();

  // State Form Isian Logistik
  const [formProduk, setFormProduk] = useState('Beras Mentik Wangi');
  const [formBatch, setFormBatch] = useState('');
  const [formMasuk, setFormMasuk] = useState('');
  const [formKeluar, setFormKeluar] = useState('0');
  const [formTglMasuk, setFormTglMasuk] = useState('');
  const [formExpired, setFormExpired] = useState('');
  const [formSatuan, setFormSatuan] = useState('Kg');

  // Menghitung otomatis total ringkasan metrik secara live dari Zustand
  const totalMasukBulanIni = dataStokProduk.reduce((acc, curr) => acc + curr.numericMasuk, 0);
  const totalKeluarBulanIni = dataStokProduk.reduce((acc, curr) => acc + curr.numericKeluar, 0);

  const formatTanggalIndonesia = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  const handleTambahInventaris = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formBatch || !formMasuk || !formTglMasuk || !formExpired) return;

    const hitungSisaStok = Number(formMasuk) - Number(formKeluar);
    const statusStok: 'Aman' | 'Kritis' = hitungSisaStok <= 5 ? 'Kritis' : 'Aman';

    const itemBaru: Inventaris = {
      id: Date.now(),
      produk: formProduk,
      batch: formBatch.toUpperCase(),
      stok: `${hitungSisaStok} ${formSatuan}`,
      barangMasuk: `${formMasuk} ${formSatuan}`,
      barangKeluar: `${formKeluar} ${formSatuan}`,
      tglMasuk: formatTanggalIndonesia(formTglMasuk),
      expired: formatTanggalIndonesia(formExpired),
      status: statusStok,
      numericMasuk: Number(formMasuk),
      numericKeluar: Number(formKeluar)
    };

    tambahInventaris(itemBaru);
    setIsModalOpen(false);

    // Reset Form
    setFormBatch('');
    setFormMasuk('');
    setFormKeluar('0');
    setFormTglMasuk('');
    setFormExpired('');
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TOP BAR ACTION */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <p className="text-sm text-slate-500" style={{ margin: 0 }}>Manajemen pelacakan batch komoditas, mutasi barang masuk-keluar, dan kontrol tanggal kedaluwarsa.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-colors shadow-sm shrink-0"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} /> Tambah Stok / Batch Baru
        </button>
      </div>

      {/* METRICS SUMMARY GRID */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', width: '100%' }}>
        
        {/* Card Barang Masuk */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Barang Masuk (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>{totalMasukBulanIni.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Units</span></p>
          </div>
          <div style={{ backgroundColor: '#ECFDF5', padding: '0.75rem', borderRadius: '0.75rem', color: '#10B981' }}>
            <ArrowDownLeft className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

        {/* Card Barang Keluar */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Barang Keluar (Bulan Ini)</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>{totalKeluarBulanIni.toLocaleString('id-ID')} <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Units</span></p>
          </div>
          <div style={{ backgroundColor: '#EFF6FF', padding: '0.75rem', borderRadius: '0.75rem', color: '#2563EB' }}>
            <ArrowUpRight className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

        {/* Card Total Batch */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm" style={{ backgroundColor: '#ffffff', padding: '1.25rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Kontrol Batch Aktif</span>
            <p className="text-2xl font-bold text-[#1E293B] mt-1" style={{ fontSize: '1.5rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.25rem' }}>{dataStokProduk.length} <span className="text-sm font-normal text-slate-400" style={{ fontSize: '0.875rem', fontWeight: 400, color: '#94A3B8' }}>Batch</span></p>
          </div>
          <div style={{ backgroundColor: '#F8FAFC', padding: '0.75rem', borderRadius: '0.75rem', color: '#64748B', border: '1px solid #E2E8F0' }}>
            <Layers className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem' }} />
          </div>
        </div>

      </div>

      {/* INVENTORY TABLE CARD CONTAINER */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/30" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Data Produk & Buku Mutasi Logistik</h3>
        </div>

        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>Data Produk</th>
                <th style={{ padding: '1rem' }}>Kode Batch</th>
                <th style={{ padding: '1rem' }}>Barang Masuk</th>
                <th style={{ padding: '1rem' }}>Barang Keluar</th>
                <th style={{ padding: '1rem' }}>Sisa Stok</th>
                <th style={{ padding: '1rem' }}>Tanggal Masuk</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', paddingLeft: '1.5rem' }}>Expired Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {dataStokProduk.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3rem', textAlign: 'center', color: '#94A3B8', fontWeight: 500 }}>
                    Belum ada riwayat mutasi logistik terekam. Klik "Tambah Stok / Batch Baru" untuk memulai pencatatan harian.
                  </td>
                </tr>
              ) : (
                dataStokProduk.map((item) => (
                  <tr key={item.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                    <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontWeight: 600, color: '#1E293B' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Box className="w-4 h-4 text-slate-400" style={{ width: '1rem', height: '1rem', color: '#94A3B8' }} />
                        {item.produk}
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: '#64748B', fontFamily: 'monospace', fontSize: '0.75rem' }}>{item.batch}</td>
                    <td style={{ padding: '1rem', color: '#10B981', fontWeight: 500 }}>+{item.barangMasuk}</td>
                    <td style={{ padding: '1rem', color: '#2563EB', fontWeight: 500 }}>-{item.barangKeluar}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: '#1E293B' }}>{item.stok}</td>
                    <td style={{ padding: '1rem', color: '#64748B' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', fontSize: '0.75rem' }}>
                        <Calendar className="w-3.5 h-3.5 text-slate-400" style={{ width: '0.875rem', height: '0.875rem' }} /> {item.tglMasuk}
                      </span>
                    </td>
                    <td style={{ padding: '1rem', paddingRight: '1.5rem', paddingLeft: '1.5rem' }}>
                      <span 
                        style={{ 
                          padding: '0.25rem 0.5rem', 
                          borderRadius: '0.25rem', 
                          fontSize: '0.75rem', 
                          fontWeight: 700,
                          backgroundColor: item.status === 'Kritis' ? '#FEE2E2' : '#F1F5F9',
                          color: item.status === 'Kritis' ? '#EF4444' : '#475569',
                          border: item.status === 'Kritis' ? '1px solid #FEE2E2' : 'none'
                        }}
                        className={item.status === 'Kritis' ? 'animate-pulse' : ''}
                      >
                        {item.expired} {item.status === 'Kritis' && '(Hampir Expired!)'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* POP-UP INTERAKTIF: FORM TAMBAH BATCH/MUTASI STOK BARU */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', maxWidth: '30rem', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Modal Header */}
            <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB' }}>
                <ShoppingBag style={{ width: '1.15rem', height: '1.15rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Form Input Mutasi & Batch Baru</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <X style={{ width: '1.15rem', height: '1.15rem' }} />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleTambahInventaris} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Pilih Nama Komoditas</label>
                <select 
                  value={formProduk} onChange={(e) => setFormProduk(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Beras Mentik Wangi">Beras Mentik Wangi</option>
                  <option value="Gula Aren Cair Lokal">Gula Aren Cair Lokal</option>
                  <option value="Madu Hutan Klanceng">Madu Hutan Klanceng</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Kode Batch Produksi</label>
                  <input 
                    type="text" required value={formBatch} onChange={(e) => setFormBatch(e.target.value)}
                    placeholder="Contoh: BTW-003-C" 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Satuan</label>
                  <select 
                    value={formSatuan} onChange={(e) => setFormSatuan(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                  >
                    <option value="Kg">Kg</option>
                    <option value="Botol">Botol</option>
                    <option value="Pcs">Pcs</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Jumlah Barang Masuk</label>
                  <input 
                    type="number" required min="1" value={formMasuk} onChange={(e) => setFormMasuk(e.target.value)}
                    placeholder="0" 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Jumlah Barang Keluar</label>
                  <input 
                    type="number" required min="0" value={formKeluar} onChange={(e) => setFormKeluar(e.target.value)}
                    placeholder="0" 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Tanggal Masuk Gudang</label>
                  <input 
                    type="date" required value={formTglMasuk} onChange={(e) => setFormTglMasuk(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Tanggal Kedaluwarsa</label>
                  <input 
                    type="date" required value={formExpired} onChange={(e) => setFormExpired(e.target.value)}
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* MODAL FOOTER ACTIONS */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.5rem 1.25rem', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)', display: 'flex', alignItems: 'center', gap: '0.375rem' }}
                >
                  <Save style={{ width: '0.95rem', height: '0.95rem' }} /> Catat ke Buku Mutasi
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}