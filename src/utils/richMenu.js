import fs from 'fs'
import path from 'path'

import { Client } from '@line/bot-sdk'
import { initEnv } from './index'

async function createRichMenu () {
  initEnv()

  const client = new Client({
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.LINE_CHANNEL_SECRET
  })

  const menu = await client.createRichMenu({
    size: {
      width: 2500,
      height: 1686
    },
    selected: true,
    name: 'menu',
    chatBarText: '選單',
    areas: [
      // first row
      {
        bounds: {
          x: 0,
          y: 0,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '個人資訊',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/orders`
        }
      },
      {
        bounds: {
          x: 834,
          y: 0,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '我要購買',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}`
        }
      },
      {
        bounds: {
          x: 1666,
          y: 0,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '邀請朋友',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_INVITATION_LIFF_ID}`
        }
      },
      // second row
      {
        bounds: {
          x: 0,
          y: 844,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '衛教資訊',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/health`
        }
      },
      {
        bounds: {
          x: 834,
          y: 844,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '公告資訊',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/news`
        }
      },
      {
        bounds: {
          x: 1666,
          y: 844,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '意見回饋',
          uri: `https://liff.line.me/${process.env.NEXT_PUBLIC_LIFF_ID}/feedback`
        }
      }
    ]
  })

  const image = fs.readFileSync(path.join(__dirname, '../../resources/menu.jpg'))
  await client.setRichMenuImage(menu, image)

  await client.setDefaultRichMenu(menu)
}

createRichMenu()
