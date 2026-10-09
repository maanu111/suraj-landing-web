"use server";

import { revalidateTag } from "next/cache";
import { CONTENT_TAG } from "@/lib/get-content";

/**
 * Drops the cached content so the next render reads Supabase again.
 * Called by the realtime listener after an admin save.
 */
export async function refreshContent() {
  revalidateTag(CONTENT_TAG, "max");
}
