import { GROUP_SLUG } from "@/lib/constants";
import { getGroupBySlug } from "@/lib/queries";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";

export function buildEditLink(profileId: string, token: string): string {
  return `/profile/${profileId}/edit?token=${encodeURIComponent(token)}`;
}

export async function findOrCreateProfileByName(
  name: string,
  groupSlug: string = GROUP_SLUG
): Promise<{ profileId: string; editToken: string; created: boolean }> {
  const trimmed = name.trim();
  if (!trimmed) {
    throw new Error("Name is required");
  }

  const group = await getGroupBySlug(groupSlug);
  if (!group) {
    throw new Error("Group not found");
  }

  const supabase = createAdminSupabaseClient();

  const { data: existing, error: findError } = await supabase
    .from("profiles")
    .select("id, edit_token")
    .eq("group_id", group.id)
    .ilike("name", trimmed)
    .limit(1)
    .maybeSingle();

  if (findError) throw findError;

  if (existing) {
    return {
      profileId: existing.id,
      editToken: existing.edit_token,
      created: false,
    };
  }

  const { data: created, error: createError } = await supabase
    .from("profiles")
    .insert({ group_id: group.id, name: trimmed })
    .select("id, edit_token")
    .single();

  if (createError) throw createError;

  return {
    profileId: created.id,
    editToken: created.edit_token,
    created: true,
  };
}
