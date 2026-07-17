"use client";
import { useState, useEffect } from "react";
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
  const normalized = type.toLowerCase();
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

const statusColor: Record<string, string> = {
  "Sudah Dibayar": "badge-warning",
  "Belum Dibayar": "badge-warning",
  Diproses: "badge-warning",
  Dikirim: "badge-info",
  Selesai: "badge-success",
  Dibatalkan: "badge-gray",
};

export default function PesananView() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [receiptOrder, setReceiptOrder] = useState<any | null>(null);

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
      if (data.length > 0 && !expanded) {
        setExpanded(data[0].id);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status })
      });
      if (res.ok) {
        await loadOrders();
        alert(`Status pesanan berhasil diupdate menjadi: ${status}`);
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

  const filtered =
    activeTab === "Semua"
      ? orders.filter(o => o.status !== "Dibatalkan")
      : orders.filter((o) => {
          if (activeTab === "Sudah Dibayar") {
            return o.status === "Belum Dibayar" || o.status === "Diproses";
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
          <button key={t} className={`tab-btn${activeTab === t ? " active" : ""}`} onClick={() => setActiveTab(t)} id={`tab-${t.replace(/\s/g, "-").toLowerCase()}`}>
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
            return (
              <div key={order.id} className="card" id={`order-${order.id}`}>
                {/* Order Header */}
                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                      <span className="font-semibold text-sm">{order.id}</span>
                      <span className={`badge ${
                        order.status === "Belum Dibayar" || order.status === "Diproses"
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
                      {order.date} · <strong>{order.supplier}</strong>
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="font-bold text-primary font-bold">Rp {order.total.toLocaleString("id-ID")}</div>
                    <div className="text-xs text-muted">{order.items?.length || 0} item</div>
                  </div>
                </div>

                {/* Items */}
                {order.items?.map((item: any, i: number) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.625rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", marginBottom: "0.75rem" }}>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                      <IconRenderer type={item.icon_type} size={24} />
                    </span>
                    <div style={{ flex: 1 }}>
                      <div className="text-sm font-medium">{item.name}</div>
                      <div className="text-xs text-muted">x{item.qty}</div>
                    </div>
                    <div className="font-semibold text-sm">Rp {item.price.toLocaleString("id-ID")}</div>
                  </div>
                ))}

                {/* Actions */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.625rem", marginBottom: timeline.length > 0 ? "0.875rem" : 0 }}>
                  {order.status === "Belum Dibayar" && !order.proof_uploaded && (
                    <button onClick={() => handleUpdateStatus(order.id, "Diproses")} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-bayar-${order.id}`}>
                      Bayar Sekarang
                    </button>
                  )}
                  {order.status === "Dikirim" && (
                    <button onClick={() => handleUpdateStatus(order.id, "Selesai")} className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-selesai-${order.id}`}>
                      Selesai & Terima Barang
                    </button>
                  )}
                  {order.status === "Selesai" && (
                    <button className="btn-secondary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-ulasan-${order.id}`}>
                      <StarIcon size={14} fill="currentColor" /> Beri Ulasan
                    </button>
                  )}
                  <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem" }} id={`btn-invoice-${order.id}`}>
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

                {/* Timeline */}
                {expanded === order.id && timeline.length > 0 && (
                  <div style={{ padding: "1rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                    <div className="text-sm font-semibold" style={{ marginBottom: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                      <LocationIcon size={16} /> Lini Masa Pelacakan Pesanan
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
              ×
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
                <span className="text-muted">Supplier Koperasi</span>
                <span className="font-semibold text-primary">{receiptOrder.supplier}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Status Pembayaran</span>
                <span style={{ color: "#10B981", fontWeight: "bold" }}>Berhasil (Terverifikasi)</span>
              </div>
            </div>

            <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem", marginBottom: "1rem" }}>
              <div className="font-semibold text-xs text-muted" style={{ marginBottom: "0.5rem", textTransform: "uppercase" }}>Rincian Barang</div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {receiptOrder.items?.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>{item.name} (x{item.qty})</span>
                    <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", marginBottom: "2rem" }}>
              <strong>Total Pembayaran</strong>
              <strong style={{ color: "var(--color-primary)" }}>Rp {receiptOrder.total.toLocaleString("id-ID")}</strong>
            </div>

            <div style={{ textAlign: "center", color: "var(--color-text-subtle)", fontSize: "0.75rem", lineHeight: 1.4 }}>
              <div>Terima kasih atas kontribusi Anda mendukung petani lokal.</div>
              <div style={{ marginTop: "0.25rem", fontFamily: "monospace", letterSpacing: "1px" }}>PN-TXN-{receiptOrder.id.replace("ORD-", "")}</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
