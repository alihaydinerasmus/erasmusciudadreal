"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadFormProps {
  profileId: string;
  token: string;
}

export function PhotoUploadForm({ profileId, token }: PhotoUploadFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [files, setFiles] = useState<File[]>([]);
  const [caption, setCaption] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [uploadedCount, setUploadedCount] = useState(0);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (files.length === 0) {
      setError(t.edit.choosePhoto);
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
          throw new Error(data.error ?? t.common.uploadFailed);
        }
      }

      setFiles([]);
      setCaption("");
      setSuccess(true);
      setUploadedCount(count);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : t.common.uploadFailed);
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.photos}</h2>
      <p className="muted-text">{t.edit.photosDesc}</p>

      <div>
        <label htmlFor="photo" className="field-label">
          {t.edit.photosLabel}
        </label>
        <input
          id="photo"
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          multiple
          onChange={(e) => setFiles(Array.from(e.target.files ?? []))}
          className="block w-full text-[13px] text-ink/50 file:mr-4 file:border-0 file:bg-transparent file:font-serif file:text-sm file:text-terracotta hover:file:text-terracotta-dark"
        />
        {files.length > 0 && (
          <p className="muted-text mt-2">{t.edit.photosSelected(files.length)}</p>
        )}
      </div>

      <div>
        <label htmlFor="caption" className="field-label">
          {t.edit.captionOptional}
        </label>
        <input
          id="caption"
          type="text"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="field-input"
          placeholder={t.edit.captionPlaceholder}
        />
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}
      {success && (
        <p className="body-text">
          {uploadedCount > 1 ? t.edit.photosUploaded : t.edit.photoUploaded}
        </p>
      )}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={uploading || files.length === 0}
          className="btn-action"
        >
          {uploading ? t.common.uploading : t.edit.uploadPhotos}
        </button>
      </div>
    </form>
  );
}
