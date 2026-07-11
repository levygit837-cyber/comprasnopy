/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    qualities: [70, 75, 82, 84, 86, 88],
  },
};

export default nextConfig;
