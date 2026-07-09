import { NextResponse } from "next/server";
import { getWishlist, addToWishlist, removeFromWishlist } from "@/lib/db";

export async function GET() {
  try {
    const list = await getWishlist();
    return NextResponse.json(list);
  } catch (error) {
    console.error("GET /api/wishlist error:", error);
    return NextResponse.json({ error: "Failed to fetch wishlist" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.product_id) {
      return NextResponse.json({ error: "Missing product_id" }, { status: 400 });
    }
    const added = await addToWishlist(body.product_id);
    if (!added) {
      return NextResponse.json({ message: "Product already in wishlist" }, { status: 200 });
    }
    return NextResponse.json(added, { status: 201 });
  } catch (error) {
    console.error("POST /api/wishlist error:", error);
    return NextResponse.json({ error: "Failed to add to wishlist" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const idStr = searchParams.get("id");
    if (!idStr) {
      return NextResponse.json({ error: "Missing item ID" }, { status: 400 });
    }
    const id = parseInt(idStr, 10);
    await removeFromWishlist(id);
    return NextResponse.json({ success: true, message: "Removed successfully" });
  } catch (error) {
    console.error("DELETE /api/wishlist error:", error);
    return NextResponse.json({ error: "Failed to remove from wishlist" }, { status: 500 });
  }
}
