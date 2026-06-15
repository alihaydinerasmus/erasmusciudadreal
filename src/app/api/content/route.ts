import { NextRequest, NextResponse } from "next/server";
import { verifyEditToken } from "@/lib/tokens";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { ContentType } from "@/types/database";

const TEXT_CONTENT_TYPES = new Set<ContentType>(["memory", "note"]);

export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const profileId = request.nextUrl.searchParams.get("profileId");

  if (!profileId) {
    return NextResponse.json({ error: "profileId is required" }, { status: 400 });
  }

  if (!(await verifyEditToken(profileId, token))) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  let body: { type?: string; content_text?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const type = body.type as ContentType;
  if (!type || !TEXT_CONTENT_TYPES.has(type)) {
    return NextResponse.json(
      { error: "type must be 'memory' or 'note'" },
      { status: 400 }
    );
  }

  const contentText = body.content_text?.trim() ?? "";

  const supabase = createAdminSupabaseClient();

  const { data: existing } = await supabase
    .from("profile_content")
    .select("id")
    .eq("profile_id", profileId)
    .eq("type", type)
    .maybeSingle();

  if (contentText === "") {
    if (existing) {
      const { error: deleteError } = await supabase
        .from("profile_content")
        .delete()
        .eq("id", (existing as { id: string }).id);

      if (deleteError) {
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
      }
    }
    return NextResponse.json({ content: null });
  }

  if (existing) {
    const { data, error } = await supabase
      .from("profile_content")
      .update({ content_text: contentText })
      .eq("id", (existing as { id: string }).id)
      .select(
        "id, profile_id, type, content_text, file_path, unlock_at, created_at"
      )
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ content: data });
  }

  const { data, error } = await supabase
    .from("profile_content")
    .insert({
      profile_id: profileId,
      type,
      content_text: contentText,
    })
    .select(
      "id, profile_id, type, content_text, file_path, unlock_at, created_at"
    )
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ content: data });
}
