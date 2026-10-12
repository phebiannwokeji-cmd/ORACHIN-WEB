import type { NextConfig } from 'next';

const isIndexingAllowed = process.env.ALLOW_SEARCH_INDEXING === 'true';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  async headers() {
    if (!isIndexingAllowed) {
      return [
        {
          source: '/:path*',
          headers: [
            {
              key: 'X-Robots-Tag',
              value: 'noindex, nofollow',
            },
          ],
        },
      ];
    }
    return [];
  },
};

export default nextConfig;
