"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  BellIcon, PackageIcon, StarIcon, ShieldIcon, LeafIcon, LockIcon
} from "@/components/ProductIcons";

const tabs = ["Semua", "Transaksi", "Promo", "Keamanan"];

const notifications = [
  { id: 1, type: "Transaksi", icon: <PackageIcon size={20} className="text-blue-500" />, title: "Pesanan Sedang Dikirim!", body: "Pesanan ORD-20250701-001 kini ada di tangan kurir lokal. Estimasi tiba hari ini.", time: "30 menit lalu", unread: true },
  { id: 2, type: "Promo", icon: <StarIcon size={20} className="text-amber-500" fill="currentColor" />, title: "Voucher Cashback 15%", body: "Dapatkan cashback 15% untuk pembelian produk organik minimum Rp 200.000. Berlaku s/d 10 Jul.", time: "2 jam lalu", unread: true },
  { id: 3, type: "Transaksi", icon: <PackageIcon size={20} className="text-emerald-500" />, title: "Pembayaran Dikonfirmasi", body: "Pembayaran untuk pesanan ORD-20250701-001 sebesar Rp 280.000 berhasil dikonfirmasi.", time: "5 jam lalu", unread: true },
  { id: 4, type: "Promo", icon: <LeafIcon size={20} className="text-green-500" />, title: "Flash Sale Produk Lokal", body: "Flash sale dimulai! Diskon hingga 40% untuk produk pilihan dari Koperasi Tani Maju.", time: "Kemarin", unread: false },
  { id: 5, type: "Keamanan", icon: <LockIcon size={20} className="text-red-500" />, title: "Login dari Perangkat Baru", body: "Terdeteksi login dari perangkat baru (Chrome, Windows). Jika bukan Anda, segera ubah kata sandi.", time: "2 hari lalu", unread: false },
  { id: 6, type: "Transaksi", icon: <StarIcon size={20} className="text-amber-400" />, title: "Ulasan Anda Membantu!", body: "Ulasan Anda untuk Kopi Arabika Gayo telah dipublikasikan dan membantu 47 pembeli lain.", time: "3 hari lalu", unread: false },
];

const typeColors: Record<string, string> = {
  Transaksi: "badge-info",
  Promo: "badge-warning",
  Keamanan: "badge-danger",
};

export default function NotifikasiPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifs, setNotifs] = useState(notifications);

  const filtered = activeTab === "Semua" ? notifs : notifs.filter((n) => n.type === activeTab);
  const unreadCount = notifs.filter((n) => n.unread).length;

  const markAllRead = () => setNotifs((prev) => prev.map((n) => ({ ...n, unread: false })));

  return (
    <AppLayout>
      <div style={{ display: "flex", alignItems: "flex-start", justifyBetween: "space-between", marginBottom: "0.25rem" }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BellIcon size={28} className="text-primary" /> Notifikasi
        </h1>
        {unreadCount > 0 && (
          <button className="btn-ghost" onClick={markAllRead} style={{ fontSize: "0.8rem" }} id="btn-mark-all-read">
            ✓ Tandai Semua Dibaca
          </button>
        )}
      </div>
      <p className="page-subtitle">
        {unreadCount > 0 ? (
          <><strong style={{ color: "var(--color-primary)" }}>{unreadCount} notifikasi baru</strong> belum dibaca</>
        ) : (
          "Semua notifikasi telah dibaca"
        )}
      </p>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((t) => (
          <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)} id={`notif-tab-${t.toLowerCase()}`}>
            {t}
            {t === "Semua" && unreadCount > 0 && (
              <span style={{ marginLeft: "0.375rem", background: "var(--color-primary)", color: "white", borderRadius: "999px", padding: "1px 6px", fontSize: "0.65rem" }}>
                {unreadCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Notification List */}
      <div className="card" style={{ padding: 0, overflow: "hidden" }}>
        {filtered.map((n) => (
          <div
            key={n.id}
            className={`notif-item${n.unread ? " unread" : ""}`}
            id={`notif-${n.id}`}
            onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, unread: false } : x))}
          >
            <div style={{ width: 44, height: 44, borderRadius: "50%", background: n.unread ? "var(--color-primary-light)" : "var(--color-bg)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, border: `1px solid ${n.unread ? "var(--color-primary)" : "var(--color-border)"}` }}>
              {n.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                <span className={`badge ${typeColors[n.type] || "badge-gray"}`} style={{ fontSize: "0.65rem", padding: "1px 6px" }}>{n.type}</span>
                {n.unread && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--color-primary)", display: "inline-block" }} />}
              </div>
              <div className={`text-sm ${n.unread ? "font-semibold" : "font-medium"}`}>{n.title}</div>
              <div className="text-xs text-muted" style={{ marginTop: "0.2rem", lineHeight: 1.5 }}>{n.body}</div>
            </div>
            <div className="text-xs text-subtle" style={{ flexShrink: 0, marginTop: "0.125rem" }}>{n.time}</div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ padding: "3rem", textAlign: "center", color: "var(--color-text-subtle)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>
              <BellIcon size={48} className="text-slate-300 mx-auto" />
            </div>
            <div className="font-medium">Tidak ada notifikasi</div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
