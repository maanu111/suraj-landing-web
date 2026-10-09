import type { Metadata } from "next";
import CountUp from "../count-up";
import MotionEnhancer from "../motion-enhancer";
import RealtimeContent from "../realtime-content";
import SiteFooter from "../site-footer";
import SiteNav from "../site-nav";
import Slider from "../slider";
import SmartImage from "../smart-image";
import { getContent } from "@/lib/get-content";
import { absoluteUrl, getSeo, seoStr } from "@/lib/seo";

const str = (value: unknown) => (typeof value === "string" ? value : "");
const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []);

export async function generateMetadata(): Promise<Metadata> {
  const { seo, origin, content } = await getSeo();
  const about = content.about ?? {};
  const title = str(about.metaTitle) || "About";
  const description = str(about.metaDescription) || seoStr(seo.description);
  const ogImage = seoStr(seo.ogImage);

  return {
    title,
    description,
    alternates: { canonical: "/about" },
    openGraph: {
      type: "profile",
      title,
      description,
      url: `${origin}/about`,
      siteName: seoStr(seo.siteName),
      images: ogImage ? [{ url: absoluteUrl(origin, ogImage) }] : undefined,
    },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AboutPage() {
  const c = await getContent();
  const brand = c.brand ?? {};
  const about = c.about ?? {};
  const footer = c.footer ?? {};
  const cta = c.cta ?? {};

  // Blank line between paragraphs, so the admin stays a plain textarea.
  const story = str(about.storyBody)
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

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
        {/* ------------------------------------------------------- INTRO */}
        <section className="page-head">
          <div className="hero-wash" aria-hidden="true" />
          <div className="hero-grain" aria-hidden="true" />
          <div className="shell page-head-inner">
            <p className="eyebrow">{str(about.eyebrow)}</p>
            <h1 className="h1">
              {str(about.heading)} <em>{str(about.headingAccent)}</em>
            </h1>
            <p className="lead page-lead">{str(about.lead)}</p>
          </div>
        </section>

        {/* ------------------------------------------------------- STORY */}
        <section className="section story">
          <div className="shell story-grid">
            <div data-reveal="left">
              <p className="eyebrow">{str(about.storyEyebrow)}</p>
              <h2 className="h2">{str(about.storyHeading)}</h2>
              <div className="story-body">
                {story.map((para, i) => (
                  <p key={i}>{para}</p>
                ))}
              </div>
            </div>
            {str(about.storyImage) ? (
              <figure className="story-media" data-reveal="right">
                <SmartImage
                  src={str(about.storyImage)}
                  alt={str(about.storyAlt)}
                  sizes="(max-width: 900px) 90vw, 520px"
                />
              </figure>
            ) : null}
          </div>
        </section>

        {/* ------------------------------------------------------- STATS */}
        <section className="section dark">
          <div className="shell">
            <div className="numbers">
              {rows(about.stats).map((stat, i) => (
                <div data-reveal key={i}>
                  <b>
                    <CountUp value={str(stat.value)} />
                  </b>
                  <span>{str(stat.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ------------------------------------------------------ VALUES */}
        <section className="section">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(about.valuesEyebrow)}</p>
                <h2 className="h2">{str(about.valuesHeading)}</h2>
              </div>
            </div>
            <Slider label="What we stand for" className="steps">
              {rows(about.values).map((value, i) => (
                <article className="step" data-reveal key={i}>
                  <b>{str(value.num)}</b>
                  <h3>{str(value.title)}</h3>
                  <p>{str(value.copy)}</p>
                </article>
              ))}
            </Slider>
          </div>
        </section>

        {/* ----------------------------------------------------- CTA BAND */}
        <section className="section cta-band">
          <div className="shell">
            <h2 className="display">
              {str(cta.heading)} <em>{str(cta.headingAccent)}</em>
            </h2>
            <p>{str(cta.body)}</p>
            <div className="cta-actions">
              <a className="btn btn-mustard" href={`/${str(cta.primaryHref) || "#contact"}`.replace("//", "/")}>
                {str(cta.primaryLabel)} <i aria-hidden="true">↗</i>
              </a>
              <a className="btn btn-ghost" href="/">
                Back to the work
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter brand={brand} footer={footer} />
    </>
  );
}
