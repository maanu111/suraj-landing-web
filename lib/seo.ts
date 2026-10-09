import { defaultContent, toList } from "./content";
import { getContent } from "./get-content";

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Last-resort origin when the admin field has never been filled in. */
const FALLBACK_ORIGIN = "http://localhost:3000";

/**
 * The site origin comes from the admin (SEO & metadata → Site URL), not from
 * an env var, so the client can point canonical links at the live domain
 * without a redeploy.
 */
export function normaliseOrigin(value: string): string {
  const raw = str(value) || FALLBACK_ORIGIN;
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

/** Turns "/og.png" into an absolute URL; passes through anything already absolute. */
export function absoluteUrl(origin: string, path: string): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? "" : "/"}${path}`;
}

export type Seo = Record<string, unknown>;

/** SEO settings merged over defaults, so a blank admin field never wins. */
export async function getSeo(): Promise<{
  seo: Seo;
  origin: string;
  content: Awaited<ReturnType<typeof getContent>>;
}> {
  const content = await getContent();
  const seo: Seo = { ...(defaultContent.seo ?? {}), ...(content.seo ?? {}) };
  for (const [key, value] of Object.entries(seo)) {
    if (str(value) === "" && str((defaultContent.seo as Seo)?.[key]) !== "") {
      seo[key] = (defaultContent.seo as Seo)[key];
    }
  }
  return { seo, origin: normaliseOrigin(str(seo.siteUrl)), content };
}

export { str as seoStr, toList };
