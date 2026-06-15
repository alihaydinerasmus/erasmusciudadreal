"use client";

import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface LocationPickerProps {
  profileId: string;
  token: string;
  initialLat: number | null;
  initialLng: number | null;
}

const LocationPickerInner = dynamic(() => import("./LocationPickerInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-72 items-center justify-center rounded-sm border border-ink/10 bg-paper-dark text-sm text-ink/40">
      Loading map…
    </div>
  ),
});

export function LocationPicker({
  profileId,
  token,
  initialLat,
  initialLng,
}: LocationPickerProps) {
  const router = useRouter();
  const [position, setPosition] = useState<{
    lat: number;
    lng: number;
  } | null>(
    initialLat != null && initialLng != null
      ? { lat: initialLat, lng: initialLng }
      : null
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSave() {
    if (!position) {
      setError("Click the map to place your pin first.");
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
        throw new Error(data.error ?? "Failed to save location");
      }

      setSuccess(true);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-4 border-t border-ink/10 pt-8">
      <h2 className="font-serif text-lg text-ink">Home city on the map</h2>
      <p className="text-sm text-ink/50">
        Click the map to place a pin where you live now.
      </p>

      <div className="overflow-hidden rounded-sm border border-ink/10 shadow-soft">
        <LocationPickerInner
          position={position}
          onPositionChange={setPosition}
        />
      </div>

      {position && (
        <p className="text-sm text-ink/50">
          {position.lat.toFixed(4)}°, {position.lng.toFixed(4)}°
        </p>
      )}

      {error && (
        <p className="rounded-sm border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-sm border border-ink/10 bg-paper-dark px-4 py-3 text-sm text-ink/70">
          Location saved.
        </p>
      )}

      <button
        type="button"
        onClick={handleSave}
        disabled={saving || !position}
        className="btn-primary"
      >
        {saving ? "Saving…" : "Save location"}
      </button>
    </div>
  );
}
