import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: APP_URL,
      lastModified: new Date("2026-07-15"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${APP_URL}/privacy`,
      lastModified: new Date("2026-07-15"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: new Date("2026-07-15"),
      changeFrequency: "monthly",
      priority: 0.3,
    },
  ];
}
