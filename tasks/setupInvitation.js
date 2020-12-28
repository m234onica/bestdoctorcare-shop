// Setup invitation for existing customers in database
import shortId from 'shortid'
import shopify from '../utils/shopify'
import prisma from '../utils/prisma'

export async function run () {
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

  for (const customer of customers.map(edge => edge.node)) {
    const codeRecord = await prisma.invitationCode.findFirst({
      where: {
        userId: customer.legacyResourceId
      }
    })

    if (!codeRecord) {
      await prisma.invitationCode.create({
        data: {
          userId: customer.legacyResourceId,
          code: shortId()
        }
      })
    }
  }
}
