'use client';

import React, { useState, useRef } from 'react';
import { Plus, Image, Trash2, Edit3, X, ShoppingBag, Camera } from 'lucide-react';
import { create } from 'zustand';

// =========================================================================
// 1. STRUKTUR STORE ZUSTAND GLOBAL (LOGIKA UTAMA MANAJEMEN KATALOG)
// =========================================================================
interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  deskripsi: string;
  images: string[];
  rating: number;
  totalReview: number;
}

interface KatalogState {
  daftarProduk: Produk[];
  tambahProduk: (produk: Produk) => void;
  editProduk: (id: number, updatedProduk: Omit<Produk, 'id'>) => void;
  hapusProduk: (id: number) => void;
}

const useKatalogStore = create<KatalogState>((set) => ({
  daftarProduk: [],

  tambahProduk: (produk) => 
    set((state) => ({ daftarProduk: [produk, ...state.daftarProduk] })),

  editProduk: (id, updatedProduk) =>
    set((state) => ({
      daftarProduk: state.daftarProduk.map((p) => p.id === id ? { ...p, ...updatedProduk } : p)
    })),

  hapusProduk: (id) =>
    set((state) => ({
      daftarProduk: state.daftarProduk.filter((p) => p.id !== id)
    })),
}));

// =========================================================================
// 2. KOMPONEN UI UTAMA
// =========================================================================
export default function KelolaProdukView() {
  const { daftarProduk, tambahProduk, editProduk, hapusProduk } = useKatalogStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'tambah' | 'edit'>('tambah');
  const [editingId, setEditingId] = useState<number | null>(null);

  // State Form Dinamis
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [kategori, setKategori] = useState('Pertanian / Hasil Bumi');
  const [deskripsi, setDeskripsi] = useState('');
  const [formImages, setFormImages] = useState<string[]>(["", "", "", "", ""]);

  // Refs pemicu klik input file tersembunyi
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const openTambahModal = () => {
    setModalMode('tambah');
    setEditingId(null);
    setNama('');
    setHarga('');
    setStok('');
    setKategori('Pertanian / Hasil Bumi');
    setDeskripsi('');
    setFormImages(["", "", "", "", ""]); 
    setIsModalOpen(true);
  };

  const openEditModal = (produk: Produk) => {
    setModalMode('edit');
    setEditingId(produk.id);
    setNama(produk.nama);
    setHarga(produk.harga.toString());
    setStok(produk.stok.toString());
    setKategori(produk.kategori);
    setDeskripsi(produk.deskripsi);
    setFormImages(produk.images || ["", "", "", "", ""]);
    setIsModalOpen(true);
  };

  // Fungsi mengonversi berkas gambar asli ke string base64 untuk disimpan ke Zustand
  const handleImageUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      const newImages = [...formImages];
      newImages[index] = base64String;
      setFormImages(newImages);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProduk = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama || !harga || !stok) return;

    const dataPayload = {
      nama,
      harga: Number(harga),
      stok: Number(stok),
      kategori,
      deskripsi,
      images: formImages,
      rating: 0,
      totalReview: 0,
    };

    if (modalMode === 'tambah') {
      tambahProduk({
        id: Date.now(),
        ...dataPayload
      });
    } else if (modalMode === 'edit' && editingId !== null) {
      editProduk(editingId, dataPayload);
    }

    setIsModalOpen(false);
  };

  const handleHapusAction = (id: number, namaProduk: string) => {
    if(confirm(`Apakah Anda yakin ingin menghapus "${namaProduk}" dari katalog live?`)) {
      hapusProduk(id);
    }
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
          onClick={openTambahModal}
          className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold transition-all shadow-md shadow-blue-100 shrink-0"
          style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.625rem 1.25rem', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus className="w-4 h-4" style={{ width: '1rem', height: '1rem' }} /> Tambah Produk Baru
        </button>
      </div>

      {/* KATALOG GRID */}
      <div
  style={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '1.25rem',
    width: '100%'
  }}
>
        {daftarProduk.length === 0 ? (
          <div style={{ gridColumn: '1 / -1', padding: '4rem 2rem', textAlign: 'center', color: '#94A3B8', backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', fontWeight: 500 }}>
            Belum ada produk jualan aktif terdaftar. Klik tombol "Tambah Produk Baru" di atas untuk menayangkan komoditas Anda.
          </div>
        ) : (
          daftarProduk.map((produk) => (
            <div 
              key={produk.id} 
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
            >
              {/* Box Tampilan Foto Utama */}
              <div style={{ height: '9rem', backgroundColor: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                {produk.images[0] ? (
                  <img 
                    src={produk.images[0]} 
                    alt={produk.nama} 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <Image className="w-10 h-10" style={{ width: '2.5rem', height: '2.5rem', color: '#CBD5E1' }} />
                )}
                <span 
                  className="absolute text-white text-[10px] font-bold"
                  style={{ position: 'absolute', top: '0.625rem', left: '0.625rem', backgroundColor: '#2563EB', padding: '0.2rem 0.5rem', borderRadius: '0.375rem', fontSize: '10px', fontWeight: 700, zIndex: 2 }}
                >
                  {produk.kategori.split(' / ')[0]}
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between" style={{ padding: '1rem', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <h4 className="font-bold text-sm text-[#1E293B] truncate" style={{ fontSize: '0.875rem', fontWeight: 700, color: '#1E293B', margin: 0 }} title={produk.nama}>{produk.nama}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]" style={{ fontSize: '0.75rem', color: '#64748B', marginTop: '0.25rem', margin: 0, minHeight: '2rem', lineHeight: '1.4' }}>{produk.deskripsi || 'Tidak ada deskripsi produk.'}</p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100 flex justify-between items-center" style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>Harga Jual</p>
                    <p className="text-sm font-extrabold text-[#10B981]" style={{ fontSize: '0.875rem', fontWeight: 800, color: '#10B981', margin: 0, marginTop: '0.125rem' }}>Rp {produk.harga.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right" style={{ textAlign: 'right' }}>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider" style={{ fontSize: '9px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', margin: 0 }}>Stok Toko</p>
                    <p className="text-xs font-bold text-[#1E293B]" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1E293B', margin: 0, marginTop: '0.125rem' }}>{produk.stok} pcs</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/60 flex justify-between items-center" style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '10px', color: '#10B981', fontWeight: 600, backgroundColor: '#ECFDF5', padding: '0.125rem 0.375rem', borderRadius: '0.25rem', border: '1px solid #D1FAE5' }}>Live Terhubung</span>
                  <div style={{ display: 'flex', gap: '0.25rem' }}>
                    <button onClick={() => openEditModal(produk)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.375rem' }}>
                      <Edit3 className="w-4 h-4" style={{ width: '0.95rem', height: '0.95rem', color: '#64748B' }} />
                    </button>
                    <button onClick={() => handleHapusAction(produk.id, produk.nama)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', padding: '0.25rem', borderRadius: '0.375rem' }}>
                      <Trash2 className="w-4 h-4" style={{ width: '0.95rem', height: '0.95rem', color: '#94A3B8' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* POP-UP MODAL BOX INTERAKTIF */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '1rem' }}>
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', maxWidth: '32rem', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
            
            {/* Header Modal */}
            <div style={{ padding: '1.125rem 1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB' }}>
                <ShoppingBag style={{ width: '1.15rem', height: '1.15rem' }} />
                <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>
                  {modalMode === 'tambah' ? 'Form Tambah Produk Baru' : 'Form Ubah Informasi Produk'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <X style={{ width: '1.15rem', height: '1.15rem' }} />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveProduk} style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              
              {/* GALERI FOTO GRID INTERAKTIF */}
              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.375rem' }}>Foto Sampul Komoditas (Maksimal 5)</label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  
                  {/* Slot 1: Foto Utama (Besar) */}
                  <input 
                    type="file" accept="image/*" ref={el => { fileInputRefs.current[0] = el; }}
                    style={{ display: 'none' }} onChange={(e) => handleImageUpload(0, e)} 
                  />
                  <div 
                    onClick={() => fileInputRefs.current[0]?.click()}
                    style={{ height: '9rem', border: '1.5px dashed #CBD5E1', borderRadius: '0.75rem', overflow: 'hidden', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#94A3B8', cursor: 'pointer' }}
                  >
                    {formImages[0] ? (
                      <img src={formImages[0]} alt="Utama" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <>
                        <Camera style={{ width: '1.75rem', height: '1.75rem', color: '#94A3B8', marginBottom: '0.25rem' }} />
                        <span style={{ fontSize: '0.75rem', color: '#64748B', fontWeight: 600 }}>Klik untuk unggah foto utama</span>
                      </>
                    )}
                  </div>

                  {/* Slot 2-5: Sub-Foto Sejajar */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                    {[1, 2, 3, 4].map((idx) => (
                      <div key={idx}>
                        <input 
                          type="file" accept="image/*" ref={el => { fileInputRefs.current[idx] = el; }}
                          style={{ display: 'none' }} onChange={(e) => handleImageUpload(idx, e)} 
                        />
                        <div 
                          onClick={() => fileInputRefs.current[idx]?.click()}
                          style={{ height: '3.5rem', border: '1.5px dashed #E2E8F0', borderRadius: '0.5rem', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F8FAFC', color: '#CBD5E1', cursor: 'pointer' }}
                        >
                          {formImages[idx] ? (
                            <img src={formImages[idx]} alt={`Sub ${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <Plus style={{ width: '1rem', height: '1rem', color: '#94A3B8' }} />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nama Produk Dagangan</label>
                <input 
                  type="text" required value={nama} onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Keripik Singkong Madu Desa" 
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem' }}>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Harga Jual (Rp)</label>
                  <input 
  type="text"
  required
  value={harga}
  onChange={(e) => {
    const angka = e.target.value.replace(/\D/g, "");
    setHarga(
      angka.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
    );
  }}
  placeholder="Contoh: 15.000"
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Kuantitas Stok</label>
                  <input 
                    type="number" required value={stok} onChange={(e) => setStok(e.target.value)}
                    placeholder="100" 
                    style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Pilih Kelompok Kategori</label>
                <select 
                  value={kategori} onChange={(e) => setKategori(e.target.value)}
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', backgroundColor: '#ffffff', boxSizing: 'border-box' }}
                >
                  <option value="Pertanian / Hasil Bumi">Pertanian / Hasil Bumi</option>
                  <option value="Peternakan">Peternakan</option>
                  <option value="Kuliner / Cemilan">Kuliner / Cemilan</option>
                  <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                </select>
              </div>

<div
  style={{
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "12px 16px",
    border: "1px solid #E2E8F0",
    borderRadius: "12px",
    background: "#F8FAFC"
  }}
>
    <div style={{display:"flex",alignItems:"center",gap:"8px"}}>
        <span style={{fontSize:"22px"}}>⭐</span>

        <div>
            <div style={{fontWeight:700}}>0.0</div>
            <div
                style={{
                    fontSize:"12px",
                    color:"#64748B"
                }}
            >
                Belum ada ulasan
            </div>
        </div>
    </div>

    <span
        style={{
            background:"#EFF6FF",
            color:"#2563EB",
            padding:"4px 10px",
            borderRadius:"999px",
            fontSize:"12px",
            fontWeight:600
        }}
    >
        Otomatis dari pembeli
    </span>
</div>

              <div>
                <label style={{ fontSize: '10px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Deskripsi & Catatan</label>
                <textarea 
                  rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan spesifikasi produk jualan di sini..." 
                  style={{ width: '100%', padding: '0.55rem 0.75rem', border: '1px solid #E2E8F0', borderRadius: '0.625rem', fontSize: '0.85rem', color: '#1E293B', boxSizing: 'border-box', resize: 'vertical' }}
                />
              </div>

              {/* ACTION BUTTONS */}
              <div style={{ display: 'flex', gap: '0.5rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', justifyContent: 'flex-end' }}>
                <button 
                  type="button" onClick={() => setIsModalOpen(false)}
                  style={{ padding: '0.5rem 1rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.5rem 1.25rem', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', borderRadius: '0.625rem', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                >
                  {modalMode === 'tambah' ? 'Tayangkan Produk (Live)' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}