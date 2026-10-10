import type { MetadataRoute } from "next";
import { getContentLastModified } from "@/lib/get-content";
import { getSeo } from "@/lib/seo";

/**
 * Served at /sitemap.xml
 *
 * Section anchors are deliberately excluded — fragments are not separate
 * documents and listing them is treated as sitemap spam.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { origin } = await getSeo();

  const lastModified = await getContentLastModified();

  return [
    { url: origin, lastModified, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/about`, lastModified, changeFrequency: "monthly", priority: 0.8 },
    { url: `${origin}/team`, lastModified, changeFrequency: "monthly", priority: 0.7 },
  ];
}
