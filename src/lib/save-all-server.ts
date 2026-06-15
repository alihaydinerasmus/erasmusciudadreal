import {
  buildProfileMediaPath,
  PROFILE_MEDIA_BUCKET,
  sanitizeFilename,
} from "@/lib/storage-paths";
import { serializeSong } from "@/lib/songs";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ContentType, ProfileUpdatePayload } from "@/types/database";

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

async function removeStorageFile(
  supabase: ReturnType<typeof createAdminSupabaseClient>,
  filePath: string
) {
  await supabase.storage.from(PROFILE_MEDIA_BUCKET).remove([filePath]);
}

export async function upsertTextContent(
  profileId: string,
  type: Extract<ContentType, "memory" | "note">,
  contentText: string
) {
  const supabase = createAdminSupabaseClient();
  const trimmed = contentText.trim();

  const { data: existing } = await supabase
    .from("profile_content")
    .select("id")
    .eq("profile_id", profileId)
    .eq("type", type)
    .maybeSingle();

  if (trimmed === "") {
    if (existing) {
      const { error } = await supabase
        .from("profile_content")
        .delete()
        .eq("id", (existing as { id: string }).id);
      if (error) throw new Error(error.message);
    }
    return;
  }

  if (existing) {
    const { error } = await supabase
      .from("profile_content")
      .update({ content_text: trimmed })
      .eq("id", (existing as { id: string }).id);
    if (error) throw new Error(error.message);
    return;
  }

  const { error } = await supabase.from("profile_content").insert({
    profile_id: profileId,
    type,
    content_text: trimmed,
  });
  if (error) throw new Error(error.message);
}

export async function insertSong(
  profileId: string,
  title: string,
  artist: string,
  spotifyUrl: string | null
) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase.from("profile_content").insert({
    profile_id: profileId,
    type: "song",
    content_text: serializeSong({ title, artist, spotifyUrl }),
  });
  if (error) throw new Error(error.message);
}

export async function updateProfileFields(
  profileId: string,
  payload: ProfileUpdatePayload
) {
  const supabase = createAdminSupabaseClient();
  const { error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", profileId);
  if (error) throw new Error(error.message);
}

export async function saveAudioFile(profileId: string, file: File) {
  if (!AUDIO_MIME_TYPES.has(file.type)) {
    throw new Error("Only audio files (MP3, WebM, OGG, WAV, M4A) are allowed");
  }
  if (file.size > MAX_AUDIO_SIZE_BYTES) {
    throw new Error("Audio file must be 25 MB or smaller");
  }

  const supabase = createAdminSupabaseClient();
  const filePath = buildProfileMediaPath(
    profileId,
    sanitizeFilename(file.name || "audio.webm")
  );
  const buffer = Buffer.from(await file.arrayBuffer());

  const { error: uploadError } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .upload(filePath, buffer, { contentType: file.type, upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: existing } = await supabase
    .from("profile_content")
    .select("id, file_path")
    .eq("profile_id", profileId)
    .eq("type", "audio")
    .maybeSingle();

  if (existing) {
    const row = existing as { id: string; file_path: string | null };
    if (row.file_path) await removeStorageFile(supabase, row.file_path);

    const { error } = await supabase
      .from("profile_content")
      .update({ file_path: filePath })
      .eq("id", row.id);

    if (error) {
      await removeStorageFile(supabase, filePath);
      throw new Error(error.message);
    }
    return;
  }

  const { error: insertError } = await supabase.from("profile_content").insert({
    profile_id: profileId,
    type: "audio",
    file_path: filePath,
  });

  if (insertError) {
    await removeStorageFile(supabase, filePath);
    throw new Error(insertError.message);
  }
}

export async function savePhotoFiles(
  profileId: string,
  files: File[],
  caption: string | null
) {
  const supabase = createAdminSupabaseClient();

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    if (!PHOTO_MIME_TYPES.has(file.type)) {
      throw new Error("Only JPEG, PNG, WebP, and GIF images are allowed");
    }
    if (file.size > MAX_PHOTO_SIZE_BYTES) {
      throw new Error("Each photo must be 10 MB or smaller");
    }

    const filePath = buildProfileMediaPath(
      profileId,
      sanitizeFilename(file.name || "photo.jpg")
    );
    const buffer = Buffer.from(await file.arrayBuffer());

    const { error: uploadError } = await supabase.storage
      .from(PROFILE_MEDIA_BUCKET)
      .upload(filePath, buffer, { contentType: file.type, upsert: false });

    if (uploadError) throw new Error(uploadError.message);

    const { error: insertError } = await supabase.from("profile_content").insert({
      profile_id: profileId,
      type: "photo",
      file_path: filePath,
      content_text:
        i === 0 && caption?.trim() ? caption.trim() : null,
    });

    if (insertError) {
      await removeStorageFile(supabase, filePath);
      throw new Error(insertError.message);
    }
  }
}
