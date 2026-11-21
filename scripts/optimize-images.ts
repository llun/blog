// Writes responsive WebP copies (640/1280/2000 px wide, never wider than the
// original) and a 1200 px JPEG social card for every content image under
// public/posts, public/tags and public/img, plus .cache/image-manifest.json
// with their sizes. The markdown renderer and page metadata read the manifest,
// so a new image in a post is resized and served as WebP without any manual
// step. Copies whose source hash is unchanged since the last run are kept, so
// reruns (and CI runs with public/_img restored from cache) are cheap.
import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import sharp from 'sharp'

import {
  IMAGE_EXTENSIONS,
  IMAGE_SOURCE_DIRS,
  IMAGE_WIDTHS,
  ImageEntry,
  ImageManifest,
  ImageVariant,
  OG_IMAGE_WIDTH,
  OPTIMIZED_DIR,
  getManifestPath
} from '../libs/images'

const PUBLIC_DIR = path.join(process.cwd(), 'public')
const OUTPUT_DIR = path.join(PUBLIC_DIR, OPTIMIZED_DIR)
const CONCURRENCY = 4
// Copies over this size are encoded again at a lower quality
const MAX_BYTES = 300 * 1024
const WEBP_QUALITIES = [78, 68, 58, 48, 40]
// Part of each image's hash: bump it when the encoding settings change so
// every copy is written again
const ENCODING_VERSION = '1'

const walk = (dir: string): string[] => {
  if (!fs.existsSync(dir)) return []
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) return walk(full)
    return IMAGE_EXTENSIONS.test(entry.name) ? [full] : []
  })
}

const readPreviousManifest = (): ImageManifest => {
  try {
    return JSON.parse(fs.readFileSync(getManifestPath(), 'utf8'))
  } catch {
    return {}
  }
}
const previousManifest = readPreviousManifest()

const toSitePath = (file: string) =>
  '/' + path.relative(PUBLIC_DIR, file).split(path.sep).join('/')

const scaledHeight = (width: number, height: number, target: number) =>
  Math.round((height * target) / width)

const optimize = async (source: string): Promise<[string, ImageEntry]> => {
  const key = path.relative(PUBLIC_DIR, source).split(path.sep).join('/')
  const outDir = path.join(OUTPUT_DIR, key)
  fs.mkdirSync(outDir, { recursive: true })
  const hash = crypto
    .createHash('sha1')
    .update(ENCODING_VERSION)
    .update(fs.readFileSync(source))
    .digest('hex')
  const previous = previousManifest[key]
  const isFresh = (output: string) =>
    previous?.hash === hash && fs.existsSync(output)

  // EXIF orientation is applied, so the stored width/height match the copies
  const meta = await sharp(source).rotate().metadata()
  const rotated = (meta.orientation ?? 1) >= 5
  const width = (rotated ? meta.height : meta.width) ?? 0
  const height = (rotated ? meta.width : meta.height) ?? 0

  const widths = [
    ...new Set(IMAGE_WIDTHS.map((target) => Math.min(target, width)))
  ].sort((a, b) => a - b)

  const variants: ImageVariant[] = []
  for (const target of widths) {
    const output = path.join(outDir, `${target}.webp`)
    if (!isFresh(output)) {
      const resized = sharp(source)
        .rotate()
        .resize({ width: target, withoutEnlargement: true })
      let buffer = Buffer.alloc(0)
      for (const quality of WEBP_QUALITIES) {
        buffer = await resized.clone().webp({ quality, effort: 5 }).toBuffer()
        if (buffer.length <= MAX_BYTES) break
      }
      fs.writeFileSync(output, buffer)
    }
    variants.push({
      src: toSitePath(output),
      width: target,
      height: scaledHeight(width, height, target)
    })
  }

  const ogWidth = Math.min(OG_IMAGE_WIDTH, width)
  const ogOutput = path.join(outDir, 'og.jpg')
  if (!isFresh(ogOutput)) {
    await sharp(source)
      .rotate()
      .resize({ width: ogWidth, withoutEnlargement: true })
      .flatten({ background: '#ffffff' })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(ogOutput)
  }

  return [
    key,
    {
      hash,
      width,
      height,
      variants,
      og: {
        src: toSitePath(ogOutput),
        width: ogWidth,
        height: scaledHeight(width, height, ogWidth)
      }
    }
  ]
}

const main = async () => {
  const sources = IMAGE_SOURCE_DIRS.flatMap((dir) =>
    walk(path.join(PUBLIC_DIR, dir))
  ).sort()
  const manifest: ImageManifest = {}
  const failures: string[] = []
  let next = 0
  const worker = async () => {
    while (next < sources.length) {
      const source = sources[next++]
      try {
        const [key, entry] = await optimize(source)
        manifest[key] = entry
      } catch (error) {
        failures.push(`${source}: ${(error as Error).message}`)
      }
    }
  }
  await Promise.all(Array.from({ length: CONCURRENCY }, worker))

  if (failures.length > 0) {
    console.error(`optimize-images: ${failures.length} image(s) failed`)
    for (const failure of failures) console.error(`  ${failure}`)
    process.exit(1)
  }

  const sorted = Object.fromEntries(
    Object.entries(manifest).sort(([a], [b]) => a.localeCompare(b))
  )
  fs.mkdirSync(path.dirname(getManifestPath()), { recursive: true })
  fs.writeFileSync(getManifestPath(), JSON.stringify(sorted, null, 2) + '\n')
  console.log(`optimize-images: ${sources.length} images ready in /_img`)
}

main()
