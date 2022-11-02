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
    permalink: markdownItAnchor.permalink.linkInsideHeader({ space: true })
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
