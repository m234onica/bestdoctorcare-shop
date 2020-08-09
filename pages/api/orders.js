import { withSession } from 'next-session'
import shopify from '../../utils/shopify'
import { getEmailFromCustomer } from '../../utils/user'

const DraftOrderDetailFragment = `
id
totalPrice
legacyResourceId
status
updatedAt
createdAt
metafields (first: 5) {
  edges {
    node {
      key
      value
    }
  }
}
shippingAddress {
  address1
}
lineItems (first: 30) {
  edges {
    node {
      product {
        title
      }
      variant {
        title
      }
      originalTotal
      quantity
    }
  }
}
appliedDiscount {
  amountV2 {
    amount
  }
  description
}
`

export default withSession(async (req, res) => {
  const { user } = req.session

  if (!user) {
    return res.json({
      error: 'Login required'
    })
  }

  if (req.query.orderId) {
    const draftOrderId = `gid://shopify/DraftOrder/${req.query.orderId}`
    const { draftOrder: order } = await shopify.graphql(`
      query ($draftOrderId: ID!) {
        draftOrder(id: $draftOrderId) {
          ${DraftOrderDetailFragment}
        }
      }
    `, {
      draftOrderId
    })

    return res.json({ order })
  } else {
    const { draftOrders } = await shopify.graphql(`
      query ($query: String) {
        draftOrders (first: 20, query: $query) {
          pageInfo {
            hasNextPage
            hasPreviousPage
          }
          edges {
            cursor
            node {
              id
              totalPrice
              legacyResourceId
              status
              updatedAt
              createdAt
            }
          }
        }
      }
    `, {
      query: `email:${getEmailFromCustomer(user)}`
    })

    return res.json({
      draftOrders: draftOrders.edges.map(edge => edge.node)
    })
  }
})
