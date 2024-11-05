/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["cloudflare-b2.bogjenniferanns.workers.dev"],
  },
  webpack(config, { dev, isServer }) {
    if (!dev && !isServer) {
      config.devtool = 'source-map';
    }
    return config;
  },
};

module.exports = nextConfig;