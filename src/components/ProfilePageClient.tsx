"use client";

import { AdminUnlockForm } from "@/components/AdminUnlockForm";
import { AudioMessage } from "@/components/AudioMessage";
import { JournalEntry } from "@/components/JournalEntry";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ProfileMap } from "@/components/ProfileMap";
import { useLanguage } from "@/contexts/LanguageContext";
import type { ProfileContent, PublicProfile } from "@/types/database";

interface ProfilePageClientProps {
  profile: PublicProfile;
  group: { name: string; slug: string } | null;
  photos: ProfileContent[];
  memory: ProfileContent | null;
  note: ProfileContent | null;
  audioSignedUrl: string | null;
  hasAdminAccess: boolean;
}

export function ProfilePageClient({
  profile,
  group,
  photos,
  memory,
  note,
  audioSignedUrl,
  hasAdminAccess,
}: ProfilePageClientProps) {
  const { t } = useLanguage();

  const locationLabel = [profile.city, profile.country]
    .filter(Boolean)
    .join(", ");
  const hasMap = profile.lat != null && profile.lng != null;
  const hasMemory = hasAdminAccess && Boolean(memory?.content_text?.trim());
  const hasNote = hasAdminAccess && Boolean(note?.content_text?.trim());
  const hasAudio = hasAdminAccess && Boolean(audioSignedUrl);
  const hasPhotos = photos.length > 0;
  const hasAnyContent =
    hasMemory || hasNote || hasAudio || hasMap || hasPhotos;
  const firstName = profile.name.split(" ")[0];

  return (
    <PageShell>
      <PageHeader
        backHref={group ? `/group/${group.slug}` : "/"}
        backLabel={group?.name ?? t.common.back}
      />

      <div className="mb-8 flex items-start gap-4">
        <span className="text-4xl leading-none" aria-hidden="true">
          {profile.flag_emoji ?? "🌍"}
        </span>
        <div>
          <h1 className="page-title">{profile.name}</h1>
          {locationLabel && (
            <p className="muted-text mt-1">{locationLabel}</p>
          )}
        </div>
      </div>

      {hasMemory && memory?.content_text && (
        <JournalEntry
          title={t.profile.favoriteMemory}
          text={memory.content_text}
        />
      )}

      {hasNote && note?.content_text && (
        <JournalEntry title={t.profile.noteToAli} text={note.content_text} />
      )}

      {hasAudio && audioSignedUrl && (
        <AudioMessage signedUrl={audioSignedUrl} profileName={profile.name} />
      )}

      {hasMap && (
        <ProfileMap
          lat={profile.lat!}
          lng={profile.lng!}
          label={locationLabel || profile.name}
        />
      )}

      <PhotoGallery photos={photos} profileName={profile.name} />

      {hasPhotos && !hasAdminAccess && (
        <div className="edit-section">
          <p className="body-text mb-4">{t.profile.photosPrivate}</p>
          <AdminUnlockForm />
        </div>
      )}

      {!hasAnyContent && (
        <div className="edit-section">
          <p className="body-text italic">{t.profile.nothingYet(firstName)}</p>
        </div>
      )}

      <p className="muted-text mt-8">
        {t.profile.isThisYou}{" "}
        <span className="text-ink/50">{t.profile.checkEditLink}</span>
      </p>
    </PageShell>
  );
}
