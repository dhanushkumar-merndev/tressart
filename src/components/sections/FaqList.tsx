import { Plus } from "@/components/ui/icons";
import type { Faq } from "@/lib/services";

/** Native <details> accordion: accessible, indexable and zero JavaScript. */
export function FaqList({ faqs }: { faqs: Faq[] }) {
  return (
    <div className="border-t border-ink/15">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-ink/15">
          <summary className="flex cursor-pointer items-start justify-between gap-6 py-6 text-lg font-normal tracking-tight transition-colors hover:text-gold md:text-xl">
            <h3>{f.q}</h3>
            <Plus className="faq-icon mt-1 size-5 shrink-0 text-gold transition-transform duration-500" />
          </summary>
          <p className="max-w-2xl pb-7 leading-relaxed text-mute">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
