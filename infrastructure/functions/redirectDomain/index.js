// @ts-check
/**
 *
 * @param {string} url
 */
function found(url) {
  console.log(`Redirect to ${url}`)
  return {
    status: '302',
    statusDescription: 'Found',
    headers: {
      location: [
        {
          key: 'Location',
          value: url
        }
      ],
      'cache-control': [
        {
          key: 'Cache-Control',
          value: 'max-age=3600'
        }
      ]
    }
  }
}

/**
 *
 * @param {import('aws-lambda').CloudFrontRequestEvent} event
 */
exports.entry = async function (event) {
  const record = event.Records[0].cf
  const request = record.request
  // Ignore webfinger redirect for @llun.dev or @llun.me in mastodon
  if (request.uri.startsWith('/.well-known/webfinger')) {
    request.headers.host = [
      {
        key: 'Host',
        value: 'www.llun.me'
      }
    ]
    return request
  }
  if (request.headers.host && request.headers.host.length > 0) {
    const domain = request.headers.host[0].value
    if (domain !== 'www.llun.me') {
      return found(`https://www.llun.me${request.uri}`)
    }
  }

  return request
}
