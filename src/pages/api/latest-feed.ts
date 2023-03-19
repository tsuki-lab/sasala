import type { NextApiRequest, NextApiResponse } from 'next/types'
import Parser from 'rss-parser'
import { DiscordEmbed, sendWebhookDiscord } from '@/features/discord'
import {
  fetchFeedsURl,
  fetchMeta,
  patchMetaFeedLastFetchedAt,
} from '@/features/microcms'
import { env } from '/env'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  // POST以外のリクエストは405を返す
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' })
  }

  const apiKey = req.headers['x-api-key']
  // APIキーが一致しない場合は401を返す
  if (apiKey !== env.API_KEY) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  try {
    const parser = new Parser()
    const now = new Date().toISOString()

    // フィードのURLを取得
    const feeds = await fetchFeedsURl()

    // 最終取得日時を取得
    const { feedLastFetchedAt } = await fetchMeta()

    // 並列処理でフィードを取得
    const embeds: DiscordEmbed[] = await Promise.all(
      feeds.map(async (feed) => {
        const feedUrl = feed.feedUrl
        const feedData = await parser.parseURL(feedUrl)
        const feedItems = feedData.items.filter((item) => {
          return (
            item?.isoDate &&
            new Date(item.isoDate).getTime() >
              new Date(feedLastFetchedAt).getTime()
          )
        })

        // フィードのアイテムをDiscordのEmbedに変換
        return feedItems.map(
          (item): DiscordEmbed => ({
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
          }),
        )
      }),
    ).then((embeds) =>
      // タプル配列を1次元配列に変換
      Array.from(
        embeds
          // 1次元配列に変換
          .flat()
          // 日付昇順にソート
          .sort((a, b) => {
            if (a.timestamp && b.timestamp) {
              return (
                new Date(a.timestamp).getTime() -
                new Date(b.timestamp).getTime()
              )
            }
            return 0
          })
          // 重複を削除
          .reduce((map, obj) => map.set(obj.title, obj), new Map())
          // Mapを配列に変換
          .values(),
      ),
    )

    if (embeds.length !== 0) {
      // Discordに通知
      await sendWebhookDiscord(embeds)
    }

    // 最終取得日時を更新
    await patchMetaFeedLastFetchedAt(now)

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
