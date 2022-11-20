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
      value: 'm.llun.dev'
    }
  ]
  return request
}
