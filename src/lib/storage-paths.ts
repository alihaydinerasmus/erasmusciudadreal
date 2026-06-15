const PROFILE_MEDIA_PATH =
  /^profiles\/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\/[a-zA-Z0-9._-]+$/;

export const PROFILE_MEDIA_BUCKET = "profile-media";

export function isValidProfileMediaPath(path: string): boolean {
  if (!path || path.includes("..")) return false;
  return PROFILE_MEDIA_PATH.test(path);
}

export function buildProfileMediaPath(
  profileId: string,
  filename: string
): string {
  return `profiles/${profileId}/${filename}`;
}

export function sanitizeFilename(originalName: string): string {
  const ext = originalName.includes(".")
    ? originalName.slice(originalName.lastIndexOf(".")).toLowerCase()
    : "";
  const base = originalName
    .replace(/\.[^/.]+$/, "")
    .replace(/[^a-zA-Z0-9_-]/g, "-")
    .slice(0, 48);
  const stamp = Date.now();
  const rand = Math.random().toString(36).slice(2, 8);
  return `${stamp}-${rand}-${base || "photo"}${ext}`;
}
