import type { MarkdownIt, Token } from 'markdown-it'

import { IMAGE_EXTENSIONS, getImage, largestVariant, toSrcSet } from './images'

export interface AbsolutePathConfig {
  rootURL?: string | null
  // Folder of the content under public/ (e.g. posts/dev/2021-08-08-DSM7-vhost),
  // used to find the responsive copies written by scripts/optimize-images.ts
  publicPath?: string | null
}

// Images fill the content column, at most 62rem wide
const IMAGE_SIZES = '(min-width: 64rem) 62rem, 100vw'

function getAllTokens(tokens: Token[], type: string): Token[] {
  const found: Token[] = []
  for (const token of tokens) {
    if (token.type === type) found.push(token)
    if (token.children) {
      found.push(...getAllTokens(token.children, type))
    }
  }
  return found
}

function isRelativePath(src: string) {
  return !(
    /^[a-z][a-z0-9+.-]*:/i.test(src) ||
    src.startsWith('/') ||
    src.startsWith('#')
  )
}

const MarkdownItAbsolutePath = (md: MarkdownIt, opt?: AbsolutePathConfig) => {
  md.core.ruler.push('absolute_image', (state) => {
    if (!opt) return

    // Skip if rootURL is not set
    if (!opt.rootURL) return
    const rootURL = opt.rootURL
    const origin = new URL(rootURL).origin
    const findImage = (source: string) =>
      opt.publicPath ? getImage(`${opt.publicPath}/${source}`) : null

    const imageTokens = getAllTokens(state.tokens, 'image')
    imageTokens.forEach((imageToken, index) => {
      const source = imageToken.attrGet('src')
      if (typeof source !== 'string') return
      // Only the first image can be in view when the page opens
      imageToken.attrSet('loading', index === 0 ? 'eager' : 'lazy')
      imageToken.attrSet('decoding', 'async')
      if (!isRelativePath(source)) return

      const image = findImage(source)
      if (!image) {
        imageToken.attrSet('src', `${rootURL}/${source}`)
        return
      }
      const largest = largestVariant(image)
      imageToken.attrSet('src', `${origin}${largest.src}`)
      imageToken.attrSet('srcset', toSrcSet(image, origin))
      imageToken.attrSet('sizes', IMAGE_SIZES)
      imageToken.attrSet('width', `${largest.width}`)
      imageToken.attrSet('height', `${largest.height}`)
    })

    // [![](route.png)](route-full.png): the full-size link opens the largest
    // WebP copy instead of the original, which can be several megabytes
    for (const linkToken of getAllTokens(state.tokens, 'link_open')) {
      const href = linkToken.attrGet('href')
      if (
        typeof href !== 'string' ||
        !isRelativePath(href) ||
        !IMAGE_EXTENSIONS.test(href)
      ) {
        continue
      }
      const image = findImage(href)
      linkToken.attrSet(
        'href',
        image ? `${origin}${largestVariant(image).src}` : `${rootURL}/${href}`
      )
    }
  })
}
export default MarkdownItAbsolutePath
