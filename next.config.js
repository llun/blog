module.exports = {
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['webring.wonderful.software']
  },
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
