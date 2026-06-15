"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/contexts/ThemeContext";
import { MAP_ATTRIBUTION, getMapTileUrl } from "@/lib/map-tiles";
import type { PublicProfile } from "@/types/database";

interface GroupMapInnerProps {
  profiles: PublicProfile[];
}

const markerIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

function FitBounds({ profiles }: { profiles: PublicProfile[] }) {
  const map = useMap();

  useEffect(() => {
    const points = profiles
      .filter((p) => p.lat != null && p.lng != null)
      .map((p) => [p.lat!, p.lng!] as [number, number]);

    if (points.length === 0) return;

    if (points.length === 1) {
      map.setView(points[0], 6);
      return;
    }

    map.fitBounds(L.latLngBounds(points), { padding: [48, 48], maxZoom: 10 });
  }, [map, profiles]);

  return null;
}

export default function GroupMapInner({ profiles }: GroupMapInnerProps) {
  const { isDark } = useTheme();
  const tileUrl = getMapTileUrl(isDark);

  useEffect(() => {
    delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);

  const mappable = profiles.filter((p) => p.lat != null && p.lng != null);
  const center: [number, number] =
    mappable.length > 0
      ? [mappable[0].lat!, mappable[0].lng!]
      : [40.0, -3.5];

  return (
    <MapContainer
      center={center}
      zoom={4}
      scrollWheelZoom
      className="h-full w-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        key={tileUrl}
        attribution={MAP_ATTRIBUTION}
        url={tileUrl}
      />
      <FitBounds profiles={mappable} />
      {mappable.map((profile) => (
        <Marker
          key={profile.id}
          position={[profile.lat!, profile.lng!]}
          icon={markerIcon}
        >
          <Popup>
            <Link
              href={`/profile/${profile.id}`}
              className="flex items-center gap-2 font-serif text-sm text-ink hover:text-terracotta dark:text-dark-text dark:hover:text-terracotta-light"
            >
              <span aria-hidden="true">{profile.flag_emoji ?? "🌍"}</span>
              <span>{profile.name}</span>
            </Link>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
