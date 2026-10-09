import type { MetadataRoute } from "next";
import { SITE_URL, getSeo } from "@/lib/seo";

/**
 * Served at /sitemap.xml
 *
 * The site is a single page, so the sitemap lists the one URL. Section
 * anchors are deliberately excluded — fragments are not separate documents
 * and listing them is treated as sitemap spam.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Touching content means the timestamp moves when the client edits copy.
  await getSeo();

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
