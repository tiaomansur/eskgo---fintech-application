import type { NextConfig } from "next";

function getFigmaDevOrigins() {
  if (!process.env.FIGMA || !process.env.FIGMA_PUBLIC_URL) return [];

  try {
    return [new URL(process.env.FIGMA_PUBLIC_URL).hostname];
  } catch {
    return [];
  }
}

const nextConfig: NextConfig = {
  allowedDevOrigins: getFigmaDevOrigins(),
};

export default nextConfig;
