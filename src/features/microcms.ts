import { env } from '../../env'

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

export const patchFeedsLastFetchedAt = async (
  feeds: MicroCMSFeed[],
  now: string,
) => {
  for (const feed of feeds) {
    await fetch(
      `https://${env.MICROCMS_SERVICE_DOMAIN}.microcms.io/api/v1/feeds/${feed.id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-API-KEY': env.MICROCMS_API_KEY,
        },
        body: JSON.stringify({
          feedUrl: feed.feedUrl,
          lastFetchedAt: now,
        }),
      },
    )
  }
}
