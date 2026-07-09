'use client';

import React, { useState } from 'react';
import { Plus, Image, Trash2, X, ShoppingBag } from 'lucide-react';

interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  deskripsi: string;
}

export default function KelolaProdukView() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([
    {
      id: 1,
      nama: "Beras Mentik Wangi Premium",
      harga: 14500,
      stok: 350,
      kategori: "Pertanian / Hasil Bumi",
      deskripsi: "Beras organik hasil panen Kelompok Tani Lestari kualitas super."
    },
    {
      id: 2,
      nama: "Madu Hutan Klanceng Pure",
      harga: 85000,
      stok: 14,
      kategori: "Kuliner / Cemilan",
      deskripsi: "Madu murni asli dari budidaya lebah hutan desa."
    }
  ]);

  // State Form
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [kategori, setKategori] = useState('Pertanian / Hasil Bumi');
  const [deskripsi, setDeskripsi] = useState('');

  const handleTambahProduk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !harga || !stok) return;

    const produkBaru: Produk = {
      id: Date.now(),
      nama,
      harga: Number(harga),
      stok: Number(stok),
      kategori,
      deskripsi
    };

    setDaftarProduk([produkBaru, ...daftarProduk]);
    
    // Reset & Close Modal
    setNama('');
    setHarga('');
    setStok('');
    setDeskripsi('');
    setIsModalOpen(false);
  };

  const handleHapusProduk = (id: number) => {
    setDaftarProduk(daftarProduk.filter(p => p.id !== id));
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* HEADER ACTIONS BAR */}
      <div 
        className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
        style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '1rem', border: '1px solid #E2E8F0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <h3 className="font-bold text-lg text-[#1E293B]" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Live Katalog Toko ({daftarProduk.length} Produk)</h3>
          <p className="text-xs text-slate-400 mt-0.5" style={{ fontSize: '0.75rem', color: '#64748B', margin: 0, marginTop: '0.25rem' }}>Produk aktif yang terdaftar dan disinkronisasikan langsung ke halaman pembeli.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-100 shrink-0"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} /> Tambah Produk Baru
        </button>
      </div>

      {/* KATALOG GRID (FULL WIDTH & LEGA) - Dikunci pakai CSS Grid murni */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', width: '100%' }}>
        {daftarProduk.map((produk) => (
          <div 
            key={produk.id} 
            className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-300 relative" style={{ height: '10rem', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <Image className="w-12 h-12" style={{ width: '3rem', height: '3rem', color: '#CBD5E1' }} />
              <span 
                className="absolute text-white text-[10px] font-bold"
                style={{ position: 'absolute', top: '0.75rem', left: '0.75rem', backgroundColor: '#2563EB', padding: '0.25rem 0.625rem', borderRadius: '0.5rem', fontSize: '10px', fontWeight: 700 }}
              >
                {produk.kategori}
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between" style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <h4 className="font-bold text-base text-[#1E293B] truncate" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{produk.nama}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', margin: 0, minHeight: '2rem' }}>{produk.deskripsi || 'Tidak ada deskripsi produk.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center" style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>Harga Jual</p>
                  <p className="text-base font-extrabold text-[#10B981]" style={{ fontSize: '1rem', fontWeight: 800, color: '#10B981', margin: 0, marginTop: '0.125rem' }}>Rp {produk.harga.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right" style={{ textAlign: 'right' }}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: '10px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>Stok Toko</p>
                  <p className="text-sm font-bold text-[#1E293B]" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.125rem' }}>{produk.stok} pcs</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100/60 flex justify-between items-center" style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '11px', color: '#10B981', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '0.125rem 0.5rem', borderRadius: '0.25rem', border: '1px solid #D1FAE5' }}>Live Terhubung</span>
                <button onClick={() => handleHapusProduk(produk.id)} className="text-slate-400 hover:text-[#EF4444] transition-colors p-1.5 rounded-xl hover:bg-red-50" style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '0.375rem', borderRadius: '0.5rem' }}>
                  <Trash2 className="w-4 h-4" style={{ width: '1rem', height: '1rem', color: '#94A3B8' }} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* POP-UP MODAL BACKGROUND OVERLAY */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          
          {/* CONTAINER MODAL BOX */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', maxWidth: '32rem', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            {/* MODAL HEADER */}
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB' }}>
                <ShoppingBag style={{ width: '1.25rem', height: '1.25rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Form Tambah Produk</h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleTambahProduk} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Foto Sampul Komoditas</label>
                <div style={{ border: '2px dashed #E2E8F0', borderRadius: '0.75rem', padding: '1rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#94A3B8' }}>
                  <Image style={{ width: '1.75rem', height: '1.75rem', color: '#CBD5E1', marginBottom: '0.25rem' }} />
                  <span style={{ fontSize: '0.75rem', fontWeight: 500 }}>Klik untuk unggah foto</span>
                  <span style={{ fontSize: '10px', color: '#94A3B8' }}>Maksimal resolusi file 2MB</span>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nama Produk Dagangan</label>
                <input 
                  type="text" required value={nama} onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Keripik Singkong Madu Desa" 
                  style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Harga Jual (Rp)</label>
                  <input 
                    type="number" required value={harga} onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 15000" 
                    style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Kuantitas Stok</label>
                  <input 
                    type="number" required value={stok} onChange={(e) => setStok(e.target.value)}
                    placeholder="100" 
                    style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Pilih Kelompok Kategori</label>
                <select 
                  value={kategori} onChange={(e) => setKategori(e.target.value)}
                  style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Pertanian / Hasil Bumi">Pertanian / Hasil Bumi</option>
                  <option value="Peternakan">Peternakan</option>
                  <option value="Kuliner / Cemilan">Kuliner / Cemilan</option>
                  <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Deskripsi & Catatan</label>
                <textarea 
                  rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan spesifikasi produk jualan di sini..." 
                  style={{ width: '100%', padding: '0.625rem 0.875rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {/* MODAL FOOTER BUTTONS */}
              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.625rem 1rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.625rem 1.25rem', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                >
                  Tayangkan Produk (Live)
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}