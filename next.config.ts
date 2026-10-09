import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hides the floating Next.js dev indicator in the corner.
  devIndicators: false,
  images: {
    // Media uploaded through the admin lands in Supabase storage. Allow-listing
    // it lets those go through the optimiser instead of being served raw.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
  },
  // CSS is handled by postcss.config.mjs (@tailwindcss/postcss). The previous
  // custom turbopack "*.css" loader rule did not invalidate on edit, so style
  // changes silently served stale in dev.
};

export default nextConfig;
