"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { refreshContent } from "./actions";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * Listens for writes to `site_content` and refreshes the page when the admin
 * saves. The server cache is dropped first, otherwise router.refresh() would
 * re-render from the same cached copy it already had.
 *
 * Requires the table to be in the `supabase_realtime` publication — see
 * supabase/schema.sql.
 */
export default function RealtimeContent() {
  const router = useRouter();

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const channel = supabase
      .channel("site_content_public")
      .on("postgres_changes", { event: "*", schema: "public", table: "site_content" }, () => {
        void refreshContent()
          .catch(() => {})
          .finally(() => router.refresh());
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
