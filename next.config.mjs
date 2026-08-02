const isExport = ['1', 'true', 'yes'].includes(
  (process.env.BLOG_EXPORT ?? '').toLowerCase()
)

const nextConfig = {
  ...(isExport ? { output: 'export' } : null),
  trailingSlash: true,
  // TypeScript 7 ships only the Go compiler, so next build must shell out to
  // the tsc CLI instead of calling the JavaScript compiler API
  experimental: {
    useTypeScriptCli: true
  },
  images: {
    unoptimized: true
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
