// @ts-check
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

exports.entry = async function (event, context) {
  const record = event.Records[0].cf
  const request = record.request
  if (request.headers.host && request.headers.host.length > 0) {
    const domain = request.headers.host[0].value
    if (domain.endsWith('llun.bike')) {
      return found('https://www.llun.me/tags/ride/')
    }
    if (domain.endsWith('llun.dev')) {
      return found('https://www.llun.me/tags/dev/')
    }
    if (domain !== 'www.llun.me') {
      return found(`https://www.llun.me${request.uri}`)
    }
  }

  return request
}
