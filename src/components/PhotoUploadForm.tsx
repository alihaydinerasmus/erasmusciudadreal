"use client";

import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoUploadFormProps {
  files: File[];
  caption: string;
  onFilesChange: (files: File[]) => void;
  onCaptionChange: (caption: string) => void;
}

export function PhotoUploadForm({
  files,
  caption,
  onFilesChange,
  onCaptionChange,
}: PhotoUploadFormProps) {
  const { t } = useLanguage();

  return (
    <div className="edit-section space-y-4">
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
          onChange={(e) => onFilesChange(Array.from(e.target.files ?? []))}
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
          onChange={(e) => onCaptionChange(e.target.value)}
          className="field-input"
          placeholder={t.edit.captionPlaceholder}
        />
      </div>
    </div>
  );
}
