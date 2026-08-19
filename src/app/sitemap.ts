import type { MetadataRoute } from "next";
import { SITE_URL } from "@/content/site";

/**
 * Three pages. The 2025 paths 301 to one of them and are deliberately absent here — a
 * sitemap listing redirects asks a crawler to discover the same content twice.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/program`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${SITE_URL}/press`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
