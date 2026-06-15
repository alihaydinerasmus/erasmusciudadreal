"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface EditWelcomeGuideProps {
  profileId: string;
  name: string;
  show: boolean;
}

function storageKey(profileId: string) {
  return `edit-welcome-dismissed-${profileId}`;
}

export function EditWelcomeGuide({ profileId, name, show }: EditWelcomeGuideProps) {
  const { t } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!show) return;
    if (localStorage.getItem(storageKey(profileId))) return;
    setVisible(true);
  }, [show, profileId]);

  function dismiss() {
    localStorage.setItem(storageKey(profileId), "1");
    setVisible(false);
    document.getElementById("edit-form")?.scrollIntoView({ behavior: "smooth" });
  }

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-6 backdrop-blur-[1px] dark:bg-black/50"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-welcome-title"
    >
      <div className="mx-auto w-full max-w-md rounded-sm border border-ink/10 bg-paper p-8 shadow-warm dark:border-dark-border dark:bg-dark-surface dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]">
        <h2 id="edit-welcome-title" className="font-serif text-2xl text-ink dark:text-dark-text">
          {t.welcome.title(name)}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-ink/70 dark:text-dark-text/70">{t.welcome.intro}</p>
        <p className="mt-3 text-sm leading-relaxed text-ink/65 dark:text-dark-text/65">
          {t.welcome.privacy}
        </p>
        <p className="mt-4 text-sm text-ink/70 dark:text-dark-text/70">{t.welcome.lead}</p>

        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75 dark:text-dark-text/75">
          {t.welcome.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="mt-5 font-serif text-sm italic text-ink/60 dark:text-dark-muted">
          {t.welcome.optional}
          <br />
          {t.welcome.skip}
        </p>

        <button type="button" onClick={dismiss} className="btn-primary mt-8 w-full">
          {t.welcome.button}
        </button>
      </div>
    </div>
  );
}
