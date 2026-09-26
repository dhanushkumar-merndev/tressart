import { absoluteUrl, site } from "./site";
import type { Faq, ServiceCategory } from "./services";
import { services } from "./services";

const salonId = absoluteUrl("/#salon");
const websiteId = absoluteUrl("/#website");

export function salonSchema() {
  return {
    "@context": "https://schema.org",
    "@type": ["HairSalon", "BeautySalon"],
    "@id": salonId,
    name: site.name,
    alternateName: ["Tressart Salon", "Tressart"],
    slogan: site.tagline,
    description: site.description,
    url: site.url,
    telephone: site.phone.international,
    image: absoluteUrl("/opengraph-image.jpg"),
    logo: absoluteUrl("/brand/tressart-logo.png"),
    priceRange: "₹₹₹",
    currenciesAccepted: "INR",
    address: {
      "@type": "PostalAddress",
      streetAddress: `${site.address.line1}, ${site.address.line2}`,
      addressLocality: site.address.locality,
      addressRegion: site.address.region,
      postalCode: site.address.postalCode,
      addressCountry: site.address.country,
    },
    hasMap: site.maps.directions,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: site.hours.days,
        opens: site.hours.opens,
        closes: site.hours.closes,
      },
    ],
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    sameAs: [site.social.instagram.href, site.social.facebook.href],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Salon services",
      itemListElement: services.map((s) => ({
        "@type": "OfferCatalog",
        name: s.title,
        url: absoluteUrl(`/services/${s.slug}`),
        itemListElement: s.items.map((item) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: item.name, description: item.description },
        })),
      })),
    },
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.name,
    inLanguage: "en-IN",
    publisher: { "@id": salonId },
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: Faq[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema(service: ServiceCategory) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    serviceType: service.title,
    description: service.metaDescription,
    url: absoluteUrl(`/services/${service.slug}`),
    provider: { "@id": salonId },
    areaServed: site.areaServed.map((name) => ({ "@type": "Place", name })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: service.title,
      itemListElement: service.items.map((item) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: item.name, description: item.description },
      })),
    },
  };
}
