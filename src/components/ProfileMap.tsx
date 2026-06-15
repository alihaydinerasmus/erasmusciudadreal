"use client";

import dynamic from "next/dynamic";

interface ProfileMapProps {
  lat: number;
  lng: number;
  label?: string;
}

const MapInner = dynamic(() => import("./ProfileMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-sm border border-ink/10 bg-paper-dark text-sm text-ink/40">
      Loading map…
    </div>
  ),
});

export function ProfileMap({ lat, lng, label }: ProfileMapProps) {
  return (
    <section className="border-t border-ink/10 pt-8">
      <h2 className="mb-4 font-serif text-lg text-ink">Home</h2>
      <div className="overflow-hidden rounded-sm border border-ink/10 shadow-soft">
        <MapInner lat={lat} lng={lng} label={label} />
      </div>
    </section>
  );
}
