"use client";
import { useState, useEffect } from "react";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  PackageIcon, StarIcon, LocationIcon
} from "@/components/ProductIcons";

const tabs = ["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

const statusColor: Record<string, string> = {
  "Belum Dibayar": "badge-warning",
  Diproses: "badge-info",
  Dikirim: "badge-info",
  Selesai: "badge-success",
  Dibatalkan: "badge-danger",
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
    // Return custom timeline based on order status to match requirements:
    // dikemas oleh toko -> dikirim kurir -> sampai tujuan
    const dateStr = order.date || "Hari ini";
    switch (order.status) {
      case "Belum Dibayar":
        if (order.proof_uploaded) {
          return [
            { label: "Pesanan Dibuat", time: dateStr, done: true, active: false },
            { label: "Bukti Pembayaran Diunggah", time: "Menunggu konfirmasi admin toko", done: true, active: false },
            { label: "Verifikasi Pembayaran", time: "Sedang diproses oleh admin", done: false, active: true },
            { label: "Dikemas oleh Toko", time: "-", done: false, active: false },
            { label: "Dikirim Kurir", time: "-", done: false, active: false },
            { label: "Sampai Tujuan", time: "-", done: false, active: false }
          ];
        }
        return [
          { label: "Pesanan Dibuat", time: dateStr, done: true, active: false },
          { label: "Menunggu Pembayaran", time: "Segera lakukan pembayaran", done: false, active: true },
          { label: "Dikemas oleh Toko", time: "-", done: false, active: false },
          { label: "Dikirim Kurir", time: "-", done: false, active: false },
          { label: "Sampai Tujuan", time: "-", done: false, active: false }
        ];
      case "Diproses":
        return [
          { label: "Pesanan Dibuat & Dibayar", time: dateStr, done: true, active: false },
          { label: "Dikemas oleh Toko", time: "Sedang dikemas oleh produsen pelosok", done: false, active: true },
          { label: "Dikirim Kurir", time: "-", done: false, active: false },
          { label: "Sampai Tujuan", time: "-", done: false, active: false }
        ];
      case "Dikirim":
        return [
          { label: "Pesanan Dibuat & Dibayar", time: dateStr, done: true, active: false },
          { label: "Dikemas oleh Toko", time: "Selesai dikemas", done: true, active: false },
          { label: "Dikirim Kurir", time: "Dalam perjalanan oleh kurir", done: false, active: true },
          { label: "Sampai Tujuan", time: "Estimasi tiba segera", done: false, active: false }
        ];
      case "Selesai":
        return [
          { label: "Pesanan Dibuat & Dibayar", time: dateStr, done: true, active: false },
          { label: "Dikemas oleh Toko", time: "Selesai dikemas", done: true, active: false },
          { label: "Dikirim Kurir", time: "Selesai dikirim", done: true, active: false },
          { label: "Sampai Tujuan", time: "Barang diterima dengan baik", done: true, active: true }
        ];
      case "Dibatalkan":
        return [
          { label: "Pesanan Dibuat", time: dateStr, done: true, active: false },
          { label: "Pesanan Dibatalkan", time: "Dibatalkan oleh sistem/pembeli", done: true, active: true }
        ];
      default:
        return [];
    }
  };

  const filtered =
    activeTab === "Semua"
      ? orders
      : orders.filter((o) => o.status === activeTab);

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
                      <span className={`badge ${order.proof_uploaded ? "badge-info" : (statusColor[order.status] || "badge-gray")}`}>
                        {order.proof_uploaded ? "Menunggu Konfirmasi" : order.status}
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
                <div style={{ display: "flex", gap: "0.625rem", marginBottom: timeline.length > 0 ? "0.875rem" : 0 }}>
                  {order.status === "Belum Dibayar" && (
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
                  {order.status !== "Belum Dibayar" && order.status !== "Dibatalkan" && (
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
