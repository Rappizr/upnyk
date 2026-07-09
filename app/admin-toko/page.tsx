"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  CartIcon, DollarIcon, StarIcon, PackageIcon
} from "@/components/ProductIcons";

export default function AdminTokoDashboard() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  // New product fields
  const [prodName, setProdName] = useState("");
  const [prodPrice, setProdPrice] = useState("");
  const [prodOrigin, setProdOrigin] = useState("");
  const [prodCategory, setProdCategory] = useState("Pangan");
  const [prodIcon, setProdIcon] = useState("rice");

  async function loadOrders() {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOrders();
  }, []);

  const handleProcessOrder = async (orderId: string, currentStatus: string) => {
    let nextStatus = "Diproses";
    if (currentStatus === "Belum Dibayar") nextStatus = "Diproses";
    else if (currentStatus === "Diproses") nextStatus = "Dikirim";
    else if (currentStatus === "Dikirim") nextStatus = "Selesai";

    try {
      const res = await fetch("/api/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: orderId, status: nextStatus })
      });
      if (res.ok) {
        await loadOrders();
        alert(`Pesanan ${orderId} diperbarui ke status: ${nextStatus}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodOrigin) return;

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: prodName,
          price: parseInt(prodPrice) || 0,
          origin: prodOrigin,
          category: prodCategory,
          icon_type: prodIcon,
          stock: "Tersedia"
        })
      });
      if (res.ok) {
        alert("Produk baru berhasil ditambahkan dan siap dijual di marketplace!");
        setShowAddModal(false);
        setProdName("");
        setProdPrice("");
        setProdOrigin("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Stats calculation
  const pendingOrders = orders.filter(o => o.status !== "Selesai" && o.status !== "Dibatalkan").length;
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status === "Selesai" || o.status === "Dikirim" || o.status === "Diproses" ? o.total : 0), 0);

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#F8FAFC" }}>
      {/* Sidebar Admin Toko */}
      <aside style={{ width: "240px", background: "#FFFFFF", borderRight: "1px solid #E2E8F0", padding: "1.5rem", display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "2rem" }}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="#F59E0B" />
            <path d="M7 18L10.5 11L14 15L17.5 9L21 18H7Z" fill="white" />
          </svg>
          <span style={{ fontSize: "1.1rem", fontWeight: 800, color: "#F59E0B" }}>Lural<span>Toko</span></span>
        </div>

        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", marginBottom: "0.75rem" }}>Panel Toko B2C</div>
        <nav style={{ display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          <a href="#" className="nav-item active" style={{ color: "#D97706", background: "#FEF3C7", display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <CartIcon size={16} /> Dashboard Toko
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PackageIcon size={16} /> Kelola Produk
          </a>
          <a href="#" className="nav-item" style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
            <PackageIcon size={16} /> Pesanan Pelanggan
          </a>
        </nav>

        <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
          <Link href="/login" className="btn-ghost" style={{ width: "100%", justifyContent: "center", color: "#EF4444", borderColor: "#FEE2E2", display: "inline-flex", alignItems: "center", gap: "0.35rem" }}>
            Keluar
          </Link>
        </div>
      </aside>

      {/* Main Area */}
      <main style={{ flex: 1, padding: "2rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <CartIcon size={28} className="text-amber-500" /> Portal Admin Toko (Citra)
            </h1>
            <p className="page-subtitle">Kelola penjualan, promosi toko, dan konfirmasi pesanan masuk.</p>
          </div>
          <button className="btn-secondary" onClick={() => setShowAddModal(!showAddModal)} style={{ background: "#F59E0B", color: "white" }}>
            {showAddModal ? "Batal" : "+ Tambah Produk Baru"}
          </button>
        </div>

        {/* Add Product Form */}
        {showAddModal && (
          <form onSubmit={handleAddProduct} className="card" style={{ marginBottom: "1.5rem", padding: "1.5rem" }}>
            <h3 className="font-semibold text-base mb-3">Tambah Produk Baru ke Marketplace</h3>
            <div className="grid-3" style={{ gap: "1rem", marginBottom: "1rem" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Nama Produk</label>
                <input className="form-input" value={prodName} onChange={e => setProdName(e.target.value)} placeholder="Misal: Kopi Robusta Dampit" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Harga Jual (Rp)</label>
                <input className="form-input" type="number" value={prodPrice} onChange={e => setProdPrice(e.target.value)} placeholder="45000" required />
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Asal Daerah</label>
                <input className="form-input" value={prodOrigin} onChange={e => setProdOrigin(e.target.value)} placeholder="Malang, Jawa Timur" required />
              </div>
            </div>
            <div className="grid-3" style={{ gap: "1rem", alignItems: "center" }}>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Kategori</label>
                <select className="form-input" value={prodCategory} onChange={e => setProdCategory(e.target.value)}>
                  <option value="Pangan">Pangan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Rempah">Rempah</option>
                  <option value="Organik">Organik</option>
                  <option value="Olahan">Olahan</option>
                </select>
              </div>
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label">Jenis Ikon</label>
                <select className="form-input" value={prodIcon} onChange={e => setProdIcon(e.target.value)}>
                  <option value="rice">Beras/Padi</option>
                  <option value="coffee">Kopi</option>
                  <option value="spice">Bawang/Cabai</option>
                  <option value="oil">Minyak Kelapa</option>
                  <option value="honey">Madu</option>
                </select>
              </div>
              <button type="submit" className="btn-primary" style={{ background: "#F59E0B", color: "white", marginTop: "1.2rem" }}>
                Publikasikan Produk
              </button>
            </div>
          </form>
        )}

        {/* Stats */}
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(3, 1fr)" }}>
          <div className="stat-card" style={{ borderLeft: "4px solid #F59E0B" }}>
            <div className="stat-icon yellow">
              <PackageIcon size={20} />
            </div>
            <div>
              <div className="stat-value">{loading ? "..." : pendingOrders} Pesanan</div>
              <div className="stat-label">Baru Perlu Diproses</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #10B981" }}>
            <div className="stat-icon green">
              <DollarIcon size={20} />
            </div>
            <div>
              <div className="stat-value">Rp {loading ? "..." : totalRevenue.toLocaleString("id-ID")}</div>
              <div className="stat-label">Estimasi Omset Aktif</div>
            </div>
          </div>
          <div className="stat-card" style={{ borderLeft: "4px solid #2563EB" }}>
            <div className="stat-icon blue">
              <StarIcon size={20} fill="currentColor" />
            </div>
            <div>
              <div className="stat-value">4.9 / 5</div>
              <div className="stat-label">Rating Kepuasan Toko</div>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card" style={{ marginTop: "1.5rem" }}>
          <h3 className="font-semibold text-lg mb-4">📦 Pesanan Masuk Terbaru</h3>
          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--color-text-muted)" }}>Memuat pesanan masuk...</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #E2E8F0", paddingBottom: "0.5rem" }}>
                    <th style={{ padding: "0.75rem 0" }}>ID Pesanan</th>
                    <th>Supplier / Toko</th>
                    <th>Jumlah Item</th>
                    <th>Total Harga</th>
                    <th>Status</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "1rem 0", fontWeight: 600 }}>{o.id}</td>
                      <td>{o.supplier}</td>
                      <td>{o.items?.length || 0} item</td>
                      <td style={{ fontWeight: 600, color: "var(--color-primary)" }}>Rp {o.total.toLocaleString("id-ID")}</td>
                      <td>
                        <span className={`badge ${o.status === "Belum Dibayar" ? "badge-warning" : o.status === "Diproses" ? "badge-info" : o.status === "Dikirim" ? "badge-info" : "badge-success"}`}>
                          {o.status}
                        </span>
                      </td>
                      <td>
                        {o.status !== "Selesai" && o.status !== "Dibatalkan" ? (
                          <button 
                            className="btn-primary" 
                            onClick={() => handleProcessOrder(o.id, o.status)}
                            style={{ padding: "0.3rem 0.75rem", fontSize: "0.75rem", background: "var(--color-primary)" }}
                          >
                            {o.status === "Belum Dibayar" ? "Proses" : o.status === "Diproses" ? "Kirim" : "Selesaikan"}
                          </button>
                        ) : (
                          <span style={{ fontSize: "0.8-rem", color: "var(--color-text-muted)" }}>Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

