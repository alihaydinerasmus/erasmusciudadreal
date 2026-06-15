import { NextRequest, NextResponse } from "next/server";
import { notifyContentSaved } from "@/lib/email";
import {
  insertSong,
  saveAudioFile,
  savePhotoFiles,
  updateProfileFields,
  upsertTextContent,
} from "@/lib/save-all-server";
import { verifyEditToken } from "@/lib/tokens";
import type { ProfileUpdatePayload } from "@/types/database";

interface RouteContext {
  params: { id: string };
}

function parseOptionalNumber(value: FormDataEntryValue | null): number | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

export async function POST(request: NextRequest, { params }: RouteContext) {
  const token = request.nextUrl.searchParams.get("token");

  if (!(await verifyEditToken(params.id, token))) {
    return NextResponse.json({ error: "Invalid edit token" }, { status: 403 });
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ error: "Invalid form data" }, { status: 400 });
  }

  const name = String(formData.get("name") ?? "").trim();
  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const profilePayload: ProfileUpdatePayload = {
    name,
    country: String(formData.get("country") ?? "").trim() || null,
    city: String(formData.get("city") ?? "").trim() || null,
    flag_emoji: String(formData.get("flag_emoji") ?? "").trim() || null,
    lat: parseOptionalNumber(formData.get("lat")),
    lng: parseOptionalNumber(formData.get("lng")),
  };

  const memory = String(formData.get("memory") ?? "");
  const note = String(formData.get("note") ?? "");
  const songTitle = String(formData.get("song_title") ?? "").trim();
  const songArtist = String(formData.get("song_artist") ?? "").trim();
  const songSpotifyUrl = String(formData.get("song_spotify_url") ?? "").trim();
  const photoCaption = String(formData.get("photo_caption") ?? "").trim();

  const audioEntry = formData.get("audio");
  const audioFile = audioEntry instanceof File && audioEntry.size > 0 ? audioEntry : null;

  const photoFiles = formData
    .getAll("photos")
    .filter((entry): entry is File => entry instanceof File && entry.size > 0);

  if (songTitle && !songArtist) {
    return NextResponse.json(
      { error: "Artist is required when song title is provided" },
      { status: 400 }
    );
  }
  if (songArtist && !songTitle) {
    return NextResponse.json(
      { error: "Song title is required when artist is provided" },
      { status: 400 }
    );
  }

  try {
    await updateProfileFields(params.id, profilePayload);
    await upsertTextContent(params.id, "memory", memory);
    await upsertTextContent(params.id, "note", note);

    if (audioFile) {
      await saveAudioFile(params.id, audioFile);
    }

    if (photoFiles.length > 0) {
      await savePhotoFiles(
        params.id,
        photoFiles,
        photoCaption || null
      );
    }

    if (songTitle && songArtist) {
      await insertSong(
        params.id,
        songTitle,
        songArtist,
        songSpotifyUrl || null
      );
    }

    if (memory.trim()) notifyContentSaved(params.id, "memory");
    if (note.trim()) notifyContentSaved(params.id, "note");
    if (audioFile) notifyContentSaved(params.id, "audio");
    if (photoFiles.length > 0) notifyContentSaved(params.id, "photo");
    if (songTitle && songArtist) notifyContentSaved(params.id, "song");

    return NextResponse.json({ ok: true });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to save profile";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
