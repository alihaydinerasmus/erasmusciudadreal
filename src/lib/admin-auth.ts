import { cookies } from "next/headers";
import type { NextRequest } from "next/server";

export const ADMIN_COOKIE_NAME = "adminToken";

export function isValidAdminToken(token: string | undefined | null): boolean {
  const adminToken = process.env.ADMIN_TOKEN;
  if (!adminToken || !token) return false;
  return token === adminToken;
}

export function hasAdminAccessFromRequest(request: NextRequest): boolean {
  return isValidAdminToken(request.cookies.get(ADMIN_COOKIE_NAME)?.value);
}

export function hasAdminAccessFromCookies(): boolean {
  return isValidAdminToken(cookies().get(ADMIN_COOKIE_NAME)?.value);
}
