// Self-check for the dedupe grouping and voting: yarn tsx scripts/birds-dedupe.check.ts
import assert from 'assert'

import { groupPhotos, pickWinner } from './birds-dedupe'

const photo = (id: string, seconds: number, hash: string) => ({
  id,
  url: '',
  createdAt: seconds * 1000,
  width: 1,
  height: 1,
  hash,
  sharpness: 0
})

// a-c drift 4 bits per frame: b joins a, c is 8 from the anchor a so it starts a new group
assert.deepStrictEqual(
  groupPhotos([
    photo('a', 0, '0000000000000000'),
    photo('b', 1, '000000000000000f'),
    photo('c', 2, '00000000000000ff'),
    photo('d', 60, '00000000000000ff')
  ]),
  [['a', 'b'], ['c'], ['d']]
)
assert.strictEqual(pickWinner(['b', 'c', 'c']), 'c')
assert.strictEqual(pickWinner(['a', 'b', 'c']), 'a')
console.log('ok')
