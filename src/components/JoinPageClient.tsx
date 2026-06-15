"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { MY_EDIT_LINK_KEY } from "@/lib/constants";
import { useLanguage } from "@/contexts/LanguageContext";

export function JoinPageClient() {
  const router = useRouter();
  const { t } = useLanguage();
  const [name, setName] = useState("");
  const [myEditLink, setMyEditLink] = useState<string | null>(null);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(MY_EDIT_LINK_KEY);
    if (stored) setMyEditLink(stored);
    setReady(true);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
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
        <p className="font-serif text-2xl font-normal italic text-ink/85">
          {t.join.greeting}
        </p>

        {myEditLink ? (
          <div className="mt-12">
            <Link href={myEditLink} className="btn-primary block w-full text-center">
              {t.join.continue}
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-10 space-y-8">
            <input
              id="join-name"
              type="text"
              required
              autoFocus
              aria-label={t.join.namePlaceholder}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="guestbook-input"
              placeholder={t.join.namePlaceholder}
            />

            {error && (
              <p className="muted-text text-terracotta-dark">{error}</p>
            )}

            <button
              type="submit"
              disabled={submitting || !name.trim()}
              className="btn-primary w-full"
            >
              {submitting ? t.join.joining : t.join.submit}
            </button>
          </form>
        )}
      </div>
    </PageShell>
  );
}
