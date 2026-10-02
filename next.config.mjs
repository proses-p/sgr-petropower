/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  images: {
    unoptimized: true,
  },
  /* config options here */
  reactCompiler: true,
};

export default nextConfig;
