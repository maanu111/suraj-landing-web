import { defaultContent, toList } from "./content";
import { getContent } from "./get-content";

const str = (value: unknown) => (typeof value === "string" ? value.trim() : "");

/** Adds a missing protocol and strips trailing slashes. */
export function normaliseOrigin(value: string): string {
  const raw = str(value);
  if (!raw) return "";
  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  return withProtocol.replace(/\/+$/, "");
}

/**
 * Origin taken from the hosting environment, used only when the admin has not
 * set a canonical domain.
 *
 * Vercel injects both of these automatically. VERCEL_PROJECT_PRODUCTION_URL is
 * the stable production domain and is preferred — VERCEL_URL changes on every
 * deployment, which is wrong for a canonical link.
 *
 * Nothing equivalent exists on Hostinger's Node.js hosting, so there the
 * origin has to come from SEO → “Canonical domain” in the admin. If it is
 * blank the fallback below is localhost, which would quietly publish a sitemap
 * and canonical tags pointing at a machine nobody can reach — hence the error.
 */
function environmentOrigin(): string {
  const host = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
  if (host) return `https://${host}`.replace(/\/+$/, "");

  if (process.env.NODE_ENV === "production") {
    console.error(
      "[seo] No canonical domain. Set SEO → “Canonical domain” in the admin " +
        "(e.g. https://cameracraft.in) — canonicals, sitemap.xml, robots.txt and " +
        "the OG image are all falling back to http://localhost:3000.",
    );
  }
  return "http://localhost:3000";
}

/** `canonicalDomain` from the admin wins, for a custom domain or several hosts. */
export function resolveOrigin(canonicalOverride?: string): string {
  return normaliseOrigin(canonicalOverride ?? "") || environmentOrigin();
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
  return { seo, origin: resolveOrigin(str(seo.canonicalDomain)), content };
}

export { str as seoStr, toList };
