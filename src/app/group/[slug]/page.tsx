import { notFound } from "next/navigation";
import { GroupPageClient } from "@/components/GroupPageClient";
import { getGroupBySlug, getGroupPlaylist, getProfilesByGroupId } from "@/lib/queries";

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
  const playlist = await getGroupPlaylist(group.id);

  return <GroupPageClient group={group} profiles={profiles} playlist={playlist} />;
}
