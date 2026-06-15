"use client";

import Link from "next/link";
import { useLanguage } from "@/contexts/LanguageContext";

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-cream px-6 text-center dark:bg-dark-bg">
      <h1 className="page-title journal-fade-in">{t.notFound.title}</h1>
      <p className="body-text journal-fade-in-delay mt-4 max-w-sm text-balance italic">
        {t.notFound.subtitle}
      </p>
      <Link
        href="/"
        className="journal-fade-in-delay mt-10 text-[15px] text-terracotta transition-colors hover:text-terracotta-dark dark:text-terracotta-light dark:hover:text-terracotta"
      >
        {t.notFound.home}
      </Link>
    </div>
  );
}
