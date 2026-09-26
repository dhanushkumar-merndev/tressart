import { ArrowUpRight, Clock, Phone, Pin } from "@/components/ui/icons";
import { site } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";

type VisitSectionProps = { headingLevel?: "h1" | "h2" };

export function VisitSection({ headingLevel = "h2" }: VisitSectionProps) {
  const details = (
    <dl className="mt-12 grid gap-8 sm:grid-cols-2">
      <div>
        <dt className="eyebrow eyebrow-plain flex items-center gap-3">
          <Pin className="size-5 shrink-0 text-gold" /> Address
        </dt>
        <dd className="mt-3 pl-8 leading-relaxed">
          <address className="not-italic">
            {site.address.line1}
            <br />
            {site.address.line2}
            <br />
            {site.address.landmark}, {site.address.locality} {site.address.postalCode}
          </address>
        </dd>
      </div>
      <div>
        <dt className="eyebrow eyebrow-plain flex items-center gap-3">
          <Clock className="size-5 shrink-0 text-gold" /> Hours
        </dt>
        <dd className="mt-3 pl-8 leading-relaxed">
          {site.hours.label}
          <br />
          {site.hours.time}
        </dd>
      </div>
      <div>
        <dt className="eyebrow eyebrow-plain flex items-center gap-3">
          <Phone className="size-5 shrink-0 text-gold" /> Appointments
        </dt>
        <dd className="mt-3 pl-8">
          <a href={site.phone.href} className="link-line text-lg">
            {site.phone.international}
          </a>
        </dd>
      </div>
    </dl>
  );

  return (
    <section aria-labelledby="visit-title" className="py-24 md:py-36">
      <div className="container-x grid items-start gap-14 lg:grid-cols-12">
        <div className="lg:col-span-5">
          {headingLevel === "h1" ? (
            <div className="rise max-w-3xl">
              <p className="eyebrow">Visit the salon</p>
              <h1 id="visit-title" className="mt-6 text-headline font-light">
                Find us on Harlur Road.
              </h1>
              <p className="mt-6 text-lead text-mute">
                Just off Sarjapur Road, above Axis Bank — minutes from HSR Layout, Bellandur and Kasavanahalli.
              </p>
            </div>
          ) : (
            <SectionHeading
              id="visit-title"
              eyebrow="Visit the salon"
              title="Find us on Harlur Road."
              lead="Just off Sarjapur Road, above Axis Bank — minutes from HSR Layout, Bellandur and Kasavanahalli."
            />
          )}
          {details}
          <div className="btn-row mt-12">
            <a href={site.phone.href} className="btn btn-dark">
              Book a visit
            </a>
            <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Get directions <ArrowUpRight className="size-4" />
            </a>
          </div>
        </div>

        <div className="reveal lg:col-span-7">
          <div className="relative overflow-hidden rounded-[28px] bg-soft">
            <iframe
              title="Map showing tressart salon on Harlur Road, Bengaluru"
              src={site.maps.embed}
              className="aspect-[4/3] w-full grayscale-[0.9] contrast-[1.05] sepia-[0.15] lg:aspect-[5/4]"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
        </div>
      </div>
    </section>
  );
}
