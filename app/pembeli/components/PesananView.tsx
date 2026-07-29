"use client";
import { useState, useEffect, useCallback } from "react";
import { getOrdersAction, updateOrderStatusAction, submitReviewAction } from "@/app/actions";

function RiceIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
    </svg>
  );
}

function CoffeeIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M18 8h1a4 4 0 0 1 0 8h-1" />
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z" />
      <path d="M6 1v3M10 1v3M14 1v3" />
    </svg>
  );
}

function SpiceIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2c1.5 4 4 4 4 8 0 4.5-3.5 8-8 8s-8-3.5-8-8c0-4 2.5-4 4-8" />
      <path d="M12 10a4 4 0 0 0-4-4" />
    </svg>
  );
}

function OilIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22a7 7 0 0 0 7-7c0-4.3-7-11-7-11S5 10.7 5 15a7 7 0 0 0 7 7z" />
    </svg>
  );
}

function HoneyIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" />
      <path d="M12 6v12M8 10h8M6 14h12" />
    </svg>
  );
}

function GrainIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M12 2a15 15 0 0 0-8 13.5C4 19.5 7.5 22 12 22s8-2.5 8-6.5C20 15 16 2 12 2z" />
      <path d="M12 2v20" />
    </svg>
  );
}

function LeafIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 3.5 0 8.5C17 15 15 18 11 20z" />
      <path d="M19 2c-2.26 4.33-5.27 7.14-8 18" />
    </svg>
  );
}

function FactoryIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M2 20h20M20 16v4M4 20v-8l6-4v4l6-4v4l4-4v12" />
    </svg>
  );
}

function PackageIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
      <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
      <line x1="12" y1="22.08" x2="12" y2="12" />
    </svg>
  );
}

function StarIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}

function LocationIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function IconRenderer({ type, size = 24, className = "", ...props }: any) {
  const normalized = (type || "").toLowerCase();
  switch (normalized) {
    case "rice":
      return <RiceIcon size={size} className={className} {...props} />;
    case "coffee":
      return <CoffeeIcon size={size} className={className} {...props} />;
    case "spice":
      return <SpiceIcon size={size} className={className} {...props} />;
    case "oil":
      return <OilIcon size={size} className={className} {...props} />;
    case "honey":
      return <HoneyIcon size={size} className={className} {...props} />;
    case "grain":
      return <GrainIcon size={size} className={className} {...props} />;
    case "leaf":
      return <LeafIcon size={size} className={className} {...props} />;
    case "factory":
      return <FactoryIcon size={size} className={className} {...props} />;
    default:
      return <RiceIcon size={size} className={className} {...props} />;
  }
}

const tabs = ["Semua", "Sudah Dibayar", "Dikirim", "Selesai"];

export default function PesananView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptOrder, setReceiptOrder] = useState<any | null>(null);
  const [reviewModalOrder, setReviewModalOrder] = useState<any | null>(null);
  const [reviewRating, setReviewRating] = useState<number>(5);
  const [reviewText, setReviewText] = useState<string>("");
  const [submittingReview, setSubmittingReview] = useState<boolean>(false);
  const [reviewedOrderIds, setReviewedOrderIds] = useState<string[]>([]);

  const handleOpenReviewModal = (order: any) => {
    setReviewModalOrder(order);
    setReviewRating(5);
    setReviewText("Produk sangat baik, fresh, dan pengiriman tepat waktu.");
  };

  const handleSaveReviewModal = async () => {
    if (!reviewModalOrder) return;
    try {
      setSubmittingReview(true);
      const targetId = reviewModalOrder.id || reviewModalOrder.kode_pesanan || reviewModalOrder.originalId;
      const ok = await submitReviewAction(targetId, reviewRating, reviewText);
      if (ok) {
        setReviewedOrderIds((prev) => [
          ...prev,
          String(reviewModalOrder.id),
          String(reviewModalOrder.kodePesanan || ''),
          String(reviewModalOrder.originalId || ''),
          String(targetId)
        ]);
        setReviewModalOrder(null);
        await loadOrders();
      } else {
        alert("Gagal menyimpan ulasan ke database.");
      }
    } catch (e) {
      console.error("Gagal menyimpan ulasan:", e);
      alert("Terjadi kesalahan saat menyimpan ulasan.");
    } finally {
      setSubmittingReview(false);
    }
  };

  const loadOrders = useCallback(async () => {
    setLoading(true);
    try {
      const userId = typeof window !== "undefined" ? (localStorage.getItem("supabase_user_id") || localStorage.getItem("pembeli_id") || undefined) : undefined;
      const data = await getOrdersAction(userId);
      setOrders(data || []);
      if (data && data.length > 0 && !expanded) {
        setExpanded(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }, [expanded]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const success = await updateOrderStatusAction(orderId, status);
      if (success) {
        await loadOrders();
      } else {
        alert("Gagal memperbarui status pesanan.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCustomTimeline = (order: any) => {
    const dateStr = order.date || "Hari ini";
    switch (order.status) {
      case "Belum Dibayar":
      case "Diproses":
      case "Sudah Dibayar":
        return [
          { label: "Sudah Dibayar", time: dateStr, done: true, active: true },
          { label: "Dikirim", time: "-", done: false, active: false },
          { label: "Selesai", time: "-", done: false, active: false }
        ];
      case "Dikirim":
        return [
          { label: "Sudah Dibayar", time: dateStr, done: true, active: false },
          { label: "Dikirim", time: "Dalam perjalanan oleh kurir", done: true, active: true },
          { label: "Selesai", time: "-", done: false, active: false }
        ];
      case "Selesai":
        return [
          { label: "Sudah Dibayar", time: dateStr, done: true, active: false },
          { label: "Dikirim", time: "Selesai dikirim", done: true, active: false },
          { label: "Selesai", time: "Barang diterima dengan baik", done: true, active: true }
        ];
      default:
        return [];
    }
  };

  const filtered = activeTab === "Semua"
    ? orders.filter(o => o.status !== "Dibatalkan")
    : orders.filter((o) => {
      if (activeTab === "Sudah Dibayar") {
        return o.status === "Belum Dibayar" || o.status === "Diproses" || o.status === "Sudah Dibayar";
      }
      return o.status === activeTab;
    });

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <PackageIcon size={28} className="text-primary" /> Pesanan Saya
      </h1>
      <p className="page-subtitle">Lacak dan kelola semua transaksi Anda dengan transparansi penuh dari desa ke kota</p>

      {/* Tabs */}
      <div className="tabs">
        {tabs.map((t) => (
          <button
            key={t}
            className={`tab-btn${activeTab === t ? " active" : ""}`}
            onClick={() => setActiveTab(t)}
            id={`tab-${t.replace(/\s/g, "-").toLowerCase()}`}
          >
            {t}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-muted)" }}>Memuat daftar pesanan...</div>
      ) : (
        /* Orders List */
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {filtered.map((order) => {
            const timeline = getCustomTimeline(order);
            const totalItemCount = (order.items || []).reduce((sum: number, it: any) => sum + (it.qty || 1), 0);

            return (
              <div key={order.id || order.originalId} className="card" id={`order-${order.id}`}>
            
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span className="font-semibold text-sm">{order.id}</span>
                      <span className={`badge ${order.status === "Belum Dibayar" || order.status === "Diproses" || order.status === "Sudah Dibayar"
                          ? "badge-warning"
                          : order.status === "Dikirim"
                            ? "badge-info"
                            : order.status === "Selesai"
                              ? "badge-success"
                              : "badge-gray"
                        }`}>
                        {order.status === "Belum Dibayar" || order.status === "Diproses"
                          ? "Sudah Dibayar"
                          : order.status}
                      </span>
                    </div>
                    <div className="text-xs text-muted" style={{ marginTop: "0.25rem" }}>
                      {order.date} · <strong>{order.supplier || "Toko Admin"}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-bold text-primary">Rp {(order.total || 0).toLocaleString("id-ID")}</div>
                    <div className="text-xs text-muted">{totalItemCount} item</div>
                  </div>
                </div>

        
                {(order.items || []).map((item: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.625rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", marginBottom: "0.75rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                      <IconRenderer type={item.icon_type || "rice"} size={24} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-medium">{item.name || "Produk"}</div>
                      <div className="text-xs text-muted">x{item.qty || 1}</div>
                    </div>
                    <div className="font-semibold text-sm">Rp {(item.price || 0).toLocaleString("id-ID")}</div>
                  </div>
                ))}

              
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginBottom: timeline.length > 0 ? "0.875rem" : 0 }}>
                  {order.status === "Belum Dibayar" && !order.proof_uploaded && (
                    <button onClick={() => handleUpdateStatus(order.id, "Diproses")} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-bayar-${order.id}`}>
                      Bayar Sekarang
                    </button>
                  )}
                  {order.status === "Dikirim" && (
                    <button onClick={() => handleUpdateStatus(order.id, "Selesai")} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-selesai-${order.id}`}>
                      Selesai &amp; Terima Barang
                    </button>
                  )}
                  {order.status === "Selesai" && (
                    (order.rating || order.ulasan || reviewedOrderIds.includes(String(order.id)) || reviewedOrderIds.includes(String(order.kodePesanan || '')) || reviewedOrderIds.includes(String(order.originalId || ''))) ? (
                      <button
                        className="btn-secondary"
                        disabled
                        style={{
                          fontSize: "0.8rem",
                          padding: "0.4rem 0.875rem",
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "0.35rem",
                          opacity: 0.65,
                          cursor: "not-allowed",
                          backgroundColor: "#e5e7eb",
                          color: "#6b7280",
                          borderColor: "#d1d5db"
                        }}
                        id={`btn-ulasan-selesai-${order.id}`}
                      >
                        Selesai
                      </button>
                    ) : (
                      <button
                        className="btn-secondary"
                        onClick={() => handleOpenReviewModal(order)}
                        style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                        id={`btn-ulasan-${order.id}`}
                      >
                        <StarIcon size={14} fill="currentColor" /> Beri Ulasan
                      </button>
                    )
                  )}
                  <button onClick={() => setReceiptOrder(order)} className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }} id={`btn-invoice-${order.id}`}>
                    Invoice
                  </button>
                  {((order.status !== "Belum Dibayar" || order.proof_uploaded) && order.status !== "Dibatalkan") && (
                    <button
                      onClick={() => setReceiptOrder(order)}
                      className="btn-secondary"
                      style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}
                      id={`btn-bukti-${order.id}`}
                    >
                      Bukti Pembayaran
                    </button>
                  )}
                  {timeline.length > 0 && (
                    <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} onClick={() => setExpanded(expanded === order.id ? null : order.id)} id={`btn-track-${order.id}`}>
                      <LocationIcon size={14} /> {expanded === order.id ? "Sembunyikan Lacak" : "Lacak Pengiriman"}
                    </button>
                  )}
                </div>

              
                {expanded === order.id && timeline.length > 0 && (
                  <div style={{ padding: "1rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                    <div className="text-sm font-semibold" style={{ marginBottom: "0.875rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "0.5rem" }}>
                      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                        <LocationIcon size={16} /> Lini Masa Pelacakan Pesanan
                      </span>
                      {order.no_resi && (
                        <span style={{ fontSize: "0.75rem", background: "#DBEAFE", color: "#1E40AF", padding: "2px 8px", borderRadius: "4px", fontWeight: 700 }}>
                          No. Resi: {order.no_resi}
                        </span>
                      )}
                    </div>
                    <div className="timeline">
                      {timeline.map((step: any, idx: number) => (
                        <div key={idx} className="timeline-item">
                          <div className={`timeline-dot ${step.done ? "done" : step.active ? "active" : "pending"}`}>
                            {step.done ? "✓" : idx + 1}
                          </div>
                          <div>
                            <div className={`text-sm ${step.active ? "font-semibold text-primary" : step.done ? "font-medium" : "text-muted"}`}>
                              {step.label}
                            </div>
                            <div className="text-xs text-subtle">{step.time}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-subtle)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem", color: "var(--color-border)", display: "flex", justifyContent: "center" }}>
                <PackageIcon size={48} />
              </div>
              <div className="font-medium">Tidak ada pesanan dalam kategori ini</div>
            </div>
          )}
        </div>
      )}

  
      {receiptOrder && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: "1rem"
        }}>
          <div className="card" style={{
            maxWidth: "500px", width: "100%", padding: "2rem",
            background: "#ffffff", borderRadius: "var(--radius-md)",
            boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            position: "relative", border: "1px solid var(--color-border)"
          }}>
            <button
              onClick={() => setReceiptOrder(null)}
              style={{
                position: "absolute", top: "1rem", right: "1rem", border: "none",
                background: "transparent", fontSize: "1.5rem", cursor: "pointer",
                color: "var(--color-text-muted)"
              }}
            >
              &times;
            </button>
            <div style={{ textAlign: "center", borderBottom: "2px dashed var(--color-border)", paddingBottom: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-primary)", letterSpacing: "1px" }}>PASARNUSA</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-subtle)", marginTop: "0.25rem" }}>Desa Mandiri, Ekonomi Berdikari</div>
              <div style={{
                display: "inline-block", border: "2px solid #10B981", color: "#10B981",
                padding: "0.25rem 0.75rem", borderRadius: "4px", fontSize: "0.8rem",
                fontWeight: "bold", textTransform: "uppercase", marginTop: "1rem",
                transform: "rotate(-5deg)", letterSpacing: "1px"
              }}>
                LUNAS / PAID
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">No. Pesanan</span>
                <span className="font-semibold">{receiptOrder.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Tanggal Transaksi</span>
                <span className="font-medium">{receiptOrder.date || "Hari Ini"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Metode Pembayaran</span>
                <span className="font-semibold">{receiptOrder.payment_method || "QRIS"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Supplier Toko</span>
                <span className="font-semibold text-primary">{receiptOrder.supplier || "Toko Admin"}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Status Pembayaran</span>
                <span style={{ color: "#10B981", fontWeight: "bold" }}>Berhasil (Terverifikasi)</span>
              </div>
              {receiptOrder.proof_filename && (
                <div style={{ marginTop: "0.5rem", borderTop: "1px dashed var(--color-border-light)", paddingTop: "0.5rem" }}>
                  <div className="text-muted font-medium" style={{ fontSize: "0.75rem", marginBottom: "0.35rem" }}>Bukti Transfer Terlampir:</div>
                  {receiptOrder.proof_filename.startsWith("data:") ? (
                    <div style={{ display: "flex", justifyContent: "center", background: "#F8FAFC", padding: "0.5rem", borderRadius: "6px", border: "1px solid var(--color-border-light)" }}>
                      <img src={receiptOrder.proof_filename} alt="Bukti Transfer" style={{ maxHeight: "120px", maxWidth: "100%", objectFit: "contain", borderRadius: "4px" }} />
                    </div>
                  ) : (
                    <span style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", fontFamily: "monospace" }}>{receiptOrder.proof_filename}</span>
                  )}
                </div>
              )}
            </div>

            <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div className="font-semibold text-xs text-muted" style={{ marginBottom: "0.5rem", textTransform: "uppercase" }}>Rincian Barang</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {(receiptOrder.items || []).map((item: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>{item.name || "Produk"} (x{item.qty || 1})</span>
                    <span>Rp {((item.price || 0) * (item.qty || 1)).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", marginBottom: "2rem" }}>
              <strong>Total Pembayaran</strong>
              <strong style={{ color: "var(--color-primary)" }}>Rp {(receiptOrder.total || 0).toLocaleString("id-ID")}</strong>
            </div>

            <div style={{ textAlign: "center", color: "var(--color-text-subtle)", fontSize: "0.75rem", lineHeight: 1.4 }}>
              <div>Terima kasih atas kontribusi Anda mendukung toko UMKM lokal.</div>
              <div style={{ marginTop: "0.25rem", fontFamily: "monospace", letterSpacing: "1px" }}>PN-TXN-{String(receiptOrder.id).replace("ORD-", "")}</div>
            </div>
          </div>
        </div>
      )}

  
      {reviewModalOrder && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0, 0, 0, 0.5)", display: "flex", alignItems: "center",
          justifyContent: "center", zIndex: 1000, padding: "1rem"
        }}>
          <div className="card" style={{ maxWidth: "450px", width: "100%", padding: "1.75rem", position: "relative" }}>
            <button
              onClick={() => setReviewModalOrder(null)}
              style={{
                position: "absolute", top: "1rem", right: "1rem", border: "none",
                background: "transparent", fontSize: "1.5rem", cursor: "pointer",
                color: "var(--color-text-muted)"
              }}
            >
              &times;
            </button>
            <h3 className="font-bold text-lg" style={{ marginBottom: "0.5rem" }}>
              Beri Ulasan &amp; Rating Produk
            </h3>
            <p className="text-xs text-muted" style={{ marginBottom: "1.25rem" }}>
              Pesanan: <span className="font-semibold">{reviewModalOrder.id || reviewModalOrder.kode_pesanan}</span>
            </p>

            <div style={{ marginBottom: "1.25rem" }}>
              <label className="text-xs text-muted font-medium" style={{ display: "block", marginBottom: "0.5rem" }}>
                Pilih Rating (1 - 5 Bintang):
              </label>
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setReviewRating(star)}
                    style={{ cursor: "pointer", padding: "0.25rem" }}
                  >
                    <StarIcon
                      size={28}
                      className={reviewRating >= star ? "text-amber-400 fill-amber-400" : "text-gray-300"}
                      fill={reviewRating >= star ? "currentColor" : "none"}
                    />
                  </span>
                ))}
                <span className="font-bold text-sm text-primary" style={{ marginLeft: "0.5rem" }}>
                  {reviewRating} / 5
                </span>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <label className="text-xs text-muted font-medium" style={{ display: "block", marginBottom: "0.5rem" }}>
                Tulis Ulasan Pengalaman Anda:
              </label>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={3}
                className="input"
                placeholder="Bagikan ulasan mengenai kualitas barang & pelayanan toko..."
                style={{ width: "100%", padding: "0.6rem", fontSize: "0.85rem", borderRadius: "var(--radius-sm)" }}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.75rem" }}>
              <button
                className="btn-ghost"
                onClick={() => setReviewModalOrder(null)}
                style={{ fontSize: "0.85rem", padding: "0.5rem 1rem" }}
              >
                Batal
              </button>
              <button
                className="btn-primary"
                disabled={submittingReview}
                onClick={handleSaveReviewModal}
                style={{ fontSize: "0.85rem", padding: "0.5rem 1.25rem" }}
              >
                {submittingReview ? "Menyimpan..." : "Kirim Ulasan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}