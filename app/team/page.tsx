import type { Metadata } from "next";
import MotionEnhancer from "../motion-enhancer";
import RealtimeContent from "../realtime-content";
import SiteFooter from "../site-footer";
import SiteNav from "../site-nav";
import SmartImage from "../smart-image";
import { getContent } from "@/lib/get-content";
import { absoluteUrl, getSeo, seoStr } from "@/lib/seo";

const str = (value: unknown) => (typeof value === "string" ? value : "");
const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []);

/** Cycles behind the initial when a member has no photo yet. */
const TINTS = ["var(--petal)", "var(--mint)", "var(--canary)", "var(--violet)", "var(--aqua)"];

export async function generateMetadata(): Promise<Metadata> {
  const { seo, origin, content } = await getSeo();
  const team = content.team ?? {};
  const title = str(team.metaTitle) || "The team";
  const description = str(team.metaDescription) || seoStr(seo.description);
  const ogImage = seoStr(seo.ogImage);

  return {
    title,
    description,
    alternates: { canonical: "/team" },
    openGraph: {
      type: "website",
      title,
      description,
      url: `${origin}/team`,
      siteName: seoStr(seo.siteName),
      images: ogImage ? [{ url: absoluteUrl(origin, ogImage) }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function TeamPage() {
  const c = await getContent();
  const brand = c.brand ?? {};
  const team = c.team ?? {};
  const footer = c.footer ?? {};
  const cta = c.cta ?? {};

  return (
    <>
      <MotionEnhancer />
      <RealtimeContent />

      <span id="top" aria-hidden="true" />

      <SiteNav
        wordmark={str(brand.wordmark)}
        tagline={str(brand.tagline)}
        links={rows(brand.navLinks).map((link) => ({ label: str(link.label), href: str(link.href) }))}
        ctaLabel={str(brand.ctaLabel)}
        ctaHref={str(brand.ctaHref)}
      />

      <main>
        <section className="page-head">
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="shell page-head-inner">
            <p className="eyebrow">{str(team.eyebrow)}</p>
            <h1 className="h1">
              {str(team.heading)} <em>{str(team.headingAccent)}</em>
            </h1>
            <p className="lead page-lead">{str(team.note)}</p>
          </div>
        </section>

        <section className="section team" id="team">
          <div className="shell">
            {/* A grid here rather than a slider: this page exists to show
                everyone at once, not to tease a few. */}
            <div className="team-grid">
              {rows(team.members).map((member, i) => {
                const name = str(member.name);
                const photo = str(member.image);
                const href = str(member.linkHref);
                return (
                  <article className="member" data-reveal key={i}>
                    <div className="member-photo" style={photo ? undefined : { background: TINTS[i % TINTS.length] }}>
                      {photo ? (
                        <SmartImage src={photo} alt={str(member.alt) || name} sizes="(max-width: 600px) 86vw, 300px" />
                      ) : (
                        <span aria-hidden="true">{name.charAt(0)}</span>
                      )}
                    </div>
                    <h3>{name}</h3>
                    <p className="member-role">{str(member.role)}</p>
                    <p className="member-bio">{str(member.bio)}</p>
                    {href ? (
                      <a className="member-link" href={href} target="_blank" rel="noopener noreferrer">
                        {str(member.linkLabel) || "Profile"} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section className="section cta-band">
          <div className="shell">
            <h2 className="display">
              {str(cta.heading)} <em>{str(cta.headingAccent)}</em>
            </h2>
            <p>{str(cta.body)}</p>
            <div className="cta-actions">
              <a className="btn btn-mustard" href="/#contact">
                {str(cta.primaryLabel)} <i aria-hidden="true">↗</i>
              </a>
              <a className="btn btn-ghost" href="/about">
                About the studio
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter brand={brand} footer={footer} />
    </>
  );
}
