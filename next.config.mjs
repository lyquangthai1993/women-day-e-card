/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Cho phép build tĩnh nếu deploy lên GitHub Pages / tĩnh
  output: process.env.NEXT_EXPORT ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
