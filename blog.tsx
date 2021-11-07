import fs from 'fs'
import path from 'path'

export function readAllLeafDirectories(root: string) {
  const posts = fs
    .readdirSync(root)
    .filter((name) => name !== '.DS_Store')
    .filter((name) => fs.statSync(path.join(root, name)).isDirectory())
  if (posts.length === 0) {
    return [root]
  }

  const paths = []
  for (const post of posts) {
    paths.push(...readAllLeafDirectories(path.join(root, post)))
  }

  return paths
}

export function getAllPosts() {
  const paths = readAllLeafDirectories(path.join(process.cwd(), 'posts'))
  for (const path of paths) {
    const contents = fs.readdirSync(path)
    console.log(contents)
  }
}
