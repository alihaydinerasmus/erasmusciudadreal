import { redirect } from "next/navigation";
import { AdminArchiveToolbar } from "@/components/AdminArchiveToolbar";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import { GROUP_SLUG } from "@/lib/constants";
import { getAdminProfileSummaries } from "@/lib/queries";
import "./archive.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Arşiv — Admin",
  robots: { index: false, follow: false },
};

function formatArchiveDate() {
  return new Date().toLocaleDateString("tr-TR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function AdminArchivePage() {
  if (!hasAdminAccessFromCookies()) {
    redirect("/admin/login");
  }

  const summaries = await getAdminProfileSummaries(GROUP_SLUG);
  if (!summaries) {
    redirect("/admin");
  }

  const archiveDate = formatArchiveDate();

  return (
    <div className="archive-root">
      <AdminArchiveToolbar profileCount={summaries.length} />

      <section className="archive-cover">
        <p>ERASMUS · UCLM · 2025–26</p>
        <h1>Ciudad Real &apos;25–26 — Erasmus Anı Albümü</h1>
        <p>{archiveDate}</p>
      </section>

      {summaries.map(({ profile, memory, note }) => {
        const location = [profile.city, profile.country]
          .filter(Boolean)
          .join(", ");
        const hasMemory = Boolean(memory?.content_text?.trim());
        const hasNote = Boolean(note?.content_text?.trim());

        return (
          <article key={profile.id} className="archive-person">
            <header className="archive-person-header">
              <span className="text-3xl leading-none" aria-hidden="true">
                {profile.flag_emoji ?? "🌍"}
              </span>
              <div>
                <h2>{profile.name}</h2>
                {location && <p className="location">{location}</p>}
              </div>
            </header>

            {hasMemory ? (
              <section className="archive-section">
                <h3>Favori Anı</h3>
                <p>{memory!.content_text!.trim()}</p>
              </section>
            ) : (
              <section className="archive-section">
                <h3>Favori Anı</h3>
                <p className="opacity-40">—</p>
              </section>
            )}

            {hasNote ? (
              <section className="archive-section archive-note">
                <h3>Ali&apos;ye Not</h3>
                <p>{note!.content_text!.trim()}</p>
              </section>
            ) : (
              <section className="archive-section archive-note">
                <h3>Ali&apos;ye Not</h3>
                <p className="opacity-40">—</p>
              </section>
            )}
          </article>
        );
      })}
    </div>
  );
}
