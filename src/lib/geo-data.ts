import { City, Country } from "country-state-city";
import { countryCodeToFlag } from "@/lib/country-code";

export type CountryOption = {
  isoCode: string;
  name: string;
  flagEmoji: string;
  latitude: number | null;
  longitude: number | null;
};

export type CityOption = {
  name: string;
  latitude: number;
  longitude: number;
};

let cachedCountries: CountryOption[] | null = null;

export function getCountryOptions(): CountryOption[] {
  if (cachedCountries) return cachedCountries;

  cachedCountries = Country.getAllCountries()
    .map((country) => ({
      isoCode: country.isoCode,
      name: country.name,
      flagEmoji: countryCodeToFlag(country.isoCode),
      latitude: country.latitude ? parseFloat(country.latitude) : null,
      longitude: country.longitude ? parseFloat(country.longitude) : null,
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return cachedCountries;
}

export function findCountryByName(name: string): CountryOption | undefined {
  const normalized = name.trim().toLowerCase();
  if (!normalized) return undefined;

  return getCountryOptions().find(
    (country) => country.name.toLowerCase() === normalized
  );
}

export function getCityOptions(countryCode: string): CityOption[] {
  const cities = City.getCitiesOfCountry(countryCode) ?? [];

  return cities
    .filter((city) => city.latitude && city.longitude)
    .map((city) => ({
      name: city.name,
      latitude: parseFloat(city.latitude!),
      longitude: parseFloat(city.longitude!),
    }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
