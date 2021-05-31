import { Client, middleware } from '@line/bot-sdk'
import axios from 'axios'

export const lineConfig = {
  channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.LINE_CHANNEL_SECRET
}

export const client = new Client(lineConfig)
export const lineMiddleware = middleware(lineConfig)

export async function verifyAccessToken (token) {
  const { data } = await axios.get(`https://api.line.me/oauth2/v2.1/verify?access_token=${token}`)

  if (!data || data?.error) {
    return false
  }

  const profile = await getProfile(token)
  return profile
}

export async function getProfile (token) {
  const { data } = await axios.get('https://api.line.me/v2/profile', {
    headers: {
      Authorization: 'Bearer ' + token
    }
  })

  return data
}
