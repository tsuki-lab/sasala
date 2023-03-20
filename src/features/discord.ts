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
    const body = {
      username: 'Sasala',
      avatar_url:
        'https://media.discordapp.net/attachments/1086331369011032084/1086331435243278336/1_girl_cute_small._smile_white_hair_s-3164388650.png?width=407&height=407',
      // content: embed.description && (await wrapUpOpenAI(embed.description)),
      embeds: [
        {
          title: embed.title,
          url: embed.url,
          timestamp: embed.timestamp,
          color: 197379,
          footer: {
            text: embed.footer?.text,
            icon_url: embed.footer?.icon_url,
          },
          image: {
            url: embed.image?.url,
          },
        },
      ],
    }

    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message. Status: ${response.status}`)
    }
  }
}
