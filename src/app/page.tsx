import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Clock, Pin, Star } from "@/components/ui/icons";
import { site } from "@/lib/site";

const details = [
  {
    icon: Clock,
    label: site.hours.label,
    value: "9 am – 9 pm",
  },
  {
    icon: Pin,
    label: "Find us",
    value: "Ambalipura, Harlur Road",
    href: site.maps.directions,
  },
  {
    icon: Star,
    label: `${site.reviews.rating} on ${site.reviews.source}`,
    value: `${site.reviews.count} guest reviews`,
    href: site.reviews.href,
  },
];

export default function HomePage() {
  return (
    <div className="relative">
      {/* Backdrop + portrait stay pinned while the hero copy and salon details scroll over it */}
      <div aria-hidden="true" className="sticky top-0 z-0 h-[100svh] overflow-hidden bg-[#f5f5f5]">
        <div className="absolute inset-x-0 bottom-0 top-[45%] md:inset-y-0 md:left-auto md:right-0 md:top-[var(--header-h)] md:w-[62%] lg:w-[58%]">
          <Image
            src="/images/tressart-hero-portrait-hd.png"
            alt=""
            fill
            priority
            sizes="(max-width: 768px) 100vw, 62vw"
            quality={90}
            className="object-contain object-bottom md:object-right-bottom"
          />
        </div>
      </div>

      <section
        aria-labelledby="hero-title"
        className="relative z-10 -mt-[100svh] h-[100svh] pt-[var(--header-h)]"
      >
        <div className="flex h-full flex-col items-center px-5 pt-12 text-center md:mr-[46%] md:justify-center md:pt-0 lg:mr-[42%]">
          <p className="rise text-xs uppercase tracking-[0.3em] text-mute">Hair · Skin · Nails · Bridal</p>
          <h1
            id="hero-title"
            className="rise rise-1 mt-6 text-[clamp(2.1rem,4.2vw,3.8rem)] font-light uppercase leading-[1.15] tracking-[0.02em] text-charcoal"
          >
            Welcome to
            <br />
            tressart salon
          </h1>
          <p className="rise rise-2 mt-6 max-w-md leading-relaxed text-mute">
            A L&apos;Oréal Professionnel flagship salon on Harlur Road, Bengaluru — for women and men.
          </p>
          <div className="rise rise-3 mt-9 flex flex-wrap items-center justify-center gap-x-10 gap-y-4 text-xs uppercase tracking-[0.3em] text-charcoal">
            <Link href="/services" className="inline-flex items-center gap-2">
              <span className="link-line">Explore our services</span> <ArrowRight className="size-4" />
            </Link>
            <a href={site.phone.href} className="inline-flex items-center gap-2">
              <span className="link-line">Call {site.phone.display}</span>
            </a>
          </div>
        </div>
      </section>

      {/* Salon details — a short scroll below the hero */}
      <section
        aria-label="Visiting tressart"
        className="relative z-20 border-t border-ink/10 bg-paper shadow-[0_-8px_30px_rgba(0,0,0,0.04)]"
      >
        <ul className="grid sm:grid-cols-3">
          {details.map(({ icon: Icon, label, value, href }) => {
            const body = (
              <>
                <Icon className="mt-0.5 size-5 shrink-0 text-grey" />
                <span>
                  <span className="block text-xs uppercase tracking-[0.2em] text-mute">{label}</span>
                  <span className="mt-2 flex items-center gap-1.5 text-lg text-charcoal">
                    {value}
                    {href && <ArrowUpRight className="size-4 text-grey" />}
                  </span>
                </span>
              </>
            );
            const cell = "flex h-full items-start gap-4 px-5 py-8 md:px-10 md:py-12";
            return (
              <li
                key={label}
                className="border-t border-ink/10 first:border-t-0 sm:border-l sm:border-t-0 sm:first:border-l-0"
              >
                {href ? (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${cell} transition-colors hover:bg-studio`}
                  >
                    {body}
                  </a>
                ) : (
                  <div className={cell}>{body}</div>
                )}
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
