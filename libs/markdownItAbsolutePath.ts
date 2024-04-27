import { PluginWithOptions } from 'markdown-it'
import Token from 'markdown-it/lib/token.mjs'

export interface AbsolutePathConfig {
  rootURL?: string | null
}

function getAllImageTokens(tokens: Token[]): Token[] {
  const images: Token[] = []
  for (const token of tokens) {
    if (token.type === 'image') images.push(token)
    if (token.children) {
      const children = getAllImageTokens(token.children)
      images.push(...children)
    }
  }
  return images
}

function isRelativePath(src: string) {
  return !(
    src.startsWith('http:') ||
    src.startsWith('https://') ||
    src.startsWith('/')
  )
}

const MarkdownItAbsolutePath: PluginWithOptions<AbsolutePathConfig> = (
  md,
  opt
) => {
  md.core.ruler.push('absolute_image', (state) => {
    if (!opt) return

    // Skip if rootURL is not set
    if (!opt.rootURL) return

    const tokens = state.tokens
    const imageTokens = getAllImageTokens(tokens)
    for (const imageToken of imageTokens) {
      const source = imageToken.attrGet('src')
      if (source && isRelativePath(source)) {
        imageToken.attrSet('src', `${opt.rootURL}/${source}`)
      }
    }
  })
}
export default MarkdownItAbsolutePath
