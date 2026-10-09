import { cacheLife, cacheTag } from "next/cache";
import { defaultContent, type SiteContent } from "./content";
import { isSupabaseConfigured, supabase } from "./supabase";

export const CONTENT_TAG = "site-content";

/**
 * Reads every section from Supabase and merges it over the bundled defaults,
 * so a section that has never been saved (or a field added after the last
 * save) still renders. Any failure falls back to defaults rather than throwing
 * — the marketing site must never go blank because the database is down.
 */
export async function getContent(): Promise<SiteContent> {
  "use cache";
  cacheLife("minutes");
  cacheTag(CONTENT_TAG);

  if (!isSupabaseConfigured) return defaultContent;

  try {
    const { data, error } = await supabase.from("site_content").select("section, content");
    if (error || !data) return defaultContent;

    const merged: SiteContent = {};
    for (const [key, value] of Object.entries(defaultContent)) {
      merged[key] = { ...value };
    }
    for (const row of data as { section: string; content: Record<string, unknown> }[]) {
      if (!row.content) continue;
      merged[row.section] = { ...(merged[row.section] ?? {}), ...row.content };
    }
    return merged;
  } catch {
    return defaultContent;
  }
}
