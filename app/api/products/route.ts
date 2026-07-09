import { NextResponse } from "next/server";
import { getProducts, saveProduct } from "@/lib/db";

export async function GET(request: Request) {
  try {
    const products = await getProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.price || !body.origin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }
    const newProduct = await saveProduct(body);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json({ error: "Failed to save product" }, { status: 500 });
  }
}
