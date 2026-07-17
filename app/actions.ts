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
  markNotificationsAsRead 
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
export async function getProfileAction() {
  try {
    return await getProfile();
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
}) {
  try {
    return await updateProfile(profileData);
  } catch (e) {
    console.error("updateProfileAction:", e);
    return null;
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

export async function addToWishlistAction(productId: number) {
  try {
    return await addToWishlist(productId);
  } catch (e) {
    console.error("addToWishlistAction:", e);
    return null;
  }
}

export async function removeFromWishlistAction(id: number) {
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
