import { NextRequest, NextResponse } from "next/server";
import {
  GROUP_ACCESS_COOKIE,
  isValidGroupPassword,
} from "@/lib/group-access";

const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;

export async function POST(request: NextRequest) {
  let password: string | undefined;

  try {
    const body = await request.json();
    password = typeof body.password === "string" ? body.password : undefined;
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (!isValidGroupPassword(password)) {
    return NextResponse.json({ error: "Wrong password" }, { status: 403 });
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(GROUP_ACCESS_COOKIE, "true", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    path: "/",
  });

  return response;
}
