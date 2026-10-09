import { defaultContent, toList } from "./content";
import { getContent } from "./get-content";

/** Origin without a trailing slash. Everything canonical is built from this. */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/+$/, "");

/** Turns "/og.png" into an absolute URL; passes through anything already absolute. */
export function absoluteUrl(path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}

export type Seo = Record<string, unknown>;

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** SEO settings merged over defaults, so a blank admin field never wins. */
export async function getSeo(): Promise<{ seo: Seo; content: Awaited<ReturnType<typeof getContent>> }> {
  const content = await getContent();
  const seo = { ...(defaultContent.seo ?? {}), ...(content.seo ?? {}) };
  for (const [key, value] of Object.entries(seo)) {
    if (str(value) === "" && str((defaultContent.seo as Seo)?.[key]) !== "") {
      seo[key] = (defaultContent.seo as Seo)[key];
    }
  }
  return { seo, content };
}

export { str as seoStr, toList };
