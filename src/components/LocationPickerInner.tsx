"use client";

import { useEffect } from "react";
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useTheme } from "@/contexts/ThemeContext";
import { MAP_ATTRIBUTION, getMapTileUrl } from "@/lib/map-tiles";

interface LocationPickerInnerProps {
  position: { lat: number; lng: number } | null;
  onPositionChange: (pos: { lat: number; lng: number }) => void;
  flyTarget: { lat: number; lng: number } | null;
  onFlyComplete?: () => void;
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

function MapClickHandler({
  onPositionChange,
}: {
  onPositionChange: (pos: { lat: number; lng: number }) => void;
}) {
  useMapEvents({
    click(e) {
      onPositionChange({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
  });
  return null;
}

function FlyToHandler({
  target,
  onComplete,
}: {
  target: { lat: number; lng: number } | null;
  onComplete?: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (!target) return;

    map.flyTo([target.lat, target.lng], 11, { duration: 1.2 });
    const timer = window.setTimeout(() => onComplete?.(), 1250);
    return () => window.clearTimeout(timer);
  }, [target, map, onComplete]);

  return null;
}

export default function LocationPickerInner({
  position,
  onPositionChange,
  flyTarget,
  onFlyComplete,
}: LocationPickerInnerProps) {
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

  const center: [number, number] = position
    ? [position.lat, position.lng]
    : [40.0, -3.5];

  return (
    <MapContainer
      center={center}
      zoom={position ? 6 : 4}
      scrollWheelZoom
      className="h-72 w-full"
      style={{ zIndex: 0 }}
    >
      <TileLayer
        key={tileUrl}
        attribution={MAP_ATTRIBUTION}
        url={tileUrl}
      />
      <MapClickHandler onPositionChange={onPositionChange} />
      <FlyToHandler target={flyTarget} onComplete={onFlyComplete} />
      {position && (
        <Marker
          position={[position.lat, position.lng]}
          icon={markerIcon}
          draggable
          eventHandlers={{
            dragend: (e) => {
              const { lat, lng } = e.target.getLatLng();
              onPositionChange({ lat, lng });
            },
          }}
        />
      )}
    </MapContainer>
  );
}
