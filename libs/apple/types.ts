interface Derivative {
  fileSize: number
  checksum: string
  width: number
  height: number
  state?: string
}

interface Media {
  batchGuid: string
  derivatives: {
    [key: string]: Derivative
  }
  contributorLastName: string
  batchDateCreated: string
  dateCreated: string
  contributorFirstName: string
  photoGuid: string
  contributorFullName: string
  caption: string
}

interface Image extends Media {
  width: number
  height: number
}

export type VideoPosterDerivative = 'PosterFrame'

interface Video extends Media {
  mediaAssetType: 'video'
}

type Photo = Video | Image

export interface Stream {
  userLastName: string
  streamCtag: string
  itemsReturned: number
  userFirstName: string
  streamName: string
  photos: Photo[]
}
