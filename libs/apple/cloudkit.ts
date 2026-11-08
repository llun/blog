import type { Media } from './media'
import { Assets, Video720p, VideoPosterDerivative } from './webstream'

/**
 * iCloud shared albums made after Apple moved them to photos.icloud.com
 * (links like https://photos.icloud.com/shared/album/0a96jkMunB-gI9iQ-A54WJZKQ/)
 * are CloudKit zones in the com.apple.photos.cloud container. They can be read
 * without signing in:
 *
 * 1. `public/records/resolve` with the album key returns an anonymous access
 *    token (valid for 20 minutes), the database partition and the album zone.
 * 2. `shared/records/query` and `shared/records/lookup` on that partition,
 *    with the token, return the album's CPLAsset and CPLMaster records. Their
 *    resource fields carry download URLs that expire after about an hour.
 */

const CloudKitHost = 'https://ckdatabasews.icloud.com'
const CloudKitDatabase = 'database/1/com.apple.photos.cloud/production'
const AlbumQueryRecordType =
  'CPLAssetAndMasterByAssetDateWithoutHiddenOrDeleted'
const QueryPageSize = 100
const MaxQueryPages = 100
export const MaxLookupRecords = 200

// Old sharedstreams tokens (www.icloud.com/sharedalbum/#B2GGPCdxkGnUx1C) are
// 14-15 base62 characters. CloudKit album keys are 25 characters and may
// contain `-` or `_`.
const CloudKitAlbumTokenPattern = /^[0-9A-Za-z_-]{20,40}$/
// CPLAsset names are UUIDs, CPLMaster names are base64 fingerprints
const RecordNamePattern = /^[0-9A-Za-z+/=_-]{1,64}$/

const VideoItemTypes = new Set([
  'com.apple.quicktime-movie',
  'public.mpeg-4',
  'public.movie',
  'com.apple.m4v-video'
])

const PhotoThumbnail = 'resJPEGThumbRes'
const PhotoMedium = 'resJPEGMedRes'
const VideoSources = ['resVidMedRes', 'resVidSmallRes', 'resVidLargeRes']

export const isCloudKitAlbumToken = (token: unknown): token is string =>
  typeof token === 'string' && CloudKitAlbumTokenPattern.test(token)

export const isCloudKitRecordName = (name: unknown): name is string =>
  typeof name === 'string' && RecordNamePattern.test(name)

interface ZoneID {
  zoneName: string
  ownerRecordName: string
  zoneType?: string
}

interface CloudKitField {
  value: unknown
  type?: string
}

interface CloudKitRecord {
  recordName: string
  recordType: string
  fields?: Record<string, CloudKitField>
}

interface ResourceValue {
  downloadURL?: string
  size?: number
}

interface AlbumAccess {
  key: string
  partitionUrl: string
  partition: number
  accessToken: string
  zoneID: ZoneID
}

export interface CloudKitAlbum {
  partition: number
  medias: Media[]
}

const getFieldValue = <T>(
  record: CloudKitRecord | undefined,
  field: string
): T | undefined => record?.fields?.[field]?.value as T | undefined

const getResource = (record: CloudKitRecord | undefined, field: string) => {
  const resource = getFieldValue<ResourceValue>(record, field)
  if (!resource || typeof resource.downloadURL !== 'string') return null
  return resource
}

const post = async (url: string, body: unknown) => {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' },
    body: JSON.stringify(body)
  })
  if (response.status !== 200) {
    const text = await response.text().catch(() => '')
    console.warn(
      `CloudKit request failed (${response.status}) ${new URL(url).pathname}: ${text.slice(0, 300)}`
    )
    return null
  }
  return response.json()
}

async function resolveAlbum(key: string): Promise<AlbumAccess | null> {
  const data = await post(
    `${CloudKitHost}/${CloudKitDatabase}/public/records/resolve?sharing_url_key=${encodeURIComponent(key)}`,
    { shortGUIDs: [{ value: key }] }
  )
  const result = data?.results?.[0]
  const access = result?.anonymousPublicAccess
  if (!access?.token || !access?.databasePartition || !result?.zoneID) {
    return null
  }

  const partitionUrl = new URL(access.databasePartition)
  if (!partitionUrl.hostname.endsWith('.icloud.com')) return null
  return {
    key,
    partitionUrl: `https://${partitionUrl.hostname}`,
    partition: Number(access.resolvedPartitionNumber ?? 0),
    accessToken: access.token,
    zoneID: result.zoneID
  }
}

const getRecordsUrl = (access: AlbumAccess, action: 'query' | 'lookup') =>
  `${access.partitionUrl}/${CloudKitDatabase}/shared/records/${action}?sharing_url_key=${encodeURIComponent(access.key)}&publicAccessAuthToken=${encodeURIComponent(access.accessToken)}`

async function queryAllRecords(access: AlbumAccess) {
  const records: CloudKitRecord[] = []
  let startRank = 0
  for (let page = 0; page < MaxQueryPages; page++) {
    const data = await post(getRecordsUrl(access, 'query'), {
      query: {
        recordType: AlbumQueryRecordType,
        filterBy: [
          {
            fieldName: 'startRank',
            comparator: 'EQUALS',
            fieldValue: { type: 'INT64', value: startRank }
          },
          {
            fieldName: 'direction',
            comparator: 'EQUALS',
            fieldValue: { type: 'STRING', value: 'ASCENDING' }
          }
        ]
      },
      resultsLimit: QueryPageSize,
      zoneID: access.zoneID
    })
    if (!data) return null

    const pageRecords: CloudKitRecord[] = data.records ?? []
    records.push(...pageRecords)
    const assets = pageRecords.filter(
      (record) => record.recordType === 'CPLAsset'
    ).length
    if (!assets) break
    startRank += assets
  }
  return records
}

/**
 * An edited photo keeps its rendered resources on the CPLAsset record and the
 * untouched original on CPLMaster, so prefer the asset's copy when it has one.
 * The derivative checksum is `<record name>:<field>` so the API route can look
 * the record up again later for fresh URLs.
 */
const getDerivative = (
  asset: CloudKitRecord,
  master: CloudKitRecord,
  field: string
) => {
  const record = getResource(asset, field) ? asset : master
  if (!getResource(record, field)) return null
  return { record, checksum: `${record.recordName}:${field}` }
}

function toMedia(asset: CloudKitRecord, master: CloudKitRecord): Media | null {
  const createdAt =
    getFieldValue<number>(asset, 'assetDate') ??
    getFieldValue<number>(master, 'originalCreationDate') ??
    0
  const thumbnail = getDerivative(asset, master, PhotoThumbnail)
  const medium = getDerivative(asset, master, PhotoMedium)
  if (!medium) return null

  // JPEG derivatives are already rotated, so their size is the display size
  const width = getFieldValue<number>(medium.record, 'resJPEGMedWidth') ?? 0
  const height = getFieldValue<number>(medium.record, 'resJPEGMedHeight') ?? 0
  const itemType = getFieldValue<string>(master, 'itemType') ?? ''

  if (VideoItemTypes.has(itemType)) {
    const video = VideoSources.map((field) =>
      getDerivative(asset, master, field)
    ).find((derivative) => derivative !== null)
    if (!video) return null
    return {
      createdAt,
      type: 'video',
      width,
      height,
      caption: '',
      derivatives: {
        [VideoPosterDerivative]: { checksum: medium.checksum },
        [Video720p]: { checksum: video.checksum }
      },
      guid: asset.recordName
    }
  }

  // Order matters: the grid shows the first derivative and the modal the second
  return {
    createdAt,
    type: 'photo',
    width,
    height,
    caption: '',
    derivatives: {
      thumbnail: { checksum: (thumbnail ?? medium).checksum },
      medium: { checksum: medium.checksum }
    },
    guid: asset.recordName
  }
}

/**
 * Fetch all media in a photos.icloud.com shared album
 *
 * @param key album key, the path segment after /shared/album/ e.g.
 *  https://photos.icloud.com/shared/album/0a96jkMunB-gI9iQ-A54WJZKQ/ key is
 *  0a96jkMunB-gI9iQ-A54WJZKQ
 */
export async function fetchCloudKitAlbum(
  key: string
): Promise<CloudKitAlbum | null> {
  if (!isCloudKitAlbumToken(key)) return null
  const access = await resolveAlbum(key)
  if (!access) return null

  const records = await queryAllRecords(access)
  if (!records) return null

  const masters = new Map(
    records
      .filter((record) => record.recordType === 'CPLMaster')
      .map((record) => [record.recordName, record])
  )
  const medias = records
    .filter((record) => record.recordType === 'CPLAsset')
    .map((asset) => {
      const masterName = getFieldValue<{ recordName: string }>(
        asset,
        'masterRef'
      )?.recordName
      const master = masterName ? masters.get(masterName) : undefined
      return master ? toMedia(asset, master) : null
    })
    .filter((media): media is Media => media !== null)
  return { partition: access.partition, medias }
}

/**
 * Resource URLs carry a `${f}` placeholder for the file name. Any name works;
 * the iCloud web app uses the resource's type, e.g. public.jpeg.
 */
const getDownloadUrl = (record: CloudKitRecord, field: string) => {
  const resource = getResource(record, field)
  if (!resource?.downloadURL) return null
  const fileTypeField = field.replace(/Res$/, 'FileType')
  const fileType = getFieldValue<string>(record, fileTypeField) ?? 'file'
  try {
    const url = new URL(
      resource.downloadURL.replace('${f}', encodeURIComponent(fileType))
    )
    if (url.protocol !== 'https:') return null
    return url
  } catch {
    return null
  }
}

/**
 * Look up fresh download URLs for album records, in the same shape as the
 * sharedstreams webasseturls response so the client merges both the same way.
 * Items are keyed by derivative checksum (`<record name>:<field>`).
 */
export async function fetchCloudKitAssets(
  key: string,
  recordNames: string[]
): Promise<Assets | null> {
  if (!isCloudKitAlbumToken(key)) return null
  const names = [...new Set(recordNames)].filter(isCloudKitRecordName)
  if (!names.length || names.length > MaxLookupRecords) return null

  const access = await resolveAlbum(key)
  if (!access) return null

  const data = await post(getRecordsUrl(access, 'lookup'), {
    records: names.map((recordName) => ({ recordName })),
    zoneID: access.zoneID
  })
  if (!data) return null

  const assets: Assets = { items: {}, locations: {} }
  for (const record of (data.records ?? []) as CloudKitRecord[]) {
    if (!record.recordName || !record.fields) continue
    for (const field of Object.keys(record.fields)) {
      if (!/^res.+Res$/.test(field)) continue
      const url = getDownloadUrl(record, field)
      if (!url) continue

      const expiry = Number(url.searchParams.get('e'))
      assets.locations[url.host] = { hosts: [url.host], scheme: 'https' }
      assets.items[`${record.recordName}:${field}`] = {
        url_expiry: Number.isFinite(expiry)
          ? new Date(expiry * 1000).toISOString()
          : '',
        url_location: url.host,
        url_path: `${url.pathname}${url.search}`
      }
    }
  }
  return assets
}

/**
 * Record names the API needs to look up for these medias' derivatives
 */
export const getCloudKitRecordNames = (medias: Media[]) => [
  ...new Set(
    medias.flatMap((media) =>
      Object.values(media.derivatives).map(
        ({ checksum }) => checksum.split(':')[0]
      )
    )
  )
]
