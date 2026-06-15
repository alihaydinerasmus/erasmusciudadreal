"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "@/contexts/LanguageContext";

interface ProfileMapProps {
  lat: number;
  lng: number;
  label?: string;
}

function MapLoading() {
  const { t } = useLanguage();
  return (
    <div className="flex h-64 items-center justify-center rounded-sm border border-ink/10 bg-paper-dark text-sm text-ink/40 dark:border-dark-border dark:bg-dark-surface dark:text-dark-muted">
      {t.edit.loadingMap}
    </div>
  );
}

const MapInner = dynamic(() => import("./ProfileMapInner"), {
  ssr: false,
  loading: () => <MapLoading />,
});

export function ProfileMap({ lat, lng, label }: ProfileMapProps) {
  const { t } = useLanguage();

  return (
    <section className="edit-section">
      <h2 className="section-title mb-4">{t.profile.home}</h2>
      <div className="overflow-hidden border border-ink/10 dark:border-dark-border">
        <MapInner lat={lat} lng={lng} label={label} />
      </div>
    </section>
  );
}
