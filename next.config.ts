import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Every 2025 route now lives on the one page. These are permanent (301) because the
     pages are not coming back at these paths: /program folds into `/`, /media-center
     becomes /press in phase 2, and about, tickets, food-crawl and purpose were cut from
     the redesign outright. Nothing 404s — old links, printed cards and shared posts all
     keep working. */
  async redirects() {
    return [
      "/program",
      "/about",
      "/tickets",
      "/purpose",
      "/media-center",
      "/food-crawl",
      "/food-crawl/:crawl",
      /* 301, not Next's `permanent: true`, which emits 308. All of this traffic is GET —
         printed cards, old posts, search results — and 301 is the permanent redirect every
         crawler and proxy already understands. */
    ].map((source) => ({ source, destination: "/", statusCode: 301 }));
  },

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
