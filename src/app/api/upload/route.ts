import { NextRequest, NextResponse } from "next/server";
import { verifyEditToken } from "@/lib/tokens";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  buildProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
  sanitizeFilename,
} from "@/lib/storage-paths";

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;
const ALLOWED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const profileId = request.nextUrl.searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  if (!(await verifyEditToken(profileId, token))) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "file is required" }, { status: 400 });
  }

  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "Only JPEG, PNG, WebP, and GIF images are allowed" },
      { status: 400 }
    );
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return NextResponse.json(
      { error: "File must be 10 MB or smaller" },
      { status: 400 }
    );
  }

  const filename = sanitizeFilename(file.name);
  const filePath = buildProfileMediaPath(profileId, filename);
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = createAdminSupabaseClient();
  const { error: uploadError } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const contentText = formData.get("content_text");
  const { data: content, error: insertError } = await supabase
    .from("profile_content")
    .insert({
      profile_id: profileId,
      type: "photo",
      file_path: filePath,
      content_text:
        typeof contentText === "string" && contentText.trim()
          ? contentText.trim()
          : null,
    })
    .select("id, profile_id, type, content_text, file_path, unlock_at, created_at")
    .single();

  if (insertError) {
    await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([filePath]);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ content });
}
