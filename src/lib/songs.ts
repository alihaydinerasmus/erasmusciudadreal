import type { ProfileContent } from "@/types/database";

export type SongData = {
  title: string;
  artist: string;
  spotifyUrl: string | null;
};

export type GroupSong = SongData & {
  id: string;
  profileId: string;
  profileName: string;
};

export function serializeSong(data: SongData): string {
  return JSON.stringify({
    title: data.title.trim(),
    artist: data.artist.trim(),
    spotifyUrl: data.spotifyUrl?.trim() || null,
  });
}

export function parseSongContent(
  content: ProfileContent
): SongData | null {
  if (content.type !== "song" || !content.content_text?.trim()) {
    return null;
  }

  try {
    const parsed = JSON.parse(content.content_text) as Partial<SongData>;
    if (!parsed.title?.trim() || !parsed.artist?.trim()) return null;
    return {
      title: parsed.title.trim(),
      artist: parsed.artist.trim(),
      spotifyUrl: parsed.spotifyUrl?.trim() || null,
    };
  } catch {
    return null;
  }
}
