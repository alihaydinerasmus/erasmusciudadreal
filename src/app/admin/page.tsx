import Link from "next/link";
import { redirect } from "next/navigation";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import { getAdminProfileSummaries } from "@/lib/queries";
import { createProfileMediaSignedUrl } from "@/lib/signed-url";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Admin Dashboard",
  robots: { index: false, follow: false },
};

const GROUP_SLUG = "ciudad-real-2526";

function YesNo({ value }: { value: boolean }) {
  return <span>{value ? "Yes" : "No"}</span>;
}

export default async function AdminDashboardPage() {
  if (!hasAdminAccessFromCookies()) {
    redirect("/admin/login");
  }

  const summaries = await getAdminProfileSummaries(GROUP_SLUG);

  if (!summaries) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-12">
        <p className="text-ink/60">Group not found.</p>
      </main>
    );
  }

  const rows = await Promise.all(
    summaries.map(async (summary) => {
      const hasMemory = Boolean(summary.memory?.content_text?.trim());
      const hasNote = Boolean(summary.note?.content_text?.trim());
      const hasAudio = Boolean(summary.audio?.file_path);
      const hasPhotos = summary.photos.length > 0;

      const audioUrl =
        hasAudio && summary.audio?.file_path
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
        hasMemory,
        hasNote,
        hasAudio,
        hasPhotos,
        audioUrl,
        photoUrls: photoUrls.filter(
          (photo): photo is { id: string; url: string } => photo.url !== null
        ),
      };
    })
  );

  return (
    <main className="mx-auto max-w-6xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="font-serif text-2xl text-ink">Admin dashboard</h1>
        <Link href="/group/ciudad-real-2526" className="text-sm text-terracotta hover:underline">
          ← Back to group
        </Link>
      </div>

      {rows.length === 0 ? (
        <p className="text-ink/60">No profiles yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-ink/15">
                <th className="py-3 pr-4 font-serif font-normal text-ink/70">Name</th>
                <th className="py-3 pr-4 font-serif font-normal text-ink/70">Country</th>
                <th className="py-3 pr-4 font-serif font-normal text-ink/70">Memory</th>
                <th className="py-3 pr-4 font-serif font-normal text-ink/70">Note to Ali</th>
                <th className="py-3 pr-4 font-serif font-normal text-ink/70">Audio</th>
                <th className="py-3 font-serif font-normal text-ink/70">Photos</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.profile.id} className="border-b border-ink/10 align-top">
                  <td className="py-4 pr-4">
                    <Link
                      href={`/profile/${row.profile.id}`}
                      className="text-terracotta hover:underline"
                    >
                      {row.profile.name}
                    </Link>
                  </td>
                  <td className="py-4 pr-4 text-ink/70">
                    {row.profile.country ?? "—"}
                  </td>
                  <td className="py-4 pr-4">
                    <YesNo value={row.hasMemory} />
                  </td>
                  <td className="max-w-xs py-4 pr-4">
                    <YesNo value={row.hasNote} />
                    {row.hasNote && row.note?.content_text && (
                      <p className="mt-2 whitespace-pre-wrap text-xs italic text-ink/60">
                        {row.note.content_text}
                      </p>
                    )}
                  </td>
                  <td className="py-4 pr-4">
                    <YesNo value={row.hasAudio} />
                    {row.hasAudio && row.audioUrl && (
                      <audio
                        controls
                        preload="metadata"
                        className="mt-2 w-full max-w-xs"
                      >
                        <source src={row.audioUrl} />
                      </audio>
                    )}
                  </td>
                  <td className="py-4">
                    <YesNo value={row.hasPhotos} />
                    {row.hasPhotos && row.photoUrls.length > 0 && (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {row.photoUrls.map((photo) => (
                          <li key={photo.id}>
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={photo.url}
                              alt=""
                              className="h-16 w-16 rounded-sm border border-ink/10 object-cover"
                            />
                          </li>
                        ))}
                      </ul>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
