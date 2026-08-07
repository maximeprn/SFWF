import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* Photography goes through next/image, which only negotiates WebP by default. The
       photographs are large and soft-edged, which is exactly where AVIF pays; browsers
       that don't send the Accept header fall through to WebP on their own. */
    formats: ["image/avif", "image/webp"],
    /* The photographs never change under a given path — they're the festival's own files,
       replaced by name, not versioned. A year of edge caching costs nothing here. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
