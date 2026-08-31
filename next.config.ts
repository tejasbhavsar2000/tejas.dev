import os from "node:os";
import type { NextConfig } from "next";

/**
 * Every non internal IPv4 address this machine has.
 *
 * Next blocks cross origin requests to dev assets, so opening the dev server
 * from a phone on the same network fails to fetch any chunk and the page
 * renders as little more than a shell. Deriving the addresses beats hardcoding
 * one, because the IP changes with the network you are on.
 *
 * Development only: Next ignores `allowedDevOrigins` in a production build.
 */
function localNetworkOrigins(): string[] {
  const found = new Set<string>();
  for (const entries of Object.values(os.networkInterfaces())) {
    for (const entry of entries ?? []) {
      if (entry.family === "IPv4" && !entry.internal) found.add(entry.address);
    }
  }
  return [...found];
}

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: { formats: ["image/avif", "image/webp"] },
  // Development only: Next discards this in a production build. Gated anyway so
  // the interface lookup does not run during one.
  allowedDevOrigins:
    process.env.NODE_ENV === "production"
      ? undefined
      : [...localNetworkOrigins(), "*.local"],
};

export default nextConfig;
