import { absoluteUrl, getSeo, seoStr } from "@/lib/seo";
import { toList } from "@/lib/content";

const rows = (value: unknown) => (Array.isArray(value) ? (value as Record<string, unknown>[]) : []);

/**
 * JSON-LD for Google's rich results.
 *
 * Deliberately NOT emitted: Review / AggregateRating. The quotes on the page
 * are sample copy, and marking placeholder testimonials up as real reviews
 * breaches Google's structured-data policy and risks a manual action. Add it
 * once the reviews are genuine and attributable.
 */
export default async function StructuredData() {
  const { seo, origin, content } = await getSeo();

  const siteName = seoStr(seo.siteName) || "CameraCraft";
  const businessName = seoStr(seo.businessName) || siteName;
  const description = seoStr(seo.description);

  const socials = rows(content.footer?.socials)
    .map((s) => seoStr(s.href))
    .filter((href) => /^https?:\/\//i.test(href));

  const address = {
    "@type": "PostalAddress",
    streetAddress: seoStr(seo.streetAddress) || undefined,
    addressLocality: seoStr(seo.addressLocality) || undefined,
    addressRegion: seoStr(seo.addressRegion) || undefined,
    postalCode: seoStr(seo.postalCode) || undefined,
    addressCountry: seoStr(seo.addressCountry) || undefined,
  };
  const hasAddress = Object.values(address).some((v) => v && v !== "PostalAddress");

  const services = rows(content.services?.items).map((item) => ({
    "@type": "Offer",
    itemOffered: {
      "@type": "Service",
      name: seoStr(item.title),
      description: seoStr(item.copy),
    },
  }));

  const organisation = {
    "@type": "ProfessionalService",
    "@id": `${origin}/#organisation`,
    name: businessName,
    alternateName: siteName !== businessName ? siteName : undefined,
    description,
    url: origin,
    image: absoluteUrl(origin, seoStr(seo.ogImage) || "/opengraph-image"),
    telephone: seoStr(seo.phone) || undefined,
    email: seoStr(seo.email) || undefined,
    priceRange: seoStr(seo.priceRange) || undefined,
    foundingDate: seoStr(seo.foundingDate) || undefined,
    knowsAbout: toList(seo.keywords).slice(0, 12),
    address: hasAddress ? address : undefined,
    areaServed: toList(seo.areaServed).map((name) => ({ "@type": "AdministrativeArea", name })),
    sameAs: socials.length ? socials : undefined,
    hasOfferCatalog: services.length
      ? { "@type": "OfferCatalog", name: `${siteName} services`, itemListElement: services }
      : undefined,
  };

  const website = {
    "@type": "WebSite",
    "@id": `${origin}/#website`,
    url: origin,
    name: siteName,
    description,
    inLanguage: seoStr(seo.locale)?.replace("_", "-") || "en-IN",
    publisher: { "@id": `${origin}/#organisation` },
  };

  const graph = {
    "@context": "https://schema.org",
    "@graph": [organisation, website],
  };

  return (
    <script
      type="application/ld+json"
      // Stripping undefined keeps the payload free of null noise.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(graph, (_k, v) => (v === undefined ? undefined : v)) }}
    />
  );
}
