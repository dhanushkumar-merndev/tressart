import type { Metadata } from "next";
import { site } from "./site";

const shareImage = {
  url: "/opengraph-image.jpg",
  width: 1200,
  height: 630,
  alt: "tressart salon — not just a salon it's an experience.",
};

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  shareTitle?: string;
};

/**
 * Next.js replaces (rather than merges) a parent's `openGraph` and `twitter`
 * objects, so every page builds the complete set here.
 */
export function pageMetadata({ title, description, path, shareTitle }: PageMetaInput): Metadata {
  const ogTitle = shareTitle ?? `${title} | ${site.name}`;
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: site.locale,
      siteName: site.name,
      url: path,
      title: ogTitle,
      description,
      images: [shareImage],
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: [shareImage.url],
    },
  };
}
