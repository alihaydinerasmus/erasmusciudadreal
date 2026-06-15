import { notFound } from "next/navigation";
import { AdminUnlockForm } from "@/components/AdminUnlockForm";
import { PageHeader } from "@/components/PageHeader";
import { PhotoGallery } from "@/components/PhotoGallery";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import {
  getGroupForProfile,
  getProfileById,
  getProfilePhotos,
} from "@/lib/queries";

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

  const [group, photos] = await Promise.all([
    getGroupForProfile(profile),
    getProfilePhotos(profile.id),
  ]);

  const hasAdminAccess = hasAdminAccessFromCookies();

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
            {(profile.city || profile.country) && (
              <p className="mt-1 text-ink/60">
                {[profile.city, profile.country].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>

        {profile.lat != null && profile.lng != null && (
          <p className="mb-8 text-sm text-ink/40">
            {profile.lat.toFixed(4)}°, {profile.lng.toFixed(4)}°
          </p>
        )}

        <PhotoGallery photos={photos} profileName={profile.name} />

        {photos.length === 0 && (
          <div className="border-t border-ink/10 pt-8">
            <p className="font-serif text-sm italic text-ink/50">
              No photos yet. Notes and memories will appear here in Phase 2.
            </p>
          </div>
        )}

        {photos.length > 0 && !hasAdminAccess && (
          <div className="mt-8 rounded-sm border border-ink/10 bg-cream-dark/50 p-6">
            <p className="mb-4 text-center font-serif text-sm text-ink/60">
              Photos are private. Enter your admin token to view them.
            </p>
            <AdminUnlockForm />
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
