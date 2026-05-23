import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api-hackathon.codedematrixtech.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
