import type { Metadata } from "next";
import { VisitSection } from "@/components/sections/VisitSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { Facebook, Instagram } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contact & Directions — Ambalipura, Harlur Road",
  description:
    "Visit tressart salon at No. 13/23, Ambalipura, Harlur Road, above Axis Bank, Bengaluru 560102. Open daily 9 am – 9 pm. Call 080 4370 8833 to book.",
  path: "/contact",
});

const tips = [
  {
    title: "Finding us",
    text: "We're on Harlur Road in Ambalipura, just off Sarjapur Road. Look for Axis Bank — the salon is on the floor above.",
  },
  {
    title: "Booking ahead",
    text: "Weekends and evenings fill quickly. For colour, treatments and bridal services, call a few days in advance.",
  },
  {
    title: "Colour patch tests",
    text: "New to colour with us? Ask for a patch test 48 hours before your appointment.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />
      <div className="pt-[var(--header-h)]">
        <VisitSection headingLevel="h1" />
      </div>

      <section aria-labelledby="tips-title" className="border-t border-ink/10 bg-sand/20 py-24 md:py-32">
        <div className="container-x">
          <h2 id="tips-title" className="reveal eyebrow">
            Before you visit
          </h2>
          <ul className="mt-12 grid gap-x-8 gap-y-12 md:grid-cols-3">
            {tips.map((t, i) => (
              <li key={t.title} className="reveal border-t border-ink/15 pt-7">
                <span className="text-xs tracking-[0.24em] text-grey">0{i + 1}</span>
                <h3 className="mt-5 text-2xl font-light tracking-tight">{t.title}</h3>
                <p className="mt-3 leading-relaxed text-mute">{t.text}</p>
              </li>
            ))}
          </ul>

          <div className="reveal mt-20 flex flex-col gap-6 border-t border-ink/15 pt-10 md:flex-row md:items-center md:justify-between">
            <p className="text-2xl font-light tracking-tight">Follow our work.</p>
            <div className="btn-row">
              <a
                href={site.social.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-outline"
              >
                <Instagram className="size-4" /> Instagram
              </a>
              <a href={site.social.facebook.href} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
                <Facebook className="size-4" /> Facebook
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
