# bestdoctorcare-admin


### ENV
- 在執行前，需先建立 `.env` 
    - 執行開發環境請建立 `.env.dev`
- 內容參照 `.env.example`
    - NODE_ENV 需設定 dev
    - APP_URL 為 `localhost:{{ port }} + /api`
    - DATABASE_URL 連接資料庫路徑

### Build Setup
```bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run dev

# 以下為正式環境使用
# build for production and launch server
$ npm run build
$ npm run start
```

For detailed explanation on how things work, check out [Nuxt.js docs](https://nuxtjs.org).
