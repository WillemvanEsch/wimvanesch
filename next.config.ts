import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 828, 1200, 1600, 2048, 2560],
    minimumCacheTTL: 60 * 60 * 24 * 365,
  },
};

export default nextConfig;
