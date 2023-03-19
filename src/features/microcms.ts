import { env } from '../env.mjs'

type MicroCMSFeed = {
  id: string
  feedUrl: string
  lastFetchedAt?: string
}

export const fetchFeedsURl = async (): Promise<MicroCMSFeed[]> => {
  const response = await fetch(
    `https://${env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/feeds?limit=50`,
    {
      headers: {
        'X-API-KEY': env.MICROCMS_API_KEY,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch feeds. Status: ${response.status}`)
  }

  const { contents } = await response.json()

  return contents
}

export const fetchMeta = async (): Promise<{ feedLastFetchedAt: string }> => {
  const response = await fetch(
    `https://${env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/meta`,
    {
      headers: {
        'X-API-KEY': env.MICROCMS_API_KEY,
      },
    },
  )

  if (!response.ok) {
    throw new Error(`Failed to fetch meta. Status: ${response.status}`)
  }

  const { feedLastFetchedAt } = await response.json()

  return { feedLastFetchedAt }
}

export const patchMetaFeedLastFetchedAt = async (now: string) => {
  await fetch(
    `https://${env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/meta`,
    {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': env.MICROCMS_API_KEY,
      },
      body: JSON.stringify({
        feedLastFetchedAt: now,
      }),
    },
  )
}
