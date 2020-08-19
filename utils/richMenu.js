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
      {
        bounds: {
          x: 0,
          y: 0,
          width: 833,
          height: 843
        },
        action: {
          type: 'uri',
          label: '我要購買',
          uri: 'https://liff.line.me/1654439637-r0vQnP14'
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
          uri: 'https://liff.line.me/1654439637-QlJvLenq'
        }
      }
    ]
  })

  const image = fs.readFileSync(path.join(__dirname, '../resources/main.png'))
  await client.setRichMenuImage(menu, image)

  await client.setDefaultRichMenu(menu)
}

createRichMenu()
