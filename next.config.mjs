/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'utfs.io',
            port: '',
            pathname: '/f/**',
          },
          {
            protocol: 'https',
            hostname: 'img.clerk.com',
            port: '',
            pathname: '/**',
          },
          {
            protocol: 'https',
            hostname: 'pixabay.com',
            port: '',
            pathname: '/**',
          },
        ],
      },
}

export default nextConfig;
