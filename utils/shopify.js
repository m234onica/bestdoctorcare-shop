import Shopify from 'shopify-api-node'

export default new Shopify({
  shopName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_APP_PASSWORD
})
