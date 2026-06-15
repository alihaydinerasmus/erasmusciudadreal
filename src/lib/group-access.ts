export const GROUP_ACCESS_COOKIE = "groupAccess";

export function isGroupAccessGranted(
  cookieValue: string | undefined | null
): boolean {
  return cookieValue === "true";
}

export function isValidGroupPassword(password: string | undefined | null): boolean {
  const expected = process.env.GROUP_PASSWORD;
  if (!expected || !password) return false;
  return password === expected;
}
