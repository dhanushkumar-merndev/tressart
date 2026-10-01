"use client";

import { useLenis } from "lenis/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BraceText } from "@/components/brand/Brace";
import { Logo } from "@/components/brand/Logo";
import { ArrowUpRight, ChevronDown, Close, Pin } from "@/components/ui/icons";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

const menu = [
  { href: "/", label: "Home" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About us" },
  { href: "/contact", label: "Contact" },
] as const;

function Burger({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 24" className={className} aria-hidden="true" focusable="false">
      <path d="M0 2h40M0 12h40M0 22h40" stroke="currentColor" strokeWidth="2" />
    </svg>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const lenis = useLenis();
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(true);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the menu whenever the route changes.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, lenis]);

  const isActive = (href: string) =>
    href === "/" || href === "/services" ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      <header className="site-header fixed inset-x-0 top-0 z-50">
        <div className="relative flex h-[var(--header-h)] items-center justify-between px-5 md:px-10">
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-expanded={open}
            aria-controls="site-menu"
            className="-ml-1 flex items-center gap-4 p-1 text-charcoal transition-colors hover:text-ink"
          >
            <Burger className="h-[18px] w-8 md:h-5 md:w-10" />
            <span className="hidden text-sm uppercase tracking-[0.12em] sm:inline">Menu</span>
            <span className="sr-only sm:hidden">Open menu</span>
          </button>

          <Link href="/" aria-label="tressart salon — home" className="absolute left-1/2 -translate-x-1/2">
            <Logo variant="wordmark" className="h-9 w-auto md:h-11" eager />
          </Link>

          <Link
            href="/contact"
            className="flex items-center gap-2 p-1 text-charcoal transition-colors hover:text-ink"
            aria-label="Visit the salon"
          >
            <Pin className="size-6" />
            <span className="hidden text-sm uppercase tracking-[0.12em] sm:inline">Visit the salon</span>
          </Link>
        </div>
      </header>

      {/* Page wash behind the open menu */}
      <div
        aria-hidden="true"
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-[60] bg-studio/70 transition-opacity duration-500 ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <aside
        id="site-menu"
        aria-label="Site menu"
        inert={!open}
        data-lenis-prevent
        className={`fixed inset-y-0 left-0 z-[70] flex w-full flex-col overflow-y-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden border-r border-ink/10 bg-studio transition-transform duration-500 ease-[var(--ease-silk)] sm:w-[440px] lg:w-[33vw] lg:min-w-[440px] ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-[var(--header-h)] shrink-0 items-center px-5 md:px-10 lg:justify-end lg:pr-[max(2.5rem,calc(33vw-360px))]">
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="flex w-[280px] items-center gap-4 p-1 text-charcoal hover:text-ink"
          >
            <Close className="size-8" />
            <span className="text-sm uppercase tracking-[0.12em]">Close menu</span>
          </button>
        </div>

        <nav aria-label="Primary" className="mt-2">
          <ul className="border-b border-ink/10">
            {menu.map((item) => {
              if (item.href === "/services") {
                const isServicesCurrent = pathname === "/services";
                return (
                  <li key={item.href} className="border-t border-ink/10 first:border-t-0">
                    <div
                      className={`relative flex items-center px-5 py-4 transition-colors hover:bg-paper ${
                        isServicesCurrent ? "bg-paper" : ""
                      } md:px-10 lg:justify-end lg:pr-[max(2.5rem,calc(33vw-360px))]`}
                    >
                      <Link
                        href="/services"
                        aria-current={isServicesCurrent ? "page" : undefined}
                        className="w-[280px] text-lg uppercase tracking-[0.06em] text-charcoal hover:text-ink"
                      >
                        {item.label}
                      </Link>
                      <button
                        type="button"
                        onClick={() => setServicesOpen((prev) => !prev)}
                        aria-expanded={servicesOpen}
                        aria-label="Toggle services list"
                        className="absolute inset-y-0 right-3 flex w-10 items-center justify-center text-charcoal transition-colors hover:text-ink md:right-8"
                      >
                        <ChevronDown
                          className={`size-5 transition-transform duration-300 ease-[var(--ease-silk)] ${
                            servicesOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ease-[var(--ease-silk)] ${
                        servicesOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0 pointer-events-none"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <ul className="border-t border-ink/10 bg-soft/20 py-2">
                          {services.map((s, i) => {
                            const isServiceActive = pathname === `/services/${s.slug}`;
                            return (
                              <li key={s.slug}>
                                <Link
                                  href={`/services/${s.slug}`}
                                  aria-current={isServiceActive ? "page" : undefined}
                                  className={`flex px-5 py-2.5 transition-colors hover:bg-paper ${
                                    isServiceActive ? "bg-paper font-medium text-ink" : "text-mute hover:text-ink"
                                  } md:px-10 lg:justify-end lg:pr-[max(2.5rem,calc(33vw-360px))]`}
                                >
                                  <span className="w-[280px] pl-4 text-sm tracking-[0.04em]">
                                    <BraceText play={open && servicesOpen} delay={0.2 + i * 0.08} className="-ml-[0.4em]">
                                      {s.title}
                                    </BraceText>
                                  </span>
                                </Link>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    </div>
                  </li>
                );
              }

              return (
                <li key={item.href} className="border-t border-ink/10 first:border-t-0">
                  <Link
                    href={item.href}
                    aria-current={isActive(item.href) ? "page" : undefined}
                    className="flex px-5 py-4 transition-colors hover:bg-paper aria-[current=page]:bg-paper md:px-10 lg:justify-end lg:pr-[max(2.5rem,calc(33vw-360px))]"
                  >
                    <span className="w-[280px] text-lg uppercase tracking-[0.06em] text-charcoal">{item.label}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="mt-16 border-y border-ink/10">
          {[
            { key: "title", body: <span className="text-lg uppercase tracking-[0.06em]">Visit the salon</span> },
            {
              key: "address",
              body: (
                <>
                  <span className="block text-sm leading-relaxed text-mute">{site.addressOneLine}</span>
                  <a
                    href={site.maps.directions}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-flex items-center gap-2 text-sm uppercase tracking-[0.1em] text-charcoal hover:text-ink"
                  >
                    Get directions <ArrowUpRight className="size-4" />
                  </a>
                </>
              ),
            },
            {
              key: "hours",
              body: (
                <span className="text-sm uppercase tracking-[0.1em] text-mute">
                  {site.hours.label} · {site.hours.time}
                </span>
              ),
            },
            {
              key: "phone",
              body: (
                <a href={site.phone.href} className="text-sm uppercase tracking-[0.1em] text-charcoal hover:text-ink">
                  Call {site.phone.display}
                </a>
              ),
            },
          ].map((row) => (
            <div
              key={row.key}
              className={`flex px-5 py-4 md:px-10 lg:justify-end lg:pr-[max(2.5rem,calc(33vw-360px))] ${
                row.key === "title" || row.key === "address" ? "" : "border-t border-ink/10"
              }`}
            >
              <div className="w-[280px]">{row.body}</div>
            </div>
          ))}
        </div>
      </aside>
    </>
  );
}
