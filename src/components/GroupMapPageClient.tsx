"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { useLanguage } from "@/contexts/LanguageContext";
import type { PublicProfile } from "@/types/database";

interface GroupMapPageClientProps {
  group: { name: string; slug: string };
  profiles: PublicProfile[];
}

const GroupMapInner = dynamic(() => import("./GroupMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center bg-cream text-sm text-ink/40 dark:bg-dark-bg dark:text-dark-muted">
      …
    </div>
  ),
});

export function GroupMapPageClient({
  group,
  profiles,
}: GroupMapPageClientProps) {
  const { t } = useLanguage();
  const mappableCount = profiles.filter(
    (p) => p.lat != null && p.lng != null
  ).length;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="page-shell pb-4">
        <PageHeader
          backHref={`/group/${group.slug}`}
          backLabel={group.name}
          title={t.group.mapTitle}
        />
        {mappableCount === 0 && (
          <p className="body-text">{t.group.mapEmpty}</p>
        )}
      </div>

      <div className="min-h-0 flex-1">
        {mappableCount > 0 ? (
          <GroupMapInner profiles={profiles} />
        ) : (
          <div className="flex h-64 items-center justify-center">
            <Link
              href={`/group/${group.slug}`}
              className="text-[13px] text-terracotta hover:underline dark:text-terracotta-light"
            >
              ← {group.name}
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
