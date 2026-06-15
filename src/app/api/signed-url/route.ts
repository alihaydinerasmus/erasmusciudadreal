import { NextRequest, NextResponse } from "next/server";
import { hasAdminAccessFromRequest } from "@/lib/admin-auth";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  isValidProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
} from "@/lib/storage-paths";

const SIGNED_URL_TTL_SECONDS = 3600;

export async function GET(request: NextRequest) {
  if (!hasAdminAccessFromRequest(request)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const path = request.nextUrl.searchParams.get("path");

  if (!path || !isValidProfileMediaPath(path)) {
    return NextResponse.json({ error: "Invalid path" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) {
    return NextResponse.json(
      { error: error?.message ?? "Could not create signed URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({ signedUrl: data.signedUrl });
}
