import type { MetadataRoute } from "next";
import { getSeo } from "@/lib/seo";

/**
 * Served at /sitemap.xml
 *
 * Section anchors are deliberately excluded — fragments are not separate
 * documents and listing them is treated as sitemap spam.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = await getSeo();

  const lastModified = new Date();

  return [
    { url: origin, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
  ];
}
