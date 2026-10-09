import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/seo";

/**
 * Served at /sitemap.xml
 *
 * The site is a single page, so the sitemap lists the one URL. Section
 * anchors are deliberately excluded — fragments are not separate documents
 * and listing them is treated as sitemap spam.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = await getSeo();

  return [
    {
      url: origin,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
  ];
}
