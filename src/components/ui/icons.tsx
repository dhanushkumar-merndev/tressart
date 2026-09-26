import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function base(props: IconProps) {
  return {
    width: 18,
    height: 18,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.4,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
    focusable: false,
    ...props,
  };
}

export const ArrowRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const ArrowUpRight = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M7 17 17 7M8 7h9v9" />
  </svg>
);

export const Phone = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M5 3.5h3.2l1.6 4.3-2.1 1.4a11.5 11.5 0 0 0 7.1 7.1l1.4-2.1 4.3 1.6V19a1.7 1.7 0 0 1-1.8 1.7A16.6 16.6 0 0 1 3.3 5.3 1.7 1.7 0 0 1 5 3.5Z" />
  </svg>
);

export const Pin = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 21s-6.5-5.6-6.5-11a6.5 6.5 0 0 1 13 0c0 5.4-6.5 11-6.5 11Z" />
    <circle cx="12" cy="10" r="2.3" />
  </svg>
);

export const Clock = (p: IconProps) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3 2" />
  </svg>
);

export const Star = (p: IconProps) => (
  <svg {...base(p)} fill="currentColor" stroke="none">
    <path d="m12 3.2 2.6 5.5 6 .7-4.4 4.1 1.2 6-5.4-3-5.4 3 1.2-6-4.4-4.1 6-.7L12 3.2Z" />
  </svg>
);

export const Instagram = (p: IconProps) => (
  <svg {...base(p)}>
    <rect x="3.5" y="3.5" width="17" height="17" rx="5" />
    <circle cx="12" cy="12" r="3.9" />
    <circle cx="17.2" cy="6.8" r="0.6" fill="currentColor" />
  </svg>
);

export const Facebook = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M14.5 7.5H16V4.2h-2.3c-2.4 0-3.7 1.5-3.7 3.9v2.1H8v3.2h2V21h3.3v-7.6h2.3l.4-3.2h-2.7V8.4c0-.6.4-.9 1.2-.9Z" />
  </svg>
);

export const Menu = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M3.5 8.5h17M3.5 15.5h17" />
  </svg>
);

export const Close = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="m5.5 5.5 13 13M18.5 5.5l-13 13" />
  </svg>
);

export const Plus = (p: IconProps) => (
  <svg {...base(p)}>
    <path d="M12 5v14M5 12h14" />
  </svg>
);
