import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Let the dev server accept HMR/dev requests when the site is opened on 127.0.0.1.
  allowedDevOrigins: ["127.0.0.1"],
  images: {
    // 90 keeps the transparent hero portrait crisp; 75 is the default for everything else.
    qualities: [75, 90],
  },
};

export default nextConfig;
