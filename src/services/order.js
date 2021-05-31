import shopify from '../utils/shopify'
import { client } from '../utils/line'
import { getLegacyId, getGraphQLID } from '../utils/id'
import prisma from '../utils/prisma'

export async function upsertDraftOrderRelation (orderId, draftOrderId) {
  const data = {
    orderId,
    draftOrderId
  }

  const record = await prisma.draftOrderRelation.findFirst({ where: data })
  if (!record) {
    await prisma.draftOrderRelation.create({
      data
    })
  }
}

export class DraftOrderCompleteError extends Error {};

export async function completeDraftOrder (draftOrderId, lineUserId, tradeAmount) {
  const { draftOrderComplete: { userErrors, draftOrder } } = await shopify.graphql(`
    mutation draftOrderComplete($id: ID!) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id
          order {
            id
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `, {
    id: getGraphQLID('DraftOrder', draftOrderId)
  })

  if (userErrors.length > 0) {
    throw new DraftOrderCompleteError(JSON.stringify(userErrors))
  }

  await upsertDraftOrderRelation(getLegacyId(draftOrder.order.id), getLegacyId(draftOrderId))

  await client.pushMessage(lineUserId, [{
    type: 'text',
    text: `已收到您付款的 ${tradeAmount} 整`
  }])
}
