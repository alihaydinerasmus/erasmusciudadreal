"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

interface PhotoUploadFormProps {
  profileId: string;
  token: string;
}

export function PhotoUploadForm({ profileId, token }: PhotoUploadFormProps) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (files.length === 0) {
      setError("Choose at least one photo");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      const count = files.length;

      for (let i = 0; i < files.length; i++) {
        const formData = new FormData();
        formData.append("file", files[i]);
        if (i === 0 && caption.trim()) {
          formData.append("content_text", caption.trim());
        }

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
      }

      setFiles([]);
      setCaption("");
      setSuccess(true);
      setUploadedCount(count);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border-t border-ink/10 pt-8">
      <h2 className="font-serif text-lg text-ink">Photos</h2>
      <p className="text-sm text-ink/50">
        Upload one or more photos. They are stored privately — viewers need
        admin access to see them.
      </p>

      <div>
        <label htmlFor="photo" className="field-label">
          Photos
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-sm text-ink/70 file:mr-4 file:rounded-sm file:border-0 file:bg-terracotta file:px-4 file:py-2 file:font-serif file:text-sm file:text-paper hover:file:bg-terracotta-dark"
        />
        {files.length > 0 && (
          <p className="mt-2 text-sm text-ink/50">
            {files.length} photo{files.length !== 1 ? "s" : ""} selected
          </p>
        )}
      </div>

      <div>
        <label htmlFor="caption" className="field-label">
          Caption for first photo (optional)
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
          {uploadedCount > 1 ? "Photos uploaded." : "Photo uploaded."}
        </p>
      )}

      <button
        type="submit"
        disabled={uploading || files.length === 0}
        className="btn-primary"
      >
        {uploading ? "Uploading…" : "Upload photos"}
      </button>
    </form>
  );
}
