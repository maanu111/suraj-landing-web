import CountUp from "./count-up";
import MotionEnhancer from "./motion-enhancer";
import RealtimeContent from "./realtime-content";
import SiteFooter from "./site-footer";
import SiteNav from "./site-nav";
import Slider from "./slider";
import VideoLightbox from "./video-lightbox";
import WhatsAppForm from "./whatsapp-form";
import SmartImage from "./smart-image";
import StructuredData from "./structured-data";
import { getContent } from "@/lib/get-content";
import { toList } from "@/lib/content";

/* Content arrives from Supabase as JSON, so every read is coerced rather than
   trusted — a half-filled admin row must never crash the marketing site. */
const str = (value: unknown) => (typeof value === "string" ? value : "");
const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []);

const AVATAR_TINTS = ["var(--petal)", "var(--mint)", "var(--canary)", "var(--violet)", "var(--aqua)"];

/** Plays a clip when one is set, otherwise shows the still. */
function Media({
  video,
  image,
  alt,
  sizes,
  priority = false,
}: {
  video: string;
  image: string;
  alt: string;
  sizes: string;
  priority?: boolean;
}) {
  if (video) {
    return (
      <video
        src={video}
        poster={image || undefined}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        aria-label={alt}
      />
    );
  }
  return <SmartImage src={image} alt={alt} sizes={sizes} priority={priority} />;
}

export default async function Home() {
  const c = await getContent();
  const brand = c.brand ?? {};
  const hero = c.hero ?? {};
  const services = c.services ?? {};
  const work = c.work ?? {};
  const process = c.process ?? {};
  const numbers = c.numbers ?? {};
  const reviews = c.reviews ?? {};
  const blogs = c.blogs ?? {};
  const contact = c.contact ?? {};
  const cta = c.cta ?? {};
  const footer = c.footer ?? {};

  const marqueeItems = rows(c.marquee?.items);

  return (
    <>
      <MotionEnhancer />
      <VideoLightbox />
      <RealtimeContent />
      <StructuredData />

      {/* Scroll target for every href="#top". It must sit in normal flow —
          the nav is position:fixed, so an id on it is always already at the
          top of the viewport and the browser never scrolls. */}
      <span id="top" aria-hidden="true" />

      <SiteNav
        wordmark={str(brand.wordmark)}
        tagline={str(brand.tagline)}
        links={rows(brand.navLinks).map((link) => ({ label: str(link.label), href: str(link.href) }))}
        ctaLabel={str(brand.ctaLabel)}
        ctaHref={str(brand.ctaHref)}
        overDark
        isHome
      />

      <main>
        {/* ----------------------------------------------------------- HERO */}
        <section className="hero-dark">
          {str(hero.bgImage) ? (
            <div className="hero-dark-bg" aria-hidden="true">
              <SmartImage src={str(hero.bgImage)} alt="" sizes="100vw" priority />
            </div>
          ) : null}
          <div className="hero-dark-veil" aria-hidden="true" />

          <div className="shell hero-dark-inner">
            <h1 className="hero-dark-title">
              <span className="line-mask">
                <span>{str(hero.line1)}</span>
              </span>
              <span className="line-mask">
                <span>{str(hero.line2)}</span>
              </span>
            </h1>

            <p className="hero-dark-sub">
              {str(hero.sub1)}
              <br />
              {str(hero.sub2)}
            </p>

            <div className="hero-dark-actions">
              <a className="btn btn-gold" href={str(hero.primaryHref) || "/#work"}>
                {str(hero.primaryLabel)} <i aria-hidden="true">▶</i>
              </a>
              <a className="btn btn-outline" href={str(hero.secondaryHref) || "/#work"}>
                {str(hero.secondaryLabel)}
              </a>
            </div>

            {/* Mosaic: one wide tile, two stacked, one tall, two stacked. */}
            <div className="mosaic">
              {rows(hero.tiles).map((tile, i) => {
                const video = str(tile.video);
                const Tag = video ? "a" : "div";
                return (
                  <Tag
                    className="mosaic-tile"
                    key={i}
                    {...(video
                      ? {
                          href: video,
                          "data-video": video,
                          target: "_blank",
                          rel: "noopener noreferrer",
                          "aria-label": `Play: ${str(tile.title)}`,
                        }
                      : {})}
                  >
                    <SmartImage
                      src={str(tile.image)}
                      alt={str(tile.alt)}
                      sizes="(max-width: 760px) 50vw, 25vw"
                    />
                    {i === 0 && video ? (
                      <em className="mosaic-play" aria-hidden="true">
                        ▶
                      </em>
                    ) : null}
                    <p className="mosaic-caption">
                      <b>{str(tile.title)}</b>
                      {str(tile.category) ? <span> | {str(tile.category)}</span> : null}
                    </p>
                  </Tag>
                );
              })}
            </div>

            <div className="hero-dark-foot">
              <h2 className="hero-dark-recent">{str(hero.recentHeading)}</h2>
              <a className="btn btn-outline" href={str(hero.recentHref) || "/#work"}>
                {str(hero.recentLabel)}
              </a>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- MARQUEE */}
        {marqueeItems.length ? (
          <div className="marquee" aria-label="Capabilities">
            <div className="marquee-track" aria-hidden="true">
              {[0, 1].map((group) => (
                <div className="marquee-group" key={group}>
                  {marqueeItems.map((item, i) => (
                    <span key={i} style={{ display: "contents" }}>
                      <b>{str(item.text)}</b>
                      <i>·</i>
                    </span>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* ------------------------------------------------------- SERVICES */}
        <section className="section" id="services">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(services.eyebrow)}</p>
                <h2 className="h2">{str(services.heading)}</h2>
              </div>
              <p className="muted">{str(services.note)}</p>
            </div>
            <Slider label="Services" className="tiles">
              {rows(services.items).map((item, i) => (
                <article className="tile" data-reveal key={i}>
                  {str(item.image) ? (
                    <figure className="tile-media">
                      <SmartImage
                        src={str(item.image)}
                        alt={str(item.alt)}
                        sizes="(max-width: 600px) 82vw, 350px"
                      />
                    </figure>
                  ) : null}
                  <span className="tile-num">{str(item.num)}</span>
                  <div>
                    <h3>{str(item.title)}</h3>
                    <p>{str(item.copy)}</p>
                    <div className="tile-tags">
                      {toList(item.tags).map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              ))}
            </Slider>
          </div>
        </section>

        {/* ----------------------------------------------------------- WORK */}
        <section className="section work" id="work">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(work.eyebrow)}</p>
                <h2 className="h2">{str(work.heading)}</h2>
              </div>
              <p className="muted">{str(work.note)}</p>
            </div>

            <Slider label="Selected campaigns" className="rail">
              {rows(work.items).map((item, i) => {
                const video = str(item.video);
                const href = str(item.href) || video;
                return (
                  <article className="rail-card" data-reveal key={i}>
                    {href ? (
                      <a
                        className="rail-media"
                        href={href}
                        data-video={video || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open: ${str(item.title)}`}
                      >
                        <Media video={video} image={str(item.image)} alt={str(item.alt)} sizes="(max-width: 600px) 82vw, 440px" />
                        <span className="rail-chip">{str(item.chip)}</span>
                        <p className="rail-result">
                          <b>
                            <CountUp value={str(item.metric)} />
                          </b>
                          {str(item.metricLabel)}
                        </p>
                      </a>
                    ) : (
                      <div className="rail-media">
                        <Media video={video} image={str(item.image)} alt={str(item.alt)} sizes="(max-width: 600px) 82vw, 440px" />
                        <span className="rail-chip">{str(item.chip)}</span>
                        <p className="rail-result">
                          <b>
                            <CountUp value={str(item.metric)} />
                          </b>
                          {str(item.metricLabel)}
                        </p>
                      </div>
                    )}
                    <div className="rail-meta">
                      <span>{str(item.client)}</span>
                      <span>{str(item.year)}</span>
                    </div>
                    <h3>{str(item.title)}</h3>
                    <p className="rail-copy">{str(item.copy)}</p>
                  </article>
                );
              })}
            </Slider>

            <div className="rail-foot">
              <span className="eyebrow">Drag, swipe, or use the arrows</span>
              <a className="text-link" href="#contact">
                Make something like this <span aria-hidden="true">↗</span>
              </a>
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- PROCESS */}
        <section className="section process" id="process">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(process.eyebrow)}</p>
                <h2 className="h2">{str(process.heading)}</h2>
              </div>
              <p className="muted">{str(process.note)}</p>
            </div>
            <Slider label="Process steps" className="steps">
              {rows(process.steps).map((step, i) => (
                <article className="step" data-reveal key={i}>
                  {str(step.image) ? (
                    <figure className="step-media">
                      <SmartImage
                        src={str(step.image)}
                        alt={str(step.alt)}
                        sizes="(max-width: 820px) 82vw, 300px"
                      />
                    </figure>
                  ) : null}
                  <b>{str(step.label)}</b>
                  <h3>{str(step.title)}</h3>
                  <p>{str(step.copy)}</p>
                </article>
              ))}
            </Slider>
          </div>
        </section>

        {/* -------------------------------------------------------- NUMBERS */}
        <section className="section dark">
          <div className="shell">
            <div className="numbers">
              {rows(numbers.items).map((item, i) => (
                <div data-reveal key={i}>
                  <b>
                    <CountUp value={str(item.value)} />
                  </b>
                  <span>{str(item.label)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* -------------------------------------------------------- REVIEWS */}
        <section className="section dark" id="reviews">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(reviews.eyebrow)}</p>
                <h2 className="h2">{str(reviews.heading)}</h2>
              </div>
              <p>{str(reviews.note)}</p>
            </div>
            <Slider label="Client reviews" className="quotes" autoMs={5200}>
              {rows(reviews.items).map((review, i) => {
                const name = str(review.name);
                const avatar = str(review.avatar);
                return (
                  <figure className="quote" key={i}>
                    <div className="quote-stars" aria-label="Rated 5 out of 5">
                      ★★★★★
                    </div>
                    <blockquote>
                      <p>&ldquo;{str(review.quote)}&rdquo;</p>
                    </blockquote>
                    <footer>
                      {avatar ? (
                        <SmartImage className="quote-avatar" src={avatar} alt="" sizes="36px" />
                      ) : (
                        <span
                          className="quote-avatar"
                          style={{ background: AVATAR_TINTS[i % AVATAR_TINTS.length] }}
                          aria-hidden="true"
                        >
                          {name.charAt(0)}
                        </span>
                      )}
                      <div>
                        <b>{name}</b>
                        <cite>{str(review.role)}</cite>
                      </div>
                    </footer>
                  </figure>
                );
              })}
            </Slider>
          </div>
        </section>

        {/* ---------------------------------------------------------- BLOGS */}
        <section className="section" id="blogs">
          <div className="shell">
            <div className="sec-head">
              <div>
                <p className="eyebrow">{str(blogs.eyebrow)}</p>
                <h2 className="h2">{str(blogs.heading)}</h2>
              </div>
              <p className="muted">{str(blogs.note)}</p>
            </div>
            <Slider label="Blog posts" className="posts" autoMs={5800}>
              {rows(blogs.items).map((post, i) => {
                const image = str(post.image);
                return (
                  <article className="post" data-reveal key={i}>
                    <a className="post-art" href={str(post.href) || "#blogs"} aria-label={`Read: ${str(post.title)}`}>
                      {image ? <SmartImage src={image} alt="" sizes="(max-width: 600px) 82vw, 372px" /> : null}
                      <b>{str(post.art)}</b>
                      <i>{str(post.kicker)}</i>
                    </a>
                    <div className="post-meta">
                      <span>{str(post.category)}</span>
                      <span>{str(post.read)}</span>
                    </div>
                    <h3>{str(post.title)}</h3>
                    <p>{str(post.copy)}</p>
                  </article>
                );
              })}
            </Slider>
          </div>
        </section>

        {/* -------------------------------------------------------- CONTACT */}
        <section className="section contact" id="contact">
          <div className="shell contact-grid">
            <div className="contact-copy" data-reveal="left">
              <p className="eyebrow">{str(contact.eyebrow)}</p>
              <h2 className="h2">{str(contact.heading)}</h2>
              <p className="lead muted">{str(contact.lead)}</p>
              <ul className="contact-points">
                {rows(contact.points).map((point, i) => (
                  <li key={i}>
                    <i aria-hidden="true">✓</i> {str(point.text)}
                  </li>
                ))}
              </ul>
            </div>
            <WhatsAppForm
              services={toList(contact.services)}
              budgets={toList(contact.budgets)}
              whatsapp={str(contact.whatsapp)}
              brand={str(brand.wordmark)}
            />
          </div>
        </section>

        {/* ------------------------------------------------------- CTA BAND */}
        <section className="section cta-band">
          <div className="shell">
            <h2 className="display">
              {str(cta.heading)} <em>{str(cta.headingAccent)}</em>
            </h2>
            <p>{str(cta.body)}</p>
            <div className="cta-actions">
              <a className="btn btn-mustard" href={str(cta.primaryHref) || "#contact"}>
                {str(cta.primaryLabel)} <i aria-hidden="true">↗</i>
              </a>
              <a className="btn btn-ghost" href={str(cta.secondaryHref) || "#work"}>
                {str(cta.secondaryLabel)}
              </a>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter brand={brand} footer={footer} />

      <a className="wa-float" href="#contact" aria-label="Enquire on WhatsApp">
        <svg width="19" height="19" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.82 9.82 0 0 0 12.04 2Zm0 18.13a8.2 8.2 0 0 1-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.2 8.2 0 0 1-1.26-4.36c0-4.54 3.7-8.23 8.24-8.23 2.2 0 4.27.86 5.83 2.41a8.19 8.19 0 0 1 2.41 5.83c0 4.54-3.7 8.21-8.24 8.21Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.13-.17.24-.64.8-.79.97-.14.16-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.44.06-.67.31-.23.25-.87.86-.87 2.07 0 1.22.89 2.4 1.02 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.47-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.15-1.18-.06-.1-.23-.16-.48-.29Z" />
        </svg>
        <span>{str(brand.whatsappLabel) || "WhatsApp us"}</span>
      </a>
    </>
  );
}
