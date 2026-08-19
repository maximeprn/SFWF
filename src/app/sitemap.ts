import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/** One page, one URL. Every old path 301s here — see the redirects in `next.config.ts`. */
export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: SITE_URL, changeFrequency: "weekly", priority: 1 }];
}
