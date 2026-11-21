import fs from 'fs'
import memoize from 'lodash/memoize.js'
import path from 'path'

/**
 * Responsive copies of the content images under public/ (posts, ride tags,
 * site images), written by scripts/optimize-images.ts before the build.
 * Pages and feeds read the manifest to point at the small WebP copies instead
 * of the multi-megabyte originals.
 */

// Folders under public/ whose images get responsive copies
export const IMAGE_SOURCE_DIRS = ['posts', 'tags', 'img']
// Widths of the WebP copies; an image never gets a copy wider than itself
export const IMAGE_WIDTHS = [640, 1280, 2000]
// Social cards are a JPEG, the format every Open Graph reader accepts
export const OG_IMAGE_WIDTH = 1200
// Generated copies live here, at /_img/<source path>/<width>.webp
export const OPTIMIZED_DIR = '_img'
export const IMAGE_EXTENSIONS = /\.(png|jpe?g|webp)$/i

export interface ImageVariant {
  // Site path, e.g. /_img/posts/2025-03-02-llm/cursor.png/1280.webp
  src: string
  width: number
  height: number
}

export interface ImageEntry {
  // sha1 of the source file, so unchanged images are not encoded again
  hash: string
  width: number
  height: number
  variants: ImageVariant[]
  og: ImageVariant
}

// Keyed by the source path under public/, e.g. posts/2025-03-02-llm/cursor.png
export type ImageManifest = Record<string, ImageEntry>

export const getManifestPath = () =>
  path.join(process.cwd(), '.cache', 'image-manifest.json')

export const getImageManifest = memoize((): ImageManifest => {
  try {
    return JSON.parse(fs.readFileSync(getManifestPath(), 'utf8'))
  } catch {
    // No manifest (e.g. `next dev` before `yarn images`): pages fall back to
    // the original files
    return {}
  }
})

/**
 * Looks up the responsive copies of an image.
 * @param publicPath - Path under public/, with or without the leading slash
 */
export const getImage = (publicPath: string): ImageEntry | null => {
  const key = decodeURIComponent(publicPath.replace(/^\/+/, ''))
  return getImageManifest()[key] ?? null
}

/** The largest copy, used as the img src and as the target of image links */
export const largestVariant = (entry: ImageEntry) =>
  entry.variants[entry.variants.length - 1]

export const toSrcSet = (entry: ImageEntry, origin = '') =>
  entry.variants
    .map((variant) => `${origin}${variant.src} ${variant.width}w`)
    .join(', ')
