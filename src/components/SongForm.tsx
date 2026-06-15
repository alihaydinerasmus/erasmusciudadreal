"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface SongFormProps {
  title: string;
  artist: string;
  spotifyUrl: string;
  onTitleChange: (value: string) => void;
  onArtistChange: (value: string) => void;
  onSpotifyUrlChange: (value: string) => void;
}

export function SongForm({
  title,
  artist,
  spotifyUrl,
  onTitleChange,
  onArtistChange,
  onSpotifyUrlChange,
}: SongFormProps) {
  const { t } = useLanguage();

  return (
    <div className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.playlistAdd}</h2>
      <p className="muted-text">{t.edit.playlistDesc}</p>

      <div>
        <label htmlFor="song-title" className="field-label">
          {t.edit.songName}
        </label>
        <input
          id="song-title"
          type="text"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
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
          value={artist}
          onChange={(e) => onArtistChange(e.target.value)}
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
          onChange={(e) => onSpotifyUrlChange(e.target.value)}
          className="field-input"
          placeholder="https://open.spotify.com/track/..."
        />
      </div>
    </div>
  );
}
