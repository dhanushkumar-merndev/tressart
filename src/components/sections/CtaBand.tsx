import { ArtCanvas } from "@/components/art/ArtCanvas";
import { ArrowUpRight, Phone } from "@/components/ui/icons";
import { site } from "@/lib/site";

type CtaBandProps = { title?: string; text?: string };

export function CtaBand({
  title = "Your chair is waiting.",
  text = "Call the salon to book a consultation, or drop in and say hello.",
}: CtaBandProps) {
  return (
    <section aria-label="Book an appointment" className="relative overflow-hidden bg-charcoal text-paper">
      <ArtCanvas
        scene="dust"
        seed={101}
        tone="light"
        className="pointer-events-none absolute inset-0 size-full opacity-80"
      />
      <div className="container-x relative py-24 md:py-32">
        <p className="reveal eyebrow !text-paper/60">Appointments</p>
        <h2 className="reveal mt-6 max-w-3xl text-headline font-light">{title}</h2>
        <p className="reveal mt-6 max-w-xl text-lead text-paper/70">{text}</p>
        <div className="reveal btn-row mt-10">
          <a href={site.phone.href} className="btn btn-light">
            <Phone className="size-4" /> {site.phone.display}
          </a>
          <a href={site.maps.directions} target="_blank" rel="noopener noreferrer" className="btn btn-ghost-light">
            Get directions <ArrowUpRight className="size-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
