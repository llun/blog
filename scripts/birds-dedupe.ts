/**
 * Hides duplicate photos (camera bursts and exact copies) from the bird
 * albums on the blog. Nothing in Google Photos changes: the build reads
 * contents/galleries-hidden/<slug>.json and leaves those photo ids out.
 *
 *   yarn birds:dedupe group <slug...>|--all
 *     Fetches each album, groups look-alike frames and writes one numbered
 *     sheet per group to .cache/birds-dedupe/<slug>/ for the models to judge.
 *
 *   yarn birds:dedupe apply <slug> <votes.json...>
 *     Each votes file is {"<group>": "<letter>"} from one model. The majority
 *     pick of each group stays, the rest of the group is hidden. Ids in the
 *     album's `keep` list are never hidden. A three-way split goes to the
 *     first votes file, so list the most careful judge first.
 *
 *   yarn birds:dedupe blur <slug...>|--all
 *     Writes every visible photo not checked before to
 *     .cache/birds-dedupe/<slug>/blur/NNN.jpg for the models to judge.
 *
 *   yarn birds:dedupe apply-blur <slug> <votes.json...>
 *     Each votes file is a list of photo numbers one model found blurry. A
 *     photo most models flag is hidden, unless that would leave the album
 *     with fewer than MinVisible photos.
 */
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import { fetchGooglePhotosAlbum } from '../libs/google/photos'

const Root = process.cwd()
const Galleries = path.join(Root, 'contents', 'galleries')
const HiddenDir = path.join(Root, 'contents', 'galleries-hidden')
const CacheDir = path.join(Root, '.cache', 'birds-dedupe')

// Frames this close (Hamming distance of a 64-bit dHash) and this close in
// time are the same shot. Different shots measured 11-16 apart.
const MaxDistance = 6
const MaxGapMs = 4000
const Concurrency = 6
const TileSize = 640
const Columns = 3
// Full frames next to each sheet, for zooming in on small birds
const FrameSize = 1600
const Letters = 'abcdefghijklmnopqrstuvwxyz'
const MinVisible = 5

interface Photo {
  id: string
  url: string
  createdAt: number
  width: number
  height: number
  hash: string
  sharpness: number
}

interface Group {
  number: number
  ids: string[]
}

export interface HiddenList {
  hidden: string[]
  keep: string[]
}

export const distance = (a: string, b: string) => {
  let x = BigInt(`0x${a}`) ^ BigInt(`0x${b}`)
  let count = 0
  while (x) {
    count += Number(x & 1n)
    x >>= 1n
  }
  return count
}

/**
 * Walk frames in time order and compare each to its group's first frame, not
 * its neighbour, so a slowly changing burst can't chain into one group.
 * Exact copies carry the same capture time, so they land next to each other.
 */
export const groupPhotos = (photos: Photo[]): string[][] => {
  const sorted = [...photos].sort((a, b) => a.createdAt - b.createdAt)
  const groups: Photo[][] = []
  for (const photo of sorted) {
    const last = groups[groups.length - 1]
    if (
      last &&
      photo.createdAt - last[last.length - 1].createdAt <= MaxGapMs &&
      distance(last[0].hash, photo.hash) <= MaxDistance
    ) {
      last.push(photo)
    } else {
      groups.push([photo])
    }
  }
  return groups.map((group) => group.map((photo) => photo.id))
}

const baseUrl = (url: string) => url.replace(/=w\d+-h\d+$/, '')

const download = async (url: string) => {
  for (let attempt = 0; ; attempt++) {
    const response = await fetch(url)
    if (response.ok) return Buffer.from(await response.arrayBuffer())
    if (attempt >= 3) throw new Error(`${response.status} for ${url}`)
    await new Promise((resolve) => setTimeout(resolve, 2000 * 2 ** attempt))
  }
}

const analyse = async (url: string) => {
  const image = await download(`${baseUrl(url)}=w512-h512`)
  const pixels = await sharp(image)
    .grayscale()
    .resize(9, 8, { fit: 'fill' })
    .raw()
    .toBuffer()
  let hash = 0n
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      hash =
        (hash << 1n) | (pixels[y * 9 + x] > pixels[y * 9 + x + 1] ? 1n : 0n)
    }
  }
  // Variance of the Laplacian: only used to order frames on the sheet
  const { data, info } = await sharp(image)
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const { width, height } = info
  let sum = 0
  let squares = 0
  let count = 0
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const i = y * width + x
      const value =
        4 * data[i] -
        data[i - 1] -
        data[i + 1] -
        data[i - width] -
        data[i + width]
      sum += value
      squares += value * value
      count++
    }
  }
  return {
    hash: hash.toString(16).padStart(16, '0'),
    sharpness: Math.round(squares / count - (sum / count) ** 2)
  }
}

const readToken = (slug: string) => {
  const file = path.join(Galleries, `${slug}.md`)
  const text = fs.readFileSync(file, 'utf8')
  if (!/^section:\s*birds\s*$/m.test(text))
    throw new Error(`${slug} is not a bird album`)
  const token = text.match(/^token:\s*['"]?([^'"\n]+)/m)?.[1]
  if (!token) throw new Error(`${slug} has no token`)
  return token
}

export const readHidden = (slug: string): HiddenList => {
  const file = path.join(HiddenDir, `${slug}.json`)
  if (!fs.existsSync(file)) return { hidden: [], keep: [] }
  const list = JSON.parse(fs.readFileSync(file, 'utf8'))
  return { hidden: list.hidden ?? [], keep: list.keep ?? [] }
}

const loadPhotos = async (slug: string): Promise<Photo[]> => {
  const medias = await fetchGooglePhotosAlbum(readToken(slug))
  // A partial album would make new decisions from half the photos
  if (!medias || medias.length === 0) throw new Error(`Could not fetch ${slug}`)

  const cacheFile = path.join(CacheDir, slug, 'photos.json')
  const cached: Record<string, Photo> = fs.existsSync(cacheFile)
    ? JSON.parse(fs.readFileSync(cacheFile, 'utf8'))
    : {}
  const photos: Photo[] = []
  for (let i = 0; i < medias.length; i += Concurrency) {
    const batch = medias.slice(i, i + Concurrency)
    photos.push(
      ...(await Promise.all(
        batch.map(async (media) => {
          const url = baseUrl(media.derivatives.large.url ?? '')
          const hit = cached[media.guid]
          if (hit) return { ...hit, url, createdAt: media.createdAt }
          return {
            id: media.guid,
            url,
            createdAt: media.createdAt,
            width: media.width,
            height: media.height,
            ...(await analyse(url))
          }
        })
      ))
    )
  }
  fs.mkdirSync(path.dirname(cacheFile), { recursive: true })
  fs.writeFileSync(
    cacheFile,
    JSON.stringify(Object.fromEntries(photos.map((photo) => [photo.id, photo])))
  )
  return photos
}

const writeSheet = async (file: string, photos: Photo[]) => {
  const rows = Math.ceil(photos.length / Columns)
  const tiles = await Promise.all(
    photos.map(async (photo, index) => {
      const image = await sharp(
        await download(`${photo.url}=w${TileSize}-h${TileSize}`)
      )
        .resize(TileSize - 8, TileSize - 8, {
          fit: 'contain',
          background: '#ffffff'
        })
        .extend({ top: 4, bottom: 4, left: 4, right: 4, background: '#ffffff' })
        .png()
        .toBuffer()
      const label = Buffer.from(
        `<svg width="44" height="44"><rect width="44" height="44" rx="6" fill="black" opacity="0.75"/><text x="22" y="31" font-size="28" text-anchor="middle" fill="white" font-family="Helvetica">${Letters[index]}</text></svg>`
      )
      const left = (index % Columns) * TileSize
      const top = Math.floor(index / Columns) * TileSize
      return [
        { input: image, left, top },
        { input: label, left: left + 8, top: top + 8 }
      ]
    })
  )
  await sharp({
    create: {
      width: Math.min(photos.length, Columns) * TileSize,
      height: rows * TileSize,
      channels: 3,
      background: '#ffffff'
    }
  })
    .composite(tiles.flat())
    .jpeg({ quality: 88 })
    .toFile(file)
}

const group = async (slug: string) => {
  const photos = await loadPhotos(slug)
  const byId = new Map(photos.map((photo) => [photo.id, photo]))
  const { hidden, keep } = readHidden(slug)
  const dir = path.join(CacheDir, slug)
  for (const file of fs.readdirSync(dir)) {
    if (file.startsWith('group-'))
      fs.rmSync(path.join(dir, file), { recursive: true })
  }

  const groups: Group[] = []
  for (const ids of groupPhotos(photos)) {
    if (ids.length < 2) continue
    // Sheets hold at most 26 frames; a longer burst is split, sharpest first
    // Earlier runs already settled hidden frames; a group only needs a vote
    // again when a new upload joins its kept photo
    const ordered = ids
      .filter((id) => !hidden.includes(id))
      .map((id) => byId.get(id)!)
      .sort((a, b) => b.sharpness - a.sharpness)
    for (let i = 0; i < ordered.length; i += Letters.length) {
      const chunk = ordered.slice(i, i + Letters.length)
      if (chunk.length < 2) continue
      // A group already holding a photo from the keep list needs no vote
      if (chunk.some((photo) => keep.includes(photo.id))) continue
      const number = groups.length + 1
      groups.push({ number, ids: chunk.map((photo) => photo.id) })
      const name = path.join(dir, `group-${String(number).padStart(3, '0')}`)
      await writeSheet(`${name}.jpg`, chunk)
      fs.mkdirSync(name)
      await Promise.all(
        chunk.map(async (photo, index) =>
          fs.promises.writeFile(
            path.join(name, `${Letters[index]}.jpg`),
            await download(`${photo.url}=w${FrameSize}-h${FrameSize}`)
          )
        )
      )
    }
  }
  fs.writeFileSync(
    path.join(dir, 'groups.json'),
    JSON.stringify(groups, null, 2)
  )
  const toHide = groups.reduce((total, { ids }) => total + ids.length - 1, 0)
  console.log(
    `${slug}: ${photos.length} photos, ${groups.length} groups to vote on, ${photos.length - hidden.length - toHide} would stay`
  )
}

/** The letter most models picked. */
export const pickWinner = (letters: string[]) => {
  const counts = new Map<string, number>()
  for (const letter of letters)
    counts.set(letter, (counts.get(letter) ?? 0) + 1)
  const top = Math.max(...counts.values())
  // Maps keep insertion order, so a split goes to the first votes file
  return [...counts].find(([, count]) => count === top)![0]
}

const apply = (slug: string, voteFiles: string[]) => {
  const dir = path.join(CacheDir, slug)
  const groups: Group[] = JSON.parse(
    fs.readFileSync(path.join(dir, 'groups.json'), 'utf8')
  )
  const votes: Record<string, string>[] = voteFiles.map((file) =>
    JSON.parse(fs.readFileSync(file, 'utf8'))
  )
  const { hidden: earlier, keep } = readHidden(slug)
  const hidden = new Set(earlier)
  const decisions: Record<string, string> = {}
  for (const { number, ids } of groups) {
    const letters = votes
      .map((vote) => vote[String(number)]?.trim().toLowerCase())
      .filter(
        (letter): letter is string =>
          !!letter &&
          Letters.indexOf(letter) >= 0 &&
          Letters.indexOf(letter) < ids.length
      )
    // No valid vote: leave the whole group visible
    if (letters.length === 0) continue
    const winner = pickWinner(letters)
    decisions[number] = winner
    ids.forEach((id, index) => {
      if (Letters[index] !== winner && !keep.includes(id)) hidden.add(id)
    })
  }
  fs.mkdirSync(HiddenDir, { recursive: true })
  fs.writeFileSync(
    path.join(HiddenDir, `${slug}.json`),
    `${JSON.stringify({ hidden: [...hidden].sort(), keep }, null, 2)}\n`
  )
  fs.writeFileSync(
    path.join(dir, 'decisions.json'),
    JSON.stringify(decisions, null, 2)
  )
  console.log(`${slug}: ${hidden.size} photos hidden`)
}

const blurCheckedFile = (slug: string) =>
  path.join(CacheDir, slug, 'blur-checked.json')

const readBlurChecked = (slug: string): string[] =>
  fs.existsSync(blurCheckedFile(slug))
    ? JSON.parse(fs.readFileSync(blurCheckedFile(slug), 'utf8'))
    : []

const blur = async (slug: string) => {
  const photos = await loadPhotos(slug)
  const { hidden } = readHidden(slug)
  const checked = readBlurChecked(slug)
  const dir = path.join(CacheDir, slug, 'blur')
  fs.rmSync(dir, { recursive: true, force: true })
  fs.mkdirSync(dir, { recursive: true })
  const todo = photos
    .filter(
      (photo) => !hidden.includes(photo.id) && !checked.includes(photo.id)
    )
    .map((photo, index) => ({
      number: index + 1,
      id: photo.id,
      url: photo.url
    }))
  for (let i = 0; i < todo.length; i += Concurrency) {
    await Promise.all(
      todo
        .slice(i, i + Concurrency)
        .map(async ({ number, url }) =>
          fs.promises.writeFile(
            path.join(dir, `${String(number).padStart(3, '0')}.jpg`),
            await download(`${url}=w${FrameSize}-h${FrameSize}`)
          )
        )
    )
  }
  fs.writeFileSync(
    path.join(dir, 'photos.json'),
    JSON.stringify(todo.map(({ number, id }) => ({ number, id })))
  )
  console.log(`${slug}: ${todo.length} photos to check for blur`)
}

/** Photo numbers flagged by more than half of the votes files. */
export const pickBlurry = (votes: number[][]) => {
  const counts = new Map<number, number>()
  for (const vote of votes)
    for (const number of new Set(vote))
      counts.set(number, (counts.get(number) ?? 0) + 1)
  return [...counts]
    .filter(([, count]) => count > votes.length / 2)
    .map(([number]) => number)
}

const applyBlur = (slug: string, voteFiles: string[]) => {
  const dir = path.join(CacheDir, slug, 'blur')
  const todo: { number: number; id: string }[] = JSON.parse(
    fs.readFileSync(path.join(dir, 'photos.json'), 'utf8')
  )
  const votes: number[][] = voteFiles.map((file) =>
    JSON.parse(fs.readFileSync(file, 'utf8')).map(Number)
  )
  const { hidden: earlier, keep } = readHidden(slug)
  const photos = JSON.parse(
    fs.readFileSync(path.join(CacheDir, slug, 'photos.json'), 'utf8')
  )
  const blurry = pickBlurry(votes)
    .map((number) => todo.find((photo) => photo.number === number)?.id)
    .filter((id): id is string => !!id && !keep.includes(id))
  const hidden = new Set([...earlier, ...blurry])
  if (Object.keys(photos).length - hidden.size < MinVisible) {
    console.log(
      `${slug}: hiding ${blurry.length} blurry photos would leave too few, skipped`
    )
    return
  }
  fs.writeFileSync(
    path.join(HiddenDir, `${slug}.json`),
    `${JSON.stringify({ hidden: [...hidden].sort(), keep }, null, 2)}\n`
  )
  fs.writeFileSync(
    blurCheckedFile(slug),
    JSON.stringify([...readBlurChecked(slug), ...todo.map(({ id }) => id)])
  )
  console.log(`${slug}: ${blurry.length} blurry photos hidden`)
}

const birdSlugs = () =>
  fs
    .readdirSync(Galleries)
    .filter((file) =>
      /^section:\s*birds\s*$/m.test(
        fs.readFileSync(path.join(Galleries, file), 'utf8')
      )
    )
    .map((file) => file.replace(/\.md$/, ''))

const main = async () => {
  const [command, ...args] = process.argv.slice(2)
  if (command === 'blur') {
    for (const slug of args[0] === '--all' ? birdSlugs() : args)
      await blur(slug)
  } else if (command === 'apply-blur' && args.length >= 2) {
    applyBlur(args[0], args.slice(1))
  } else if (command === 'group') {
    const slugs = args[0] === '--all' ? birdSlugs() : args
    for (const slug of slugs) await group(slug)
  } else if (command === 'apply' && args.length >= 2) {
    apply(args[0], args.slice(1))
  } else {
    console.log(
      'Usage: birds-dedupe group|blur <slug...>|--all, apply|apply-blur <slug> <votes.json...>'
    )
    process.exitCode = 1
  }
}

if (process.argv[1]?.endsWith('birds-dedupe.ts')) main()
