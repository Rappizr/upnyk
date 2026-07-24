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

async function getCurrentUserId(): Promise<string | null> {
  try {
    let authUserId: string | null = null;

    // 1. Cek dari Auth Supabase
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.id) {
      authUserId = authData.user.id;
    }

    // 2. Cek dari LocalStorage jika di client side
    if (!authUserId && typeof window !== "undefined") {
      authUserId = localStorage.getItem("supabase_user_id");
    }

    // 3. Fallback: Ambil pembeli ID paling baru di database
    if (!authUserId) {
      const { data: pembeli } = await supabase
        .from('pembeli')
        .select('id, profile_id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();

      authUserId = pembeli?.id || pembeli?.profile_id || null;
    }

    return authUserId;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRODUK
// ─────────────────────────────────────────────
export async function getProducts(): Promise<any[]> {
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
      const asal = [toko?.desa, toko?.kabupaten].filter(Boolean).join(', ');

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
        stock: Number(e.stok) > 0 ? 'Tersedia' : 'Habis',
        icon_type: resolveIconType(null, e.nama_produk || ''),
        supplier: toko?.nama_toko || '',
      };
    });
  }

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
      data = b2bData;
    }
  }

  if (!data || data.length === 0) return [];

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
    origin: p.produsen ? `${p.produsen.desa || ''}, ${p.produsen.kabupaten || ''}`.replace(/^,\s*/, '') : '',
    stock: 'Tersedia',
    icon_type: resolveIconType(p.kategori?.nama || null, p.nama || ''),
    supplier: p.produsen?.nama_usaha || '',
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
// PROFILE PEMBELI
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

  if (error || !data) return null;

  let alamat = '';
  let no_hp = data.phone || '';

  if (data.role === 'pembeli') {
    const { data: pembeliData } = await supabase
      .from('pembeli')
      .select('alamat, no_hp, email, tanggal_lahir')
      .eq('id', userId)
      .maybeSingle();

    if (pembeliData) {
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

// ─────────────────────────────────────────────
// PESANAN
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
    supplier: o.supplier || '',
    payment_method: o.metode_pembayaran || '',
    proof_uploaded: !!o.bukti_pembayaran,
    proof_filename: o.bukti_pembayaran || '',
    items: (o.detail_pesanan || []).map((d: any) => ({
      id: d.id,
      produk_id: d.produk_id,
      name: d.marketplace?.nama || '',
      qty: d.jumlah || 1,
      price: d.harga || 0,
      icon_type: resolveIconType(d.marketplace?.kategori?.nama || null, d.marketplace?.nama || ''),
    })),
  }));
}

export async function createOrder(orderData: any): Promise<any> {
  const userId = await getCurrentUserId();

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
      isi = `Pesanan ${targetOrder.kode_pesanan} telah selesai diterima.`;
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
// WISHLIST
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
        name: p.nama_produk || '',
        price: Number(p.harga_jual) || 0,
        stock: Number(p.stok) > 0 ? 'Tersedia' : 'Habis',
        image: p.foto || null,
        supplier: '',
        origin: '',
        icon_type: resolveIconType(null, p.nama_produk || '')
      } : null
    };
  }).filter((w: any) => w.product !== null);
}

export async function addToWishlist(productId: string): Promise<any> {
  const userId = await getCurrentUserId();
  if (!userId) return null;

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
// NOTIFIKASI
// ─────────────────────────────────────────────
export async function getNotifications(): Promise<any[]> {
  const userId = await getCurrentUserId();

  let query = supabase
    .from('notifikasi')
    .select('id, judul, isi, dibaca, tipe, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

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

export async function getCart(): Promise<any[]> {
  const pembeliId = await getCurrentUserId();

  let cartData: any = null;

  // A. Cari keranjang spesifik milik user
  if (pembeliId) {
    const { data } = await supabase
      .from('keranjang')
      .select('id')
      .eq('pembeli_id', pembeliId)
      .maybeSingle();
    cartData = data;
  }

  // B. Fallback: Jika tidak ketemu via pembeliId, ambil keranjang terbaru di database yang MEMILIKI ITEM
  if (!cartData) {
    const { data: activeCarts } = await supabase
      .from('keranjang_item')
      .select('keranjang_id')
      .order('created_at', { ascending: false })
      .limit(1);

    if (activeCarts && activeCarts.length > 0) {
      cartData = { id: activeCarts[0].keranjang_id };
    }
  }

  if (!cartData) return [];

  // 1. Ambil semua item dari keranjang_item
  const { data: cartItems, error: itemErr } = await supabase
    .from('keranjang_item')
    .select('id, produk_id, jumlah, harga, subtotal')
    .eq('keranjang_id', cartData.id);

  if (itemErr || !cartItems || cartItems.length === 0) return [];

  // 2. Ambil detail etalase
  const prodIds = cartItems.map((i) => i.produk_id).filter(Boolean);
  const etalaseMap = new Map();

  if (prodIds.length > 0) {
    // Ambil data etalase lengkap
    const { data: etalaseList } = await supabase
      .from('etalase')
      .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten)');

    (etalaseList || []).forEach((e) => {
      if (e.id) etalaseMap.set(e.id, e);
      if (e.produk_id) etalaseMap.set(e.produk_id, e);
    });
  }

  // 3. Gabungkan data
  return cartItems.map((item: any) => {
    const p = etalaseMap.get(item.produk_id);

    const hargaVal = Number(item.harga) || Number(p?.harga_jual) || 0;
    const qtyVal = Number(item.jumlah) || 1;
    const namaVal = p?.nama_produk || 'Produk Belanja';
    const storeName = p?.admin_toko?.nama_toko || 'Toko Mitra';
    const asal = [p?.admin_toko?.desa, p?.admin_toko?.kabupaten].filter(Boolean).join(', ') || 'Indonesia';

    return {
      id: item.id, // ID keranjang_item
      produk_id: item.produk_id,
      qty: qtyVal,
      harga: hargaVal,
      subtotal: item.subtotal || (hargaVal * qtyVal),
      product: {
        id: p?.id || item.produk_id,
        name: namaVal,
        price: hargaVal,
        description: p?.deskripsi || '',
        unit: p?.satuan || 'pcs',
        weight: 1,
        foto: p?.foto || null,
        supplier: storeName,
        origin: asal,
        icon_type: resolveIconType(null, namaVal)
      }
    };
  });
}

export async function addToCart(productId: string, qty: number = 1): Promise<any> {
  const pembeliId = await getCurrentUserId();
  if (!pembeliId) {
    console.error('addToCart error: User belum terautentikasi.');
    alert("Gagal tambah keranjang: User ID tidak ditemukan. Pastikan Anda sudah login.");
    return null;
  }

  // 1. Cari / Buat Header Keranjang
  let { data: cartData, error: fetchCartErr } = await supabase
    .from('keranjang')
    .select('id')
    .eq('pembeli_id', pembeliId)
    .maybeSingle();

  if (fetchCartErr) {
    console.error("Error fetch keranjang:", fetchCartErr.message);
  }

  if (!cartData) {
    const { data: newCart, error: createCartErr } = await supabase
      .from('keranjang')
      .insert({ pembeli_id: pembeliId })
      .select('id')
      .single();

    if (createCartErr || !newCart) {
      console.error('Gagal membuat header keranjang:', createCartErr?.message);
      alert(`Supabase Error (Tabel keranjang): ${createCartErr?.message || "Gagal insert"}`);
      return null;
    }
    cartData = newCart;
  }

  // 2. Ambil Harga Produk dari Etalase
  let hargaFinal = 0;
  const { data: p1 } = await supabase
    .from('etalase')
    .select('harga_jual')
    .eq('id', productId)
    .maybeSingle();

  if (p1 && p1.harga_jual) {
    hargaFinal = Number(p1.harga_jual);
  } else {
    const { data: p2 } = await supabase
      .from('etalase')
      .select('harga_jual')
      .eq('produk_id', productId)
      .maybeSingle();
    if (p2 && p2.harga_jual) hargaFinal = Number(p2.harga_jual);
  }

  // 3. Upsert ke tabel `keranjang_item` (⚠️ TANPA MENGISI SUBTOTAL)
  const { data: existingItem } = await supabase
    .from('keranjang_item')
    .select('id, jumlah')
    .eq('keranjang_id', cartData.id)
    .eq('produk_id', productId)
    .maybeSingle();

  if (existingItem) {
    const newQty = (existingItem.jumlah || 0) + qty;
    const { data, error } = await supabase
      .from('keranjang_item')
      .update({
        jumlah: newQty,
        harga: hargaFinal
      })
      .eq('id', existingItem.id)
      .select()
      .single();

    if (error) {
      console.error('addToCart update error:', error.message);
      alert(`Supabase Error (Update Item): ${error.message}`);
      return null;
    }
    return data;
  } else {
    const { data, error } = await supabase
      .from('keranjang_item')
      .insert({
        keranjang_id: cartData.id,
        produk_id: productId,
        jumlah: qty,
        harga: hargaFinal
      })
      .select()
      .single();

    if (error) {
      console.error('addToCart insert error:', error.message);
      alert(`Supabase Error (Insert Item): ${error.message}`);
      return null;
    }
    return data;
  }
}

export async function updateCartQty(cartItemId: string, qty: number): Promise<boolean> {
  const { error } = await supabase
    .from('keranjang_item')
    .update({
      jumlah: qty
    })
    .eq('id', cartItemId);

  if (error) {
    console.error('updateCartQty error:', error.message);
    return false;
  }
  return true;
}

export async function removeFromCart(cartItemId: string): Promise<boolean> {
  const { error } = await supabase
    .from('keranjang_item')
    .delete()
    .eq('id', cartItemId);

  if (error) {
    console.error('removeFromCart error:', error.message);
    return false;
  }
  return true;
}

export async function clearCart(): Promise<boolean> {
  const pembeliId = await getCurrentUserId();
  if (!pembeliId) return false;

  const { data: cartData } = await supabase
    .from('keranjang')
    .select('id')
    .eq('pembeli_id', pembeliId)
    .maybeSingle();

  if (!cartData) return true;

  const { error } = await supabase
    .from('keranjang_item')
    .delete()
    .eq('keranjang_id', cartData.id);

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
      nama: mp?.nama || '',
      jumlah: row.stok || 0,
      satuan: mp?.satuan || 'kg',
      batasMinimum: row.stok_minimum || 0,
      hargaBeli: mp?.harga || 0,
      hargaJual: Math.round((mp?.harga || 0) * 1.3),
      diskonPersen: 0,
      grade: 'Belum Dinilai' as const,
      asalProdusen: mp?.produsen ? `${mp.produsen.nama_usaha || mp.produsen.desa || ''}` : '',
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
    stok_minimum: item.stok_minimum || 0,
  };

  const { data, error } = await supabase
    .from('inventaris')
    .upsert(insertPayload, { onConflict: 'produk_id' })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('addInventarisAdminToko error:', error.message);
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
    console.error('updateInventarisStok error:', error.message);
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