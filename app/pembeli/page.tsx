"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/db";
import { getProfileAction, getNotificationsAction, getCartAction } from "@/app/actions";
import DashboardView from "./components/DashboardView";
import MarketplaceView from "./components/MarketplaceView";
import WishlistView from "./components/WishlistView";
import PesananView from "./components/PesananView";
import NotifikasiView from "./components/NotifikasiView";
import ProfilView from "./components/ProfilView";
import CartView from "./components/CartView";

export default function PembeliMasterPage() {
  const [activeTab, setActiveTab] = useState("Profil");
  const [selectedStoreFilter, setSelectedStoreFilter] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [userName, setUserName] = useState("");
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(true);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const [unreadNotifCount, setUnreadNotifCount] = useState<number>(0);

  const updateCartCount = async () => {
    try {
      const items = await getCartAction();
      const totalQty = items.reduce((sum: number, item: any) => sum + (item.qty || 1), 0);
      setCartCount(totalQty);
    } catch (e) {
      console.error(e);
      setCartCount(0);
    }
  };

  const loadProfile = async () => {
    try {
      let userId = typeof window !== "undefined" ? localStorage.getItem('supabase_user_id') : null;
      if (!userId) {
        const { data: { user } } = await supabase.auth.getUser();
        userId = user?.id || null;
      }

      const data = await getProfileAction(userId || undefined);
      if (data) {
        setUserName(data.name || "");
        setAvatarUrl(data.avatar_url || "");
        
        const isAddrEmpty = !data.alamat || data.alamat.trim() === "";
        const isPhoneEmpty = !data.phone || data.phone.trim() === "";
        
        if (isAddrEmpty || isPhoneEmpty) {
          setIsProfileIncomplete(true);
          setActiveTab("Profil");
        } else {
          setIsProfileIncomplete(false);
          setActiveTab("Beranda");
        }
      }
    } catch (err) {
      console.error("Failed to load profile in layout:", err);
    } finally {
      setIsProfileLoading(false);
    }
  };

  const loadUnreadNotifCount = async () => {
    try {
      const data = await getNotificationsAction();
      if (data && data.length > 0) {
        const dbUnread = data.filter((n: any) => n.unread).length;
        setUnreadNotifCount(dbUnread + 2);
      } else {
        setUnreadNotifCount(0);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    updateCartCount();
    loadProfile();
    loadUnreadNotifCount();
    // Periodically sync or listen to storage changes
    window.addEventListener("storage", updateCartCount);
    return () => window.removeEventListener("storage", updateCartCount);
  }, []);

  const sidebarItems = [
    { 
      name: "Beranda", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      )
    },
    { 
      name: "Marketplace", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="8" cy="21" r="1" />
          <circle cx="19" cy="21" r="1" />
          <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
        </svg>
      )
    },
    { 
      name: "Wishlist", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
        </svg>
      )
    },
    { 
      name: "Pesanan", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
          <line x1="12" y1="22.08" x2="12" y2="12" />
        </svg>
      )
    },
    { 
      name: "Notifikasi", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>
      ), 
      badge: unreadNotifCount > 0 ? unreadNotifCount : undefined
    },
    { 
      name: "Profil", 
      icon: (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      )
    }
  ];

  // Blokir akses ke UI sampai pengecekan profil selesai
  if (isProfileLoading) {
    return (
      <div style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--color-bg, #f8f9fa)",
        gap: "1rem"
      }}>
        <div style={{
          width: "48px",
          height: "48px",
          border: "4px solid var(--color-border, #e5e7eb)",
          borderTopColor: "var(--color-primary, #16a34a)",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite"
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        <p style={{ color: "var(--color-text-muted, #6b7280)", fontSize: "0.9rem", fontWeight: 500 }}>
          Memeriksa profil Anda…
        </p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* HEADER NAVBAR */}
      <header className="header-nav">
        <div 
          className="header-logo" 
          style={{ cursor: isProfileIncomplete ? "not-allowed" : "pointer" }} 
          onClick={() => {
            if (isProfileIncomplete) return;
            setActiveTab("Beranda");
          }}
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="var(--color-primary)" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" fillOpacity="0.9" />
          </svg>
          Pasar<span>Nusa</span>
        </div>

        <div className="header-search" style={{ opacity: isProfileIncomplete ? 0.5 : 1, pointerEvents: isProfileIncomplete ? "none" : "auto" }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input type="text" placeholder="Cari produk, supplier, atau kategori…" id="header-search-input" disabled={isProfileIncomplete} />
        </div>

        <div className="header-actions">
          <button 
            className="icon-btn" 
            onClick={() => {
              if (isProfileIncomplete) {
                alert("Silakan lengkapi alamat dan nomor HP Anda terlebih dahulu.");
                return;
              }
              setActiveTab("Keranjang");
            }} 
            title="Keranjang" 
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: isProfileIncomplete ? "not-allowed" : "pointer", 
              position: "relative",
              opacity: isProfileIncomplete ? 0.5 : 1
            }}
            disabled={isProfileIncomplete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            {cartCount > 0 ? (
              <span style={{ position: "absolute", top: "-5px", right: "-5px", background: "var(--color-secondary)", color: "white", borderRadius: "50%", width: "16px", height: "16px", fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700 }}>
                {cartCount}
              </span>
            ) : (
              <span className="badge-dot" style={{ background: "var(--color-secondary)" }} />
            )}
          </button>

          <button 
            className="icon-btn" 
            onClick={() => {
              if (isProfileIncomplete) {
                alert("Silakan lengkapi alamat dan nomor HP Anda terlebih dahulu.");
                return;
              }
              setActiveTab("Notifikasi");
            }} 
            title="Notifikasi" 
            style={{ 
              background: "transparent", 
              border: "none", 
              cursor: isProfileIncomplete ? "not-allowed" : "pointer",
              opacity: isProfileIncomplete ? 0.5 : 1
            }}
            disabled={isProfileIncomplete}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
            </svg>
            <span className="badge-dot" />
          </button>

          <button 
            className="avatar-btn" 
            onClick={() => setActiveTab("Profil")} 
            title="Profil Saya" 
            style={{ 
              border: "none", 
              cursor: "pointer",
              overflow: "hidden",
              padding: 0,
              background: avatarUrl ? "transparent" : undefined
            }}
          >
            {avatarUrl ? (
              <img src={avatarUrl} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              userName ? userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "P"
            )}
          </button>
        </div>
      </header>

      {/* BODY SHELL */}
      <div className="app-shell">
        <aside className="sidebar">
          <div className="nav-section-title">Menu Utama</div>
          {sidebarItems.map((item) => {
            const isActive = activeTab === item.name;
            const isDisabled = isProfileIncomplete && item.name !== "Profil";
            return (
              <button
                key={item.name}
                onClick={() => {
                  if (isDisabled) {
                    alert("Silakan lengkapi alamat dan nomor HP Anda terlebih dahulu.");
                    return;
                  }
                  setActiveTab(item.name);
                }}
                className={`nav-item${isActive ? " active" : ""}`}
                style={{
                  width: "100%",
                  textAlign: "left",
                  background: "transparent",
                  border: "none",
                  cursor: isDisabled ? "not-allowed" : "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  opacity: isDisabled ? 0.5 : 1,
                }}
                disabled={isDisabled}
              >
                <span style={{ display: "inline-flex", alignItems: "center" }}>{item.icon}</span>
                <span>{item.name}</span>
                {item.badge && (
                  <span
                    style={{
                      marginLeft: "auto",
                      background: "var(--color-primary)",
                      color: "white",
                      borderRadius: "999px",
                      padding: "1px 7px",
                      fontSize: "0.7rem",
                      fontWeight: 700,
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
          <div style={{ marginTop: "auto", padding: "0.875rem", borderTop: "1px solid var(--color-border)" }}>
            <Link
              href="/login"
              className="nav-item"
              style={{
                color: "var(--color-alert)",
                background: "var(--color-alert-light)",
                fontWeight: 600,
                borderRadius: "var(--radius-sm)",
                padding: "0.5rem 0.875rem",
                marginBottom: "0.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                textDecoration: "none"
              }}
              id="btn-logout"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span>Keluar Akun</span>
            </Link>
            <div style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)" }}>
              © 2025 Lural Commerce
            </div>
            <div style={{ fontSize: "0.7rem", color: "var(--color-text-subtle)", marginTop: "2px" }}>
              v1.0.0 — UMKM Edition
            </div>
          </div>
        </aside>

        <main className="main-content">
          {isProfileIncomplete && (
            <div 
              style={{ 
                background: "#FEF2F2", 
                borderLeft: "4px solid #EF4444", 
                padding: "1rem", 
                borderRadius: "8px", 
                marginBottom: "1.5rem",
                color: "#991B1B",
                fontWeight: 500,
                display: "flex",
                alignItems: "center",
                gap: "0.75rem"
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                <line x1="12" y1="9" x2="12" y2="13" />
                <line x1="12" y1="17" x2="12.01" y2="17" />
              </svg>
              <div>
                <strong>Profil Belum Lengkap:</strong> Silakan isi <strong>Alamat Lengkap</strong> dan <strong>Nomor Telepon</strong> pada form di bawah ini agar Anda dapat mengakses seluruh fitur PasarNusa.
              </div>
            </div>
          )}
          {activeTab === "Beranda" && (
            <DashboardView 
              onCartUpdated={updateCartCount} 
              currentUserName={userName}
              onNavigate={(tab: string, storeName?: string) => {
                setActiveTab(tab);
                if (storeName) {
                  setSelectedStoreFilter(storeName);
                }
              }} 
            />
          )}
          {activeTab === "Marketplace" && (
            <MarketplaceView 
              onCartUpdated={updateCartCount} 
              onNavigateToCart={() => setActiveTab("Keranjang")} 
              initialStoreFilter={selectedStoreFilter}
              clearInitialStoreFilter={() => setSelectedStoreFilter("")}
            />
          )}
          {activeTab === "Wishlist" && (
            <WishlistView 
              onCartUpdated={updateCartCount} 
              onNavigateMarketplace={() => setActiveTab("Marketplace")}
            />
          )}
          {activeTab === "Pesanan" && <PesananView />}
          {activeTab === "Notifikasi" && <NotifikasiView onUpdateCount={setUnreadNotifCount} />}
          {activeTab === "Profil" && <ProfilView onProfileUpdated={loadProfile} />}
          {activeTab === "Keranjang" && <CartView onCartUpdated={updateCartCount} onNavigateToOrders={() => setActiveTab("Pesanan")} />}
        </main>
      </div>

      {/* BOTTOM NAV FOR MOBILE */}
      <nav className="bottom-nav">
        {sidebarItems.map((item) => {
          const isActive = activeTab === item.name;
          const isDisabled = isProfileIncomplete && item.name !== "Profil";
          return (
            <button
              key={item.name}
              onClick={() => {
                if (isDisabled) {
                  alert("Silakan lengkapi alamat dan nomor HP Anda terlebih dahulu.");
                  return;
                }
                setActiveTab(item.name);
              }}
              className={`bottom-nav-item${isActive ? " active" : ""}`}
              id={`bottom-nav-${item.name.toLowerCase()}`}
              style={{
                cursor: isDisabled ? "not-allowed" : "pointer",
                opacity: isDisabled ? 0.5 : 1
              }}
              disabled={isDisabled}
            >
              <span className="bottom-nav-icon">{item.icon}</span>
              <span className="bottom-nav-label">{item.name}</span>
              {item.badge && (
                <span className="bottom-nav-badge">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
