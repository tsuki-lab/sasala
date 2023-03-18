import { z } from 'zod'

const environmentSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  DISCORD_WEBHOOK_URL: z.string().url().min(1),
  MICROCMS_API_KEY: z.string().min(1),
  MICROCMS_SERVICE_DOMAIN: z.string().min(1),
  API_KEY: z.string().min(1),
})

type Env = z.infer<typeof environmentSchema>

export const env: Env = environmentSchema.parse(process.env)
