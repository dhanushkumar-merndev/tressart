import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Tilt } from "@/components/art/Tilt";
import { TressArt } from "@/components/art/TressArt";
import { CtaBand } from "@/components/sections/CtaBand";
import { FaqList } from "@/components/sections/FaqList";
import { PageHero } from "@/components/sections/PageHero";
import { SectionHeading } from "@/components/sections/SectionHeading";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { JsonLd } from "@/components/seo/JsonLd";
import { ArrowUpRight } from "@/components/ui/icons";
import { pageMetadata } from "@/lib/metadata";
import { faqSchema, serviceSchema } from "@/lib/schema";
import { getService, services } from "@/lib/services";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    shareTitle: `${service.title} | ${site.name}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  return (
    <>
      <JsonLd data={[serviceSchema(service), faqSchema(service.faqs)]} />

      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        eyebrow={`Service ${service.number} · Bengaluru`}
        title={service.title}
        lead={`${service.headline} ${service.summary}`}
        artSeed={service.artSeed}
      >
        <a href={site.phone.href} className="btn btn-dark">
          Book an appointment
        </a>
        <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
          Get directions <ArrowUpRight className="size-4" />
        </a>
      </PageHero>

      {/* Intro + menu */}
      <section aria-labelledby="menu-title" className="border-t border-ink/10 py-24 md:py-32">
        <div className="container-x grid gap-16 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-32">
              <div className="reveal">
                <Tilt className="aspect-[4/5] overflow-hidden rounded-[32px] bg-sand/30">
                  <TressArt
                    seed={service.artSeed + 1}
                    strands={80}
                    gold={service.slug === "hair-colour" || service.slug === "bridal-makeup" ? 16 : 5}
                    interactive
                    className="absolute inset-0 size-full"
                  />
                </Tilt>
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 lg:col-start-7">
            <div className="reveal space-y-5 text-lead text-mute">
              {service.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>

            <h2 id="menu-title" className="reveal eyebrow mt-16">
              {service.title} at tressart
            </h2>
            <ol className="mt-8 border-t border-ink/15">
              {service.items.map((item, i) => (
                <li key={item.name} className="reveal grid grid-cols-[2.5rem_1fr] gap-4 border-b border-ink/15 py-6">
                  <span className="pt-1 text-xs tracking-[0.2em] text-grey">{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <h3 className="text-xl font-normal tracking-tight">{item.name}</h3>
                    <p className="mt-2 leading-relaxed text-mute">{item.description}</p>
                  </div>
                </li>
              ))}
            </ol>
            <p className="reveal mt-8 text-sm leading-relaxed text-mute">
              Pricing varies with the service, hair length and stylist. Call{" "}
              <a href={site.phone.href} className="link-line text-ink">
                {site.phone.display}
              </a>{" "}
              for the current rate card.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section aria-labelledby="faq-title" className="bg-sand/20 py-24 md:py-32">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading id="faq-title" eyebrow="Questions" title="Good to know." />
          </div>
          <div className="reveal lg:col-span-8">
            <FaqList faqs={service.faqs} />
          </div>
        </div>
      </section>

      {/* Other services */}
      <section aria-labelledby="more-title" className="py-24 md:py-32">
        <div className="container-x">
          <SectionHeading id="more-title" eyebrow="Explore" title="More from the menu." />
          <div className="mt-14">
            <ServicesGrid excludeSlug={service.slug} />
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
