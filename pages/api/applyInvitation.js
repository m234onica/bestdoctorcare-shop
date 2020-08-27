import { applySession } from 'next-session'
import shortId from 'shortid'

import { initConnection, Invitation, InvitationCode } from '../../utils/models'
import shopify from '../../utils/shopify'
import { notifyInvitationComplete } from '../../services/discount'

/**
 * @param {import('next/types').NextApiRequest} req
 * @param {import('next/types').NextApiResponse} res
 */
export default async (req, res) => {
  await applySession(req, res)

  if (!req.session.user) {
    return res.send({
      error: 'User not logined'
    })
  }

  await initConnection()

  const { code } = req.body

  if (!code) {
    return res.send({
      error: 'Invitation code not given'
    })
  }

  const codeRecord = await InvitationCode.findOne({
    code
  })
  if (!codeRecord) {
    return res.send({
      error: 'Invitation code not found'
    })
  }

  const invitedUserId = req.session.user.legacyResourceId

  const invitationRecord = await Invitation.findOne({
    userId: codeRecord.userId,
    invitedUserId
  })

  if (invitedUserId === codeRecord.userId) {
    return res.send({
      error: 'Cannot use invitation code of yourself'
    })
  }

  if (codeRecord && !invitationRecord && invitedUserId !== codeRecord.userId) {
    await Invitation.create({
      userId: codeRecord.userId,
      invitedUserId
    })

    const { priceRuleCreate: { priceRuleDiscountCode, priceRuleUserErrors } } = await shopify.graphql(`
      mutation priceRuleCreate($priceRule: PriceRuleInput!, $priceRuleDiscountCode: PriceRuleDiscountCodeInput!) {
        priceRuleCreate(priceRule: $priceRule, priceRuleDiscountCode: $priceRuleDiscountCode) {
          priceRule {
            id
          }
          priceRuleDiscountCode {
            id
            code
          }
          priceRuleUserErrors {
            code
            field
            message
          }
        }
      }
    `, {
      priceRule: {
        title: '朋友邀請折扣',
        itemEntitlements: {
          targetAllLineItems: true
        },
        validityPeriod: {
          start: new Date()
        },
        allocationMethod: 'EACH',
        oncePerCustomer: true,
        customerSelection: {
          forAllCustomers: false,
          customerIdsToAdd: [
            // TODO: getGraphQLID utility method
            `gid://shopify/Customer/${codeRecord.userId}`,
            req.session.user.id
          ],
          savedSearchIds: []
        },
        target: 'LINE_ITEM',
        value: {
          fixedAmountValue: '-50'
        }
      },
      priceRuleDiscountCode: {
        code: shortId.generate()
      }
    })

    if (priceRuleUserErrors.length > 0) {
      return res.send({
        error: priceRuleUserErrors
      })
    }

    try {
      notifyInvitationComplete(codeRecord.userId, invitedUserId)
    } catch (err) {
      console.error(err)
    }

    return res.send({
      priceRuleDiscountCode
    })
  } else {
    return res.send({
      error: 'invalid invitation code'
    })
  }
}
