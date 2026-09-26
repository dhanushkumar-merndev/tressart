import type { Metadata } from "next";
import Link from "next/link";
import { ArtCanvas } from "@/components/art/ArtCanvas";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <section className="relative flex min-h-svh items-center overflow-hidden pt-[var(--header-h)]">
      <ArtCanvas
        scene="stray"
        seed={404}
        interactive
        className="absolute inset-y-0 right-0 h-full w-full opacity-35 md:w-[55%] md:opacity-90"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-transparent" />
      <div className="container-x relative py-24">
        <p className="eyebrow">404</p>
        <h1 className="mt-8 max-w-[12ch] text-display font-light">A strand out of place.</h1>
        <p className="mt-8 max-w-lg text-lead text-mute">
          The page you&apos;re looking for has moved or no longer exists.
        </p>
        <div className="btn-row mt-10">
          <Link href="/" className="btn btn-dark">
            Back to home
          </Link>
          <Link href="/services" className="btn btn-outline">
            View services
          </Link>
        </div>
      </div>
    </section>
  );
}
