import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `npm run build` emits plain HTML/CSS/JS into `out/`
  output: "export",
  images: { unoptimized: true },
  // Allow opening the dev server from any private LAN address (your Wi-Fi IP changes).
  // Hostnames only, no port; `*` matches one part of the address.
  allowedDevOrigins: ["10.*.*.*", "192.168.*.*", "172.*.*.*"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
