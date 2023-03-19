import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  // discordのwebhookのURL
  DISCORD_WEBHOOK_URL: z.string().url(),
  // microcmsのAPIキー
  MICROCMS_API_KEY: z.string().min(1),
  // microcmsのサービスドメイン
  MICROCMS_SERVICE_DOMAIN: z.string().min(1),
  // このAPIキーは、APIの認証に使う
  API_KEY: z.string().min(1),
})

/** @typedef {z.input<typeof environmentSchema>} Env */

/** @type {Env} */
let env = process.env

const parsed = environmentSchema.safeParse(process.env)

if (parsed.success === true) {
  env = parsed.data
} else {
  console.error(
    '❌ Invalid environment variables:',
    parsed.error.flatten().fieldErrors,
  )
  throw new Error('Invalid environment variables')
}

export { env }
