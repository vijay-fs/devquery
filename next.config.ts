import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: __dirname,
  },
  // Allow reaching the dev server over the local network (e.g. testing on a phone)
  // without Next blocking its cross-origin dev/HMR resources.
  allowedDevOrigins: ["192.168.0.101", "192.168.0.*"],
};

export default nextConfig;
