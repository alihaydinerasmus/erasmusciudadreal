export type Theme = "light" | "dark";

export const THEME_STORAGE_KEY = "theme";

export function isValidTheme(value: string): value is Theme {
  return value === "light" || value === "dark";
}

export function getDefaultTheme(): Theme {
  return "light";
}

export function readStoredTheme(): Theme | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored && isValidTheme(stored)) return stored;
  return null;
}

export function resolveTheme(): Theme {
  return readStoredTheme() ?? getDefaultTheme();
}

export function applyThemeClass(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}
