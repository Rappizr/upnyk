import { NextResponse } from "next/server";
import { getNotifications, markNotificationsAsRead } from "@/lib/db";

export async function GET() {
  try {
    const notifications = await getNotifications();
    return NextResponse.json(notifications);
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to fetch notifications" }, { status: 500 });
  }
}

export async function POST() {
  try {
    await markNotificationsAsRead();
    return NextResponse.json({ success: true, message: "All marked as read" });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
  }
}
