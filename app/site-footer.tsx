const str = (value: unknown) => (typeof value === "string" ? value : "");
const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []);

/** Shared by the home page and /about so the two cannot drift apart. */
export default function SiteFooter({
  brand,
  footer,
}: {
  brand: Record<string, unknown>;
  footer: Record<string, unknown>;
}) {
  return (
  <footer className="footer">
    {/* Sign-off band — the last conversion prompt before the link grid. */}
    <div className="shell footer-top">
      <div>
        <p className="footer-status">
          <i aria-hidden="true" />
          {str(footer.statusText)}
        </p>
        <h2 className="footer-cta-title">{str(footer.ctaTitle)}</h2>
        <p className="footer-cta-body">{str(footer.ctaBody)}</p>
      </div>
      <a className="btn btn-mustard" href={str(footer.ctaHref) || "#contact"}>
        {str(footer.ctaLabel)} <i aria-hidden="true">↗</i>
      </a>
    </div>

    <div className="shell">
      <div className="footer-grid">
        <div className="footer-about-col">
          <a className="wordmark" href="/" aria-label={`${str(brand.wordmark)} — back to the home page`}>
            <i aria-hidden="true" />
            {str(brand.wordmark)}
            <span>{str(brand.tagline)}</span>
          </a>
          <p className="footer-about">{str(footer.about)}</p>
          <div className="footer-socials">
            {rows(footer.socials).map((social, i) => (
              <a key={i} href={str(social.href) || "#"} target="_blank" rel="noopener noreferrer">
                {str(social.label)}
                <span aria-hidden="true">↗</span>
              </a>
            ))}
          </div>
        </div>

        {rows(footer.columns).map((column, i) => (
          <div key={i}>
            <h4>{str(column.title)}</h4>
            <ul>
              {rows(column.links).map((link, j) => (
                <li key={j}>
                  <a href={str(link.href) || "#"}>{str(link.label)}</a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-base">
        <div className="footer-legal">
          <span>{str(footer.legal)}</span>
          <span>{str(footer.note)}</span>
        </div>
        <a className="footer-top-link" href="#top">
          Back to top <span aria-hidden="true">↑</span>
        </a>
      </div>
    </div>

    {/* Oversized wordmark — the modern footer signature. Decorative only. */}
    <div className="footer-mark" aria-hidden="true">
      <span>{str(footer.bigMark) || str(brand.wordmark)}</span>
    </div>
  </footer>
  );
}
