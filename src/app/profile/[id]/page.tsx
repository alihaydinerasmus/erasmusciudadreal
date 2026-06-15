import { notFound } from "next/navigation";
import { AdminUnlockForm } from "@/components/AdminUnlockForm";
import { AudioMessage } from "@/components/AudioMessage";
import { JournalEntry } from "@/components/JournalEntry";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { ProfileMap } from "@/components/ProfileMap";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import {
  getGroupForProfile,
  getProfileById,
  getProfileContentByType,
  getProfilePhotos,
} from "@/lib/queries";
import { createProfileMediaSignedUrl } from "@/lib/signed-url";

interface ProfilePageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const profile = await getProfileById(params.id);
  return {
    title: profile ? `${profile.name} — Memory Album` : "Profile not found",
  };
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const profile = await getProfileById(params.id);

  if (!profile) {
    notFound();
  }

  const hasAdminAccess = hasAdminAccessFromCookies();

  const [group, photos, memory] = await Promise.all([
    getGroupForProfile(profile),
    getProfilePhotos(profile.id),
    getProfileContentByType(profile.id, "memory"),
  ]);

  let note = null;
  let audioSignedUrl: string | null = null;

  if (hasAdminAccess) {
    const [noteContent, audioContent] = await Promise.all([
      getProfileContentByType(profile.id, "note"),
      getProfileContentByType(profile.id, "audio"),
    ]);
    note = noteContent;
    if (audioContent?.file_path) {
      audioSignedUrl = await createProfileMediaSignedUrl(audioContent.file_path);
    }
  }

  const locationLabel = [profile.city, profile.country]
    .filter(Boolean)
    .join(", ");
  const hasMap = profile.lat != null && profile.lng != null;
  const hasMemory = Boolean(memory?.content_text?.trim());
  const hasNote = Boolean(note?.content_text?.trim());
  const hasAudio = Boolean(audioSignedUrl);
  const hasPhotos = photos.length > 0;
  const hasAnyContent =
    hasMemory || hasNote || hasAudio || hasMap || hasPhotos;

  return (
    <main className="mx-auto max-w-2xl px-6 py-12 sm:py-16">
      <PageHeader
        backHref={group ? `/group/${group.slug}` : "/"}
        backLabel={group?.name ?? "Back"}
      />

      <article className="rounded-sm border border-ink/10 bg-paper p-8 shadow-soft sm:p-10">
        <div className="mb-6 flex items-center gap-4">
          <span className="text-5xl leading-none" aria-hidden="true">
            {profile.flag_emoji ?? "🌍"}
          </span>
          <div>
            <h1 className="font-serif text-3xl text-ink sm:text-4xl">
              {profile.name}
            </h1>
            {locationLabel && (
              <p className="mt-1 text-ink/60">{locationLabel}</p>
            )}
          </div>
        </div>

        {hasMemory && memory?.content_text && (
          <JournalEntry
            title="Favorite memory"
            text={memory.content_text}
          />
        )}

        {hasNote && note?.content_text && (
          <JournalEntry title="Note to Ali" text={note.content_text} />
        )}

        {hasAudio && audioSignedUrl && (
          <AudioMessage
            signedUrl={audioSignedUrl}
            profileName={profile.name}
          />
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
          <div className="mt-8 rounded-sm border border-ink/10 bg-cream-dark/50 p-6">
            <p className="mb-4 text-center font-serif text-sm text-ink/60">
              Photos are private. Enter your admin token to view them.
            </p>
            <AdminUnlockForm />
          </div>
        )}

        {!hasAnyContent && (
          <div className="border-t border-ink/10 pt-8">
            <p className="font-serif text-sm italic text-ink/50">
              Nothing here yet — check back once {profile.name.split(" ")[0]}{" "}
              adds their memories.
            </p>
          </div>
        )}
      </article>

      <p className="mt-8 text-center text-sm text-ink/40">
        Is this you?{" "}
        <span className="text-ink/50">
          Check your personal edit link to update your profile.
        </span>
      </p>
    </main>
  );
}
