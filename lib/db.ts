import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import path from "path";

// Initialize Supabase client if keys are present
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
export const supabase = supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

const dbFilePath = path.join(process.cwd(), "data", "db.json");

// Helper to read local JSON db
function readLocalDb() {
  try {
    if (!fs.existsSync(dbFilePath)) {
      return { products: [], orders: [], wishlist: [], notifications: [], profile: {} };
    }
    const fileContent = fs.readFileSync(dbFilePath, "utf-8");
    return JSON.parse(fileContent);
  } catch (err) {
    console.error("Failed to read local JSON database:", err);
    return { products: [], orders: [], wishlist: [], notifications: [], profile: {} };
  }
}

// Helper to write local JSON db
function writeLocalDb(data: any) {
  try {
    const dir = path.dirname(dbFilePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(dbFilePath, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to local JSON database:", err);
  }
}

// -------------------------------------------------------------
// PRODUCTS API HELPERS
// -------------------------------------------------------------
export async function getProducts() {
  if (supabase) {
    const { data, error } = await supabase.from("products").select("*").order("id", { ascending: true });
    if (!error && data) return data;
    console.warn("Supabase query failed, falling back to local database:", error);
  }
  return readLocalDb().products;
}

export async function saveProduct(product: any) {
  if (supabase) {
    const { data, error } = await supabase.from("products").insert([product]).select();
    if (!error && data) return data[0];
    console.warn("Supabase insert failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  const newProduct = {
    ...product,
    id: db.products.length > 0 ? Math.max(...db.products.map((p: any) => p.id)) + 1 : 1,
    rating: 5.0,
    reviews: 0
  };
  db.products.push(newProduct);
  writeLocalDb(db);
  return newProduct;
}

// -------------------------------------------------------------
// ORDERS API HELPERS
// -------------------------------------------------------------
export async function getOrders() {
  if (supabase) {
    const { data, error } = await supabase.from("orders").select("*").order("date", { ascending: false });
    if (!error && data) return data;
    console.warn("Supabase query failed, falling back to local database:", error);
  }
  return readLocalDb().orders;
}

export async function createOrder(order: any) {
  if (supabase) {
    const { data, error } = await supabase.from("orders").insert([order]).select();
    if (!error && data) return data[0];
    console.warn("Supabase insert failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  const newOrder = {
    ...order,
    id: order.id || `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.floor(100 + Math.random() * 900)}`,
    date: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    timeline: [
      { label: "Pesanan Dibuat", time: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }), done: true },
      { label: "Pembayaran Dikonfirmasi", time: "", done: false, active: true },
      { label: "Diproses Supplier", time: "", done: false },
      { label: "Dikirim Ekspedisi", time: "", done: false },
      { label: "Tiba di Tujuan", time: "", done: false }
    ]
  };
  db.orders.unshift(newOrder);
  writeLocalDb(db);
  return newOrder;
}

export async function updateOrderStatus(orderId: string, status: string) {
  if (supabase) {
    const { data, error } = await supabase.from("orders").update({ status }).eq("id", orderId).select();
    if (!error && data) return data[0];
    console.warn("Supabase update failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  const orderIndex = db.orders.findIndex((o: any) => o.id === orderId);
  if (orderIndex !== -1) {
    const order = db.orders[orderIndex];
    order.status = status;
    
    // Update active timeline step
    const timeline = order.timeline || [];
    const currentTime = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
    
    if (status === "Diproses") {
      if (timeline[1]) { timeline[1].done = true; timeline[1].time = currentTime; }
      if (timeline[2]) { timeline[2].active = true; }
    } else if (status === "Dikirim") {
      if (timeline[2]) { timeline[2].done = true; timeline[2].time = currentTime; }
      if (timeline[3]) { timeline[3].active = true; }
    } else if (status === "Selesai") {
      if (timeline[3]) { timeline[3].done = true; timeline[3].time = currentTime; }
      if (timeline[4]) { timeline[4].done = true; timeline[4].time = currentTime; }
    }
    
    db.orders[orderIndex] = order;
    writeLocalDb(db);
    return order;
  }
  return null;
}

// -------------------------------------------------------------
// WISHLIST API HELPERS
// -------------------------------------------------------------
export async function getWishlist() {
  if (supabase) {
    const { data, error } = await supabase.from("wishlist").select("*, products(*)");
    if (!error && data) return data;
    console.warn("Supabase query failed, falling back to local database:", error);
  }
  // For local, we join manually
  const db = readLocalDb();
  return db.wishlist.map((wl: any) => ({
    ...wl,
    product: db.products.find((p: any) => p.id === wl.product_id)
  })).filter((wl: any) => wl.product); // only return if product exists
}

export async function addToWishlist(productId: number) {
  if (supabase) {
    const { data, error } = await supabase.from("wishlist").insert([{ product_id: productId }]).select();
    if (!error && data) return data[0];
    console.warn("Supabase insert failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  // Check if already in wishlist
  const exists = db.wishlist.some((wl: any) => wl.product_id === productId);
  if (exists) return null;

  const newItem = {
    id: db.wishlist.length > 0 ? Math.max(...db.wishlist.map((w: any) => w.id)) + 1 : 1,
    product_id: productId,
    saved_at: "Baru saja",
    price_dropped: false
  };
  db.wishlist.push(newItem);
  writeLocalDb(db);
  return newItem;
}

export async function removeFromWishlist(id: number) {
  if (supabase) {
    const { error } = await supabase.from("wishlist").delete().eq("id", id);
    if (!error) return true;
    console.warn("Supabase delete failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  db.wishlist = db.wishlist.filter((wl: any) => wl.id !== id);
  writeLocalDb(db);
  return true;
}

// -------------------------------------------------------------
// NOTIFICATIONS API HELPERS
// -------------------------------------------------------------
export async function getNotifications() {
  if (supabase) {
    const { data, error } = await supabase.from("notifications").select("*").order("id", { ascending: false });
    if (!error && data) return data;
    console.warn("Supabase query failed, falling back to local database:", error);
  }
  return readLocalDb().notifications;
}

export async function markNotificationsAsRead() {
  if (supabase) {
    const { error } = await supabase.from("notifications").update({ unread: false }).eq("unread", true);
    if (!error) return true;
    console.warn("Supabase update failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  db.notifications = db.notifications.map((n: any) => ({ ...n, unread: false }));
  writeLocalDb(db);
  return true;
}

// -------------------------------------------------------------
// PROFILE API HELPERS
// -------------------------------------------------------------
export async function getProfile() {
  if (supabase) {
    const { data, error } = await supabase.from("profile").select("*").single();
    if (!error && data) return data;
    console.warn("Supabase query failed, falling back to local database:", error);
  }
  return readLocalDb().profile;
}

export async function updateProfile(profileData: any) {
  if (supabase) {
    const { data, error } = await supabase.from("profile").update(profileData).eq("id", 1).select();
    if (!error && data) return data[0];
    console.warn("Supabase update failed, falling back to local database:", error);
  }
  const db = readLocalDb();
  db.profile = {
    ...db.profile,
    ...profileData
  };
  writeLocalDb(db);
  return db.profile;
}
