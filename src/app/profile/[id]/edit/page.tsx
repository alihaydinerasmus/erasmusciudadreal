import { notFound } from "next/navigation";
import Link from "next/link";
import { AudioRecorderForm } from "@/components/AudioRecorderForm";
import { EditProfileForm } from "@/components/EditProfileForm";
import { EditWelcomeGuide } from "@/components/EditWelcomeGuide";
import { welcomeLocaleForCountry } from "@/lib/welcome-locale";
import { LocationPicker } from "@/components/LocationPicker";
import { MemoryNoteForm } from "@/components/MemoryNoteForm";
import { PhotoUploadForm } from "@/components/PhotoUploadForm";
import { PageHeader } from "@/components/PageHeader";
import {
  getGroupForProfile,
  getProfileById,
  getProfileEditorContent,
  getProfileForEdit,
  profileHasAnyContent,
} from "@/lib/queries";

interface EditProfilePageProps {
  params: { id: string };
  searchParams: { token?: string };
}

export const metadata = {
  title: "Edit Profile — Memory Album",
  robots: { index: false, follow: false },
};

function AccessDenied({ profileId }: { profileId: string }) {
  return (
    <main className="mx-auto max-w-lg px-6 py-16 text-center">
      <h1 className="font-serif text-2xl text-ink">Access denied</h1>
      <p className="mt-4 text-ink/60">
        This edit link is invalid or expired. Only you should have your
        personal edit link — check the URL your friend shared with you.
      </p>
      <Link
        href={`/profile/${profileId}`}
        className="mt-8 inline-block text-sm text-terracotta hover:underline"
      >
        ← View public profile
      </Link>
    </main>
  );
}

export default async function EditProfilePage({
  params,
  searchParams,
}: EditProfilePageProps) {
  const token = searchParams.token;

  if (!token) {
    return <AccessDenied profileId={params.id} />;
  }

  const existing = await getProfileById(params.id);
  if (!existing) {
    notFound();
  }

  const profile = await getProfileForEdit(params.id, token);
  if (!profile) {
    return <AccessDenied profileId={params.id} />;
  }

  const [group, content, hasAnyContent] = await Promise.all([
    getGroupForProfile(profile),
    getProfileEditorContent(profile.id),
    profileHasAnyContent(profile.id),
  ]);

  const welcomeLocale = welcomeLocaleForCountry(profile.country);

  return (
    <main className="mx-auto max-w-xl px-6 py-12 sm:py-16">
      <EditWelcomeGuide
        profileId={profile.id}
        show={!hasAnyContent}
        locale={welcomeLocale}
      />

      <PageHeader
        backHref={`/profile/${profile.id}`}
        backLabel="View profile"
        title={`Edit — ${profile.name}`}
        subtitle="Share your memories. Only you can see this page."
      />

      <div
        id="edit-form"
        className="rounded-sm border border-ink/10 bg-paper p-8 shadow-soft"
      >
        <EditProfileForm profile={profile} token={token} />
        <MemoryNoteForm
          profileId={profile.id}
          token={token}
          initialMemory={content.memory?.content_text ?? ""}
          initialNote={content.note?.content_text ?? ""}
        />
        <AudioRecorderForm
          profileId={profile.id}
          token={token}
          hasExistingAudio={Boolean(content.audio?.file_path)}
        />
        <PhotoUploadForm profileId={profile.id} token={token} />
        <LocationPicker
          profileId={profile.id}
          token={token}
          initialLat={profile.lat}
          initialLng={profile.lng}
        />
      </div>

      {group && (
        <p className="mt-6 text-center text-sm text-ink/40">
          Part of{" "}
          <Link
            href={`/group/${group.slug}`}
            className="text-terracotta hover:underline"
          >
            {group.name}
          </Link>
        </p>
      )}
    </main>
  );
}
