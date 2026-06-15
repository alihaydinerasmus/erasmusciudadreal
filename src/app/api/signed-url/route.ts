import { NextRequest, NextResponse } from "next/server";
import { hasAdminAccessFromRequest } from "@/lib/admin-auth";
import { createProfileMediaSignedUrl } from "@/lib/signed-url";
import { isValidProfileMediaPath } from "@/lib/storage-paths";

export async function GET(request: NextRequest) {
  if (!hasAdminAccessFromRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const path = request.nextUrl.searchParams.get("path");

  if (!path || !isValidProfileMediaPath(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const signedUrl = await createProfileMediaSignedUrl(path);

  if (!signedUrl) {
    return NextResponse.json(
      { error: "Could not create signed URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl });
}
