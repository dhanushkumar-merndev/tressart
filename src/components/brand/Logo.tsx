import Image from "next/image";

/**
 * The tressart logo, served from vector files in /public/brand that were traced
 * from the supplied master artwork (Brand Standards v1.0). The lockup must never
 * be redrawn, re-spaced or re-typeset — swap the files for the original vector
 * masters if they become available.
 */

type Variant = "lockup" | "wordmark" | "mark";
type Tone = "dark" | "light";

const files: Record<Variant, { name: string; width: number; height: number }> = {
  lockup: { name: "tressart-logo", width: 1466, height: 1536 },
  wordmark: { name: "tressart-wordmark", width: 1466, height: 551 },
  mark: { name: "tressart-mark", width: 638, height: 933 },
};

type LogoProps = {
  variant?: Variant;
  /** dark = black on warm white (primary); light = white on black / charcoal (secondary). */
  tone?: Tone;
  className?: string;
  eager?: boolean;
};

export function Logo({ variant = "lockup", tone = "dark", className, eager = false }: LogoProps) {
  const { name, width, height } = files[variant];
  return (
    <Image
      src={`/brand/${name}${tone === "light" ? "-reverse" : ""}.svg`}
      alt="tressart salon"
      width={width}
      height={height}
      className={className}
      loading={eager ? "eager" : "lazy"}
      fetchPriority={eager ? "high" : undefined}
      unoptimized
    />
  );
}
