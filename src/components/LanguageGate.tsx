"use client";

import { LanguagePicker } from "@/components/LanguagePicker";
import { useLanguage } from "@/contexts/LanguageContext";

export function LanguageGate({ children }: { children: React.ReactNode }) {
  const { ready, hasStoredLang, setLang } = useLanguage();

  if (!ready) {
    return (
      <div
        className="min-h-screen bg-cream dark:bg-dark-bg"
        aria-busy="true"
        aria-label="Loading"
      />
    );
  }

  if (!hasStoredLang) {
    return <LanguagePicker onSelect={setLang} />;
  }

  return <>{children}</>;
}
