import type { MetadataRoute } from "next";
import { CRAWL_KEYS } from "@/content/crawls";
import { SITE_URL } from "@/content/site";

const BASE = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: "", priority: 1 },
    { path: "/program", priority: 0.9 },
    { path: "/food-crawl", priority: 0.8 },
    ...CRAWL_KEYS.map((key) => ({ path: `/food-crawl/${key}`, priority: 0.8 })),
    { path: "/about", priority: 0.6 },
    { path: "/media-center", priority: 0.6 },
    { path: "/tickets", priority: 0.7 },
  ];

  return pages.map(({ path, priority }) => ({
    url: `${BASE}${path}`,
    changeFrequency: "weekly" as const,
    priority,
  }));
}
