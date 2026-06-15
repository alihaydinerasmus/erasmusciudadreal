"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

export interface ReadEntry {
  profileId: string;
  name: string;
  flagEmoji: string | null;
  city: string | null;
  country: string | null;
  note: string;
  audioUrl: string | null;
}

interface AdminReadClientProps {
  entries: ReadEntry[];
}

export function AdminReadClient({ entries }: AdminReadClientProps) {
  const [index, setIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const entry = entries[index];

  const goPrev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(entries.length - 1, i + 1));
  }, [entries.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !entry?.audioUrl) return;

    audio.volume = 0.22;
    audio.load();
    const timer = window.setTimeout(() => {
      audio.play().catch(() => {});
    }, 400);

    return () => window.clearTimeout(timer);
  }, [index, entry?.audioUrl]);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [goPrev, goNext]);

  if (entries.length === 0) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#1C1410] px-6 text-[#F5EDE0]">
        <p className="font-serif text-xl italic opacity-70">
          Henüz kimse not bırakmadı.
        </p>
        <Link
          href="/admin"
          className="mt-8 text-sm text-[#D4845A] hover:text-[#E8A882]"
        >
          ← Admin
        </Link>
      </div>
    );
  }

  const location = [entry.city, entry.country].filter(Boolean).join(", ");

  return (
    <div className="relative flex min-h-screen flex-col bg-[#1C1410] text-[#F5EDE0]">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_42%,rgba(212,132,90,0.07)_0%,transparent_65%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_100%_100%_at_50%_100%,rgba(0,0,0,0.45)_0%,transparent_55%)]"
        aria-hidden="true"
      />

      <header className="relative z-10 flex items-center justify-between px-6 py-5">
        <Link
          href="/admin"
          className="text-[13px] text-[#F5EDE0]/35 transition-colors hover:text-[#F5EDE0]/65"
        >
          ← Admin
        </Link>
        <span className="text-[12px] tracking-[0.2em] text-[#F5EDE0]/30">
          {index + 1} / {entries.length}
        </span>
      </header>

      <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 pb-32 pt-4">
        <div className="mb-10 text-center">
          <span className="text-5xl leading-none" aria-hidden="true">
            {entry.flagEmoji ?? "🌍"}
          </span>
          <h1 className="mt-5 font-serif text-4xl font-normal tracking-tight sm:text-5xl">
            {entry.name}
          </h1>
          {location && (
            <p className="mt-3 text-sm tracking-wide text-[#F5EDE0]/40">
              {location}
            </p>
          )}
        </div>

        <div className="mx-auto w-full max-w-2xl">
          <div
            className="mb-8 h-px w-full bg-gradient-to-r from-transparent via-[#D4845A]/25 to-transparent"
            aria-hidden="true"
          />
          <blockquote className="text-center font-serif text-xl leading-[1.85] text-[#F5EDE0]/92 sm:text-2xl sm:leading-[1.9]">
            <p className="whitespace-pre-wrap">{entry.note}</p>
          </blockquote>
          <div
            className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-[#D4845A]/15 to-transparent"
            aria-hidden="true"
          />
        </div>
      </main>

      <footer className="relative z-10 px-6 pb-8">
        {entry.audioUrl && (
          <div className="mx-auto mb-8 max-w-md">
            <p className="mb-3 text-center text-[11px] uppercase tracking-[0.25em] text-[#F5EDE0]/30">
              Sesli mesaj
            </p>
            <audio
              ref={audioRef}
              controls
              preload="auto"
              className="w-full opacity-80 [filter:sepia(0.15)_brightness(0.95)]"
            >
              <source src={entry.audioUrl} />
            </audio>
          </div>
        )}

        <nav className="mx-auto flex max-w-md items-center justify-between gap-4">
          <button
            type="button"
            onClick={goPrev}
            disabled={index === 0}
            className="font-serif text-sm text-[#F5EDE0]/55 transition-colors hover:text-[#F5EDE0] disabled:cursor-not-allowed disabled:opacity-25"
          >
            ← Önceki
          </button>
          <button
            type="button"
            onClick={goNext}
            disabled={index === entries.length - 1}
            className="font-serif text-sm text-[#F5EDE0]/55 transition-colors hover:text-[#F5EDE0] disabled:cursor-not-allowed disabled:opacity-25"
          >
            Sonraki →
          </button>
        </nav>
      </footer>
    </div>
  );
}
