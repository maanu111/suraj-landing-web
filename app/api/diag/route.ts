import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * Temporary diagnostic. Reports whether the running server can see the
 * Supabase environment variables and whether it can actually read the table.
 * Delete once the deployment is confirmed healthy.
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";

  let fetchResult: unknown = "not attempted";
  if (url && key) {
    try {
      const res = await fetch(`${url}/rest/v1/site_content?select=section`, {
        headers: { apikey: key, Authorization: `Bearer ${key}` },
        cache: "no-store",
      });
      const body = await res.text();
      fetchResult = { status: res.status, body: body.slice(0, 200) };
    } catch (error) {
      fetchResult = { threw: error instanceof Error ? error.message : String(error) };
    }
  }

  return NextResponse.json({
    urlPresent: Boolean(url),
    urlValue: url ? `${url.slice(0, 34)}…` : null,
    keyPresent: Boolean(key),
    keyLength: key.length,
    vercelEnv: process.env.VERCEL_ENV ?? null,
    nodeEnv: process.env.NODE_ENV,
    fetchResult,
  });
}
