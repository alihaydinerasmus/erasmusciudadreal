import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { PROFILE_MEDIA_BUCKET } from "@/lib/storage-paths";

const SIGNED_URL_TTL_SECONDS = 3600;

export async function createProfileMediaSignedUrl(
  path: string
): Promise<string | null> {
  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase.storage
    .from(PROFILE_MEDIA_BUCKET)
    .createSignedUrl(path, SIGNED_URL_TTL_SECONDS);

  if (error || !data?.signedUrl) return null;
  return data.signedUrl;
}
