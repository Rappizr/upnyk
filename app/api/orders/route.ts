import { NextResponse } from "next/server";
import { getOrders, createOrder, updateOrderStatus } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const orders = await getOrders();
    return NextResponse.json(orders);
  } catch (error) {
    console.error("GET /api/orders error:", error);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.items || !body.total || !body.supplier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const newOrder = await createOrder(body);
    return NextResponse.json(newOrder, { status: 201 });
  } catch (error) {
    console.error("POST /api/orders error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    if (!body.id || !body.status) {
      return NextResponse.json({ error: "Missing ID or status" }, { status: 400 });
    }
    const updated = await updateOrderStatus(body.id, body.status);
    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PATCH /api/orders error:", error);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}
