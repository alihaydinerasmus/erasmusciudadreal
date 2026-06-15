"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface SongFormProps {
  profileId: string;
  token: string;
}

export function SongForm({ profileId, token }: SongFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/content?profileId=${encodeURIComponent(profileId)}&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type: "song",
            title: title.trim(),
            artist: artist.trim(),
            spotifyUrl: spotifyUrl.trim() || undefined,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.common.failedToSave);
      }

      setTitle("");
      setArtist("");
      setSpotifyUrl("");
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.common.somethingWentWrong
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.playlistAdd}</h2>
      <p className="muted-text">{t.edit.playlistDesc}</p>

      <div>
        <label htmlFor="song-title" className="field-label">
          {t.edit.songName}
        </label>
        <input
          id="song-title"
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="field-input"
          placeholder={t.edit.songNamePlaceholder}
        />
      </div>

      <div>
        <label htmlFor="song-artist" className="field-label">
          {t.edit.artist}
        </label>
        <input
          id="song-artist"
          type="text"
          required
          value={artist}
          onChange={(e) => setArtist(e.target.value)}
          className="field-input"
          placeholder={t.edit.artistPlaceholder}
        />
      </div>

      <div>
        <label htmlFor="song-spotify" className="field-label">
          {t.edit.spotifyUrl}
        </label>
        <input
          id="song-spotify"
          type="url"
          value={spotifyUrl}
          onChange={(e) => setSpotifyUrl(e.target.value)}
          className="field-input"
          placeholder="https://open.spotify.com/track/..."
        />
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}
      {success && <p className="body-text">{t.edit.songSaved}</p>}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={saving || !title.trim() || !artist.trim()}
          className="btn-action"
        >
          {saving ? t.common.saving : t.edit.saveSong}
        </button>
      </div>
    </form>
  );
}
