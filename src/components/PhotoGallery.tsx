"use client";

import type { ProfileContent } from "@/types/database";
import { PrivatePhoto } from "@/components/PrivatePhoto";
import { useLanguage } from "@/contexts/LanguageContext";

interface PhotoGalleryProps {
  photos: ProfileContent[];
  profileName: string;
}

export function PhotoGallery({ photos, profileName }: PhotoGalleryProps) {
  const { t } = useLanguage();

  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="edit-section">
      <h2 className="section-title mb-4">{t.profile.photos}</h2>
      <ul className="grid gap-4">
        {photos.map((photo) => (
          <li key={photo.id}>
            {photo.file_path ? (
              <PrivatePhoto
                filePath={photo.file_path}
                alt={t.profile.photoBy(profileName)}
                caption={photo.content_text}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
