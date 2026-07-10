"use client";
import { useState, useEffect } from "react";
import { IconRenderer } from "@/components/IconRenderer";
import { 
  TrashIcon, CartIcon, LocationIcon, TruckIcon
} from "@/components/ProductIcons";

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
}

export default function CartView({ onCartUpdated, onNavigateToOrders }: CartViewProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [selectedVoucherCode, setSelectedVoucherCode] = useState<string>("");
  const [step, setStep] = useState<"cart" | "payment" | "success">("cart");
  const [selectedPayment, setSelectedPayment] = useState<"qris" | "bank" | "cod">("qris");
  const [submitting, setSubmitting] = useState(false);
  const [orderSummary, setOrderSummary] = useState<any>(null);
  const [showReceipt, setShowReceipt] = useState(false);
  const [paymentProof, setPaymentProof] = useState<string>("");

  useEffect(() => {
    loadCart();
    loadVouchers();
  }, []);

  const loadCart = () => {
    const saved = localStorage.getItem("cartItems");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  };

  const loadVouchers = () => {
    const saved = localStorage.getItem("claimedVouchers");
    if (saved) {
      try {
        setVouchers(JSON.parse(saved));
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
  };

  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
    localStorage.setItem("cartItems", JSON.stringify(updated));
    onCartUpdated();
  };

  // Calculations
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product?.price || 0) * item.qty, 0);
  const shippingFee = subtotal > 0 ? 10000 : 0;
  
  // Calculate discount based on selected voucher
  let discount = 0;
  if (selectedVoucherCode === "PANENRAYA20") {
    discount = Math.round(subtotal * 0.2);
  } else if (selectedVoucherCode === "ONGKIRPELOSOK") {
    discount = 10000; // Free shipping
  } else if (selectedVoucherCode === "TANIMAJU15") {
    discount = 15000;
  }
  
  const grandTotal = Math.max(0, subtotal + shippingFee - discount);

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
        supplierCount: Object.keys(grouped).length
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
              <span style={{ color: "var(--color-text-subtle)" }}>Total Toko Koperasi</span>
              <strong>{orderSummary.supplierCount} Koperasi</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--color-text-subtle)" }}>Metode Pembayaran</span>
              <span className="badge badge-info">{orderSummary.paymentMethod}</span>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px dashed var(--color-border)", paddingTop: "0.75rem", fontSize: "1.05rem" }}>
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
                onClick={() => setShowReceipt(false)}
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
              
              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem", marginBottom: "1.5rem", textAlign: "left" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-muted">Tanggal Transaksi</span>
                  <span className="font-medium">{new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-muted">Metode Pembayaran</span>
                  <span className="font-semibold">{orderSummary.paymentMethod}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span className="text-muted">Status Pembayaran</span>
                  <span style={{ color: "#10B981", fontWeight: "bold" }}>Berhasil (Terverifikasi)</span>
                </div>
              </div>

              <div style={{ borderBottom: "1px solid var(--color-border-light)", paddingBottom: "1rem", marginBottom: "1rem", textAlign: "left" }}>
                <div className="font-semibold text-xs text-muted" style={{ marginBottom: "0.5rem", textTransform: "uppercase" }}>Rincian Belanja</div>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>Total Belanja ({orderSummary.itemsCount} barang)</span>
                    <span>Rp {orderSummary.subtotal.toLocaleString("id-ID")}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem" }}>
                    <span>Ongkos Kirim</span>
                    <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
                  </div>
                  {orderSummary.discount > 0 && (
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.9rem", color: "var(--color-alert)" }}>
                      <span>Diskon Voucher</span>
                      <span>- Rp {orderSummary.discount.toLocaleString("id-ID")}</span>
                    </div>
                  )}
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
                <div style={{ 
                  border: "2px dashed var(--color-border)", 
                  borderRadius: "8px", 
                  padding: "1.5rem", 
                  textAlign: "center",
                  background: paymentProof ? "rgba(16, 185, 129, 0.03)" : "var(--color-bg)",
                  borderColor: paymentProof ? "#10B981" : "var(--color-border)"
                }}>
                  {paymentProof ? (
                    <div>
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
                      <div className="font-semibold text-sm" style={{ color: "#10B981", marginBottom: "0.25rem" }}>
                        Bukti Pembayaran Terunggah!
                      </div>
                      <div className="text-xs text-muted" style={{ fontFamily: "monospace", marginBottom: "1rem" }}>
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
                      <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📤</div>
                      <label 
                        className="btn-secondary"
                        style={{ 
                          display: "inline-block", 
                          padding: "0.4rem 1rem", 
                          fontSize: "0.8rem", 
                          cursor: "pointer",
                          marginBottom: "0.5rem"
                        }}
                      >
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
                <span className="text-muted">Ongkos Kirim</span>
                <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-alert)" }}>
                  <span>Voucher Diskon</span>
                  <span>- Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}
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
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", alignItems: "start" }}>
          
          {/* Cart Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {cartItems.map((item) => {
              const p = item.product;
              const storeName = productStoreMap[p.id] || "Koperasi Pelosok Pilihan";
              return (
                <div key={item.id} className="wishlist-card" style={{ display: "flex", padding: "0.75rem", gap: "1rem", alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, background: "var(--color-primary-light)", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "var(--radius-sm)" }}>
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

                  <div style={{ textAlign: "right", minWidth: "120px" }}>
                    <div className="text-xs text-muted">Rp {p.price.toLocaleString("id-ID")} / unit</div>
                    <div className="font-bold text-primary" style={{ fontSize: "1rem" }}>
                      Rp {(p.price * item.qty).toLocaleString("id-ID")}
                    </div>
                  </div>

                  <button 
                    onClick={() => removeItem(item.id)}
                    className="icon-btn" 
                    title="Hapus dari keranjang"
                    style={{ color: "var(--color-alert)", background: "rgba(239, 68, 68, 0.05)" }}
                  >
                    <TrashIcon size={16} />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Cart Summary Card */}
          <div className="card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
            <h3 style={{ margin: 0, fontSize: "1.1rem", borderBottom: "1px solid var(--color-border-light)", paddingBottom: "0.5rem" }}>
              Ringkasan Belanja
            </h3>

            {/* Voucher Selection */}
            {vouchers.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                <label className="text-xs text-muted font-bold">Gunakan Voucher Klaim</label>
                <select 
                  className="form-input" 
                  value={selectedVoucherCode} 
                  onChange={(e) => setSelectedVoucherCode(e.target.value)}
                  style={{ padding: "0.4rem 0.5rem", fontSize: "0.8rem" }}
                >
                  <option value="">-- Pilih Voucher --</option>
                  {vouchers.map((v) => (
                    <option key={v.code} value={v.code}>{v.title} ({v.min})</option>
                  ))}
                </select>
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Total Harga ({cartItems.reduce((sum, item) => sum + item.qty, 0)} barang)</span>
                <span>Rp {subtotal.toLocaleString("id-ID")}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span className="text-muted">Estimasi Ongkos Kirim</span>
                <span>Rp {shippingFee.toLocaleString("id-ID")}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: "flex", justifyContent: "space-between", color: "var(--color-alert)" }}>
                  <span>Diskon Voucher</span>
                  <span>- Rp {discount.toLocaleString("id-ID")}</span>
                </div>
              )}
              
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
