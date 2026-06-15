"use client";

import { useEffect, useMemo, useState } from "react";
import { SearchableSelect } from "@/components/SearchableSelect";
import { useLanguage } from "@/contexts/LanguageContext";
import {
  findCountryByName,
  getCityOptions,
  getCountryOptions,
} from "@/lib/geo-data";
import type { ProfileUpdatePayload } from "@/types/database";

export type ProfileFormFields = Pick<
  ProfileUpdatePayload,
  "name" | "country" | "city" | "flag_emoji"
>;

interface EditProfileFormProps {
  initialCountryName: string | null;
  value: ProfileFormFields;
  onChange: (fields: ProfileFormFields) => void;
  onCityLocationChange?: (coords: { lat: number; lng: number }) => void;
  initialLat: number | null;
  initialLng: number | null;
}

export function EditProfileForm({
  initialCountryName,
  value,
  onChange,
  onCityLocationChange,
  initialLat,
  initialLng,
}: EditProfileFormProps) {
  const { t } = useLanguage();
  const countries = useMemo(() => getCountryOptions(), []);
  const initialCountry = useMemo(
    () => findCountryByName(initialCountryName ?? value.country ?? ""),
    [initialCountryName, value.country]
  );

  const [countryIso, setCountryIso] = useState(initialCountry?.isoCode ?? "");

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
    if (initialLat != null && initialLng != null) return;
    if (!initialCountry || !value.city || !onCityLocationChange) return;

    const cities = getCityOptions(initialCountry.isoCode);
    const city = cities.find(
      (item) => item.name.toLowerCase() === value.city?.trim().toLowerCase()
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
    value.city,
    initialLat,
    initialLng,
  ]);

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange({ ...value, name: e.target.value });
  }

  function handleCountryChange(isoCode: string) {
    const country = countries.find((item) => item.isoCode === isoCode);
    if (!country) return;

    setCountryIso(isoCode);
    onChange({
      ...value,
      country: country.name,
      city: "",
      flag_emoji: country.flagEmoji,
    });
  }

  function handleCityChange(cityName: string) {
    const city = cityOptions.find((item) => item.name === cityName);
    onChange({ ...value, city: cityName });

    if (city && onCityLocationChange) {
      onCityLocationChange({
        lat: city.latitude,
        lng: city.longitude,
      });
    }
  }

  return (
    <div className="space-y-6 pb-8">
      <div>
        <label htmlFor="name" className="field-label">
          {t.edit.name}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          required
          value={value.name}
          onChange={handleNameChange}
          className="field-input"
        />
      </div>

      <div className="space-y-6">
        <SearchableSelect
          id="country"
          label={t.edit.country}
          value={countryIso}
          onChange={(iso) => handleCountryChange(iso)}
          options={countrySelectOptions}
          placeholder={t.edit.countryPlaceholder}
          emptyMessage={t.edit.noResults}
        />
        <SearchableSelect
          id="city"
          label={t.edit.city}
          value={value.city ?? ""}
          onChange={(cityName) => handleCityChange(cityName)}
          options={citySelectOptions}
          placeholder={
            countryIso ? t.edit.cityPlaceholder : t.edit.selectCountryFirst
          }
          disabled={!countryIso}
          emptyMessage={t.edit.noResults}
        />
      </div>
    </div>
  );
}
