import { Client, middleware } from '@line/bot-sdk'

export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}

export const client = new Client(lineConfig)
export const lineMiddleware = middleware(lineConfig)
