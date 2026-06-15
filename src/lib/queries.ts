import { createServerSupabaseClient } from "@/lib/supabase/server";
import { parseSongContent, type GroupSong } from "@/lib/songs";
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

const CONTENT_COLUMNS =
  "id, profile_id, type, content_text, file_path, unlock_at, created_at";

export async function getProfilePhotos(
  profileId: string
): Promise<ProfileContent[]> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_content")
    .select(CONTENT_COLUMNS)
    .eq("profile_id", profileId)
    .eq("type", "photo")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as ProfileContent[];
}

export async function getProfileContentByType(
  profileId: string,
  type: ProfileContent["type"]
): Promise<ProfileContent | null> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_content")
    .select(CONTENT_COLUMNS)
    .eq("profile_id", profileId)
    .eq("type", type)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as ProfileContent | null;
}

export async function getProfileEditorContent(profileId: string): Promise<{
  memory: ProfileContent | null;
  note: ProfileContent | null;
  audio: ProfileContent | null;
}> {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("profile_content")
    .select(CONTENT_COLUMNS)
    .eq("profile_id", profileId)
    .in("type", ["memory", "note", "audio"]);

  if (error) throw error;

  const items = (data ?? []) as ProfileContent[];
  return {
    memory: items.find((c) => c.type === "memory") ?? null,
    note: items.find((c) => c.type === "note") ?? null,
    audio: items.find((c) => c.type === "audio") ?? null,
  };
}

export async function profileHasAnyContent(profileId: string): Promise<boolean> {
  const supabase = createServerSupabaseClient();
  const { count, error } = await supabase
    .from("profile_content")
    .select("id", { count: "exact", head: true })
    .eq("profile_id", profileId);

  if (error) throw error;
  return (count ?? 0) > 0;
}

export interface ProfileAdminSummary {
  profile: PublicProfile;
  memory: ProfileContent | null;
  note: ProfileContent | null;
  audio: ProfileContent | null;
  photos: ProfileContent[];
}

export async function getAdminProfileSummaries(
  groupSlug: string
): Promise<ProfileAdminSummary[] | null> {
  const group = await getGroupBySlug(groupSlug);
  if (!group) return null;

  const profiles = await getProfilesByGroupId(group.id);
  if (profiles.length === 0) return [];

  const supabase = createServerSupabaseClient();
  const profileIds = profiles.map((p) => p.id);
  const { data, error } = await supabase
    .from("profile_content")
    .select(CONTENT_COLUMNS)
    .in("profile_id", profileIds);

  if (error) throw error;

  const content = (data ?? []) as ProfileContent[];

  return profiles.map((profile) => {
    const items = content.filter((c) => c.profile_id === profile.id);
    return {
      profile,
      memory: items.find((c) => c.type === "memory") ?? null,
      note: items.find((c) => c.type === "note") ?? null,
      audio: items.find((c) => c.type === "audio") ?? null,
      photos: items.filter((c) => c.type === "photo"),
    };
  });
}

export async function getGroupPlaylist(groupId: string): Promise<GroupSong[]> {
  const profiles = await getProfilesByGroupId(groupId);
  if (profiles.length === 0) return [];

  const supabase = createServerSupabaseClient();
  const profileIds = profiles.map((p) => p.id);
  const profileById = new Map(profiles.map((p) => [p.id, p]));

  const { data, error } = await supabase
    .from("profile_content")
    .select(CONTENT_COLUMNS)
    .in("profile_id", profileIds)
    .eq("type", "song")
    .order("created_at", { ascending: true });

  if (error) throw error;

  const songs: GroupSong[] = [];

  for (const row of (data ?? []) as ProfileContent[]) {
    const parsed = parseSongContent(row);
    const profile = profileById.get(row.profile_id);
    if (!parsed || !profile) continue;

    songs.push({
      id: row.id,
      profileId: row.profile_id,
      profileName: profile.name,
      ...parsed,
    });
  }

  return songs;
}
