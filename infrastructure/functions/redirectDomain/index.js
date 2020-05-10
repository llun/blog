exports.entry = async function (event, context) {
  const response = event.Records[0].cf.response
  return response
}
