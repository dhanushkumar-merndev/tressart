import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { MobileCallBar } from "@/components/layout/MobileCallBar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { JsonLd } from "@/components/seo/JsonLd";
import { salonSchema, websiteSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "tressart salon | Luxury Hair, Skin & Bridal Salon on Harlur Road, Bengaluru",
    template: "%s | tressart salon",
  },
  description: `${site.description} Open daily, 9 am – 9 pm.`,
  applicationName: site.name,
  keywords: [
    "tressart salon",
    "tressart",
    "salon in Harlur Road",
    "salon in Ambalipura",
    "unisex salon near HSR Layout",
    "salon near Sarjapur Road",
    "L'Oréal Professionnel salon Bengaluru",
    "hair colour Bengaluru",
    "balayage Bengaluru",
    "keratin treatment Bengaluru",
    "bridal makeup Bengaluru",
    "facial near Bellandur",
  ],
  category: "Beauty salon",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: site.locale,
    url: "/",
    siteName: site.name,
    title: "tressart salon — not just a salon it's an experience.",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "tressart salon — not just a salon it's an experience.",
    description: site.description,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  formatDetection: { telephone: false },
  // Set NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION to the Search Console token to verify ownership.
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  other: {
    "geo.region": "IN-KA",
    "geo.placename": "Bengaluru",
  },
};

export const viewport: Viewport = {
  themeColor: "#F7F5F1",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-IN" className={inter.variable}>
      <body className="flex min-h-svh flex-col">
        <SmoothScroll>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-sm focus:text-paper"
          >
            Skip to content
          </a>
          <JsonLd data={[salonSchema(), websiteSchema()]} />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter />
          <MobileCallBar />
        </SmoothScroll>
      </body>
    </html>
  );
}
