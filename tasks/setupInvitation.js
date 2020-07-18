// Setup invitation for existing customers in database
import shortId from 'shortid'
import shopify from '../utils/shopify'
import { getMongoClient } from '../utils/mongodb'

export async function run () {
  const client = await getMongoClient()

  let c
  let customers = []
  for (;;) {
    const { customers: { edges, pageInfo: { hasNextPage } } } = await shopify.graphql(`
    query ($cursor: String) {
      customers (first: 50, after: $cursor, sortKey: UPDATED_AT) {
        pageInfo {
          hasNextPage
          hasPreviousPage
        }
        edges {
          cursor
          node {
            id
            legacyResourceId
          }
        }
      }
    }
  `, {
      cursor: c
    })

    customers = customers.concat(edges)

    if (hasNextPage) {
      c = edges[0].cursor
    } else {
      break
    }
  }

  const InvitationCode = client.db(process.env.MONGODB_DATABASE).collection('InvitationCode')

  for (const customer of customers.map(edge => edge.node)) {
    const codeRecord = await InvitationCode.findOne({
      userId: customer.legacyResourceId
    })

    if (!codeRecord) {
      await InvitationCode.insertOne({
        userId: customer.legacyResourceId,
        code: shortId()
      })
    }
  }
}
