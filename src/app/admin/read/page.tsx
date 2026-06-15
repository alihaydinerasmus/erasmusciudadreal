import { redirect } from "next/navigation";
import { AdminReadClient } from "@/components/AdminReadClient";
import { hasAdminAccessFromCookies } from "@/lib/admin-auth";
import { GROUP_SLUG } from "@/lib/constants";
import { getAdminProfileSummaries } from "@/lib/queries";
import { createProfileMediaSignedUrl } from "@/lib/signed-url";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Okuma Modu — Admin",
  robots: { index: false, follow: false },
};

export default async function AdminReadPage() {
  if (!hasAdminAccessFromCookies()) {
    redirect("/admin/login");
  }

  const summaries = await getAdminProfileSummaries(GROUP_SLUG);
  if (!summaries) {
    redirect("/admin");
  }

  const withNotes = summaries.filter((s) => s.note?.content_text?.trim());

  const entries = await Promise.all(
    withNotes.map(async (summary) => {
      const audioUrl =
        summary.audio?.file_path
          ? await createProfileMediaSignedUrl(summary.audio.file_path)
          : null;

      return {
        profileId: summary.profile.id,
        name: summary.profile.name,
        flagEmoji: summary.profile.flag_emoji,
        city: summary.profile.city,
        country: summary.profile.country,
        note: summary.note!.content_text!.trim(),
        audioUrl,
      };
    })
  );

  return <AdminReadClient entries={entries} />;
}
