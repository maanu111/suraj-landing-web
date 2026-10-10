/**
 * The brand mark beside the wordmark, in the header and the footer.
 *
 * A lens: outer barrel, aperture ring, and the highlight a real lens catches.
 * It replaced a plain dot when the studio was named CameraCraft. Drawn in
 * `currentColor` so the surrounding `.wordmark i` colour rule still governs
 * it on both the light header and the dark one over the hero.
 */
export default function BrandMark() {
  return (
    <i aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" focusable="false">
        <circle cx="12" cy="12" r="10.1" stroke="currentColor" strokeWidth="1.9" />
        <circle cx="12" cy="12" r="4.4" fill="currentColor" />
        <circle cx="15.4" cy="8.6" r="1.5" fill="currentColor" opacity="0.55" />
      </svg>
    </i>
  );
}
