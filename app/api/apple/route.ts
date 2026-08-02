import { type NextRequest } from 'next/server'

import { fetchAssetsUrl } from '../../../libs/apple/webstream'
import { ALLOW_ORIGINS, ALLOW_TOKEN_IDS } from '../../../libs/config'

export interface AssetsRequest {
  partition: number
  token: string
  photoGuids: string[]
}

const getHeaders = (request: NextRequest) => {
  if (process.env.NODE_ENV !== 'production') {
    return {
      'Access-Control-Allow-Origin': '*',
      Vary: 'Origin',
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate=30'
    }
  }

  const origin = request.headers.get('origin') ?? ''
  if (!ALLOW_ORIGINS.includes(origin)) {
    return {
      'Access-Control-Allow-Origin': 'https://www.llun.me',
      Vary: 'Origin',
      'Content-Type': 'application/json',
      'Cache-Control': 's-maxage=1, stale-while-revalidate=30'
    }
  }

  return {
    'Access-Control-Allow-Origin': origin,
    Vary: 'Origin',
    'Content-Type': 'application/json',
    'Cache-Control': 's-maxage=3600, stale-while-revalidate=3600'
  }
}

const ParseError = Symbol('ParseError')

const parseBody = async (request: NextRequest) => {
  try {
    return (await request.json()) as AssetsRequest
  } catch {
    return ParseError
  }
}

export async function POST(request: NextRequest) {
  const headers = getHeaders(request)

  const body = await parseBody(request)
  if (body === ParseError) {
    return new Response(JSON.stringify({ error: 'Bad Request' }), {
      status: 400,
      headers
    })
  }

  if (!ALLOW_TOKEN_IDS.includes(body?.token)) {
    return new Response(JSON.stringify({ error: 'Not Found' }), {
      status: 404,
      headers
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
      headers
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
    headers
  })
}
