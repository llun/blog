const { DateTime } = require('luxon')
const fs = require('fs')
const pluginSyntaxHighlight = require('@11ty/eleventy-plugin-syntaxhighlight')
const markdownIt = require('markdown-it')
const markdownItAnchor = require('markdown-it-anchor')
const implicitFigures = require('markdown-it-implicit-figures')
const mila = require('markdown-it-link-attributes')

module.exports = function(eleventyConfig) {
  eleventyConfig.addPlugin(pluginSyntaxHighlight)
  eleventyConfig.setDataDeepMerge(true)
  eleventyConfig.addLayoutAlias('post', 'layouts/post.njk')

  eleventyConfig.addFilter('readableDate', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('dd LLL yyyy')
  })

  // https://html.spec.whatwg.org/multipage/common-microsyntaxes.html#valid-date-string
  eleventyConfig.addFilter('htmlDateString', dateObj => {
    return DateTime.fromJSDate(dateObj, { zone: 'utc' }).toFormat('yyyy-LL-dd')
  })

  // Get the first `n` elements of a collection.
  eleventyConfig.addFilter('head', (array, n) => {
    if (!array) {
      return []
    }

    if (n < 0) {
      return array.slice(n)
    }

    return array.slice(0, n)
  })

  eleventyConfig.addCollection('tagList', require('./_11ty/getTagList'))

  eleventyConfig.addPassthroughCopy('css')
  eleventyConfig.addPassthroughCopy('img')

  /* Markdown Plugins */
  const md = markdownIt({
    html: true,
    breaks: true
  })
  md.use(markdownItAnchor, {
    permalink: true,
    permalinkClass: 'direct-link',
    permalinkSymbol: '#'
  })
  md.use(implicitFigures, {
    figcaption: true
  })
  md.use(mila, {
    pattern: /^https:/,
    attrs: {
      target: '_blank',
      rel: 'noopener'
    }
  })
  eleventyConfig.setLibrary('md', md)

  eleventyConfig.setBrowserSyncConfig({
    callbacks: {
      ready: function(err, browserSync) {
        const content_404 = fs.readFileSync('_site/404.html')

        browserSync.addMiddleware('*', (req, res) => {
          // Provides the 404 content without redirect.
          res.write(content_404)
          res.end()
        })
      }
    }
  })

  return {
    templateFormats: ['md', 'njk', 'html', 'png', 'jpg', 'webmanifest', 'txt'],

    // If your site lives in a different subdirectory, change this.
    // Leading or trailing slashes are all normalized away, so don’t worry about it.
    // If you don’t have a subdirectory, use "" or "/" (they do the same thing)
    // This is only used for URLs (it does not affect your file structure)
    pathPrefix: '/',

    markdownTemplateEngine: 'liquid',
    htmlTemplateEngine: 'njk',
    dataTemplateEngine: 'njk',
    passthroughFileCopy: true,
    dir: {
      input: '.',
      includes: '_includes',
      data: '_data',
      output: '_site'
    }
  }
}
