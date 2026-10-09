"use client";

import { useEffect, useState } from "react";

type Link = { label: string; href: string };

/**
 * Header nav. Below the desktop breakpoint the links collapse into a drawer —
 * previously they were simply hidden, leaving no way to navigate on a phone.
 */
export default function SiteNav({
  wordmark,
  tagline,
  links,
  ctaLabel,
  ctaHref,
}: {
  wordmark: string;
  tagline: string;
  links: Link[];
  ctaLabel: string;
  ctaHref: string;
}) {
  const [open, setOpen] = useState(false);

  // Lock the page behind the drawer, and let Escape close it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <header className="nav" id="top" data-nav>
      <div className="shell nav-inner">
        <a className="wordmark" href="#top" aria-label={`${wordmark} home`} onClick={() => setOpen(false)}>
          <i aria-hidden="true" />
          {wordmark}
          <span>{tagline}</span>
        </a>

        <nav className="nav-links" aria-label="Main navigation">
          {links.map((link, i) => (
            <a key={i} href={link.href || "#"}>
              {link.label}
            </a>
          ))}
        </nav>

        <div className="nav-cta">
          <a className="btn btn-fill nav-cta-btn" href={ctaHref || "#contact"}>
            {ctaLabel} <i aria-hidden="true">↗</i>
          </a>
          <button
            type="button"
            className="nav-burger"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((value) => !value)}
          >
            <span aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="nav-drawer" data-open={open || undefined} hidden={!open}>
        <nav aria-label="Mobile navigation">
          {links.map((link, i) => (
            <a key={i} href={link.href || "#"} onClick={() => setOpen(false)}>
              {link.label}
              <span aria-hidden="true">↗</span>
            </a>
          ))}
        </nav>
        <a className="btn btn-fill" href={ctaHref || "#contact"} onClick={() => setOpen(false)}>
          {ctaLabel} <i aria-hidden="true">↗</i>
        </a>
      </div>
    </header>
  );
}
