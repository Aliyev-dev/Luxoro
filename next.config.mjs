/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['three'],
  compiler: { removeConsole: process.env.NODE_ENV === 'production' },
};
export default nextConfig;
