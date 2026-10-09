import { defaultContent, type SiteContent } from "./content";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

type Row = { section: string; content: Record<string, unknown> };

/**
 * Reads every section from Supabase on each request and merges it over the
 * bundled defaults, so a never-saved section still renders.
 *
 * No caching, on purpose. Caching is what made the deployed site serve
 * build-time content forever while local dev looked fine.
 */
/** Last read's outcome, surfaced as an HTML comment so production can be diagnosed. */
export let lastFetchNote = "not attempted";

export async function getContent(): Promise<SiteContent> {
  const merged: SiteContent = {};
  for (const [key, value] of Object.entries(defaultContent)) merged[key] = { ...value };

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    lastFetchNote = `env missing: url=${Boolean(SUPABASE_URL)} key=${Boolean(SUPABASE_KEY)}`;
    console.error("[content]", lastFetchNote);
    return merged;
  }

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/site_content?select=section,content`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` },
      cache: "no-store",
    });
    if (!response.ok) {
      lastFetchNote = `http ${response.status}`;
      console.error("[content]", lastFetchNote, (await response.text()).slice(0, 160));
      return merged;
    }

    const rows = (await response.json()) as Row[];
    for (const row of rows) {
      if (row?.content) merged[row.section] = { ...(merged[row.section] ?? {}), ...row.content };
    }
    lastFetchNote = `ok: ${rows.length} sections`;
  } catch (error) {
    lastFetchNote = `threw: ${error instanceof Error ? error.message : String(error)}`;
    console.error("[content]", lastFetchNote);
  }

  return merged;
}
