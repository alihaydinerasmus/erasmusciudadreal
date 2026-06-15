import type { ProfileContent } from "@/types/database";
import { PrivatePhoto } from "@/components/PrivatePhoto";

interface PhotoGalleryProps {
  photos: ProfileContent[];
  profileName: string;
}

export function PhotoGallery({ photos, profileName }: PhotoGalleryProps) {
  if (photos.length === 0) {
    return null;
  }

  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-lg text-ink">Photos</h2>
      <ul className="grid gap-4 sm:grid-cols-2">
        {photos.map((photo) => (
          <li key={photo.id}>
            {photo.file_path ? (
              <PrivatePhoto
                filePath={photo.file_path}
                alt={`Photo by ${profileName}`}
                caption={photo.content_text}
              />
            ) : null}
          </li>
        ))}
      </ul>
    </section>
  );
}
