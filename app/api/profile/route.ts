import { NextResponse } from "next/server";
import { getProfile, updateProfile } from "@/lib/db";

export async function GET() {
  try {
    const profile = await getProfile();
    return NextResponse.json(profile);
  } catch (error) {
    console.error("GET /api/profile error:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const updated = await updateProfile(body);
    return NextResponse.json(updated);
  } catch (error) {
    console.error("PUT /api/profile error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
