import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { ArrowRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { services } from "@/lib/services";
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
        {services.map((s) => (
          <section
            key={s.slug}
            id={s.slug}
            aria-labelledby={`${s.slug}-title`}
            className="grid gap-10 border-b border-ink/10 py-16 last:border-b-0 md:py-24 lg:grid-cols-12"
          >
            <div className="reveal lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
              <span className="text-xs tracking-[0.24em] text-grey">{s.number}</span>
              <h2
                id={`${s.slug}-title`}
                className="mt-5 text-[clamp(2rem,3.6vw,3rem)] font-light leading-tight tracking-tight"
              >
                {s.title}
              </h2>
              <p className="mt-4 max-w-sm text-mute">{s.headline}</p>
              <Link
                href={`/services/${s.slug}`}
                className="group mt-6 block overflow-hidden rounded-[22px] border border-ink/10 bg-sand/30 shadow-[0_12px_30px_rgba(35,31,32,0.06)]"
              >
                <div className="relative aspect-[16/10] w-full overflow-hidden">
                  <Image
                    src={s.image}
                    alt={s.imageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              </Link>
              <Link href={`/services/${s.slug}`} className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
                <span className="link-line">More about {s.title.toLowerCase()}</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
            <ul className="grid gap-x-10 sm:grid-cols-2 lg:col-span-7 lg:col-start-6">
              {s.items.map((item) => (
                <li key={item.name} className="reveal border-t border-ink/10 py-6">
                  <h3 className="text-lg font-normal tracking-tight">{item.name}</h3>
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-mute">{item.description}</p>
                </li>
              ))}
            </ul>
          </section>
        ))}

        <p className="reveal mx-auto mt-10 max-w-2xl text-center text-sm leading-relaxed text-mute">
          Pricing depends on the service, your hair length and your stylist. Call{" "}
          <a href={site.phone.href} className="link-line text-ink">
            {site.phone.display}
          </a>{" "}
          for our current rate card — we&apos;re always happy to advise before you book.
        </p>
      </div>

      <CtaBand />
    </>
  );
}
