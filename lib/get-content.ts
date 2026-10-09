import { defaultContent, type SiteContent } from "./content";

export const CONTENT_TAG = "site-content";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

export const isContentSourceConfigured = Boolean(SUPABASE_URL && SUPABASE_KEY);

type Row = { section: string; content: Record<string, unknown> };

/**
 * Reads every section from Supabase and merges it over the bundled defaults,
 * so a section that has never been saved — or a field added after the last
 * save — still renders.
 *
 * This deliberately uses a plain `fetch` with `next.revalidate` rather than
 * `"use cache"`. With `"use cache"` the result was captured when the page was
 * prerendered at build time and never re-read: production served whatever the
 * build happened to see (defaults, if the build could not reach Supabase)
 * while local dev, which re-renders every request, looked correct. Nothing
 * could recover it either, because the only cache bust came from a Server
 * Action triggered by the browser's realtime listener.
 *
 * With a tagged fetch, Vercel revalidates on its own every 60s and
 * `revalidateTag` still gives an instant bust after a save.
 */
export async function getContent(): Promise<SiteContent> {
  const merged: SiteContent = {};
  for (const [key, value] of Object.entries(defaultContent)) merged[key] = { ...value };

  if (!isContentSourceConfigured) {
    // Loud on the server, invisible to visitors — this used to fail silently.
    console.error("[content] NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY missing — serving bundled defaults.");
    return merged;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=section,content`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      next: { revalidate: 60, tags: [CONTENT_TAG] },
      // A hung request must never stall a prerender. Defaults render instead
      // and the next revalidation picks the real content up a minute later.
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      console.error(`[content] Supabase returned ${response.status} — serving bundled defaults.`);
      return merged;
    }

    const rows = (await response.json()) as Row[];
    for (const row of rows) {
      if (!row?.content) continue;
      merged[row.section] = { ...(merged[row.section] ?? {}), ...row.content };
    }
    return merged;
  } catch (error) {
    console.error("[content] Could not reach Supabase — serving bundled defaults.", error);
    return merged;
  }
}
