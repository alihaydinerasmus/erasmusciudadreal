import Link from "next/link";
import { redirect } from "next/navigation";
import { GROUP_SLUG } from "@/lib/constants";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import { getAdminProfileSummaries } from "@/lib/queries";
import { createProfileMediaSignedUrl } from "@/lib/signed-url";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

export default async function AdminDashboardPage() {
  if (!hasAdminAccessFromCookies()) {
    redirect("/admin/login");
  }

  const summaries = await getAdminProfileSummaries(GROUP_SLUG);

  if (!summaries) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-10">
        <p className="text-ink/60 dark:text-dark-text/60">Group not found.</p>
      </main>
    );
  }

  const profiles = await Promise.all(
    summaries.map(async (summary) => {
      const audioUrl =
        summary.audio?.file_path
          ? await createProfileMediaSignedUrl(summary.audio.file_path)
          : null;

      const photoUrls = await Promise.all(
        summary.photos
          .filter((photo) => photo.file_path)
          .map(async (photo) => ({
            id: photo.id,
            url: await createProfileMediaSignedUrl(photo.file_path!),
          }))
      );

      return {
        ...summary,
        audioUrl,
        photoUrls: photoUrls.filter(
          (photo): photo is { id: string; url: string } => photo.url !== null
        ),
      };
    })
  );

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link
        href={`/group/${GROUP_SLUG}`}
        className="text-[13px] text-ink/40 hover:text-ink/70 dark:text-dark-muted dark:hover:text-dark-text/80"
      >
        ← Back to album
      </Link>

      <h1 className="mt-6 font-serif text-2xl font-normal text-ink dark:text-dark-text">Admin</h1>
      <p className="mt-1 text-[13px] text-ink/40 dark:text-dark-muted">
        {profiles.length} profile{profiles.length !== 1 ? "s" : ""}
      </p>

      {profiles.length === 0 ? (
        <p className="mt-10 text-ink/60 dark:text-dark-text/60">No profiles yet.</p>
      ) : (
        <ul className="mt-10 space-y-12">
          {profiles.map((entry) => {
            const { profile, memory, note, audioUrl, photoUrls } = entry;
            const location = [profile.city, profile.country]
              .filter(Boolean)
              .join(", ");

            return (
              <li
                key={profile.id}
                className="border-t border-ink/10 pt-8 first:border-t-0 first:pt-0 dark:border-dark-border"
              >
                <div className="flex items-start gap-3">
                  <span className="text-2xl leading-none">
                    {profile.flag_emoji ?? "🌍"}
                  </span>
                  <div>
                    <h2 className="font-serif text-lg font-normal text-ink dark:text-dark-text">
                      <Link
                        href={`/profile/${profile.id}`}
                        className="hover:text-terracotta dark:hover:text-terracotta-light"
                      >
                        {profile.name}
                      </Link>
                    </h2>
                    {location && (
                      <p className="mt-1 text-[13px] text-ink/40 dark:text-dark-muted">{location}</p>
                    )}
                  </div>
                </div>

                {memory?.content_text?.trim() && (
                  <div className="mt-6">
                    <h3 className="text-[13px] uppercase tracking-wide text-ink/40 dark:text-dark-muted">
                      Favorite memory
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/80 dark:text-dark-text/80">
                      {memory.content_text}
                    </p>
                  </div>
                )}

                {note?.content_text?.trim() && (
                  <div className="mt-6">
                    <h3 className="text-[13px] uppercase tracking-wide text-ink/40 dark:text-dark-muted">
                      Note to Ali
                    </h3>
                    <p className="mt-2 whitespace-pre-wrap text-[15px] leading-relaxed text-ink/80 dark:text-dark-text/80">
                      {note.content_text}
                    </p>
                  </div>
                )}

                {audioUrl && (
                  <div className="mt-6">
                    <h3 className="mb-2 text-[13px] uppercase tracking-wide text-ink/40 dark:text-dark-muted">
                      Audio
                    </h3>
                    <audio controls preload="metadata" className="w-full">
                      <source src={audioUrl} />
                    </audio>
                  </div>
                )}

                {photoUrls.length > 0 && (
                  <div className="mt-6">
                    <h3 className="mb-3 text-[13px] uppercase tracking-wide text-ink/40 dark:text-dark-muted">
                      Photos
                    </h3>
                    <ul className="flex flex-wrap gap-2">
                      {photoUrls.map((photo) => (
                        <li key={photo.id}>
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={photo.url}
                            alt=""
                            className="h-20 w-20 border border-ink/10 object-cover"
                          />
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {!memory?.content_text?.trim() &&
                  !note?.content_text?.trim() &&
                  !audioUrl &&
                  photoUrls.length === 0 && (
                    <p className="mt-6 text-[13px] italic text-ink/40 dark:text-dark-muted">
                      Nothing submitted yet.
                    </p>
                  )}
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
