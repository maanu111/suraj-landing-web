import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  // Hides the floating Next.js dev indicator in the corner.
  devIndicators: false,
  // CSS is handled by postcss.config.mjs (@tailwindcss/postcss). The previous
  // custom turbopack "*.css" loader rule did not invalidate on edit, so style
  // changes silently served stale in dev.
};

export default nextConfig;
