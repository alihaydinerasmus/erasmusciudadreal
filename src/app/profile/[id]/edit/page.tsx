import { notFound } from "next/navigation";
import { EditAccessDenied } from "@/components/EditAccessDenied";
import { EditPageClient } from "@/components/EditPageClient";
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

export default async function EditProfilePage({
  params,
  searchParams,
}: EditProfilePageProps) {
  const token = searchParams.token;

  if (!token) {
    return <EditAccessDenied profileId={params.id} />;
  }

  const existing = await getProfileById(params.id);
  if (!existing) {
    notFound();
  }

  const profile = await getProfileForEdit(params.id, token);
  if (!profile) {
    return <EditAccessDenied profileId={params.id} />;
  }

  const [group, content, hasAnyContent] = await Promise.all([
    getGroupForProfile(profile),
    getProfileEditorContent(profile.id),
    profileHasAnyContent(profile.id),
  ]);

  return (
    <EditPageClient
      profile={profile}
      token={token}
      group={group}
      initialMemory={content.memory?.content_text ?? ""}
      initialNote={content.note?.content_text ?? ""}
      hasExistingAudio={Boolean(content.audio?.file_path)}
      showWelcome={!hasAnyContent}
    />
  );
}
