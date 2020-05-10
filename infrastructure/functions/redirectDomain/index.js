// @ts-check
exports.entry = async function (event, context) {
  console.log(JSON.stringify(event))
  const response = event.Records[0].cf.response
  return response
}
