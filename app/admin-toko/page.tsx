'use client';

import React, { useState } from 'react';
import "../globals.css"; 
import { 
  LayoutDashboard, ShoppingBag, Box, RefreshCw, Trash2, 
  ShoppingCart, Truck, Users, FileText, Search, Bell, User, Settings, Store, X, Shield, Mail, Camera, Eye, EyeOff
} from 'lucide-react';
import { create } from 'zustand';

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

interface AdminProfileData {
  adminName: string;
  adminEmail: string;
  namaToko: string;
  password: string;
}

interface AdminMasterState extends AdminProfileData {
  activeMenu: string;
  setActiveMenu: (menu: string) => void;
  updateProfile: (data: Partial<AdminProfileData>) => void;
}

const useAdminMasterStore = create<AdminMasterState>((set) => ({

  activeMenu: 'Dashboard',
  
  adminName: 'Arif Kurniawan',
  adminEmail: 'arif.pasarNusa@gmail.com',
  namaToko: 'PasarNusa',
  password: 'p@ssword123',

  setActiveMenu: (menu) => set({ activeMenu: menu }),
  updateProfile: (data) => set((state) => ({ ...state, ...data }))
}));

export default function AdminTokoMasterPage() {
  const { 
    activeMenu, setActiveMenu, 
    adminName, adminEmail, namaToko, password, 
    updateProfile 
  } = useAdminMasterStore();
  
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formAdminName, setFormAdminName] = useState('');
  const [formAdminEmail, setFormAdminEmail] = useState('');
  const [formNamaToko, setFormNamaToko] = useState('');
  const [formPassword, setFormPassword] = useState('');

  const openConfigModal = () => {
    setFormAdminName(adminName);
    setFormAdminEmail(adminEmail);
    setFormNamaToko(namaToko);
    setFormPassword(password);
    setShowPassword(false); 
    setIsConfigModalOpen(true);
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      adminName: formAdminName,
      adminEmail: formAdminEmail,
      namaToko: formNamaToko,
      password: formPassword
    });
    
    alert("Konfigurasi Akun Berhasil Diperbarui!");
    setIsConfigModalOpen(false);
  };

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
     
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen" style={{ width: '18rem', flexShrink: 0, backgroundColor: '#ffffff', borderRight: '1px solid #E2E8F0', display: 'flex', flexDirection: 'column' }}>
        <div className="p-6 border-b border-slate-200" style={{ padding: '1.5rem', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div className="w-8 h-8 rounded-lg bg-[#2563EB] flex items-center justify-center text-white font-bold" style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', backgroundColor: '#2563EB', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {namaToko.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-[#1E293B]" style={{ fontSize: '1.125rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>{namaToko}</h1>
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

        <div style={{ padding: '1rem', paddingBottom: '1.25rem', borderTop: '1px solid #E2E8F0', marginTop: 'auto' }}>
          <Link
            href="/login"
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '0.75rem',
              backgroundColor: '#ffffff',
              border: '1px solid #FEE2E2',
              padding: '0.75rem 0',
              color: '#EF4444',
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

      <div className="flex-1 flex flex-col min-w-0" style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
        
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10" style={{ height: '5rem', backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 2rem' }}>
          <h2 className="text-xl font-bold text-[#1E293B]" style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1E293B', margin: 0 }}>{activeMenu}</h2>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
          
            <button 
              style={{ 
                position: 'relative', 
                backgroundColor: '#F8FAFC', 
                border: '1px solid #E2E8F0', 
                padding: '0.5rem', 
                borderRadius: '50%', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#64748B'
              }}
            >
              <Bell style={{ width: '1.25rem', height: '1.25rem' }} />
              <span style={{ position: 'absolute', top: '2px', right: '2px', width: '8px', height: '8px', backgroundColor: '#EF4444', borderRadius: '50%' }} />
            </button>

            <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#E2E8F0' }} />

            <button 
              onClick={openConfigModal}
              style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.25rem' }}
              className="hover:opacity-80 transition-opacity"
            >
              <div 
                style={{ 
                  width: '2.25rem', 
                  height: '2.25rem', 
                  borderRadius: '50%', 
                  backgroundColor: '#009379', 
                  color: '#FFFFFF', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '0.85rem', 
                  fontWeight: 700 
                }}
              >
                {adminName.split(' ').map(n => n[0]).join('').substring(0, 2)}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#1E293B', lineHeight: '1.2' }}>{adminName}</span>
                <span style={{ fontSize: '11px', color: '#94A3B8' }}>{namaToko} Admin</span>
              </div>
            </button>

          </div>
        </header>

        <main 
          key={activeMenu} 
          className="p-8 flex-1 overflow-y-auto animate-[fadeIn_0.3s_ease-out]" 
          style={{ padding: '2rem', flex: 1, overflowY: 'auto', display: 'block' }}
        >
          {activeMenu === 'Dashboard' && <DashboardView setActiveMenu={setActiveMenu} />}
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

      {isConfigModalOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15, 23, 42, 0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '1rem' }}>
          
          <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', maxWidth: '32rem', width: '100%', overflow: 'hidden', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)' }}>
    
            <div style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#F8FAFC' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2563EB' }}>
                <Settings style={{ width: '1.25rem', height: '1.25rem' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Konfigurasi Akun & Toko</h3>
              </div>
              <button onClick={() => setIsConfigModalOpen(false)} style={{ border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#94A3B8', padding: '0.25rem', borderRadius: '0.5rem' }}>
                <X style={{ width: '1.25rem', height: '1.25rem' }} />
              </button>
            </div>

            <form onSubmit={handleSaveConfig} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
         
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.375rem' }}>Foto Profil Utama</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '3.5rem', height: '3.25rem', borderRadius: '50%', backgroundColor: '#009379', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', fontWeight: 700 }}>
                    {formAdminName.split(' ').map(n => n[0]).join('').substring(0, 2)}
                  </div>
                  <div style={{ border: '1.5px dashed #CBD5E1', borderRadius: '0.75rem', padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.375rem', backgroundColor: '#F8FAFC', color: '#64748B', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500 }}>
                    <Camera style={{ width: '1rem', height: '1rem' }} /> Ganti Foto Profil baru
                  </div>
                </div>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nama Lengkap Admin</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <User style={{ position: 'absolute', left: '0.75rem', width: '1rem', height: '1rem', color: '#94A3B8' }} />
                  <input 
                    type="text" required value={formAdminName} onChange={(e) => setFormAdminName(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Nama Toko UMKM</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Store style={{ position: 'absolute', left: '0.75rem', width: '1rem', height: '1rem', color: '#94A3B8' }} />
                  <input 
                    type="text" required value={formNamaToko} onChange={(e) => setFormNamaToko(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Alamat E-mail Log In</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Mail style={{ position: 'absolute', left: '0.75rem', width: '1rem', height: '1rem', color: '#94A3B8' }} />
                  <input 
                    type="email" required value={formAdminEmail} onChange={(e) => setFormAdminEmail(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 0.875rem 0.625rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '11px', fontWeight: 700, color: '#64748B', textTransform: 'uppercase', display: 'block', marginBottom: '0.25rem' }}>Kata Sandi Keamanan (Password)</label>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Shield style={{ position: 'absolute', left: '0.75rem', width: '1rem', height: '1rem', color: '#94A3B8' }} />
                  <input 
                    type={showPassword ? "text" : "password"} required value={formPassword} onChange={(e) => setFormPassword(e.target.value)}
                    style={{ width: '100%', padding: '0.625rem 3rem 0.625rem 2.25rem', border: '1px solid #E2E8F0', borderRadius: '0.75rem', fontSize: '0.875rem', color: '#1E293B', boxSizing: 'border-box' }}
                  />
             
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '0.875rem', border: 'none', backgroundColor: 'transparent', cursor: 'pointer', color: '#94A3B8', display: 'flex', alignItems: 'center', padding: 0 }}
                  >
                    {showPassword ? <EyeOff style={{ width: '1.15rem', height: '1.15rem' }} /> : <Eye style={{ width: '1.15rem', height: '1.15rem' }} />}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid #F1F5F9', justifyContent: 'flex-end' }}>
                <button 
                  type="button"
                  onClick={() => setIsConfigModalOpen(false)}
                  style={{ padding: '0.625rem 1rem', border: '1px solid #E2E8F0', backgroundColor: '#ffffff', color: '#475569', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer' }}
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  style={{ padding: '0.625rem 1.25rem', border: 'none', backgroundColor: '#2563EB', color: '#ffffff', borderRadius: '0.75rem', fontSize: '0.875rem', fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}