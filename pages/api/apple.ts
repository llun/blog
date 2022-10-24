import { NextApiHandler } from 'next'
import { fetchAssetsUrl } from '../../libs/apple/webstream'
import { NETHERLANDS_STREAM_ID } from '../tags/ride/netherlands'
import { SINGAPORE_STREAM_ID } from '../tags/ride/singapore'

const ALLOW_STREAM_IDS = [NETHERLANDS_STREAM_ID, SINGAPORE_STREAM_ID]

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

  const response = await fetchAssetsUrl(body.streamId, body.photoGuids)
  if (!response) {
    return res.status(404).json({ error: 'Not Found' })
  }
  return res.status(200).json(response)
}

export default handle
