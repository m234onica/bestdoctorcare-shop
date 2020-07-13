import shopify from '../../utils/shopify'
import { geteEmailFromUserId } from '../../utils/user'

export default async (req, res) => {
  const lineProfile = req.body.profile

  if (!lineProfile) {
    return res.json({
      status: 'error',
      message: 'No liff account'
    })
  }

  const { userId } = lineProfile

  const { customers } = await shopify.graphql(`
    query ($query: String) {
      customers (first: 1, query: $query) {
        edges {
          node {
            id
            email
            displayName
            firstName
            lastName
            createdAt
            metafield (key: "line_user_id", namespace: "line") {
              value
            }
          }
        }
      }
    }
  `, {
    query: `email:${geteEmailFromUserId(userId)}`
  })

  if (customers.edges[0]) {
    const customer = customers.edges[0].node
    return res.json({
      status: 'ok',
      data: {
        customer
      }
    })
  } else {
    const { customerCreate: { customer, userErrors } } = await shopify.graphql(`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          id
          email
          displayName
          firstName
          lastName
          createdAt
          metafield (key: "line_user_id", namespace: "line") {
            value
          }
        }
        userErrors {
          field
          message
        }
      }
    }
    `, {
      input: {
        firstName: lineProfile.displayName,
        email: geteEmailFromUserId(userId),
        metafields: [
          {
            key: 'line_user_id',
            namespace: 'line',
            value: userId,
            valueType: 'STRING'
          }
        ]
      }
    })

    if (userErrors.length > 0) {
      return res.json({
        status: 'error',
        error: 'Customer creation failed',
        userErrors
      })
    }

    return res.json({
      status: 'ok',
      data: {
        customer
      }
    })
  }
}
