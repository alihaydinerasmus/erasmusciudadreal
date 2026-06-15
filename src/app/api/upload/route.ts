import { NextRequest, NextResponse } from "next/server";
import { verifyEditToken } from "@/lib/tokens";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import {
  buildProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
  sanitizeFilename,
} from "@/lib/storage-paths";
import type { ContentType } from "@/types/database";

const MAX_PHOTO_SIZE_BYTES = 10 * 1024 * 1024;
const MAX_AUDIO_SIZE_BYTES = 25 * 1024 * 1024;

const PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
]);

const AUDIO_MIME_TYPES = new Set([
  "audio/mpeg",
  "audio/mp3",
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
  "audio/mp4",
  "audio/x-m4a",
]);

const CONTENT_SELECT =
  "id, profile_id, type, content_text, file_path, unlock_at, created_at";

async function removeStorageFile(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  filePath: string
) {
  await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([filePath]);
}

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const profileId = request.nextUrl.searchParams.get("profileId");
  const contentType = (request.nextUrl.searchParams.get("type") ??
    "photo") as ContentType;

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  if (contentType !== "photo" && contentType !== "audio") {
    return NextResponse.json(
      { error: "type must be 'photo' or 'audio'" },
      { status: 400 }
    );
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

  const isPhoto = contentType === "photo";
  const allowedTypes = isPhoto ? PHOTO_MIME_TYPES : AUDIO_MIME_TYPES;
  const maxSize = isPhoto ? MAX_PHOTO_SIZE_BYTES : MAX_AUDIO_SIZE_BYTES;

  if (!allowedTypes.has(file.type)) {
    return NextResponse.json(
      {
        error: isPhoto
          ? "Only JPEG, PNG, WebP, and GIF images are allowed"
          : "Only audio files (MP3, WebM, OGG, WAV, M4A) are allowed",
      },
      { status: 400 }
    );
  }

  if (file.size > maxSize) {
    return NextResponse.json(
      {
        error: `File must be ${isPhoto ? "10" : "25"} MB or smaller`,
      },
      { status: 400 }
    );
  }

  const filename = sanitizeFilename(
    file.name || (isPhoto ? "photo.jpg" : "audio.webm")
  );
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

  if (contentType === "audio") {
    const { data: existing } = await supabase
      .from("profile_content")
      .select("id, file_path")
      .eq("profile_id", profileId)
      .eq("type", "audio")
      .maybeSingle();

    if (existing) {
      const row = existing as { id: string; file_path: string | null };
      if (row.file_path) {
        await removeStorageFile(supabase, row.file_path);
      }

      const { data: content, error: updateError } = await supabase
        .from("profile_content")
        .update({ file_path: filePath })
        .eq("id", row.id)
        .select(CONTENT_SELECT)
        .single();

      if (updateError) {
        await removeStorageFile(supabase, filePath);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
      }

      return NextResponse.json({ content });
    }

    const { data: content, error: insertError } = await supabase
      .from("profile_content")
      .insert({
        profile_id: profileId,
        type: "audio",
        file_path: filePath,
      })
      .select(CONTENT_SELECT)
      .single();

    if (insertError) {
      await removeStorageFile(supabase, filePath);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ content });
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
    .select(CONTENT_SELECT)
    .single();

  if (insertError) {
    await removeStorageFile(supabase, filePath);
    return NextResponse.json({ error: insertError.message }, { status: 500 });
  }

  return NextResponse.json({ content });
}
