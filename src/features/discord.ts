import { wrapUpOpenAI } from './openai'
import { env } from '@/env.mjs'

export type DiscordEmbed = {
  title?: string
  description?: string
  url?: string
  timestamp?: string
  color?: number
  footer?: {
    text?: string
    icon_url?: string
  }
  image?: {
    url?: string
  }
  thumbnail?: {
    url?: string
  }
  author?: {
    name?: string
    url?: string
    icon_url?: string
  }
}

export const sendWebhookDiscord = async (embeds: DiscordEmbed[]) => {
  for (let i = 0; i < embeds.length; i++) {
    const embed = embeds[i]
    const content = embed.description && (await wrapUpOpenAI(embed.description))
    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Sasala',
        avatar_url:
          'https://media.discordapp.net/attachments/1086331369011032084/1086331435243278336/1_girl_cute_small._smile_white_hair_s-3164388650.png?width=407&height=407',
        content: content,
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message. Status: ${response.status}`)
    }
  }
}
