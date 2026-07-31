import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Variabel lingkungan Supabase belum terdeteksi di file .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: { autoRefreshToken: false, persistSession: false }
});

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

export function extractBeratFromItem(e: any): number {
  if (typeof e?.berat === 'number' && e.berat > 0) return e.berat;
  if (typeof e?.berat_kg === 'number' && e.berat_kg > 0) return e.berat_kg;
  if (e?.deskripsi) {
    const match = String(e.deskripsi).match(/\[BERAT:([\d.]+)(?:kg)?\]/i);
    if (match && match[1]) {
      const parsed = parseFloat(match[1]);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return 1.0;
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    let authUserId: string | null = null;

    try {
      const { data: authData } = await supabase.auth.getUser();
      if (authData?.user?.id) {
        authUserId = authData.user.id;
      }
    } catch (eAuth) {
      console.warn('getCurrentUserId auth.getUser exception:', eAuth);
    }

    if (!authUserId && typeof window !== "undefined") {
      authUserId = localStorage.getItem("supabase_user_id") || localStorage.getItem("pembeli_id");
    }

    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    if (authUserId && isValidUuid(authUserId)) {
      try {
        const { data: pembeli } = await supabase
          .from('pembeli')
          .select('id')
          .or(`id.eq.${authUserId},profile_id.eq.${authUserId}`)
          .maybeSingle();

        if (pembeli?.id) return pembeli.id;
      } catch (ePembeli) {
        console.warn('getCurrentUserId pembeli select exception:', ePembeli);
      }
      return authUserId;
    }

    try {
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
  } catch {
    return null;
  }
}

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
        // 💡 AMBIL KOLOM 'status' DARI TABEL admin_toko
        const { data: tokoList } = await supabase
          .from('admin_toko')
          .select('id, nama_toko, desa, kabupaten, status')
          .in('id', tokoIds);

        if (tokoList) {
          tokoMap = new Map(tokoList.map((t) => [t.id, t]));
        }
      }

      // 💡 FILTER: BUANG SEMUA PRODUK YANG TOKONYA BERSTATUS SUSPENDED / NONAKTIF
      const activeEtalaseData = etalaseData.filter((e) => {
        const toko = tokoMap.get(e.admin_toko_id);
        if (!toko) return true;
        const st = String(toko.status || '').toLowerCase().trim();
        return st !== 'suspended' && st !== 'nonaktif' && st !== 'terblokir';
      });

      return activeEtalaseData.map((e: any) => {
        const toko = tokoMap.get(e.admin_toko_id);
        const asal = [toko?.desa, toko?.kabupaten].filter(Boolean).join(', ');

        return {
          id: e.id,
          produk_id: e.produk_id || e.id,
          admin_toko_id: e.admin_toko_id,
          name: e.nama_produk || '',
          price: Number(e.harga_jual) || 0,
          description: (e.deskripsi || '').replace(/\[BERAT:[\d.]+(?:kg)?\]/gi, '').trim(),
          unit: e.satuan || 'pcs',
          weight: extractBeratFromItem(e),
          image: e.foto || null,
          origin: asal,
          stock: Number(e.stok) > 0 ? 'Tersedia' : 'Habis',
          stok_num: Number(e.stok) || 0,
          icon_type: resolveIconType(null, e.nama_produk || ''),
          supplier: toko?.nama_toko || '',
        };
      });
    }

    let { data, error } = await supabase
      .from('marketplace')
      .select(`
        id, nama, harga, deskripsi, satuan, berat, foto, produsen_id, kategori_id,
        kategori:kategori_id ( nama ),
        produsen:produsen_id ( nama_usaha, desa, kabupaten, status )
      `)
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      const { data: b2bData } = await supabase
        .from('produk')
        .select(`
          id, nama, harga, deskripsi, satuan, berat, foto, produsen_id, kategori_id,
          kategori:kategori_id ( nama ),
          produsen:produsen_id ( nama_usaha, desa, kabupaten, status )
        `)
        .eq('status', 'aktif')
        .order('created_at', { ascending: false });

      if (b2bData && b2bData.length > 0) {
        data = b2bData;
      }
    }

    if (!data || data.length === 0) return [];

    // 💡 FILTER FALLBACK MARKETPLACE UNTUK MENYEMBUNYIKAN PRODUSEN TER-SUSPEND
    const filteredMarketplace = data.filter((p: any) => {
      const st = String(p.produsen?.status || '').toLowerCase().trim();
      return st !== 'suspended' && st !== 'nonaktif' && st !== 'terblokir';
    });

    return filteredMarketplace.map((p: any) => ({
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

export async function getOrders(userIdParam?: string): Promise<any[]> {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    const userIds: string[] = [];

    if (userIdParam && isValidUuid(userIdParam)) {
      userIds.push(userIdParam);
    }

    const currentId = await getCurrentUserId();
    if (currentId && isValidUuid(currentId) && !userIds.includes(currentId)) {
      userIds.push(currentId);
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user?.id && isValidUuid(user.id) && !userIds.includes(user.id)) {
        userIds.push(user.id);
      }
    } catch { }

    if (typeof window !== "undefined") {
      const ls1 = localStorage.getItem("supabase_user_id");
      const ls2 = localStorage.getItem("pembeli_id");
      if (ls1 && isValidUuid(ls1) && !userIds.includes(ls1)) userIds.push(ls1);
      if (ls2 && isValidUuid(ls2) && !userIds.includes(ls2)) userIds.push(ls2);
    }

    if (userIds.length > 0) {
      try {
        const { data: pembeliRows } = await supabase
          .from('pembeli')
          .select('id, profile_id')
          .or(`id.in.(${userIds.join(',')}),profile_id.in.(${userIds.join(',')})`);

        if (pembeliRows) {
          pembeliRows.forEach((pb) => {
            if (pb.id && isValidUuid(pb.id) && !userIds.includes(pb.id)) userIds.push(pb.id);
            if (pb.profile_id && isValidUuid(pb.profile_id) && !userIds.includes(pb.profile_id)) userIds.push(pb.profile_id);
          });
        }
      } catch (ePembeli) {
        console.warn('getOrders pembeli query exception:', ePembeli);
      }
    }

    let query = supabase
      .from('pesanan')
      .select(`
        id, pembeli_id, status, total, kode_pesanan, alamat_pengiriman,
        supplier, metode_pembayaran, bukti_pembayaran, created_at, rating, ulasan, produk_id, jumlah,
        detail_pesanan ( id, produk_id, jumlah, harga, subtotal )
      `)
      .order('created_at', { ascending: false });

    if (userIds.length > 0) {
      query = query.or(`pembeli_id.in.(${userIds.join(',')}),pembeli_id.is.null`);
    }

    let { data, error } = await query;

    if (error || !data) {
      if (error) console.error('getOrders error:', error.message);
      return [];
    }

    const allProductIds = Array.from(new Set([
      ...data.flatMap((o) => (o.detail_pesanan || []).map((d: any) => d.produk_id)),
      ...data.map((o) => o.produk_id)
    ].filter(Boolean)));

    let productMap = new Map();
    if (allProductIds.length > 0) {
      try {
        const { data: etalaseList } = await supabase
          .from('etalase')
          .select('id, produk_id, nama_produk')
          .in('id', allProductIds);

        if (etalaseList) {
          etalaseList.forEach((e) => {
            if (e.id) productMap.set(e.id, e.nama_produk);
            if (e.produk_id) productMap.set(e.produk_id, e.nama_produk);
          });
        }

        const missingIds = allProductIds.filter((id) => !productMap.has(id));
        if (missingIds.length > 0) {
          const { data: mpList } = await supabase
            .from('marketplace')
            .select('id, nama')
            .in('id', missingIds);

          if (mpList) {
            mpList.forEach((m) => productMap.set(m.id, m.nama));
          }
        }

        const missingIds2 = allProductIds.filter((id) => !productMap.has(id));
        if (missingIds2.length > 0) {
          const { data: prodList } = await supabase
            .from('produk')
            .select('id, nama')
            .in('id', missingIds2);

          if (prodList) {
            prodList.forEach((p) => productMap.set(p.id, p.nama));
          }
        }
      } catch (eProd) {
        console.warn('getOrders product mapping exception:', eProd);
      }
    }

    return data.map((o: any) => {
      let mappedItems: any[] = [];
      if (o.detail_pesanan && o.detail_pesanan.length > 0) {
        mappedItems = o.detail_pesanan.map((d: any) => {
          const prodName = productMap.get(d.produk_id) || 'Produk Belanja';
          return {
            id: d.id,
            produk_id: d.produk_id,
            name: prodName,
            qty: d.jumlah || 1,
            price: d.harga || 0,
            icon_type: resolveIconType(null, prodName),
          };
        });
      } else if (o.produk_id) {
        const prodName = productMap.get(o.produk_id) || (o.supplier ? `Produk (${o.supplier})` : 'Produk Belanja');
        mappedItems = [{
          id: `item-${o.id}`,
          produk_id: o.produk_id,
          name: prodName,
          qty: o.jumlah || 1,
          price: o.total || 0,
          icon_type: resolveIconType(null, prodName),
        }];
      } else {
        const prodName = o.supplier ? `Produk (${o.supplier})` : 'Produk Belanja';
        mappedItems = [{
          id: `item-${o.id}`,
          produk_id: null,
          name: prodName,
          qty: 1,
          price: o.total || 0,
          icon_type: resolveIconType(null, prodName),
        }];
      }

      return {
        id: o.kode_pesanan || o.id,
        originalId: o.id,
        date: new Date(o.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        status: o.status || 'Belum Dibayar',
        total: o.total || 0,
        supplier: o.supplier || '',
        payment_method: o.metode_pembayaran || '',
        proof_uploaded: !!o.bukti_pembayaran,
        proof_filename: o.bukti_pembayaran || '',
        bukti_pembayaran: o.bukti_pembayaran || null,
        no_resi: '',
        rating: o.rating || null,
        ulasan: o.ulasan || null,
        items: mappedItems,
      };
    });
  } catch (errGlobal) {
    console.error('getOrders global catch error:', errGlobal);
    return [];
  }
}

export async function createOrder(orderData: any): Promise<any> {
  const isValidUuid = (id: string | null | undefined): boolean => {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  let userId: string | null = orderData.pembeli_id || await getCurrentUserId();
  if (userId && !isValidUuid(userId)) {
    const fallbackId = await getCurrentUserId();
    userId = isValidUuid(fallbackId) ? fallbackId : null;
  }

  const itemsList = orderData.items || [];
  const firstItem = itemsList[0] || {};
  const firstProdId = firstItem.produk_id || firstItem.id || null;
  const firstQty = firstItem.qty || firstItem.jumlah || 1;

  let rawProof = orderData.bukti_pembayaran || orderData.proof_filename || null;

  let { data: pesanan, error: pesananError } = await supabase
    .from('pesanan')
    .insert({
      pembeli_id: userId || null,
      status: orderData.status || 'Belum Dibayar',
      total: orderData.total || 0,
      kode_pesanan: `ORD-${Date.now()}`,
      alamat_pengiriman: orderData.alamat_pengiriman || orderData.address || null,
      supplier: orderData.supplier || null,
      metode_pembayaran: orderData.payment_method || null,
      bukti_pembayaran: rawProof,
      produk_id: isValidUuid(firstProdId) ? firstProdId : null,
      jumlah: firstQty,
    })
    .select()
    .maybeSingle();

  if (pesananError || !pesanan) {
    console.error('createOrder initial pesanan error:', pesananError?.message);

    const safeProof = rawProof && rawProof.length > 250 ? 'Bukti Terunggah' : rawProof;

    const { data: pesananRetry, error: errRetry } = await supabase
      .from('pesanan')
      .insert({
        pembeli_id: userId || null,
        status: orderData.status || 'Belum Dibayar',
        total: orderData.total || 0,
        kode_pesanan: `ORD-${Date.now()}`,
        alamat_pengiriman: orderData.alamat_pengiriman || orderData.address || null,
        supplier: orderData.supplier || null,
        metode_pembayaran: orderData.payment_method || null,
        bukti_pembayaran: rawProof,
        produk_id: null,
        jumlah: firstQty,
      })
      .select()
      .maybeSingle();

    if (errRetry || !pesananRetry) {
      console.error('createOrder retry pesanan error:', errRetry?.message);

      const { data: pesananFallback1, error: errFallback1 } = await supabase
        .from('pesanan')
        .insert({
          pembeli_id: null,
          status: orderData.status || 'Belum Dibayar',
          total: orderData.total || 0,
          kode_pesanan: `ORD-${Date.now()}`,
          alamat_pengiriman: orderData.alamat_pengiriman || orderData.address || null,
          supplier: orderData.supplier || null,
          metode_pembayaran: orderData.payment_method || null,
          bukti_pembayaran: rawProof,
        })
        .select()
        .maybeSingle();

      if (errFallback1 || !pesananFallback1) {
        console.error('createOrder fallback1 pesanan error:', errFallback1?.message);

        const { data: pesananFallback2, error: errFallback2 } = await supabase
          .from('pesanan')
          .insert({
            status: orderData.status || 'Belum Dibayar',
            total: orderData.total || 0,
            kode_pesanan: `ORD-${Date.now()}`,
            supplier: orderData.supplier || null,
            metode_pembayaran: orderData.payment_method || 'QRIS',
            bukti_pembayaran: rawProof,
          })
          .select()
          .maybeSingle();

        if (errFallback2 || !pesananFallback2) {
          console.error('createOrder fallback2 pesanan error:', errFallback2?.message);
          pesanan = {
            id: `ORD-${Date.now()}`,
            kode_pesanan: `ORD-${Date.now()}`,
            status: orderData.status || 'Belum Dibayar',
            total: orderData.total || 0,
            supplier: orderData.supplier || null,
            bukti_pembayaran: rawProof
          };
        } else {
          pesanan = pesananFallback2;
        }
      } else {
        pesanan = pesananFallback1;
      }
    } else {
      pesanan = pesananRetry;
    }
  }

  const items = orderData.items || [];
  if (items.length > 0 && pesanan?.id) {
    const detailRows = items.map((item: any) => {
      const prodId = item.produk_id || item.id || null;
      return {
        pesanan_id: pesanan.id,
        produk_id: isValidUuid(prodId) ? prodId : null,
        jumlah: item.qty || item.jumlah || 1,
        harga: item.price || item.harga || 0,
      };
    });

    const { error: detailError } = await supabase
      .from('detail_pesanan')
      .insert(detailRows);

    if (detailError) {
      console.error('createOrder detail error:', detailError.message);
      for (const row of detailRows) {
        const { error: singleErr } = await supabase.from('detail_pesanan').insert({
          pesanan_id: row.pesanan_id,
          produk_id: row.produk_id,
          jumlah: row.jumlah,
          harga: row.harga
        });
        if (singleErr) {
          await supabase.from('detail_pesanan').insert({
            pesanan_id: row.pesanan_id,
            produk_id: null,
            jumlah: row.jumlah,
            harga: row.harga
          });
        }
      }
    }
  }

  const targetUserId = userId || orderData.pembeli_id;
  const validTarget = targetUserId && isValidUuid(targetUserId) ? targetUserId : null;
  const totalFormatted = `Rp ${Number(pesanan.total || 0).toLocaleString('id-ID')}`;

  let profileIdForNotif: string | null = null;
  if (validTarget) {
    const { data: pembeliData } = await supabase
      .from('pembeli')
      .select('profile_id')
      .eq('id', validTarget)
      .maybeSingle();
    profileIdForNotif = pembeliData?.profile_id || validTarget;
  }

  try {
    if (pesanan.status === 'Belum Dibayar' || !pesanan.status) {
      const { error: notifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: validTarget,
        judul: 'Pesanan Belum Dibayar',
        isi: `Pesanan ${pesanan.kode_pesanan} sebesar ${totalFormatted} telah berhasil dibuat. Segera selesaikan pembayaran.`,
        tipe: 'Transaksi',
        dibaca: false
      });
      if (notifErr) console.error('createOrder notif insert error:', notifErr.message);
    } else if (pesanan.status === 'Sudah Dibayar' || pesanan.status === 'Diproses' || pesanan.status === 'Selesai') {
      const { error: notifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: validTarget,
        judul: 'Pembelian Berhasil',
        isi: `Pembayaran pesanan ${pesanan.kode_pesanan} sebesar ${totalFormatted} telah berhasil dikonfirmasi. Terima kasih telah berbelanja.`,
        tipe: 'Transaksi',
        dibaca: false
      });
      if (notifErr) console.error('createOrder notif insert error:', notifErr.message);
    } else if (pesanan.status === 'Dibatalkan' || pesanan.status === 'Gagal') {
      const { error: notifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: validTarget,
        judul: 'Pesanan Dibatalkan',
        isi: `Pesanan ${pesanan.kode_pesanan} sebesar ${totalFormatted} gagal diproses atau telah dibatalkan.`,
        tipe: 'Transaksi',
        dibaca: false
      });
      if (notifErr) console.error('createOrder notif insert error:', notifErr.message);
    }
  } catch (e) {
    console.error('createOrder notifikasi error:', e);
  }

  return pesanan;
}

export async function getPenjualanAdminToko(): Promise<any[]> {
  try {
    const { data: pesananList, error } = await supabase
      .from('pesanan')
      .select(`
        id, pembeli_id, status, escrow_status, total, kode_pesanan, alamat_pengiriman,
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
        escrowStatus: p.escrow_status || (p.status === 'Selesai' ? 'Tersalur' : 'Ditahan'),
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

  if (targetOrder) {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    const totalStr = `Rp ${Number(targetOrder.total || 0).toLocaleString('id-ID')}`;

    let profileIdForNotif: string | null = null;
    if (targetOrder.pembeli_id && isValidUuid(targetOrder.pembeli_id)) {
      const { data: pembeliData } = await supabase
        .from('pembeli')
        .select('profile_id')
        .eq('id', targetOrder.pembeli_id)
        .maybeSingle();
      profileIdForNotif = pembeliData?.profile_id || targetOrder.pembeli_id;
    }

    let judul = 'Status Pesanan Diperbarui';
    let isi = `Status pesanan ${targetOrder.kode_pesanan} Anda telah diperbarui menjadi ${status}.`;

    if (status === 'Belum Dibayar') {
      judul = 'Pesanan Belum Dibayar';
      isi = `Pesanan ${targetOrder.kode_pesanan} (${totalStr}) belum dibayar. Harap segera selesaikan pembayaran.`;
    } else if (status === 'Sudah Dibayar' || status === 'Diproses') {
      judul = 'Pembayaran Dikonfirmasi';
      isi = `Pembayaran pesanan ${targetOrder.kode_pesanan} (${totalStr}) berhasil dikonfirmasi dan sedang diproses toko.`;
    } else if (status === 'Dikirim' || status === 'Terkirim') {
      judul = 'Barang Sedang Dikirim';
      isi = `Pesanan ${targetOrder.kode_pesanan} (${totalStr}) sedang dalam pengiriman kurir.${noResi ? ` No. Resi: ${noResi}` : ''}`;
    } else if (status === 'Selesai') {
      judul = 'Barang Telah Diterima';
      isi = `Barang pesanan ${targetOrder.kode_pesanan} (${totalStr}) telah diterima. Terima kasih telah berbelanja di PasarNusa!`;
    } else if (status === 'Dibatalkan' || status === 'Gagal') {
      judul = 'Pesanan Dibatalkan';
      isi = `Pesanan ${targetOrder.kode_pesanan} (${totalStr}) gagal diproses atau telah dibatalkan.`;
    }

    try {
      const { error: notifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: targetOrder.pembeli_id || null,
        judul,
        isi,
        tipe: 'Transaksi',
        dibaca: false
      });
      if (notifErr) console.error('updateOrderStatus notifikasi insert error:', notifErr.message, notifErr);
    } catch (errNotif) {
      console.error('updateOrderStatus notifikasi catch error:', errNotif);
    }

    if (status === 'Selesai') {
      try {
        const { error: ulasanNotifErr } = await supabaseAdmin.from('notifikasi').insert({
          profile_id: profileIdForNotif,
          pembeli_id: targetOrder.pembeli_id || null,
          judul: 'Bagikan Ulasan Anda',
          isi: `Pesanan ${targetOrder.kode_pesanan} sudah diterima! Yuk bagikan pengalaman belanja Anda dengan memberikan ulasan bintang.`,
          tipe: 'Transaksi',
          dibaca: false,
        });
        if (ulasanNotifErr) console.error('review reminder notif error:', ulasanNotifErr.message);
      } catch (errUlasanNotif) {
        console.error('updateOrderStatus ulasan reminder notif error:', errUlasanNotif);
      }
    }
  }

  return true;
}

export async function getWishlist(): Promise<any[]> {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    const userId = await getCurrentUserId();
    const validUser = userId && isValidUuid(userId) ? userId : null;

    let query = supabase
      .from('wishlist')
      .select('id, produk_id, pembeli_id, created_at')
      .order('created_at', { ascending: false });

    if (validUser) {
      query = query.eq('pembeli_id', validUser);
    }

    let { data, error } = await query;

    if (error || !data || data.length === 0) {
      const { data: allWish } = await supabase
        .from('wishlist')
        .select('id, produk_id, pembeli_id, created_at')
        .order('created_at', { ascending: false });
      if (allWish && allWish.length > 0) {
        data = allWish;
      }
    }

    if (!data || data.length === 0) return [];

    const prodIds = Array.from(new Set(data.map((w: any) => w.produk_id).filter(Boolean)));
    if (prodIds.length === 0) return [];

    let productMap = new Map<string, any>();

    const { data: etalaseList } = await supabase
      .from('etalase')
      .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten, status)')
      .in('id', prodIds);

    if (etalaseList) {
      etalaseList.forEach((e) => {
        if (e.id) productMap.set(e.id, e);
        if (e.produk_id) productMap.set(e.produk_id, e);
      });
    }

    const missingEtalaseIds = prodIds.filter((id) => !productMap.has(id));
    if (missingEtalaseIds.length > 0) {
      const { data: etalaseList2 } = await supabase
        .from('etalase')
        .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten, status)')
        .in('produk_id', missingEtalaseIds);

      if (etalaseList2) {
        etalaseList2.forEach((e) => {
          if (e.id) productMap.set(e.id, e);
          if (e.produk_id) productMap.set(e.produk_id, e);
        });
      }
    }

    const stillMissingIds = prodIds.filter((id) => !productMap.has(id));
    if (stillMissingIds.length > 0) {
      const { data: mpList } = await supabase
        .from('marketplace')
        .select('*, produsen:produsen_id(nama_usaha, desa, kabupaten, status)')
        .in('id', stillMissingIds);

      if (mpList) {
        mpList.forEach((mp) => {
          productMap.set(mp.id, {
            id: mp.id,
            nama_produk: mp.nama,
            harga_jual: mp.harga,
            deskripsi: mp.deskripsi,
            satuan: mp.satuan,
            stok: mp.stok || 10,
            foto: mp.foto,
            admin_toko: {
              nama_toko: mp.produsen?.nama_usaha || 'Toko Mitra',
              desa: mp.produsen?.desa,
              kabupaten: mp.produsen?.kabupaten,
              status: mp.produsen?.status
            }
          });
        });
      }
    }

    return data
      .filter((w: any) => {
        const p = productMap.get(w.produk_id);
        const st = String(p?.admin_toko?.status || '').toLowerCase().trim();
        return st !== 'suspended' && st !== 'nonaktif' && st !== 'terblokir';
      })
      .map((w: any) => {
        const p = productMap.get(w.produk_id) || {
          id: w.produk_id,
          nama_produk: 'Produk Favorit',
          harga_jual: 0,
          stok: 1,
          foto: null
        };

        const hargaVal = Number(p.harga_jual) || Number(p.harga) || 0;
        const namaVal = p.nama_produk || p.nama || 'Produk Favorit';
        const storeName = p.admin_toko?.nama_toko || 'Toko Mitra';
        const asal = [p.admin_toko?.desa, p.admin_toko?.kabupaten].filter(Boolean).join(', ') || 'Indonesia';

        return {
          id: w.id,
          product_id: w.produk_id,
          product: {
            id: p.id || w.produk_id,
            name: namaVal,
            price: hargaVal,
            stock: Number(p.stok || 1) > 0 ? 'Tersedia' : 'Habis',
            image: p.foto || null,
            foto: p.foto || null,
            supplier: storeName,
            origin: asal,
            icon_type: resolveIconType(null, namaVal)
          }
        };
      });
  } catch (err) {
    console.error('getWishlist error:', err);
    return [];
  }
}

export async function addToWishlist(productId: string): Promise<any> {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    const userId = await getCurrentUserId();
    const validUser = userId && isValidUuid(userId) ? userId : null;

    let checkQuery = supabase.from('wishlist').select('id').eq('produk_id', productId);
    if (validUser) {
      checkQuery = checkQuery.eq('pembeli_id', validUser);
    }
    const { data: existing } = await checkQuery.maybeSingle();

    if (existing) return existing;

    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        pembeli_id: validUser,
        produk_id: productId
      })
      .select()
      .maybeSingle();

    if (error) {
      console.error('addToWishlist initial error:', error.message);
      const { data: fallbackData, error: fallbackError } = await supabase
        .from('wishlist')
        .insert({
          pembeli_id: null,
          produk_id: productId
        })
        .select()
        .maybeSingle();

      if (fallbackError) {
        console.error('addToWishlist fallback error:', fallbackError.message);
        return { id: `wish-${Date.now()}`, produk_id: productId };
      }
      return fallbackData;
    }
    return data || { id: `wish-${Date.now()}`, produk_id: productId };
  } catch (e) {
    console.error('addToWishlist catch:', e);
    return { id: `wish-${Date.now()}`, produk_id: productId };
  }
}

export async function removeFromWishlist(productId: string): Promise<boolean> {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    if (!isValidUuid(productId)) {
      return true;
    }

    const userId = await getCurrentUserId();
    const validUser = userId && isValidUuid(userId) ? userId : null;

    let targetIds = [productId];
    const { data: etalaseMatch } = await supabase
      .from('etalase')
      .select('id, produk_id')
      .or(`id.eq.${productId},produk_id.eq.${productId}`);

    if (etalaseMatch && etalaseMatch.length > 0) {
      etalaseMatch.forEach((e) => {
        if (e.id) targetIds.push(e.id);
        if (e.produk_id) targetIds.push(e.produk_id);
      });
    }
    targetIds = Array.from(new Set(targetIds.filter((id) => isValidUuid(id))));

    await supabase
      .from('wishlist')
      .delete()
      .eq('id', productId);

    if (validUser) {
      await supabase
        .from('wishlist')
        .delete()
        .eq('pembeli_id', validUser)
        .in('produk_id', targetIds);
    }

    await supabase
      .from('wishlist')
      .delete()
      .in('produk_id', targetIds);

    return true;
  } catch (e) {
    console.error('removeFromWishlist catch:', e);
    return true;
  }
}

function resolveNotificationIcon(tipe: string): string {
  const t = (tipe || '').toLowerCase();
  if (t === 'promo') return 'dollar';
  if (t === 'keamanan') return 'lock';
  if (t === 'ulasan' || t === 'rating') return 'star';
  return 'bell';
}

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

export async function getCart(userIdParam?: string): Promise<any[]> {
  const isValidUuid = (id: string | null | undefined): boolean => {
    if (!id) return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
  };

  let pembeliId = userIdParam || await getCurrentUserId();
  if (pembeliId && !isValidUuid(pembeliId)) pembeliId = null;

  let cartIds: string[] = [];

  if (pembeliId) {
    const { data: userCarts } = await supabase
      .from('keranjang')
      .select('id')
      .eq('pembeli_id', pembeliId);
    if (userCarts && userCarts.length > 0) {
      cartIds = userCarts.map((c) => c.id);
    }
  }

  const { data: activeItemCarts } = await supabase
    .from('keranjang_item')
    .select('keranjang_id')
    .order('created_at', { ascending: false });

  if (activeItemCarts && activeItemCarts.length > 0) {
    activeItemCarts.forEach((i) => {
      if (i.keranjang_id && !cartIds.includes(i.keranjang_id)) {
        cartIds.push(i.keranjang_id);
      }
    });
  }

  if (cartIds.length === 0) return [];

  const { data: cartItems, error: itemErr } = await supabase
    .from('keranjang_item')
    .select('id, produk_id, jumlah, harga, subtotal, keranjang_id')
    .in('keranjang_id', cartIds)
    .order('created_at', { ascending: false });

  if (itemErr || !cartItems || cartItems.length === 0) return [];

  const prodIds = Array.from(new Set(cartItems.map((i) => i.produk_id).filter(Boolean)));
  const etalaseMap = new Map();

  if (prodIds.length > 0) {
    const { data: etalaseList } = await supabase
      .from('etalase')
      .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten, status)')
      .in('id', prodIds);

    (etalaseList || []).forEach((e) => {
      if (e.id) etalaseMap.set(e.id, e);
      if (e.produk_id) etalaseMap.set(e.produk_id, e);
    });

    const missingProdIds = prodIds.filter((id) => !etalaseMap.has(id));
    if (missingProdIds.length > 0) {
      const { data: etalaseList2 } = await supabase
        .from('etalase')
        .select('*, admin_toko:admin_toko_id(nama_toko, desa, kabupaten, status)')
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
        .select('*, produsen:produsen_id(nama_usaha, desa, kabupaten, status)')
        .in('id', stillMissing);

      (mpList || []).forEach((mp) => {
        etalaseMap.set(mp.id, {
          id: mp.id,
          nama_produk: mp.nama,
          harga_jual: mp.harga,
          deskripsi: mp.deskripsi,
          satuan: mp.satuan,
          foto: mp.foto,
          berat: mp.berat || mp.berat_kg || 1,
          admin_toko: {
            nama_toko: mp.produsen?.nama_usaha || 'Toko Mitra',
            desa: mp.produsen?.desa,
            kabupaten: mp.produsen?.kabupaten,
            status: mp.produsen?.status
          }
        });
      });
    }
  }

  return cartItems
    .filter((item: any) => {
      const p = etalaseMap.get(item.produk_id);
      const st = String(p?.admin_toko?.status || '').toLowerCase().trim();
      return st !== 'suspended' && st !== 'nonaktif' && st !== 'terblokir';
    })
    .map((item: any) => {
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
          description: (p?.deskripsi || '').replace(/\[BERAT:[\d.]+(?:kg)?\]/gi, '').trim(),
          unit: p?.satuan || 'pcs',
          weight: extractBeratFromItem(p),
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

    try {
      const isValidUuidFn = (id: string | null | undefined) =>
        !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);

      let profileIdForNotif: string | null = null;
      if (pembeliId && isValidUuidFn(pembeliId)) {
        const { data: pb } = await supabase
          .from('pembeli')
          .select('profile_id')
          .eq('id', pembeliId)
          .maybeSingle();
        profileIdForNotif = pb?.profile_id || pembeliId;
      }

      let namaProduk = 'Produk';
      const { data: prodInfo } = await supabase
        .from('etalase')
        .select('nama_produk')
        .eq('id', productId)
        .maybeSingle();
      if (prodInfo?.nama_produk) namaProduk = prodInfo.nama_produk;

      const hargaStr = hargaFinal > 0 ? ` (Rp ${hargaFinal.toLocaleString('id-ID')}/unit)` : '';
      const { error: cartNotifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: pembeliId || null,
        judul: 'Produk Masuk Keranjang',
        isi: `${namaProduk}${hargaStr} sebanyak ${qty} item berhasil ditambahkan ke keranjang belanja Anda.`,
        tipe: 'Transaksi',
        dibaca: false,
      });
      if (cartNotifErr) console.error('addToCart notif error:', cartNotifErr.message, cartNotifErr);
    } catch (errNotifCart) {
      console.error('addToCart notif catch:', errNotifCart);
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
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    let pembeliId = await getCurrentUserId();
    if (pembeliId && !isValidUuid(pembeliId)) {
      pembeliId = null;
    }

    let cartIds: string[] = [];

    if (pembeliId) {
      const { data } = await supabase
        .from('keranjang')
        .select('id')
        .eq('pembeli_id', pembeliId);
      if (data && data.length > 0) {
        cartIds = data.map((c) => c.id);
      }
    }

    const { data: activeItems } = await supabase
      .from('keranjang_item')
      .select('keranjang_id');

    if (activeItems && activeItems.length > 0) {
      activeItems.forEach((i) => {
        if (i.keranjang_id && !cartIds.includes(i.keranjang_id)) {
          cartIds.push(i.keranjang_id);
        }
      });
    }

    if (cartIds.length > 0) {
      await supabase
        .from('keranjang_item')
        .delete()
        .in('keranjang_id', cartIds);
    }

    await supabase
      .from('keranjang_item')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');

    return true;
  } catch (e) {
    console.error('clearCart error:', e);
    return false;
  }
}

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

export async function submitReview(
  orderId: string,
  rating: number,
  comment: string = 'Produk sangat baik dan sesuai deskripsi.',
  notifId?: string
): Promise<boolean> {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };

    let userId = await getCurrentUserId();
    if (userId && !isValidUuid(userId)) userId = null;

    const cleanComment = comment || 'Produk dalam kondisi baik dan sesuai pesanan.';

    let targetPesanan: any = null;
    let produkIdFound: string | null = null;

    const { data: pesananByDirect } = await supabaseAdmin
      .from('pesanan')
      .select('id, kode_pesanan, pembeli_id')
      .or(`id.eq.${orderId},kode_pesanan.eq.${orderId}`)
      .maybeSingle();

    targetPesanan = pesananByDirect;

    const targetNotifId = notifId || (isValidUuid(orderId) ? orderId : null);
    if (!targetPesanan && targetNotifId) {
      const { data: notifRecord } = await supabaseAdmin
        .from('notifikasi')
        .select('isi')
        .eq('id', targetNotifId)
        .maybeSingle();

      if (notifRecord?.isi) {
        const ordMatch = notifRecord.isi.match(/ORD-[A-Za-z0-9]+/);
        if (ordMatch && ordMatch[0]) {
          const { data: pesananByOrd } = await supabaseAdmin
            .from('pesanan')
            .select('id, kode_pesanan, pembeli_id')
            .eq('kode_pesanan', ordMatch[0])
            .maybeSingle();
          targetPesanan = pesananByOrd;
        }
      }
    }

    if (!targetPesanan) {
      const { data: pesananLatest } = await supabaseAdmin
        .from('pesanan')
        .select('id, kode_pesanan, pembeli_id')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle();
      targetPesanan = pesananLatest;
    }

    let finalPembeliId = userId;
    if (!finalPembeliId && targetPesanan?.pembeli_id) {
      finalPembeliId = targetPesanan.pembeli_id;
    }
    if (!finalPembeliId) {
      const { data: demoPembeli } = await supabaseAdmin.from('pembeli').select('id').limit(1).maybeSingle();
      finalPembeliId = demoPembeli?.id || null;
    }

    if (targetPesanan?.id) {
      await supabaseAdmin
        .from('pesanan')
        .update({
          rating: rating,
          ulasan: cleanComment
        })
        .eq('id', targetPesanan.id);

      const { data: details } = await supabaseAdmin
        .from('detail_pesanan')
        .select('id, produk_id')
        .eq('pesanan_id', targetPesanan.id);

      if (details && details.length > 0) {
        produkIdFound = details[0].produk_id || null;
      }

      await supabaseAdmin
        .from('detail_pesanan')
        .update({
          rating: rating,
          ulasan: cleanComment
        })
        .eq('pesanan_id', targetPesanan.id);
    }

    if (!produkIdFound) {
      const { data: p1 } = await supabaseAdmin.from('etalase').select('id').limit(1).maybeSingle();
      produkIdFound = p1?.id || null;
    }

    try {
      const { error: reviewErr1 } = await supabaseAdmin
        .from('review')
        .insert({
          produk_id: isValidUuid(produkIdFound) ? produkIdFound : null,
          pembeli_id: isValidUuid(finalPembeliId) ? finalPembeliId : null,
          rating: Number(rating),
          komentar: cleanComment,
          created_at: new Date().toISOString()
        });

      if (reviewErr1) {
        console.error('review insert attempt 1 failed:', reviewErr1.message, reviewErr1.code, reviewErr1.details);

        const { error: reviewErr2 } = await supabaseAdmin
          .from('review')
          .insert({
            pembeli_id: isValidUuid(finalPembeliId) ? finalPembeliId : null,
            rating: Number(rating),
            komentar: cleanComment,
            created_at: new Date().toISOString()
          });

        if (reviewErr2) {
          console.error('review insert attempt 2 failed:', reviewErr2.message, reviewErr2.code, reviewErr2.details);

          const { error: reviewErr3 } = await supabaseAdmin
            .from('review')
            .insert({
              rating: Number(rating),
              komentar: cleanComment
            });

          if (reviewErr3) {
            console.error('review insert attempt 3 (minimal) failed:', reviewErr3.message, reviewErr3.code, reviewErr3.details);
          } else {
            console.log('review insert attempt 3 (minimal) SUCCESS');
          }
        } else {
          console.log('review insert attempt 2 (no produk_id) SUCCESS');
        }
      } else {
        console.log('review insert attempt 1 (full) SUCCESS! produk_id:', produkIdFound, 'pembeli_id:', finalPembeliId);
      }
    } catch (errReview) {
      console.error('review insert catch:', errReview);
    }

    if (targetNotifId && isValidUuid(targetNotifId)) {
      await supabaseAdmin
        .from('notifikasi')
        .update({ dibaca: true })
        .eq('id', targetNotifId);
    }

    try {
      let profileIdForNotif: string | null = null;
      if (finalPembeliId && isValidUuid(finalPembeliId)) {
        const { data: pb } = await supabaseAdmin
          .from('pembeli')
          .select('profile_id')
          .eq('id', finalPembeliId)
          .maybeSingle();
        profileIdForNotif = pb?.profile_id || null;
      }

      const { error: reviewNotifErr } = await supabaseAdmin.from('notifikasi').insert({
        profile_id: profileIdForNotif,
        pembeli_id: finalPembeliId || null,
        judul: 'Ulasan Berhasil Terkirim',
        isi: `Terima kasih! Ulasan bintang ${rating} Anda ("${cleanComment.slice(0, 50)}${cleanComment.length > 50 ? '...' : ''}") telah berhasil disimpan.`,
        tipe: 'Transaksi',
        dibaca: false
      });
      if (reviewNotifErr) console.error('submitReview notif error:', reviewNotifErr.message);
    } catch (errNotif) {
      console.error('submitReview notifikasi insert error:', errNotif);
    }

    return true;
  } catch (err) {
    console.error('submitReview error:', err);
    return false;
  }
}

export async function getEscrowTransaksi(): Promise<any[]> {
  try {
    let { data: pesananList, error } = await supabase
      .from('pesanan')
      .select(`
        id, pembeli_id, status, total, total_harga, kode_pesanan, alamat_pengiriman,
        supplier, metode_pembayaran, bukti_pembayaran, created_at, produk_id, jumlah,
        detail_pesanan ( id, produk_id, jumlah, harga, subtotal )
      `)
      .order('created_at', { ascending: false });

    if (error || !pesananList) {
      if (error) console.error('getEscrowTransaksi error:', error.message);
      const { data: fallbackList } = await supabase
        .from('pesanan')
        .select('*')
        .order('created_at', { ascending: false });
      pesananList = fallbackList || [];
    }

    const rawList = pesananList || [];

    const pembeliIds = Array.from(new Set(rawList.map((p: any) => p.pembeli_id).filter(Boolean)));
    let pembeliMap = new Map();
    if (pembeliIds.length > 0) {
      const { data: profiles } = await supabase.from('profiles').select('id, nama').in('id', pembeliIds);
      if (profiles) profiles.forEach((pr) => pembeliMap.set(pr.id, pr.nama));

      const { data: pembeliTable } = await supabase.from('pembeli').select('id, profile_id, nama').or(`id.in.(${pembeliIds.join(',')}),profile_id.in.(${pembeliIds.join(',')})`);
      if (pembeliTable) {
        pembeliTable.forEach((pb) => {
          if (pb.id) pembeliMap.set(pb.id, pb.nama);
          if (pb.profile_id) pembeliMap.set(pb.profile_id, pb.nama);
        });
      }
    }

    const prodIds = Array.from(new Set(rawList.map((p: any) => p.produk_id).filter(Boolean)));
    let produsenMap = new Map();
    if (prodIds.length > 0) {
      const { data: produkList } = await supabase.from('produk').select('id, produsen_id').in('id', prodIds);
      if (produkList && produkList.length > 0) {
        const produsenIds = Array.from(new Set(produkList.map((pr: any) => pr.produsen_id).filter(Boolean)));
        if (produsenIds.length > 0) {
          const { data: prodData } = await supabase.from('produsen').select('id, nama_usaha').in('id', produsenIds);
          if (prodData) {
            const prodNameMap = new Map(prodData.map((p: any) => [p.id, p.nama_usaha]));
            produkList.forEach((pk: any) => {
              if (pk.produsen_id && prodNameMap.has(pk.produsen_id)) {
                produsenMap.set(pk.id, prodNameMap.get(pk.produsen_id));
              }
            });
          }
        }
      }
    }

    const mappedFromDb = rawList.map((p: any) => {
      const pembeliNama = pembeliMap.get(p.pembeli_id) || 'Pembeli PasarNusa';
      const tokoNama = p.supplier || 'Warung Makmur Jaya';
      const produsenNama = produsenMap.get(p.produk_id) || 'Keripik Tempe Sanan';
      const nominal = Number(p.total || p.total_harga || 0);

      let status: 'Ditahan' | 'Tersalur' | 'Disengketakan' = 'Ditahan';
      const rawEsc = (p.escrow_status || p.status || '').toLowerCase();
      if (rawEsc === 'tersalur' || rawEsc === 'selesai') {
        status = 'Tersalur';
      } else if (rawEsc === 'disengketakan' || rawEsc === 'sengketa') {
        status = 'Disengketakan';
      }

      const dateObj = p.created_at ? new Date(p.created_at) : new Date();
      const tanggal = dateObj.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });

      return {
        id: p.kode_pesanan || `TX-${p.id.slice(0, 6).toUpperCase()}`,
        originalId: p.id,
        pembeli: pembeliNama,
        toko: tokoNama,
        produsen: produsenNama,
        nominal: nominal,
        persenToko: 70,
        persenProdusen: 30,
        status: status,
        tanggal: tanggal,
        buktiPembayaran: p.bukti_pembayaran || null,
        metodePembayaran: p.metode_pembayaran || 'QRIS',
      };
    });

    return mappedFromDb;
  } catch (err) {
    console.error('getEscrowTransaksi catch:', err);
    return [];
  }
}

export async function salurkanDanaEscrow(orderId: string): Promise<boolean> {
  try {
    const { data: pesanan } = await supabase
      .from('pesanan')
      .select('id, supplier, total, total_harga, kode_pesanan')
      .or(`kode_pesanan.eq.${orderId},id.eq.${orderId}`)
      .maybeSingle();

    if (pesanan?.id) {
      await supabase.from('pesanan').update({ escrow_status: 'Tersalur' }).eq('id', pesanan.id);
    }

    try {
      const nominal = pesanan ? (pesanan.total || pesanan.total_harga || 0) : 0;
      const nominalStr = nominal > 0 ? ` sebesar Rp ${Number(nominal).toLocaleString('id-ID')}` : '';
      await supabaseAdmin.from('notifikasi').insert({
        judul: 'Penyaluran Dana Escrow',
        isi: `Dana${nominalStr} untuk pesanan ${pesanan?.kode_pesanan || orderId} telah resmi disalurkan oleh Admin Platform ke rekening Toko (${pesanan?.supplier || 'Admin Toko'}).`,
        tipe: 'Transaksi',
        dibaca: false
      });
    } catch (eNotif) {
      console.warn('salurkanDanaEscrow notifikasi warning:', eNotif);
    }

    return true;
  } catch (err) {
    console.error('salurkanDanaEscrow error:', err);
    return false;
  }
}

export async function tandaiSengketaEscrow(orderId: string): Promise<boolean> {
  try {
    const { data: pesanan } = await supabase
      .from('pesanan')
      .select('id, kode_pesanan')
      .or(`kode_pesanan.eq.${orderId},id.eq.${orderId}`)
      .maybeSingle();

    if (pesanan?.id) {
      await supabase.from('pesanan').update({ escrow_status: 'Disengketakan' }).eq('id', pesanan.id);
    }
    return true;
  } catch (err) {
    console.error('tandaiSengketaEscrow error:', err);
    return false;
  }
}

export async function selesaikanSengketaEscrow(orderId: string): Promise<boolean> {
  return salurkanDanaEscrow(orderId);
}