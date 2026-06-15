export type WelcomeLocale = "tr" | "en";

export function welcomeLocaleForCountry(
  country: string | null | undefined
): WelcomeLocale {
  if (!country) return "tr";

  const normalized = country.trim().toLowerCase();
  const englishSpeaking = new Set([
    "united kingdom",
    "uk",
    "great britain",
    "england",
    "scotland",
    "wales",
    "ireland",
    "united states",
    "usa",
    "us",
    "australia",
    "canada",
    "new zealand",
  ]);

  return englishSpeaking.has(normalized) ? "en" : "tr";
}
