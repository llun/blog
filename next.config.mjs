const isExport = ['1', 'true', 'yes'].includes(
  (process.env.BLOG_EXPORT ?? '').toLowerCase()
)

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
