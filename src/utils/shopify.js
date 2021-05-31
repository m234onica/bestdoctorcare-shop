import Shopify from 'shopify-api-node'
import { getEmailFromLineUserId } from './user'

const shopify = new Shopify({
  shopName: process.env.NEXT_PUBLIC_SHOPIFY_STORE_NAME,
  apiKey: process.env.SHOPIFY_API_KEY,
  password: process.env.SHOPIFY_APP_PASSWORD
})

shopify.on('callLimits', (limits) => console.log(limits))

export default shopify

export const customerFragment = `
fragment customerFields on Customer {
  id
  legacyResourceId
  email
  displayName
  firstName
  lastName
  createdAt
  defaultAddress {
    zip
    address1
    city
    firstName
    province
    phone
  }
  metafields (first: 10, namespace: "line") {
    edges {
      node {
        key
        value
        valueType
      }
    }
  }
}`

export async function findCustomerFromLineUserId (userId) {
  const { customers } = await shopify.graphql(`
    query ($query: String) {
      customers (first: 1, query: $query) {
        edges {
          node {
            ...customerFields
          }
        }
      }
    }
    ${customerFragment}
    `, {
    query: `email:${getEmailFromLineUserId(userId)}`
  })

  return customers.edges?.[0]?.node
}
