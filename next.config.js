module.exports = {
  trailingSlash: true,
  images: {
    domains: ['webring.wonderful.software']
  },
  async redirects() {
    return [
      {
        source: '/posts/:id',
        destination: '/posts/:id/index',
        permanent: false
      },
      {
        source: '/posts/dev/:id',
        destination: '/posts/dev/:id/index',
        permanent: false
      },
      {
        source: '/posts/ride/:id',
        destination: '/posts/ride/:id/index',
        permanent: false
      }
    ]
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
