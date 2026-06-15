import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export async function verifyEditToken(
  profileId: string,
  token: string | null
): Promise<boolean> {
  if (!token) return false;

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select("edit_token")
    .eq("id", profileId)
    .maybeSingle();

  if (error || !data) return false;
  return (data as { edit_token: string }).edit_token === token;
}
