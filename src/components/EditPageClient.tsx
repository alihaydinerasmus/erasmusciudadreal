"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { AudioRecorderForm } from "@/components/AudioRecorderForm";
import {
  EditProfileForm,
  type ProfileFormFields,
} from "@/components/EditProfileForm";
import { EditWelcomeGuide } from "@/components/EditWelcomeGuide";
import { LocationPicker } from "@/components/LocationPicker";
import { MemoryNoteForm } from "@/components/MemoryNoteForm";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { SongForm } from "@/components/SongForm";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/contexts/LanguageContext";
import { findCountryByName } from "@/lib/geo-data";
import type { PublicProfile } from "@/types/database";

interface EditPageClientProps {
  profile: PublicProfile;
  token: string;
  group: { name: string; slug: string } | null;
  initialMemory: string;
  initialNote: string;
  hasExistingAudio: boolean;
  showWelcome: boolean;
}

interface SavedSnapshot {
  profile: ProfileFormFields;
  memory: string;
  note: string;
  lat: number | null;
  lng: number | null;
}

function coordsEqual(
  a: { lat: number | null; lng: number | null },
  b: { lat: number | null; lng: number | null }
) {
  if (a.lat == null || a.lng == null) {
    return b.lat == null && b.lng == null;
  }
  if (b.lat == null || b.lng == null) return false;
  return (
    Math.abs(a.lat - b.lat) < 0.0001 && Math.abs(a.lng - b.lng) < 0.0001
  );
}

function buildInitialProfile(profile: PublicProfile): ProfileFormFields {
  const country = findCountryByName(profile.country ?? "");
  return {
    name: profile.name,
    country: profile.country ?? "",
    city: profile.city ?? "",
    flag_emoji: profile.flag_emoji ?? country?.flagEmoji ?? "",
  };
}

export function EditPageClient({
  profile,
  token,
  group,
  initialMemory,
  initialNote,
  hasExistingAudio,
  showWelcome,
}: EditPageClientProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [profileFields, setProfileFields] = useState<ProfileFormFields>(() =>
    buildInitialProfile(profile)
  );
  const [memory, setMemory] = useState(initialMemory);
  const [note, setNote] = useState(initialNote);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [photoFiles, setPhotoFiles] = useState<File[]>([]);
  const [photoCaption, setPhotoCaption] = useState("");
  const [songTitle, setSongTitle] = useState("");
  const [songArtist, setSongArtist] = useState("");
  const [songSpotifyUrl, setSongSpotifyUrl] = useState("");
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    profile.lat != null && profile.lng != null
      ? { lat: profile.lat, lng: profile.lng }
      : null
  );
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  const [savedSnapshot, setSavedSnapshot] = useState<SavedSnapshot>(() => ({
    profile: buildInitialProfile(profile),
    memory: initialMemory,
    note: initialNote,
    lat: profile.lat ?? null,
    lng: profile.lng ?? null,
  }));

  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSaved, setShowSaved] = useState(false);
  const [savedVisible, setSavedVisible] = useState(false);

  const handleCityLocationChange = useCallback(
    (coords: { lat: number; lng: number }) => {
      setPosition(coords);
      setFlyTarget(coords);
    },
    []
  );

  const handleFlyComplete = useCallback(() => {
    setFlyTarget(null);
  }, []);

  const isDirty = useMemo(() => {
    const profileChanged =
      profileFields.name !== savedSnapshot.profile.name ||
      profileFields.country !== savedSnapshot.profile.country ||
      profileFields.city !== savedSnapshot.profile.city ||
      profileFields.flag_emoji !== savedSnapshot.profile.flag_emoji;

    const textChanged =
      memory !== savedSnapshot.memory || note !== savedSnapshot.note;

    const locationChanged = !coordsEqual(
      { lat: position?.lat ?? null, lng: position?.lng ?? null },
      { lat: savedSnapshot.lat, lng: savedSnapshot.lng }
    );

    const hasPendingUploads =
      audioFile !== null ||
      photoFiles.length > 0 ||
      songTitle.trim() !== "" ||
      songArtist.trim() !== "" ||
      songSpotifyUrl.trim() !== "";

    return (
      profileChanged || textChanged || locationChanged || hasPendingUploads
    );
  }, [
    profileFields,
    savedSnapshot,
    memory,
    note,
    position,
    audioFile,
    photoFiles,
    songTitle,
    songArtist,
    songSpotifyUrl,
  ]);

  useEffect(() => {
    if (!showSaved) return;

    setSavedVisible(true);
    const fadeTimer = setTimeout(() => setSavedVisible(false), 1700);
    const hideTimer = setTimeout(() => setShowSaved(false), 2000);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, [showSaved]);

  async function handleSaveAll() {
    if (!profileFields.name.trim()) return;

    setSaving(true);
    setSaveError(null);

    const formData = new FormData();
    formData.append("name", profileFields.name.trim());
    formData.append("country", profileFields.country ?? "");
    formData.append("city", profileFields.city ?? "");
    formData.append("flag_emoji", profileFields.flag_emoji ?? "");
    formData.append("memory", memory);
    formData.append("note", note);

    if (position) {
      formData.append("lat", String(position.lat));
      formData.append("lng", String(position.lng));
    }

    if (audioFile) {
      formData.append("audio", audioFile);
    }

    for (const file of photoFiles) {
      formData.append("photos", file);
    }

    if (photoCaption.trim()) {
      formData.append("photo_caption", photoCaption.trim());
    }

    if (songTitle.trim()) {
      formData.append("song_title", songTitle.trim());
    }
    if (songArtist.trim()) {
      formData.append("song_artist", songArtist.trim());
    }
    if (songSpotifyUrl.trim()) {
      formData.append("song_spotify_url", songSpotifyUrl.trim());
    }

    try {
      const res = await fetch(
        `/api/profile/${profile.id}/save-all?token=${encodeURIComponent(token)}`,
        { method: "POST", body: formData }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.common.failedToSave);
      }

      setSavedSnapshot({
        profile: { ...profileFields },
        memory,
        note,
        lat: position?.lat ?? null,
        lng: position?.lng ?? null,
      });

      setAudioFile(null);
      setPhotoFiles([]);
      setPhotoCaption("");
      setSongTitle("");
      setSongArtist("");
      setSongSpotifyUrl("");
      setShowSaved(true);
      router.refresh();
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : t.common.somethingWentWrong
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <PageShell>
      <EditWelcomeGuide profileId={profile.id} name={profile.name} show={showWelcome} />

      <PageHeader
        backHref={`/profile/${profile.id}`}
        backLabel={t.edit.viewProfile}
        title={t.edit.title(profile.name)}
      />

      {(isDirty || showSaved) && (
        <p
          className={`mb-6 text-sm transition-opacity duration-300 ${
            showSaved
              ? savedVisible
                ? "text-terracotta dark:text-terracotta-light"
                : "opacity-0 text-terracotta dark:text-terracotta-light"
              : "text-ink/45 dark:text-dark-muted"
          }`}
          aria-live="polite"
        >
          {showSaved ? t.edit.savedAll : t.edit.unsavedChanges}
        </p>
      )}

      <div id="edit-form" className="pb-28 md:pb-8">
        <EditProfileForm
          initialCountryName={profile.country}
          value={profileFields}
          onChange={setProfileFields}
          onCityLocationChange={handleCityLocationChange}
          initialLat={profile.lat}
          initialLng={profile.lng}
        />
        <MemoryNoteForm
          memory={memory}
          note={note}
          onMemoryChange={setMemory}
          onNoteChange={setNote}
        />
        <AudioRecorderForm
          hasExistingAudio={hasExistingAudio}
          audioFile={audioFile}
          onAudioChange={setAudioFile}
        />
        <PhotoUploadForm
          files={photoFiles}
          caption={photoCaption}
          onFilesChange={setPhotoFiles}
          onCaptionChange={setPhotoCaption}
        />
        <SongForm
          title={songTitle}
          artist={songArtist}
          spotifyUrl={songSpotifyUrl}
          onTitleChange={setSongTitle}
          onArtistChange={setSongArtist}
          onSpotifyUrlChange={setSongSpotifyUrl}
        />
        <LocationPicker
          position={position}
          onPositionChange={setPosition}
          flyTarget={flyTarget}
          onFlyComplete={handleFlyComplete}
        />

        {saveError && (
          <p className="muted-text mt-6 text-terracotta-dark">{saveError}</p>
        )}

        <div className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-paper p-4 pb-[max(1rem,env(safe-area-inset-bottom))] dark:border-dark-border dark:bg-dark-bg md:static md:mt-10 md:border-0 md:bg-transparent md:p-0">
          <button
            type="button"
            onClick={handleSaveAll}
            disabled={saving || !isDirty}
            className="flex w-full items-center justify-center bg-terracotta px-6 py-4 font-serif text-base tracking-wide text-paper transition-colors hover:bg-terracotta-dark disabled:cursor-not-allowed disabled:opacity-50 dark:bg-terracotta-light dark:text-dark-bg dark:hover:bg-terracotta md:py-3 md:text-sm"
          >
            {saving ? t.common.saving : t.edit.saveAll}
          </button>
        </div>
      </div>

      {group && (
        <p className="muted-text mt-8">
          {t.edit.partOf}{" "}
          <Link
            href={`/group/${group.slug}`}
            className="text-terracotta/80 hover:text-terracotta"
          >
            {group.name}
          </Link>
        </p>
      )}
    </PageShell>
  );
}
