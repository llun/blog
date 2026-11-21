import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFigures from 'markdown-it-implicit-figures'
import mila from 'markdown-it-link-attributes'

import markdownItAbsolutePath, {
  AbsolutePathConfig
} from './markdownItAbsolutePath'

/**
 * The page title is the only h1, so body headings start at h2: when a body
 * uses "#" headings, every heading moves down one level (h1 to h2, h2 to h3,
 * and so on, at most h6) and the outline stays the same.
 */
export const demoteHeadings = (md: InstanceType<typeof MarkdownIt>) => {
  md.core.ruler.push('demote_headings', (state) => {
    const headings = state.tokens.filter(
      (token) => token.type === 'heading_open' || token.type === 'heading_close'
    )
    const top = Math.min(...headings.map((token) => Number(token.tag.slice(1))))
    if (!Number.isFinite(top) || top >= 2) return
    const shift = 2 - top
    for (const token of headings) {
      token.tag = `h${Math.min(6, Number(token.tag.slice(1)) + shift)}`
    }
  })
}

export const getMarkdown = (config: AbsolutePathConfig) => {
  const md = MarkdownIt({
    html: true,
    linkify: true
  })
  md.use(markdownItAnchor, {
    // The "#" is a mouse convenience: hidden from screen readers and skipped
    // by the tab key, so headings are read and reached without it
    permalink: markdownItAnchor.permalink.linkInsideHeader({
      space: true,
      ariaHidden: true,
      renderAttrs: () => ({ tabindex: '-1' })
    })
  })
  md.use(markdownItFigures, {
    figcaption: true
  })
  md.use(mila, {
    pattern: /^https:/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })
  md.use(markdownItAbsolutePath, config)
  md.use(demoteHeadings)
  return md
}
