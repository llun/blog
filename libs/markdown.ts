import MarkdownIt from 'markdown-it'
import markdownItAnchor from 'markdown-it-anchor'
import markdownItFigures from 'markdown-it-implicit-figures'
import mila from 'markdown-it-link-attributes'

import markdownItAbsolutePath, {
  AbsolutePathConfig
} from './markdownItAbsolutePath'

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
  return md
}
