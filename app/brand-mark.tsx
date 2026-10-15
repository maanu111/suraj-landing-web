/**
 * The brand mark beside the wordmark, in the header and the footer.
 *
 * With a logo set in the admin it renders that; the studio's own mark is a
 * transparent PNG so it sits on the light header and the dark hero alike.
 * Without one it falls back to a solid dot — deliberately. A ring-and-pupil
 * "lens" was tried and read as a crosshair at the 17px the header actually
 * renders it; detail that small turns to noise.
 */
export default function BrandMark({ src }: { src?: string }) {
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img className="wordmark-logo" src={src} alt="" width={30} height={30} />;
  }
  return <i aria-hidden="true" />;
}
