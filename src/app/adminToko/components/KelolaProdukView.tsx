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
    <div className="space-y-6">
      
      {/* HEADER ACTIONS BAR */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h3 className="font-bold text-lg text-[#1E293B]">Live Katalog Toko ({daftarProduk.length} Produk)</h3>
          <p className="text-xs text-slate-400 mt-0.5">Produk aktif yang terdaftar dan disinkronisasikan langsung ke halaman pembeli.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="bg-[#2563EB] hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 shadow-md shadow-blue-100 shrink-0"
        >
          <Plus className="w-4 h-4" /> Tambah Produk Baru
        </button>
      </div>

      {/* KATALOG GRID (FULL WIDTH & LEGA) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {daftarProduk.map((produk) => (
          <div key={produk.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
            <div className="h-40 bg-slate-100 flex items-center justify-center text-slate-300 relative">
              <Image className="w-12 h-12" />
              <span className="absolute top-3 left-3 bg-[#2563EB] text-white text-[10px] px-2.5 py-1 rounded-lg font-bold">
                {produk.kategori}
              </span>
            </div>
            
            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-bold text-base text-[#1E293B] truncate">{produk.nama}</h4>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[2rem]">{produk.deskripsi || 'Tidak ada deskripsi produk.'}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Harga Jual</p>
                  <p className="text-base font-extrabold text-[#10B981]">Rp {produk.harga.toLocaleString('id-ID')}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Stok Toko</p>
                  <p className="text-sm font-bold text-[#1E293B]">{produk.stok} pcs</p>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-slate-100/60 flex justify-between items-center">
                <span className="text-[11px] text-[#10B981] font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">Live Terhubung</span>
                <button onClick={() => handleHapusProduk(produk.id)} className="text-slate-400 hover:text-[#EF4444] transition-colors p-1.5 rounded-xl hover:bg-red-50">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* POP-UP MODAL BACKGROUND OVERLAY */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
          
          {/* CONTAINER MODAL BOX */}
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-lg w-full overflow-hidden animate-slide-up flex flex-col">
            
            {/* MODAL HEADER */}
            <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-2 text-[#2563EB]">
                <ShoppingBag className="w-5 h-5" />
                <h3 className="font-bold text-base text-[#1E293B]">Form Tambah Produk</h3>
              </div>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-[#1E293B] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL FORM BODY */}
            <form onSubmit={handleTambahProduk} className="p-6 space-y-4 flex-1">
              {/* Upload Foto */}
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Foto Sampul Komoditas</label>
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 flex flex-col items-center justify-center bg-slate-50 hover:bg-slate-100/30 cursor-pointer transition-colors text-slate-400">
                  <Image className="w-7 h-7 mb-1 text-slate-300" />
                  <span className="text-xs font-medium">Klik untuk unggah foto</span>
                  <span className="text-[10px] text-slate-400">Maksimal resolusi file 2MB</span>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Nama Produk Dagangan</label>
                <input 
                  type="text" required value={nama} onChange={(e) => setNama(e.target.value)}
                  placeholder="Contoh: Keripik Singkong Madu Desa" 
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B] bg-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Harga Jual (Rp)</label>
                  <input 
                    type="number" required value={harga} onChange={(e) => setHarga(e.target.value)}
                    placeholder="Contoh: 15000" 
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B] bg-white"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Kuantitas Stok</label>
                  <input 
                    type="number" required value={stok} onChange={(e) => setStok(e.target.value)}
                    placeholder="100" 
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B] bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Pilih Kelompok Kategori</label>
                <select 
                  value={kategori} onChange={(e) => setKategori(e.target.value)}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] bg-white text-[#1E293B]"
                >
                  <option value="Pertanian / Hasil Bumi">Pertanian / Hasil Bumi</option>
                  <option value="Peternakan">Peternakan</option>
                  <option value="Kuliner / Cemilan">Kuliner / Cemilan</option>
                  <option value="Kerajinan Tangan">Kerajinan Tangan</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-500 uppercase block mb-1">Deskripsi & Catatan</label>
                <textarea 
                  rows={3} value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)}
                  placeholder="Tuliskan spesifikasi produk jualan di sini..." 
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-[#2563EB] text-[#1E293B] bg-white"
                />
              </div>

              {/* MODAL FOOTER BUTTONS */}
              <div className="flex gap-3 pt-3 border-t border-slate-100 justify-end">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-sm font-semibold transition-colors"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  className="px-5 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white rounded-xl text-sm font-semibold transition-colors shadow-md shadow-blue-100"
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