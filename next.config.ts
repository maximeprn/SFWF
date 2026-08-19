import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* The 2025 paths that are not coming back. `/program` is a real route again as of phase
     2, so it has left this list; `/media-center` becomes `/press` rather than home, because
     the page it named still exists under a new name. About, tickets, food-crawl and purpose
     were cut from the redesign outright and their content folded into Home. Nothing 404s —
     old links, printed cards and shared posts all keep working.

     301, not Next's `permanent: true`, which emits 308. All of this traffic is GET — printed
     cards, old posts, search results — and 301 is the permanent redirect every crawler and
     proxy already understands. */
  async redirects() {
    const home = ["/about", "/tickets", "/purpose", "/food-crawl", "/food-crawl/:crawl"].map(
      (source) => ({ source, destination: "/", statusCode: 301 as const }),
    );
    return [...home, { source: "/media-center", destination: "/press", statusCode: 301 as const }];
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
    /* Mux's thumbnail service, which cuts the poster frame for every clip. The frames are
       requested `unoptimized` — Mux already returns WebP at the width asked for, so routing
       them through the optimizer would re-encode an encode and bill a transform for it.
       The pattern is declared anyway, so the images keep working if that ever changes. */
    remotePatterns: [{ protocol: "https", hostname: "image.mux.com", pathname: "/**" }],
    /* The photographs never change under a given path — they're the festival's own files,
       replaced by name, not versioned. A year of edge caching costs nothing here. */
    minimumCacheTTL: 31536000,
  },
};

export default nextConfig;
