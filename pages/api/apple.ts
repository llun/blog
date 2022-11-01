import { fetchAssetsUrl } from '../../libs/apple/webstream'
import { ALLOW_TOKEN_IDS } from '../../libs/config'

export interface AssetsRequest {
  token: string
  photoGuids: string[]
}

const Headers =
  process.env.NODE_ENV === 'production'
    ? {
        'Access-Control-Allow-Origin': 'https://www.llun.me',
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=3600'
      }
    : {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
        'Cache-Control': 's-maxage=1, stale-while-revalidate=30'
      }

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const handle = async (req: any) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Invalid' }), {
      status: 404,
      headers: Headers
    })
  }
  const body = (await req.json()) as AssetsRequest
  if (!ALLOW_TOKEN_IDS.includes(body.token)) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: Headers
    })
  }

  const response = await fetchAssetsUrl(body.token, body.photoGuids)
  if (!response || !response.body) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: Headers
    })
  }

  const reader = response.body.getReader()
  const readable = new ReadableStream({
    start(controller) {
      return pump()
      function pump() {
        return reader.read().then(({ done, value }) => {
          // When no more data needs to be consumed, close the stream
          if (done) {
            controller.close()
            return
          }
          // Enqueue the next data chunk into our target stream
          controller.enqueue(value)
          return pump()
        })
      }
    }
  })

  return new Response(readable, {
    status: 200,
    headers: Headers
  })
}

export default handle

export const config = {
  runtime: 'experimental-edge'
}
