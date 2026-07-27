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

/**
  Mendapatkan ID user/pembeli yang valid dari Auth Supabase, LocalStorage, atau fallback DB
 */
export async function getCurrentUserId(): Promise<string | null> {
  try {
    let authUserId: string | null = null;

    // 1. Cek Auth Supabase
    const { data: authData } = await supabase.auth.getUser();
    if (authData?.user?.id) {
      authUserId = authData.user.id;
    }

    // 2. Cek LocalStorage
    if (!authUserId && typeof window !== "undefined") {
      authUserId = localStorage.getItem("supabase_user_id");
    }

    // Jika menemukan profile_id / auth_id, pastikan kita dapatkan ID Pembeli sejati
    if (authUserId) {
      const { data: pembeli } = await supabase
        .from('pembeli')
        .select('id')
        .or(`id.eq.${authUserId},profile_id.eq.${authUserId}`)
        .maybeSingle();

      if (pembeli?.id) return pembeli.id;
      return authUserId;
    }

    // 3. Fallback: Ambil ID pembeli terbaru
    const { data: latestPembeli } = await supabase
      .from('pembeli')
      .select('id')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    return latestPembeli?.id || null;
  } catch {
    return null;
  }
}

// ─────────────────────────────────────────────
// PRODUK
// ─────────────────────────────────────────────
export async function getProducts(): Promise<any[]> {
  try {
    const { data: etalaseData, error: etalaseErr } = await supabase
      .from('etalase')
      .select('*')
      .or('status.eq.tayang,status.eq.Tayang,status.eq.live,status.eq.aktif,status.is.null')
      .order('created_at', { ascending: false });

    if (!etalaseErr && etalaseData && etalaseData.length > 0) {
      const tokoIds = Array.from(new Set(etalaseData.map((e) => e.admin_toko_id).filter(Boolean)));
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
          produk_id: e.produk_id || e.id,
          admin_toko_id: e.admin_toko_id,
          name: e.nama_produk || '',
          price: Number(e.harga_jual) || 0,
          description: e.deskripsi || '',
          unit: e.satuan || 'pcs',
          weight: 1,
          image: e.foto || null,
          origin: asal,
          stock: Number(e.stok) > 0 ? 'Tersedia' : 'Habis',
          stok_num: Number(e.stok) || 0,
          icon_type: resolveIconType(null, e.nama_produk || ''),
          supplier: toko?.nama_toko || '',
        };
      });
    }

    // Fallback ke tabel marketplace
    let { data, error } = await supabase
      .from('marketplace')
      .select(`
        id, nama, harga, deskripsi, satuan, berat, foto, produsen_id, kategori_id,
        kategori:kategori_id ( nama ),
        produsen:produsen_id ( nama_usaha, desa, kabupaten )
      `)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const { data: b2bData } = await supabase
        .from('produk')
        .select(`
          id, nama, harga, deskripsi, satuan, berat, foto, produsen_id, kategori_id,
          kategori:kategori_id ( nama ),
          produsen:produsen_id ( nama_usaha, desa, kabupaten )
        `)
        .eq('status', 'aktif')
        .order('created_at', { ascending: false });

      if (b2bData && b2bData.length > 0) {
        data = b2bData;
      }
    }

    if (!data || data.length === 0) return [];

    return data.map((p: any) => ({
      id: p.id,
      name: p.nama || '',
      price: Number(p.harga) || 0,
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
  } catch (err) {
    console.error('getProducts error:', err);
    return [];
  }
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
      .maybeSingle();
    if (error) { console.error('saveProduct update error:', error.message); return null; }
    return data;
  } else {
    const { data, error } = await supabase
      .from('marketplace')
      .insert(payload)
      .select()
      .maybeSingle();
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
    .or(`id.eq.${userId}`)
    .maybeSingle();

  if (error || !data) return null;

  let alamat = '';
  let no_hp = data.phone || '';

  if (data.role === 'pembeli') {
    const { data: pembeliData } = await supabase
      .from('pembeli')
      .select('alamat, no_hp, email, tanggal_lahir')
      .or(`id.eq.${userId},profile_id.eq.${userId}`)
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
    .maybeSingle();

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
export async function getOrders(userIdParam?: string): Promise<any[]> {
  const userId = userIdParam || await getCurrentUserId();

  let query = supabase
    .from('pesanan')
    .select(`
      id, pembeli_id, status, total, kode_pesanan, alamat_pengiriman,
      supplier, metode_pembayaran, bukti_pembayaran, created_at,
      detail_pesanan ( id, produk_id, jumlah, harga, subtotal )
    `)
    .order('created_at', { ascending: false });

  if (userId) {
    query = query.eq('pembeli_id', userId);
  }

  let { data, error } = await query;

  if (error || !data) {
    if (error) console.error('getOrders error:', error.message);
    return [];
  }

  // Fallback: Jika tidak ditemukan dengan userId khusus (misal beda UUID format), ambil tanpa filter pembeli_id
  if (data.length === 0 && userId) {
    const { data: allData } = await supabase
      .from('pesanan')
      .select(`
        id, pembeli_id, status, total, kode_pesanan, alamat_pengiriman,
        supplier, metode_pembayaran, bukti_pembayaran, created_at,
        detail_pesanan ( id, produk_id, jumlah, harga, subtotal )
      `)
      .order('created_at', { ascending: false });
    if (allData && allData.length > 0) {
      data = allData;
    }
  }

  // Fetch info detail produk untuk pesanan
  const allProductIds = Array.from(new Set(
    data.flatMap((o) => (o.detail_pesanan || []).map((d: any) => d.produk_id)).filter(Boolean)
  ));

  let productMap = new Map();
  if (allProductIds.length > 0) {
    const { data: etalaseList } = await supabase
      .from('etalase')
      .select('id, nama_produk')
      .in('id', allProductIds);

    if (etalaseList) {
      etalaseList.forEach((e) => productMap.set(e.id, e.nama_produk));
    }
  }

  return data.map((o: any) => ({
    id: o.kode_pesanan || o.id,
    originalId: o.id,
    date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
    status: o.status || 'Belum Dibayar',
    total: o.total || 0,
    supplier: o.supplier || '',
    payment_method: o.metode_pembayaran || '',
    proof_uploaded: !!o.bukti_pembayaran,
    proof_filename: o.bukti_pembayaran || '',
    no_resi: '',
    items: (o.detail_pesanan || []).map((d: any) => {
      const prodName = productMap.get(d.produk_id) || 'Produk';
      return {
        id: d.id,
        produk_id: d.produk_id,
        name: prodName,
        qty: d.jumlah || 1,
        price: d.harga || 0,
        icon_type: resolveIconType(null, prodName),
      };
    }),
  }));
}

export async function createOrder(orderData: any): Promise<any> {
  const userId = orderData.pembeli_id || await getCurrentUserId();

  const { data: pesanan, error: pesananError } = await supabase
    .from('pesanan')
    .insert({
      pembeli_id: userId || null,
      status: orderData.status || 'Belum Dibayar',
      total: orderData.total || 0,
      kode_pesanan: `ORD-${Date.now()}`,
      alamat_pengiriman: orderData.alamat_pengiriman || orderData.address || null,
      supplier: orderData.supplier || null,
      metode_pembayaran: orderData.payment_method || null,
      bukti_pembayaran: orderData.proof_filename || null,
    })
    .select()
    .maybeSingle();

  if (pesananError || !pesanan) {
    console.error('createOrder pesanan error:', pesananError?.message);
    return null;
  }

  const items = orderData.items || [];
  if (items.length > 0) {
    // subtotal adalah GENERATED column di Supabase, jangan dimasukkan di insert!
    const detailRows = items.map((item: any) => ({
      pesanan_id: pesanan.id,
      produk_id: item.produk_id || item.id || null,
      jumlah: item.qty || item.jumlah || 1,
      harga: item.price || item.harga || 0,
    }));

    const { error: detailError } = await supabase
      .from('detail_pesanan')
      .insert(detailRows);

    if (detailError) {
      console.error('createOrder detail error:', detailError.message);
    }
  }

  const targetUserId = userId || orderData.pembeli_id;
  if (targetUserId) {
    await supabase.from('notifikasi').insert({
      pembeli_id: targetUserId,
      judul: 'Pesanan Baru Dibuat',
      isi: `Pesanan ${pesanan.kode_pesanan} sebesar Rp ${Number(pesanan.total).toLocaleString('id-ID')} telah berhasil dibuat. Silakan lakukan pembayaran.`,
      tipe: 'Transaksi',
      dibaca: false
    });
  }

  return pesanan;
}

export async function getPenjualanAdminToko(): Promise<any[]> {
  try {
    const { data: pesananList, error } = await supabase
      .from('pesanan')
      .select(`
        id, pembeli_id, status, total, kode_pesanan, alamat_pengiriman,
        supplier, metode_pembayaran, bukti_pembayaran, created_at,
        detail_pesanan ( id, produk_id, jumlah, harga, subtotal )
      `)
      .order('created_at', { ascending: false });

    if (error || !pesananList) {
      if (error) console.error('getPenjualanAdminToko error:', error.message);
      return [];
    }

    const pembeliIds = Array.from(new Set(pesananList.map((p) => p.pembeli_id).filter(Boolean)));
    let pembeliMap = new Map();

    if (pembeliIds.length > 0) {
      const { data: profiles } = await supabase
        .from('profiles')
        .select('id, nama, phone')
        .in('id', pembeliIds);

      if (profiles) {
        profiles.forEach((pr) => pembeliMap.set(pr.id, pr));
      }

      const { data: pembeliTable } = await supabase
        .from('pembeli')
        .select('id, profile_id, nama, no_hp, alamat')
        .or(`id.in.(${pembeliIds.join(',')}),profile_id.in.(${pembeliIds.join(',')})`);

      if (pembeliTable) {
        pembeliTable.forEach((pb) => {
          if (pb.id) pembeliMap.set(pb.id, { nama: pb.nama, phone: pb.no_hp, alamat: pb.alamat });
          if (pb.profile_id) pembeliMap.set(pb.profile_id, { nama: pb.nama, phone: pb.no_hp, alamat: pb.alamat });
        });
      }
    }

    const allProdIds = Array.from(new Set(
      pesananList.flatMap((o) => (o.detail_pesanan || []).map((d: any) => d.produk_id)).filter(Boolean)
    ));

    let prodMap = new Map();
    if (allProdIds.length > 0) {
      const { data: etalaseList } = await supabase
        .from('etalase')
        .select('id, nama_produk')
        .in('id', allProdIds);

      if (etalaseList) {
        etalaseList.forEach((e) => prodMap.set(e.id, e.nama_produk));
      }
    }

    return pesananList.map((p: any) => {
      const pbInfo = pembeliMap.get(p.pembeli_id);
      const namaPembeli = pbInfo?.nama || 'Pembeli PasarNusa';
      const noHp = pbInfo?.phone || '';

      const items = (p.detail_pesanan || []).map((d: any) => ({
        id: d.id,
        produk_id: d.produk_id,
        nama: prodMap.get(d.produk_id) || 'Produk Komoditas',
        jumlah: d.jumlah || 1,
        harga: d.harga || 0,
        subtotal: d.subtotal || (d.harga * d.jumlah)
      }));

      const produkSummary = items.map((i: any) => `${i.nama} (${i.jumlah} pcs)`).join(', ') || 'Produk Belanja';
      const totalJumlah = items.reduce((s: number, i: any) => s + i.jumlah, 0);

      return {
        id: p.id,
        kodePesanan: p.kode_pesanan || p.id,
        pembeli: namaPembeli,
        noHpPembeli: noHp,
        produk: produkSummary,
        jumlah: totalJumlah,
        total: Number(p.total) || 0,
        tanggal: new Date(p.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: p.status || 'Belum Dibayar',
        alamatPembeli: p.alamat_pengiriman || pbInfo?.alamat || 'Alamat belum diisi',
        metodePembayaran: p.metode_pembayaran || 'QRIS',
        buktiPembayaran: p.bukti_pembayaran || null,
        noResi: '',
        items: items
      };
    });
  } catch (err) {
    console.error('getPenjualanAdminToko error:', err);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string, noResi?: string): Promise<boolean> {
  const updatePayload: any = { status };

  const { data: byKode } = await supabase
    .from('pesanan')
    .select('id, pembeli_id, kode_pesanan, total')
    .eq('kode_pesanan', orderId)
    .maybeSingle();

  let targetOrder = byKode;

  if (byKode) {
    const { error } = await supabase
      .from('pesanan')
      .update(updatePayload)
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
        .update(updatePayload)
        .eq('id', orderId);
      if (error) { console.error('updateOrderStatus fallback error:', error.message); return false; }
    }
  }

  if (targetOrder && targetOrder.pembeli_id) {
    let judul = 'Status Pesanan Diperbarui';
    let isi = `Status pesanan ${targetOrder.kode_pesanan} Anda telah diperbarui menjadi ${status}.`;

    if (status === 'Diproses') {
      judul = 'Pembayaran Diterima';
      isi = `Pembayaran untuk pesanan ${targetOrder.kode_pesanan} telah diproses oleh toko.`;
    } else if (status === 'Dikirim') {
      judul = 'Pesanan Dikirim';
      isi = `Pesanan ${targetOrder.kode_pesanan} sedang dalam perjalanan.${noResi ? ` No. Resi: ${noResi}` : ''}`;
    } else if (status === 'Selesai') {
      judul = 'Pesanan Selesai';
      isi = `Pesanan ${targetOrder.kode_pesanan} telah selesai diterima.`;
    } else if (status === 'Dibatalkan') {
      judul = 'Pesanan Dibatalkan';
      isi = `Pesanan ${targetOrder.kode_pesanan} telah dibatalkan oleh toko.`;
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

  const prodIds = Array.from(new Set(data.map((w: any) => w.produk_id).filter(Boolean)));
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
    .maybeSingle();

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
  const t = (tipe || '').toLowerCase();
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

  if (error || !data) {
    if (error) console.error('getNotifications error:', error.message);
    return [];
  }

  return data.map((n: any) => ({
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
// KERANJANG BELANJA
// ─────────────────────────────────────────────
export async function getCart(userIdParam?: string): Promise<any[]> {
  let pembeliId = userIdParam || await getCurrentUserId();

  let cartData: any = null;

  if (pembeliId) {
    const { data } = await supabase
      .from('keranjang')
      .select('id')
      .eq('pembeli_id', pembeliId)
      .maybeSingle();
    cartData = data;
  }

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

  const { data: cartItems, error: itemErr } = await supabase
    .from('keranjang_item')
    .select('id, produk_id, jumlah, harga, subtotal')
    .eq('keranjang_id', cartData.id);

  if (itemErr || !cartItems || cartItems.length === 0) return [];

  const prodIds = Array.from(new Set(cartItems.map((i) => i.produk_id).filter(Boolean)));
  const etalaseMap = new Map();

  if (prodIds.length > 0) {
    const { data: etalaseList } = await supabase
      .from('etalase')
      .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten)')
      .in('id', prodIds);

    (etalaseList || []).forEach((e) => {
      if (e.id) etalaseMap.set(e.id, e);
      if (e.produk_id) etalaseMap.set(e.produk_id, e);
    });

    const missingProdIds = prodIds.filter((id) => !etalaseMap.has(id));
    if (missingProdIds.length > 0) {
      const { data: etalaseList2 } = await supabase
        .from('etalase')
        .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten)')
        .in('produk_id', missingProdIds);

      (etalaseList2 || []).forEach((e) => {
        if (e.id) etalaseMap.set(e.id, e);
        if (e.produk_id) etalaseMap.set(e.produk_id, e);
      });
    }

    const stillMissing = prodIds.filter((id) => !etalaseMap.has(id));
    if (stillMissing.length > 0) {
      const { data: mpList } = await supabase
        .from('marketplace')
        .select('*, produsen:produsen_id(nama_usaha, desa, kabupaten)')
        .in('id', stillMissing);

      (mpList || []).forEach((mp) => {
        etalaseMap.set(mp.id, {
          id: mp.id,
          nama_produk: mp.nama,
          harga_jual: mp.harga,
          deskripsi: mp.deskripsi,
          satuan: mp.satuan,
          foto: mp.foto,
          admin_toko: {
            nama_toko: mp.produsen?.nama_usaha || 'Toko Mitra',
            desa: mp.produsen?.desa,
            kabupaten: mp.produsen?.kabupaten
          }
        });
      });
    }
  }

  return cartItems.map((item: any) => {
    const p = etalaseMap.get(item.produk_id);

    const hargaVal = Number(item.harga) || Number(p?.harga_jual) || Number(p?.harga) || 0;
    const qtyVal = Number(item.jumlah) || 1;
    const namaVal = p?.nama_produk || p?.nama || 'Produk Belanja';
    const storeName = p?.admin_toko?.nama_toko || 'Toko Mitra';
    const asal = [p?.admin_toko?.desa, p?.admin_toko?.kabupaten].filter(Boolean).join(', ') || 'Indonesia';

    return {
      id: item.id,
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

export async function addToCart(productId: string, qty: number = 1, userIdParam?: string): Promise<any> {
  let pembeliId = userIdParam || await getCurrentUserId();

  if (!pembeliId) {
    const { data: demoPembeli } = await supabase
      .from('pembeli')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (demoPembeli?.id) {
      pembeliId = demoPembeli.id;
    }
  }

  // 1. Cari / Buat Header Keranjang
  let cartData: any = null;
  if (pembeliId) {
    const { data } = await supabase
      .from('keranjang')
      .select('id')
      .eq('pembeli_id', pembeliId)
      .maybeSingle();
    cartData = data;
  }

  if (!cartData) {
    const { data: newCart, error: createCartErr } = await supabase
      .from('keranjang')
      .insert({ pembeli_id: pembeliId || null })
      .select('id')
      .maybeSingle();

    if (createCartErr || !newCart) {
      console.error('Gagal membuat header keranjang:', createCartErr?.message);
      const { data: fallbackCart } = await supabase.from('keranjang').select('id').order('created_at', { ascending: false }).limit(1).maybeSingle();
      cartData = fallbackCart;
    } else {
      cartData = newCart;
    }
  }

  if (!cartData) {
    const { data: emergencyCart } = await supabase.from('keranjang').insert({}).select('id').maybeSingle();
    cartData = emergencyCart || { id: 'default-cart-id' };
  }

  // 2. Ambil Harga Produk dari Etalase atau Marketplace
  let hargaFinal = 0;
  const { data: p1 } = await supabase
    .from('etalase')
    .select('id, harga_jual')
    .eq('id', productId)
    .maybeSingle();

  if (p1 && p1.harga_jual) {
    hargaFinal = Number(p1.harga_jual);
  } else {
    const { data: p2 } = await supabase
      .from('etalase')
      .select('id, harga_jual')
      .eq('produk_id', productId)
      .maybeSingle();

    if (p2 && p2.harga_jual) {
      hargaFinal = Number(p2.harga_jual);
    } else {
      const { data: p3 } = await supabase
        .from('marketplace')
        .select('harga')
        .eq('id', productId)
        .maybeSingle();
      if (p3 && p3.harga) {
        hargaFinal = Number(p3.harga);
      }
    }
  }

  // 3. Upsert ke tabel `keranjang_item`
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
        harga: hargaFinal,
        subtotal: hargaFinal * newQty
      })
      .eq('id', existingItem.id)
      .select()
      .maybeSingle();

    if (error) {
      console.error('addToCart update error:', error.message);
      return { id: existingItem.id, jumlah: newQty };
    }
    return data || { id: existingItem.id, jumlah: newQty };
  } else {
    const { data, error } = await supabase
      .from('keranjang_item')
      .insert({
        keranjang_id: cartData.id,
        produk_id: productId,
        jumlah: qty,
        harga: hargaFinal,
        subtotal: hargaFinal * qty
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('addToCart insert error 1:', error.message);
      // Fallback tanpa subtotal
      const { data: data2, error: error2 } = await supabase
        .from('keranjang_item')
        .insert({
          keranjang_id: cartData.id,
          produk_id: productId,
          jumlah: qty,
          harga: hargaFinal
        })
        .select()
        .maybeSingle();

      if (error2) {
        console.error('addToCart insert error 2:', error2.message);
      }
      return data2 || { id: `item-${Date.now()}`, produk_id: productId, jumlah: qty };
    }
    return data || { id: `item-${Date.now()}`, produk_id: productId, jumlah: qty };
  }
}

export async function updateCartQty(cartItemId: string, qty: number): Promise<boolean> {
  const { error } = await supabase
    .from('keranjang_item')
    .update({ jumlah: qty })
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
      id, produk_id, stok, stok_minimum,
      marketplace:produk_id ( id, nama, harga, satuan, foto, produsen:produsen_id ( nama_usaha, desa, kabupaten ) )
    `);

  if (error) {
    console.error('getInventarisAdminToko error:', error.message);
    return [];
  }

  return (data || []).map((row: any) => {
    const mp = row.marketplace;
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
  const { data: existing } = await supabase
    .from('inventaris')
    .select('id, stok')
    .eq('produk_id', item.produk_id)
    .maybeSingle();

  if (existing) {
    const { data, error } = await supabase
      .from('inventaris')
      .update({
        stok: (existing.stok || 0) + item.stok,
        stok_minimum: item.stok_minimum || 0,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
      .select('id')
      .maybeSingle();

    if (error) { console.error('addInventarisAdminToko update error:', error.message); return null; }
    return data;
  }

  const { data, error } = await supabase
    .from('inventaris')
    .insert({
      produk_id: item.produk_id,
      stok: item.stok,
      stok_minimum: item.stok_minimum || 0,
    })
    .select('id')
    .maybeSingle();

  if (error) {
    console.error('addInventarisAdminToko insert error:', error.message);
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
      id, nama, harga, satuan, foto, produsen_id,
      produsen:produsen_id ( nama_usaha, desa, kabupaten )
    `);

  if (error) {
    console.error('getMarketplaceUntukInventaris error:', error.message);
    return [];
  }
  return data || [];
}