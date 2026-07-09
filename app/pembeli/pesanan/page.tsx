"use client";
import { useState, useEffect } from "react";
import AppLayout from "@/components/AppLayout";
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

export default function PesananPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState("Semua");
  const [expanded, setExpanded] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  const filtered =
    activeTab === "Semua"
      ? orders
      : orders.filter((o) => o.status === activeTab);

  return (
    <AppLayout>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <PackageIcon size={28} className="text-primary" /> Pesanan Saya
      </h1>
      <p className="page-subtitle">Lacak dan kelola semua transaksi Anda dengan transparansi penuh</p>

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
          {filtered.map((order) => (
            <div key={order.id} className="card" id={`order-${order.id}`}>
              {/* Order Header */}
              <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "0.625rem" }}>
                    <span className="font-semibold text-sm">{order.id}</span>
                    <span className={`badge ${statusColor[order.status] || "badge-gray"}`}>{order.status}</span>
                  </div>
                  <div className="text-xs text-muted" style={{ marginTop: "0.25rem" }}>
                    {order.date} · {order.supplier}
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="font-bold text-primary">Rp {order.total.toLocaleString("id-ID")}</div>
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
              <div style={{ display: "flex", gap: "0.625rem", marginBottom: order.timeline?.length > 0 ? "0.875rem" : 0 }}>
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
                {order.timeline?.length > 0 && (
                  <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} onClick={() => setExpanded(expanded === order.id ? null : order.id)} id={`btn-track-${order.id}`}>
                    <LocationIcon size={14} /> {expanded === order.id ? "Sembunyikan" : "Lacak"} Pengiriman
                  </button>
                )}
              </div>

              {/* Timeline */}
              {expanded === order.id && order.timeline?.length > 0 && (
                <div style={{ padding: "1rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                  <div className="text-sm font-semibold" style={{ marginBottom: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                    <LocationIcon size={16} /> Live Tracking
                  </div>
                  <div className="timeline">
                    {order.timeline.map((step: any, idx: number) => (
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
          ))}

          {filtered.length === 0 && (
            <div className="card" style={{ textAlign: "center", padding: "3rem", color: "var(--color-text-subtle)" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem", color: "var(--color-border)" }}>
                <PackageIcon size={48} className="mx-auto" />
              </div>
              <div className="font-medium">Tidak ada pesanan dalam kategori ini</div>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}

