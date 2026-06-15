import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { Group, ProfileContent, PublicProfile } from "@/types/database";

const PUBLIC_PROFILE_COLUMNS =
  "id, group_id, name, country, city, lat, lng, flag_emoji, created_at";

export async function getGroupBySlug(slug: string): Promise<Group | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("slug", slug)
    .maybeSingle();

  if (error) throw error;
  return data as Group | null;
}

export async function getProfilesByGroupId(
  groupId: string
): Promise<PublicProfile[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq("group_id", groupId)
    .order("name");

  if (error) throw error;
  return (data ?? []) as PublicProfile[];
}

export async function getProfileById(id: string): Promise<PublicProfile | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(PUBLIC_PROFILE_COLUMNS)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  return data as PublicProfile | null;
}

export async function getProfileForEdit(
  id: string,
  token: string
): Promise<PublicProfile | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .select(`${PUBLIC_PROFILE_COLUMNS}, edit_token`)
    .eq("id", id)
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const row = data as PublicProfile & { edit_token: string };
  if (row.edit_token !== token) return null;

  const { edit_token: _token, ...profile } = row;
  void _token;
  return profile;
}

export async function getGroupForProfile(
  profile: PublicProfile
): Promise<Group | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("groups")
    .select("*")
    .eq("id", profile.group_id)
    .maybeSingle();

  if (error) throw error;
  return data as Group | null;
}

export async function getProfilePhotos(
  profileId: string
): Promise<ProfileContent[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_content")
    .select("id, profile_id, type, content_text, file_path, unlock_at, created_at")
    .eq("profile_id", profileId)
    .eq("type", "photo")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProfileContent[];
}
