import { type NextRequest } from 'next/server'

import { fetchAssetsUrl } from '../../../libs/apple/webstream'
import { ALLOW_TOKEN_IDS } from '../../../libs/config'

export interface AssetsRequest {
  partition: number
  token: string
  photoGuids: string[]
}

const HEADERS =
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

export async function POST(request: NextRequest) {
  const body = (await request.json()) as AssetsRequest

  // if (!ALLOW_ORIGINS.includes(request.headers.get('origin') ?? '')) {
  //   return new Response(JSON.stringify({ error: 'Not Found' }), {
  //     status: 404,
  //     headers: HEADERS
  //   })
  // }

  console.log('Origin = ', request.headers.get('origin') ?? '')

  if (!ALLOW_TOKEN_IDS.includes(body.token)) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: HEADERS
    })
  }

  const response = await fetchAssetsUrl(
    body.partition,
    body.token,
    body.photoGuids
  )
  if (!response || !response.body) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers: HEADERS
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
    headers: HEADERS
  })
}
