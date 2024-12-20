/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    domains: ["cloudflare-b2.bogjenniferanns.workers.dev"],
  },
  productionBrowserSourceMaps: process.env.NEXT_PUBLIC_ENV !== "production",
  experimental: {
    middlewarePrefetch: "strict",
  },
};

module.exports = nextConfig;
