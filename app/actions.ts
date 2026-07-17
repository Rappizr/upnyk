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

export async function getProfileAction() {
  return await getProfile();
}

export async function updateProfileAction(profileData: any) {
  return await updateProfile(profileData);
}

export async function getProductsAction() {
  return await getProducts();
}

export async function saveProductAction(product: any) {
  return await saveProduct(product);
}

export async function getOrdersAction() {
  return await getOrders();
}

export async function createOrderAction(order: any) {
  return await createOrder(order);
}

export async function updateOrderStatusAction(orderId: string, status: string) {
  return await updateOrderStatus(orderId, status);
}

export async function getWishlistAction() {
  return await getWishlist();
}

export async function addToWishlistAction(productId: number) {
  return await addToWishlist(productId);
}

export async function removeFromWishlistAction(id: number) {
  return await removeFromWishlist(id);
}

export async function getNotificationsAction() {
  return await getNotifications();
}

export async function markNotificationsAsReadAction() {
  return await markNotificationsAsRead();
}
