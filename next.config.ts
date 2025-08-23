import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  eslint: {
    // Ignorer ESLint pendant le build pour le déploiement
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
      },
      {
        protocol: 'https',
        hostname: 'tmpfiles.org',
      },
      {
        protocol: 'http',
        hostname: 'tmpfiles.org',
      },
      {
        protocol: 'https',
        hostname: '0x0.st',
      },
      {
        protocol: 'https',
        hostname: 'freeimage.host',
      },
      {
        protocol: 'https',
        hostname: 'iili.io',
      },
      {
        protocol: 'https',
        hostname: 'catbox.moe',
      },
      {
        protocol: 'https',
        hostname: 'files.catbox.moe',
      },
      {
        protocol: 'https',
        hostname: 'pomf.lain.la',
      },
    ],
    // Image configuration
    dangerouslyAllowSVG: false,
    contentDispositionType: 'attachment',
  },
};

export default nextConfig;
