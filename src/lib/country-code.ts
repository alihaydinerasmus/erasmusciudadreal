export function countryCodeToFlag(code: string): string {
  const upper = code.trim().toUpperCase();
  if (upper.length !== 2) return "";

  return String.fromCodePoint(
    ...upper.split("").map((char) => 0x1f1e6 + char.charCodeAt(0) - 65)
  );
}
