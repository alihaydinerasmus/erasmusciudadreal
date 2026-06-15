"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useTheme } from "@/contexts/ThemeContext";
import { DEFAULT_LANG, LANGUAGES, type Lang } from "@/lib/i18n";

export function FloatingControls() {
  const pathname = usePathname();
  const { lang, setLang } = useLanguage();
  const { isDark, toggleTheme, ready: themeReady } = useTheme();
  const [langOpen, setLangOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeLang = lang ?? DEFAULT_LANG;
  const currentFlag =
    LANGUAGES.find((l) => l.code === activeLang)?.flag ?? "🌐";

  useEffect(() => {
    if (!langOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setLangOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [langOpen]);

  function handleSelectLanguage(code: Lang) {
    setLang(code);
    setLangOpen(false);
  }

  if (pathname?.startsWith("/admin/read")) {
    return null;
  }

  return (
    <div
      ref={containerRef}
      className="fixed bottom-6 right-6 z-[60] flex items-center gap-2"
    >
      <div className="relative">
        <button
          type="button"
          onClick={() => setLangOpen((open) => !open)}
          className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-lg shadow-soft transition-transform hover:scale-105 dark:bg-dark-surface dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
          aria-label="Change language"
          aria-expanded={langOpen}
          aria-haspopup="listbox"
        >
          {currentFlag}
        </button>

        {langOpen && (
          <div
            className="controls-popup-fade-in absolute bottom-full right-0 mb-2 min-w-[168px] overflow-hidden rounded-lg border border-ink/10 bg-paper shadow-warm dark:border-dark-border dark:bg-dark-surface dark:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
            role="listbox"
            aria-label="Languages"
          >
            <ul>
              {LANGUAGES.map(({ code, flag, label }) => (
                <li key={code}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={code === activeLang}
                    onClick={() => handleSelectLanguage(code)}
                    className={[
                      "flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-sm transition-colors",
                      code === activeLang
                        ? "bg-paper-dark text-ink dark:bg-dark-border dark:text-dark-text"
                        : "text-ink/80 hover:bg-paper-dark dark:text-dark-text/80 dark:hover:bg-dark-border/60",
                    ].join(" ")}
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      {flag}
                    </span>
                    <span>{label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={toggleTheme}
        disabled={!themeReady}
        className="flex h-11 w-11 items-center justify-center rounded-full bg-paper text-lg shadow-soft transition-transform hover:scale-105 disabled:opacity-100 dark:bg-dark-surface dark:shadow-[0_2px_12px_rgba(0,0,0,0.35)]"
        aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      >
        <span
          className="select-none text-[1.125rem] leading-none [font-family:Apple_Color_Emoji,Segoe_UI_Emoji,Noto_Color_Emoji,sans-serif]"
          aria-hidden="true"
        >
          {themeReady ? (isDark ? "☀️" : "🌙") : "🌙"}
        </span>
      </button>
    </div>
  );
}
