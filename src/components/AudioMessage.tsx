"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface AudioMessageProps {
  signedUrl: string;
  profileName: string;
}

export function AudioMessage({ signedUrl, profileName }: AudioMessageProps) {
  const { t } = useLanguage();

  return (
    <section className="edit-section">
      <h2 className="section-title mb-4">{t.profile.audioMessage}</h2>
      <audio
          controls
          preload="metadata"
          className="w-full"
          aria-label={t.profile.audioFrom(profileName)}
        >
          <source src={signedUrl} />
          {t.profile.audioUnsupported}
        </audio>
    </section>
  );
}
