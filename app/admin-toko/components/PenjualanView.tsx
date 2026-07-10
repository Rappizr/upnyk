'use client';

import React, { useState, useEffect } from 'react';
import { Eye, CheckCircle2, Clock, X, FileText } from 'lucide-react';

export default function PenjualanPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProof, setSelectedProof] = useState<any | null>(null);

  const loadOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Failed to load orders for admin:", err);
    } finally {
      setLoading(false);
    }
  };

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
        alert(`Status pesanan ${orderId} berhasil diperbarui menjadi ${status}`);
      } else {
        alert("Gagal memperbarui status pesanan");
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan saat memperbarui status");
    }
  };

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      
      {/* TABLE CONTAINER CARD */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden" style={{ backgroundColor: '#ffffff', borderRadius: '1rem', border: '1px solid #E2E8F0', overflow: 'hidden' }}>
        <div className="p-5 border-b border-slate-100 bg-slate-50/50" style={{ padding: '1.25rem', borderBottom: '1px solid #F1F5F9', backgroundColor: '#F8FAFC' }}>
          <h3 className="font-bold text-base text-[#1E293B]" style={{ fontSize: '1rem', fontWeight: 700, color: '#1E293B', margin: 0 }}>Daftar Pesanan & Status Invoice</h3>
        </div>
        
        <div style={{ overflowX: 'auto', width: '100%' }}>
          <table className="w-full text-left border-collapse text-sm" style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse', fontSize: '0.875rem' }}>
            <thead>
              <tr style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #E2E8F0', color: '#94A3B8', fontWeight: 600, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem', paddingLeft: '1.5rem' }}>No. Invoice</th>
                <th style={{ padding: '1rem' }}>Pelanggan</th>
                <th style={{ padding: '1rem' }}>Toko / Supplier</th>
                <th style={{ padding: '1rem' }}>Tanggal Pesan</th>
                <th style={{ padding: '1rem' }}>Total Penjualan</th>
                <th style={{ padding: '1rem' }}>Status Pesanan</th>
                <th style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100" style={{ display: 'table-row-group' }}>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94A3B8', fontWeight: 500 }}>
                    Memuat daftar pesanan...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: '3.5rem 2rem', textAlign: 'center', color: '#94A3B8', fontWeight: 500 }}>
                    Belum ada invoice pesanan yang masuk atau tercatat di sistem saat ini.
                  </td>
                </tr>
              ) : (
                orders.map((order) => {
                  const isWaitingConfirmation = order.status === "Belum Dibayar" && order.proof_uploaded;
                  return (
                    <tr key={order.id} style={{ borderBottom: '1px solid #F1F5F9' }} className="hover:bg-slate-50/50">
                      <td style={{ padding: '1rem', paddingLeft: '1.5rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563EB' }}>{order.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 600, color: '#1E293B' }}>Pembeli Nusa</td>
                      <td style={{ padding: '1rem', color: '#64748B', fontWeight: 500 }}>{order.supplier}</td>
                      <td style={{ padding: '1rem', color: '#64748B' }}>{order.date}</td>
                      <td style={{ padding: '1rem', fontWeight: 700, color: '#1E293B' }}>Rp {order.total.toLocaleString('id-ID')}</td>
                      <td style={{ padding: '1rem' }}>
                        <span 
                          className="inline-flex items-center gap-1 font-semibold"
                          style={{ 
                            padding: '0.25rem 0.5rem', 
                            borderRadius: '0.5rem', 
                            fontSize: '0.75rem',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            backgroundColor: 
                              order.status === 'Selesai' ? '#ECFDF5' : 
                              isWaitingConfirmation ? 'rgba(245, 158, 11, 0.1)' :
                              order.status === 'Belum Dibayar' ? 'rgba(239, 68, 68, 0.1)' : '#EFF6FF',
                            color: 
                              order.status === 'Selesai' ? '#10B981' : 
                              isWaitingConfirmation ? '#D97706' :
                              order.status === 'Belum Dibayar' ? '#DC2626' : '#2563EB',
                            fontWeight: 600
                          }}
                        >
                          {order.status === 'Selesai' ? <CheckCircle2 style={{ width: '0.75rem', height: '0.75rem' }} /> : <Clock style={{ width: '0.75rem', height: '0.75rem' }} />}
                          {isWaitingConfirmation ? "Menunggu Konfirmasi" : order.status || "Belum Dibayar"}
                        </span>
                      </td>
                      <td style={{ padding: '1rem', paddingRight: '1.5rem', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', alignItems: 'center' }}>
                          
                          {/* Bukti Pembayaran button */}
                          {order.proof_uploaded && (
                            <button 
                              type="button"
                              onClick={() => setSelectedProof(order)}
                              title="Lihat Bukti Pembayaran"
                              className="border border-slate-200 hover:bg-slate-50 text-slate-600" 
                              style={{ padding: '0.5rem', borderRadius: '0.75rem', backgroundColor: '#ffffff', border: '1px solid #E2E8F0', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                            >
                              <FileText className="w-4 h-4" style={{ width: '1rem', height: '1rem', color: '#D97706' }} />
                              <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#D97706' }}>Bukti</span>
                            </button>
                          )}

                          {/* Action Buttons based on status */}
                          {isWaitingConfirmation && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateStatus(order.id, "Diproses")}
                              className="bg-[#10B981] hover:bg-emerald-700 text-white font-semibold shadow-sm"
                              style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                              Konfirmasi & Proses
                            </button>
                          )}

                          {order.status === 'Diproses' && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateStatus(order.id, "Dikirim")}
                              className="bg-[#2563EB] hover:bg-blue-700 text-white font-semibold shadow-sm"
                              style={{ backgroundColor: '#2563EB', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                              Kirim Pesanan
                            </button>
                          )}

                          {order.status === 'Dikirim' && (
                            <button 
                              type="button"
                              onClick={() => handleUpdateStatus(order.id, "Selesai")}
                              className="bg-[#10B981] hover:bg-emerald-700 text-white font-semibold shadow-sm"
                              style={{ backgroundColor: '#10B981', color: '#ffffff', padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 600, border: 'none', cursor: 'pointer' }}
                            >
                              Selesaikan
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL BUKTI PEMBAYARAN POPUP */}
      {selectedProof && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 1000, padding: "1rem"
        }}>
          <div className="card shadow-2xl animate-[fadeIn_0.2s_ease-out]" style={{
            maxWidth: "450px", width: "100%", padding: "2rem",
            background: "#ffffff", borderRadius: "1rem",
            position: "relative", border: "1px solid var(--color-border)"
          }}>
            <button 
              onClick={() => setSelectedProof(null)}
              style={{
                position: "absolute", top: "1rem", right: "1rem", border: "none",
                background: "transparent", fontSize: "1.5rem", cursor: "pointer",
                color: "var(--color-text-muted)", display: "flex", alignItems: "center"
              }}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: "center", marginBottom: "1.5rem" }}>
              <div style={{ 
                width: "60px", height: "60px", borderRadius: "50%", 
                background: "rgba(245, 158, 11, 0.1)", color: "#D97706",
                display: "flex", alignItems: "center", justifyContent: "center",
                margin: "0 auto 1rem auto"
              }}>
                <FileText size={32} />
              </div>
              <h3 style={{ margin: 0, fontSize: "1.25rem", fontWeight: 800 }}>Bukti Transfer Pembayaran</h3>
              <p style={{ margin: "0.25rem 0 0 0", fontSize: "0.85rem", color: "var(--color-text-muted)" }}>
                ID Invoice: <strong style={{ fontFamily: "monospace" }}>{selectedProof.id}</strong>
              </p>
            </div>

            <div style={{ 
              background: "var(--color-bg)", borderRadius: "8px", 
              padding: "1rem", marginBottom: "1.5rem", 
              border: "1px solid var(--color-border-light)"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>File Bukti:</span>
                <strong style={{ fontFamily: "monospace" }}>{selectedProof.proof_filename || "bukti_pembayaran.png"}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Metode Pembayaran:</span>
                <strong>{selectedProof.payment_method}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Tanggal Unggah:</span>
                <span>{selectedProof.date}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", paddingTop: "0.5rem", borderTop: "1px dashed var(--color-border)" }}>
                <span style={{ color: "var(--color-text-muted)" }}>Jumlah Transfer:</span>
                <strong style={{ color: "var(--color-primary)" }}>Rp {selectedProof.total.toLocaleString("id-ID")}</strong>
              </div>
            </div>

            {/* Mock Image Representation */}
            <div style={{ 
              border: "1.5px dashed var(--color-border)", borderRadius: "8px", 
              padding: "2rem 1rem", textAlign: "center", background: "#f8fafc",
              marginBottom: "1.5rem"
            }}>
              <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>🖼️</div>
              <div style={{ fontSize: "0.85rem", fontWeight: 600 }}>Tangkapan Layar Bukti Transfer</div>
              <div style={{ fontSize: "0.75rem", color: "var(--color-text-muted)", marginTop: "0.25rem" }}>
                {selectedProof.proof_filename || "bukti_pembayaran.png"} (Simulated Image)
              </div>
            </div>

            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button 
                onClick={() => setSelectedProof(null)}
                className="btn-secondary"
                style={{ flex: 1, padding: "0.625rem", fontSize: "0.875rem" }}
              >
                Tutup
              </button>
              {selectedProof.status === "Belum Dibayar" && (
                <button 
                  onClick={() => {
                    handleUpdateStatus(selectedProof.id, "Diproses");
                    setSelectedProof(null);
                  }}
                  className="btn-primary"
                  style={{ flex: 1, padding: "0.625rem", fontSize: "0.875rem", background: "#10B981" }}
                >
                  Konfirmasi Lunas
                </button>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}