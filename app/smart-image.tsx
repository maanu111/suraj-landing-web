import Image from "next/image";

/**
 * Picks the right <img> for a CMS-supplied source.
 *
 * Admins can paste any URL, and next/image refuses hosts that are not
 * allow-listed — which is why this page used plain <img> everywhere. The cost
 * was real: the campaign PNGs are 1.8–2.7MB each and were being sent at full
 * size into tiles a few hundred pixels wide.
 *
 * So: anything local or uploaded to Supabase storage goes through the
 * optimiser (resized, WebP/AVIF, correctly sized per breakpoint). An arbitrary
 * external URL still falls back to a plain tag rather than failing to render.
 */
function isOptimisable(src: string): boolean {
  if (src.startsWith("/")) return true;
  try {
    const supabase = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return Boolean(supabase) && new URL(src).host === new URL(supabase as string).host;
  } catch {
    return false;
  }
}

export default function SmartImage({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  /** Required for `fill` images — without it the browser fetches the largest candidate. */
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  if (!src) return null;

  if (isOptimisable(src)) {
    return <Image className={className} src={src} alt={alt} fill sizes={sizes} priority={priority} />;
  }

  // eslint-disable-next-line @next/next/no-img-element
  return <img className={className} src={src} alt={alt} loading={priority ? "eager" : "lazy"} />;
}
