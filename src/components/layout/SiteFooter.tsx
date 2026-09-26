import Link from "next/link";
import { Logo } from "@/components/brand/Logo";
import { Facebook, Instagram } from "@/components/ui/icons";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer className="bg-ink text-paper">
      <div className="container-x grid gap-14 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-4">
          <Link href="/" aria-label="tressart salon — home" className="inline-block">
            <Logo tone="light" className="h-auto w-[132px]" />
          </Link>
          <p className="mt-8 max-w-xs text-lg font-light italic text-paper/80">{site.tagline}</p>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/60">
            A L&apos;Oréal Professionnel flagship salon on Harlur Road, Bengaluru.
          </p>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow eyebrow-plain !text-paper/55">Services</h2>
          <ul className="mt-6 space-y-3 text-[0.95rem]">
            {services.map((s) => (
              <li key={s.slug}>
                <Link href={`/services/${s.slug}`} className="link-line text-paper/85 hover:text-paper">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="md:col-span-3">
          <h2 className="eyebrow eyebrow-plain !text-paper/55">Visit</h2>
          <address className="mt-6 space-y-1 text-[0.95rem] not-italic leading-relaxed text-paper/85">
            <p>{site.address.line1}</p>
            <p>{site.address.line2}</p>
            <p>
              {site.address.locality} {site.address.postalCode}
            </p>
          </address>
          <p className="mt-5 text-[0.95rem] text-paper/85">
            {site.hours.label}
            <br />
            {site.hours.time}
          </p>
          <a href={site.phone.href} className="link-line mt-5 inline-block text-[0.95rem] text-gold-pale">
            {site.phone.international}
          </a>
        </div>

        <div className="md:col-span-2">
          <h2 className="eyebrow eyebrow-plain !text-paper/55">Follow</h2>
          <ul className="mt-6 space-y-3 text-[0.95rem]">
            <li>
              <a
                href={site.social.instagram.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-paper/85 hover:text-paper"
              >
                <Instagram className="size-4" /> <span className="link-line">Instagram</span>
              </a>
            </li>
            <li>
              <a
                href={site.social.facebook.href}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-paper/85 hover:text-paper"
              >
                <Facebook className="size-4" /> <span className="link-line">Facebook</span>
              </a>
            </li>
          </ul>
          <ul className="mt-10 space-y-3 text-[0.95rem]">
            <li>
              <Link href="/about" className="link-line text-paper/85 hover:text-paper">
                About
              </Link>
            </li>
            <li>
              <Link href="/contact" className="link-line text-paper/85 hover:text-paper">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-paper/10">
        <div className="container-x flex flex-col gap-3 py-7 pb-24 text-xs tracking-wide text-paper/50 sm:flex-row sm:items-center sm:justify-between md:pb-7">
          <p>© {year} tressart salon. All rights reserved.</p>
          <p>Hair · Skin · Nails · Bridal — Ambalipura, Harlur Road, Bengaluru</p>
        </div>
      </div>
    </footer>
  );
}
