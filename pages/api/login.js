import { withSession } from 'next-session'
import shortId from 'shortid'

import shopify from '../../utils/shopify'
import { initConnection, InvitationCode } from '../../utils/models'

import { geteEmailFromUserId } from '../../utils/user'

const customerFields = `
id
legacyResourceId
email
displayName
firstName
lastName
createdAt
metafields (first: 10, namespace: "line") {
  edges {
    node {
      key
      value
      valueType
    }
  }
}
`

export default withSession(async (req, res) => {
  if (req.session.user) {
    return res.json({
      status: 'ok',
      data: {
        user: req.session.user
      }
    })
  }

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
            ${customerFields}
          }
        }
      }
    }
  `, {
    query: `email:${geteEmailFromUserId(userId)}`
  })

  const existingUser = customers.edges?.[0]?.node
  const metafields = existingUser && existingUser.metafields?.edges
  const lineProfileMetafield = metafields && metafields.find(m => m.node.key === 'line_profile')

  if (lineProfileMetafield) {
    req.session.user = existingUser

    return res.json({
      status: 'ok',
      data: {
        user: existingUser
      }
    })
  } else if (existingUser) {
    // !FIXME: update metafieds
    const { customerUpdate: { customer: user, userErrors } } = await shopify.graphql(`
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            ${customerFields}
          }
          userErrors {
            field
            message
          }
        }
      }
    `, {
      input: {
        id: existingUser.id,
        metafields: [
          {
            key: 'line_profile',
            namespace: 'line',
            value: JSON.stringify(lineProfile),
            valueType: 'JSON_STRING'
          }
        ]
      }
    })

    if (userErrors.length > 0) {
      return res.json({
        status: 'error',
        error: 'Customer update failed',
        userErrors
      })
    }

    req.session.user = user

    return res.json({
      status: 'ok',
      data: {
        user
      }
    })
  } else {
    const { customerCreate: { customer: user, userErrors } } = await shopify.graphql(`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          ${customerFields}
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
          },
          {
            key: 'line_profile',
            namespace: 'line',
            value: JSON.stringify(lineProfile),
            valueType: 'JSON_STRING'
          }
        ]
      }
    })

    // Create invitation code
    await initConnection()
    await InvitationCode.create({
      userId: user.legacyResourceId,
      code: shortId.generate()
    })

    if (userErrors.length > 0) {
      return res.json({
        status: 'error',
        error: 'Customer creation failed',
        userErrors
      })
    }

    req.session.user = user

    return res.json({
      status: 'ok',
      data: {
        user
      }
    })
  }
})
