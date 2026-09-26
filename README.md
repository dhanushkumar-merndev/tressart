# tressart salon — website

Marketing website for **tressart salon**, a L'Oréal Professionnel flagship unisex salon at No. 13/23, Ambalipura, Harlur Road, Bengaluru. Built with Next.js 16 (App Router), React 19, TypeScript and Tailwind CSS v4, following the tressart _Brand & Logo Standards v1.0_.

> _not just a salon it's an experience._

## Getting started

```bash
npm install
cp .env.example .env.local   # set the canonical URL for your environment
npm run dev                  # http://localhost:3000
```

| Command         | What it does                         |
| --------------- | ------------------------------------ |
| `npm run dev`   | Start the dev server (Turbopack)     |
| `npm run build` | Production build — every page static |
| `npm run start` | Serve the production build           |
| `npm run lint`  | ESLint                               |

### Environment variables

| Variable                               | Purpose                                                                                 |
| -------------------------------------- | --------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`                 | Canonical origin for canonical links, Open Graph, sitemap and JSON-LD. Defaults to `https://tressart.in`. |
| `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` | Optional Google Search Console verification token.                                      |

Deploys to Vercel (or any Node host) with no extra configuration. Set `NEXT_PUBLIC_SITE_URL` to the live domain in production.

## Pages

| Route                | Content                                                                   |
| -------------------- | ------------------------------------------------------------------------- |
| `/`                  | Hero, the name, services, the experience, trust, bridal, FAQ, visit & map |
| `/services`          | Full service menu across seven disciplines                                |
| `/services/[slug]`   | One page per discipline, with menu, FAQs and related services (7 pages)   |
| `/about`             | Story, principles, partners                                               |
| `/contact`           | Address, hours, map, directions, tips before visiting                     |

## Editing content

Almost everything lives in two files:

- **`src/lib/site.ts`** — name, phone, address, opening hours, map links, social links, review figures, partners, service areas. Used everywhere, including structured data.
- **`src/lib/services.ts`** — service categories, treatments, per-service FAQs, SEO titles/descriptions, and the general FAQ.

## Design

- **Brand colours** from the brand guide are Tailwind tokens (`ink`, `paper`, `charcoal`, `grey`, `soft`, `sand`, `taupe`, `gold`, `gold-pale` …) in `src/app/globals.css`. The page is predominantly monochrome on warm white, with gold as a restrained accent.
- **Type:** the Helvetica family, as mandated. Apple devices render Helvetica Neue; elsewhere Inter (self-hosted via `next/font`) stands in as the closest neutral grotesque with light weights.
- **Logo:** `public/brand/*.svg` are vector traces of the supplied master artwork: the full lockup, the wordmark, the symbol, and reverse versions of each. They are never re-typeset. If the original vector masters exist, drop them in with the same file names.
- **Artwork instead of stock photography:** each page has its own animated scene, all in `src/components/art/scenes/`. The home hero keeps the signature lock of hair. Services has a braid. Haircuts shows strands falling to a precision bob line; colour, a balayage curtain from charcoal to gold; spa, water ripples; skin, a glowing orb; bridal, falling petals; nails, a colour-swatch fan; men's grooming, a skin fade. About has a 3D ringlet, contact has map contours with a gold pin, dark bands have gold dust or silk, and the 404 page has a stray curl. Scenes respond to the pointer on desktop, and art panels tilt in 3D. Drawing runs in a Web Worker via `OffscreenCanvas` (`ArtCanvas.tsx`), so it never blocks the page. It pauses off-screen, and people who prefer reduced motion get a still frame.
- **Motion:** entrances and scroll reveals are CSS-only (`animation-timeline: view()` where supported) and respect `prefers-reduced-motion`.

## SEO

- Static prerendering for every route, with ~23 KB gzipped HTML on the home page.
- Per-page titles, descriptions, canonical URLs, Open Graph and Twitter cards (`src/lib/metadata.ts`), plus a branded share image (`src/app/opengraph-image.jpg`).
- JSON-LD structured data: `HairSalon`/`BeautySalon` with address, hours, service catalogue and service areas; `WebSite`; `Service`; `FAQPage`; `BreadcrumbList`.
- `sitemap.xml`, `robots.txt`, web manifest, favicon, SVG icon and Apple touch icon.
- Local search keywords (Harlur Road, Ambalipura, HSR Layout, Sarjapur Road, Bellandur) in titles, copy and schema.
- Semantic landmarks, one `h1` per page, skip link, accessible navigation and native `<details>` FAQs.

Lighthouse (mobile, production build): Performance 97–99, Accessibility 100, Best Practices 100, SEO 100.

## Please confirm with the salon

Details came from the brand guide and public listings (Facebook, Justdial, magicpin, L'Oréal Professionnel salon finder, Pamperazzi). Check these before launch:

- **Opening hours:** listed as 9 am – 9 pm daily; one source says Monday–Saturday.
- **Instagram handle:** `@tressart_salon` is used; `@tressartsalonofficial` also exists.
- **Partner brands:** Thalgo and Decléor are cited by one listing.
- **Service menu:** built from publicly listed categories. Adjust treatments to the real rate card.
- **Review figures:** 4.3★ from 600+ reviews on Justdial.
- **Domain:** `tressart.in` is assumed.
- **Photography:** the brand guide asks for editorial photos of the salon, hair details and team. Real photos can be added alongside the artwork.
- **tressart women's salon:** the brand guide mentions this branch. Its address can be added as a second location in `site.ts`.
