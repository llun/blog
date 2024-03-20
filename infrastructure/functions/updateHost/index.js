// @ts-check
/**
 *
 * @param {import('aws-lambda').CloudFrontRequestEvent} event
 */
exports.entry = async function (event) {
  const record = event.Records[0].cf
  const request = record.request
  request.headers.host = [
    {
      key: 'Host',
      value: 'cloudrun.llun.social'
    }
  ]
  request.headers['x-activity-next-host'] = [
    {
      key: 'X-Activity-Next-Host',
      value: 'llun.dev'
    }
  ]
  request.headers['x-forwarded-host'] = [
    {
      key: 'X-Forwarded-Host',
      value: 'llun.dev'
    }
  ]
  return request
}
