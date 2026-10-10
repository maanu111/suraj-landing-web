import { defaultContent, type SiteContent } from "./content";

// Trimmed, and trailing slashes stripped. A value stored as
// "https://xxx.supabase.co/" builds "…co//rest/v1/…", which PostgREST
// answers with 404 — which is exactly how this failed in production while
// working locally.
const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").trim().replace(/\/+$/, "");
const SUPABASE_KEY = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "").trim();

type Row = { section: string; content: Record<string, unknown> };

/**
 * Reads every section from Supabase on each request and merges it over the
 * bundled defaults, so a never-saved section still renders.
 *
 * No caching, on purpose. Caching is what made the deployed site serve
 * build-time content forever while local dev looked fine.
 */
export async function getContent(): Promise<SiteContent> {
  const merged: SiteContent = {};
  for (const [key, value] of Object.entries(defaultContent)) merged[key] = { ...value };

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("[content] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY missing — serving defaults.");
    return merged;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=section,content`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      cache: "no-store",
    });
    if (!response.ok) {
      console.error(`[content] Supabase returned ${response.status} for ${SUPABASE_URL} — serving defaults.`);
      return merged;
    }

    const rows = (await response.json()) as Row[];
    for (const row of rows) {
      if (row?.content) merged[row.section] = { ...(merged[row.section] ?? {}), ...row.content };
    }
  } catch (error) {
    console.error("[content] Could not reach Supabase — serving defaults.", error);
  }

  return merged;
}

/**
 * When the content was last actually edited, for <lastmod> in the sitemap.
 *
 * Previously the sitemap sent `new Date()`, so every fetch claimed the pages
 * had just changed. Google's guidance is that a lastmod it cannot trust is a
 * lastmod it ignores, so this reads the real timestamp instead.
 */
export async function getContentLastModified(): Promise<Date> {
  if (!SUPABASE_URL || !SUPABASE_KEY) return new Date();

  try {
    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/site_content?select=updated_at&order=updated_at.desc&limit=1`,
      {
        headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
        cache: "no-store",
      },
    );
    if (!response.ok) return new Date();

    const [row] = (await response.json()) as { updated_at?: string }[];
    const stamp = row?.updated_at ? new Date(row.updated_at) : null;
    return stamp && !Number.isNaN(stamp.getTime()) ? stamp : new Date();
  } catch {
    return new Date();
  }
}
