import type { Metadata } from "next";
import Link from "next/link";
import { ArtCanvas } from "@/components/art/ArtCanvas";
import { Logo } from "@/components/brand/Logo";
import { CtaBand } from "@/components/sections/CtaBand";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ArrowRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "About — A L'Oréal Professionnel Flagship Salon in Bengaluru",
  description:
    "The story behind tressart salon: hair and the art of it. A L'Oréal Professionnel flagship unisex salon in Ambalipura, Harlur Road, Bengaluru, built around attention to detail.",
  path: "/about",
});

const principles = [
  {
    title: "Attention to detail",
    text: "From the first hello to the final finish, every touchpoint is considered. It's the difference you notice without being told.",
  },
  {
    title: "Honest expertise",
    text: "We'll recommend what your hair and skin actually need — and tell you when something isn't right for you.",
  },
  {
    title: "A calm, clean space",
    text: "Spotless stations, sanitised tools and an unhurried pace. Time here should feel like time for yourself.",
  },
  {
    title: "Contemporary craft",
    text: "Our team keeps learning, so techniques and colour stay current — refined, never fussy.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About tressart"
        title="Hair, and the art of it."
        lead="tressart salon is a L'Oréal Professionnel flagship salon in Ambalipura, on Harlur Road, Bengaluru — a unisex salon for hair, skin, nails and bridal."
        scene="curl"
      />

      {/* Story */}
      <section aria-labelledby="story-title" className="border-t border-ink/10 py-24 md:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="reveal flex items-start justify-center lg:col-span-5">
            <div className="w-full max-w-sm rounded-[32px] bg-studio px-12 py-16 md:px-16 md:py-20">
              <Logo className="mx-auto h-auto w-full max-w-[220px]" />
            </div>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <SectionHeading id="story-title" eyebrow="Our story" title="A name that says what we do." />
            <div className="reveal mt-8 space-y-5 text-lead text-mute">
              <p>
                Our name brings together <em className="not-italic text-ink">tress</em> — a lock of hair — and{" "}
                <em className="not-italic text-ink">art</em>. We believe hairdressing is a sheer art: the craft of
                creating something beautiful with hair, shaped around the person in the chair.
              </p>
              <p>
                That belief shapes everything, from how we consult to how we cut, colour and care. It&apos;s why we
                think of tressart as a premium salon experience rather than a quick service — calm, refined and
                genuinely personal.
              </p>
              <p>
                Today we welcome guests from across Ambalipura, Harlur, HSR Layout, Bellandur and Sarjapur Road for
                everything from a sharp trim to complete bridal packages.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Principles */}
      <section aria-labelledby="principles-title" className="relative overflow-hidden bg-ink py-24 text-paper md:py-36">
        <ArtCanvas
          scene="silk"
          seed={83}
          tone="light"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[65%] w-full opacity-35"
        />
        <div className="container-x relative">
          <SectionHeading
            id="principles-title"
            eyebrow="What we stand for"
            title="Luxury, without the fuss."
            tone="light"
          />
          <ul className="mt-16 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
            {principles.map((p, i) => (
              <li key={p.title} className="reveal border-t border-paper/20 pt-7">
                <span className="text-xs tracking-[0.24em] text-gold-pale">0{i + 1}</span>
                <h3 className="mt-5 text-2xl font-light tracking-tight">{p.title}</h3>
                <p className="mt-3 leading-relaxed text-paper/65">{p.text}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Partners */}
      <section aria-labelledby="partners-title" className="py-24 md:py-36">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading id="partners-title" eyebrow="Our partners" title="Professional houses we trust." />
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <dl className="border-t border-ink/15">
              <div className="reveal border-b border-ink/15 py-8">
                <dt className="text-2xl font-light tracking-tight">L&apos;Oréal Professionnel</dt>
                <dd className="mt-3 leading-relaxed text-mute">
                  tressart is a L&apos;Oréal Professionnel flagship salon. Our colour, care and styling services are
                  built on their professional ranges and training.
                </dd>
              </div>
              <div className="reveal border-b border-ink/15 py-8">
                <dt className="text-2xl font-light tracking-tight">Thalgo &amp; Decléor</dt>
                <dd className="mt-3 leading-relaxed text-mute">
                  Our skin rituals draw on professional skincare from these respected French houses.
                </dd>
              </div>
            </dl>
            <Link href="/services" className="reveal mt-10 inline-flex items-center gap-2 font-medium">
              <span className="link-line">Explore our services</span> <ArrowRight className="size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section aria-label="Our promise" className="bg-sand/30 py-24 md:py-32">
        <div className="container-x text-center">
          <p className="reveal bracket-frame mx-auto inline-block px-10 py-6 text-[clamp(1.6rem,3.6vw,3rem)] font-light italic tracking-tight md:px-16">
            {site.tagline}
          </p>
        </div>
      </section>

      <CtaBand title="Come and see for yourself." />
    </>
  );
}
