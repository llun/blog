const isExport = process.env.BLOG_EXPORT === '1'

const nextConfig = {
  ...(isExport ? { output: 'export' } : null),
  trailingSlash: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'webring.wonderful.software'
      }
    ]
  },
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js'
      }
    }
  },
  ...(!isExport
    ? {
        async headers() {
          return [
            {
              // Apply these headers to all routes in your application.
              source: '/(.*)',
              headers: [
                {
                  key: 'X-Frame-Options',
                  value: 'SAMEORIGIN'
                }
              ]
            }
          ]
        }
      }
    : null)
}

export default nextConfig
