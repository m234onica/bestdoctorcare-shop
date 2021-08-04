# bestdoctorcare-admin


### ENV
- 在執行前，需先建立 `.env` 
    執行開發環境請建立 `.env.dev`
- 內容參照 `.env.example`
```shell
    # 需設定 dev
    NODE_ENV=
    # 為 `localhost:{{ port }} + /api`
    APP_URL=
    # 連接資料庫路徑
    DATABASE_URL=

    # 網站驗證，若要使用，BASIC_ENABLED 須為 true
    BASIC_ENABLED=
    BASIC_ADMIN=
    BASIC_PASSWORD=

    # 取得 Shopify GraphQL
    SHOPIFY_API_URL=
    SHOPIFY_API_KEY=
    SHOPIFY_ACCESS_TOKEN=

    # 發送 Line 推播
    LINE_ACCESS_TOKEN=
    LINE_CHANNEL_SECRET=

    # 公告圖片上傳至 GCS
    GOOGLE_CLOUD_PROJECT_ID=
    GCLOUD_STORAGE_BUCKET=
```

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
