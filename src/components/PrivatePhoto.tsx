"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PrivatePhotoProps {
  filePath: string;
  alt?: string;
  caption?: string | null;
}

type PhotoState = "loading" | "locked" | "ready" | "error";

export function PrivatePhoto({ filePath, alt, caption }: PrivatePhotoProps) {
  const { t } = useLanguage();
  const [state, setState] = useState<PhotoState>("loading");
  const [signedUrl, setSignedUrl] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadSignedUrl() {
      setState("loading");

      try {
        const res = await fetch(
          `/api/signed-url?path=${encodeURIComponent(filePath)}`,
          { credentials: "include" }
        );

        if (res.status === 403) {
          if (!cancelled) setState("locked");
          return;
        }

        if (!res.ok) {
          if (!cancelled) setState("error");
          return;
        }

        const data = await res.json();
        if (!cancelled) {
          setSignedUrl(data.signedUrl);
          setState("ready");
        }
      } catch {
        if (!cancelled) setState("error");
      }
    }

    loadSignedUrl();

    return () => {
      cancelled = true;
    };
  }, [filePath]);

  return (
    <figure className="overflow-hidden rounded-sm border border-ink/10 bg-paper-dark dark:border-dark-border dark:bg-dark-surface">
      {state === "loading" && (
        <div className="flex aspect-[4/3] items-center justify-center text-sm text-ink/40 dark:text-dark-muted">
          {t.profile.loadingPhoto}
        </div>
      )}

      {state === "locked" && (
        <div className="flex aspect-[4/3] flex-col items-center justify-center gap-2 px-4 text-center">
          <span className="text-2xl opacity-40" aria-hidden="true">
            🔒
          </span>
          <p className="font-serif text-sm text-ink/50 dark:text-dark-muted">
            {t.profile.privatePhoto}
          </p>
        </div>
      )}

      {state === "error" && (
        <div className="flex aspect-[4/3] items-center justify-center text-sm text-ink/40 dark:text-dark-muted">
          {t.profile.photoError}
        </div>
      )}

      {state === "ready" && signedUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={signedUrl}
          alt={alt ?? t.profile.photos}
          className="aspect-[4/3] w-full object-cover"
        />
      )}

      {caption && (
        <figcaption className="border-t border-ink/10 px-4 py-3 font-serif text-sm italic text-ink/60 dark:border-dark-border dark:text-dark-muted">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}
