import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import {
  GROUP_ACCESS_COOKIE,
  isGroupAccessGranted,
} from "@/lib/group-access";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isGroupPage = /^\/group\/[^/]+$/.test(pathname);
  const isGroupMapPage = /^\/group\/[^/]+\/map$/.test(pathname);

  if (!isGroupPage && !isGroupMapPage) {
    return NextResponse.next();
  }

  if (isGroupAccessGranted(request.cookies.get(GROUP_ACCESS_COOKIE)?.value)) {
    return NextResponse.next();
  }

  const enterUrl = request.nextUrl.clone();
  enterUrl.pathname = "/enter";
  enterUrl.searchParams.set("redirect", pathname);
  return NextResponse.redirect(enterUrl);
}

export const config = {
  matcher: ["/group/:slug", "/group/:slug/map"],
};
