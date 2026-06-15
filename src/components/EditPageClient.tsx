"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { AudioRecorderForm } from "@/components/AudioRecorderForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { EditWelcomeGuide } from "@/components/EditWelcomeGuide";
import { LocationPicker } from "@/components/LocationPicker";
import { MemoryNoteForm } from "@/components/MemoryNoteForm";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { SongForm } from "@/components/SongForm";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/contexts/LanguageContext";
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

export function EditPageClient({
  profile,
  token,
  group,
  initialMemory,
  initialNote,
  hasExistingAudio,
  showWelcome,
}: EditPageClientProps) {
  const { t } = useLanguage();
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    profile.lat != null && profile.lng != null
      ? { lat: profile.lat, lng: profile.lng }
      : null
  );
  const [flyTarget, setFlyTarget] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

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

  return (
    <PageShell>
      <EditWelcomeGuide profileId={profile.id} name={profile.name} show={showWelcome} />

      <PageHeader
        backHref={`/profile/${profile.id}`}
        backLabel={t.edit.viewProfile}
        title={t.edit.title(profile.name)}
      />

      <div id="edit-form">
        <EditProfileForm
          profile={profile}
          token={token}
          onCityLocationChange={handleCityLocationChange}
        />
        <MemoryNoteForm
          profileId={profile.id}
          token={token}
          initialMemory={initialMemory}
          initialNote={initialNote}
        />
        <AudioRecorderForm
          profileId={profile.id}
          token={token}
          hasExistingAudio={hasExistingAudio}
        />
        <PhotoUploadForm profileId={profile.id} token={token} />
        <SongForm profileId={profile.id} token={token} />
        <LocationPicker
          profileId={profile.id}
          token={token}
          position={position}
          onPositionChange={setPosition}
          flyTarget={flyTarget}
          onFlyComplete={handleFlyComplete}
        />
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
