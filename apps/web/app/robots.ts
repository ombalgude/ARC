import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "https://arcfitness.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Block internal/non-public routes from being indexed
        disallow: ["/admin", "/dashboard", "/api/", "/sign-in", "/sign-up"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
    host: APP_URL,
  };
}
