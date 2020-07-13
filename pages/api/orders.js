import { query as q } from 'faunadb'

import shopify from '../../utils/shopify'
import { geteEmailFromUserId } from '../../utils/user'

export default async (req, res) => {
  const { userId } = req.query

  if (!userId) {
    return res.json({
      error: 'userId is not provided'
    })
  }

  const { draftOrders } = await shopify.graphql(`
    query ($query: String){
      draftOrders (first: 20, query: $query) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            shippingAddress {
              address1
            }
            totalPrice
            legacyResourceId
            status
            metafields (first: 5) {
              edges {
                node {
                  key
                  value
                }
              }
            }
          }
        }
      }
    }
  `, {
    query: `email:${geteEmailFromUserId(userId)}`
  })

  return res.json({
    draftOrders: draftOrders.edges.map(edge => edge.node)
  })
}
