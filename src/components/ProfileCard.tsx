import Link from "next/link";
import type { PublicProfile } from "@/types/database";

interface ProfileCardProps {
  profile: PublicProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const location = [profile.city, profile.country].filter(Boolean).join(", ");

  return (
    <Link
      href={`/profile/${profile.id}`}
      className="group block border-b border-ink/10 py-5 transition-colors hover:bg-paper-dark/40 dark:border-dark-border dark:hover:bg-dark-surface/60"
    >
      <span className="text-2xl leading-none" aria-hidden="true">
        {profile.flag_emoji ?? "🌍"}
      </span>
      <h2 className="section-title mt-3">{profile.name}</h2>
      {location && <p className="muted-text mt-1">{location}</p>}
    </Link>
  );
}
