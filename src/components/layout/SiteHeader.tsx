"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "@/components/brand/Logo";
import { Close, Menu, Phone } from "@/components/ui/icons";
import { nav, site } from "@/lib/site";

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/services" ? pathname === "/services" : pathname === href || pathname.startsWith(`${href}/`);

  // The menu panel is rendered outside <header>: the header's backdrop-filter
  // makes it the containing block for fixed children, which would collapse it.
  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50">
        <div className="container-x flex h-[var(--header-h)] items-center justify-between gap-6">
          <Link href="/" aria-label="tressart salon — home" className="shrink-0">
            <Logo variant="wordmark" className="h-[46px] w-auto" eager />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-10">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="link-line text-[0.78rem] font-medium uppercase tracking-[0.18em] text-charcoal aria-[current=page]:bg-[length:100%_1px]"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-3">
            <a
              href={site.phone.href}
              className="hidden items-center gap-2 text-sm text-charcoal md:inline-flex xl:mr-3"
            >
              <Phone className="size-4 text-gold" />
              <span className="link-line">{site.phone.display}</span>
            </a>
            <a href={site.phone.href} className="btn btn-dark hidden !min-h-11 sm:inline-flex">
              Book a visit
            </a>
            <button
              type="button"
              className="-mr-2 inline-flex size-11 items-center justify-center lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((v) => !v)}
            >
              {open ? <Close className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-menu"
          className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-[45] overflow-y-auto bg-paper lg:hidden"
        >
          <nav aria-label="Mobile" className="container-x flex min-h-full flex-col pb-10 pt-8">
            <ul className="flex flex-col border-t border-soft">
              {[{ href: "/", label: "Home" }, ...nav].map((item, i) => (
                <li key={item.href} className="border-b border-soft">
                  <Link
                    href={item.href}
                    aria-current={pathname === item.href ? "page" : undefined}
                    className="rise flex items-baseline justify-between py-5 text-[2rem] font-light tracking-tight aria-[current=page]:text-gold"
                    style={{ animationDelay: `${i * 50}ms` }}
                  >
                    {item.label}
                    <span className="text-xs tracking-[0.2em] text-grey">0{i + 1}</span>
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-auto space-y-2 pt-10 text-sm text-mute">
              <p>{site.addressOneLine}</p>
              <p>
                {site.hours.label} · {site.hours.time}
              </p>
              <a href={site.phone.href} className="btn btn-dark mt-6 w-full">
                <Phone className="size-4" /> Call {site.phone.display}
              </a>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
