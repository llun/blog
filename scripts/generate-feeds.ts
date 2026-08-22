#!/usr/bin/env -S tsx
import 'dotenv-flow/config'

import fs from 'fs/promises'
import path from 'path'

import {
  buildFeeds,
  getAllPosts,
  getConfig,
  postDescendingComparison
} from '../libs/blog'

async function run() {
  const config = getConfig()
  const posts = getAllPosts().sort(postDescendingComparison)
  const { atom, json } = buildFeeds(config, posts)

  const feedsPath = path.join(process.cwd(), 'public', 'feeds')
  await fs.mkdir(feedsPath, { recursive: true })
  await Promise.all([
    fs.writeFile(path.join(feedsPath, 'atom.xml'), atom),
    // Legacy path, still subscribed to externally and served as Atom
    fs.writeFile(path.join(feedsPath, 'main'), atom),
    fs.writeFile(path.join(feedsPath, 'feed.json'), json)
  ])
}

run()
  .then(() => {
    console.log('done')
  })
  .catch((error) => {
    console.error(error)
    process.exitCode = 1
  })
