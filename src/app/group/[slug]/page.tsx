import { notFound } from "next/navigation";
import { ProfileCard } from "@/components/ProfileCard";
import { PageHeader } from "@/components/PageHeader";
import { getGroupBySlug, getProfilesByGroupId } from "@/lib/queries";

interface GroupPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: GroupPageProps) {
  const group = await getGroupBySlug(params.slug);
  return {
    title: group ? `${group.name} — Memory Album` : "Group not found",
  };
}

export default async function GroupPage({ params }: GroupPageProps) {
  const group = await getGroupBySlug(params.slug);

  if (!group) {
    notFound();
  }

  const profiles = await getProfilesByGroupId(group.id);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12 sm:py-16">
      <PageHeader
        backHref="/"
        backLabel="Home"
        title={group.name}
        subtitle="Everyone who was there — and where they are now."
      />

      {profiles.length === 0 ? (
        <p className="text-center text-ink/50">
          No profiles yet. Share edit links with your friends to get started.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {profiles.map((profile) => (
            <li key={profile.id}>
              <ProfileCard profile={profile} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
