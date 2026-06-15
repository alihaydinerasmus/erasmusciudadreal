import { NextRequest, NextResponse } from "next/server";
import { buildEditLink, findOrCreateProfileByName } from "@/lib/join";

export async function POST(request: NextRequest) {
  let body: { name?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const name = body.name?.trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const { profileId, editToken } = await findOrCreateProfileByName(name);
    const editLink = buildEditLink(profileId, editToken);

    return NextResponse.json({ editLink });
  } catch (err) {
    console.error("JOIN ERROR:", err);
    const message =
      err instanceof Error ? err.message : "Failed to join";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
