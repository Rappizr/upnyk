import React, { useState } from 'react';
import { Plus, Image, Trash2, Tag, DollarSign, Package, FileText } from 'lucide-react';

interface Produk {
  id: number;
  nama: string;
  harga: number;
  stok: number;
  kategori: string;
  deskripsi: string;
}

export default function KelolaProdukView() {
  const [daftarProduk, setDaftarProduk] = useState<Produk[]>([
    {
      id: 1,
      nama: "Beras Mentik Wangi Premium",
      harga: 14500,
      stok: 350,
      kategori: "Pertanian",
      deskripsi: "Beras organik hasil panen Kelompok Tani Lestari kualitas super."
    },
    {
      id: 2,
      nama: "Madu Hutan Klanceng Pure",
      harga: 85000,
      stok: 14,
      kategori: "Kuliner / Suplemen",
      deskripsi: "Madu murni asli dari budidaya lebah hutan desa."
    }
  ]);

  // State Form
  const [nama, setNama] = useState('');
  const [harga, setHarga] = useState('');
  const [stok, setStok] = useState('');
  const [kategori, setKategori] = useState('Pertanian');
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
    
    // Reset Form
    setNama('');
    setHarga('');
    setStok('');
    setDeskripsi('');
  };

  const handleHapusProduk = (id: number) => {
    setDaftarProduk(daftarProduk.filter(p => p.id !== id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* FORM INPUT PRODUK (KIRI) */}
      <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
        <h3 className="font-bold text-base text-[#1E293B] mb-4 flex items-center gap-2">
          <Plus className="w-5 h-5 text-[#2563EB]" /> Tambah Produk Jualan
        </h3>
        
        <form onSubmit={handleTambahProduk} className="space-y-4">
          {/* Upload Foto Mock */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Foto Produk</label>
            <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/50 cursor-pointer transition-colors text-slate-400">
              <Image className="w-8 h-8 mb-1 text-slate-300" />
              <span className="text-xs font-medium">Upload Foto Produk</span>
              <span className="text-[10px] text-slate-400 mt-0.5">Format JPG, PNG (Maks. 2MB)</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Produk</label>
            <input 
              type="text" value={nama} onChange={(e) => setNama(e.target.value)}
              placeholder="Contoh: Keripik Singkong Balado" 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Harga (Rp)</label>
              <input 
                type="number" value={harga} onChange={(e) => setHarga(e.target.value)}
                placeholder="15000" 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
              />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Stok Awal</label>
              <input 
                type="number" value={stok} onChange={(e) => setStok(e.target.value)}
                placeholder="100" 
                className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kategori</label>
            <select 
              value={kategori} onChange={(e) => setKategori(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] bg-white text-[#1E293B]"
            >
              <option value="Pertanian">Pertanian / Hasil Bumi</option>
              <option value="Peternakan">Peternakan</option>
              <option value="Kuliner / Suplemen">Kuliner / Cemilan</option>
              <option value="Kerajinan">Kerajinan Tangan</option>
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deskripsi Produk</label>
            <textarea 
              rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
              placeholder="Jelaskan detail keunggulan produk Anda..." 
              className="w-full px-3 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B]"
            />
          </div>

          <button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl text-sm shadow-sm transition-colors mt-2">
            Tayangkan Produk (Live)
          </button>
        </form>
      </div>

      {/* DAFTAR LIVE KATALOG TOKO (KANAN) */}
      <div className="lg:col-span-2 space-y-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex justify-between items-center">
          <h3 className="font-bold text-sm text-[#1E293B]">Live Katalog Toko ({daftarProduk.length} Produk)</h3>
          <span className="text-xs bg-emerald-50 text-[#10B981] px-2.5 py-1 rounded-lg font-bold border border-emerald-100">
            Sinkron ke Pembeli
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {daftarProduk.map((produk) => (
            <div key={produk.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
              {/* Gambar Mock Banner */}
              <div className="h-36 bg-slate-100 flex items-center justify-center text-slate-300 relative">
                <Image className="w-12 h-12" />
                <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] px-2 py-0.5 rounded-md font-bold">
                  {produk.kategori}
                </span>
              </div>
              
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="font-bold text-base text-[#1E293B] truncate">{produk.nama}</h4>
                  <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">{produk.deskripsi}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Pasar</p>
                    <p className="text-base font-extrabold text-[#10B981]">Rp {produk.harga.toLocaleString('id-ID')}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stok</p>
                    <p className="text-sm font-bold text-[#1E293B]">{produk.stok} pcs</p>
                  </div>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-100/60 flex justify-end">
                  <button onClick={() => handleHapusProduk(produk.id)} className="text-slate-400 hover:text-[#EF4444] transition-colors p-1 rounded-lg hover:bg-red-50">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}