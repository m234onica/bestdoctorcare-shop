import shortId from 'shortid'

import shopify, { customerFragment, findCustomerFromLineUserId } from '../../utils/shopify'
import prisma from '../../utils/prisma'
import { withSession } from '../../utils/session'
import { getEmailFromLineUserId } from '../../utils/user'
import { verifyAccessToken } from '../../utils/line'

export const config = {
  api: {
    externalResolver: true
  }
}

export default withSession(async (req, res) => {
  if (req.session.user) {
    return res.json({
      status: 'ok',
      data: {
        user: req.session.user,
        profile: req.session.profile
      }
    })
  }

  const { accessToken } = req.body
  if (!accessToken) {
    return res.json({
      status: 'error',
      message: 'No accessToken provided'
    })
  }

  const lineProfile = await verifyAccessToken(accessToken)
  if (!lineProfile) {
    return res.json({
      status: 'error',
      message: 'Invalid accessToken provided'
    })
  }

  const { userId } = lineProfile

  const existingUser = await findCustomerFromLineUserId(userId)
  const metafields = existingUser && existingUser.metafields?.edges
  const lineProfileMetafield = metafields && metafields.find(m => m.node.key === 'line_profile')

  if (lineProfileMetafield) {
    req.session.user = existingUser
    req.session.profile = lineProfile

    return res.json({
      status: 'ok',
      data: {
        user: existingUser,
        profile: lineProfile
      }
    })
  } else if (existingUser) {
    // !FIXME: update metafieds
    const { customerUpdate: { customer: user, userErrors } } = await shopify.graphql(`
      mutation customerUpdate($input: CustomerInput!) {
        customerUpdate(input: $input) {
          customer {
            ...customerFields
          }
          userErrors {
            field
            message
          }
        }
      }
      ${customerFragment}
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
    req.session.profile = lineProfile

    return res.json({
      status: 'ok',
      data: {
        user,
        profile: lineProfile
      }
    })
  } else {
    const { customerCreate: { customer: user, userErrors } } = await shopify.graphql(`
    mutation customerCreate($input: CustomerInput!) {
      customerCreate(input: $input) {
        customer {
          ...customerFields
        }
        userErrors {
          field
          message
        }
      }
    }
    ${customerFragment}
    `, {
      input: {
        firstName: lineProfile.displayName,
        email: getEmailFromLineUserId(userId),
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
    await prisma.invitationCode.create({
      data: {
        userId: user.legacyResourceId,
        code: shortId.generate()
      }
    })

    if (userErrors.length > 0) {
      return res.json({
        status: 'error',
        error: 'Customer creation failed',
        userErrors
      })
    }

    req.session.user = user
    req.session.profile = lineProfile

    return res.json({
      status: 'ok',
      data: {
        user,
        profile: lineProfile
      }
    })
  }
})
