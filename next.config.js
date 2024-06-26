/** @type {import("next").NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = {
  reactStrictMode: true,
  images: {
    domains: ["gateway.pinata.cloud"],
    formats: ["image/webp"],
  },
};
