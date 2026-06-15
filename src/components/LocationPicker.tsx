"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationPickerProps {
  position: { lat: number; lng: number } | null;
  onPositionChange: (pos: { lat: number; lng: number } | null) => void;
  flyTarget: { lat: number; lng: number } | null;
  onFlyComplete: () => void;
}

function MapLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-72 items-center justify-center rounded-sm border border-ink/10 bg-paper-dark text-sm text-ink/40 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
      {t.edit.loadingMap}
    </div>
  );
}

const LocationPickerInner = dynamic(() => import("./LocationPickerInner"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export function LocationPicker({
  position,
  onPositionChange,
  flyTarget,
  onFlyComplete,
}: LocationPickerProps) {
  const { t } = useLanguage();

  return (
    <div className="edit-section space-y-4">
      <h2 className="section-title">{t.edit.homeCityOnMap}</h2>
      <p className="muted-text">{t.edit.homeCityDesc}</p>

      <div className="overflow-hidden border border-ink/10 dark:border-dark-border">
        <LocationPickerInner
          position={position}
          onPositionChange={onPositionChange}
          flyTarget={flyTarget}
          onFlyComplete={onFlyComplete}
        />
      </div>

      {position && (
        <p className="muted-text">
          {position.lat.toFixed(4)}°, {position.lng.toFixed(4)}°
        </p>
      )}
    </div>
  );
}
