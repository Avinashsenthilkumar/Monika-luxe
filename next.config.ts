import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Fallback only: the build first tries to copy every source image into /public
    // (see scripts/fetch-assets.mjs). If an image could not be copied, the
    // original WordPress URL is used so nothing renders broken.
    remotePatterns: [
      { protocol: "https", hostname: "i0.wp.com", pathname: "/monikaluxeinteriors.com/**" },
      { protocol: "https", hostname: "monikaluxeinteriors.com", pathname: "/wp-content/**" },
    ],
  },
  async redirects() {
    // Map the legacy WordPress URLs (whose menu labels did not match their slugs)
    return [
      { source: "/about-2", destination: "/projects", permanent: true },
      { source: "/home-2", destination: "/about", permanent: true },
      { source: "/testimonials", destination: "/about#testimonials", permanent: true },
      { source: "/teams", destination: "/about#team", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
