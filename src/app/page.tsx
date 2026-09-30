import Image from "next/image";
import Link from "next/link";
import { FaqList } from "@/components/sections/FaqList";
import { VisitSection } from "@/components/sections/VisitSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, ArrowUpRight } from "@/components/ui/icons";
import { faqSchema } from "@/lib/schema";
import { generalFaqs, services } from "@/lib/services";
import { site } from "@/lib/site";

const experience = [
  {
    title: "Consultation",
    text: "We begin by listening — your hair's history, your routine and the look you have in mind.",
  },
  {
    title: "Craft",
    text: "Precise, unhurried work by trained stylists, with L'Oréal Professionnel colour and care.",
  },
  {
    title: "Care",
    text: "Spotless stations, sanitised tools and a calm pace, so you can properly switch off.",
  },
  {
    title: "Aftercare",
    text: "Honest advice on products and upkeep, so the result lasts well beyond the chair.",
  },
];

const stats = [
  { value: site.reviews.rating, label: `Average rating on ${site.reviews.source}` },
  { value: site.reviews.count, label: "Guest reviews" },
  { value: "7", label: "Days a week, 9 am – 9 pm" },
  { value: "7", label: "Service disciplines" },
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(generalFaqs)} />

      {/* ------------------------------------------------------------ Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden bg-[#f5f5f5] pt-[var(--header-h)]">
        <div className="relative flex min-h-[calc(100svh-var(--header-h))] flex-col md:block">
          <div className="relative z-10 flex flex-col items-center px-5 pt-14 text-center md:absolute md:inset-y-0 md:left-0 md:right-[46%] md:justify-center md:pt-0 lg:right-[42%]">
            <p className="rise text-xs uppercase tracking-[0.3em] text-mute">Hair · Skin · Nails · Bridal</p>
            <h1
              id="hero-title"
              className="rise rise-1 mt-6 text-[clamp(2.1rem,4.2vw,3.8rem)] font-light uppercase leading-[1.15] tracking-[0.02em] text-charcoal"
            >
              Welcome to
              <br />
              tressart salon
            </h1>
            <Link
              href="/services"
              className="rise rise-2 mt-10 inline-flex items-center gap-2 text-xs uppercase tracking-[0.3em] text-charcoal"
            >
              <span className="link-line">Explore our services</span> <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="relative mt-10 h-[52svh] w-full md:absolute md:inset-y-0 md:right-0 md:mt-0 md:h-auto md:w-[54%] lg:w-[50%]">
            <Image
              src="/images/tressart-hero-portrait.png"
              alt="Model with long, glossy hair and teal glitter eye makeup"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 54vw"
              className="object-contain object-bottom md:object-right-bottom"
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- Statement */}
      <section aria-labelledby="statement-title" className="py-24 md:py-36">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <p className="reveal text-xs font-medium uppercase tracking-[0.3em] text-mute lg:col-span-3">The salon</p>
          <div className="lg:col-span-9">
            <h2
              id="statement-title"
              className="reveal text-[clamp(2rem,4.6vw,4.2rem)] font-bold uppercase leading-[0.95] tracking-[-0.03em]"
            >
              Hairdressing is a craft. We treat it like one.
            </h2>
            <p className="reveal mt-8 max-w-2xl text-lead text-mute">
              Our name joins two words: tress, a lock of hair, and art. Every visit begins with listening and ends with
              a look that feels effortless to live with, in a quiet, considered space on Harlur Road.
            </p>
            <Link
              href="/about"
              className="reveal mt-10 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em]"
            >
              <span className="link-line">Our story</span> <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Services */}
      <section aria-labelledby="services-title" className="pb-24 md:pb-36">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 border-t border-ink pt-6 md:flex-row md:items-end">
            <h2
              id="services-title"
              className="reveal text-[clamp(2.4rem,6vw,5.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
            >
              Services
            </h2>
            <Link
              href="/services"
              className="reveal inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em]"
            >
              <span className="link-line">View the full menu</span> <ArrowRight className="size-4" />
            </Link>
          </div>

          <ul className="mt-12 border-b border-ink/10">
            {services.map((s, i) => {
              const flip = i % 2 === 0;
              return (
                <li
                  key={s.slug}
                  className="reveal grid items-center gap-8 border-t border-ink/10 py-10 md:grid-cols-2 md:gap-16 md:py-14"
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
                    <h3 className="mt-4 text-[clamp(1.8rem,3.2vw,2.8rem)] font-bold uppercase leading-[0.95] tracking-[-0.02em]">
                      {s.title}
                    </h3>
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
        </div>
      </section>

      {/* ---------------------------------------------------------- Bridal */}
      <section aria-labelledby="bridal-title" className="grid bg-ink text-paper lg:grid-cols-2">
        <div className="relative min-h-[70svh] lg:min-h-[92svh]">
          <Image
            src="/images/tressart-bridal.jpg"
            alt="Bridal hair styling with a floral updo at tressart salon"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </div>
        <div className="flex flex-col justify-center px-5 py-20 md:px-16 lg:px-20">
          <p className="reveal text-xs font-medium uppercase tracking-[0.3em] text-gold-pale">Bridal &amp; occasion</p>
          <h2
            id="bridal-title"
            className="reveal mt-6 text-[clamp(2.4rem,5vw,4.8rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
          >
            For the days you&apos;ll remember.
          </h2>
          <p className="reveal mt-8 max-w-lg text-lead text-paper/70">
            Pre-bridal skin and hair rituals, then makeup and hair for every celebration: engagement, sangeet, wedding
            and reception, for you and the people beside you.
          </p>
          <div className="reveal btn-row mt-10">
            <Link href="/services/bridal-makeup" className="btn btn-light">
              Plan your bridal look
            </Link>
            <a href={site.phone.href} className="btn btn-ghost-light">
              Call {site.phone.display}
            </a>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Experience */}
      <section aria-labelledby="experience-title" className="py-24 md:py-36">
        <div className="container-x">
          <div className="grid gap-10 border-t border-ink pt-6 lg:grid-cols-12">
            <p className="reveal text-xs font-medium uppercase tracking-[0.3em] text-mute lg:col-span-3">
              The experience
            </p>
            <h2
              id="experience-title"
              className="reveal text-[clamp(2rem,4.6vw,4.2rem)] font-bold leading-[0.95] tracking-[-0.03em] lg:col-span-9"
            >
              not just a salon it&apos;s an experience.
            </h2>
          </div>
          <ol className="mt-16 grid gap-px bg-ink/15 sm:grid-cols-2 lg:grid-cols-4">
            {experience.map((step, i) => (
              <li key={step.title} className="reveal bg-paper p-6 md:p-8">
                <span className="text-[clamp(3rem,5vw,4.5rem)] font-bold leading-none tracking-[-0.04em] text-ink/15">
                  0{i + 1}
                </span>
                <h3 className="mt-6 text-lg font-bold uppercase tracking-[0.04em]">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-mute">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ---------------------------------------------------------- Colour */}
      <section
        aria-labelledby="colour-title"
        className="relative flex min-h-[80svh] items-end overflow-hidden text-paper"
      >
        <Image
          src="/images/services/service-hair-colour.jpg"
          alt="Dimensional balayage colour by tressart colourists"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />
        <div className="container-x relative grid gap-8 pb-14 md:grid-cols-12 md:items-end md:pb-20">
          <h2
            id="colour-title"
            className="reveal text-[clamp(2.6rem,7vw,6.5rem)] font-bold uppercase leading-[0.88] tracking-[-0.04em] md:col-span-8"
          >
            Colour with depth &amp; shine.
          </h2>
          <div className="reveal md:col-span-4">
            <p className="text-lead text-paper/80">
              Global colour, balayage, highlights and grey coverage with L&apos;Oréal Professionnel.
            </p>
            <Link
              href="/services/hair-colour"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em]"
            >
              <span className="link-line">Explore colour</span> <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------- Stats */}
      <section aria-label="tressart in numbers" className="bg-ink py-20 text-paper md:py-28">
        <dl className="container-x grid grid-cols-2 gap-y-12 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="reveal flex flex-col-reverse border-l border-paper/20 pl-5 md:pl-8">
              <dt className="mt-3 text-sm uppercase tracking-[0.14em] text-paper/60">{s.label}</dt>
              <dd className="text-[clamp(3rem,6vw,5.5rem)] font-bold leading-none tracking-[-0.04em]">{s.value}</dd>
            </div>
          ))}
        </dl>
        <div className="container-x mt-14">
          <a
            href={site.reviews.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium uppercase tracking-[0.2em] text-paper/80 hover:text-paper"
          >
            <span className="link-line">Read reviews on {site.reviews.source}</span>
            <ArrowUpRight className="size-4" />
          </a>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section aria-labelledby="faq-title" className="py-24 md:py-36">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <h2
              id="faq-title"
              className="reveal text-[clamp(2.4rem,5vw,4.5rem)] font-bold uppercase leading-[0.9] tracking-[-0.04em]"
            >
              Good to know
            </h2>
          </div>
          <div className="reveal lg:col-span-8">
            <FaqList faqs={generalFaqs} />
          </div>
        </div>
      </section>

      <div className="border-t border-ink/10" />
      <VisitSection />
    </>
  );
}
