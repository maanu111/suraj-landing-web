import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { absoluteUrl, getSeo, seoStr } from "@/lib/seo";
import "./globals.css";

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf9f7" },
    { media: "(prefers-color-scheme: dark)", color: "#272625" },
  ],
};

/**
 * Metadata is generated from the same Supabase content the page renders, so
 * the client edits their search listing in the admin rather than in code.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { seo, origin } = await getSeo();

  const siteName = seoStr(seo.siteName);
  const title = seoStr(seo.title);
  const description = seoStr(seo.description);
  const keywords = seoStr(seo.keywords)
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);
  const ogImage = seoStr(seo.ogImage);
  const twitter = seoStr(seo.twitterHandle);
  const locale = seoStr(seo.locale) || "en_IN";
  const blocked = /^(yes|true|1)$/i.test(seoStr(seo.noindex));

  // Falls back to the generated opengraph-image.tsx when none is set.
  const images = ogImage ? [{ url: absoluteUrl(origin, ogImage), width: 1200, height: 630, alt: title }] : undefined;

  return {
    metadataBase: new URL(origin),
    title: { default: title, template: `%s · ${siteName}` },
    description,
    keywords: keywords.length ? keywords : undefined,
    applicationName: siteName,
    generator: "Next.js",
    referrer: "origin-when-cross-origin",
    alternates: { canonical: "/" },
    robots: blocked
      ? { index: false, follow: false }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
          },
        },
    openGraph: {
      type: "website",
      siteName,
      title,
      description,
      url: origin,
      locale,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: twitter || undefined,
      creator: twitter || undefined,
      images,
    },
    icons: { icon: "/favicon.ico", apple: "/favicon.ico" },
    formatDetection: { telephone: false, date: false, email: false, address: false },
  };
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={`${sans.variable} ${mono.variable} antialiased`} suppressHydrationWarning>
      {/* Extensions inject attributes onto <body> before React hydrates, which
          React reports as a mismatch. This suppresses that one-level diff only. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
