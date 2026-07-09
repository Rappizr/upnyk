"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  BellIcon
} from "@/components/ProductIcons";

const tabs = ["Semua", "Transaksi", "Promo", "Keamanan"];

const typeColors: Record<string, string> = {
  Transaksi: "badge-info",
  Promo: "badge-warning",
  Keamanan: "badge-danger",
};

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifs(data);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

  const filtered = activeTab === "Semua" ? notifs : notifs.filter((n) => n.type === activeTab);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = async () => {
    try {
      const res = await fetch("/api/notifications", {
        method: "POST"
      });
      if (res.ok) {
        setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BellIcon size={28} className="text-primary" /> Notifikasi
        </h1>
        {unreadCount > 0 && (
          <button className="btn-ghost" onClick={markAllRead} style={{ fontSize: "0.8rem" }} id="btn-mark-all-read">
            ✓ Tandai Semua Dibaca
          </button>
        )}
      </div>
      <p className="page-subtitle">Informasi pengiriman pesanan, promo terhangat, dan info keamanan akun Anda</p>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)} id={`tab-${t.toLowerCase()}`}>
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat notifikasi...</div>
      ) : (
        /* Notifications List */
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((n) => (
            <div key={n.id} className={`notif-card${n.unread ? " unread" : ""}`} id={`notif-item-${n.id}`}>
              <div className={`notif-icon ${n.unread ? "active" : ""}`}>
                <IconRenderer type={n.icon_type} size={20} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                  <span className={`badge ${typeColors[n.type] || "badge-gray"}`}>{n.type}</span>
                  <span className="text-xs text-subtle">{n.time}</span>
                </div>
                <div className="font-semibold text-sm" style={{ color: n.unread ? "var(--color-text)" : "var(--color-text-muted)" }}>
                  {n.title}
                </div>
                <div className="text-xs text-muted" style={{ marginTop: "0.15rem", lineHeight: 1.4 }}>
                  {n.body}
                </div>
              </div>
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-subtle)" }}>
              Tidak ada notifikasi dalam kategori ini.
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

