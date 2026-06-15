"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";

interface LocationPickerProps {
  profileId: string;
  token: string;
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
  profileId,
  token,
  position,
  onPositionChange,
  flyTarget,
  onFlyComplete,
}: LocationPickerProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (!position) {
      setError(t.edit.clickMapFirst);
      return;
    }

    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/profiles/${profileId}?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ lat: position.lat, lng: position.lng }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? t.edit.failedToSaveLocation);
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : t.common.somethingWentWrong
      );
    } finally {
      setSaving(false);
    }
  }

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

      {error && <p className="muted-text text-terracotta-dark dark:text-terracotta-light">{error}</p>}
      {success && <p className="body-text">{t.edit.locationSaved}</p>}

      <div className="flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving || !position}
          className="btn-action"
        >
          {saving ? t.common.saving : t.edit.saveLocation}
        </button>
      </div>
    </div>
  );
}
