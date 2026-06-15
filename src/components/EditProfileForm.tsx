"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchableSelect } from "@/components/SearchableSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  findCountryByName,
  getCityOptions,
  getCountryOptions,
} from "@/lib/geo-data";
import type { ProfileUpdatePayload, PublicProfile } from "@/types/database";

interface EditProfileFormProps {
  profile: PublicProfile;
  token: string;
  onCityLocationChange?: (coords: { lat: number; lng: number }) => void;
}

export function EditProfileForm({
  profile,
  token,
  onCityLocationChange,
}: EditProfileFormProps) {
  const router = useRouter();
  const { t } = useLanguage();
  const countries = useMemo(() => getCountryOptions(), []);
  const initialCountry = useMemo(
    () => findCountryByName(profile.country ?? ""),
    [profile.country]
  );

  const [countryIso, setCountryIso] = useState(initialCountry?.isoCode ?? "");
  const [form, setForm] = useState<
    Pick<ProfileUpdatePayload, "name" | "country" | "city" | "flag_emoji">
  >({
    name: profile.name,
    country: profile.country ?? "",
    city: profile.city ?? "",
    flag_emoji:
      profile.flag_emoji ?? initialCountry?.flagEmoji ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const cityOptions = useMemo(
    () => (countryIso ? getCityOptions(countryIso) : []),
    [countryIso]
  );

  const countrySelectOptions = useMemo(
    () =>
      countries.map((country) => ({
        value: country.isoCode,
        label: country.name,
        prefix: country.flagEmoji,
      })),
    [countries]
  );

  const citySelectOptions = useMemo(
    () =>
      cityOptions.map((city) => ({
        value: city.name,
        label: city.name,
      })),
    [cityOptions]
  );

  useEffect(() => {
    if (profile.lat != null && profile.lng != null) return;
    if (!initialCountry || !profile.city || !onCityLocationChange) return;

    const cities = getCityOptions(initialCountry.isoCode);
    const city = cities.find(
      (item) => item.name.toLowerCase() === profile.city?.trim().toLowerCase()
    );

    if (city) {
      onCityLocationChange({
        lat: city.latitude,
        lng: city.longitude,
      });
    }
  }, [
    initialCountry,
    onCityLocationChange,
    profile.city,
    profile.lat,
    profile.lng,
  ]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm((prev) => ({ ...prev, name: e.target.value }));
  }

  function handleCountryChange(isoCode: string) {
    const country = countries.find((item) => item.isoCode === isoCode);
    if (!country) return;

    setCountryIso(isoCode);
    setForm((prev) => ({
      ...prev,
      country: country.name,
      city: "",
      flag_emoji: country.flagEmoji,
    }));
  }

  function handleCityChange(cityName: string) {
    const city = cityOptions.find((item) => item.name === cityName);
    setForm((prev) => ({ ...prev, city: cityName }));

    if (city && onCityLocationChange) {
      onCityLocationChange({
        lat: city.latitude,
        lng: city.longitude,
      });
    }
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
        throw new Error(data.error ?? t.common.failedToSave);
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
    <form onSubmit={handleSubmit} className="space-y-6 pb-8">
      <div>
        <label htmlFor="name" className="field-label">
          {t.edit.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={form.name}
          onChange={handleNameChange}
          className="field-input"
        />
      </div>

      <div className="space-y-6">
        <SearchableSelect
          id="country"
          label={t.edit.country}
          value={countryIso}
          onChange={(value) => handleCountryChange(value)}
          options={countrySelectOptions}
          placeholder={t.edit.countryPlaceholder}
          emptyMessage={t.edit.noResults}
        />
        <SearchableSelect
          id="city"
          label={t.edit.city}
          value={form.city ?? ""}
          onChange={(value) => handleCityChange(value)}
          options={citySelectOptions}
          placeholder={
            countryIso ? t.edit.cityPlaceholder : t.edit.selectCountryFirst
          }
          disabled={!countryIso}
          emptyMessage={t.edit.noResults}
        />
      </div>

      {error && <p className="muted-text text-terracotta-dark">{error}</p>}

      {success && <p className="body-text">{t.edit.savedProfile}</p>}

      <div className="flex justify-end">
        <button type="submit" disabled={saving} className="btn-action">
          {saving ? t.common.saving : t.edit.saveChanges}
        </button>
      </div>
    </form>
  );
}
