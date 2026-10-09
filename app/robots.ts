import type { MetadataRoute } from "next";
import { getSeo, seoStr } from "@/lib/seo";

/** Served at /robots.txt */
export default async function robots(): Promise<MetadataRoute.Robots> {
  const { seo, origin } = await getSeo();
  const blocked = /^(yes|true|1)$/i.test(seoStr(seo.noindex));

  if (blocked) {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Nothing here should ever be crawled or indexed.
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${origin}/sitemap.xml`,
    host: origin,
  };
}
