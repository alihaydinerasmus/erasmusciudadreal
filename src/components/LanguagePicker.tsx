"use client";

import { useState } from "react";
import { LANGUAGES, type Lang } from "@/lib/i18n";

interface LanguagePickerProps {
  onSelect: (lang: Lang) => void;
}

const SELECT_HIGHLIGHT_MS = 280;

export function LanguagePicker({ onSelect }: LanguagePickerProps) {
  const [selected, setSelected] = useState<Lang | null>(null);

  function handleSelect(code: Lang) {
    if (selected) return;
    setSelected(code);
    window.setTimeout(() => onSelect(code), SELECT_HIGHLIGHT_MS);
  }

  return (
    <div className="fixed inset-0 z-50 flex min-h-[100dvh] items-center justify-center overflow-x-hidden bg-cream px-6 py-10 dark:bg-dark-bg">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_35%,rgba(44,33,22,0.05)_100%)] dark:bg-[radial-gradient(ellipse_85%_75%_at_50%_45%,transparent_35%,rgba(0,0,0,0.2)_100%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto w-full max-w-[380px]">
        <header
          className="lang-picker-fade-in text-center"
          style={{ animationDelay: "0ms" }}
        >
          <h1 className="font-serif text-[2.75rem] font-normal leading-none tracking-tight text-ink dark:text-dark-text sm:text-6xl">
            Ciudad Real
          </h1>
          <p className="mt-4 font-sans text-[0.65rem] font-light uppercase tracking-[0.35em] text-terracotta/65 dark:text-terracotta-light/70">
            ERASMUS • UCLM • 2025–26
          </p>
          <div
            className="mx-auto mt-8 h-px w-20 bg-gradient-to-r from-transparent via-terracotta/30 to-transparent"
            aria-hidden="true"
          />
        </header>

        <nav
          className="mt-2 shadow-[0_4px_24px_rgba(44,33,22,0.04)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
          aria-label="Choose language"
        >
          <ul className="divide-y divide-ink/[0.06] dark:divide-dark-border">
            {LANGUAGES.map(({ code, flag, label }, index) => {
              const isSelected = selected === code;
              const isDimmed = selected !== null && !isSelected;

              return (
                <li
                  key={code}
                  className="lang-picker-fade-in opacity-0"
                  style={{ animationDelay: `${180 + index * 100}ms` }}
                >
                  <button
                    type="button"
                    onClick={() => handleSelect(code)}
                    disabled={selected !== null}
                    className={[
                      "group flex min-h-[52px] w-full items-center gap-3 px-2 py-4 text-left font-sans text-base font-normal transition-[background-color,opacity] duration-300 ease-out",
                      isSelected
                        ? "bg-paper-dark dark:bg-surface"
                        : "bg-transparent hover:bg-paper-dark dark:hover:bg-surface",
                      isDimmed ? "opacity-35" : "opacity-100",
                    ].join(" ")}
                  >
                    <span
                      className="w-9 shrink-0 text-[1.35rem] leading-none"
                      aria-hidden="true"
                    >
                      {flag}
                    </span>
                    <span className="min-w-0 flex-1 text-ink dark:text-dark-text">{label}</span>
                    <span
                      className="shrink-0 pr-1 font-serif text-sm text-terracotta/35 transition-colors duration-300 group-hover:text-terracotta/60 dark:text-terracotta-light/40 dark:group-hover:text-terracotta-light/70"
                      aria-hidden="true"
                    >
                      →
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </div>
  );
}
