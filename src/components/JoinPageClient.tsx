"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MY_EDIT_LINK_KEY } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

const MIN_NAME_LENGTH = 2;

export function JoinPageClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [myEditLink, setMyEditLink] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const trimmedName = name.trim();
  const canSubmit = trimmedName.length >= MIN_NAME_LENGTH;

  useEffect(() => {
    const stored = localStorage.getItem(MY_EDIT_LINK_KEY);
    if (stored) setMyEditLink(stored);
    setReady(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmedName }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.common.somethingWentWrong);
      }

      localStorage.setItem(MY_EDIT_LINK_KEY, data.editLink);
      router.push(data.editLink);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.common.somethingWentWrong
      );
      setSubmitting(false);
    }
  }

  if (!ready) {
    return <PageShell centered />;
  }

  return (
    <PageShell centered>
      <div className="w-full">
        <p className="font-serif text-2xl font-normal italic text-ink/85 dark:text-dark-text/85">
          {t.join.greeting}
        </p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-8">
          <input
            id="join-name"
            type="text"
            required
            autoFocus
            minLength={MIN_NAME_LENGTH}
            aria-label={t.join.namePlaceholder}
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="guestbook-input w-full"
            placeholder={t.join.namePlaceholder}
          />

          {error && (
            <p className="muted-text text-terracotta-dark dark:text-terracotta-light">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting || !canSubmit}
            className="btn-primary w-full"
          >
            {submitting ? t.join.joining : t.join.continue}
          </button>
        </form>

        {myEditLink && (
          <p className="muted-text mt-6 text-center">
            <Link
              href={myEditLink}
              className="text-terracotta hover:text-terracotta-dark dark:text-terracotta-light dark:hover:text-terracotta"
            >
              {t.join.continue}
            </Link>
          </p>
        )}
      </div>
    </PageShell>
  );
}
