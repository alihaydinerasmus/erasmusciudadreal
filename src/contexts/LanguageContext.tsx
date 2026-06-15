"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  DEFAULT_LANG,
  LANG_COOKIE_NAME,
  LANG_STORAGE_KEY,
  type Lang,
  type Translations,
  isValidLang,
  translations,
} from "@/lib/i18n";

interface LanguageContextValue {
  lang: Lang | null;
  ready: boolean;
  hasStoredLang: boolean;
  setLang: (lang: Lang) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang | null>(null);
  const [ready, setReady] = useState(false);
  const [hasStoredLang, setHasStoredLang] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored && isValidLang(stored)) {
      setLangState(stored);
      setHasStoredLang(true);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    document.documentElement.lang = lang ?? DEFAULT_LANG;
  }, [lang, ready]);

  const setLang = useCallback((next: Lang) => {
    localStorage.setItem(LANG_STORAGE_KEY, next);
    document.cookie = `${LANG_COOKIE_NAME}=${next}; path=/; max-age=${60 * 60 * 24 * 365}; SameSite=Lax`;
    setLangState(next);
    setHasStoredLang(true);
    document.documentElement.lang = next;
  }, []);

  const activeLang = lang ?? DEFAULT_LANG;

  const value = useMemo(
    () => ({
      lang,
      ready,
      hasStoredLang,
      setLang,
      t: translations[activeLang],
    }),
    [lang, ready, hasStoredLang, setLang, activeLang]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
}

export function useT(): Translations {
  return useLanguage().t;
}
