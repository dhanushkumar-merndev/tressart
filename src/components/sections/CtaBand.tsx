import { TressArt } from "@/components/art/TressArt";
import { ArrowUpRight, Phone } from "@/components/ui/icons";
import { site } from "@/lib/site";

type CtaBandProps = { title?: string; text?: string };

export function CtaBand({
  title = "Your chair is waiting.",
  text = "Call the salon to book a consultation, or drop in and say hello.",
}: CtaBandProps) {
  return (
    <section aria-label="Book an appointment" className="relative overflow-hidden bg-charcoal text-paper">
      <TressArt
        seed={101}
        strands={70}
        gold={4}
        tone="light"
        className="pointer-events-none absolute -right-24 top-1/2 h-[180%] w-[70%] -translate-y-1/2 opacity-45 md:right-0 md:w-[45%]"
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
