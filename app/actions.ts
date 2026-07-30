"use server";

import {
  getProfile,
  updateProfile,
  getProducts,
  saveProduct,
  getOrders,
  getPenjualanAdminToko,
  createOrder,
  updateOrderStatus,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getNotifications,
  markNotificationsAsRead,
  getCart,
  addToCart,
  updateCartQty,
  removeFromCart,
  clearCart,
  submitReview,
  getCurrentUserId,
  supabase,
  supabaseAdmin
} from "@/lib/db";


export async function getProductsAction() {
  try {
    return await getProducts();
  } catch (e) {
    console.error("getProductsAction:", e);
    return [];
  }
}

export async function saveProductAction(product: any) {
  try {
    return await saveProduct(product);
  } catch (e) {
    console.error("saveProductAction:", e);
    return null;
  }
}


export async function getProfileAction(userId?: string) {
  try {
    return await getProfile(userId);
  } catch (e) {
    console.error("getProfileAction:", e);
    return null;
  }
}

export async function updateProfileAction(profileData: {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  bio?: string;
  avatar_url?: string;
  addresses?: any[];
  alamat?: string;
  tanggal_lahir?: string;
}) {
  try {
    return await updateProfile(profileData);
  } catch (e: any) {
    console.error("updateProfileAction:", e);
    return { success: false, error: e?.message || String(e) };
  }
}


export async function getOrdersAction(userId?: string) {
  try {
    return await getOrders(userId);
  } catch (e) {
    console.error("getOrdersAction:", e);
    return [];
  }
}

export async function getPenjualanAdminTokoAction() {
  try {
    return await getPenjualanAdminToko();
  } catch (e) {
    console.error("getPenjualanAdminTokoAction:", e);
    return [];
  }
}

export async function createOrderAction(order: {
  supplier?: string;
  items?: any[];
  total?: number;
  payment_method?: string;
  status?: string;
  proof_uploaded?: boolean;
  proof_filename?: string;
  bukti_pembayaran?: string; // 💡 DITAMBAHKAN AGAR TIDAK ERROR TYPE DI CHECKOUT
  alamat_pengiriman?: string;
  pembeli_id?: string;
}) {
  try {
    return await createOrder(order);
  } catch (e) {
    console.error("createOrderAction:", e);
    return null;
  }
}

export async function updateOrderStatusAction(orderId: string, status: string, noResi?: string) {
  try {
    return await updateOrderStatus(orderId, status, noResi);
  } catch (e) {
    console.error("updateOrderStatusAction:", e);
    return false;
  }
}


export async function getWishlistAction() {
  try {
    return await getWishlist();
  } catch (e) {
    console.error("getWishlistAction:", e);
    return [];
  }
}

export async function addToWishlistAction(productId: string) {
  try {
    return await addToWishlist(productId);
  } catch (e) {
    console.error("addToWishlistAction:", e);
    return null;
  }
}

export async function removeFromWishlistAction(id: string) {
  try {
    return await removeFromWishlist(id);
  } catch (e) {
    console.error("removeFromWishlistAction:", e);
    return false;
  }
}


export async function getNotificationsAction() {
  try {
    return await getNotifications();
  } catch (e) {
    console.error("getNotificationsAction:", e);
    return [];
  }
}

export async function markNotificationsAsReadAction() {
  try {
    return await markNotificationsAsRead();
  } catch (e) {
    console.error("markNotificationsAsReadAction:", e);
    return false;
  }
}


export async function fetchNotificationsAction() {
  try {
    const isValidUuid = (id: string | null | undefined): boolean => {
      if (!id) return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
    };


    const { data: authData } = await supabase.auth.getUser();
    const authUserId = authData?.user?.id || null;


    const currentUserId = await getCurrentUserId();


    const query = supabaseAdmin
      .from('notifikasi')
      .select('id, judul, isi, dibaca, tipe, created_at, profile_id, pembeli_id')
      .order('created_at', { ascending: false })
      .limit(100);

    const { data: allData, error } = await query;

    if (error) {
      console.error('fetchNotificationsAction error:', error.message, error);
      return [];
    }

    if (!allData || allData.length === 0) return [];


    const filtered = allData.filter((n: any) => {
      const hasProfileId = n.profile_id !== null && n.profile_id !== undefined;
      const hasPembeliId = n.pembeli_id !== null && n.pembeli_id !== undefined;


      if (!hasProfileId && !hasPembeliId) return true;


      if (authUserId && isValidUuid(authUserId)) {
        if (n.profile_id === authUserId) return true;
      }


      if (currentUserId && isValidUuid(currentUserId)) {
        if (n.profile_id === currentUserId) return true;
        if (n.pembeli_id === currentUserId) return true;
      }


      if (!authUserId && !currentUserId) return true;

      return false;
    });

    return filtered.map((n: any) => ({
      id: n.id,
      tipe: n.tipe || 'Transaksi',
      judul: n.judul || 'Notifikasi',
      isi: n.isi || '',
      created_at: n.created_at || new Date().toISOString(),
      dibaca: n.dibaca ?? false,
    }));
  } catch (e) {
    console.error('fetchNotificationsAction catch:', e);
    return [];
  }
}


export async function markOneNotifReadAction(notifId: string) {
  try {
    const { error } = await supabaseAdmin
      .from('notifikasi')
      .update({ dibaca: true })
      .eq('id', notifId);
    if (error) console.error('markOneNotifReadAction error:', error.message);
    return !error;
  } catch (e) {
    console.error('markOneNotifReadAction catch:', e);
    return false;
  }
}


export async function markAllNotifReadAction() {
  try {
    const { error } = await supabaseAdmin
      .from('notifikasi')
      .update({ dibaca: true })
      .eq('dibaca', false);
    if (error) console.error('markAllNotifReadAction error:', error.message);
    return !error;
  } catch (e) {
    console.error('markAllNotifReadAction catch:', e);
    return false;
  }
}


export async function getCartAction(userId?: string) {
  try {
    return await getCart(userId);
  } catch (e) {
    console.error("getCartAction:", e);
    return [];
  }
}

export async function addToCartAction(productId: string, qty: number = 1, userId?: string) {
  try {
    return await addToCart(productId, qty, userId);
  } catch (e) {
    console.error("addToCartAction:", e);
    return null;
  }
}

export async function updateCartQtyAction(cartItemId: string, qty: number) {
  try {
    return await updateCartQty(cartItemId, qty);
  } catch (e) {
    console.error("updateCartQtyAction:", e);
    return false;
  }
}

export async function removeFromCartAction(cartItemId: string) {
  try {
    return await removeFromCart(cartItemId);
  } catch (e) {
    console.error("removeFromCartAction:", e);
    return false;
  }
}

export async function clearCartAction() {
  try {
    return await clearCart();
  } catch (e) {
    console.error("clearCartAction:", e);
    return false;
  }
}

export async function submitReviewAction(orderId: string, rating: number, comment?: string, notifId?: string) {
  try {
    return await submitReview(orderId, rating, comment, notifId);
  } catch (e) {
    console.error("submitReviewAction:", e);
    return false;
  }
}