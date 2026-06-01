import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  reactStrictMode: false,
  images: {
    unoptimized: true,
  },
  /**
   * Dev: in-memory webpack cache (avoids flaky filesystem cache + HMR chunk mismatches on Windows).
   * Prod: disable persistent cache to reduce missing `./NNN.js` in webpack-runtime after builds.
   */
  webpack: (config, { dev }) => {
    if (dev) {
      config.cache = { type: "memory" };
    } else {
      config.cache = false;
    }
    return config;
  },
};

export default nextConfig;
