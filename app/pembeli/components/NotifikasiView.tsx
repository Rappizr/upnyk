"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  fetchNotificationsAction,
  markAllNotifReadAction,
  markOneNotifReadAction,
  submitReviewAction,
} from "@/app/actions";


interface SVGIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
}

function BellIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function ShoppingCartIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

function ClockIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}

function CheckCircleIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
  );
}

function TruckIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="1" y="3" width="15" height="13" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
    </svg>
  );
}

function PackageCheckIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M16.5 9.4 7.5 4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.29 7 12 12 20.71 7" />
      <line x1="12" y1="22" x2="12" y2="12" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}

function StarIcon({ size = 24, className = "", fill = "none", ...props }: SVGIconProps & { fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function DollarIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="12" y1="1" x2="12" y2="23" />
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function LockIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}

function XCircleIcon({ size = 24, className = "", ...props }: SVGIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  );
}


function resolveNotifIcon(judul: string, tipe: string) {
  const j = judul.toLowerCase();
  if (j.includes("keranjang") || j.includes("masuk keranjang")) return "cart";
  if (j.includes("menunggu") || j.includes("belum dibayar")) return "clock";
  if (j.includes("dikonfirmasi") || j.includes("berhasil") && j.includes("bayar") || j.includes("pembelian berhasil") || j.includes("diproses")) return "check";
  if (j.includes("dikirim") || j.includes("terkirim") || j.includes("pengiriman") || j.includes("resi")) return "truck";
  if (j.includes("diterima") || j.includes("sampai") || j.includes("selesai")) return "package";
  if (j.includes("ulasan") || j.includes("bintang") || j.includes("review")) return "star";
  if (j.includes("dibatalkan") || j.includes("gagal")) return "xcircle";
  if (tipe.toLowerCase() === "promo") return "dollar";
  if (tipe.toLowerCase() === "keamanan") return "lock";
  return "bell";
}

function NotifIcon({ judul, tipe, size = 20, className = "" }: { judul: string; tipe: string; size?: number; className?: string }) {
  const type = resolveNotifIcon(judul, tipe);
  switch (type) {
    case "cart": return <ShoppingCartIcon size={size} className={className} />;
    case "clock": return <ClockIcon size={size} className={className} />;
    case "check": return <CheckCircleIcon size={size} className={className} />;
    case "truck": return <TruckIcon size={size} className={className} />;
    case "package": return <PackageCheckIcon size={size} className={className} />;
    case "star": return <StarIcon size={size} className={className} />;
    case "xcircle": return <XCircleIcon size={size} className={className} />;
    case "dollar": return <DollarIcon size={size} className={className} />;
    case "lock": return <LockIcon size={size} className={className} />;
    default: return <BellIcon size={size} className={className} />;
  }
}

function notifIconColor(judul: string, tipe: string): string {
  const type = resolveNotifIcon(judul, tipe);
  switch (type) {
    case "cart": return "#6366f1";
    case "clock": return "#f59e0b";
    case "check": return "#10b981";
    case "truck": return "#3b82f6";
    case "package": return "#8b5cf6";
    case "star": return "#f59e0b";
    case "xcircle": return "#ef4444";
    case "dollar": return "#f59e0b";
    case "lock": return "#6b7280";
    default: return "var(--color-primary, #6366f1)";
  }
}


export interface NotificationItem {
  id: string;
  tipe: string;
  judul: string;
  isi: string;
  created_at: string;
  dibaca: boolean;
}

interface NotifikasiViewProps {
  onUpdateCount?: (count: number) => void;
}

const tabs = ["Semua", "Transaksi", "Promo", "Keamanan"];

const typeColors: Record<string, string> = {
  Transaksi: "badge-info",
  Promo: "badge-warning",
  Keamanan: "badge-danger",
};

function formatDate(isoStr: string) {
  try {
    return new Date(isoStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "Baru saja";
  }
}


export default function NotifikasiView({ onUpdateCount }: NotifikasiViewProps) {
  const [activeTab, setActiveTab] = useState("Semua");
  const [notifs, setNotifs] = useState<NotificationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);


  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [reviewTexts, setReviewTexts] = useState<Record<string, string>>({});
  const [submittedReviews, setSubmittedReviews] = useState<string[]>([]);
  const [submittingId, setSubmittingId] = useState<string | null>(null);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  
  const loadNotifs = useCallback(async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      else setRefreshing(true);

      const data = await fetchNotificationsAction();
      const items: NotificationItem[] = data.map((n: any) => ({
        id: n.id,
        tipe: n.tipe || "Transaksi",
        judul: n.judul || "Notifikasi",
        isi: n.isi || "",
        created_at: n.created_at || new Date().toISOString(),
        dibaca: n.dibaca ?? false,
      }));

      setNotifs(items);
    } catch (err) {
      console.error("loadNotifs error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

 
  useEffect(() => {
    const unread = notifs.filter((x) => !x.dibaca).length;
    onUpdateCount?.(unread);
  }, [notifs, onUpdateCount]);

  useEffect(() => {
    loadNotifs();
    intervalRef.current = setInterval(() => loadNotifs(true), 30_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [loadNotifs]);

  
  const markAllRead = async () => {
    await markAllNotifReadAction();
    setNotifs((prev) => prev.map((n) => ({ ...n, dibaca: true })));
  };

 
  const markOneRead = async (notifId: string) => {
    const notif = notifs.find((n) => n.id === notifId);
    if (!notif || notif.dibaca) return;
    await markOneNotifReadAction(notifId);
    setNotifs((prev) => prev.map((n) => n.id === notifId ? { ...n, dibaca: true } : n));
  };

 
  const handleSubmitReview = async (notifId: string) => {
    const star = ratings[notifId] || 0;
    if (star === 0) {
      alert("Harap pilih bintang terlebih dahulu!");
      return;
    }
    setSubmittingId(notifId);
    try {
      const comment = reviewTexts[notifId] || "Produk sangat berkualitas dan sesuai pesanan.";
      await submitReviewAction(notifId, star, comment, notifId);
      setSubmittedReviews((prev) => [...prev, notifId]);
      await markOneRead(notifId);
    } catch (e) {
      console.error("handleSubmitReview error:", e);
      alert("Gagal menyimpan ulasan.");
    } finally {
      setSubmittingId(null);
    }
  };

  
  const filtered =
    activeTab === "Semua"
      ? notifs
      : notifs.filter((n) => n.tipe.toLowerCase() === activeTab.toLowerCase());

  const unreadCount = notifs.filter((n) => !n.dibaca).length;
  const isReviewReminder = (n: NotificationItem) =>
    resolveNotifIcon(n.judul, n.tipe) === "star" && !submittedReviews.includes(n.id);

  
  return (
    <>
      
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.25rem" }}>
        <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <BellIcon size={28} className="text-primary" /> Notifikasi
          {unreadCount > 0 && (
            <span style={{
              background: "#ef4444",
              color: "#fff",
              borderRadius: "999px",
              fontSize: "0.7rem",
              fontWeight: 700,
              padding: "0.1rem 0.45rem",
              minWidth: "1.3rem",
              textAlign: "center",
            }}>
              {unreadCount}
            </span>
          )}
        </h1>
        <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
          {refreshing && (
            <span style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Memperbarui…</span>
          )}
          <button
            className="btn-ghost"
            onClick={() => loadNotifs(true)}
            style={{ fontSize: "0.8rem" }}
            id="btn-refresh-notif"
          >
            ↻ Refresh
          </button>
          {unreadCount > 0 && (
            <button
              className="btn-ghost"
              onClick={markAllRead}
              style={{ fontSize: "0.8rem" }}
              id="btn-mark-all-read"
            >
              ✓ Tandai Semua Dibaca
            </button>
          )}
        </div>
      </div>

      <p className="page-subtitle">
        Update pesanan, konfirmasi pembayaran, pengiriman, dan pengingat ulasan
      </p>

      
      <div className="tabs" style={{ marginBottom: "1rem" }}>
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
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="card" style={{ padding: "1.25rem", opacity: 0.5, minHeight: "5rem", background: "var(--color-surface-alt, #f3f4f6)" }} />
          ))}
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
          {filtered.map((n) => {
            const iconColor = notifIconColor(n.judul, n.tipe);
            const isReview = isReviewReminder(n);
            const alreadySubmitted = submittedReviews.includes(n.id);

            return (
              <div
                key={n.id}
                className={`notif-card${!n.dibaca ? " unread" : ""}`}
                id={`notif-item-${n.id}`}
                onClick={() => markOneRead(n.id)}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  cursor: !n.dibaca ? "pointer" : "default",
                  borderLeft: !n.dibaca ? `3px solid ${iconColor}` : "3px solid transparent",
                  transition: "all 0.2s ease",
                }}
              >
                <div style={{ display: "flex", gap: "0.875rem", width: "100%" }}>
                 
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      borderRadius: "50%",
                      background: `${iconColor}18`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      color: iconColor,
                    }}
                  >
                    <NotifIcon judul={n.judul} tipe={n.tipe} size={18} />
                  </div>

               
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.2rem", gap: "0.5rem" }}>
                      <span className={`badge ${typeColors[n.tipe] || "badge-gray"}`}>{n.tipe}</span>
                      <span className="text-xs text-subtle" style={{ whiteSpace: "nowrap" }}>{formatDate(n.created_at)}</span>
                    </div>
                    <div
                      className="font-semibold text-sm"
                      style={{
                        color: !n.dibaca ? "var(--color-text)" : "var(--color-text-muted)",
                        marginBottom: "0.15rem",
                      }}
                    >
                      {n.judul}
                    </div>
                    <div className="text-xs text-muted" style={{ lineHeight: 1.5 }}>
                      {n.isi}
                    </div>

                   
                    {!n.dibaca && (
                      <div style={{ marginTop: "0.35rem" }}>
                        <span style={{
                          display: "inline-block",
                          width: "0.45rem",
                          height: "0.45rem",
                          borderRadius: "50%",
                          background: iconColor,
                        }} />
                      </div>
                    )}
                  </div>
                </div>

              
                {isReview && !alreadySubmitted && (
                  <div
                    style={{ marginTop: "0.85rem", paddingLeft: "3.375rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginBottom: "0.4rem" }}>
                      Pilih rating Anda:
                    </p>
                    {/* Stars */}
                    <div style={{ display: "flex", gap: "0.2rem", marginBottom: "0.5rem" }}>
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span
                          key={star}
                          onClick={() => setRatings((prev) => ({ ...prev, [n.id]: star }))}
                          style={{ cursor: "pointer", color: (ratings[n.id] || 0) >= star ? "#f59e0b" : "#d1d5db" }}
                        >
                          <StarIcon
                            size={20}
                            fill={(ratings[n.id] || 0) >= star ? "currentColor" : "none"}
                          />
                        </span>
                      ))}
                    </div>
                
                    <div style={{ display: "flex", gap: "0.5rem" }}>
                      <input
                        type="text"
                        placeholder="Tulis ulasan singkat…"
                        className="form-input"
                        style={{ flex: 1, padding: "0.3rem 0.6rem", fontSize: "0.75rem" }}
                        value={reviewTexts[n.id] || ""}
                        onChange={(e) => setReviewTexts((prev) => ({ ...prev, [n.id]: e.target.value }))}
                      />
                      <button
                        className="btn-secondary"
                        style={{ fontSize: "0.75rem", padding: "0.3rem 0.85rem", whiteSpace: "nowrap" }}
                        onClick={() => handleSubmitReview(n.id)}
                        disabled={submittingId === n.id}
                        id={`btn-submit-review-${n.id}`}
                      >
                        {submittingId === n.id ? "Mengirim…" : "Kirim ⭐"}
                      </button>
                    </div>
                  </div>
                )}

           
                {isReview && alreadySubmitted && (
                  <div
                    style={{ marginTop: "0.6rem", paddingLeft: "3.375rem", fontSize: "0.75rem", color: "#10b981", fontWeight: 600, display: "flex", alignItems: "center", gap: "0.3rem" }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <CheckCircleIcon size={14} /> Ulasan terkirim! Terima kasih.
                  </div>
                )}
              </div>
            );
          })}

          
          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "4rem 2rem", color: "var(--color-text-subtle)" }}>
              <BellIcon size={48} style={{ margin: "0 auto 1rem", opacity: 0.3 }} />
              <p style={{ fontWeight: 600, marginBottom: "0.35rem" }}>Tidak ada notifikasi</p>
              <p style={{ fontSize: "0.85rem" }}>
                {activeTab === "Semua"
                  ? "Notifikasi akan muncul saat ada aktivitas pesanan, pembayaran, atau pengiriman."
                  : `Tidak ada notifikasi kategori "${activeTab}".`}
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}