import { notFound } from "next/navigation";
import { ProfilePageClient } from "@/components/ProfilePageClient";
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

  return (
    <ProfilePageClient
      profile={profile}
      group={group}
      memory={memory}
      note={note}
      audioSignedUrl={audioSignedUrl}
      photos={photos}
      hasAdminAccess={hasAdminAccess}
    />
  );
}
