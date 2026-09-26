import Link from "next/link";
import { ArrowRight, Phone } from "@/components/ui/icons";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

type ServicesGridProps = { excludeSlug?: string; headingLevel?: "h2" | "h3" };

export function ServicesGrid({ excludeSlug, headingLevel = "h3" }: ServicesGridProps) {
  const list = services.filter((s) => s.slug !== excludeSlug);
  const Heading = headingLevel;
  return (
    <ul className="grid border-l border-t border-ink/12 sm:grid-cols-2 lg:grid-cols-4">
      {list.map((s) => (
        <li key={s.slug} className="reveal border-b border-r border-ink/12">
          <Link
            href={`/services/${s.slug}`}
            className="group relative flex h-full min-h-[340px] flex-col p-7 transition-colors duration-500 hover:bg-studio md:p-9"
          >
            <span className="absolute inset-x-0 top-0 h-px origin-left scale-x-0 bg-gold transition-transform duration-700 ease-[var(--ease-silk)] group-hover:scale-x-100" />
            <span className="text-xs tracking-[0.24em] text-grey">{s.number}</span>
            <Heading className="mt-10 text-[1.7rem] font-light leading-tight tracking-tight">{s.title}</Heading>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-mute">{s.summary}</p>
            <ul className="mt-auto flex flex-wrap gap-x-4 gap-y-1 pt-8 text-xs uppercase tracking-[0.14em] text-charcoal/80">
              {s.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            <span className="mt-6 inline-flex items-center gap-2 text-sm font-medium">
              Explore
              <ArrowRight className="size-4 transition-transform duration-500 group-hover:translate-x-1.5" />
            </span>
          </Link>
        </li>
      ))}
      {list.length % 4 !== 0 && (
        <li className="reveal border-b border-r border-ink/12 bg-ink text-paper">
          <a href={site.phone.href} className="group flex h-full min-h-[340px] flex-col p-7 md:p-9">
            <span className="text-xs tracking-[0.24em] text-paper/50">—</span>
            <span className="mt-10 text-[1.7rem] font-light leading-tight tracking-tight">
              Not sure where to begin?
            </span>
            <span className="mt-4 text-[0.95rem] leading-relaxed text-paper/65">
              Book a consultation and we&apos;ll recommend what your hair and skin actually need.
            </span>
            <span className="mt-auto inline-flex items-center gap-2 pt-8 text-sm font-medium text-gold-pale">
              <Phone className="size-4" /> {site.phone.display}
            </span>
          </a>
        </li>
      )}
    </ul>
  );
}
