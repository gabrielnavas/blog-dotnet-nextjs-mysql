/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    localPatterns: [
      {
        pathname: 'blob:http://localhost:3000/*',
      }
    ]
  }
};

export default nextConfig;
