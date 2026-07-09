'use client';

import React, { useState } from 'react';
import "../globals.css"; 
import { 
  LayoutDashboard, ShoppingBag, Box, RefreshCw, Trash2, 
  ShoppingCart, Truck, Users, FileText, Search, LogOut 
} from 'lucide-react';

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
import KelolaProdukView from './components/KelolaProdukView';
import Link from "next/link";

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
        { name: "Data Produk", icon: Box },
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
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B] font-sans" style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8FAFC' }}>
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen" style={{ width: '18rem', flexShrink: 0, backgroundColor: '#ffffff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div className="p-6 border-b border-slate-200" style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>R</div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[#1E293B]" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>PasarNusa</h1>
              <p className="text-xs text-slate-500 font-medium" style={{ fontSize: '0.75rem', color: '#64748B', margin: 0 }}>Admin Toko / UMKM</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-6" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
          {menuStructure.map((cat, idx) => (
            <div key={idx} style={{ marginBottom: '1.5rem' }}>
              <span className="text-[11px] font-bold tracking-wider text-slate-400 uppercase px-3 block mb-2" style={{ fontSize: '11px', fontWeight: 700, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '0.5rem', padding: '0 0.75rem' }}>
                {cat.category}
              </span>
              <div className="space-y-1" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                {cat.items.map((item, itemIdx) => {
                  const Icon = item.icon;
                  const isActive = activeMenu === item.name;
                  return (
                    <button
                      key={itemIdx}
                      onClick={() => setActiveMenu(item.name)}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.625rem 0.75rem',
                        borderRadius: '0.75rem',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        fontWeight: 500,
                        textAlign: 'left',
                        backgroundColor: isActive ? '#2563EB' : 'transparent',
                        color: isActive ? '#ffffff' : '#475569',
                      }}
                    >
                      <Icon className="w-5 h-5" style={{ width: '1.25rem', height: '1.25rem', color: isActive ? '#ffffff' : '#94A3B8' }} />
                      {item.name}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
{/* AREA NAVIGATION BAWAH - Diturunkan ke bawah agar pas dengan logo N */}
        <div style={{ padding: '1rem', paddingBottom: '1.25rem', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
          <Link
            href="/login"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              backgroundColor: '#ffffff',     // Latar belakang putih bersih
              border: '1px solid #FEE2E2',    // Border merah tipis lembut sesuai gambar
              padding: '0.75rem 0',
              color: '#EF4444',               // Warna teks merah tegas
              fontSize: '0.875rem',
              fontWeight: 500,
              textDecoration: 'none',
              cursor: 'pointer',
              boxSizing: 'border-box'
            }}
          >
            Keluar
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10" style={{ height: '5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', padding: '0 2rem' }}>
          <h2 className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{activeMenu}</h2>
        </header>

        <main className="p-8 flex-1 overflow-y-auto" style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'block' }}>
          {activeMenu === 'Dashboard' && <DashboardView />}
          {activeMenu === 'Cari Mitra' && <CariMitraView />}
          {activeMenu === 'Bandingkan & Beli' && <BandingkanBeliView />}
          {activeMenu === 'Data Produk' && <KelolaProdukView />}
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