"use client";

import Link from "next/link";
import { ProfileCard } from "@/components/ProfileCard";
import { PageHeader } from "@/components/PageHeader";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/contexts/LanguageContext";
import type { GroupSong } from "@/lib/songs";
import type { PublicProfile } from "@/types/database";

interface GroupPageClientProps {
  group: { name: string; slug: string };
  profiles: PublicProfile[];
  playlist: GroupSong[];
}

export function GroupPageClient({
  group,
  profiles,
  playlist,
}: GroupPageClientProps) {
  const { t } = useLanguage();
  const hasMapPins = profiles.some((p) => p.lat != null && p.lng != null);

  return (
    <PageShell>
      <PageHeader
        backHref="/"
        backLabel={t.common.home}
        title={group.name}
      />

      {hasMapPins && (
        <div className="mb-8">
          <Link
            href={`/group/${group.slug}/map`}
            className="inline-flex items-center gap-2 text-[15px] text-terracotta hover:text-terracotta-dark dark:text-terracotta-light dark:hover:text-terracotta"
          >
            {t.group.mapLink}
          </Link>
        </div>
      )}

      {profiles.length === 0 ? (
        <p className="body-text">{t.group.emptyProfiles}</p>
      ) : (
        <ul>
          {profiles.map((profile) => (
            <li key={profile.id}>
              <ProfileCard profile={profile} />
            </li>
          ))}
        </ul>
      )}

      <section className="edit-section mt-4">
        <h2 className="section-title">{t.group.playlist}</h2>
        {playlist.length === 0 ? (
          <p className="muted-text mt-3">{t.group.playlistEmpty}</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {playlist.map((song) => (
              <li key={song.id} className="body-text">
                {song.spotifyUrl ? (
                  <a
                    href={song.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-terracotta hover:text-terracotta-dark dark:text-terracotta-light dark:hover:text-terracotta"
                  >
                    {song.title} — {song.artist}
                  </a>
                ) : (
                  <span>
                    {song.title} — {song.artist}
                  </span>
                )}
                <span className="muted-text ml-2">· {song.profileName}</span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </PageShell>
  );
}
