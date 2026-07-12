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

function TrashIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function CartIcon({ size = 16, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
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

function TruckIcon({ size = 24, className = "", ...props }: any) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className} {...props}>
      <rect x="1" y="3" width="15" height="13" rx="2" ry="2" />
      <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
      <circle cx="5.5" cy="18.5" r="2.5" />
      <circle cx="18.5" cy="18.5" r="2.5" />
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

const productStoreMap: Record<number, string> = {
  1: "Koperasi Tani Maju",
  2: "Koperasi Gayo Indah",
  3: "Koperasi Brebes Jaya",
  4: "Koperasi Sulawesi Makmur",
  5: "Koperasi Brebes Jaya",
  6: "Koperasi Sulawesi Makmur",
  7: "Koperasi Sulawesi Makmur",
  8: "Koperasi Madu Borneo"
};



interface CartViewProps {
  onCartUpdated: () => void;
  onNavigateToOrders: () => void;
  onUpdateCartCount?: (count: number) => void;
}

const getProductWeight = (productId: number): number => {
  const weightMap: Record<number, number> = {
    1: 1.0,
    2: 0.5,
    3: 1.0,
    4: 0.5,
    5: 0.25,
    6: 0.25,
    7: 0.5,
    8: 0.5
  };
  return weightMap[productId] || 1.0;
};

export default function CartView({ onCartUpdated, onNavigateToOrders, onUpdateCartCount }: CartViewProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [step, setStep] = useState<"cart" | "payment" | "success">("cart");
  const [selectedPayment, setSelectedPayment] = useState<"qris" | "bank" | "cod">("qris");
  const [submitting, setSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string>("");

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setCartItems(parsed);
        onUpdateCartCount?.(parsed.length);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const updateQty = (id: number, newQty: number) => {
    if (newQty < 1) return;
    const updated = cartItems.map((item) => {
      if (item.id === id) {
        return { ...item, qty: newQty };
      }
      return item;
    });
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    onCartUpdated();
    onUpdateCartCount?.(updated.length);
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    onCartUpdated();
    onUpdateCartCount?.(updated.length);
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);
  const shippingFee = subtotal > 0 ? 10000 : 0;
  const discount = 0;
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);
  const totalWeight = cartItems.reduce((sum, item) => sum + (getProductWeight(item.product?.id) * item.qty), 0);

  // Group items by supplier for multi-supplier orders
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    setStep("payment");
  };

  const handleCheckoutPayment = async () => {
    setSubmitting(true);
    try {
      // Group items by supplier so we create separate orders per supplier store
      const grouped: Record<string, any[]> = {};
      cartItems.forEach((item) => {
        const storeName = productStoreMap[item.product.id] || "Koperasi Pelosok Pilihan";
        if (!grouped[storeName]) {
          grouped[storeName] = [];
        }
        grouped[storeName].push({
          icon_type: item.product.icon_type,
          name: item.product.name,
          qty: item.qty,
          price: item.product.price
        });
      });

      const orderPromises = Object.entries(grouped).map(async ([supplier, items]) => {
        const supplierTotal = items.reduce((sum, it) => sum + it.price * it.qty, 0);
        // Distribute discount and shipping proportionally (simplification)
        const isCOD = selectedPayment === "cod";
        const res = await fetch("/api/orders", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            supplier,
            items,
            total: supplierTotal,
            payment_method: selectedPayment.toUpperCase(),
            status: isCOD ? "Diproses" : "Belum Dibayar",
            proof_uploaded: !isCOD,
            proof_filename: isCOD ? null : paymentProof
          })
        });
        return res.json();
      });

      await Promise.all(orderPromises);
      
      // Store summary for success page
      setOrderSummary({
        itemsCount: cartItems.reduce((sum, item) => sum + item.qty, 0),
        subtotal,
        discount,
        grandTotal,
        paymentMethod: selectedPayment === "qris" ? "QRIS (Pembayaran Instan)" : selectedPayment === "bank" ? "Transfer Bank" : "Cash on Delivery (COD)",
        supplierCount: Object.keys(grouped).length,
        totalWeight,
        items: cartItems.map(item => ({
          name: item.product?.name,
          qty: item.qty,
          price: item.product?.price,
          weight: getProductWeight(item.product?.id) * item.qty,
          icon_type: item.product?.icon_type
        }))
      });

      // Clear Cart
      localStorage.removeItem("cartItems");
      setCartItems([]);
      onCartUpdated();
      setStep("success");
    } catch (e) {
      console.error(e);
      alert("Terjadi kesalahan saat memproses pesanan. Silakan coba lagi.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success" && orderSummary) {
    return (
      <div style={{ maxWidth: "600px", margin: "3rem auto", textAlign: "center" }}>
        <div style={{ width: "80px", height: "80px", background: "rgba(16, 185, 129, 0.1)", color: "#10B981", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1.5rem auto" }}>
          <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h1 style={{ fontSize: "2rem", fontWeight: 800, color: "var(--color-primary)", marginBottom: "0.5rem" }}>
          Pesanan Selesai Dibuat! 🎉
        </h1>
        <p style={{ color: "var(--color-text-subtle)", marginBottom: "2rem", lineHeight: 1.5 }}>
          Terima kasih atas kontribusi Anda memajukan Koperasi Tani & Kelompok Usaha Pedesaan di Indonesia melalui PasarNusa.
        </p>



        <div className="card" style={{ textAlign: "left", padding: "1.5rem", marginBottom: "2rem" }}>
          <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "0.5rem" }}>
            Detail Transaksi
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-subtle)" }}>Jumlah Barang</span>
              <strong>{orderSummary.itemsCount} Unit</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-subtle)" }}>Total Berat</span>
              <strong>{orderSummary.totalWeight.toFixed(2).replace(".", ",")} kg</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-subtle)" }}>Total Toko Koperasi</span>
              <strong>{orderSummary.supplierCount} Koperasi</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-subtle)" }}>Metode Pembayaran</span>
              <span className="badge badge-info">{orderSummary.paymentMethod}</span>
            </div>
            
            <div style={{ borderTop: "1px dashed var(--color-border)", borderBottom: "1px dashed var(--color-border)", padding: "0.75rem 0", margin: "0.25rem 0" }}>
              <span className="text-xs text-muted font-bold" style={{ display: "block", marginBottom: "0.5rem", textTransform: "uppercase" }}>Daftar Barang</span>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {orderSummary.items?.map((item: any, idx: number) => (
                  <div key={idx} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--color-text)" }}>{item.name} <span className="text-muted">x{item.qty} ({item.weight.toFixed(2).replace(".", ",")} kg)</span></span>
                    <span className="font-semibold" style={{ color: "var(--color-text)" }}>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", paddingTop: "0.25rem", fontSize: "1.05rem" }}>
              <strong>Total Pembayaran</strong>
              <strong style={{ color: "var(--color-primary)" }}>Rp {orderSummary.grandTotal.toLocaleString("id-ID")}</strong>
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-secondary" onClick={() => setShowReceipt(true)} style={{ padding: "0.75rem 1.5rem", display: "inline-flex", alignItems: "center", gap: "0.5rem" }}>
            🧾 Bukti Pembayaran
          </button>
          <button className="btn-primary" onClick={onNavigateToOrders} style={{ padding: "0.75rem 1.5rem" }}>
            Lacak Pesanan Saya
          </button>
          <button className="btn-ghost" onClick={() => setStep("cart")} style={{ padding: "0.75rem 1.5rem" }}>
            Kembali Berbelanja
          </button>
        </div>

        {showReceipt && (
          <div className="modal-overlay">
            <div className="card modal-container" style={{ maxWidth: "500px", padding: "2rem", position: "relative" }}>
              <button 
                onClick={() => setShowReceipt(false)}
                className="modal-close-btn"
                style={{ position: "absolute", top: "1rem", right: "1rem" }}
              >
                &times;
              </button>
              
              <div className="receipt-header">
                <div className="receipt-logo">PASARNUSA</div>
                <div className="receipt-slogan">Desa Mandiri, Ekonomi Berdikari</div>
                <div className="receipt-stamp">LUNAS / PAID</div>
              </div>
              
              <div className="receipt-meta-grid">
                <div className="receipt-meta-row">
                  <span className="receipt-meta-label">Tanggal Transaksi</span>
                  <span className="receipt-meta-val">{new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div className="receipt-meta-row">
                  <span className="receipt-meta-label">Metode Pembayaran</span>
                  <span className="receipt-meta-val">{orderSummary.paymentMethod}</span>
                </div>
                <div className="receipt-meta-row">
                  <span className="receipt-meta-label">Status Pembayaran</span>
                  <span style={{ color: "#10B981", fontWeight: "bold" }}>Berhasil (Terverifikasi)</span>
                </div>
              </div>

              <div className="receipt-section">
                <div className="receipt-section-title">Rincian Barang</div>
                <div className="receipt-items-list">
                  {orderSummary.items?.map((item: any, idx: number) => (
                    <div key={idx} className="receipt-item-row">
                      <span>{item.name} <span className="text-muted">x{item.qty} ({item.weight.toFixed(2).replace(".", ",")} kg)</span></span>
                      <span>Rp {(item.price * item.qty).toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="receipt-section">
                <div className="receipt-section-title">Rincian Belanja</div>
                <div className="receipt-items-list">
                  <div className="receipt-total-row">
                    <span>Total Belanja ({orderSummary.itemsCount} barang)</span>
                    <span>Rp {orderSummary.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div className="receipt-total-row">
                    <span>Total Berat</span>
                    <span>{orderSummary.totalWeight.toFixed(2).replace(".", ",")} kg</span>
                  </div>
                  <div className="receipt-total-row">
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
                  </div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "1.15rem", marginBottom: "2rem" }}>
                <strong>Total Pembayaran</strong>
                <strong style={{ color: "var(--color-primary)" }}>Rp {orderSummary.grandTotal.toLocaleString("id-ID")}</strong>
              </div>

              <div style={{ textAlign: "center", color: "var(--color-text-subtle)", fontSize: "0.75rem", lineHeight: 1.4 }}>
                <div>Terima kasih atas pembayaran Anda.</div>
                <div style={{ marginTop: "0.25rem", fontFamily: "monospace", letterSpacing: "1px" }}>PN-TXN-{Date.now().toString().slice(-8)}</div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  if (step === "payment") {
    return (
      <div style={{ maxWidth: "800px", margin: "1.5rem auto" }}>
        <div style={{ marginBottom: "1.5rem" }}>
          <button className="btn-ghost" onClick={() => setStep("cart")} style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}>
            ← Kembali ke Keranjang
          </button>
        </div>

        <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "1.5rem" }}>
          Pilih Metode Pembayaran
        </h1>

        <div className="grid-3" style={{ marginBottom: "2rem" }}>
          {/* QRIS Card */}
          <div 
            onClick={() => setSelectedPayment("qris")}
            className="card card-hover" 
            style={{ 
              cursor: "pointer", 
              border: selectedPayment === "qris" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: selectedPayment === "qris" ? "var(--color-primary-light)" : "white"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedPayment === "qris" ? "var(--color-primary)" : "var(--color-border)" }} />
              <strong style={{ fontSize: "1.1rem" }}>QRIS</strong>
            </div>
            <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>
              Scan instan menggunakan Gopay, OVO, Dana, LinkAja, atau Mobile Banking Anda.
            </p>
          </div>

          {/* Bank Transfer Card */}
          <div 
            onClick={() => setSelectedPayment("bank")}
            className="card card-hover" 
            style={{ 
              cursor: "pointer", 
              border: selectedPayment === "bank" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: selectedPayment === "bank" ? "var(--color-primary-light)" : "white"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedPayment === "bank" ? "var(--color-primary)" : "var(--color-border)" }} />
              <strong style={{ fontSize: "1.1rem" }}>Transfer Bank</strong>
            </div>
            <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>
              Transfer manual atau Virtual Account ke Bank Mandiri, BRI, BNI, atau BCA.
            </p>
          </div>

          {/* COD Card */}
          <div 
            onClick={() => setSelectedPayment("cod")}
            className="card card-hover" 
            style={{ 
              cursor: "pointer", 
              border: selectedPayment === "cod" ? "2px solid var(--color-primary)" : "1px solid var(--color-border)",
              background: selectedPayment === "cod" ? "var(--color-primary-light)" : "white"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.5rem" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: selectedPayment === "cod" ? "var(--color-primary)" : "var(--color-border)" }} />
              <strong style={{ fontSize: "1.1rem" }}>Cash on Delivery</strong>
            </div>
            <p className="text-xs text-muted" style={{ lineHeight: 1.4 }}>
              Bayar tunai secara aman kepada kurir ketika kiriman pesanan sampai di tujuan Anda.
            </p>
          </div>
        </div>

        <div className="grid-3" style={{ gap: "2rem", alignItems: "start" }}>
          {/* Payment Detail Details (Left side) */}
          <div className="card" style={{ gridColumn: "span 2", padding: "1.5rem" }}>
            {selectedPayment === "qris" && (
              <div style={{ textAlign: "center" }}>
                <h3 style={{ margin: "0 0 0.5rem 0" }}>Pembayaran via QRIS</h3>
                <p className="text-xs text-muted" style={{ marginBottom: "1.5rem" }}>Pindai kode QRIS di bawah ini untuk membayar instan</p>
                <div style={{ margin: "0 auto 1.5rem auto", width: "180px", height: "180px", border: "1px solid var(--color-border)", padding: "8px", background: "white", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                  {/* Mock QR Code representation */}
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "4px", width: "100%", height: "100%" }}>
                    {Array.from({ length: 16 }).map((_, idx) => (
                      <div 
                        key={idx} 
                        style={{ 
                          background: (idx % 2 === 0 && idx % 3 !== 0) || idx === 0 || idx === 3 || idx === 12 || idx === 15 ? "#000000" : "#ffffff",
                          border: idx === 0 || idx === 3 || idx === 12 || idx === 15 ? "2px solid #000000" : "none" 
                        }} 
                      />
                    ))}
                  </div>
                </div>
                <div className="badge badge-warning" style={{ fontWeight: 600 }}>PasarNusa Merchant ID: PN90218</div>
              </div>
            )}

            {selectedPayment === "bank" && (
              <div>
                <h3 style={{ margin: "0 0 1rem 0" }}>Transfer Bank (Virtual Account)</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span className="font-semibold" style={{ fontSize: "0.95rem" }}>Bank Mandiri</span>
                      <span className="text-xs text-muted">Dicek Otomatis</span>
                    </div>
                    <code style={{ fontSize: "1.1rem", background: "var(--color-border-light)", padding: "2px 6px", borderRadius: "4px" }}>88012 345678901</code>
                  </div>
                  <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span className="font-semibold" style={{ fontSize: "0.95rem" }}>Bank Rakyat Indonesia (BRI)</span>
                      <span className="text-xs text-muted">Dicek Otomatis</span>
                    </div>
                    <code style={{ fontSize: "1.1rem", background: "var(--color-border-light)", padding: "2px 6px", borderRadius: "4px" }}>99201 098765432</code>
                  </div>
                  <div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.25rem" }}>
                      <span className="font-semibold" style={{ fontSize: "0.95rem" }}>Bank Central Asia (BCA)</span>
                      <span className="text-xs text-muted">Dicek Otomatis</span>
                    </div>
                    <code style={{ fontSize: "1.1rem", background: "var(--color-border-light)", padding: "2px 6px", borderRadius: "4px" }}>77209 112233445</code>
                  </div>
                </div>
              </div>
            )}

            {selectedPayment === "cod" && (
              <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
                <div style={{ fontSize: "2.5rem" }}>📦</div>
                <div>
                  <h3 style={{ margin: "0 0 0.25rem 0" }}>Cash on Delivery (COD)</h3>
                  <p style={{ margin: 0, fontSize: "0.85rem", lineHeight: 1.4, color: "var(--color-text-subtle)" }}>
                    Anda akan membayar secara tunai langsung ke kurir logistik desa saat pesanan sampai di alamat pengiriman Anda. Pastikan menyiapkan uang pas sejumlah total tagihan.
                  </p>
                </div>
              </div>
            )}

            {/* Upload Bukti Pembayaran */}
            {(selectedPayment === "qris" || selectedPayment === "bank") && (
              <div style={{ marginTop: "2rem", paddingTop: "1.5rem", borderTop: "1px dashed var(--color-border)" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", fontSize: "0.95rem", fontWeight: 700 }}>Unggah Bukti Pembayaran</h4>
                <p className="text-xs text-muted" style={{ marginBottom: "1rem" }}>
                  Harap unggah tangkapan layar (screenshot) atau foto bukti transfer/transaksi Anda untuk divalidasi oleh admin.
                </p>
                <div className={`upload-zone${paymentProof ? " success" : ""}`}>
                  {paymentProof ? (
                    <div>
                      <div className="upload-icon">📄</div>
                      <div className="upload-success-title">
                        Bukti Pembayaran Terunggah!
                      </div>
                      <div className="upload-filename">
                        {paymentProof}
                      </div>
                      <button 
                        onClick={() => setPaymentProof("")}
                        className="btn-ghost"
                        style={{ padding: "0.25rem 0.75rem", fontSize: "0.75rem", color: "var(--color-alert)" }}
                      >
                        Ganti File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="upload-icon">📤</div>
                      <label className="upload-btn-secondary">
                        Pilih File Gambar
                        <input 
                          type="file" 
                          id="payment-proof-upload"
                          accept="image/*" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              setPaymentProof(e.target.files[0].name);
                            }
                          }}
                          style={{ display: "none" }}
                        />
                      </label>
                      <div className="text-xs text-muted">Mendukung format JPG, PNG, atau WEBP. Maks 5MB.</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Checkout billing column (Right side) */}
          <div className="card" style={{ padding: "1.25rem" }}>
            <h3 style={{ margin: "0 0 1rem 0", fontSize: "1.1rem" }}>Rangkuman Pembayaran</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Total Belanja</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Total Berat</span>
                <span>{totalWeight.toFixed(2).replace(".", ",")} kg</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Ongkos Kirim</span>
                <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", fontSize: "1rem" }}>
                <strong>Total Pembayaran</strong>
                <strong style={{ color: "var(--color-primary)" }}>Rp {grandTotal.toLocaleString("id-ID")}</strong>
              </div>

              <button 
                className="btn-primary" 
                onClick={handleCheckoutPayment}
                disabled={submitting || ((selectedPayment === "qris" || selectedPayment === "bank") && !paymentProof)}
                style={{ 
                  width: "100%", 
                  padding: "0.75rem", 
                  marginTop: "1rem", 
                  display: "flex", 
                  alignItems: "center", 
                  justifyContent: "center", 
                  gap: "0.5rem",
                  opacity: (submitting || ((selectedPayment === "qris" || selectedPayment === "bank") && !paymentProof)) ? 0.6 : 1,
                  cursor: (submitting || ((selectedPayment === "qris" || selectedPayment === "bank") && !paymentProof)) ? "not-allowed" : "pointer"
                }}
              >
                {submitting ? "Memproses Transaksi..." : "Selesaikan Pemesanan"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <h1 className="page-title" style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <CartIcon size={28} className="text-primary" /> Keranjang Belanja Saya
      </h1>
      <p className="page-subtitle">Kelola komoditas pilihan koperasi pelosok sebelum melakukan pembayaran</p>

      {cartItems.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "4rem 2rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🛒</div>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem" }}>Keranjang belanja Anda kosong</h2>
          <p style={{ color: "var(--color-text-subtle)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Jelajahi hasil tani segar dari toko koperasi tani kami sekarang juga.</p>
          <button className="btn-primary" onClick={onNavigateToOrders} style={{ padding: "0.5rem 1.25rem" }}>Mulai Belanja</button>
        </div>
      ) : (
        <div className="cart-layout">
          
          {/* Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cartItems.map((item) => {
              const p = item.product;
              const storeName = productStoreMap[p.id] || "Koperasi Pelosok Pilihan";
              return (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-info" style={{ display: "flex", gap: "1rem", flex: 1, alignItems: "center" }}>
                    <div style={{ width: 80, height: 80, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)", flexShrink: 0 }}>
                      <IconRenderer type={p.icon_type} size={36} className="text-amber-600" />
                    </div>
                    
                    <div style={{ flex: 1 }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", marginBottom: "0.25rem" }}>
                        <span className="badge badge-info" style={{ fontSize: "0.65rem" }}>Toko Koperasi</span>
                        <span className="text-xs text-primary font-bold">{storeName}</span>
                      </div>
                      <div className="font-semibold" style={{ fontSize: "0.95rem" }}>{p.name}</div>
                      <div className="text-xs text-muted" style={{ display: "flex", alignItems: "center", gap: "0.15rem", marginTop: "0.15rem" }}>
                        <LocationIcon size={12} /> {p.origin}
                      </div>
                    </div>
                  </div>

                  <div className="cart-item-actions" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem" }}>
                    {/* Quantity Controls */}
                    <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", border: "1px solid var(--color-border)", borderRadius: "4px", padding: "2px" }}>
                      <button 
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 8px", fontWeight: "bold" }}
                      >
                        -
                      </button>
                      <span style={{ minWidth: "20px", textAlign: "center", fontSize: "0.9rem" }}>{item.qty}</span>
                      <button 
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        style={{ border: "none", background: "transparent", cursor: "pointer", padding: "4px 8px", fontWeight: "bold" }}
                      >
                        +
                      </button>
                    </div>

                    <div style={{ textAlign: "right", minWidth: "100px" }}>
                      <div className="text-xs text-muted">Rp {p.price.toLocaleString("id-ID")}</div>
                      <div className="font-bold text-primary" style={{ fontSize: "1rem" }}>
                        Rp {(p.price * item.qty).toLocaleString("id-ID")}
                      </div>
                    </div>

                    <button 
                      onClick={() => removeItem(item.id)}
                      className="icon-btn" 
                      title="Hapus dari keranjang"
                      style={{ color: "var(--color-alert)", background: "rgba(239, 68, 68, 0.05)", flexShrink: 0 }}
                    >
                      <TrashIcon size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "0.5rem" }}>
              Ringkasan Belanja
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Total Harga ({cartItems.reduce((sum, item) => sum + item.qty, 0)} barang)</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Total Berat</span>
                <span>{totalWeight.toFixed(2).replace(".", ",")} kg</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Estimasi Ongkos Kirim</span>
                <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
              </div>
              
              <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid var(--color-border-light)", paddingTop: "0.75rem", fontSize: "1rem" }}>
                <strong>Total Pembayaran</strong>
                <strong style={{ color: "var(--color-primary)" }}>Rp {grandTotal.toLocaleString("id-ID")}</strong>
              </div>
            </div>

            <button 
              className="btn-primary" 
              onClick={handleConfirmOrder}
              style={{ width: "100%", padding: "0.6rem 1rem", marginTop: "0.5rem", fontSize: "0.9rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "0.5rem" }}
            >
              <TruckIcon size={16} /> Konfirmasi Pemesanan
            </button>
          </div>

        </div>
      )}
    </>
  );
}
