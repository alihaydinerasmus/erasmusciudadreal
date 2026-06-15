"use client";

import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditAccessDeniedProps {
  profileId: string;
}

export function EditAccessDenied({ profileId }: EditAccessDeniedProps) {
  const { t } = useLanguage();

  return (
    <PageShell>
      <PageHeader title={t.edit.accessDenied} />
      <p className="body-text">{t.edit.accessDeniedDesc}</p>
      <Link
        href={`/profile/${profileId}`}
        className="back-link mt-8 inline-block"
      >
        {t.edit.viewPublicProfile}
      </Link>
    </PageShell>
  );
}
