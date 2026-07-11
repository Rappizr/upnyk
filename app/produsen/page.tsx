'use client';

import React, { useMemo, useState } from 'react';
import {
  Sprout, Package, Truck, Wallet, User, Plus, X, Trash2,
  ArrowUpRight, MapPin, CheckCircle2, Clock, AlertTriangle,
  ChevronRight, Search, Bell, LogOut
} from 'lucide-react';

/* ============================================================
   TIPE DATA
   ============================================================ */
type Kategori = 'Padi & Serealia' | 'Sayur & Buah' | 'Peternakan' | 'Kerajinan';
type StatusPesanan = 'baru' | 'diproses' | 'dikirim' | 'selesai';
type LangkahKirim = 0 | 1 | 2 | 3; // Dikemas, Diambil Kurir, Dalam Perjalanan, Terkirim

interface Produk {
  id: string;
  nama: string;
  kategori: Kategori;
  stok: number;
  satuan: string;
  harga: number;
  tanggalPanen: string; // yyyy-mm-dd
  umurSimpanHari: number;
}

interface Pesanan {
  id: string;
  pembeli: string;
  produkId: string;
  jumlah: number;
  status: StatusPesanan;
  langkahKirim: LangkahKirim;
  kurir?: string;
}

interface Transaksi {
  id: string;
  tanggal: string;
  keterangan: string;
  tipe: 'masuk' | 'keluar';
  jumlah: number;
}

interface Toast {
  id: number;
  pesan: string;
  tipe: 'sukses' | 'info' | 'peringatan';
}

/* ============================================================
   DATA AWAL
   ============================================================ */
const produkAwal: Produk[] = [
  { id: 'p1', nama: 'Beras Merah Organik', kategori: 'Padi & Serealia', stok: 1200, satuan: 'kg', harga: 24000, tanggalPanen: '2026-05-25', umurSimpanHari: 180 },
  { id: 'p2', nama: 'Jagung Manis Pipil', kategori: 'Sayur & Buah', stok: 850, satuan: 'kg', harga: 8000, tanggalPanen: '2026-07-05', umurSimpanHari: 10 },
  { id: 'p3', nama: 'Kentang Granola', kategori: 'Sayur & Buah', stok: 600, satuan: 'kg', harga: 12000, tanggalPanen: '2026-07-02', umurSimpanHari: 21 },
  { id: 'p4', nama: 'Telur Ayam Kampung', kategori: 'Peternakan', stok: 90, satuan: 'tray', harga: 42000, tanggalPanen: '2026-07-06', umurSimpanHari: 14 },
];

const pesananAwal: Pesanan[] = [
  { id: 'ORD-2294', pembeli: 'Koperasi Desa Maju', produkId: 'p1', jumlah: 200, status: 'baru', langkahKirim: 0 },
  { id: 'ORD-2293', pembeli: 'UMKM Berkah Alam', produkId: 'p2', jumlah: 80, status: 'baru', langkahKirim: 0 },
  { id: 'ORD-2291', pembeli: 'Toko Barokah', produkId: 'p4', jumlah: 15, status: 'diproses', langkahKirim: 1, kurir: 'JNE Kargo' },
  { id: 'ORD-2288', pembeli: 'CV Dapur Nusantara', produkId: 'p3', jumlah: 50, status: 'dikirim', langkahKirim: 2, kurir: 'Sicepat Gudang' },
  { id: 'ORD-2280', pembeli: 'Ibu Sari — Katering', produkId: 'p1', jumlah: 30, status: 'selesai', langkahKirim: 3 },
];

const transaksiAwal: Transaksi[] = [
  { id: 't1', tanggal: '8 Jul 2026', keterangan: 'Pesanan ORD-2280 — Beras Merah', tipe: 'masuk', jumlah: 720000 },
  { id: 't2', tanggal: '5 Jul 2026', keterangan: 'Komisi platform Juni 2026', tipe: 'keluar', jumlah: 384000 },
];

const langkahLabel = ['Dikemas', 'Diambil Kurir', 'Dalam Perjalanan', 'Terkirim'];

const formatRupiah = (n: number) =>
  'Rp ' + n.toLocaleString('id-ID', { maximumFractionDigits: 0 });

function sisaHari(tanggalPanen: string, umurSimpanHari: number) {
  const panen = new Date(tanggalPanen).getTime();
  const kadaluarsa = panen + umurSimpanHari * 86400000;
  const now = new Date('2026-07-09').getTime();
  return Math.max(0, Math.round((kadaluarsa - now) / 86400000));
}

/* ============================================================
   KOMPONEN UTAMA
   ============================================================ */
export default function ProdusenDashboard() {
  const [view, setView] = useState<'dashboard' | 'stok' | 'pesanan' | 'pengiriman' | 'keuangan' | 'profil'>('dashboard');
  const [produk, setProduk] = useState<Produk[]>(produkAwal);
  const [pesanan, setPesanan] = useState<Pesanan[]>(pesananAwal);
  const [transaksi, setTransaksi] = useState<Transaksi[]>(transaksiAwal);
  const [saldo, setSaldo] = useState(5400000);
  const [saldoTertunda, setSaldoTertunda] = useState(1200000);
  const [profil, setProfil] = useState({
    nama: 'Pak Budi', usaha: 'Ladang Makmur', jenis: 'Petani',
    telepon: '+62 812-3456-7890', alamat: 'Dusun Sumberrejo, Jombang, Jawa Timur',
    deskripsi: 'Menyediakan hasil panen segar langsung dari petani lokal Jombang, dipanen dan dikirim dalam 24 jam.',
  });

  const [toasts, setToasts] = useState<Toast[]>([]);
  const [modalTambah, setModalTambah] = useState(false);
  const [modalStok, setModalStok] = useState<Produk | null>(null);
  const [modalTarik, setModalTarik] = useState(false);
  const [filterPesanan, setFilterPesanan] = useState<'semua' | StatusPesanan>('semua');

  const tampilkanToast = (pesan: string, tipe: Toast['tipe'] = 'sukses') => {
    const id = Date.now();
    setToasts((t) => [...t, { id, pesan, tipe }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  };

  const namaProduk = (id: string) => produk.find((p) => p.id === id)?.nama ?? '—';
  const hargaProduk = (id: string) => produk.find((p) => p.id === id)?.harga ?? 0;

  /* -------------------- AKSI -------------------- */
  const tambahProduk = (p: Omit<Produk, 'id'>) => {
    setProduk((prev) => [...prev, { ...p, id: 'p' + (prev.length + 1) + Date.now() }]);
    setModalTambah(false);
    tampilkanToast(`${p.nama} ditambahkan ke gudang.`);
  };

  const ubahStok = (id: string, stokBaru: number) => {
    setProduk((prev) => prev.map((p) => (p.id === id ? { ...p, stok: stokBaru } : p)));
    setModalStok(null);
    tampilkanToast('Stok diperbarui.');
  };

  const hapusProduk = (id: string) => {
    setProduk((prev) => prev.filter((p) => p.id !== id));
    tampilkanToast('Produk dihapus dari gudang.', 'info');
  };

  const terimaPesanan = (id: string) => {
    setPesanan((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'diproses', langkahKirim: 1, kurir: 'Menunggu penjemputan' } : o)));
    tampilkanToast(`${id} dikonfirmasi, siapkan komoditasnya.`);
  };

  const majukanKirim = (id: string) => {
    setPesanan((prev) =>
      prev.map((o) => {
        if (o.id !== id) return o;
        const langkah = Math.min(3, (o.langkahKirim + 1)) as LangkahKirim;
        const selesai = langkah === 3;
        if (selesai) {
          const total = o.jumlah * hargaProduk(o.produkId);
          setTransaksi((t) => [{ id: 'tx' + Date.now(), tanggal: '9 Jul 2026', keterangan: `Pesanan ${o.id} — ${namaProduk(o.produkId)}`, tipe: 'masuk', jumlah: total }, ...t]);
          setSaldo((s) => s + total);
          tampilkanToast(`${o.id} terkirim! Dana masuk ke saldo.`);
        } else {
          tampilkanToast(`${o.id}: ${langkahLabel[langkah]}`, 'info');
        }
        return { ...o, langkahKirim: langkah, status: selesai ? 'selesai' : 'dikirim', kurir: o.kurir ?? 'Kurir mitra' };
      })
    );
  };

  const tarikSaldo = (jumlah: number) => {
    if (jumlah > saldo) {
      tampilkanToast('Jumlah melebihi saldo tersedia.', 'peringatan');
      return;
    }
    setSaldo((s) => s - jumlah);
    setSaldoTertunda((s) => s + jumlah);
    setTransaksi((t) => [{ id: 'tx' + Date.now(), tanggal: '9 Jul 2026', keterangan: 'Penarikan ke rekening bank', tipe: 'keluar', jumlah }, ...t]);
    setModalTarik(false);
    tampilkanToast('Penarikan diajukan, diproses 1–2 hari kerja.');
  };

  /* -------------------- DATA TURUNAN -------------------- */
  const totalPanenAktif = produk.reduce((sum, p) => sum + p.stok, 0);
  const nilaiStok = produk.reduce((sum, p) => sum + p.stok * p.harga, 0);
  const pengirimanAktif = pesanan.filter((o) => o.status === 'diproses' || o.status === 'dikirim');
  const pesananBaru = pesanan.filter((o) => o.status === 'baru').length;
  const pendapatanBulanIni = transaksi.filter((t) => t.tipe === 'masuk').reduce((s, t) => s + t.jumlah, 0);
  const profitBersih = pendapatanBulanIni - transaksi.filter((t) => t.tipe === 'keluar').reduce((s, t) => s + t.jumlah, 0);

  const produkUrutFresh = useMemo(
    () => [...produk].sort((a, b) => sisaHari(a.tanggalPanen, a.umurSimpanHari) - sisaHari(b.tanggalPanen, b.umurSimpanHari)),
    [produk]
  );

  const pesananTerfilter = filterPesanan === 'semua' ? pesanan : pesanan.filter((o) => o.status === filterPesanan);

  const navItems: { key: typeof view; label: string; icon: React.ElementType; badge?: number }[] = [
    { key: 'dashboard', label: 'Dashboard', icon: Sprout },
    { key: 'stok', label: 'Stok Komoditas', icon: Package },
    { key: 'pesanan', label: 'Penjualan B2B', icon: ArrowUpRight, badge: pesananBaru },
    { key: 'pengiriman', label: 'Pengiriman', icon: Truck, badge: pengirimanAktif.length },
    { key: 'keuangan', label: 'Keuangan', icon: Wallet },
    { key: 'profil', label: 'Profil UMKM', icon: User },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] text-[#1E293B]" style={{ fontFamily: "'Inter', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap');
        .font-display { font-family: 'Sora', sans-serif; }
        .font-mono { font-family: 'JetBrains Mono', monospace; }
        @keyframes slideUp { from { opacity:0; transform: translateY(8px);} to { opacity:1; transform:none; } }
        @keyframes popIn { from { opacity:0; transform: scale(.96);} to { opacity:1; transform:scale(1);} }
        .anim-slide { animation: slideUp .28s ease both; }
        .anim-pop { animation: popIn .18s ease both; }
      `}</style>

      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col sticky top-0 h-screen shrink-0">
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-slate-100">
          <div className="w-9 h-9 rounded-xl bg-[#10B981] flex items-center justify-center shadow-sm shadow-emerald-100">
            <Sprout className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-display font-bold text-[15px] text-[#10B981] leading-none">PasarNusa</div>
            <div className="text-[11px] text-slate-400 font-medium mt-0.5">Panel Produsen</div>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          <div className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 px-3 mb-2">Panel Produsen</div>
          {navItems.map(({ key, label, icon: Icon, badge }) => {
            const active = view === key;
            return (
              <button
                key={key}
                onClick={() => setView(key)}
                className={`w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all ${
                  active ? 'bg-[#EFF9F4] text-[#0F766E] font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-[18px] h-[18px] ${active ? 'text-[#10B981]' : 'text-slate-400 group-hover:text-slate-500'}`} />
                <span className="flex-1 text-left">{label}</span>
                {!!badge && badge > 0 && (
                  <span className={`text-[10.5px] font-bold px-1.5 py-0.5 rounded-full ${active ? 'bg-[#10B981] text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {badge}
                  </span>
                )}
                {active && <span className="w-1 h-1 rounded-full bg-[#10B981]" />}
              </button>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100">
          <div className="flex items-center gap-2.5 px-2 py-2">
            <div className="w-9 h-9 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-display font-bold text-[13px]">
              {profil.nama.split(' ').map((s) => s[0]).slice(0, 2).join('')}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-semibold truncate">{profil.nama}</div>
              <div className="text-[11px] text-slate-400 truncate">{profil.usaha}</div>
            </div>
            <button className="text-slate-300 hover:text-[#EF4444]" title="Keluar">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 min-w-0 flex flex-col">
        <header className="h-[68px] bg-white/80 backdrop-blur border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-2 text-slate-400 text-[13px]">
            <Search className="w-[15px] h-[15px]" />
            <input placeholder="Cari produk, pesanan..." className="bg-transparent outline-none w-56 placeholder:text-slate-400" />
          </div>
          <div className="flex items-center gap-3">
            {pesananBaru > 0 && (
              <button onClick={() => setView('pesanan')} className="flex items-center gap-1.5 bg-[#ECFDF5] text-[#0F766E] px-3 py-1.5 rounded-lg text-[12.5px] font-semibold border border-emerald-100 hover:bg-emerald-100 transition-colors">
                <ArrowUpRight className="w-[14px] h-[14px]" />
                {pesananBaru} pesanan baru masuk
              </button>
            )}
            <button className="relative w-9 h-9 rounded-lg border border-slate-200 flex items-center justify-center text-slate-400 hover:text-[#1E293B]">
              <Bell className="w-[17px] h-[17px]" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-[#EF4444]" />
            </button>
          </div>
        </header>

        <main className="p-8 flex-1 overflow-y-auto">
          {view === 'dashboard' && (
            <DashboardTab
              totalPanenAktif={totalPanenAktif}
              pengirimanAktif={pengirimanAktif.length}
              nilaiStok={nilaiStok}
              saldo={saldo}
              produkUrutFresh={produkUrutFresh}
              pesanan={pesanan}
              namaProduk={namaProduk}
              onLihatSemua={() => setView('pesanan')}
              onTerima={terimaPesanan}
            />
          )}

          {view === 'stok' && (
            <StokTab
              produk={produk}
              onTambah={() => setModalTambah(true)}
              onUbahStok={(p) => setModalStok(p)}
              onHapus={hapusProduk}
              onLacak={() => setView('pengiriman')}
            />
          )}

          {view === 'pesanan' && (
            <PesananTab
              pesanan={pesananTerfilter}
              filter={filterPesanan}
              setFilter={setFilterPesanan}
              namaProduk={namaProduk}
              onTerima={terimaPesanan}
              onProses={majukanKirim}
            />
          )}

          {view === 'pengiriman' && (
            <PengirimanTab pesanan={pengirimanAktif} namaProduk={namaProduk} onMajukan={majukanKirim} />
          )}

          {view === 'keuangan' && (
            <KeuanganTab
              saldo={saldo}
              saldoTertunda={saldoTertunda}
              pendapatanBulanIni={pendapatanBulanIni}
              profitBersih={profitBersih}
              transaksi={transaksi}
              onTarik={() => setModalTarik(true)}
            />
          )}

          {view === 'profil' && <ProfilTab profil={profil} setProfil={setProfil} onSimpan={() => tampilkanToast('Profil usaha disimpan.')} />}
        </main>
      </div>

      {/* ================= MODALS ================= */}
      {modalTambah && <ModalTambahProduk onClose={() => setModalTambah(false)} onSimpan={tambahProduk} />}
      {modalStok && <ModalUbahStok produk={modalStok} onClose={() => setModalStok(null)} onSimpan={ubahStok} />}
      {modalTarik && <ModalTarikSaldo saldo={saldo} onClose={() => setModalTarik(false)} onTarik={tarikSaldo} />}

      {/* ================= TOASTS ================= */}
      <div className="fixed bottom-5 right-5 flex flex-col gap-2 z-50">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`anim-slide px-4 py-3 rounded-xl shadow-lg text-[13px] font-medium flex items-center gap-2 text-white ${
              t.tipe === 'sukses' ? 'bg-[#10B981]' : t.tipe === 'peringatan' ? 'bg-[#EF4444]' : 'bg-[#1E293B]'
            }`}
          >
            {t.tipe === 'sukses' ? <CheckCircle2 className="w-4 h-4" /> : t.tipe === 'peringatan' ? <AlertTriangle className="w-4 h-4" /> : <Clock className="w-4 h-4" />}
            {t.pesan}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   TAB: DASHBOARD  — signature widget: Jendela Kesegaran Panen
   ============================================================ */
function DashboardTab({
  totalPanenAktif, pengirimanAktif, nilaiStok, saldo, produkUrutFresh, pesanan, namaProduk, onLihatSemua, onTerima,
}: {
  totalPanenAktif: number; pengirimanAktif: number; nilaiStok: number; saldo: number;
  produkUrutFresh: Produk[]; pesanan: Pesanan[]; namaProduk: (id: string) => string;
  onLihatSemua: () => void; onTerima: (id: string) => void;
}) {
  const antrianBaru = pesanan.filter((o) => o.status === 'baru').slice(0, 3);

  return (
    <div className="space-y-6 anim-slide">
      <div>
        <h1 className="font-display font-bold text-[22px]">Portal Produsen — Ladang Makmur</h1>
        <p className="text-slate-500 text-[13.5px] mt-1">Kelola komoditas hasil tani dan distribusi ke agen/marketplace.</p>
      </div>

      <div className="grid grid-cols-4 gap-4">
        <StatCard label="Total Hasil Panen Aktif" value={`${totalPanenAktif.toLocaleString('id-ID')} kg`} icon={Sprout} color="green" />
        <StatCard label="Pengiriman Berjalan" value={`${pengirimanAktif}`} icon={Truck} color="blue" />
        <StatCard label="Estimasi Nilai Stok" value={formatRupiah(nilaiStok)} icon={Package} color="amber" />
        <StatCard label="Saldo Siap Tarik" value={formatRupiah(saldo)} icon={Wallet} color="green" />
      </div>

      <div className="grid grid-cols-5 gap-5">
        {/* Signature: Jendela Kesegaran Panen */}
        <div className="col-span-3 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-1">
            <h3 className="font-display font-bold text-[15px]">Jendela Kesegaran Panen</h3>
          </div>
          <p className="text-[12px] text-slate-400 mb-4">Sisa waktu sebelum komoditas melewati masa simpan optimalnya.</p>
          <div className="space-y-3.5">
            {produkUrutFresh.map((p) => {
              const sisa = sisaHari(p.tanggalPanen, p.umurSimpanHari);
              const pct = Math.min(100, Math.round((sisa / p.umurSimpanHari) * 100));
              const warna = sisa <= 3 ? '#EF4444' : sisa <= 10 ? '#F59E0B' : '#10B981';
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className="w-32 shrink-0 text-[12.5px] font-semibold truncate">{p.nama}</div>
                  <div className="flex-1 h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: warna }} />
                  </div>
                  <div className="w-24 shrink-0 text-right text-[11.5px] font-bold font-mono" style={{ color: warna }}>
                    {sisa === 0 ? 'Segera kirim' : `${sisa} hari lagi`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Antrian pesanan baru */}
        <div className="col-span-2 bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
          <h3 className="font-display font-bold text-[15px] mb-1">Menunggu Konfirmasi</h3>
          <p className="text-[12px] text-slate-400 mb-4">Pesanan yang perlu segera kamu terima.</p>
          <div className="space-y-2.5 flex-1">
            {antrianBaru.length === 0 && <p className="text-[13px] text-slate-400 italic">Tidak ada pesanan menunggu saat ini.</p>}
            {antrianBaru.map((o) => (
              <div key={o.id} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="text-[12.5px] font-semibold truncate">{namaProduk(o.produkId)}</div>
                  <div className="text-[11px] text-slate-400 truncate">{o.pembeli}</div>
                </div>
                <button onClick={() => onTerima(o.id)} className="shrink-0 text-[11.5px] font-semibold bg-[#10B981] text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600">
                  Terima
                </button>
              </div>
            ))}
          </div>
          <button onClick={onLihatSemua} className="mt-4 text-[12.5px] font-semibold text-[#2563EB] flex items-center gap-1 hover:gap-2 transition-all">
            Lihat semua penjualan <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, icon: Icon, color }: { label: string; value: string; icon: React.ElementType; color: 'green' | 'blue' | 'amber' }) {
  const map = {
    green: { bg: '#ECFDF5', text: '#10B981', border: '#10B981' },
    blue: { bg: '#EFF4FF', text: '#2563EB', border: '#2563EB' },
    amber: { bg: '#FFFBEB', text: '#B45309', border: '#F59E0B' },
  }[color];
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-5 border-l-4" style={{ borderLeftColor: map.border }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: map.bg }}>
        <Icon className="w-[18px] h-[18px]" style={{ color: map.text }} />
      </div>
      <div className="font-display font-extrabold text-[20px] font-mono">{value}</div>
      <div className="text-[12px] text-slate-400 font-medium mt-0.5">{label}</div>
    </div>
  );
}

/* ============================================================
   TAB: STOK KOMODITAS
   ============================================================ */
function StokTab({ produk, onTambah, onUbahStok, onHapus, onLacak }: {
  produk: Produk[]; onTambah: () => void; onUbahStok: (p: Produk) => void; onHapus: (id: string) => void; onLacak: () => void;
}) {
  return (
    <div className="space-y-5 anim-slide">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-[20px]">Stok Komoditas</h1>
          <p className="text-slate-500 text-[13px] mt-1">Kelola hasil panen di gudang, harga, dan ketersediaan.</p>
        </div>
        <button onClick={onTambah} className="flex items-center gap-1.5 bg-[#10B981] text-white px-4 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-emerald-600 transition-colors shadow-sm shadow-emerald-100">
          <Plus className="w-4 h-4" /> Tambah Hasil Bumi
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {produk.map((p, i) => {
          const sisa = sisaHari(p.tanggalPanen, p.umurSimpanHari);
          const status = sisa <= 3 ? { label: 'Segera Kadaluarsa', bg: '#FEF2F2', text: '#B91C1C' } : sisa <= 10 ? { label: 'Perlu Dipantau', bg: '#FFFBEB', text: '#B45309' } : { label: 'Siap Kirim', bg: '#ECFDF5', text: '#047857' };
          return (
            <div key={p.id} className={`flex items-center gap-4 px-6 py-4 ${i !== produk.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-10 h-10 rounded-lg bg-slate-50 flex items-center justify-center text-slate-400 shrink-0">
                <Package className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold truncate">{p.nama}</div>
                <div className="text-[12px] text-slate-400">Stok: <b className="text-slate-600 font-mono">{p.stok.toLocaleString('id-ID')} {p.satuan}</b> · Harga: <b className="text-slate-600 font-mono">{formatRupiah(p.harga)}/{p.satuan}</b></div>
              </div>
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: status.bg, color: status.text }}>{status.label}</span>
              <div className="flex gap-2 shrink-0">
                <button onClick={() => onUbahStok(p)} className="text-[12px] font-semibold border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">Ubah Stok</button>
                <button onClick={onLacak} className="text-[12px] font-semibold border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-slate-50">Lacak</button>
                <button onClick={() => onHapus(p.id)} className="text-slate-300 hover:text-[#EF4444] px-1"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          );
        })}
        {produk.length === 0 && <div className="p-10 text-center text-slate-400 text-[13px]">Belum ada komoditas. Tambahkan hasil bumi pertamamu.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   TAB: PENJUALAN B2B (PESANAN)
   ============================================================ */
const statusBadge: Record<StatusPesanan, { label: string; bg: string; text: string }> = {
  baru: { label: 'Baru', bg: '#EFF4FF', text: '#1D4ED8' },
  diproses: { label: 'Diproses', bg: '#FFFBEB', text: '#B45309' },
  dikirim: { label: 'Dikirim', bg: '#F1F5F9', text: '#475569' },
  selesai: { label: 'Selesai', bg: '#ECFDF5', text: '#047857' },
};

function PesananTab({ pesanan, filter, setFilter, namaProduk, onTerima, onProses }: {
  pesanan: Pesanan[]; filter: 'semua' | StatusPesanan; setFilter: (f: 'semua' | StatusPesanan) => void;
  namaProduk: (id: string) => string; onTerima: (id: string) => void; onProses: (id: string) => void;
}) {
  const tabs: { key: 'semua' | StatusPesanan; label: string }[] = [
    { key: 'semua', label: 'Semua' }, { key: 'baru', label: 'Baru' }, { key: 'diproses', label: 'Diproses' },
    { key: 'dikirim', label: 'Dikirim' }, { key: 'selesai', label: 'Selesai' },
  ];
  return (
    <div className="space-y-5 anim-slide">
      <div>
        <h1 className="font-display font-bold text-[20px]">Penjualan B2B</h1>
        <p className="text-slate-500 text-[13px] mt-1">Konfirmasi dan proses pesanan dari agen & mitra grosir.</p>
      </div>

      <div className="flex gap-2">
        {tabs.map((t) => (
          <button key={t.key} onClick={() => setFilter(t.key)} className={`text-[12.5px] font-semibold px-3.5 py-1.5 rounded-full border transition-colors ${filter === t.key ? 'bg-[#1E293B] text-white border-[#1E293B]' : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300'}`}>
            {t.label}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
        {pesanan.map((o, i) => {
          const badge = statusBadge[o.status];
          return (
            <div key={o.id} className={`flex items-center gap-4 px-6 py-4 ${i !== pesanan.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div className="w-24 shrink-0 font-mono text-[12px] text-slate-400">{o.id}</div>
              <div className="min-w-0 flex-1">
                <div className="text-[13.5px] font-semibold truncate">{namaProduk(o.produkId)}</div>
                <div className="text-[12px] text-slate-400">{o.jumlah} unit · {o.pembeli}</div>
              </div>
              <span className="shrink-0 text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: badge.bg, color: badge.text }}>{badge.label}</span>
              <div className="shrink-0">
                {o.status === 'baru' && <button onClick={() => onTerima(o.id)} className="text-[12px] font-semibold bg-[#10B981] text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600">Terima</button>}
                {(o.status === 'diproses' || o.status === 'dikirim') && <button onClick={() => onProses(o.id)} className="text-[12px] font-semibold bg-[#2563EB] text-white px-3 py-1.5 rounded-lg hover:bg-blue-700">Majukan Status</button>}
                {o.status === 'selesai' && <span className="text-[12px] text-slate-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> Tuntas</span>}
              </div>
            </div>
          );
        })}
        {pesanan.length === 0 && <div className="p-10 text-center text-slate-400 text-[13px]">Tidak ada pesanan di kategori ini.</div>}
      </div>
    </div>
  );
}

/* ============================================================
   TAB: PENGIRIMAN
   ============================================================ */
function PengirimanTab({ pesanan, namaProduk, onMajukan }: { pesanan: Pesanan[]; namaProduk: (id: string) => string; onMajukan: (id: string) => void }) {
  return (
    <div className="space-y-5 anim-slide">
      <div>
        <h1 className="font-display font-bold text-[20px]">Pengiriman</h1>
        <p className="text-slate-500 text-[13px] mt-1">Pantau posisi komoditas yang sedang dalam perjalanan.</p>
      </div>

      {pesanan.length === 0 && (
        <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-400 text-[13px]">
          Tidak ada pengiriman aktif saat ini.
        </div>
      )}

      {pesanan.map((o) => (
        <div key={o.id} className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-[13.5px] font-semibold">{o.id} · {namaProduk(o.produkId)}</div>
              <div className="text-[12px] text-slate-400 flex items-center gap-1"><MapPin className="w-3 h-3" /> Tujuan: {o.pembeli} · {o.kurir}</div>
            </div>
            <button onClick={() => onMajukan(o.id)} className="text-[12px] font-semibold bg-[#2563EB] text-white px-3.5 py-2 rounded-lg hover:bg-blue-700">
              {o.langkahKirim < 3 ? `Tandai: ${langkahLabel[o.langkahKirim + 1]}` : 'Selesai'}
            </button>
          </div>
          <div className="flex items-center">
            {langkahLabel.map((label, idx) => {
              const done = idx <= o.langkahKirim;
              const current = idx === o.langkahKirim;
              return (
                <div key={label} className="flex-1 flex flex-col items-center gap-1.5 relative">
                  {idx > 0 && <div className="absolute top-[11px] right-1/2 w-full h-0.5" style={{ background: idx <= o.langkahKirim ? '#10B981' : '#F1F5F9' }} />}
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10.5px] font-bold z-10" style={{ background: done ? (current ? '#2563EB' : '#10B981') : '#F1F5F9', color: done ? '#fff' : '#94A3B8' }}>
                    {done && !current ? '✓' : idx + 1}
                  </div>
                  <div className="text-[10.5px] font-semibold text-center" style={{ color: done ? '#1E293B' : '#94A3B8' }}>{label}</div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ============================================================
   TAB: KEUANGAN
   ============================================================ */
function KeuanganTab({ saldo, saldoTertunda, pendapatanBulanIni, profitBersih, transaksi, onTarik }: {
  saldo: number; saldoTertunda: number; pendapatanBulanIni: number; profitBersih: number; transaksi: Transaksi[]; onTarik: () => void;
}) {
  return (
    <div className="space-y-5 anim-slide">
      <div>
        <h1 className="font-display font-bold text-[20px]">Keuangan</h1>
        <p className="text-slate-500 text-[13px] mt-1">Ringkasan pendapatan dan penarikan saldo usahamu.</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-[12px] text-slate-400 font-medium">Saldo Tersedia</div>
          <div className="font-display font-extrabold text-[21px] font-mono mt-1" style={{ color: '#10B981' }}>{formatRupiah(saldo)}</div>
          <button onClick={onTarik} className="mt-3 text-[12px] font-semibold bg-[#10B981] text-white px-3 py-1.5 rounded-lg hover:bg-emerald-600">Tarik Saldo</button>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-[12px] text-slate-400 font-medium">Pendapatan Tercatat</div>
          <div className="font-display font-extrabold text-[21px] font-mono mt-1">{formatRupiah(pendapatanBulanIni)}</div>
          <div className="text-[11.5px] text-slate-400 mt-3">Dari pesanan yang sudah terkirim</div>
        </div>
        <div className="bg-white rounded-2xl border border-slate-200 p-5">
          <div className="text-[12px] text-slate-400 font-medium">Penarikan Tertunda</div>
          <div className="font-display font-extrabold text-[21px] font-mono mt-1">{formatRupiah(saldoTertunda)}</div>
          <div className="text-[11.5px] text-slate-400 mt-3">Diproses 1–2 hari kerja</div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h3 className="font-display font-bold text-[15px] mb-4">Riwayat Transaksi</h3>
        <div className="space-y-0.5">
          {transaksi.map((t, i) => (
            <div key={t.id} className={`flex items-center justify-between py-3 ${i !== transaksi.length - 1 ? 'border-b border-slate-100' : ''}`}>
              <div>
                <div className="text-[13px] font-medium">{t.keterangan}</div>
                <div className="text-[11.5px] text-slate-400">{t.tanggal}</div>
              </div>
              <div className="font-mono text-[13px] font-bold" style={{ color: t.tipe === 'masuk' ? '#10B981' : '#EF4444' }}>
                {t.tipe === 'masuk' ? '+' : '-'}{formatRupiah(t.jumlah)}
              </div>
            </div>
          ))}
          {transaksi.length === 0 && <p className="text-[13px] text-slate-400 italic py-4">Belum ada transaksi.</p>}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   TAB: PROFIL UMKM
   ============================================================ */
function ProfilTab({ profil, setProfil, onSimpan }: { profil: any; setProfil: (fn: any) => void; onSimpan: () => void }) {
  const update = (key: string, val: string) => setProfil((p: any) => ({ ...p, [key]: val }));
  return (
    <div className="space-y-5 anim-slide max-w-2xl">
      <div>
        <h1 className="font-display font-bold text-[20px]">Profil UMKM</h1>
        <p className="text-slate-500 text-[13px] mt-1">Informasi ini tampil ke agen dan pembeli di marketplace.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Nama Pemilik" value={profil.nama} onChange={(v) => update('nama', v)} />
          <Field label="Nama Usaha" value={profil.usaha} onChange={(v) => update('usaha', v)} />
          <Field label="Jenis Produsen" value={profil.jenis} onChange={(v) => update('jenis', v)} select options={['Petani', 'Peternak', 'Pengrajin']} />
          <Field label="Nomor Telepon" value={profil.telepon} onChange={(v) => update('telepon', v)} />
        </div>
        <Field label="Alamat Lokasi" value={profil.alamat} onChange={(v) => update('alamat', v)} />
        <Field label="Deskripsi Usaha" value={profil.deskripsi} onChange={(v) => update('deskripsi', v)} textarea />
        <div className="flex justify-end pt-2">
          <button onClick={onSimpan} className="bg-[#2563EB] text-white px-5 py-2.5 rounded-xl text-[13px] font-semibold hover:bg-blue-700">Simpan Perubahan</button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, textarea, select, options }: {
  label: string; value: string; onChange: (v: string) => void; textarea?: boolean; select?: boolean; options?: string[];
}) {
  return (
    <div className={textarea ? 'col-span-2' : ''}>
      <label className="text-[12px] font-semibold text-slate-500 block mb-1.5">{label}</label>
      {select ? (
        <select value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]">
          {options!.map((o) => <option key={o}>{o}</option>)}
        </select>
      ) : textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={3} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#2563EB] resize-none" />
      ) : (
        <input value={value} onChange={(e) => onChange(e.target.value)} className="w-full border border-slate-200 rounded-lg px-3 py-2 text-[13px] outline-none focus:border-[#2563EB]" />
      )}
    </div>
  );
}

/* ============================================================
   MODAL: LAYOUT DASAR
   ============================================================ */
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-40 p-4" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="anim-pop bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-[16px]">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalTambahProduk({ onClose, onSimpan }: { onClose: () => void; onSimpan: (p: Omit<Produk, 'id'>) => void }) {
  const [nama, setNama] = useState('');
  const [kategori, setKategori] = useState<Kategori>('Sayur & Buah');
  const [stok, setStok] = useState('');
  const [satuan, setSatuan] = useState('kg');
  const [harga, setHarga] = useState('');
  const [tanggalPanen, setTanggalPanen] = useState('2026-07-09');
  const [umurSimpan, setUmurSimpan] = useState('14');

  const submit = () => {
    if (!nama || !stok || !harga) return;
    onSimpan({ nama, kategori, stok: parseInt(stok), satuan, harga: parseInt(harga), tanggalPanen, umurSimpanHari: parseInt(umurSimpan) });
  };

  return (
    <ModalShell title="Tambah Hasil Bumi" onClose={onClose}>
      <div className="space-y-3">
        <Field label="Nama Komoditas" value={nama} onChange={setNama} />
        <Field label="Kategori" value={kategori} onChange={(v) => setKategori(v as Kategori)} select options={['Padi & Serealia', 'Sayur & Buah', 'Peternakan', 'Kerajinan']} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Jumlah Stok" value={stok} onChange={setStok} />
          <Field label="Satuan" value={satuan} onChange={setSatuan} select options={['kg', 'tray', 'karung', 'pcs', 'botol']} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Harga per Satuan (Rp)" value={harga} onChange={setHarga} />
          <Field label="Umur Simpan (hari)" value={umurSimpan} onChange={setUmurSimpan} />
        </div>
        <Field label="Tanggal Panen" value={tanggalPanen} onChange={setTanggalPanen} />
        <button onClick={submit} className="w-full bg-[#10B981] text-white py-2.5 rounded-xl text-[13px] font-semibold hover:bg-emerald-600 mt-2">Simpan Komoditas</button>
      </div>
    </ModalShell>
  );
}

function ModalUbahStok({ produk, onClose, onSimpan }: { produk: Produk; onClose: () => void; onSimpan: (id: string, stok: number) => void }) {
  const [stok, setStok] = useState(String(produk.stok));
  return (
    <ModalShell title={`Ubah Stok — ${produk.nama}`} onClose={onClose}>
      <Field label={`Jumlah stok (${produk.satuan})`} value={stok} onChange={setStok} />
      <button onClick={() => onSimpan(produk.id, parseInt(stok) || 0)} className="w-full bg-[#2563EB] text-white py-2.5 rounded-xl text-[13px] font-semibold hover:bg-blue-700 mt-3">Perbarui Stok</button>
    </ModalShell>
  );
}

function ModalTarikSaldo({ saldo, onClose, onTarik }: { saldo: number; onClose: () => void; onTarik: (jumlah: number) => void }) {
  const [jumlah, setJumlah] = useState('');
  return (
    <ModalShell title="Tarik Saldo" onClose={onClose}>
      <p className="text-[12.5px] text-slate-400 mb-3">Saldo tersedia: <b className="text-slate-600 font-mono">{formatRupiah(saldo)}</b></p>
      <Field label="Jumlah Penarikan (Rp)" value={jumlah} onChange={setJumlah} />
      <button onClick={() => onTarik(parseInt(jumlah) || 0)} className="w-full bg-[#10B981] text-white py-2.5 rounded-xl text-[13px] font-semibold hover:bg-emerald-600 mt-3">Ajukan Penarikan</button>
    </ModalShell>
  );
}