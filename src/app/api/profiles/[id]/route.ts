import { NextRequest, NextResponse } from "next/server";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import { verifyEditToken } from "@/lib/tokens";
import type { ProfileUpdatePayload } from "@/types/database";

interface RouteContext {
  params: { id: string };
}

const ALLOWED_FIELDS: (keyof ProfileUpdatePayload)[] = [
  "name",
  "country",
  "city",
  "lat",
  "lng",
  "flag_emoji",
];

function pickUpdates(body: Partial<ProfileUpdatePayload>): Partial<ProfileUpdatePayload> {
  const payload: Partial<ProfileUpdatePayload> = {};

  if ("name" in body && body.name !== undefined) payload.name = body.name;
  if ("country" in body) payload.country = body.country ?? null;
  if ("city" in body) payload.city = body.city ?? null;
  if ("lat" in body) payload.lat = body.lat ?? null;
  if ("lng" in body) payload.lng = body.lng ?? null;
  if ("flag_emoji" in body) payload.flag_emoji = body.flag_emoji ?? null;

  return payload;
}

export async function PATCH(request: NextRequest, { params }: RouteContext) {
  const token = request.nextUrl.searchParams.get("token");

  if (!(await verifyEditToken(params.id, token))) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  let body: Partial<ProfileUpdatePayload>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const payload = pickUpdates(body);

  if (!ALLOWED_FIELDS.some((field) => field in body)) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  if ("name" in payload && !payload.name?.trim()) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const supabase = createAdminSupabaseClient();
  const { data, error } = await supabase
    .from("profiles")
    .update(payload)
    .eq("id", params.id)
    .select("id, group_id, name, country, city, lat, lng, flag_emoji, created_at")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ profile: data });
}
