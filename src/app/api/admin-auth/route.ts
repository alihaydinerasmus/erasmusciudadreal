import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME, isValidAdminToken } from "@/lib/admin-auth";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

export async function POST(request: NextRequest) {
  let token: string | undefined;

  try {
    const body = await request.json();
    token = typeof body.token === "string" ? body.token : undefined;
  } catch {
    token = request.nextUrl.searchParams.get("token") ?? undefined;
  }

  if (!isValidAdminToken(token)) {
    return NextResponse.json({ error: "Invalid admin token" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(ADMIN_COOKIE_NAME, token!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}
