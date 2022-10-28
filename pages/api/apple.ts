import { NextApiHandler } from 'next'
import { fetchAssetsUrl } from '../../libs/apple/webstream'
import { NETHERLANDS_STREAM_ID } from '../tags/ride/netherlands'
import { SINGAPORE_STREAM_ID } from '../tags/ride/singapore'

const ALLOW_STREAM_IDS = [NETHERLANDS_STREAM_ID, SINGAPORE_STREAM_ID]

export interface AssetsRequest {
  token: string
  photoGuids: string[]
}

const Headers =
  process.env.NODE_ENV === 'production'
    ? {
        'Access-Control-Allow-Origin': 'https://www.llun.me',
        'content-type': 'application/json'
      }
    : {
        'Access-Control-Allow-Origin': '*',
        'content-type': 'application/json'
      }

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Invalid' }), {
      status: 404,
      headers: Headers
    })
  }
  const body = JSON.parse(req.body) as AssetsRequest
  if (!ALLOW_STREAM_IDS.includes(body.token)) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: Headers
    })
  }

  const response = await fetchAssetsUrl(body.token, body.photoGuids)
  if (!response) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: Headers
    })
  }
  return new Response(JSON.stringify(response), {
    status: 200,
    headers: Headers
  })
}

export default handle

export const config = {
  runtime: 'experimental-edge'
}
