import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75],
  },
  async redirects() {
    return [
      // The /cards page was retired (2026-09-24): the cast now lives in the
      // landing's hero roster and the /hero picker. Old links land on the roster.
      { source: "/cards", destination: "/#champions", permanent: true },
    ];
  },
};

export default nextConfig;
