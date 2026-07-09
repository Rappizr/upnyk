"use client";
import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { 
  RiceIcon, CoffeeIcon, HoneyIcon, PackageIcon, StarIcon, LocationIcon
} from "@/components/ProductIcons";

const tabs = ["Semua", "Belum Dibayar", "Diproses", "Dikirim", "Selesai", "Dibatalkan"];

const orders = [
  {
    id: "ORD-20250701-001",
    status: "Dikirim",
    date: "01 Jul 2025",
    supplier: "Koperasi Tani Maju",
    items: [{ icon: <RiceIcon size={24} className="text-amber-600" />, name: "Beras Merah Organik 5kg", qty: 2, price: 140000 }],
    total: 280000,
    timeline: [
      { label: "Pesanan Dibuat", time: "01 Jul, 08:12", done: true },
      { label: "Pembayaran Dikonfirmasi", time: "01 Jul, 08:35", done: true },
      { label: "Diproses Supplier", time: "01 Jul, 10:00", done: true },
      { label: "Dikirim Ekspedisi", time: "02 Jul, 09:15", done: true },
      { label: "Di Kurir Lokal", time: "03 Jul, 07:30", done: false, active: true },
      { label: "Tiba di Tujuan", time: "Estimasi 03 Jul", done: false },
    ],
  },
  {
    id: "ORD-20250625-002",
    status: "Selesai",
    date: "25 Jun 2025",
    supplier: "UMKM Rempah Nusantara",
    items: [{ icon: <CoffeeIcon size={24} className="text-amber-800" />, name: "Kopi Arabika Gayo 250g", qty: 3, price: 95000 }],
    total: 285000,
    timeline: [],
  },
  {
    id: "ORD-20250620-003",
    status: "Belum Dibayar",
    date: "20 Jun 2025",
    supplier: "Agro Organik Sentosa",
    items: [{ icon: <HoneyIcon size={24} className="text-amber-500" fill="currentColor" />, name: "Madu Hutan 500g", qty: 1, price: 135000 }],
    total: 135000,
    timeline: [],
  },
];

const statusColor: Record<string, string> = {
  "Belum Dibayar": "badge-warning",
  Diproses: "badge-info",
  Dikirim: "badge-info",
  Selesai: "badge-success",
  Dibatalkan: "badge-danger",
};

export default function PesananPage() {
  const [activeTab, setActiveTab] = useState("Semua");
  const [expanded, setExpanded] = useState<string | null>("ORD-20250701-001");

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

      {/* Orders List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
        {filtered.map((order) => (
          <div key={order.id} className="card" id={`order-${order.id}`}>
            {/* Order Header */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyBetween: "space-between", marginBottom: "0.875rem" }}>
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
                <div className="text-xs text-muted">{order.items.length} item</div>
              </div>
            </div>

            {/* Items */}
            {order.items.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "0.875rem", padding: "0.625rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)", marginBottom: "0.75rem" }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "40px", height: "40px", background: "white", borderRadius: "var(--radius-sm)", border: "1px solid var(--color-border)" }}>
                  {item.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div className="text-sm font-medium">{item.name}</div>
                  <div className="text-xs text-muted">x{item.qty}</div>
                </div>
                <div className="font-semibold text-sm">Rp {item.price.toLocaleString("id-ID")}</div>
              </div>
            ))}

            {/* Actions */}
            <div style={{ display: "flex", gap: "0.625rem", marginBottom: order.timeline.length > 0 ? "0.875rem" : 0 }}>
              {order.status === "Belum Dibayar" && (
                <button className="btn-primary" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} id={`btn-bayar-${order.id}`}>
                  Bayar Sekarang
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
              {order.timeline.length > 0 && (
                <button className="btn-ghost" style={{ fontSize: "0.8rem", padding: "0.4rem 0.875rem", marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: "0.35rem" }} onClick={() => setExpanded(expanded === order.id ? null : order.id)} id={`btn-track-${order.id}`}>
                  <LocationIcon size={14} /> {expanded === order.id ? "Sembunyikan" : "Lacak"} Pengiriman
                </button>
              )}
            </div>

            {/* Timeline */}
            {expanded === order.id && order.timeline.length > 0 && (
              <div style={{ padding: "1rem", background: "var(--color-bg)", borderRadius: "var(--radius-sm)" }}>
                <div className="text-sm font-semibold" style={{ marginBottom: "0.875rem", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
                  <LocationIcon size={16} /> Live Tracking
                </div>
                <div className="timeline">
                  {order.timeline.map((step, idx) => (
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
    </AppLayout>
  );
}
