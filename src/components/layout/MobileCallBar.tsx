import { Phone, Pin } from "@/components/ui/icons";
import { site } from "@/lib/site";

/** Persistent call / directions bar for phones — the two actions local visitors want most. */
export function MobileCallBar() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-soft bg-paper/95 backdrop-blur md:hidden">
      <div className="grid grid-cols-2 gap-2 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-3">
        <a href={site.phone.href} className="btn btn-dark !min-h-12 !px-4">
          <Phone className="size-4" /> Call
        </a>
        <a
          href={site.maps.directions}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-outline !min-h-12 !px-4"
        >
          <Pin className="size-4" /> Directions
        </a>
      </div>
    </div>
  );
}
