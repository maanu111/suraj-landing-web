"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { isSupabaseConfigured, supabase } from "@/lib/supabase";

/**
 * Listens for writes to `site_content` and refreshes the page when the admin
 * saves.
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
        // Nothing is cached, so a refresh is enough to pull the new content.
        router.refresh();
      })
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
