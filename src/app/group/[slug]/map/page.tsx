import { notFound } from "next/navigation";
import { GroupMapPageClient } from "@/components/GroupMapPageClient";
import { getGroupBySlug, getProfilesByGroupId } from "@/lib/queries";

interface GroupMapPageProps {
  params: { slug: string };
}

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: GroupMapPageProps) {
  const group = await getGroupBySlug(params.slug);
  return {
    title: group ? `${group.name} — Map` : "Map not found",
  };
}

export default async function GroupMapPage({ params }: GroupMapPageProps) {
  const group = await getGroupBySlug(params.slug);

  if (!group) {
    notFound();
  }

  const profiles = await getProfilesByGroupId(group.id);

  return <GroupMapPageClient group={group} profiles={profiles} />;
}
