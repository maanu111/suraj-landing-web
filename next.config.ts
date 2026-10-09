import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // cacheComponents was removed deliberately. It is what froze the deployed
  // content: pages were fully prerendered at build time and the data was
  // never re-read. Standard ISR is predictable and builds reliably.
  // Hides the floating Next.js dev indicator in the corner.
  devIndicators: false,
  images: {
    // Media uploaded through the admin lands in Supabase storage. Allow-listing
    // it lets those go through the optimiser instead of being served raw.
    // Explicit host, not "*.supabase.co": the single-segment wildcard was not
    // matching and every uploaded image came back 400 from the optimiser.
    remotePatterns: [
      { protocol: "https", hostname: "ewnqpitxxtyjzjuzniah.supabase.co", pathname: "/storage/v1/object/public/**" },
      { protocol: "https", hostname: "**.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    // Development only. Next 16 refuses to fetch an upstream image whose host
    // resolves to a private IP, as SSRF protection. On a NAT64 network
    // supabase.co resolves to 64:ff9b::/96, which trips that check and every
    // uploaded image 400s locally while working fine in production. Left off
    // in production, where the protection is worth keeping.
    dangerouslyAllowLocalIP: process.env.NODE_ENV === "development",
  },
  // CSS is handled by postcss.config.mjs (@tailwindcss/postcss). The previous
  // custom turbopack "*.css" loader rule did not invalidate on edit, so style
  // changes silently served stale in dev.
};

export default nextConfig;
