import type { NextApiRequest, NextApiResponse } from 'next/types'
import Parser from 'rss-parser'
import { sendWebhookDiscord } from '@/features/discord'
import { fetchFeedsURl, patchFeedsLastFetchedAt } from '@/features/microcms'
import { env } from '/env'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const apiKey = req.headers['x-api-key'] as string | undefined
  if (apiKey !== env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const parser = new Parser()

    const now = new Date().toISOString()
    const feeds = await fetchFeedsURl()

    const embeds = await Promise.all(
      feeds.map(async (feed) => {
        const feedUrl = feed.feedUrl
        const lastFetchedAt = feed.lastFetchedAt ?? now
        const feedData = await parser.parseURL(feedUrl)
        const feedItems = feedData.items.filter((item) => {
          return item?.isoDate && item.isoDate > lastFetchedAt
        })
        return feedItems.map((item) => ({
          title: item.title,
          url: item.link,
          timestamp: item.isoDate,
          color: 197379,
          footer: {
            text: feedData.title,
            icon_url: feedData.image?.url,
          },
          image: {
            url: item.enclosure?.url,
          },
        }))
      }),
    ).then((embeds) =>
      embeds.flat().sort((a, b) => {
        if (a.timestamp && b.timestamp) {
          // 日付昇順
          return (
            new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
          )
        }
        return 0
      }),
    )

    if (embeds.length !== 0) {
      await sendWebhookDiscord(embeds)
    }

    await patchFeedsLastFetchedAt(feeds, now)

    res.status(200).json({ message: 'ok' })
  } catch (error) {
    if (error instanceof Error) {
      console.error(error)

      res.status(500).json({ message: error.message })
    } else {
      console.error(JSON.stringify(error))

      res.status(500).json({ message: 'Internal Server Error' })
    }
  }
}
