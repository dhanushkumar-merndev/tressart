/**
 * Single source of truth for business details. Everything that appears in
 * page copy, contact blocks, JSON-LD and metadata is read from here, so a
 * change of phone number or hours only needs to be made once.
 */

const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://tressart.in").replace(/\/$/, "");

const address = {
  line1: "No. 13/23, Ambalipura",
  line2: "Harlur Road, above Axis Bank",
  landmark: "Off Sarjapur Road",
  locality: "Bengaluru",
  region: "Karnataka",
  regionCode: "KA",
  postalCode: "560102",
  country: "IN",
} as const;

const mapsQuery = "tressart salon, 13/23 Ambalipura, Harlur Road, Bengaluru 560102";

export const site = {
  name: "tressart salon",
  shortName: "tressart",
  tagline: "not just a salon it's an experience.",
  url: siteUrl,
  locale: "en_IN",
  description:
    "tressart salon is a L'Oréal Professionnel flagship unisex salon on Harlur Road, Bengaluru — precision haircuts, hair colour, keratin and hair spa, facials, nails, men's grooming and bridal makeup.",

  phone: {
    display: "080 4370 8833",
    international: "+91 80 4370 8833",
    href: "tel:+918043708833",
  },

  address,
  addressOneLine: `${address.line1}, ${address.line2}, ${address.locality} ${address.postalCode}`,

  hours: {
    label: "Open daily",
    time: "9:00 am – 9:00 pm",
    opens: "09:00",
    closes: "21:00",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
  },

  maps: {
    directions: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(mapsQuery)}`,
    embed: `https://www.google.com/maps?q=${encodeURIComponent(mapsQuery)}&output=embed`,
  },

  social: {
    instagram: { handle: "@tressart_salon", href: "https://www.instagram.com/tressart_salon/" },
    facebook: { handle: "facebook.com/tressart", href: "https://www.facebook.com/tressart/" },
  },

  reviews: {
    rating: "4.3",
    count: "600+",
    source: "Justdial",
    href: "https://www.justdial.com/Bangalore/Tressart-Salon-Above-Axis-Bank-AMBALIPURA/080PXX80-XX80-171127120517-Z9F5_BZDET/reviews",
  },

  partners: ["L'Oréal Professionnel", "Thalgo", "Decléor"],

  /** Neighbourhoods we want to be found from in local search. */
  areaServed: [
    "Ambalipura",
    "Harlur Road",
    "HSR Layout",
    "Sarjapur Road",
    "Bellandur",
    "Kasavanahalli",
    "Haralur",
    "Bengaluru",
  ],
} as const;

export const nav = [
  { href: "/services", label: "Services" },
  { href: "/services/bridal-makeup", label: "Bridal" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Visit" },
] as const;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
