"use server";

import { 
  getProfile, 
  updateProfile, 
  getProducts, 
  saveProduct, 
  getOrders, 
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
  clearCart
} from "@/lib/db";

// ─────────────────────────────────────────────
// PRODUK
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PROFIL PEMBELI
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// PESANAN
// ─────────────────────────────────────────────
export async function getOrdersAction() {
  try {
    return await getOrders();
  } catch (e) {
    console.error("getOrdersAction:", e);
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

export async function updateOrderStatusAction(orderId: string, status: string) {
  try {
    return await updateOrderStatus(orderId, status);
  } catch (e) {
    console.error("updateOrderStatusAction:", e);
    return false;
  }
}

// ─────────────────────────────────────────────
// WISHLIST
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// NOTIFIKASI
// ─────────────────────────────────────────────
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

// ─────────────────────────────────────────────
// KERANJANG
// ─────────────────────────────────────────────
export async function getCartAction() {
  try {
    return await getCart();
  } catch (e) {
    console.error("getCartAction:", e);
    return [];
  }
}

export async function addToCartAction(productId: string, qty: number = 1) {
  try {
    return await addToCart(productId, qty);
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
