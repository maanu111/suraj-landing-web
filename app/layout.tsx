import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  title: "Studio — Marketing & Video Editing That Refuses To Be Scrolled Past",
  description:
    "A marketing and video editing studio. Paid social, brand films, product launches, motion graphics, color and sound — strategy and the edit under one roof.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} antialiased`}
      suppressHydrationWarning
    >
      <head>
        <meta name="format-detection" content="telephone=no, date=no, email=no, address=no" />
      </head>
      {/* Extensions (ColorZilla, Grammarly, password managers) inject attributes
          onto <body> before React hydrates, which React reports as a mismatch.
          This suppresses that one-level diff only — it does not hide real
          mismatches inside the tree. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
