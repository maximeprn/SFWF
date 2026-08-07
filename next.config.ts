import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    /* WebP only — deliberately no AVIF, although it is ~35% smaller here.

       On iOS, Safari is the only browser that sends image/avif in Accept, so AVIF
       negotiation forks the two browsers apart: every cache-miss variant is an on-demand
       AVIF encode (measured ~1s on Vercel against ~0.5s for WebP, per image, per width),
       Safari users are the only ones paying those cold encodes, and Safari then decodes
       AVIF in software on the phone. Chrome, negotiating WebP, was fast; Safari read as
       broken. One format for everyone beats a smaller one for some. */
    formats: ["image/webp"],
    /* The photographs never change under a given path — they're the festival's own files,
       replaced by name, not versioned. A year of edge caching costs nothing here. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
