"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PhotoUploadFormProps {
  profileId: string;
  token: string;
}

export function PhotoUploadForm({ profileId, token }: PhotoUploadFormProps) {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!file) {
      setError("Choose a photo first");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    const formData = new FormData();
    formData.append("file", file);
    if (caption.trim()) {
      formData.append("content_text", caption.trim());
    }

    try {
      const res = await fetch(
        `/api/upload?profileId=${encodeURIComponent(profileId)}&token=${encodeURIComponent(token)}`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      setFile(null);
      setCaption("");
      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-ink/10 pt-8">
      <h2 className="font-serif text-lg text-ink">Add a photo</h2>
      <p className="text-sm text-ink/50">
        Photos are stored privately. Viewers need admin access to see them.
      </p>

      <div>
        <label htmlFor="photo" className="field-label">
          Photo
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-sm file:border-0 file:bg-terracotta file:px-4 file:py-2 file:font-serif file:text-sm file:text-paper hover:file:bg-terracotta-dark"
        />
      </div>

      <div>
        <label htmlFor="caption" className="field-label">
          Caption (optional)
        </label>
        <input
          id="caption"
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="field-input"
          placeholder="A note about this moment…"
        />
      </div>

      {error && (
        <p className="rounded-sm border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-sm border border-ink/10 bg-paper-dark px-4 py-3 text-sm text-ink/70">
          Photo uploaded.
        </p>
      )}

      <button type="submit" disabled={uploading || !file} className="btn-primary">
        {uploading ? "Uploading…" : "Upload photo"}
      </button>
    </form>
  );
}
