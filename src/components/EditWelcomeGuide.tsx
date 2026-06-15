"use client";

import { useEffect, useState } from "react";
import type { WelcomeLocale } from "@/lib/welcome-locale";

interface EditWelcomeGuideProps {
  profileId: string;
  show: boolean;
  locale?: WelcomeLocale;
}

const COPY = {
  tr: {
    title: "Hoş geldin 👋",
    intro: "Bu sayfa sadece sana ait — linkini kimseyle paylaşma.",
    lead: "Burada birkaç şey bırakabilirsin:",
    items: [
      "✍️ Favori anın — herkes görebilir",
      "💌 Ali'ye özel bir not — sadece Ali okuyacak",
      "🎙️ Sesli mesaj — sadece Ali dinleyecek",
      "📸 Fotoğraflar — sadece Ali görecek",
      "📍 Şehrin — haritada görünecek",
    ],
    optional: "Hepsini doldurmak zorunda değilsin.",
    skip: "İstediğini bırak, istediğini boş bırak.",
    button: "Tamam, başlayalım →",
  },
  en: {
    title: "Welcome 👋",
    intro: "This page is only for you — don't share your link with anyone.",
    lead: "Here you can leave a few things:",
    items: [
      "✍️ Your favorite memory — everyone can see it",
      "💌 A private note to Ali — only Ali will read it",
      "🎙️ A voice message — only Ali will listen",
      "📸 Photos — only Ali will see them",
      "📍 Your city — shown on the map",
    ],
    optional: "You don't have to fill everything in.",
    skip: "Leave what you want, skip what you don't.",
    button: "Okay, let's start →",
  },
} as const;

function storageKey(profileId: string) {
  return `edit-welcome-dismissed-${profileId}`;
}

export function EditWelcomeGuide({
  profileId,
  show,
  locale = "tr",
}: EditWelcomeGuideProps) {
  const [visible, setVisible] = useState(false);
  const copy = COPY[locale];

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/25 px-6 backdrop-blur-[1px]"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-welcome-title"
    >
      <div className="mx-auto w-full max-w-md rounded-sm border border-ink/10 bg-paper p-8 shadow-warm">
        <h2
          id="edit-welcome-title"
          className="font-serif text-2xl text-ink"
        >
          {copy.title}
        </h2>

        <p className="mt-4 text-sm leading-relaxed text-ink/70">{copy.intro}</p>

        <p className="mt-4 text-sm text-ink/70">{copy.lead}</p>

        <ul className="mt-3 space-y-2 text-sm leading-relaxed text-ink/75">
          {copy.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>

        <p className="mt-5 font-serif text-sm italic text-ink/60">
          {copy.optional}
          <br />
          {copy.skip}
        </p>

        <button
          type="button"
          onClick={dismiss}
          className="btn-primary mt-8 w-full"
        >
          {copy.button}
        </button>
      </div>
    </div>
  );
}
