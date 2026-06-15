"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/contexts/ThemeContext";
import { MAP_ATTRIBUTION, getMapTileUrl } from "@/lib/map-tiles";

interface ProfileMapInnerProps {
  lat: number;
  lng: number;
  label?: string;
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

export default function ProfileMapInner({
  lat,
  lng,
  label,
}: ProfileMapInnerProps) {
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

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={6}
      scrollWheelZoom={false}
      className="h-64 w-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        key={tileUrl}
        attribution={MAP_ATTRIBUTION}
        url={tileUrl}
      />
      <Marker position={[lat, lng]} icon={markerIcon}>
        {label ? undefined : null}
      </Marker>
    </MapContainer>
  );
}
