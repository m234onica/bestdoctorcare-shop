import { withSession } from 'next-session'
import shopify from '../../utils/shopify'
import { getLegacyId } from '../../utils/id'

const DraftOrderDetailFragment = `
id
totalPrice
legacyResourceId
status
updatedAt
createdAt
customer {
  id
}
metafields (first: 5) {
  edges {
    node {
      key
      value
    }
  }
}
shippingAddress {
  country
  zip
  address1
  city
  firstName
  province
  phone
}
lineItems (first: 30) {
  edges {
    node {
      id
      product {
        title
      }
      variantTitle
      originalTotal
      discountedTotal
      quantity
    }
  }
}
appliedDiscount {
  amountV2 {
    amount
  }
  title
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

    if (order.customer.id !== user.id) {
      return res.json({
        error: 403
      })
    }

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
      query: `customer_id:${getLegacyId(user.id)}`
    })

    return res.json({
      draftOrders: draftOrders.edges.map(edge => edge.node)
    })
  }
})
