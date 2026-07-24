"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/db";
import { markNotificationsAsReadAction, updateOrderStatusAction } from "@/app/actions";

interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

function BellIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function StarIcon({ size = 16, className = "", ...props }: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function PackageIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function LockIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function DollarIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      {...props}
    >
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function IconRenderer({ type, size = 24, className = "" }: { type: string; size?: number; className?: string }) {
  const normalized = type?.toLowerCase() || "";
  switch (normalized) {
    case "transaksi":
    case "star":
      return <StarIcon size={size} className={className} />;
    case "package":
      return <PackageIcon size={size} className={className} />;
    case "keamanan":
    case "lock":
      return <LockIcon size={size} className={className} />;
    case "promo":
    case "dollar":
      return <DollarIcon size={size} className={className} />;
    default:
      return <BellIcon size={size} className={className} />;
  }
}

const tabs = ["Semua", "Transaksi", "Promo", "Keamanan"];

const typeColors: Record<string, string> = {
  Transaksi: "badge-info",
  Promo: "badge-warning",
  Keamanan: "badge-danger",
};

export interface NotificationItem {
  id: string;
  tipe: string;
  judul: string;
  isi: string;
  created_at: string;
  dibaca: boolean;
  interactive?: "review" | "payment";
  orderId?: string;
  amount?: number;
}

interface NotifikasiViewProps {
  onUpdateCount?: (count: number) => void;
}

export default function NotifikasiView({ onUpdateCount }: NotifikasiViewProps) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewTexts, setReviewTexts] = useState<Record<string, string>>({});
  const [submittedReviews, setSubmittedReviews] = useState<string[]>([]);

  const updateUnreadCounter = useCallback(
    (items: NotificationItem[]) => {
      const unreadCount = items.filter((n) => !n.dibaca).length;
      onUpdateCount?.(unreadCount);
    },
    [onUpdateCount]
  );

  // FETCH DATA MURNI REALTIME DARI TABEL `notifikasi` SUPABASE
  const loadNotificationsRealtime = useCallback(async () => {
    try {
      setLoading(true);

      let userId = typeof window !== "undefined" ? localStorage.getItem("supabase_user_id") : null;
      if (!userId) {
        const { data: authData } = await supabase.auth.getUser();
        userId = authData.user?.id || null;
      }

      let query = supabase.from("notifikasi").select("*").order("created_at", { ascending: false });

      if (userId) {
        query = query.or(`pembeli_id.eq.${userId},profile_id.eq.${userId}`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching notifikasi:", error.message);
      }

      const fetchedNotifs: NotificationItem[] = (data || []).map((item) => ({
        id: item.id,
        tipe: item.tipe || "Transaksi",
        judul: item.judul || "Notifikasi",
        isi: item.isi || "",
        created_at: item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Baru saja",
        dibaca: item.dibaca ?? false,
      }));

      setNotifs(fetchedNotifs);
      updateUnreadCounter(fetchedNotifs);
    } catch (err) {
      console.error("Failed to load notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [updateUnreadCounter]);

  useEffect(() => {
    loadNotificationsRealtime();
  }, [loadNotificationsRealtime]);

  // UPDATE TANDAI DIBACA KEMBALI KE SUPABASE
  const markAllRead = async () => {
    try {
      let userId = typeof window !== "undefined" ? localStorage.getItem("supabase_user_id") : null;
      if (!userId) {
        const { data: authData } = await supabase.auth.getUser();
        userId = authData.user?.id || null;
      }

      if (userId) {
        await supabase
          .from("notifikasi")
          .update({ dibaca: true })
          .or(`pembeli_id.eq.${userId},profile_id.eq.${userId}`);
      } else {
        await supabase.from("notifikasi").update({ dibaca: true }).eq("dibaca", false);
      }

      await markNotificationsAsReadAction();

      setNotifs((prev) => {
        const updated = prev.map((n) => ({ ...n, dibaca: true }));
        updateUnreadCounter(updated);
        return updated;
      });
    } catch (err) {
      console.error("Failed to mark read:", err);
    }
  };

  const handlePayReminder = async (orderId?: string) => {
    if (!orderId) return;
    try {
      const success = await updateOrderStatusAction(orderId, "Diproses");
      if (success) {
        setNotifs((prev) => {
          const updated = prev.filter((n) => n.orderId !== orderId);
          updateUnreadCounter(updated);
          return updated;
        });
        alert("Pembayaran berhasil dikonfirmasi! Pesanan Anda sedang diproses oleh Koperasi.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmitReview = (notifId: string) => {
    const star = ratings[notifId] || 0;
    if (star === 0) {
      alert("Harap pilih bintang terlebih dahulu!");
      return;
    }
    setSubmittedReviews((prev) => [...prev, notifId]);
    alert(`Ulasan bintang ${star} berhasil dikirim! Terima kasih telah mendukung produk koperasi pelosok.`);
  };

  const filtered = activeTab === "Semua" ? notifs : notifs.filter((n) => n.tipe.toLowerCase() === activeTab.toLowerCase());
  const unreadCount = notifs.filter((n) => !n.dibaca).length;

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
      <p className="page-subtitle">
        Reminder otomatis pembayaran pesanan, promo terhangat, dan ulasan bintang toko pelosok
      </p>

      {/* Tabs Filter */}
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab-btn${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
            id={`tab-${t.toLowerCase()}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>
          Memuat notifikasi dari database...
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((n) => (
            <div
              key={n.id}
              className={`notif-card${!n.dibaca ? " unread" : ""}`}
              id={`notif-item-${n.id}`}
              style={{ display: "flex", flexDirection: "column" }}
            >
              <div style={{ display: "flex", gap: "0.875rem", width: "100%" }}>
                <div className={`notif-icon ${!n.dibaca ? "active" : ""}`}>
                  <IconRenderer type={n.tipe} size={20} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                    <span className={`badge ${typeColors[n.tipe] || "badge-gray"}`}>{n.tipe}</span>
                    <span className="text-xs text-subtle">{n.created_at}</span>
                  </div>
                  <div className="font-semibold text-sm" style={{ color: !n.dibaca ? "var(--color-text)" : "var(--color-text-muted)" }}>
                    {n.judul}
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: "0.15rem", lineHeight: 1.4 }}>
                    {n.isi}
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
                    Bayar Sekarang (Rp {n.amount?.toLocaleString("id-ID") ?? "0"})
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
                      <div style={{ display: "flex", gap: "0.25rem", alignItems: "center" }}>
                        <span className="text-xs text-muted mr-2">Pilih Rating:</span>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <span
                            key={star}
                            onClick={() => setRatings((prev) => ({ ...prev, [n.id]: star }))}
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

                      <div style={{ display: "flex", gap: "0.5rem", width: "100%" }}>
                        <input
                          type="text"
                          placeholder="Tulis ulasan singkat..."
                          className="form-input"
                          style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                          value={reviewTexts[n.id] || ""}
                          onChange={(e) =>
                            setReviewTexts((prev) => ({ ...prev, [n.id]: e.target.value }))
                          }
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