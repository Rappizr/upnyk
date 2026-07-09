'use client';

import React, { useState } from 'react';
import { 
  LayoutDashboard, ShoppingBag, Box, RefreshCw, Trash2, 
  ShoppingCart, Truck, Users, FileText, Search, Bell, AlertTriangle 
} from 'lucide-react';

// IMPORT SEMUA KOMPONEN VIEW DARI FOLDER COMPONENTS
import DashboardView from './components/DashboardView';
import CariMitraView from './components/CariMitraView';
import BandingkanBeliView from './components/BandingkanBeliView';
import InventarisView from './components/InventarisView';
import SmartRestockView from './components/SmartRestockView';
import AnalisisLimbahView from './components/AnalisisLimbahView';
import PenjualanView from './components/PenjualanView';
import SupplierView from './components/SupplierView';
import KolaborasiUMKMView from './components/KolaborasiUMKMView';
import LaporanView from './components/LaporanView';
import KelolaProdukView from './components/KelolaProdukView'; // <-- Pastikan ini terimport

export default function AdminTokoMasterPage() {
  const [activeMenu, setActiveMenu] = useState('Dashboard');

  const menuStructure = [
    {
      category: "Main",
      items: [{ name: "Dashboard", icon: LayoutDashboard }]
    },
    {
      category: "Marketplace Bahan Baku",
      items: [
        { name: "Cari Mitra", icon: Search },
        { name: "Bandingkan & Beli", icon: ShoppingCart }
      ]
    },
    {
      category: "Manajemen Stok",
      items: [
        { name: "Data Produk", icon: Box }, // <-- Menunya di sini
        { name: "Inventaris", icon: Box },
        { name: "Smart Restock", icon: RefreshCw },
        { name: "Analisis Limbah", icon: Trash2 }
      ]
    },
    {
      category: "Operasional",
      items: [
        { name: "Penjualan & Invoice", icon: ShoppingBag },
        { name: "Supplier & Mitra", icon: Truck },
        { name: "Kolaborasi UMKM", icon: Users },
        { name: "Laporan", icon: FileText }
      ]
    }
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen">
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold">R</div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[#1E293B]">Rural Commerce</h1>
              <p className="text-xs text-slate-500 font-medium">Admin Toko / UMKM</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuStructure.map((cat, idx) => (
            <div key={idx}>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 block mb-2">
                {cat.category}
              </span>
              <div className="space-y-1">
                {cat.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.name;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => setActiveMenu(item.name)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive 
                          ? 'bg-[#2563EB] text-white shadow-md shadow-blue-100' 
                          : 'text-slate-600 hover:bg-slate-50 hover:text-[#1E293B]'
                      }`}
                    >
                      <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h2 className="text-xl font-bold text-[#1E293B]">{activeMenu}</h2>
        </header>

        {/* AREA RENDER DINAMIS */}
        <main className="p-8 flex-1 overflow-y-auto">
          {activeMenu === 'Dashboard' && <DashboardView />}
          {activeMenu === 'Cari Mitra' && <CariMitraView />}
          {activeMenu === 'Bandingkan & Beli' && <BandingkanBeliView />}
          {activeMenu === 'Data Produk' && <KelolaProdukView />} {/* <-- Ini yang akan memunculkan form input jualan Anda */}
          {activeMenu === 'Inventaris' && <InventarisView />}
          {activeMenu === 'Smart Restock' && <SmartRestockView />}
          {activeMenu === 'Analisis Limbah' && <AnalisisLimbahView />}
          {activeMenu === 'Penjualan & Invoice' && <PenjualanView />}
          {activeMenu === 'Supplier & Mitra' && <SupplierView />}
          {activeMenu === 'Kolaborasi UMKM' && <KolaborasiUMKMView />}
          {activeMenu === 'Laporan' && <LaporanView />}
        </main>
      </div>

    </div>
  );
}