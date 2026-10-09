import type { MetadataRoute } from "next";
import { getSeo, seoStr } from "@/lib/seo";

/** Served at /manifest.webmanifest — installability and richer mobile results. */
export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const { seo } = await getSeo();
  const name = seoStr(seo.siteName) || "Studio";

  return {
    name: seoStr(seo.title) || name,
    short_name: name,
    description: seoStr(seo.description),
    start_url: "/",
    display: "standalone",
    background_color: "#faf9f7",
    theme_color: "#faf9f7",
    icons: [{ src: "/favicon.ico", sizes: "any", type: "image/x-icon" }],
  };
}
