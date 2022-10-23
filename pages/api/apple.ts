import { NextApiHandler } from 'next'
import { Assets, fetchAssetsUrl } from '../../libs/apple/webstream'

const ALLOW_STREAM_IDS = ['B125ON9t3mbLNC']

let cache: Assets | null = null

export interface AssetsRequest {
  streamId: string
  photoGuids: string[]
}

const handle: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(400).json({ error: 'Invalid' })
  }

  if (process.env.NODE_ENV === 'production') {
    res.setHeader('Access-Control-Allow-Origin', 'https://www.llun.me')
  }

  const body = JSON.parse(req.body) as AssetsRequest
  if (!ALLOW_STREAM_IDS.includes(body.streamId)) {
    return res.status(404).json({ error: 'Not Found' })
  }

  if (cache) return cache
  const response = await fetchAssetsUrl(body.streamId, body.photoGuids)
  if (!response) {
    return res.status(404).json({ error: 'Not Found' })
  }
  cache = response
  return res.status(200).json(response)
}

export default handle
