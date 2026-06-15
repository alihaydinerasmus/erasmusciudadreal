import { Resend } from "resend";
import { createAdminSupabaseClient } from "@/lib/supabase/admin";
import type { PublicProfile } from "@/types/database";

const DEFAULT_TO = "alihaydindeutsch@gmail.com";
const DEFAULT_FROM = "Ciudad Real <onboarding@resend.dev>";

export interface ProfileEmailSnapshot {
  name: string;
  country: string | null;
  city: string | null;
  flagEmoji: string | null;
  memorySnippet: string | null;
  noteSnippet: string | null;
  hasAudio: boolean;
  photoCount: number;
}

function getResend() {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return null;
  return new Resend(apiKey);
}

function notificationTo() {
  return process.env.NOTIFICATION_EMAIL ?? DEFAULT_TO;
}

function notificationFrom() {
  return process.env.RESEND_FROM_EMAIL ?? DEFAULT_FROM;
}

function snippet(text: string | null | undefined, max = 140): string | null {
  if (!text?.trim()) return null;
  const trimmed = text.trim();
  return trimmed.length > max ? `${trimmed.slice(0, max)}…` : trimmed;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function locationLine(profile: Pick<PublicProfile, "city" | "country">): string {
  return [profile.city, profile.country].filter(Boolean).join(", ") || "—";
}

export async function getProfileEmailSnapshot(
  profileId: string
): Promise<ProfileEmailSnapshot | null> {
  const supabase = createAdminSupabaseClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("name, country, city, flag_emoji")
    .eq("id", profileId)
    .maybeSingle();

  if (profileError || !profile) return null;

  const { data: content, error: contentError } = await supabase
    .from("profile_content")
    .select("type, content_text, file_path")
    .eq("profile_id", profileId);

  if (contentError) return null;

  const items = content ?? [];
  const memory = items.find((c) => c.type === "memory");
  const note = items.find((c) => c.type === "note");
  const hasAudio = items.some((c) => c.type === "audio" && c.file_path);
  const photoCount = items.filter((c) => c.type === "photo").length;

  return {
    name: profile.name,
    country: profile.country,
    city: profile.city,
    flagEmoji: profile.flag_emoji,
    memorySnippet: snippet(memory?.content_text ?? null),
    noteSnippet: snippet(note?.content_text ?? null),
    hasAudio,
    photoCount,
  };
}

function buildEmailHtml(
  snapshot: ProfileEmailSnapshot,
  options: { joined?: boolean; savedLabel?: string }
): string {
  const flag = snapshot.flagEmoji ? `${snapshot.flagEmoji} ` : "";
  const savedLine = options.savedLabel
    ? `<p style="margin:0 0 20px;font-size:14px;color:#C4705A;">Yeni: ${escapeHtml(options.savedLabel)}</p>`
    : "";

  return `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#FAF7F2;font-family:Georgia,'Times New Roman',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#FAF7F2;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#FFFDF9;border:1px solid #F0EBE3;">
          <tr>
            <td style="padding:32px 28px;">
              <p style="margin:0 0 8px;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:#C4705A;">Ciudad Real · ERASMUS '25–26</p>
              <h1 style="margin:0 0 24px;font-size:24px;font-weight:normal;color:#2C2116;">${flag}${escapeHtml(snapshot.name)}</h1>
              ${savedLine}
              <table width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;line-height:1.6;color:#2C2116;">
                <tr><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;color:#8A7F78;width:120px;">Konum</td><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;">${escapeHtml(locationLine(snapshot))}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;color:#8A7F78;">Anı</td><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;">${snapshot.memorySnippet ? escapeHtml(snapshot.memorySnippet) : "—"}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;color:#8A7F78;">Not</td><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;">${snapshot.noteSnippet ? escapeHtml(snapshot.noteSnippet) : "—"}</td></tr>
                <tr><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;color:#8A7F78;">Ses</td><td style="padding:8px 0;border-bottom:1px solid #F0EBE3;">${snapshot.hasAudio ? "✓ Var" : "—"}</td></tr>
                <tr><td style="padding:8px 0;color:#8A7F78;">Fotoğraf</td><td style="padding:8px 0;">${snapshot.photoCount > 0 ? `${snapshot.photoCount} adet` : "—"}</td></tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendJoinNotification(profileId: string): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const snapshot = await getProfileEmailSnapshot(profileId);
  if (!snapshot) return;

  await resend.emails.send({
    from: notificationFrom(),
    to: notificationTo(),
    subject: `✨ ${snapshot.name} Ciudad Real'e katıldı`,
    html: buildEmailHtml(snapshot, { joined: true }),
  });
}

const SAVED_LABELS: Record<string, string> = {
  memory: "Favori an",
  note: "Ali'ye not",
  song: "Playlist şarkısı",
  audio: "Sesli mesaj",
  photo: "Fotoğraf",
};

export async function sendContentNotification(
  profileId: string,
  savedType?: string
): Promise<void> {
  const resend = getResend();
  if (!resend) return;

  const snapshot = await getProfileEmailSnapshot(profileId);
  if (!snapshot) return;

  const savedLabel = savedType ? SAVED_LABELS[savedType] ?? savedType : undefined;

  await resend.emails.send({
    from: notificationFrom(),
    to: notificationTo(),
    subject: `💌 ${snapshot.name} bir şeyler bıraktı`,
    html: buildEmailHtml(snapshot, { savedLabel }),
  });
}

export function notifyJoin(profileId: string) {
  void sendJoinNotification(profileId).catch((err) => {
    console.error("JOIN EMAIL ERROR:", err);
  });
}

export function notifyContentSaved(profileId: string, savedType?: string) {
  void sendContentNotification(profileId, savedType).catch((err) => {
    console.error("CONTENT EMAIL ERROR:", err);
  });
}
