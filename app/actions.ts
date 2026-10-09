"use server";

import { updateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/get-content";

/**
 * Drops the cached copy of site_content so the next render reads Supabase again.
 *
 * Must be a Server Action: `updateTag` is not valid inside a Route Handler.
 * `revalidateTag(tag, profile)` is not a substitute either — its second
 * argument scopes expiry to one cache-life profile, so it silently no-ops
 * against our "minutes" entry.
 */
export async function refreshContent() {
  updateTag(CONTENT_TAG);
}
