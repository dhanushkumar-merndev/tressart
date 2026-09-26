import type { ReactNode } from "react";

type SectionHeadingProps = {
  eyebrow: string;
  title: ReactNode;
  lead?: ReactNode;
  id?: string;
  align?: "left" | "center";
  tone?: "dark" | "light";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  lead,
  id,
  align = "left",
  tone = "dark",
  className = "",
}: SectionHeadingProps) {
  const center = align === "center";
  return (
    <div className={`reveal ${center ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p className={`eyebrow ${tone === "light" ? "!text-paper/60" : ""}`}>{eyebrow}</p>
      <h2 id={id} className="mt-6 text-headline font-light">
        {title}
      </h2>
      {lead && (
        <p
          className={`mt-6 text-lead ${center ? "mx-auto" : ""} max-w-2xl ${tone === "light" ? "text-paper/70" : "text-mute"}`}
        >
          {lead}
        </p>
      )}
    </div>
  );
}
