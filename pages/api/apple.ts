import { NextApiHandler } from 'next'
import { fetchAssetsUrl } from '../../libs/apple/webstream'

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
  const response = await fetchAssetsUrl(body.streamId, body.photoGuids)
  return res.status(200).json(response)
}

export default handle
