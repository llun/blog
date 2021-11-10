const { redirect } = require('next/dist/server/api-utils')

module.exports = {
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
  }
}
