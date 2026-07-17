import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variabel lingkungan Supabase belum terdeteksi di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ─────────────────────────────────────────────
// HELPER: Resolve icon type dari kategori/nama produk
// ─────────────────────────────────────────────
function resolveIconType(namaKategori: string | null, namaProduk: string): string {
  const kat = (namaKategori || namaProduk || '').toLowerCase();
  if (kat.includes('beras') || kat.includes('nasi')) return 'rice';
  if (kat.includes('kopi') || kat.includes('coffee')) return 'coffee';
  if (kat.includes('rempah') || kat.includes('bawang') || kat.includes('cabai') || kat.includes('jahe')) return 'spice';
  if (kat.includes('minyak') || kat.includes('kelapa') || kat.includes('vco')) return 'oil';
  if (kat.includes('madu') || kat.includes('honey')) return 'honey';
  if (kat.includes('gandum') || kat.includes('jagung') || kat.includes('kacang')) return 'grain';
  if (kat.includes('sayur') || kat.includes('daun') || kat.includes('bayam')) return 'leaf';
  if (kat.includes('buah') || kat.includes('pisang') || kat.includes('mangga')) return 'grain';
  if (kat.includes('ikan') || kat.includes('udang') || kat.includes('lele')) return 'oil';
  return 'grain';
}

// ─────────────────────────────────────────────
// HELPER: Dapatkan user ID dari Supabase session
// ─────────────────────────────────────────────
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRODUK (tabel: produk JOIN kategori)
// ─────────────────────────────────────────────
export async function getProducts(): Promise<any[]> {
  const { data, error } = await supabase
    .from('produk')
    .select(`
      id,
      nama,
      harga,
      deskripsi,
      satuan,
      berat,
      foto,
      produsen_id,
      kategori_id,
      kategori:kategori_id ( nama )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('getProducts error:', error.message);
    return [];
  }

  return (data || []).map((p: any) => ({
    id: p.id,
    name: p.nama || '',
    price: p.harga || 0,
    description: p.deskripsi || '',
    unit: p.satuan || 'kg',
    weight: p.berat || 0,
    image: p.foto || null,
    kategori_id: p.kategori_id,
    produsen_id: p.produsen_id,
    origin: 'Indonesia',
    rating: 4.5,
    stock: 'Tersedia',
    icon_type: resolveIconType(p.kategori?.nama || null, p.nama || ''),
    supplier: 'Koperasi Lokal',
  }));
}

export async function saveProduct(product: any): Promise<any> {
  const payload: any = {
    nama: product.name || product.nama,
    harga: product.price || product.harga,
    deskripsi: product.description || product.deskripsi || '',
    satuan: product.unit || product.satuan || 'kg',
    berat: product.weight || product.berat || 0,
    foto: product.image || product.foto || null,
    kategori_id: product.kategori_id || null,
    produsen_id: product.produsen_id || null,
  };

  if (product.id) {
    const { data, error } = await supabase
      .from('produk')
      .update(payload)
      .eq('id', product.id)
      .select()
      .single();
    if (error) { console.error('saveProduct update error:', error.message); return null; }
    return data;
  } else {
    const { data, error } = await supabase
      .from('produk')
      .insert(payload)
      .select()
      .single();
    if (error) { console.error('saveProduct insert error:', error.message); return null; }
    return data;
  }
}

// ─────────────────────────────────────────────
// PROFILE PEMBELI (tabel: profiles)
// Auth: Gunakan user ID dari Supabase session
// ─────────────────────────────────────────────
export async function getProfile(): Promise<any> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('profiles')
    .select('id, nama, email, phone, avatar_url, created_at, updated_at');

  // Jika ada user yang login, ambil profil miliknya
  if (userId) {
    query = query.eq('id', userId);
  }

  const { data, error } = await query.limit(1).maybeSingle();

  if (error) {
    console.error('getProfile error:', error.message);
    return null;
  }

  if (!data) return null;

  return {
    id: data.id,
    name: data.nama || '',
    email: data.email || '',
    phone: data.phone || '',
    avatar_url: data.avatar_url || '',
    bio: '',
    addresses: [],
  };
}

export async function updateProfile(profileData: any): Promise<any> {
  const userId = await getCurrentUserId();

  const payload: any = {};
  if (profileData.name !== undefined) payload.nama = profileData.name;
  if (profileData.email !== undefined) payload.email = profileData.email;
  if (profileData.phone !== undefined) payload.phone = profileData.phone;
  if (profileData.avatar_url !== undefined) payload.avatar_url = profileData.avatar_url;

  const targetId = profileData.id || userId;

  if (targetId) {
    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: targetId, ...payload })
      .select()
      .single();
    if (error) { console.error('updateProfile error:', error.message); return null; }
    return data;
  }

  // Fallback: insert new row
  const { data, error } = await supabase
    .from('profiles')
    .insert(payload)
    .select()
    .single();
  if (error) { console.error('updateProfile insert error:', error.message); return null; }
  return data;
}

// ─────────────────────────────────────────────
// PESANAN (tabel: pesanan + detail_pesanan)
// Auth: Filter by pembeli_id (user ID dari session)
// ─────────────────────────────────────────────
export async function getOrders(): Promise<any[]> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('pesanan')
    .select(`
      id,
      pembeli_id,
      status,
      total,
      kode_pesanan,
      alamat_pengiriman,
      created_at,
      detail_pesanan (
        id,
        produk_id,
        jumlah,
        harga,
        subtotal,
        produk:produk_id ( id, nama, foto, kategori_id, kategori:kategori_id(nama) )
      )
    `)
    .order('created_at', { ascending: false });

  // Filter by user jika ada session aktif
  if (userId) {
    query = query.eq('pembeli_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getOrders error:', error.message);
    return [];
  }

  return (data || []).map((o: any) => ({
    id: o.kode_pesanan || o.id,
    originalId: o.id,
    date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: o.status || 'Belum Dibayar',
    total: o.total || 0,
    supplier: 'Koperasi Lokal',
    payment_method: 'QRIS',
    proof_uploaded: false,
    items: (o.detail_pesanan || []).map((d: any) => ({
      id: d.id,
      produk_id: d.produk_id,
      name: d.produk?.nama || 'Produk',
      qty: d.jumlah || 1,
      price: d.harga || 0,
      icon_type: resolveIconType(d.produk?.kategori?.nama || null, d.produk?.nama || ''),
    })),
  }));
}

export async function createOrder(orderData: any): Promise<any> {
  const userId = await getCurrentUserId();

  // 1. Insert pesanan
  const { data: pesanan, error: pesananError } = await supabase
    .from('pesanan')
    .insert({
      pembeli_id: userId || orderData.pembeli_id || null,
      status: orderData.status || 'Belum Dibayar',
      total: orderData.total || 0,
      kode_pesanan: `ORD-${Date.now()}`,
      alamat_pengiriman: orderData.alamat_pengiriman || orderData.address || null,
    })
    .select()
    .single();

  if (pesananError) {
    console.error('createOrder pesanan error:', pesananError.message);
    return null;
  }

  // 2. Insert detail_pesanan untuk setiap item
  const items = orderData.items || [];
  if (items.length > 0) {
    const detailRows = items.map((item: any) => ({
      pesanan_id: pesanan.id,
      produk_id: item.produk_id || item.id || null,
      jumlah: item.qty || item.jumlah || 1,
      harga: item.price || item.harga || 0,
      subtotal: (item.price || item.harga || 0) * (item.qty || item.jumlah || 1),
    }));

    const { error: detailError } = await supabase
      .from('detail_pesanan')
      .insert(detailRows);

    if (detailError) {
      console.error('createOrder detail error:', detailError.message);
    }
  }

  return pesanan;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  // Coba update via kode_pesanan dulu
  const { data: byKode } = await supabase
    .from('pesanan')
    .select('id')
    .eq('kode_pesanan', orderId)
    .maybeSingle();

  if (byKode) {
    const { error } = await supabase
      .from('pesanan')
      .update({ status })
      .eq('kode_pesanan', orderId);
    if (error) { console.error('updateOrderStatus error:', error.message); return false; }
    return true;
  }

  // Fallback: update via id UUID
  const { error } = await supabase
    .from('pesanan')
    .update({ status })
    .eq('id', orderId);
  if (error) { console.error('updateOrderStatus fallback error:', error.message); return false; }
  return true;
}

// ─────────────────────────────────────────────
// WISHLIST (localStorage — tabel keranjang tidak memiliki produk_id)
// ─────────────────────────────────────────────
export async function getWishlist(): Promise<any[]> {
  // Wishlist disimpan di localStorage oleh client component
  // Fungsi ini mengembalikan array kosong — state dikelola di komponen
  return [];
}

export async function addToWishlist(productId: number): Promise<any> {
  return { id: Date.now(), product_id: productId };
}

export async function removeFromWishlist(id: number): Promise<boolean> {
  return true;
}

// ─────────────────────────────────────────────
// NOTIFIKASI (tabel: notifikasi)
// Auth: Filter by pembeli_id jika ada session
// ─────────────────────────────────────────────
export async function getNotifications(): Promise<any[]> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('notifikasi')
    .select('id, judul, isi, dibaca, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // Jika ada kolom pembeli_id di notifikasi, filter by user (saat ini tidak ada)
  // if (userId) query = query.eq('pembeli_id', userId);

  const { data, error } = await query;

  if (error) {
    console.error('getNotifications error:', error.message);
    return [];
  }

  return (data || []).map((n: any) => ({
    id: n.id,
    type: 'Transaksi',
    icon_type: 'bell',
    title: n.judul || 'Notifikasi',
    body: n.isi || '',
    time: new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    unread: !n.dibaca,
  }));
}

export async function markNotificationsAsRead(): Promise<boolean> {
  const { error } = await supabase
    .from('notifikasi')
    .update({ dibaca: true })
    .eq('dibaca', false);

  if (error) {
    console.error('markNotificationsAsRead error:', error.message);
    return false;
  }
  return true;
}