import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-auth";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  let password: string | undefined;

  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidAdminToken(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 403 });
  }

  const adminToken = process.env.ADMIN_TOKEN!;
  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, adminToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}
