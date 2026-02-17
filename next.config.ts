import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Optimize for faster builds
  productionBrowserSourceMaps: false,
  compress: true,
  poweredByHeader: false,
  // Enable system TLS certificates for Google Fonts
  experimental: {
    turbopackUseSystemTlsCerts: true,
  },
  // Export as static site for Azure Static Web Apps
  output: "export",
};

export default nextConfig;
