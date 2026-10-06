import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: process.env.NEXT_EXPORT ? 'export' : undefined,
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
