import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { faqSchema } from "@/lib/schema";
import { generalFaqs, services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Salon Services — Hair, Colour, Skin, Nails & Bridal",
  description:
    "The tressart salon service menu: haircuts and styling, L'Oréal Professionnel hair colour, hair spa, keratin and smoothening, facials, nails, men's grooming and bridal makeup on Harlur Road, Bengaluru.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={faqSchema(generalFaqs)} />
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="The service menu"
        title="Hair, skin & bridal services."
        lead="Seven disciplines, one standard of care — for women and men, at our salon in Ambalipura on Harlur Road."
        scene="braid"
      >
        <a href={site.phone.href} className="btn btn-dark">
          Book a consultation
        </a>
      </PageHero>

      {/* Jump links */}
      <nav aria-label="Service categories" className="border-y border-ink/10 bg-paper">
        <ul className="container-x flex gap-2 overflow-x-auto py-4 [scrollbar-width:none]">
          {services.map((s) => (
            <li key={s.slug} className="shrink-0">
              <a
                href={`#${s.slug}`}
                className="inline-flex items-center gap-2 rounded-full border border-ink/15 px-4 py-2 text-sm transition-colors hover:border-ink hover:bg-ink hover:text-paper"
              >
                <span className="text-xs text-grey">{s.number}</span> {s.title}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="container-x py-12 md:py-20">
        <ul className="border-b border-ink/10">
          {services.map((s, i) => {
            const flip = i % 2 === 0;
            return (
              <li
                key={s.slug}
                id={s.slug}
                className="reveal grid scroll-mt-32 items-center gap-8 border-t border-ink/10 py-10 first:border-t-0 md:grid-cols-2 md:gap-16 md:py-14"
              >
                <Link
                  href={`/services/${s.slug}`}
                  className={`group relative block aspect-[4/3] overflow-hidden bg-soft ${flip ? "md:order-2" : ""}`}
                  aria-label={s.title}
                >
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-silk)] group-hover:scale-105"
                  />
                </Link>
                <div className={flip ? "md:order-1" : ""}>
                  <span className="text-xs tracking-[0.24em] text-grey">{s.number}</span>
                  <h2 className="mt-4 text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                    {s.title}
                  </h2>
                  <p className="mt-5 text-lg text-charcoal">{s.headline}</p>
                  <p className="mt-3 max-w-md leading-relaxed text-mute">{s.summary}</p>
                  <ul className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs uppercase tracking-[0.16em] text-charcoal/80">
                    {s.highlights.map((h) => (
                      <li key={h}>{h}</li>
                    ))}
                  </ul>
                  <Link
                    href={`/services/${s.slug}`}
                    className="mt-8 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em]"
                  >
                    <span className="link-line">Explore</span> <ArrowRight className="size-4" />
                  </Link>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-mute">
          Pricing depends on the service, your hair length and your stylist. Call{" "}
          <a href={site.phone.href} className="link-line text-ink">
            {site.phone.display}
          </a>{" "}
          for our current rate card — we&apos;re always happy to advise before you book.
        </p>
      </div>

      <section aria-labelledby="faq-title" className="border-t border-ink/10 py-24 md:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <SectionHeading id="faq-title" eyebrow="Before you book" title="Good to know." />
          </div>
          <div className="reveal lg:col-span-8">
            <FaqList faqs={generalFaqs} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
