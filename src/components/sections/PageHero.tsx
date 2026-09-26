import Link from "next/link";
import type { ReactNode } from "react";
import { TressArt } from "@/components/art/TressArt";
import { JsonLd } from "@/components/seo/JsonLd";
import { breadcrumbSchema } from "@/lib/schema";

type Crumb = { name: string; path: string };

type PageHeroProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  crumbs: Crumb[];
  artSeed?: number;
  children?: ReactNode;
};

export function PageHero({ eyebrow, title, lead, crumbs, artSeed = 3, children }: PageHeroProps) {
  const trail = [{ name: "Home", path: "/" }, ...crumbs];
  return (
    <section className="relative overflow-hidden pt-[var(--header-h)]">
      <JsonLd data={breadcrumbSchema(trail)} />
      <TressArt
        seed={artSeed}
        strands={90}
        gold={5}
        interactive
        fadeTop={0.25}
        className="absolute -right-[35%] top-0 h-full w-[110%] opacity-35 md:-right-[8%] md:w-[60%] md:opacity-70 lg:w-[50%] lg:opacity-100"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/75 to-transparent" />

      <div className="container-x relative pb-20 pt-10 md:pb-28 md:pt-16">
        <nav aria-label="Breadcrumb" className="rise">
          <ol className="flex flex-wrap items-center gap-2 text-xs tracking-[0.12em] text-mute">
            {trail.map((c, i) => {
              const last = i === trail.length - 1;
              return (
                <li key={c.path} className="flex items-center gap-2">
                  {last ? (
                    <span aria-current="page" className="text-ink">
                      {c.name}
                    </span>
                  ) : (
                    <>
                      <Link href={c.path} className="link-line hover:text-ink">
                        {c.name}
                      </Link>
                      <span aria-hidden="true" className="text-grey">
                        /
                      </span>
                    </>
                  )}
                </li>
              );
            })}
          </ol>
        </nav>

        <p className="rise rise-1 eyebrow mt-16 md:mt-24">{eyebrow}</p>
        <h1 className="rise rise-2 mt-8 max-w-[13ch] text-display font-light">{title}</h1>
        {lead && <p className="rise rise-3 mt-8 max-w-2xl text-lead text-mute">{lead}</p>}
        {children && <div className="rise rise-4 btn-row mt-10">{children}</div>}
      </div>
    </section>
  );
}
