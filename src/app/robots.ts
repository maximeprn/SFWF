import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Nothing to index behind the enquiry endpoint.
      disallow: "/api/",
    },
    sitemap: "https://siargaofoodfest.com/sitemap.xml",
  };
}
