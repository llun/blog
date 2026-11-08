'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Media, mergeMediaAssets, proxyAssetsUrl } from '../libs/apple/media'

export const BatchSize = 24

/**
 * Fetches the signed iCloud URLs for an album's medias in batches of
 * `BatchSize`, by position in `medias`. The grid and the viewer share one
 * instance, so a batch either of them loads fills both.
 *
 * URLs are written onto the medias' derivatives (`mergeMediaAssets`), and
 * `version` changes whenever a batch lands so components re-render.
 */
export const useMediaAssets = (
  partition: number,
  token: string,
  medias: Media[]
) => {
  const [version, setVersion] = useState(0)
  const loaded = useRef(new Set<number>())
  const inflight = useRef(new Set<number>())
  // Batches whose URLs were refreshed after an image failed (expired), so a
  // broken image doesn't refetch forever
  const refreshed = useRef(new Set<number>())
  const session = useRef(0)

  // Start over for a different album. The inputs are compared, so an effect
  // that only re-runs (React's dev double mount) doesn't drop a request
  const inputs = useRef({ partition, token, medias })
  useEffect(() => {
    const previous = inputs.current
    if (
      previous.partition === partition &&
      previous.token === token &&
      previous.medias === medias
    ) {
      return
    }
    inputs.current = { partition, token, medias }
    session.current += 1
    loaded.current = new Set()
    inflight.current = new Set()
    refreshed.current = new Set()
    setVersion((value) => value + 1)
  }, [partition, token, medias])

  const loadBatch = useCallback(
    async (batch: number) => {
      if (batch < 0 || batch * BatchSize >= medias.length) return
      if (loaded.current.has(batch) || inflight.current.has(batch)) return
      inflight.current.add(batch)
      const current = session.current
      const slice = medias.slice(batch * BatchSize, (batch + 1) * BatchSize)
      // Google Photos medias come with lasting URLs, nothing to fetch
      if (
        slice.every((media) =>
          Object.values(media.derivatives).every(({ url }) => url)
        )
      ) {
        inflight.current.delete(batch)
        loaded.current.add(batch)
        setVersion((value) => value + 1)
        return
      }
      try {
        const assets = await proxyAssetsUrl(partition, token, slice)
        if (current !== session.current) return
        if (assets) {
          mergeMediaAssets(slice, assets)
          loaded.current.add(batch)
          setVersion((value) => value + 1)
        }
      } catch (error) {
        console.error(error)
      } finally {
        if (current === session.current) inflight.current.delete(batch)
      }
    },
    [partition, token, medias]
  )

  /** Make sure the medias at these positions have URLs. */
  const ensure = useCallback(
    (indices: number[]) => {
      const batches = new Set(
        indices
          .filter((index) => index >= 0 && index < medias.length)
          .map((index) => Math.floor(index / BatchSize))
      )
      for (const batch of batches) loadBatch(batch)
    },
    [medias, loadBatch]
  )

  /**
   * An image at this position failed to load: its signed URL has probably
   * expired, so fetch its batch again, once.
   */
  const refresh = useCallback(
    (index: number) => {
      const batch = Math.floor(index / BatchSize)
      if (refreshed.current.has(batch) || inflight.current.has(batch)) return
      refreshed.current.add(batch)
      loaded.current.delete(batch)
      loadBatch(batch)
    },
    [loadBatch]
  )

  /** Whether the URLs for the media at this position have arrived. */
  const isLoaded = useCallback(
    (index: number) => loaded.current.has(Math.floor(index / BatchSize)),
    []
  )

  return { version, ensure, refresh, isLoaded }
}
