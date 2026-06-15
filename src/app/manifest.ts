import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ciudad Real '25–26",
    short_name: "CR 25–26",
    description: "Erasmus anı albümü — UCLM 2025–26",
    start_url: "/",
    display: "standalone",
    theme_color: "#FAF7F2",
    background_color: "#FAF7F2",
    icons: [
      {
        src: "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
      {
        src: "/apple-icon.svg",
        sizes: "180x180",
        type: "image/svg+xml",
      },
      {
        src: "/favicon.ico",
        sizes: "48x48",
        type: "image/x-icon",
      },
    ],
  };
}
