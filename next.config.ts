import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
    ],
  },
  // Configuration pour éviter le prerendering des pages protégées
  trailingSlash: false,
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
