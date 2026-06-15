"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { ProfileUpdatePayload, PublicProfile } from "@/types/database";

interface EditProfileFormProps {
  profile: PublicProfile;
  token: string;
}

export function EditProfileForm({ profile, token }: EditProfileFormProps) {
  const router = useRouter();
  const [form, setForm] = useState<ProfileUpdatePayload>({
    name: profile.name,
    country: profile.country ?? "",
    city: profile.city ?? "",
    lat: profile.lat,
    lng: profile.lng,
    flag_emoji: profile.flag_emoji ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "lat" || name === "lng"
          ? value === ""
            ? null
            : parseFloat(value)
          : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/profiles/${profile.id}?token=${encodeURIComponent(token)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save");
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
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="name" className="field-label">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleChange}
          className="field-input"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="country" className="field-label">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            value={form.country ?? ""}
            onChange={handleChange}
            className="field-input"
            placeholder="Spain"
          />
        </div>
        <div>
          <label htmlFor="city" className="field-label">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            value={form.city ?? ""}
            onChange={handleChange}
            className="field-input"
            placeholder="Madrid"
          />
        </div>
      </div>

      <div>
        <label htmlFor="flag_emoji" className="field-label">
          Flag emoji
        </label>
        <input
          id="flag_emoji"
          name="flag_emoji"
          type="text"
          value={form.flag_emoji ?? ""}
          onChange={handleChange}
          className="field-input max-w-[8rem]"
          placeholder="🇪🇸"
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="lat" className="field-label">
            Latitude
          </label>
          <input
            id="lat"
            name="lat"
            type="number"
            step="any"
            value={form.lat ?? ""}
            onChange={handleChange}
            className="field-input"
            placeholder="40.4168"
          />
        </div>
        <div>
          <label htmlFor="lng" className="field-label">
            Longitude
          </label>
          <input
            id="lng"
            name="lng"
            type="number"
            step="any"
            value={form.lng ?? ""}
            onChange={handleChange}
            className="field-input"
            placeholder="-3.7038"
          />
        </div>
      </div>

      {error && (
        <p className="rounded-sm border border-terracotta/30 bg-terracotta/10 px-4 py-3 text-sm text-terracotta-dark">
          {error}
        </p>
      )}

      {success && (
        <p className="rounded-sm border border-ink/10 bg-paper-dark px-4 py-3 text-sm text-ink/70">
          Saved — your profile has been updated.
        </p>
      )}

      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Save changes"}
      </button>
    </form>
  );
}
