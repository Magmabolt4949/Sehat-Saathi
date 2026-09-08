import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sehat Saathi — AI Health Companion",
    short_name: "Sehat Saathi",
    description: "Upload scans, injuries, or prescriptions and get assistive AI health guidance in seconds.",
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f5",
    theme_color: "#d97757",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
