/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
      'v0.blob.com',
      'storage.googleapis.com',
      'jeetix-file-service.onrender.com',
    ],
  },
};

module.exports = nextConfig;
