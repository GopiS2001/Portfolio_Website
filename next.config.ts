import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `npm run build` emits plain HTML/CSS/JS into `out/`
  output: "export",
  images: { unoptimized: true },
  // Allow opening the dev server from other devices on the network (hostname only, no port)
  allowedDevOrigins: ["10.110.247.2"],
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
