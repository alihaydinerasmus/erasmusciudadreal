import { cookies } from "next/headers";
import { DEFAULT_LANG, isValidLang, type Lang } from "@/lib/i18n";

export function getServerLang(): Lang {
  const value = cookies().get("lang")?.value;
  if (value && isValidLang(value)) return value;
  return DEFAULT_LANG;
}
