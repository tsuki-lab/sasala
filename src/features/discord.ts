import { env } from '../../env'

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
  for (const [i, embed] of Object.entries(embeds)) {
    const response = await fetch(env.DISCORD_WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: 'Sasala',
        avatar_url:
          'https://media.discordapp.net/attachments/1086331369011032084/1086331435243278336/1_girl_cute_small._smile_white_hair_s-3164388650.png?width=407&height=407',
        content:
          i === '0'
            ? 'あ、あの...新しい記事があるんですけど、お暇なときに見てもらえますか？\n'
            : undefined,
        embeds: [embed],
      }),
    })

    if (!response.ok) {
      throw new Error(`Failed to send message. Status: ${response.status}`)
    }
  }
}
