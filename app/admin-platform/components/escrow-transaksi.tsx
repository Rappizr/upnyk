"use client";

import { useMemo, useState } from "react";

type StatusEscrow = "Ditahan" | "Tersalur" | "Disengketakan";

interface EscrowTx {
  id: string;
  pembeli: string;
  toko: string;
  produsen: string;
  nominal: number;
  persenToko: number;
  persenProdusen: number;
  status: StatusEscrow;
  tanggal: string;
}

interface Props {
  transaksiList: EscrowTx[];
  salurkanDana: (id: string) => void;
  tandaiSengketa: (id: string) => void;
  selesaikanSengketa: (id: string) => void;
}

type Tab = "semua" | "pembeli-toko" | "toko-produsen";

const IconWalletLock = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2Z"></path></svg>;
const IconCheck = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="20 6 9 17 4 12"></polyline></svg>;
const IconAlert = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10.29 3.86-8.18 14.14A1.5 1.5 0 0 0 3.4 20h17.2a1.5 1.5 0 0 0 1.3-2L13.7 3.86a1.5 1.5 0 0 0-2.6 0Z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const IconLayers = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polygon points="12 2 2 7 12 12 22 7 12 2"></polygon><polyline points="2 17 12 22 22 17"></polyline><polyline points="2 12 12 17 22 12"></polyline></svg>;
const IconArrowRight = () => <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;

const statusStyle: Record<StatusEscrow, { bg: string; color: string }> = {
  Ditahan: { bg: "#FEF3C7", color: "#92400E" },
  Tersalur: { bg: "#D1FAE5", color: "#065F46" },
  Disengketakan: { bg: "#FEE2E2", color: "#991B1B" },
};

function formatRupiah(n: number) {
  return "Rp " + n.toLocaleString("id-ID");
}
function formatRupiahRingkas(n: number) {
  if (n >= 1000000000) return `Rp ${(n / 1000000000).toFixed(1)}M`;
  if (n >= 1000000) return `Rp ${(n / 1000000).toFixed(1)}jt`;
  return formatRupiah(n);
}

function StatusBadge({ status }: { status: StatusEscrow }) {
  const s = statusStyle[status];
  return <span style={{ background: s.bg, color: s.color, fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: "999px", whiteSpace: "nowrap" }}>{status}</span>;
}

function AksiTombol({ tx, salurkanDana, tandaiSengketa, selesaikanSengketa }: { tx: EscrowTx } & Pick<Props, "salurkanDana" | "tandaiSengketa" | "selesaikanSengketa">) {
  if (tx.status === "Ditahan") {
    return (
      <div style={{ display: "flex", gap: "0.4rem", flexWrap: "wrap" }}>
        <button onClick={() => salurkanDana(tx.id)} style={{ background: "#2563EB", color: "white", border: "none", padding: "0.4rem 0.7rem", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Salurkan Dana</button>
        <button onClick={() => tandaiSengketa(tx.id)} style={{ background: "white", color: "#991B1B", border: "1px solid #FCA5A5", padding: "0.4rem 0.7rem", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Tandai Sengketa</button>
      </div>
    );
  }
  if (tx.status === "Disengketakan") {
    return <button onClick={() => selesaikanSengketa(tx.id)} style={{ background: "#10B981", color: "white", border: "none", padding: "0.4rem 0.7rem", borderRadius: "6px", fontSize: "0.74rem", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap" }}>Selesaikan Sengketa</button>;
  }
  return <span style={{ fontSize: "0.74rem", color: "#94A3B8" }}>—</span>;
}

export default function EscrowTransaksi({ transaksiList, salurkanDana, tandaiSengketa, selesaikanSengketa }: Props) {
  const [tab, setTab] = useState<Tab>("semua");
  const [filterStatus, setFilterStatus] = useState<"Semua" | StatusEscrow>("Semua");
  const [search, setSearch] = useState("");

  const totalDitahan = transaksiList.filter((t) => t.status === "Ditahan").reduce((s, t) => s + t.nominal, 0);
  const totalTersalur = transaksiList.filter((t) => t.status === "Tersalur").reduce((s, t) => s + t.nominal, 0);
  const totalDisengketakan = transaksiList.filter((t) => t.status === "Disengketakan").length;

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return transaksiList
      .filter((t) => filterStatus === "Semua" || t.status === filterStatus)
      .filter((t) => !q || t.pembeli.toLowerCase().includes(q) || t.toko.toLowerCase().includes(q) || t.produsen.toLowerCase().includes(q) || t.id.toLowerCase().includes(q));
  }, [transaksiList, filterStatus, search]);

  const tabs: { key: Tab; label: string; icon: () => JSX.Element }[] = [
    { key: "semua", label: "Semua Transaksi", icon: IconLayers },
    { key: "pembeli-toko", label: "Pembeli → Toko", icon: IconArrowRight },
    { key: "toko-produsen", label: "Toko → Produsen", icon: IconArrowRight },
  ];

  return (
    <main style={{ padding: "1.25rem clamp(1rem, 4vw, 1.75rem)" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700, color: "#1E293B" }}>Escrow & Transaksi</h1>
        <p style={{ margin: "0.25rem 0 0 0", color: "#64748B", fontSize: "0.9rem" }}>Pantau dana yang tertahan di escrow, lihat detail alur dana Pembeli → Toko dan Toko → Produsen, dan selesaikan sengketa.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: "1rem", marginBottom: "1.5rem" }}>
        <div style={{ background: "#FEF3C7", border: "1px solid #FDE68A", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#D97706", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconWalletLock /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#92400E" }}>{formatRupiahRingkas(totalDitahan)}</div><div style={{ fontSize: "0.78rem", color: "#92400E" }}>Dana Ditahan</div></div>
        </div>
        <div style={{ background: "#fff", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#ECFDF5", color: "#10B981", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconCheck /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{formatRupiahRingkas(totalTersalur)}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Sudah Tersalur</div></div>
        </div>
        <div style={{ background: "#FEE2E2", border: "1px solid #FCA5A5", padding: "1.1rem", borderRadius: "12px", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "white", color: "#EF4444", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconAlert /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#991B1B" }}>{totalDisengketakan}</div><div style={{ fontSize: "0.78rem", color: "#991B1B" }}>Sengketa Aktif</div></div>
        </div>
        <div style={{ background: "#fff", padding: "1.1rem", borderRadius: "12px", border: "1px solid #E2E8F0", display: "flex", alignItems: "center", gap: "0.9rem" }}>
          <div style={{ background: "#EFF6FF", color: "#2563EB", padding: "0.6rem", borderRadius: "10px", display: "flex" }}><IconLayers /></div>
          <div><div style={{ fontSize: "1.2rem", fontWeight: 700, color: "#1E293B" }}>{transaksiList.length}</div><div style={{ fontSize: "0.78rem", color: "#64748B" }}>Total Transaksi</div></div>
        </div>
      </div>

      {/* Tab switcher */}
      <div style={{ display: "flex", gap: "0.4rem", marginBottom: "1.25rem", background: "white", border: "1px solid #E2E8F0", borderRadius: "10px", padding: "4px", flexWrap: "wrap", width: "fit-content" }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              display: "flex", alignItems: "center", gap: "6px",
              border: "none",
              background: tab === t.key ? "#1E293B" : "transparent",
              color: tab === t.key ? "white" : "#64748B",
              fontWeight: 600,
              fontSize: "0.82rem",
              padding: "0.5rem 0.9rem",
              borderRadius: "7px",
              cursor: "pointer",
              whiteSpace: "nowrap",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginBottom: "1.25rem", alignItems: "center" }}>
        <div style={{ display: "flex", background: "white", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "3px" }}>
          {(["Semua", "Ditahan", "Tersalur", "Disengketakan"] as ("Semua" | StatusEscrow)[]).map((s) => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              style={{
                border: "none",
                background: filterStatus === s ? "#F1F5F9" : "transparent",
                color: filterStatus === s ? "#1E293B" : "#94A3B8",
                fontWeight: 600,
                fontSize: "0.78rem",
                padding: "0.4rem 0.7rem",
                borderRadius: "6px",
                cursor: "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {s}
            </button>
          ))}
        </div>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari ID transaksi, toko, produsen, atau pembeli..."
          style={{ flex: "1 1 240px", maxWidth: "360px", padding: "0.5rem 0.9rem", borderRadius: "8px", border: "1px solid #CBD5E1", fontSize: "0.85rem", outline: "none" }}
        />
      </div>

      <div style={{ background: "white", borderRadius: "12px", border: "1px solid #E2E8F0", overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          {tab === "semua" && (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem", minWidth: "820px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Alur Dana</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Nominal</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Split Toko / Produsen</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Tanggal</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada transaksi yang cocok.</td></tr>}
                {filtered.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{t.id}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "5px", flexWrap: "wrap", fontSize: "0.82rem" }}>
                        <span>{t.pembeli}</span><IconArrowRight /><span style={{ fontWeight: 600 }}>{t.toko}</span><IconArrowRight /><span>{t.produsen}</span>
                      </div>
                    </td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B", whiteSpace: "nowrap" }}>{formatRupiah(t.nominal)}</td>
                    <td style={{ padding: "1rem", color: "#64748B", whiteSpace: "nowrap" }}>{t.persenToko}% / {t.persenProdusen}%</td>
                    <td style={{ padding: "1rem" }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: "1rem", color: "#64748B", whiteSpace: "nowrap" }}>{t.tanggal}</td>
                    <td style={{ padding: "1rem" }}><AksiTombol tx={t} salurkanDana={salurkanDana} tandaiSengketa={tandaiSengketa} selesaikanSengketa={selesaikanSengketa} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "pembeli-toko" && (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem", minWidth: "760px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Pembeli</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Toko Penerima</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Nominal Dibayar</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Tanggal</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada transaksi yang cocok.</td></tr>}
                {filtered.map((t) => (
                  <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{t.id}</td>
                    <td style={{ padding: "1rem", color: "#334155" }}>{t.pembeli}</td>
                    <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{t.toko}</td>
                    <td style={{ padding: "1rem", fontWeight: 700, color: "#2563EB", whiteSpace: "nowrap" }}>{formatRupiah(t.nominal)}</td>
                    <td style={{ padding: "1rem" }}><StatusBadge status={t.status} /></td>
                    <td style={{ padding: "1rem", color: "#64748B", whiteSpace: "nowrap" }}>{t.tanggal}</td>
                    <td style={{ padding: "1rem" }}><AksiTombol tx={t} salurkanDana={salurkanDana} tandaiSengketa={tandaiSengketa} selesaikanSengketa={selesaikanSengketa} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {tab === "toko-produsen" && (
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.88rem", minWidth: "820px" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "1px solid #E2E8F0" }}>
                  <th style={{ padding: "1rem", color: "#475569" }}>ID</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Toko Pengirim</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Produsen Penerima</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Bagian Produsen</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Bagian Toko</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Status</th>
                  <th style={{ padding: "1rem", color: "#475569" }}>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && <tr><td colSpan={7} style={{ padding: "2rem", textAlign: "center", color: "#94A3B8" }}>Tidak ada transaksi yang cocok.</td></tr>}
                {filtered.map((t) => {
                  const bagianProdusen = Math.round((t.nominal * t.persenProdusen) / 100);
                  const bagianToko = Math.round((t.nominal * t.persenToko) / 100);
                  return (
                    <tr key={t.id} style={{ borderBottom: "1px solid #F1F5F9" }}>
                      <td style={{ padding: "1rem", fontWeight: 700, color: "#1E293B" }}>{t.id}</td>
                      <td style={{ padding: "1rem", color: "#334155" }}>{t.toko}</td>
                      <td style={{ padding: "1rem", fontWeight: 600, color: "#1E293B" }}>{t.produsen}</td>
                      <td style={{ padding: "1rem", fontWeight: 700, color: "#10B981", whiteSpace: "nowrap" }}>{formatRupiah(bagianProdusen)} <span style={{ fontWeight: 400, color: "#94A3B8", fontSize: "0.75rem" }}>({t.persenProdusen}%)</span></td>
                      <td style={{ padding: "1rem", color: "#64748B", whiteSpace: "nowrap" }}>{formatRupiah(bagianToko)} <span style={{ fontSize: "0.75rem" }}>({t.persenToko}%)</span></td>
                      <td style={{ padding: "1rem" }}><StatusBadge status={t.status} /></td>
                      <td style={{ padding: "1rem" }}><AksiTombol tx={t} salurkanDana={salurkanDana} tandaiSengketa={tandaiSengketa} selesaikanSengketa={selesaikanSengketa} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}