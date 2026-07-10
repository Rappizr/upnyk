"use client";
import { useState, useEffect } from "react";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  BellIcon, StarIcon
} from "@/components/ProductIcons";

const tabs = ["Semua", "Transaksi", "Promo", "Keamanan"];

const typeColors: Record<string, string> = {
  Transaksi: "badge-info",
  Promo: "badge-warning",
  Keamanan: "badge-danger",
};

export default function NotifikasiView() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifs, setNotifs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<number, number>>({});
  const [reviewTexts, setReviewTexts] = useState<Record<number, string>>({});
  const [submittedReviews, setSubmittedReviews] = useState<number[]>([]);

  async function loadNotifications() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      
      // Let's prepend interactive reminders if not already present
      const interactiveNotifs = [
        {
          id: 101,
          type: "Transaksi",
          icon_type: "star",
          title: "Beri Ulasan Barang!",
          body: "Pesanan Beras Merah Organik Anda dari Koperasi Tani Maju telah sampai. Berikan ulasan bintang dan bantu petani lokal pelosok!",
          time: "10 menit lalu",
          unread: true,
          interactive: "review",
          productName: "Beras Merah Organik",
          supplier: "Koperasi Tani Maju"
        },
        {
          id: 102,
          type: "Transaksi",
          icon_type: "package",
          title: "Segera Bayar Pesanan Anda",
          body: "Pesanan ORD-20250620-003 sebesar Rp 135.000 menunggu pembayaran Anda. Batas waktu pembayaran tinggal 2 jam lagi.",
          time: "1 jam lalu",
          unread: true,
          interactive: "payment",
          orderId: "ORD-20250620-003",
          amount: 135000
        },
        ...data
      ];
      setNotifs(interactiveNotifs);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotifications();
  }, []);

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

  const handlePayReminder = async (orderId: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: "Diproses" })
      });
      if (res.ok) {
        // Remove the payment reminder or update it
        setNotifs(prev => prev.filter(n => n.id !== 102));
        alert("Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses oleh Koperasi.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitReview = (notifId: number) => {
    const star = ratings[notifId] || 0;
    const text = reviewTexts[notifId] || "";
    if (star === 0) {
      alert("Harap pilih bintang terlebih dahulu!");
      return;
    }
    setSubmittedReviews([...submittedReviews, notifId]);
    alert(`Ulasan bintang ${star} berhasil dikirim! Terima kasih telah mendukung produk koperasi pelosok.`);
  };

  const filtered = activeTab === "Semua" ? notifs : notifs.filter((n) => n.type === activeTab);
  const unreadCount = notifs.filter((n) => n.unread).length;

  return (
    <>
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
      <p className="page-subtitle">Reminder otomatis pembayaran pesanan, promo terhangat, dan ulasan bintang toko pelosok</p>

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
            <div key={n.id} className={`notif-card${n.unread ? " unread" : ""}`} id={`notif-item-${n.id}`} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", gap: "0.875rem", width: "100%" }}>
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

              {/* Interactive Area: Payment Reminder */}
              {n.interactive === "payment" && (
                <div style={{ marginTop: "0.75rem", paddingLeft: "3.25rem" }}>
                  <button 
                    className="btn-primary" 
                    onClick={() => handlePayReminder(n.orderId)}
                    style={{ fontSize: "0.75rem", padding: "0.4rem 1rem" }}
                  >
                    Bayar Sekarang (Rp {n.amount.toLocaleString("id-ID")})
                  </button>
                </div>
              )}

              {/* Interactive Area: Review/Stars Rating */}
              {n.interactive === "review" && (
                <div style={{ marginTop: "0.75rem", paddingLeft: "3.25rem", width: "100%" }}>
                  {submittedReviews.includes(n.id) ? (
                    <div className="text-xs text-emerald-600 font-semibold" style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                      ✓ Ulasan Terkirim! Terima kasih atas bantuan Anda.
                    </div>
                  ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                      {/* Star Rating Icons */}
                      <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                        <span className="text-xs text-muted mr-2">Pilih Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span 
                            key={star}
                            onClick={() => setRatings({ ...ratings, [n.id]: star })}
                            style={{ cursor: "pointer" }}
                          >
                            <StarIcon 
                              size={18} 
                              fill={(ratings[n.id] || 0) >= star ? "currentColor" : "none"} 
                              className={(ratings[n.id] || 0) >= star ? "text-amber-400" : "text-gray-300"} 
                            />
                          </span>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                        <input 
                          type="text" 
                          placeholder="Tulis ulasan singkat..."
                          className="form-input"
                          style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          value={reviewTexts[n.id] || ""}
                          onChange={(e) => setReviewTexts({ ...reviewTexts, [n.id]: e.target.value })}
                        />
                        <button 
                          className="btn-secondary" 
                          onClick={() => handleSubmitReview(n.id)}
                          style={{ fontSize: "0.75rem", padding: "0.3rem 0.8rem" }}
                        >
                          Kirim
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-subtle)" }}>
              Tidak ada notifikasi dalam kategori ini.
            </div>
          )}
        </div>
      )}
    </>
  );
}
