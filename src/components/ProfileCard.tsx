import Link from "next/link";
import type { PublicProfile } from "@/types/database";

interface ProfileCardProps {
  profile: PublicProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  return (
    <Link
      href={`/profile/${profile.id}`}
      className="group block rounded-sm border border-ink/10 bg-paper p-6 shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:border-terracotta/30 hover:shadow-warm"
    >
      <div className="mb-4 flex items-start justify-between">
        <span className="text-3xl leading-none" aria-hidden="true">
          {profile.flag_emoji ?? "🌍"}
        </span>
        <span className="font-serif text-xs uppercase tracking-widest text-ink/40 opacity-0 transition-opacity group-hover:opacity-100">
          View →
        </span>
      </div>

      <h2 className="font-serif text-xl text-ink">{profile.name}</h2>

      {(profile.city || profile.country) && (
        <p className="mt-2 text-sm text-ink/60">
          {[profile.city, profile.country].filter(Boolean).join(", ")}
        </p>
      )}
    </Link>
  );
}
