import Link from "next/link";
import { Tilt } from "@/components/art/Tilt";
import { TressArt } from "@/components/art/TressArt";
import { FaqList } from "@/components/sections/FaqList";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { VisitSection } from "@/components/sections/VisitSection";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowRight, ArrowUpRight, Star } from "@/components/ui/icons";
import { faqSchema } from "@/lib/schema";
import { generalFaqs } from "@/lib/services";
import { site } from "@/lib/site";

const marqueeWords = [
  "Precision cuts",
  "Colour",
  "Balayage",
  "Hair spa",
  "Keratin",
  "Facials",
  "Bridal",
  "Nails",
  "Grooming",
];

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

const guestThemes = [
  { title: "Precise cuts & styling", text: "Guests single out our stylists' cutting and finishing." },
  { title: "Spotless hygiene", text: "Clean stations and careful practice come up again and again." },
  { title: "Honest advice", text: "Straight talk on hair care and upkeep — no hard sell." },
];

const bridalList = [
  "Pre-bridal skin and hair rituals",
  "Bridal makeup and hair styling",
  "Engagement, sangeet and reception looks",
  "Family and bridal party styling",
];

export default function HomePage() {
  return (
    <>
      <JsonLd data={faqSchema(generalFaqs)} />

      {/* ------------------------------------------------------------ Hero */}
      <section aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--header-h)]">
        <TressArt
          seed={7}
          strands={120}
          gold={6}
          interactive
          fadeTop={0.22}
          label="Animated line artwork of a flowing lock of hair"
          className="absolute -right-[30%] top-0 h-full w-[120%] opacity-50 sm:-right-[12%] sm:w-[80%] sm:opacity-80 lg:-right-[4%] lg:w-[58%] lg:opacity-100"
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-transparent lg:via-paper/30" />

        <div className="container-x relative flex min-h-[calc(100svh-var(--header-h))] flex-col justify-center py-16 md:py-24">
          <p className="rise eyebrow">
            L&apos;Oréal Professionnel flagship<span className="hidden sm:inline"> · Bengaluru</span>
          </p>
          <h1 id="hero-title" className="rise rise-1 mt-8 max-w-[11ch] text-display font-light">
            Where hair becomes art<span className="text-gold">.</span>
          </h1>
          <p className="rise rise-2 mt-8 max-w-xl text-lead text-mute">
            A luxury unisex salon on Harlur Road for precision cuts, considered colour, skin rituals and bridal beauty —
            delivered with calm, unhurried attention.
          </p>
          <div className="rise rise-3 btn-row mt-10">
            <a href={site.phone.href} className="btn btn-dark">
              Book your visit
            </a>
            <Link href="/services" className="btn btn-outline">
              Explore services <ArrowRight className="size-4" />
            </Link>
          </div>
          <dl className="rise rise-4 mt-14 flex flex-wrap gap-x-10 gap-y-4 text-sm text-mute">
            <div className="flex items-center gap-2">
              <dt className="sr-only">Rating</dt>
              <dd className="flex items-center gap-2">
                <Star className="size-4 text-gold" />
                <span>
                  <strong className="font-medium text-ink">{site.reviews.rating}</strong> from {site.reviews.count}{" "}
                  reviews
                </span>
              </dd>
            </div>
            <div>
              <dt className="sr-only">Hours</dt>
              <dd>
                <strong className="font-medium text-ink">{site.hours.label}</strong> · {site.hours.time}
              </dd>
            </div>
            <div>
              <dt className="sr-only">Location</dt>
              <dd>Ambalipura, Harlur Road</dd>
            </div>
          </dl>
        </div>
      </section>

      {/* --------------------------------------------------------- Marquee */}
      <div aria-hidden="true" className="overflow-hidden border-y border-ink/10 bg-paper py-6">
        <div className="marquee-track flex w-max">
          {[0, 1].map((k) => (
            <ul key={k} className="flex shrink-0 items-center">
              {marqueeWords.map((w) => (
                <li key={w} className="flex items-center">
                  <span className="px-8 text-2xl font-light tracking-tight text-charcoal md:text-3xl">{w}</span>
                  <span className="size-1.5 rounded-full bg-gold" />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>

      {/* ------------------------------------------------------------ Name */}
      <section aria-labelledby="name-title" className="py-28 md:py-40">
        <div className="container-x grid gap-16 lg:grid-cols-12 lg:gap-8">
          <div className="reveal lg:col-span-6">
            <p className="eyebrow">The name</p>
            <p
              aria-hidden="true"
              className="mt-10 text-[clamp(4.5rem,13vw,11rem)] font-light leading-[0.85] tracking-[-0.05em]"
            >
              tress
              <span className="mx-[0.06em] align-[0.12em] text-[0.55em] text-gold">+</span>
              art
            </p>
            <dl className="mt-12 grid max-w-md gap-6 border-t border-ink/15 pt-8 text-sm">
              <div className="grid grid-cols-[5rem_1fr] gap-4">
                <dt className="font-medium">
                  tress <span className="font-normal italic text-grey">n.</span>
                </dt>
                <dd className="text-mute">A long lock of hair.</dd>
              </div>
              <div className="grid grid-cols-[5rem_1fr] gap-4">
                <dt className="font-medium">
                  art <span className="font-normal italic text-grey">n.</span>
                </dt>
                <dd className="text-mute">Skill, expressed with imagination.</dd>
              </div>
            </dl>
          </div>
          <div className="reveal lg:col-span-5 lg:col-start-8 lg:pt-24">
            <h2 id="name-title" className="text-headline font-light">
              Hairdressing is a craft. We treat it like one.
            </h2>
            <div className="mt-8 space-y-5 text-lead text-mute">
              <p>
                Our name joins two words: hair, and the art of shaping it. We believe hairdressing is the craft of
                creating something beautiful — and entirely yours — with hair.
              </p>
              <p>
                Every visit begins with listening and ends with a look that feels effortless to live with. In between,
                you get unhurried time, expert hands and a quiet, considered space.
              </p>
            </div>
            <Link href="/about" className="mt-10 inline-flex items-center gap-2 font-medium">
              <span className="link-line">Our story</span> <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* -------------------------------------------------------- Services */}
      <section aria-labelledby="services-title" className="pb-28 md:pb-40">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              id="services-title"
              eyebrow="Services"
              title="Every detail, considered."
              lead="Hair, skin, nails and bridal — for women and men, under one roof on Harlur Road."
            />
            <Link href="/services" className="reveal inline-flex shrink-0 items-center gap-2 font-medium">
              <span className="link-line">View the full menu</span> <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-16">
            <ServicesGrid />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------ Experience */}
      <section aria-labelledby="experience-title" className="relative overflow-hidden bg-ink py-28 text-paper md:py-40">
        <TressArt
          seed={19}
          strands={80}
          gold={4}
          tone="light"
          className="pointer-events-none absolute -left-40 top-0 h-full w-[70%] opacity-25 lg:w-[45%]"
        />
        <div className="container-x relative">
          <p className="reveal eyebrow !text-paper/60">The tressart experience</p>
          <h2 id="experience-title" className="reveal mt-8 max-w-[15ch] text-display font-light">
            not just a salon it&apos;s an experience.
          </h2>
          <ol className="mt-20 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {experience.map((step, i) => (
              <li key={step.title} className="reveal border-t border-paper/20 pt-7">
                <span className="text-xs tracking-[0.24em] text-gold-pale">0{i + 1}</span>
                <h3 className="mt-5 text-2xl font-light tracking-tight">{step.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/65">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ----------------------------------------------------------- Proof */}
      <section aria-labelledby="proof-title" className="py-28 md:py-40">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-5 lg:self-start">
            <SectionHeading
              id="proof-title"
              eyebrow="Trusted locally"
              title="A L'Oréal Professionnel flagship salon."
              lead="We work with professional houses we trust, and our guests keep coming back."
            />
            <ul className="reveal mt-10 flex flex-wrap gap-x-3 gap-y-2 text-lg font-light">
              {site.partners.map((p, i) => (
                <li key={p} className="flex items-center gap-3">
                  {i > 0 && <span aria-hidden="true" className="size-1 rounded-full bg-gold" />}
                  {p}
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-[28px] border border-ink/10 bg-ink/10">
              {[
                { value: site.reviews.rating, unit: "★", label: `Average rating on ${site.reviews.source}` },
                { value: site.reviews.count, unit: "", label: "Guest reviews" },
                { value: "7", unit: "days", label: "Open 9 am – 9 pm" },
                { value: "7", unit: "", label: "Service disciplines" },
              ].map((stat) => (
                <div key={stat.label} className="reveal flex flex-col-reverse bg-paper p-7 md:p-10">
                  <dt className="mt-3 text-sm text-mute">{stat.label}</dt>
                  <dd className="text-[clamp(2.75rem,5vw,4.5rem)] font-light leading-none tracking-tight">
                    {stat.value}
                    {stat.unit === "★" ? (
                      <>
                        <Star aria-hidden="true" className="ml-1 inline size-[0.4em] align-baseline text-gold" />
                        <span className="sr-only"> out of 5</span>
                      </>
                    ) : (
                      stat.unit && <span className="ml-1.5 text-[0.4em] text-mute">{stat.unit}</span>
                    )}
                  </dd>
                </div>
              ))}
            </dl>

            <h3 className="reveal eyebrow eyebrow-plain mt-14">What guests mention most</h3>
            <ul className="mt-6 divide-y divide-ink/10 border-y border-ink/10">
              {guestThemes.map((t) => (
                <li key={t.title} className="reveal grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-6">
                  <span className="font-medium">{t.title}</span>
                  <span className="text-mute">{t.text}</span>
                </li>
              ))}
            </ul>
            <a
              href={site.reviews.href}
              target="_blank"
              rel="noopener noreferrer"
              className="reveal mt-6 inline-flex items-center gap-2 text-sm font-medium"
            >
              <span className="link-line">Read reviews on {site.reviews.source}</span>
              <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------- Bridal */}
      <section aria-labelledby="bridal-title" className="bg-sand/30 py-28 md:py-40">
        <div className="container-x grid items-center gap-16 lg:grid-cols-12">
          <div className="reveal relative lg:col-span-5">
            <Tilt className="aspect-[4/5] overflow-hidden rounded-[32px] bg-paper">
              <TressArt seed={53} strands={90} gold={14} interactive className="absolute inset-0 size-full" />
            </Tilt>
            <p className="bracket-frame absolute -bottom-6 left-6 bg-paper px-8 py-3 text-sm italic text-charcoal md:left-10">
              {site.tagline}
            </p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading
              id="bridal-title"
              eyebrow="Bridal & occasion"
              title="For the days you'll remember."
              lead="Your wedding is a series of moments, each with its own look. We plan them with you — from pre-bridal care in the weeks before to makeup and hair that feel like you on the day, only more so."
            />
            <ul className="reveal mt-10 border-t border-ink/15">
              {bridalList.map((item, i) => (
                <li key={item} className="flex items-baseline gap-6 border-b border-ink/15 py-4">
                  <span className="text-xs tracking-[0.24em] text-grey">0{i + 1}</span>
                  <span className="text-lg font-light">{item}</span>
                </li>
              ))}
            </ul>
            <div className="reveal btn-row mt-10">
              <Link href="/services/bridal-makeup" className="btn btn-dark">
                Plan your bridal look
              </Link>
              <a href={site.phone.href} className="btn btn-outline">
                Call {site.phone.display}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- FAQ */}
      <section aria-labelledby="faq-title" className="py-28 md:py-40">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:sticky lg:top-32 lg:col-span-4 lg:self-start">
            <SectionHeading id="faq-title" eyebrow="Questions" title="Good to know." />
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
