# 百漢中醫 Line 電商網站

[![time tracker](https://wakatime.com/badge/github/Yukaii/bestdoctorcare-shop.svg)](https://wakatime.com/badge/github/Yukaii/bestdoctorcare-shop)

## Development

1. Node.js 環境
1. `npm i -g yarn`
1. `yarn`
1. 設定[環境變數](#Environment-variables)
1. `yarn dev`

## Environment variables

本專案 follow 12-factor 慣例。

參見 [環境變數設定](./docs/environment_variables.md)

## Deployment

- 跑專案：`yarn build && yarn start`
- 十分鐘一次的 cronjob: `yarn checkOrderStatus`
- Database: MySQL -> 設定 `DATABSE_URL`
- `yarn prisma migrate deploy --preview-feature` 跑 migration
  - `ALTER TABLE Session MODIFY data TEXT;` 手動執行這行 SQL，修改 Session#data 的資料庫欄位型別。
  - 為 Prisma ORM 的開發中功能

## Maintenance scripts

- `yarn setupInvitation`: 建立完 DB 後，為既有的 Shopify 使用者建立 invitation code，理論上 production 會在建立使用者時一起建立，這是維護用保持資料一致的用途
- `yarn task:createRichMenu`: 建立 Line Richmenu。
