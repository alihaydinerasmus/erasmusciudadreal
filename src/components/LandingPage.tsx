"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export function LandingPage() {
  const { t } = useLanguage();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 py-20 dark:bg-dark-bg">
      <div className="mx-auto flex w-full max-w-[480px] flex-col items-center text-center">
        <p className="font-sans text-[0.65rem] font-light uppercase tracking-[0.35em] text-ink/45 dark:text-dark-muted">
          {t.landing.subtitle}
        </p>

        <h1 className="mt-6 font-serif text-6xl font-normal leading-none tracking-tight text-ink dark:text-dark-text sm:text-7xl">
          Ciudad Real
        </h1>

        <div
          className="my-10 h-px w-24 bg-gradient-to-r from-transparent via-ink/15 to-transparent dark:via-dark-border"
          aria-hidden="true"
        />

        <p className="font-serif text-xl italic leading-relaxed text-ink/70 dark:text-dark-text/70">
          {t.landing.tagline}
        </p>

        <div className="my-12 h-px w-16 bg-ink/10 dark:bg-dark-border" aria-hidden="true" />

        <Link
          href="/join"
          className="group inline-flex items-center gap-2 font-serif text-lg tracking-wide text-terracotta transition-colors hover:text-terracotta-dark dark:text-terracotta-light dark:hover:text-terracotta"
        >
          {t.landing.enter}
        </Link>
      </div>

      <p className="mt-auto pt-16 font-sans text-[0.7rem] font-light tracking-[0.12em] text-ink/35 dark:text-dark-muted">
        {t.landing.footer}
      </p>
    </main>
  );
}
