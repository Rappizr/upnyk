'use client';

import React, { useState } from 'react';
import { Search, MapPin, Star, Phone, ArrowRight, Leaf, ShieldAlert, Hammer } from 'lucide-react';

export default function CariMitraPage() {
  const [filterKategori, setFilterKategori] = useState('Semua');

  const daftarMitra = [
    {
      id: 1,
      nama: "Kelompok Tani Lestari",
      kategori: "Petani",
      komoditas: "Beras Mentik Wangi, Gabah Kering",
      jarak: "0.4 Km",
      rating: 4.9,
      icon: Leaf,
      status: "Verified Terdekat"
    },
    {
      id: 2,
      nama: "Peternakan Berkah Mulia",
      kategori: "Peternak",
      komoditas: "Telur Ayam Kampung, Susu Sapi Segar",
      jarak: "2.1 Km",
      rating: 4.8,
      icon: ShieldAlert, // Pengganti representasi livestock/alert
      status: "Suplier Favorit"
    },
    {
      id: 3,
      nama: "Pengrajin Anyaman Bambu Desa",
      kategori: "Pengrajin",
      komoditas: "Besek Bambu, Keranjang Logistik",
      jarak: "1.5 Km",
      rating: 4.7,
      icon: Hammer,
      status: "Mitra Lokal"
    }
  ];

  const mitraTersaring = filterKategori === 'Semua' 
    ? daftarMitra 
    : daftarMitra.filter(m => m.kategori === filterKategori);

  return (
    <div className="space-y-6">
      {/* Top Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">Hubungkan rantai pasok UMKM Anda langsung dengan produsen utama pedesaan.</p>
        </div>
        
        {/* Search Bar */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
          <input 
            type="text" 
            placeholder="Cari petani atau komoditas..." 
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#2563EB] bg-white text-[#1E293B]"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 border-b border-slate-200 pb-px">
        {['Semua', 'Petani', 'Peternak', 'Pengrajin'].map((kat) => (
          <button
            key={kat}
            onClick={() => setFilterKategori(kat)}
            className={`px-4 py-2.5 font-semibold text-sm transition-all relative ${
              filterKategori === kat 
                ? 'text-[#2563EB] border-b-2 border-b-[#2563EB]' 
                : 'text-slate-500 hover:text-[#1E293B]'
            }`}
          >
            {kat}
          </button>
        ))}
      </div>

      {/* Directory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {mitraTersaring.map((mitra) => {
          const ItemIcon = mitra.icon;
          return (
            <div key={mitra.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 flex flex-col justify-between hover:border-slate-300 transition-all">
              <div>
                <div className="flex justify-between items-start mb-4">
                  <div className="p-3 bg-blue-50 text-[#2563EB] rounded-xl">
                    <ItemIcon className="w-6 h-6" />
                  </div>
                  <span className="text-xs bg-emerald-50 text-[#10B981] px-2.5 py-1 rounded-lg font-semibold border border-emerald-100">
                    {mitra.status}
                  </span>
                </div>

                <h3 className="font-bold text-base text-[#1E293B]">{mitra.nama}</h3>
                <p className="text-xs text-slate-400 font-medium mt-0.5">{mitra.kategori} Komoditas Utama</p>
                
                <p className="text-sm text-slate-600 mt-3 font-medium bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {mitra.komoditas}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 space-y-3">
                <div className="flex justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> Jarak: <strong>{mitra.jarak}</strong></span>
                  <span className="flex items-center gap-1 text-amber-500"><Star className="w-3.5 h-3.5 fill-current" /> <strong>{mitra.rating}</strong></span>
                </div>
                
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button className="flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-xs font-semibold py-2 rounded-xl text-slate-600 transition-colors">
                    <Phone className="w-3.5 h-3.5" /> Hubungi
                  </button>
                  <button className="flex items-center justify-center gap-1 bg-[#2563EB] hover:bg-blue-700 text-xs font-semibold py-2 rounded-xl text-white transition-colors">
                    Lihat Produk <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}