/** @type {import('next').NextConfig} */
const nextConfig = {
  devIndicators: false,

  // ── Image Optimization ────────────────────────────────────────────────────
  // FIX: Allows Next.js <Image /> to serve optimised WebP/AVIF versions of
  // images from these trusted external domains. Without this, any next/image
  // usage with an external src throws a 400 in production.
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
    ],
  },

  // ── HTTP Security Headers ─────────────────────────────────────────────────
  // FIX: Added production-grade security headers. These are the minimum set
  // required before any public launch.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          // Prevents other sites from embedding this page in an iframe
          // (clickjacking protection)
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          // Prevents browsers from MIME-sniffing the content-type
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          // Controls how much referrer info is sent with requests
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
          // Tells browsers to always use HTTPS for 1 year
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload",
          },
          // Restricts browser features (camera, microphone, geolocation)
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
