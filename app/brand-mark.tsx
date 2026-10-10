/**
 * The brand mark beside the wordmark, in the header and the footer.
 *
 * A solid dot, deliberately. A ring-and-pupil "lens" was tried and read as a
 * crosshair at the 17px the header actually renders it — detail that small
 * turns to noise. The wordmark carries the brand; this is punctuation.
 */
export default function BrandMark() {
  return <i aria-hidden="true" />;
}
