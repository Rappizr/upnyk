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
// HELPER: Dapatkan user ID dari Supabase session / fallback pembeli
// ─────────────────────────────────────────────
async function getCurrentUserId(): Promise<string | null> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) return user.id;

    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("supabase_user_id");
      if (stored) return stored;
    }

    const { data: pembeli } = await supabase.from('pembeli').select('id, profile_id').limit(1).maybeSingle();
    return pembeli?.id || pembeli?.profile_id || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRODUK (tabel: etalase & admin_toko, fallback ke marketplace/produk)
// ─────────────────────────────────────────────
export async function getProducts(): Promise<any[]> {
  // 1. Coba ambil dari etalase tayang milik Admin Toko terlebih dahulu
  const { data: etalaseData, error: etalaseErr } = await supabase
    .from('etalase')
    .select('*')
    .eq('status', 'tayang')
    .order('created_at', { ascending: false });

  if (!etalaseErr && etalaseData && etalaseData.length > 0) {
    const tokoIds = etalaseData.map((e) => e.admin_toko_id).filter(Boolean);
    let tokoMap = new Map();

    if (tokoIds.length > 0) {
      const { data: tokoList } = await supabase
        .from('admin_toko')
        .select('id, nama_toko, desa, kabupaten')
        .in('id', tokoIds);

      if (tokoList) {
        tokoMap = new Map(tokoList.map((t) => [t.id, t]));
      }
    }

    return etalaseData.map((e: any) => {
      const toko = tokoMap.get(e.admin_toko_id);
      const asal = [toko?.desa, toko?.kabupaten].filter(Boolean).join(', ') || 'Indonesia';

      return {
        id: e.id,
        admin_toko_id: e.admin_toko_id,
        name: e.nama_produk || '',
        price: Number(e.harga_jual) || 0,
        description: e.deskripsi || '',
        unit: e.satuan || 'pcs',
        weight: 1,
        image: e.foto || null,
        origin: asal,
        rating: 4.8,
        stock: Number(e.stok) > 0 ? 'Tersedia' : 'Habis',
        icon_type: resolveIconType(null, e.nama_produk || ''),
        supplier: toko?.nama_toko || 'Toko Admin',
      };
    });
  }

  // 2. Fallback jika etalase kosong -> ambil dari marketplace / produk
  let { data, error } = await supabase
    .from('marketplace')
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
      kategori:kategori_id ( nama ),
      produsen:produsen_id ( nama_usaha, desa, kabupaten )
    `)
    .order('created_at', { ascending: false });

  if (error || !data || data.length === 0) {
    const { data: b2bData, error: b2bError } = await supabase
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
        kategori:kategori_id ( nama ),
        produsen:produsen_id ( nama_usaha, desa, kabupaten )
      `)
      .eq('status', 'aktif')
      .order('created_at', { ascending: false });

    if (!b2bError && b2bData && b2bData.length > 0) {
      data = b2bData.map((p: any) => ({
        ...p,
        harga: Math.round(p.harga * 1.3),
      }));
    }
  }

  if (!data || data.length === 0) {
    return [];
  }

  return data.map((p: any) => ({
    id: p.id,
    name: p.nama || '',
    price: p.harga || 0,
    description: p.deskripsi || '',
    unit: p.satuan || 'kg',
    weight: p.berat || 0,
    image: p.foto || null,
    kategori_id: p.kategori_id,
    produsen_id: p.produsen_id,
    origin: p.produsen ? `${p.produsen.desa || ''}, ${p.produsen.kabupaten || ''}`.replace(/^,\s*/, '') : 'Indonesia',
    rating: 4.5,
    stock: 'Tersedia',
    icon_type: resolveIconType(p.kategori?.nama || null, p.nama || ''),
    supplier: p.produsen?.nama_usaha || 'Koperasi Lokal',
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
      .from('marketplace')
      .update(payload)
      .eq('id', product.id)
      .select()
      .single();
    if (error) { console.error('saveProduct update error:', error.message); return null; }
    return data;
  } else {
    const { data, error } = await supabase
      .from('marketplace')
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
export async function getProfile(userIdParam?: string): Promise<any> {
  const userId = userIdParam || await getCurrentUserId();
  if (!userId) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, nama, email, phone, avatar_url, role, created_at, updated_at')
    .eq('id', userId)
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error('getProfile error:', error.message);
    return null;
  }

  if (!data) return null;

  let alamat = '';
  let no_hp = data.phone || '';

  if (data.role === 'pembeli') {
    const { data: pembeliData, error: pembeliError } = await supabase
      .from('pembeli')
      .select('alamat, no_hp, email, tanggal_lahir')
      .eq('id', userId)
      .maybeSingle();

    if (!pembeliError && pembeliData) {
      alamat = pembeliData.alamat || '';
      if (pembeliData.no_hp) no_hp = pembeliData.no_hp;

      return {
        id: data.id,
        name: data.nama || '',
        email: pembeliData.email || data.email || '',
        phone: no_hp,
        alamat: alamat,
        role: data.role || '',
        avatar_url: data.avatar_url || '',
        bio: '',
        tanggal_lahir: pembeliData.tanggal_lahir || '',
        addresses: alamat ? [{ id: 'main', label: 'Alamat Utama', address: alamat, city: '', default: true }] : [],
      };
    }
  }

  return {
    id: data.id,
    name: data.nama || '',
    email: data.email || '',
    phone: no_hp,
    alamat: alamat,
    role: data.role || '',
    avatar_url: data.avatar_url || '',
    bio: '',
    tanggal_lahir: '',
    addresses: alamat ? [{ id: 'main', label: 'Alamat Utama', address: alamat, city: '', default: true }] : [],
  };
}

export async function updateProfile(profileData: any): Promise<{ success: boolean; error?: string; profile?: any }> {
  const userId = await getCurrentUserId();
  const targetId = profileData.id || userId;

  if (!targetId) return { success: false, error: 'User ID tidak ditemukan (belum login)' };

  const payload: any = {};
  if (profileData.name !== undefined) payload.nama = profileData.name;
  if (profileData.email !== undefined) payload.email = profileData.email;
  if (profileData.phone !== undefined) payload.phone = profileData.phone;
  if (profileData.avatar_url !== undefined) payload.avatar_url = profileData.avatar_url;

  const { data: profile, error } = await supabase
    .from('profiles')
    .upsert({ id: targetId, ...payload })
    .select()
    .single();

  if (error) {
    console.error('updateProfile error:', error.message);
    return { success: false, error: 'Gagal memperbarui tabel profiles: ' + error.message };
  }

  // Jika profile role-nya pembeli, upsert ke tabel pembeli
  if (profile && profile.role === 'pembeli') {
    const pembeliPayload: any = {
      id: targetId,
      profile_id: targetId,
      nama: profileData.name || profile.nama
    };

    if (profileData.alamat !== undefined) pembeliPayload.alamat = profileData.alamat || null;
    if (profileData.phone !== undefined) pembeliPayload.no_hp = profileData.phone || null;
    if (profileData.email !== undefined) pembeliPayload.email = profileData.email || null;

    if (profileData.tanggal_lahir !== undefined) {
      pembeliPayload.tanggal_lahir = profileData.tanggal_lahir && profileData.tanggal_lahir.trim() !== ""
        ? profileData.tanggal_lahir
        : null;
    }

    const { error: pembeliErr } = await supabase
      .from('pembeli')
      .upsert(pembeliPayload);

    if (pembeliErr) {
      console.error('updateProfile pembeli upsert error:', pembeliErr.message);
      return { success: false, error: 'Gagal memperbarui data pembeli: ' + pembeliErr.message };
    }
  }

  return { success: true, profile };
}

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
      supplier,
      metode_pembayaran,
      bukti_pembayaran,
      created_at,
      detail_pesanan (
        id,
        produk_id,
        jumlah,
        harga,
        subtotal,
        marketplace:produk_id ( id, nama, foto, kategori_id, kategori:kategori_id(nama) )
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
    supplier: o.supplier || 'Koperasi Lokal',
    payment_method: o.metode_pembayaran || 'QRIS',
    proof_uploaded: !!o.bukti_pembayaran,
    proof_filename: o.bukti_pembayaran || '',
    items: (o.detail_pesanan || []).map((d: any) => ({
      id: d.id,
      produk_id: d.produk_id,
      name: d.marketplace?.nama || 'Produk',
      qty: d.jumlah || 1,
      price: d.harga || 0,
      icon_type: resolveIconType(d.marketplace?.kategori?.nama || null, d.marketplace?.nama || ''),
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
      supplier: orderData.supplier || null,
      metode_pembayaran: orderData.payment_method || null,
      bukti_pembayaran: orderData.proof_filename || null,
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

  // 3. Insert notifikasi ke database jika user terautentikasi
  if (userId || orderData.pembeli_id) {
    const targetUserId = userId || orderData.pembeli_id;
    await supabase.from('notifikasi').insert({
      pembeli_id: targetUserId,
      judul: 'Pesanan Baru Dibuat',
      isi: `Pesanan ${pesanan.kode_pesanan} sebesar Rp ${pesanan.total.toLocaleString('id-ID')} telah berhasil dibuat. Silakan lakukan pembayaran.`,
      tipe: 'Transaksi',
      dibaca: false
    });
  }

  return pesanan;
}

export async function updateOrderStatus(orderId: string, status: string): Promise<boolean> {
  // Coba update via kode_pesanan dulu
  const { data: byKode } = await supabase
    .from('pesanan')
    .select('id, pembeli_id, kode_pesanan, total')
    .eq('kode_pesanan', orderId)
    .maybeSingle();

  let targetOrder = byKode;

  if (byKode) {
    const { error } = await supabase
      .from('pesanan')
      .update({ status })
      .eq('kode_pesanan', orderId);
    if (error) { console.error('updateOrderStatus error:', error.message); return false; }
  } else {
    // Fallback: update via id UUID
    const { data: byId } = await supabase
      .from('pesanan')
      .select('id, pembeli_id, kode_pesanan, total')
      .eq('id', orderId)
      .maybeSingle();

    targetOrder = byId;

    if (byId) {
      const { error } = await supabase
        .from('pesanan')
        .update({ status })
        .eq('id', orderId);
      if (error) { console.error('updateOrderStatus fallback error:', error.message); return false; }
    }
  }

  // Kirim notifikasi pembaruan status
  if (targetOrder && targetOrder.pembeli_id) {
    let judul = 'Status Pesanan Diperbarui';
    let isi = `Status pesanan ${targetOrder.kode_pesanan} Anda telah diperbarui menjadi ${status}.`;

    if (status === 'Diproses') {
      judul = 'Pembayaran Diterima';
      isi = `Pembayaran untuk pesanan ${targetOrder.kode_pesanan} telah kami terima dan sedang diproses.`;
    } else if (status === 'Dikirim') {
      judul = 'Pesanan Dikirim';
      isi = `Pesanan ${targetOrder.kode_pesanan} Anda sedang dalam perjalanan oleh kurir.`;
    } else if (status === 'Selesai') {
      judul = 'Pesanan Selesai';
      isi = `Pesanan ${targetOrder.kode_pesanan} telah selesai diterima. Terima kasih telah mendukung produk koperasi pelosok!`;
    }

    await supabase.from('notifikasi').insert({
      pembeli_id: targetOrder.pembeli_id,
      judul,
      isi,
      tipe: 'Transaksi',
      dibaca: false
    });
  }

  return true;
}

// ─────────────────────────────────────────────
// WISHLIST (Menggunakan pembeli_id & produk_id)
// ─────────────────────────────────────────────
export async function getWishlist(): Promise<any[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('wishlist')
    .select('id, produk_id, pembeli_id')
    .eq('pembeli_id', userId);

  if (error || !data || data.length === 0) return [];

  const prodIds = data.map((w: any) => w.produk_id).filter(Boolean);
  if (prodIds.length === 0) return [];

  // Ambil detail produk dari etalase
  const { data: etalaseList } = await supabase
    .from('etalase')
    .select('*')
    .in('id', prodIds);

  const etalaseMap = new Map((etalaseList || []).map((e) => [e.id, e]));

  return data.map((w: any) => {
    const p = etalaseMap.get(w.produk_id);
    return {
      id: w.id,
      product_id: w.produk_id,
      product: p ? {
        id: p.id,
        name: p.nama_produk || 'Produk Toko',
        price: Number(p.harga_jual) || 0,
        stock: Number(p.stok) > 0 ? 'Tersedia' : 'Habis',
        image: p.foto || null,
        supplier: 'Toko Admin',
        origin: 'Indonesia',
        icon_type: resolveIconType(null, p.nama_produk || '')
      } : null
    };
  }).filter((w: any) => w.product !== null);
}

export async function addToWishlist(productId: string): Promise<any> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  // Cek apakah item sudah ada di wishlist
  const { data: existing } = await supabase
    .from('wishlist')
    .select('id')
    .eq('pembeli_id', userId)
    .eq('produk_id', productId)
    .maybeSingle();

  if (existing) return existing;

  const { data, error } = await supabase
    .from('wishlist')
    .insert({
      pembeli_id: userId,
      produk_id: productId
    })
    .select()
    .single();

  if (error) {
    console.error('addToWishlist error:', error.message);
    return null;
  }
  return data;
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('wishlist')
    .delete()
    .eq('pembeli_id', userId)
    .eq('produk_id', productId);

  if (error) {
    console.error('removeFromWishlist error:', error.message);
    return false;
  }
  return true;
}

function resolveNotificationIcon(tipe: string): string {
  const t = tipe.toLowerCase();
  if (t === 'promo') return 'dollar';
  if (t === 'keamanan') return 'lock';
  if (t === 'ulasan' || t === 'rating') return 'star';
  return 'bell';
}

// ─────────────────────────────────────────────
// NOTIFIKASI (tabel: notifikasi)
// ─────────────────────────────────────────────
export async function getNotifications(): Promise<any[]> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('notifikasi')
    .select('id, judul, isi, dibaca, tipe, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // Filter notifikasi milik user aktif
  if (userId) {
    query = query.eq('pembeli_id', userId);
  }

  const { data, error } = await query;

  if (error) {
    console.error('getNotifications error:', error.message);
    return [];
  }

  return (data || []).map((n: any) => ({
    id: n.id,
    type: n.tipe || 'Transaksi',
    icon_type: resolveNotificationIcon(n.tipe || 'Transaksi'),
    title: n.judul || 'Notifikasi',
    body: n.isi || '',
    time: new Date(n.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    unread: !n.dibaca,
  }));
}

export async function markNotificationsAsRead(): Promise<boolean> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('notifikasi')
    .update({ dibaca: true })
    .eq('dibaca', false);

  if (userId) {
    query = query.eq('pembeli_id', userId);
  }

  const { error } = await query;

  if (error) {
    console.error('markNotificationsAsRead error:', error.message);
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────
// KERANJANG (tabel: keranjang)
// ─────────────────────────────────────────────
export async function getCart(): Promise<any[]> {
  const userId = await getCurrentUserId();
  if (!userId) return [];

  const { data, error } = await supabase
    .from('keranjang')
    .select(`
      id,
      produk_id,
      jumlah,
      marketplace:produk_id (
        id,
        nama,
        harga,
        deskripsi,
        satuan,
        berat,
        foto,
        produsen_id,
        kategori_id,
        kategori:kategori_id ( nama ),
        produsen:produsen_id ( nama_usaha, desa, kabupaten )
      )
    `)
    .eq('pembeli_id', userId);

  if (error) {
    console.error('getCart error:', error.message);
    return [];
  }

  return (data || []).map((item: any) => {
    const p = item.marketplace;
    let supplierName = 'Koperasi Lokal';
    if (p?.produsen) {
      const u = p.produsen;
      const parts = [];
      if (u.nama_usaha) parts.push(u.nama_usaha);
      else {
        if (u.desa) parts.push(`Koperasi ${u.desa}`);
        if (u.kabupaten) parts.push(u.kabupaten);
      }
      if (parts.length > 0) {
        supplierName = parts.join(' - ');
      }
    }

    return {
      id: item.id,
      produk_id: item.produk_id,
      qty: item.jumlah || 1,
      product: p ? {
        id: p.id,
        name: p.nama || '',
        price: p.harga || 0,
        description: p.deskripsi || '',
        unit: p.satuan || 'kg',
        weight: p.berat || 0,
        image: p.foto || null,
        kategori_id: p.kategori_id,
        produsen_id: p.produsen_id,
        origin: p.produsen?.kabupaten || 'Indonesia',
        rating: 4.5,
        stock: 'Tersedia',
        icon_type: resolveIconType(p.kategori?.nama || null, p.nama || ''),
        supplier: supplierName,
      } : null
    };
  }).filter((item: any) => item.product !== null);
}

export async function addToCart(productId: string, qty: number = 1): Promise<any> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

  const { data: existing, error: checkErr } = await supabase
    .from('keranjang')
    .select('id, jumlah')
    .eq('pembeli_id', userId)
    .eq('produk_id', productId)
    .maybeSingle();

  if (checkErr) {
    console.error('addToCart check error:', checkErr.message);
  }

  if (existing) {
    const newQty = (existing.jumlah || 0) + qty;
    const { data, error } = await supabase
      .from('keranjang')
      .update({ jumlah: newQty })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) {
      console.error('addToCart update error:', error.message);
      return null;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from('keranjang')
      .insert({
        pembeli_id: userId,
        produk_id: productId,
        jumlah: qty
      })
      .select()
      .single();

    if (error) {
      console.error('addToCart insert error:', error.message);
      return null;
    }
    return data;
  }
}

export async function updateCartQty(cartItemId: string, qty: number): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('keranjang')
    .update({ jumlah: qty })
    .eq('id', cartItemId)
    .eq('pembeli_id', userId);

  if (error) {
    console.error('updateCartQty error:', error.message);
    return false;
  }
  return true;
}

export async function removeFromCart(cartItemId: string): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('keranjang')
    .delete()
    .eq('id', cartItemId)
    .eq('pembeli_id', userId);

  if (error) {
    console.error('removeFromCart error:', error.message);
    return false;
  }
  return true;
}

export async function clearCart(): Promise<boolean> {
  const userId = await getCurrentUserId();
  if (!userId) return false;

  const { error } = await supabase
    .from('keranjang')
    .delete()
    .eq('pembeli_id', userId);

  if (error) {
    console.error('clearCart error:', error.message);
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────
// INVENTARIS ADMIN TOKO
// ─────────────────────────────────────────────

export interface StokAdminToko {
  id: string;
  produk_id: string;
  nama: string;
  jumlah: number;
  satuan: string;
  batasMinimum: number;
  hargaBeli: number;
  hargaJual: number;
  diskonPersen: number;
  grade: 'A' | 'B' | 'C' | 'Belum Dinilai';
  asalProdusen: string;
  live: boolean;
  foto?: string | null;
}

export async function getInventarisAdminToko(): Promise<StokAdminToko[]> {
  const { data, error } = await supabase
    .from('inventaris')
    .select(`
      id,
      produk_id,
      stok,
      stok_minimum,
      marketplace:produk_id (
        id,
        nama,
        harga,
        satuan,
        foto,
        produsen_id,
        produsen:produsen_id (
          nama_usaha,
          desa,
          kabupaten
        )
      ),
      produk:produk_id (
        id,
        nama,
        harga,
        satuan,
        foto,
        produsen_id,
        produsen:produsen_id (
          nama_usaha,
          desa,
          kabupaten
        )
      )
    `);

  if (error) {
    console.error('getInventarisAdminToko error:', error.message);
    return [];
  }

  return (data || []).map((row: any) => {
    const mp = row.marketplace || row.produk;
    return {
      id: row.id,
      produk_id: row.produk_id,
      nama: mp?.nama || 'Produk',
      jumlah: row.stok || 0,
      satuan: mp?.satuan || 'kg',
      batasMinimum: row.stok_minimum || 10,
      hargaBeli: mp?.harga || 0,
      hargaJual: Math.round((mp?.harga || 0) * 1.3),
      diskonPersen: 0,
      grade: 'Belum Dinilai' as const,
      asalProdusen: mp?.produsen ? `${mp.produsen.nama_usaha || mp.produsen.desa || 'Produsen'}` : 'Produsen Lokal',
      live: false,
      foto: mp?.foto || null,
    };
  });
}

export async function addInventarisAdminToko(item: {
  produk_id: string;
  stok: number;
  stok_minimum?: number;
}): Promise<{ id: string } | null> {
  const insertPayload = {
    produk_id: item.produk_id,
    stok: item.stok,
    stok_minimum: item.stok_minimum || 10,
  };

  const { data, error } = await supabase
    .from('inventaris')
    .upsert(insertPayload, { onConflict: 'produk_id' })
    .select('id')
    .maybeSingle();

  if (error) {
    if (error.message.includes("row-level security policy")) {
      console.warn('addInventarisAdminToko: Supabase RLS restrictions active, falling back to local storage.');
    } else {
      console.error('addInventarisAdminToko error:', error.message);
    }
    return null;
  }
  return data;
}

export async function updateInventarisStok(inventarisId: string, stok: number): Promise<boolean> {
  const { error } = await supabase
    .from('inventaris')
    .update({ stok, updated_at: new Date().toISOString() })
    .eq('id', inventarisId);

  if (error) {
    if (error.message.includes("row-level security policy")) {
      console.warn('updateInventarisStok: Supabase RLS restrictions active, falling back to local storage.');
    } else {
      console.error('updateInventarisStok error:', error.message);
    }
    return false;
  }
  return true;
}

export async function deleteInventarisAdminToko(inventarisId: string): Promise<boolean> {
  const { error } = await supabase
    .from('inventaris')
    .delete()
    .eq('id', inventarisId);

  if (error) {
    console.error('deleteInventarisAdminToko error:', error.message);
    return false;
  }
  return true;
}

export async function getMarketplaceUntukInventaris(): Promise<any[]> {
  const { data, error } = await supabase
    .from('marketplace')
    .select(`
      id,
      nama,
      harga,
      satuan,
      foto,
      produsen_id,
      produsen:produsen_id (
        nama_usaha,
        desa,
        kabupaten
      )
    `);

  if (error) {
    console.error('getMarketplaceUntukInventaris error:', error.message);
    return [];
  }
  return data || [];
}