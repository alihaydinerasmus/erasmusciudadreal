"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { PageShell } from "@/components/PageShell";
import { useLanguage } from "@/contexts/LanguageContext";

function EnterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLanguage();
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const redirectTo = searchParams.get("redirect") || "/";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(false);

    try {
      const res = await fetch("/api/group-enter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
        credentials: "include",
      });

      if (!res.ok) {
        setError(true);
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageShell centered>
      <div className="w-full">
        <h1 className="page-title">{t.enter.title}</h1>
        <p className="muted-text mt-3">{t.enter.subtitle}</p>

        <form onSubmit={handleSubmit} className="mt-10 space-y-6">
          <input
            id="group-password"
            type="password"
            required
            autoFocus
            aria-label={t.enter.passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="guestbook-input"
            placeholder={t.enter.passwordPlaceholder}
          />

          {error && (
            <p className="muted-text text-terracotta-dark">{t.enter.wrongPassword}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="btn-primary w-full"
          >
            {loading ? t.enter.entering : t.enter.submit}
          </button>
        </form>
      </div>
    </PageShell>
  );
}

export function EnterPageClient() {
  return (
    <Suspense fallback={<PageShell centered />}>
      <EnterForm />
    </Suspense>
  );
}
