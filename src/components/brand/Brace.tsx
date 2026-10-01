"use client";

import { useEffect, useRef, useState } from "react";

/**
 * The curly braces from the tressart wordmark, lifted unchanged from
 * /public/brand/tressart-wordmark.svg so they match the logo exactly.
 */

const LEFT = "M531 1386C516.6 1385.5 513.8 1385.1 509.2 1383.1C499 1378.5 493 1369 490.1 1352.7C489.5 1349.5 489 1327.2 488.9 1301.7C488.6 1236.4 487.7 1226.3 480.5 1210.5C475.9 1200.3 469.4 1194.5 461 1193.1L457.5 1192.5L457.5 1186L457.5 1179.6L462.9 1178C477.9 1173.7 486 1156.8 488 1125.2C488.5 1117.1 489 1091.7 489 1068.8C489 1024.4 489.7 1015.2 493.5 1005.7C497.1 997 501.1 992.5 508.8 988.8L515.5 985.6L532.5 985.5L549.5 985.5L549.8 990.8C550 993.8 549.6 996.7 549 997.4C548.3 998.4 544.2 998.8 534.4 998.8C523.5 998.9 520.1 999.3 517.2 1000.7C512.5 1003 507.5 1009.7 505.9 1015.7C505.1 1019.1 504.5 1037.9 504 1078C503.2 1140 502.9 1142.8 497.1 1159.4C493.1 1170.8 484.1 1181.5 476.4 1184C472.9 1185.2 471.8 1187 474.5 1187C475.4 1187 478.5 1188.5 481.4 1190.4C490.7 1196.4 497.1 1208.1 501.2 1227C503.2 1235.8 503.4 1240.8 504 1294C504.7 1355.4 504.9 1356.8 509.9 1364.4C514.5 1371.4 517.4 1372.4 534.5 1373L549.5 1373.5L549.8 1379.6C550 1384 549.7 1385.9 548.8 1386.1C548.1 1386.3 540.1 1386.3 531 1386Z";
const RIGHT = "M918.2 1379.8L918.5 1373.5L933.6 1373C947.9 1372.5 948.9 1372.4 952.7 1369.8C958.2 1366.2 961.6 1358.9 962.9 1348C963.5 1343.2 964 1320 964 1294.3C964 1239.1 965.1 1226.8 971.2 1211C975.5 1200 983.5 1190.4 990.6 1187.8C992.5 1187.2 994 1186.3 994 1185.8C994 1185.4 992.1 1184.2 989.8 1183.2C983.1 1180.2 977.6 1174.1 973.2 1164.8C965.2 1148 964 1136.7 964 1077.8C964 1052.9 963.5 1028.6 963 1023.9C961.5 1010.7 957.4 1003.5 949.7 1000.2C948 999.5 941.6 999 933.7 999C926.4 999 919.9 998.6 919.2 998.1C918.3 997.6 918 995.5 918.2 991.4L918.5 985.5L935.5 985.6C952 985.6 952.7 985.7 958.4 988.4C967.6 992.9 972.3 999 976.6 1012C978.2 1016.9 978.4 1023.6 979 1074.5C979.5 1110.9 980.1 1134.2 980.9 1139C984.5 1161.5 992.7 1174.7 1005.2 1178.2L1010.5 1179.7L1010.5 1186.1L1010.5 1192.5L1007 1193.1C995.8 1195.1 988.4 1203.6 983.6 1220.2C980.2 1231.9 979.8 1239.2 979.1 1296C978.4 1346.1 978.1 1354.3 976.6 1359.5C973 1371.7 967.3 1379.3 958.7 1383.1C954 1385.2 951.7 1385.5 935.7 1385.8L917.9 1386.2L918.2 1379.8Z";

type BraceProps = { side: "left" | "right"; className?: string };

export function Brace({ side, className }: BraceProps) {
  const left = side === "left";
  return (
    <svg
      viewBox={left ? "457 985 94 402" : "917 985 94 402"}
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="currentColor" d={left ? LEFT : RIGHT} />
    </svg>
  );
}

/**
 * Frames its child (a box with a fixed aspect ratio) between a pair of logo braces. When it scrolls
 * into view the braces start closed in the middle, part to reveal the child, then fade away.
 * Without JavaScript, or with reduced motion, the child simply shows.
 */
export function BraceFrame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"static" | "closed" | "open">("static");

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("closed");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("open");
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} data-braces={state} className={`brace-frame relative px-[13.8%] text-[#707173] ${className}`}>
      <Brace side="left" className="brace brace-left absolute -top-[4%] h-[108%] w-auto" />
      <div className="brace-content">{children}</div>
      <Brace side="right" className="brace brace-right absolute -top-[4%] h-[108%] w-auto" />
    </div>
  );
}
